# Animation Recipes

High-impact animation patterns using Framer Motion and CSS.

## Philosophy

Focus on **high-impact animations** rather than scattered micro-interactions:

✅ **Good**: Hero reveal, page transitions, modal animations
❌ **Avoid**: Every button hover, every icon, every text change

## Page Animations

### 1. Fade In Up

Standard page entrance:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  {content}
</motion.div>
```

### 2. Staggered Children

Animate list items with stagger:

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### 3. Hero Reveal

Dramatic entrance for hero sections:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    duration: 1,
    ease: [0.22, 1, 0.36, 1],
    scale: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }}
>
  <h1>Your Hero Content</h1>
</motion.div>
```

## Scroll Animations

### 1. Parallax Effect

Elements move at different speeds:

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="relative h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <img src="/background.jpg" alt="" className="w-full h-full object-cover" />
      </motion.div>

      <div className="relative z-10">
        {content}
      </div>
    </div>
  );
}
```

### 2. Scroll-Triggered Fade

Fade in elements as they enter viewport:

```tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function FadeInSection({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### 3. Progress Indicator

Scroll progress bar:

```tsx
import { motion, useScroll } from 'framer-motion';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
```

## Interactive Animations

### 1. Button Press

Physical button press feedback:

```tsx
<motion.button
  className="px-8 py-4 bg-primary text-white rounded-lg font-semibold"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>
```

### 2. Card Hover

3D tilt effect on hover:

```tsx
import { motion } from 'framer-motion';
import { useState } from 'react';

function TiltCard({ children }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setRotateX((y - 0.5) * 10);
    setRotateY((x - 0.5) * -10);
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setRotateX(0);
        setRotateY(0);
      }}
      animate={{
        rotateX,
        rotateY
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
```

### 3. Toggle Switch

Smooth toggle with spring physics:

```tsx
function Toggle({ enabled, setEnabled }) {
  return (
    <button
      className={`relative w-16 h-8 rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-slate-300'
      }`}
      onClick={() => setEnabled(!enabled)}
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
        animate={{ x: enabled ? 32 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
```

## Modal Animations

### 1. Fade and Scale

Standard modal entrance:

```tsx
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 2. Slide Up Drawer

Bottom drawer on mobile:

```tsx
function Drawer({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
          >
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Loading Animations

### 1. Pulsing Dots

Three-dot loader:

```tsx
function LoadingDots() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}
```

### 2. Spinning Loader

Circular spinner:

```tsx
function Spinner() {
  return (
    <motion.div
      className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
}
```

## Number Animations

### 1. Count Up

Animate number changes:

```tsx
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

function AnimatedNumber({ value }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, current => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}
```

## Text Animations

### 1. Letter Reveal

Staggered letter animation:

```tsx
function AnimatedText({ text }) {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200
      }
    }
  };

  return (
    <motion.div
      style={{ display: 'flex', overflow: 'hidden' }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
```

## Reduced Motion

Always respect user preferences:

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {content}
    </motion.div>
  );
}
```

## Performance Tips

1. **Use `transform` and `opacity`** - These properties don't trigger layout recalculation
2. **Avoid animating `width`, `height`, `top`, `left`** - Use `scale` and `translate` instead
3. **Use `will-change` sparingly** - Only for elements that will definitely animate
4. **Limit concurrent animations** - Too many at once can cause jank
5. **Use `layout` prop carefully** - Layout animations are expensive
6. **Prefer CSS animations** for simple transitions
7. **Test on low-end devices** - Ensure smooth performance

## Animation Timing Functions

```tsx
// Recommended easing functions
const easings = {
  // Standard Material Design easing
  standard: [0.4, 0, 0.2, 1],

  // Deceleration curve
  decelerate: [0, 0, 0.2, 1],

  // Acceleration curve
  accelerate: [0.4, 0, 1, 1],

  // Custom spring-like easing
  spring: [0.22, 1, 0.36, 1],

  // Sharp curve for quick transitions
  sharp: [0.4, 0, 0.6, 1]
};

// Usage
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.5, ease: easings.spring }}
/>
```
