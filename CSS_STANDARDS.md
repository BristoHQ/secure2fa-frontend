# CSS Architecture and Standards

This document outlines the CSS architecture and standards for the Secure2FA project.

## File Structure

```
src/
├── styles/
│   ├── variables.css      # CSS custom properties
│   ├── utilities.css      # Utility classes
│   └── components/        # Component-specific styles
├── index.css             # Global styles and imports
└── App.css              # Main app layout styles
```

## CSS Variables (Design Tokens)

All design tokens are defined in `styles/variables.css` and should be used consistently:

### Colors

- `--primary-color`: Main brand color (#13ac58)
- `--bg-primary`: Main background (#1A1A1A)
- `--bg-secondary`: Secondary background (#212121)
- `--text-primary`: Primary text color (#C7C7C7)
- `--border-color`: Border color (rgba(255, 255, 255, 0.1))

### Spacing

- `--spacing-xs` to `--spacing-2xl`: Consistent spacing scale
- `--sidebar-width`: Sidebar width (250px)
- `--content-padding`: Content padding (30px)

### Typography

- `--font-xs` to `--font-2xl`: Font size scale
- `--font-light` to `--font-bold`: Font weight scale

## Utility Classes

Use utility classes from `styles/utilities.css` for common patterns:

```css
.d-flex          /* display: flex */
/* display: flex */
.justify-center  /* justify-content: center */
.p-3            /* padding: var(--spacing-md) */
.text-primary   /* color: var(--text-primary) */
.rounded; /* border-radius: var(--border-radius) */
```

## Component CSS Standards

1. **Use CSS Variables**: Always use design tokens instead of hardcoded values
2. **Mobile-First**: Write responsive styles with mobile-first approach
3. **BEM Methodology**: Use BEM naming convention for complex components
4. **Transitions**: Use `var(--transition)` for consistent animations
5. **Z-Index Scale**: Use defined z-index variables for layering

### Example Component Structure

```css
/* Component name */
.component-name {
  /* Layout properties */
  display: flex;

  /* Box model */
  padding: var(--spacing-md);
  margin: var(--spacing-sm);

  /* Visual properties */
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);

  /* Typography */
  color: var(--text-primary);
  font-size: var(--font-base);

  /* Transitions */
  transition: var(--transition);
}

/* States */
.component-name:hover {
  background-color: var(--bg-hover);
}

/* Modifiers */
.component-name--large {
  padding: var(--spacing-lg);
}

/* Child elements */
.component-name__element {
  /* Styles for child elements */
}

/* Responsive */
@media (max-width: 768px) {
  .component-name {
    /* Mobile styles */
  }
}
```

## Performance Optimizations

1. **Icon Loading**: Remix icons are preloaded in index.html for better performance
2. **CSS Variables**: Reduce bundle size by using consistent design tokens
3. **Utility Classes**: Reduce CSS duplication with atomic utility classes

## Browser Support

- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+)
- CSS Grid and Flexbox required
- CSS Custom Properties (variables) required

## Best Practices

1. Always use CSS variables for colors, spacing, and typography
2. Use utility classes for simple styling patterns
3. Write mobile-first responsive styles
4. Use semantic class names that describe purpose, not appearance
5. Group CSS properties logically (layout, box model, visual, typography)
6. Add hover states and transitions for interactive elements
7. Use consistent z-index values from the defined scale

## Common Patterns

### Card Component

```css
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  transition: var(--transition);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Button Component

```css
.button {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  border: none;
  background-color: var(--primary-color);
  color: var(--text-white);
  cursor: pointer;
  transition: var(--transition);
}

.button:hover {
  background-color: var(--primary-dark);
}
```

### Form Input

```css
.input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-card);
  color: var(--text-primary);
  transition: var(--transition);
}

.input:focus {
  border-color: var(--primary-color);
  outline: none;
}
```
