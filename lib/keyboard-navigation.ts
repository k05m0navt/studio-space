// Keyboard navigation utilities for accessibility

export type FocusableElement = HTMLElement & {
  focus(): void;
  blur(): void;
  disabled?: boolean;
  tabIndex?: number;
};

export interface KeyboardNavigationOptions {
  container?: HTMLElement;
  focusableSelector?: string;
  enableArrowKeys?: boolean;
  enableHomeEnd?: boolean;
  enablePageUpDown?: boolean;
  enableTypeAhead?: boolean;
  loop?: boolean;
  skipDisabled?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  onFocusChange?: (element: FocusableElement, index: number) => void;
}

const DEFAULT_FOCUSABLE_SELECTOR = `
  a[href]:not([tabindex="-1"]),
  button:not([disabled]):not([tabindex="-1"]),
  input:not([disabled]):not([tabindex="-1"]),
  select:not([disabled]):not([tabindex="-1"]),
  textarea:not([disabled]):not([tabindex="-1"]),
  [tabindex]:not([tabindex="-1"]),
  [contenteditable="true"]:not([tabindex="-1"]),
  details summary:not([tabindex="-1"])
`.replace(/\s+/g, ' ').trim();

export class KeyboardNavigationManager {
  private container: HTMLElement;
  private options: Required<KeyboardNavigationOptions>;
  private currentIndex: number = -1;
  private focusableElements: FocusableElement[] = [];
  private typeAheadBuffer: string = '';
  private typeAheadTimer: number | null = null;
  private isActive: boolean = false;

  constructor(container: HTMLElement, options: Partial<KeyboardNavigationOptions> = {}) {
    this.container = container;
    this.options = {
      container,
      focusableSelector: DEFAULT_FOCUSABLE_SELECTOR,
      enableArrowKeys: true,
      enableHomeEnd: true,
      enablePageUpDown: false,
      enableTypeAhead: false,
      loop: true,
      skipDisabled: true,
      orientation: 'both',
      onFocusChange: () => {},
      ...options
    };

    this.init();
  }

  private init(): void {
    this.updateFocusableElements();
    this.attachEventListeners();
  }

  private updateFocusableElements(): void {
    const elements = this.container.querySelectorAll(this.options.focusableSelector);
    this.focusableElements = Array.from(elements).filter((el): el is FocusableElement => {
      const element = el as FocusableElement;
      if (this.options.skipDisabled && element.disabled) return false;
      if (element.tabIndex === -1) return false;
      
      // Check if element is visible
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      
      return true;
    });
  }

  private attachEventListeners(): void {
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.container.addEventListener('focusin', this.handleFocusIn.bind(this));
    this.container.addEventListener('focusout', this.handleFocusOut.bind(this));
  }

  private handleFocusIn(event: FocusEvent): void {
    const target = event.target as FocusableElement;
    if (this.focusableElements.includes(target)) {
      this.currentIndex = this.focusableElements.indexOf(target);
      this.isActive = true;
      this.options.onFocusChange(target, this.currentIndex);
    }
  }

  private handleFocusOut(event: FocusEvent): void {
    // Check if focus is moving outside the container
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !this.container.contains(relatedTarget)) {
      this.isActive = false;
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isActive || this.focusableElements.length === 0) return;

    const { key, shiftKey, ctrlKey, metaKey } = event;
    let handled = false;

    // Arrow key navigation
    if (this.options.enableArrowKeys) {
      switch (key) {
        case 'ArrowUp':
          if (this.options.orientation === 'vertical' || this.options.orientation === 'both') {
            this.moveFocus(-1);
            handled = true;
          }
          break;
        case 'ArrowDown':
          if (this.options.orientation === 'vertical' || this.options.orientation === 'both') {
            this.moveFocus(1);
            handled = true;
          }
          break;
        case 'ArrowLeft':
          if (this.options.orientation === 'horizontal' || this.options.orientation === 'both') {
            this.moveFocus(-1);
            handled = true;
          }
          break;
        case 'ArrowRight':
          if (this.options.orientation === 'horizontal' || this.options.orientation === 'both') {
            this.moveFocus(1);
            handled = true;
          }
          break;
      }
    }

    // Home/End navigation
    if (this.options.enableHomeEnd) {
      switch (key) {
        case 'Home':
          this.focusIndex(0);
          handled = true;
          break;
        case 'End':
          this.focusIndex(this.focusableElements.length - 1);
          handled = true;
          break;
      }
    }

    // Page Up/Down navigation
    if (this.options.enablePageUpDown) {
      const pageSize = Math.max(1, Math.floor(this.focusableElements.length / 10));
      switch (key) {
        case 'PageUp':
          this.moveFocus(-pageSize);
          handled = true;
          break;
        case 'PageDown':
          this.moveFocus(pageSize);
          handled = true;
          break;
      }
    }

    // Type-ahead search
    if (this.options.enableTypeAhead && key.length === 1 && !ctrlKey && !metaKey) {
      this.handleTypeAhead(key);
      handled = true;
    }

    // Tab navigation (let browser handle, but track focus)
    if (key === 'Tab') {
      // Browser will handle tab navigation naturally
      return;
    }

    // Escape key to blur current element
    if (key === 'Escape') {
      this.blur();
      handled = true;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private moveFocus(direction: number): void {
    if (this.focusableElements.length === 0) return;

    let newIndex = this.currentIndex + direction;

    if (this.options.loop) {
      if (newIndex < 0) {
        newIndex = this.focusableElements.length - 1;
      } else if (newIndex >= this.focusableElements.length) {
        newIndex = 0;
      }
    } else {
      newIndex = Math.max(0, Math.min(newIndex, this.focusableElements.length - 1));
    }

    this.focusIndex(newIndex);
  }

  private focusIndex(index: number): void {
    if (index < 0 || index >= this.focusableElements.length) return;

    const element = this.focusableElements[index];
    if (element) {
      element.focus();
      this.currentIndex = index;
      this.options.onFocusChange(element, index);
    }
  }

  private handleTypeAhead(char: string): void {
    this.clearTypeAheadTimer();
    this.typeAheadBuffer += char.toLowerCase();

    // Find first match starting from current position
    let matchIndex = -1;
    for (let i = 1; i < this.focusableElements.length; i++) {
      const index = (this.currentIndex + i) % this.focusableElements.length;
      const element = this.focusableElements[index];
      const text = this.getElementText(element).toLowerCase();
      
      if (text.startsWith(this.typeAheadBuffer)) {
        matchIndex = index;
        break;
      }
    }

    if (matchIndex !== -1) {
      this.focusIndex(matchIndex);
    }

    // Clear buffer after delay
    this.typeAheadTimer = window.setTimeout(() => {
      this.typeAheadBuffer = '';
    }, 1000);
  }

  private getElementText(element: HTMLElement): string {
    // Try different text sources
    return (
      element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      element.textContent ||
      (element as any).value ||
      ''
    ).trim();
  }

  private clearTypeAheadTimer(): void {
    if (this.typeAheadTimer) {
      clearTimeout(this.typeAheadTimer);
      this.typeAheadTimer = null;
    }
  }

  // Public API methods
  public focus(index: number = 0): void {
    this.updateFocusableElements();
    this.focusIndex(index);
  }

  public blur(): void {
    if (this.currentIndex >= 0 && this.focusableElements[this.currentIndex]) {
      this.focusableElements[this.currentIndex].blur();
    }
    this.isActive = false;
    this.currentIndex = -1;
  }

  public refresh(): void {
    this.updateFocusableElements();
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getCurrentElement(): FocusableElement | null {
    return this.focusableElements[this.currentIndex] || null;
  }

  public getFocusableElements(): FocusableElement[] {
    return [...this.focusableElements];
  }

  public destroy(): void {
    this.clearTypeAheadTimer();
    this.container.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.container.removeEventListener('focusin', this.handleFocusIn.bind(this));
    this.container.removeEventListener('focusout', this.handleFocusOut.bind(this));
  }
}

// React hook for keyboard navigation
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options: Partial<KeyboardNavigationOptions> = {}
) {
  const managerRef = React.useRef<KeyboardNavigationManager | null>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      managerRef.current = new KeyboardNavigationManager(containerRef.current, options);
    }

    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
        managerRef.current = null;
      }
    };
  }, [containerRef.current]);

  React.useEffect(() => {
    if (managerRef.current) {
      managerRef.current.refresh();
    }
  });

  return {
    focus: (index?: number) => managerRef.current?.focus(index),
    blur: () => managerRef.current?.blur(),
    refresh: () => managerRef.current?.refresh(),
    getCurrentIndex: () => managerRef.current?.getCurrentIndex() ?? -1,
    getCurrentElement: () => managerRef.current?.getCurrentElement(),
    getFocusableElements: () => managerRef.current?.getFocusableElements() ?? []
  };
}

// Utility functions for common keyboard patterns

export function createKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const modifiers = [
      event.ctrlKey && 'ctrl',
      event.altKey && 'alt',
      event.shiftKey && 'shift',
      event.metaKey && 'meta'
    ].filter(Boolean).join('+');

    const shortcutKey = modifiers ? `${modifiers}+${key}` : key;
    
    if (shortcuts[shortcutKey]) {
      event.preventDefault();
      shortcuts[shortcutKey]();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

export function announceLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-9999px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';
  
  document.body.appendChild(liveRegion);
  
  // Add message after a brief delay to ensure screen readers pick it up
  setTimeout(() => {
    liveRegion.textContent = message;
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, 100);
}

// Focus trap for modals
export class FocusTrap {
  private container: HTMLElement;
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;
  private previousActiveElement: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();
    this.activate();
  }

  private updateFocusableElements(): void {
    const focusableElements = this.container.querySelectorAll(DEFAULT_FOCUSABLE_SELECTOR);
    const visibleFocusable = Array.from(focusableElements).filter(el => {
      const element = el as HTMLElement;
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    this.firstFocusable = visibleFocusable[0] as HTMLElement || null;
    this.lastFocusable = visibleFocusable[visibleFocusable.length - 1] as HTMLElement || null;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift+Tab: moving backwards
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  };

  private activate(): void {
    this.container.addEventListener('keydown', this.handleKeyDown);
    this.firstFocusable?.focus();
  }

  public deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    this.previousActiveElement?.focus();
  }
}

export default KeyboardNavigationManager; 