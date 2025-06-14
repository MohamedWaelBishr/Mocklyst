# 🎨 Mocklyst Design System

A comprehensive design system for the Mocklyst API mocking platform, built with Next.js, TailwindCSS, shadcn/ui, and modern web standards.

---

## 📋 Table of Contents

1. 🎨 Color Palette
2. 🟦 Border Radius & Shape Tokens
3. 🔤 Typography
4. 📐 Spacing System
5. 🧩 UI Components
6. ⚙️ Design Principles & Theory
7. 🌗 Themes
8. 📁 Architecture & Organization

---

## 🎨 Color Palette

### Primary Color System
The design system uses **OKLCH color space** for precise color definitions and better contrast management.

#### Light Mode Colors
```css
/* Core Colors */
--background: oklch(1 0 0)                 /* Pure white background */
--foreground: oklch(0.145 0 0)             /* Near-black text */
--primary: oklch(0.205 0 0)                /* Dark primary */
--primary-foreground: oklch(0.985 0 0)     /* Light text on primary */

/* Secondary & Accent */
--secondary: oklch(0.97 0 0)               /* Light gray background */
--secondary-foreground: oklch(0.205 0 0)   /* Dark text on secondary */
--accent: oklch(0.97 0 0)                  /* Subtle accent background */
--accent-foreground: oklch(0.205 0 0)      /* Dark text on accent */
--muted: oklch(0.97 0 0)                   /* Muted background */
--muted-foreground: oklch(0.556 0 0)       /* Muted text */

/* Semantic Colors */
--destructive: oklch(0.577 0.245 27.325)   /* Error/danger state */
--border: oklch(0.922 0 0)                 /* Border color */
--input: oklch(0.922 0 0)                  /* Input border */
--ring: oklch(0.708 0 0)                   /* Focus ring */

/* UI Elements */
--card: oklch(1 0 0)                       /* Card background */
--card-foreground: oklch(0.145 0 0)        /* Card text */
--popover: oklch(1 0 0)                    /* Popover background */
--popover-foreground: oklch(0.145 0 0)     /* Popover text */
```

#### Dark Mode Colors
```css
/* Core Colors */
--background: oklch(0.145 0 0)             /* Dark background */
--foreground: oklch(0.985 0 0)             /* Light text */
--primary: oklch(0.75 0.15 240)            /* Blue primary */
--primary-foreground: oklch(0.15 0 0)      /* Dark text on primary */

/* Secondary & Accent */
--secondary: oklch(0.22 0.01 240)          /* Dark blue-gray */
--secondary-foreground: oklch(0.9 0 0)     /* Light text */
--accent: oklch(0.25 0.01 240)             /* Slightly lighter accent */
--accent-foreground: oklch(0.9 0 0)        /* Light text */
--muted: oklch(0.22 0.01 240)              /* Muted dark background */
--muted-foreground: oklch(0.65 0 0)        /* Muted light text */

/* Semantic Colors */
--destructive: oklch(0.7 0.19 22)          /* Red for errors */
--border: oklch(0.3 0.01 240 / 40%)        /* Semi-transparent border */
--input: oklch(0.25 0.01 240)              /* Input background */
--ring: oklch(0.5 0.1 240)                 /* Blue focus ring */

/* UI Elements */
--card: oklch(0.18 0.01 240)               /* Dark card background */
--card-foreground: oklch(0.95 0 0)         /* Light card text */
--popover: oklch(0.18 0.01 240)            /* Dark popover */
--popover-foreground: oklch(0.95 0 0)      /* Light popover text */
```

#### Chart & Data Visualization Colors
```css
/* Chart Color Palette - Light Mode */
--chart-1: oklch(0.646 0.222 41.116)      /* Orange */
--chart-2: oklch(0.6 0.118 184.704)       /* Teal */
--chart-3: oklch(0.398 0.07 227.392)      /* Blue */
--chart-4: oklch(0.828 0.189 84.429)      /* Yellow-green */
--chart-5: oklch(0.769 0.188 70.08)       /* Green */

/* Chart Color Palette - Dark Mode */
--chart-1: oklch(0.488 0.243 264.376)     /* Purple-blue */
--chart-2: oklch(0.696 0.17 162.48)       /* Teal */
--chart-3: oklch(0.769 0.188 70.08)       /* Green */
--chart-4: oklch(0.627 0.265 303.9)       /* Magenta */
--chart-5: oklch(0.645 0.246 16.439)      /* Orange-red */
```

#### Brand Gradient Colors
```css
/* Primary Gradients */
bg-gradient-to-r from-blue-600 to-purple-600      /* Main brand gradient */
bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600  /* Extended gradient */
```

### Usage Guidelines

| Color Token | Usage | Light Mode | Dark Mode |
|-------------|-------|------------|-----------|
| `background` | Page/app background | White | Dark slate |
| `foreground` | Primary text | Near black | Light gray |
| `primary` | CTA buttons, links | Dark | Blue |
| `muted` | Secondary backgrounds | Light gray | Dark blue-gray |
| `destructive` | Errors, warnings | Red-orange | Bright red |
| `border` | Dividers, outlines | Light gray | Semi-transparent |

---

## 🟦 Border Radius & Shape Tokens

### Radius Scale
```css
/* Base radius: 0.625rem (10px) */
--radius: 0.625rem;

/* Calculated variants */
--radius-sm: calc(var(--radius) - 4px)     /* 6px - Small elements */
--radius-md: calc(var(--radius) - 2px)     /* 8px - Default elements */
--radius-lg: var(--radius)                 /* 10px - Large elements */
--radius-xl: calc(var(--radius) + 4px)     /* 14px - Extra large */
```

### Tailwind Border Radius Classes
```css
rounded-sm     /* 6px - Pills, badges */
rounded-md     /* 8px - Buttons, inputs */
rounded-lg     /* 10px - Cards, modals */
rounded-xl     /* 14px - Large cards */
rounded-2xl    /* 18px - Hero sections */
rounded-3xl    /* 24px - Major containers */
rounded-full   /* 50% - Circular elements */
```

### Component Applications

| Component | Radius | Usage |
|-----------|--------|-------|
| Buttons | `rounded-md` | Standard interactive elements |
| Input fields | `rounded-lg` | Form inputs, textareas |
| Cards | `rounded-xl` | Content containers |
| Modals/Dialogs | `rounded-lg` | Overlay components |
| Badges | `rounded-md` | Status indicators |
| Avatars | `rounded-full` | Profile images |
| Code blocks | `rounded-lg` | Monaco editor containers |

---

## 🔤 Typography

### Font Families
```css
/* Sans-serif (Primary) */
--font-geist-sans: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (Code) */
--font-geist-mono: 'Geist Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;

/* Monaco Editor */
font-family: 'Consolas', 'Courier New', monospace;
```

### Typography Scale

#### Headings
```css
/* Heading 1 - Hero titles */
text-3xl sm:text-4xl lg:text-5xl font-bold
/* 30px mobile, 36px tablet, 48px desktop */

/* Heading 2 - Section titles */
text-2xl sm:text-3xl lg:text-4xl font-bold
/* 24px mobile, 30px tablet, 36px desktop */

/* Heading 3 - Subsection titles */
text-xl font-bold
/* 20px all devices */

/* Heading 4 - Component titles */
text-lg font-semibold
/* 18px all devices */
```

#### Body Text
```css
/* Large body text */
text-lg                    /* 18px - Hero descriptions */

/* Regular body text */
text-base                  /* 16px - Default paragraph text */

/* Small body text */
text-sm                    /* 14px - Secondary information */

/* Extra small text */
text-xs                    /* 12px - Captions, footnotes */
```

#### Font Weights
```css
font-normal               /* 400 - Regular text */
font-medium               /* 500 - Emphasized text */
font-semibold             /* 600 - Subheadings */
font-bold                 /* 700 - Headings */
```

#### Line Heights
```css
leading-tight             /* 1.25 - Headings */
leading-normal            /* 1.5 - Body text */
leading-relaxed           /* 1.625 - Long-form content */
```

### Usage Examples

| Context | Classes | Usage |
|---------|---------|-------|
| Hero headline | `text-3xl sm:text-4xl lg:text-5xl font-bold` | Main page title |
| Section title | `text-2xl font-bold` | Feature section headers |
| Card title | `text-lg font-semibold` | Component titles |
| Body text | `text-base` | Paragraph content |
| Button text | `text-sm font-medium` | Interactive elements |
| Caption | `text-xs text-muted-foreground` | Helper text |

---

## 📐 Spacing System

### Base Unit: 4px Grid System
The design system follows a **4px base unit** for consistent spacing and vertical rhythm.

### Spacing Scale
```css
/* Tailwind spacing classes (rem values) */
gap-1, p-1, m-1          /* 4px */
gap-2, p-2, m-2          /* 8px */
gap-3, p-3, m-3          /* 12px */
gap-4, p-4, m-4          /* 16px */
gap-6, p-6, m-6          /* 24px */
gap-8, p-8, m-8          /* 32px */
gap-12, p-12, m-12       /* 48px */
gap-16, p-16, m-16       /* 64px */
gap-20, p-20, m-20       /* 80px */
gap-24, p-24, m-24       /* 96px */
```

### Component Spacing Patterns

#### Cards
```css
/* Card container */
py-6                     /* 24px vertical padding */
px-6                     /* 24px horizontal padding */
gap-6                    /* 24px internal spacing */

/* Card sections */
space-y-4                /* 16px between elements */
gap-3                    /* 12px for related items */
```

#### Buttons
```css
/* Default button */
h-9 px-4 py-2            /* 36px height, 16px horizontal, 8px vertical */

/* Small button */
h-8 px-3                 /* 32px height, 12px horizontal */

/* Large button */
h-10 px-6                /* 40px height, 24px horizontal */
```

#### Layout Sections
```css
/* Section spacing */
py-16                    /* 64px - Desktop sections */
py-12                    /* 48px - Mobile sections */

/* Container spacing */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
/* Responsive container with consistent padding */
```

#### Grid Systems
```css
/* Feature grids */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
/* Responsive grid with 32px gaps */

/* Dashboard layouts */
grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12
/* Two-column layout with larger gaps on desktop */
```

### Responsive Spacing
```css
/* Mobile-first responsive spacing */
space-y-4 md:space-y-6         /* 16px mobile, 24px desktop */
gap-4 sm:gap-6 lg:gap-8        /* Progressive gap increase */
px-4 sm:px-6 lg:px-8           /* Responsive horizontal padding */
```

---

## 🧩 UI Components

### Button System

#### Variants
```tsx
// Primary button (default)
<Button variant="default">Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Outline button
<Button variant="outline">Outline Style</Button>

// Ghost button
<Button variant="ghost">Subtle Action</Button>

// Destructive button
<Button variant="destructive">Delete Action</Button>

// Link-style button
<Button variant="link">Link Style</Button>
```

#### Sizes
```tsx
// Small button
<Button size="sm">Small</Button>

// Default button
<Button size="default">Default</Button>

// Large button
<Button size="lg">Large</Button>

// Icon-only button
<Button size="icon"><Icon /></Button>
```

#### States
- **Default**: Normal interactive state
- **Hover**: Subtle background/color changes
- **Focus**: Ring outline for keyboard navigation
- **Disabled**: Reduced opacity, no interaction
- **Loading**: With spinner animation

### Card System

#### Basic Card Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

#### Card Variants
- **Default**: Standard card with border and shadow
- **Glass**: Backdrop blur with transparency
- **Hover Effect**: 3D transform on hover (CardHoverEffect)
- **Gradient Border**: Animated gradient borders

### Form Components

#### Input Fields
```tsx
// Standard input
<Input placeholder="Enter text" />

// With label
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// With error state
<Input aria-invalid className="border-destructive" />
```

#### Select Components
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Data Display

#### Tables
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Badges
```tsx
// Default badge
<Badge>Default</Badge>

// Secondary badge
<Badge variant="secondary">Secondary</Badge>

// Destructive badge
<Badge variant="destructive">Error</Badge>

// Outline badge
<Badge variant="outline">Outline</Badge>
```

### Navigation Components

#### Header Navigation
- **Logo**: Brand identifier with gradient effect
- **Navigation Links**: Horizontal list with hover states
- **Theme Toggle**: Dark/light mode switcher
- **User Menu**: Avatar with dropdown
- **Mobile Menu**: Hamburger with slide-out panel

#### Footer Structure
- **Brand Section**: Logo and description
- **Link Sections**: Organized by category
- **Social Links**: Icon buttons with hover effects
- **Copyright**: Legal information and version

### Interactive Elements

#### Animated Components
```tsx
// Animated button with moving border
<AnimatedButton movingBorder duration={3000}>
  Click me
</AnimatedButton>

// Text animation effects
<TextGenerateEffect words="Animated text reveal" />
<FlipWords words={["Create", "Mock", "Test"]} />

// Background effects
<Boxes className="absolute inset-0" />
<Spotlight className="absolute top-0" />
```

### Loading States

#### Skeleton Components
- **Text skeletons**: For loading text content
- **Card skeletons**: For loading card layouts
- **Table skeletons**: For loading data tables

#### Progress Indicators
- **Spinner**: Circular loading animation
- **Progress bar**: Linear progress indication
- **Pulse effects**: Subtle loading states

### Feedback Components

#### Alerts & Notifications
```tsx
// Toast notifications (Sonner)
<Toaster />

// Alert dialogs
<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## ⚙️ Design Principles & Theory

### Spacing Logic
- **4px Grid System**: All spacing uses multiples of 4px for visual harmony
- **Progressive Scaling**: Spacing increases progressively (4, 8, 12, 16, 24, 32, 48, 64)
- **Contextual Spacing**: Dense spacing for related elements, generous spacing for sections

### Responsive Behavior

#### Breakpoints
```css
/* Mobile-first breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1400px  /* Container max-width */
```

#### Layout Patterns
- **Mobile**: Single column, compact spacing
- **Tablet**: Two-column grids, medium spacing
- **Desktop**: Multi-column layouts, generous spacing

### Component Structure Philosophy

#### Composition over Inheritance
```tsx
// Composable components
<Card>
  <CardHeader>
    <div className="flex items-center gap-3">
      <Icon />
      <CardTitle>Title</CardTitle>
    </div>
  </CardHeader>
</Card>
```

#### Atomic Design Principles
1. **Atoms**: Basic elements (Button, Input, Label)
2. **Molecules**: Simple compositions (Search form, Card header)
3. **Organisms**: Complex components (Navigation, Dashboard)
4. **Templates**: Page layouts
5. **Pages**: Specific instances

### Naming Conventions

#### CSS Classes (Tailwind)
- **Utility-first**: Use Tailwind utilities for styling
- **Component classes**: `data-slot` attributes for identification
- **State classes**: `aria-invalid`, `data-state` for dynamic states

#### Component Props
- **Variant system**: Consistent variant prop patterns
- **Size system**: sm, md, lg, xl sizing options
- **Boolean flags**: `asChild`, `isLoading`, `disabled`

### Animation & Motion

#### Performance Principles
- **GPU Acceleration**: Use `transform` and `opacity` for animations
- **Reduced Motion**: Respect `prefers-reduced-motion`
- **60fps Target**: Smooth animations without jank

#### Motion Patterns
```tsx
// Framer Motion patterns
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Accessibility Standards

#### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators

#### Implementation
```css
/* Focus styles */
:focus-visible {
  @apply outline-2 outline-offset-2 outline-blue-500;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🌗 Themes

### Theme Implementation Strategy
The design system uses **CSS custom properties** combined with TailwindCSS classes for theming.

#### Theme Provider
```tsx
<ThemeProvider defaultTheme="system">
  {/* App content */}
</ThemeProvider>
```

#### Dark Mode Activation
```css
.dark {
  /* Dark mode color overrides */
}
```

### Light vs Dark Mode Differences

#### Visual Approach
- **Light Mode**: Clean, minimal, high contrast
- **Dark Mode**: Rich blues, reduced eye strain, modern aesthetic

#### Color Strategy
- **Light Mode**: Gray-scale with black text on white backgrounds
- **Dark Mode**: Blue-tinted grays with color accents

#### Component Adaptations
```tsx
// Context-aware styling
className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"

// Conditional rendering for theme-specific elements
{theme === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
```

### Theme Toggle Implementation
```tsx
<ThemeToggle>
  {/* Smooth transition between light/dark states */}
</ThemeToggle>
```

### Custom Properties Strategy
```css
/* Root variables that change with theme */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

---

## 📁 Architecture & Organization

### Project Structure
```
src/
├── app/                      # Next.js app router
├── components/               # React components
│   ├── ui/                  # Base UI components (shadcn/ui)
│   ├── layout/              # Layout components
│   ├── landing/             # Landing page sections
│   ├── dashboard/           # Dashboard-specific components
│   └── auth/                # Authentication components
├── lib/                     # Utilities and configuration
│   ├── utils.ts            # Utility functions
│   ├── supabase.ts         # Database client
│   └── stores/             # State management
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
└── styles/
    └── globals.css         # Global styles and CSS variables
```

### Component Organization Philosophy

#### shadcn/ui Base Components (`/ui`)
- **Pure UI primitives**: Button, Input, Card, etc.
- **No business logic**: Only styling and basic interaction
- **Highly reusable**: Used across different features

#### Feature Components
- **Domain-specific**: Dashboard, Landing, Auth
- **Composed from UI primitives**: Building complex interfaces
- **Business logic integration**: Connected to state and APIs

#### Layout Components
- **Structural**: Header, Footer, Navigation
- **Global scope**: Used across all pages
- **Theme-aware**: Support light/dark modes

### Design Token Storage
```css
/* CSS Custom Properties in globals.css */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  /* ... additional tokens */
}
```

### Component Documentation
Each component includes:
- **TypeScript interfaces**: Clear prop definitions
- **JSDoc comments**: Usage examples and descriptions
- **Storybook entries**: Visual documentation (future)
- **Test coverage**: Unit and integration tests

### Style Guide Enforcement
- **ESLint rules**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **TypeScript**: Type safety and IntelliSense
- **Tailwind classes**: Utility-first styling approach

### Performance Considerations
- **Code splitting**: Dynamic imports for heavy components
- **Tree shaking**: Optimized bundle sizes
- **Component memoization**: React.memo for expensive renders
- **CSS optimization**: PurgeCSS via Tailwind

---

## 🎯 Usage Guidelines

### Getting Started
1. **Install dependencies**: `npm install`
2. **Run development server**: `npm run dev`
3. **Import components**: Use absolute imports from `@/components`
4. **Apply themes**: Wrap app in ThemeProvider
5. **Use design tokens**: Reference CSS custom properties

### Best Practices
- **Consistent spacing**: Use the 4px grid system
- **Accessible colors**: Ensure proper contrast ratios
- **Responsive design**: Mobile-first approach
- **Component composition**: Build complex UIs from simple parts
- **Performance**: Optimize animations and interactions

### Component Creation Checklist
- [ ] TypeScript interfaces defined
- [ ] Accessibility attributes included
- [ ] Dark mode support implemented
- [ ] Responsive behavior tested
- [ ] Performance optimized
- [ ] Documentation updated

---

*This design system serves as the foundation for building consistent, accessible, and maintainable user interfaces across the Mocklyst platform. For questions or contributions, please refer to the project documentation or reach out to the development team.*
