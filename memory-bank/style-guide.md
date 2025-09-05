# Studio Space Design System & Style Guide

## 🎨 Design Philosophy

**Studio Space** follows **Material Design 3** principles with a distinctive **Black, Yellow, White** theme, emphasizing:

- **Professional Elegance**: Clean, sophisticated interfaces for studio/coworking management
- **High Contrast**: Excellent readability with strong color contrasts
- **Modern Minimalism**: Uncluttered layouts with purposeful design elements
- **Accessibility First**: WCAG AA compliance with strong contrast ratios
- **Component Consistency**: Reusable design patterns across all interfaces

## 🌈 Color Palette

### Primary Colors (Yellow Accent)
```css
--primary: oklch(74% 0.18 85)                    /* #F7D51D - Vibrant yellow */
--primary-foreground: oklch(10% 0 0)             /* #1A1A1A - Black text on yellow */
--primary-container: oklch(94% 0.08 85)          /* #FEF7D3 - Light yellow container */
--primary-container-foreground: oklch(20% 0.05 85) /* #2D2A1A - Dark yellow text */
```

### Secondary Colors (Black/Gray Scale)
```css
--secondary: oklch(25% 0 0)                      /* #404040 - Dark gray */
--secondary-foreground: oklch(95% 0 0)           /* #F2F2F2 - White text */
--secondary-container: oklch(90% 0 0)            /* #E6E6E6 - Light gray container */
--secondary-container-foreground: oklch(15% 0 0) /* #262626 - Dark text */
```

### Surface Colors
```css
--background: oklch(99% 0 0)                     /* #FEFEFE - Near white */
--foreground: oklch(10% 0 0)                     /* #1A1A1A - Near black */
--surface: oklch(98% 0 0)                        /* #FAFAFA - Surface */
--surface-container: oklch(94% 0 0)              /* #F0F0F0 - Card backgrounds */
```

### Status Colors
```css
--success: oklch(65% 0.15 145)                   /* #22C55E - Green */
--warning: oklch(75% 0.15 65)                    /* #F59E0B - Orange */
--error: oklch(65% 0.20 25)                      /* #EF4444 - Red */
```

### Neutral Colors
```css
--muted: oklch(85% 0 0)                          /* #D9D9D9 - Muted backgrounds */
--muted-foreground: oklch(45% 0 0)               /* #737373 - Muted text */
--border: oklch(80% 0 0)                         /* #CCCCCC - Borders */
```

## 📝 Typography

### Font Families
- **Primary**: `Geist Sans` - Modern, clean sans-serif for UI text
- **Monospace**: `Geist Mono` - For code, data, and technical content

### Text Hierarchy
```css
/* Headings */
.text-4xl    /* 36px - Page titles */
.text-3xl    /* 30px - Section headers */
.text-2xl    /* 24px - Subsection headers */
.text-xl     /* 20px - Card titles */
.text-lg     /* 18px - Prominent text */

/* Body Text */
.text-base   /* 16px - Primary body text */
.text-sm     /* 14px - Secondary text, labels */
.text-xs     /* 12px - Captions, metadata */
```

### Font Weights
- **font-light** (300) - Minimal use, large headings
- **font-normal** (400) - Body text, descriptions
- **font-medium** (500) - Labels, nav items
- **font-semibold** (600) - Card titles, emphasized text
- **font-bold** (700) - Section headers, primary CTAs

## 🔄 Spacing & Layout

### Spacing Scale (Tailwind)
```css
--radius-sm: 8px      /* Small components */
--radius-md: 12px     /* Default radius */
--radius-lg: 16px     /* Cards, containers */
--radius-xl: 20px     /* Large containers */
--radius-xxl: 28px    /* Hero sections */
```

### Grid & Layout
- **Container max-width**: `max-w-7xl` (1280px)
- **Section padding**: `py-20 md:py-24` (vertical)
- **Container padding**: `px-4 md:px-6` (horizontal)
- **Card padding**: `p-6` to `p-8` depending on size
- **Component gaps**: `gap-4`, `gap-6`, `gap-8` for consistent spacing

## 🧩 Component Patterns

### Buttons
```typescript
// Primary CTA
<Button size="lg" className="h-12 px-8 text-base font-semibold">
  Primary Action
</Button>

// Secondary Actions
<Button variant="outline" size="default">
  Secondary Action
</Button>

// Destructive Actions
<Button variant="destructive">
  Delete
</Button>

// Icon Buttons
<Button variant="ghost" size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

### Cards
```typescript
// Standard Card Pattern
<Card className="h-full">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold">Title</CardTitle>
  </CardHeader>
  <CardContent className="pt-0">
    Content
  </CardContent>
</Card>

// Admin Dashboard Cards
<Card className="group hover:shadow-lg transition-shadow">
  <CardContent className="p-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Status Indicators
```typescript
// Status Badges
<Badge variant="default">Enabled</Badge>      // Success/Active
<Badge variant="secondary">Disabled</Badge>   // Inactive
<Badge variant="destructive">Error</Badge>    // Problems

// Toggle States
<Button
  variant={enabled ? "default" : "outline"}
  className={cn(
    "transition-all",
    enabled && "bg-primary text-primary-foreground"
  )}
>
  {enabled ? "Enabled" : "Disabled"}
</Button>
```

### Form Elements
```typescript
// Labels
<Label className="text-sm font-medium text-foreground">
  Field Label
</Label>

// Inputs
<Input 
  className="h-10 border-border focus:border-primary focus:ring-primary/20"
  placeholder="Enter value..."
/>

// Select Components
<Select>
  <SelectTrigger className="h-10">
    <SelectValue placeholder="Choose option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

## 🎭 Animation & Motion

### Framer Motion Patterns
```typescript
// Page/Section Entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// Hover Animations
<motion.div
  whileHover={{ y: -2, scale: 1.02 }}
  transition={{ duration: 0.2 }}
>

// Stagger Children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
```

### CSS Transitions
- **Hover states**: `transition-all duration-200`
- **Focus states**: `transition-colors duration-150`
- **Layout shifts**: `transition-transform duration-300`

## 🎯 Icons & Imagery

### Icon System
- **Library**: Lucide React
- **Sizes**: `h-4 w-4` (small), `h-5 w-5` (default), `h-6 w-6` (large)
- **Colors**: Use semantic color classes (`text-primary`, `text-muted-foreground`)

### Common Icons
- **Settings**: `Settings`, `Cog`, `Sliders`
- **Status**: `CheckCircle`, `XCircle`, `AlertCircle`
- **Actions**: `Edit`, `Trash2`, `Plus`, `Eye`
- **Navigation**: `ChevronRight`, `ArrowLeft`, `Menu`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Single column, full-width cards
- **Tablet**: `768px - 1024px` - Two-column grids
- **Desktop**: `> 1024px` - Multi-column layouts, sidebar navigation

### Responsive Patterns
```css
/* Mobile-first approach */
.grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Text scaling */
.text-4xl sm:text-5xl md:text-6xl lg:text-7xl

/* Spacing adjustments */
.py-16 md:py-20 lg:py-24
```

## ♿ Accessibility Guidelines

### Color Contrast
- **Normal text**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio  
- **UI components**: Minimum 3:1 ratio

### Keyboard Navigation
- **Focus indicators**: Visible ring with `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **Tab order**: Logical sequence through interactive elements
- **Skip links**: For main content areas

### ARIA Support
- **Labels**: All form controls have accessible names
- **Descriptions**: Complex components include descriptions
- **States**: Dynamic content changes are announced

## 🎨 Usage Guidelines

### Do's ✅
- Use the established color palette consistently
- Maintain proper spacing ratios
- Follow component patterns for similar functionality
- Ensure sufficient color contrast
- Use semantic HTML elements

### Don'ts ❌
- Don't introduce new colors outside the palette
- Don't mix different border radius values randomly
- Don't use custom fonts beyond Geist Sans/Mono
- Don't ignore responsive design principles
- Don't skip accessibility considerations

## 🔧 Implementation Notes

### CSS Custom Properties
All colors are defined as CSS custom properties in `app/[locale]/globals.css` using the OKLCH color space for better color consistency and manipulation.

### Component Library
Built on **Shadcn/ui** with **Radix UI** primitives, providing:
- Consistent API patterns
- Built-in accessibility features
- Customizable styling via CSS variables
- TypeScript support

### Build Tools
- **Tailwind CSS**: Utility-first styling
- **CVA**: Component variant management  
- **CN utility**: Conditional class merging
- **Framer Motion**: Animation library

---

*This style guide reflects the current Studio Space design system as of 2025. Update this document when introducing new patterns or making significant design changes.*
