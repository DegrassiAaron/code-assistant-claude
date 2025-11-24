# Accessibility Checklist

Ensure WCAG 2.1 AA compliance for all frontend components.

## Color and Contrast

### Text Contrast
- [ ] Normal text (< 18pt): Contrast ratio ≥ 4.5:1
- [ ] Large text (≥ 18pt or 14pt bold): Contrast ratio ≥ 3:1
- [ ] UI components and graphics: Contrast ratio ≥ 3:1
- [ ] Test contrast using tools: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Color Usage
- [ ] Don't rely on color alone to convey information
- [ ] Provide additional indicators (icons, text, patterns)
- [ ] Ensure links are distinguishable from regular text (underline, icon, etc.)

**Example**:
```tsx
// ❌ Bad: Color only for status
<span className="text-green-600">Success</span>

// ✅ Good: Color + icon + text
<span className="text-green-600 flex items-center gap-2">
  <CheckIcon className="w-4 h-4" />
  <span>Success</span>
</span>
```

## Keyboard Navigation

### Focus Management
- [ ] All interactive elements are keyboard accessible
- [ ] Visible focus indicators on all focusable elements
- [ ] Logical tab order (follows visual layout)
- [ ] Focus trap in modals (can't tab outside)
- [ ] Skip links for navigation

**Focus Styles**:
```tsx
// ✅ Good: Visible focus indicator
<button className="focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-2">
  Click Me
</button>
```

### Keyboard Shortcuts
- [ ] `Tab` - Navigate forward
- [ ] `Shift + Tab` - Navigate backward
- [ ] `Enter` / `Space` - Activate buttons
- [ ] `Escape` - Close modals/menus
- [ ] Arrow keys - Navigate menus/lists

**Example Modal**:
```tsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Trap focus
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement?.focus();
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ... rest of modal
}
```

## ARIA (Accessible Rich Internet Applications)

### ARIA Attributes
- [ ] `aria-label` - Label for elements without visible text
- [ ] `aria-labelledby` - Reference to label element
- [ ] `aria-describedby` - Reference to description
- [ ] `aria-hidden` - Hide decorative elements from screen readers
- [ ] `aria-live` - Announce dynamic content changes
- [ ] `aria-expanded` - State of expandable elements
- [ ] `aria-selected` - State of selectable items
- [ ] `aria-pressed` - State of toggle buttons

**Examples**:
```tsx
// Button with icon only
<button aria-label="Close modal">
  <XIcon className="w-6 h-6" />
</button>

// Expandable section
<button
  aria-expanded={isExpanded}
  aria-controls="content-1"
  onClick={() => setIsExpanded(!isExpanded)}
>
  Section Title
</button>
<div id="content-1" hidden={!isExpanded}>
  Content
</div>

// Live region for announcements
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

### Semantic HTML
- [ ] Use appropriate HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] Don't use `<div>` or `<span>` for interactive elements
- [ ] Use `<nav>` for navigation areas
- [ ] Use `<main>` for main content
- [ ] Use headings (`<h1>` - `<h6>`) in logical order

**Example**:
```tsx
// ❌ Bad: Div as button
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>

// ✅ Good: Actual button
<button onClick={handleClick}>
  Click me
</button>
```

## Screen Readers

### Alternative Text
- [ ] All images have `alt` text
- [ ] Decorative images have `alt=""` or `aria-hidden="true"`
- [ ] Complex images have detailed descriptions
- [ ] Icons have accessible labels

**Examples**:
```tsx
// Informative image
<img src="/chart.png" alt="Revenue increased by 25% in Q4" />

// Decorative image
<img src="/pattern.svg" alt="" aria-hidden="true" />

// Icon button
<button aria-label="Settings">
  <SettingsIcon aria-hidden="true" />
</button>
```

### Screen Reader Only Content
- [ ] Use `.sr-only` class for screen reader only text
- [ ] Provide context for icons and visual elements

**CSS**:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## Forms

### Labels and Instructions
- [ ] All inputs have associated labels
- [ ] Use `<label>` element with `for` attribute
- [ ] Provide clear instructions and error messages
- [ ] Group related inputs with `<fieldset>` and `<legend>`

**Example**:
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="block font-medium">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    aria-describedby="email-help"
    aria-invalid={hasError}
    className="w-full px-4 py-2 border rounded-lg"
  />
  <p id="email-help" className="text-sm text-slate-600">
    We'll never share your email with anyone.
  </p>
  {hasError && (
    <p className="text-sm text-red-600" role="alert">
      Please enter a valid email address.
    </p>
  )}
</div>
```

### Error Handling
- [ ] Error messages are clear and specific
- [ ] Errors are announced to screen readers (`role="alert"`)
- [ ] Form validation doesn't rely on color alone
- [ ] Required fields are clearly marked

## Animations and Motion

### Reduced Motion
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Provide static alternatives to animations
- [ ] Disable auto-playing videos/carousels

**Example**:
```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ x: prefersReducedMotion ? 0 : 100 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

**CSS**:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Timing and Timeout
- [ ] Don't use time limits (or make them adjustable)
- [ ] Pause/stop controls for auto-updating content
- [ ] Warning before timeout with option to extend

## Responsive and Mobile

### Touch Targets
- [ ] Minimum touch target size: 44x44 pixels
- [ ] Adequate spacing between interactive elements
- [ ] Consider thumb zones on mobile

**Example**:
```tsx
// ✅ Good: Adequate touch target
<button className="min-w-[44px] min-h-[44px] p-4">
  <Icon className="w-6 h-6" />
</button>
```

### Zoom and Reflow
- [ ] Page is usable at 200% zoom
- [ ] No horizontal scrolling at standard viewport widths
- [ ] Content reflows properly on mobile
- [ ] Text can be resized without loss of functionality

## Testing Tools

### Automated Testing
- [ ] Run [axe DevTools](https://www.deque.com/axe/devtools/) browser extension
- [ ] Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) accessibility audit
- [ ] Integrate [jest-axe](https://github.com/nickcolley/jest-axe) in unit tests
- [ ] Use [Pa11y](https://pa11y.org/) for CI/CD pipeline

**Example Test**:
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing
- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test at 200% zoom level
- [ ] Test with Windows High Contrast Mode
- [ ] Test with color blindness simulators

### Browser Extensions
- [ ] [axe DevTools](https://www.deque.com/axe/devtools/)
- [ ] [WAVE](https://wave.webaim.org/extension/)
- [ ] [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [ ] [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

## Common Patterns

### Navigation Menu
```tsx
<nav aria-label="Main navigation">
  <ul className="flex space-x-4">
    <li>
      <a href="/" className="focus:ring-2 focus:ring-primary rounded">
        Home
      </a>
    </li>
    {/* More items */}
  </ul>
</nav>
```

### Modal Dialog
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description</p>
  <button onClick={onClose} aria-label="Close modal">
    <XIcon />
  </button>
</div>
```

### Tabs
```tsx
<div>
  <div role="tablist" aria-label="Content sections">
    <button
      role="tab"
      aria-selected={activeTab === 'tab1'}
      aria-controls="panel1"
      id="tab1"
    >
      Tab 1
    </button>
    {/* More tabs */}
  </div>

  <div
    role="tabpanel"
    id="panel1"
    aria-labelledby="tab1"
    hidden={activeTab !== 'tab1'}
  >
    Panel content
  </div>
</div>
```

### Accordion
```tsx
<div>
  <h3>
    <button
      aria-expanded={isExpanded}
      aria-controls="section1-content"
      id="section1-header"
    >
      Section Title
    </button>
  </h3>
  <div
    id="section1-content"
    role="region"
    aria-labelledby="section1-header"
    hidden={!isExpanded}
  >
    Content
  </div>
</div>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)
- [Accessible Components by Radix UI](https://www.radix-ui.com/)

## Accessibility Statement Template

Include an accessibility statement on your website:

```markdown
# Accessibility Statement

We are committed to ensuring digital accessibility for people with disabilities.
We are continually improving the user experience for everyone and applying the
relevant accessibility standards.

## Conformance Status

This website conforms to WCAG 2.1 Level AA standards.

## Feedback

We welcome your feedback on the accessibility of this site. Please contact us at:
- Email: accessibility@example.com
- Phone: (555) 123-4567

## Known Issues

[List any known accessibility issues and workarounds]

## Assessment

This website was last assessed on [date] using:
- Manual testing with keyboard navigation
- Screen reader testing (NVDA, VoiceOver)
- Automated testing (axe, Lighthouse)
```
