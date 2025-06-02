"use client";

import { useEffect } from 'react';

// Analytics events
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

// User interaction events
export const trackingEvents = {
  // Page events
  pageView: (page: string, title?: string) => ({
    name: 'page_view',
    properties: { page, title, url: window.location.href }
  }),
  
  // Booking events
  bookingStarted: (type: 'studio' | 'coworking') => ({
    name: 'booking_started',
    properties: { type }
  }),
  
  bookingStepCompleted: (step: number, stepName: string) => ({
    name: 'booking_step_completed',
    properties: { step, stepName }
  }),
  
  bookingSubmitted: (type: string, date: string) => ({
    name: 'booking_submitted',
    properties: { type, date }
  }),
  
  bookingAbandoned: (step: number, reason?: string) => ({
    name: 'booking_abandoned',
    properties: { step, reason }
  }),
  
  // User engagement
  buttonClick: (buttonName: string, location: string) => ({
    name: 'button_click',
    properties: { buttonName, location }
  }),
  
  formFieldFocus: (fieldName: string, formName: string) => ({
    name: 'form_field_focus',
    properties: { fieldName, formName }
  }),
  
  searchPerformed: (query: string, category?: string) => ({
    name: 'search_performed',
    properties: { query, category }
  }),
  
  // Performance events
  performanceMetric: (metric: string, value: number, unit: string) => ({
    name: 'performance_metric',
    properties: { metric, value, unit }
  }),
  
  // Error tracking
  error: (errorMessage: string, stack?: string, page?: string) => ({
    name: 'error',
    properties: { errorMessage, stack, page }
  }),
} as const;

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
    
    if (this.isEnabled) {
      this.initializeSession();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession() {
    // Track session start
    this.track({
      name: 'session_started',
      properties: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    });

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.track({
        name: 'session_ended',
        properties: {
          duration: Date.now() - parseInt(this.sessionId.split('_')[1])
        }
      });
      this.flush();
    });

    // Track performance metrics
    this.trackPerformanceMetrics();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const enrichedEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      properties: {
        ...event.properties,
        page: window.location.pathname,
        referrer: document.referrer,
      }
    };

    this.queue.push(enrichedEvent);

    // Auto-flush queue when it gets large
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Re-queue events on failure
      this.queue.unshift(...events);
    }
  }

  private trackPerformanceMetrics() {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => this.track(trackingEvents.performanceMetric('CLS', metric.value, 'score')));
        onFID((metric) => this.track(trackingEvents.performanceMetric('FID', metric.value, 'ms')));
        onFCP((metric) => this.track(trackingEvents.performanceMetric('FCP', metric.value, 'ms')));
        onLCP((metric) => this.track(trackingEvents.performanceMetric('LCP', metric.value, 'ms')));
        onTTFB((metric) => this.track(trackingEvents.performanceMetric('TTFB', metric.value, 'ms')));
      });
    }

    // Track page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.track(trackingEvents.performanceMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, 'ms'));
    });
  }

  // Track scroll depth
  trackScrollDepth() {
    let maxScroll = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.track({
          name: 'scroll_depth',
          properties: { maxScrollPercent: maxScroll, currentScrollPercent: scrollPercent }
        });
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }

  // Track time on page
  trackTimeOnPage() {
    const startTime = Date.now();
    
    return () => {
      const timeOnPage = Date.now() - startTime;
      this.track({
        name: 'time_on_page',
        properties: { timeOnPage, page: window.location.pathname }
      });
    };
  }
}

// Singleton instance
const analytics = new Analytics();

// React hooks for analytics
export function useAnalytics() {
  useEffect(() => {
    // Auto-flush on interval
    const interval = setInterval(() => analytics.flush(), 30000);
    return () => clearInterval(interval);
  }, []);

  return analytics;
}

export function usePageTracking(pageName: string, title?: string) {
  useEffect(() => {
    analytics.track(trackingEvents.pageView(pageName, title));
  }, [pageName, title]);
}

export function useScrollTracking() {
  useEffect(() => {
    return analytics.trackScrollDepth();
  }, []);
}

export function useTimeTracking() {
  useEffect(() => {
    return analytics.trackTimeOnPage();
  }, []);
}

// Error boundary for analytics
export function trackError(error: Error, errorInfo?: any) {
  analytics.track(trackingEvents.error(
    error.message,
    error.stack,
    window.location.pathname
  ));
}

export { analytics };
export default analytics; 