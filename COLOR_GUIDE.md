# 🎨 Quick Color Reference Guide

## Primary Colors (Indigo/Purple)
```
primary-50:  #EEF2FF  - Lightest tint
primary-100: #E0E7FF
primary-200: #C7D2FE
primary-300: #A5B4FC
primary-400: #818CF8
primary-500: #6366F1  ⭐ Main Primary
primary-600: #4F46E5
primary-700: #4338CA
primary-800: #3730A3
primary-900: #312E81
primary-950: #1E1B4B  - Darkest shade
```

## Secondary Colors (Teal/Cyan)
```
secondary-50:  #ECFEFF
secondary-100: #CFFAFE
secondary-200: #A5F3FC
secondary-300: #67E8F9
secondary-400: #22D3EE
secondary-500: #06B6D4  ⭐ Main Secondary
secondary-600: #0891B2
secondary-700: #0E7490
secondary-800: #155E75
secondary-900: #164E63
secondary-950: #083344
```

## Accent Colors (Coral/Rose)
```
accent-50:  #FFF1F2
accent-100: #FFE4E6
accent-200: #FECDD3
accent-300: #FDA4AF
accent-400: #FB7185
accent-500: #F43F5E  ⭐ Main Accent
accent-600: #E11D48
accent-700: #BE123C
accent-800: #9F1239
accent-900: #881337
accent-950: #4C0519
```

## Neutral Colors (Cool Gray)
```
neutral-50:  #F8FAFC  - Backgrounds
neutral-100: #F1F5F9
neutral-200: #E2E8F0  - Borders
neutral-300: #CBD5E1
neutral-400: #94A3B8
neutral-500: #64748B  - Text secondary
neutral-600: #475569
neutral-700: #334155  - Text primary
neutral-800: #1E293B
neutral-900: #0F172A  - Dark mode bg
neutral-950: #020617  - Darkest
```

## Semantic Colors
```
✅ Success: #10B981 (Green)
⚠️  Warning: #F59E0B (Amber)
❌ Danger:  #DC2626 (Red)
ℹ️  Info:    #2563EB (Blue)
```

## Common Use Cases

### Buttons
```tsx
primary   → Main actions (Save, Submit, Create)
secondary → Alternative actions (Cancel, View)
accent    → Special/urgent actions (Delete, Alert)
success   → Confirmations (Approve, Confirm)
danger    → Destructive actions (Delete, Remove)
outline   → Secondary options (Cancel, Back)
ghost     → Tertiary actions (Edit, More)
```

### Backgrounds
```css
Main bg:       bg-neutral-50 dark:bg-neutral-950
Card bg:       bg-white dark:bg-neutral-800
Hover bg:      bg-neutral-100 dark:bg-neutral-800
Selected bg:   bg-primary-50 dark:bg-primary-900/30
```

### Text
```css
Primary:   text-neutral-900 dark:text-white
Secondary: text-neutral-600 dark:text-neutral-400
Muted:     text-neutral-500 dark:text-neutral-500
```

### Borders
```css
Default: border-neutral-200 dark:border-neutral-700
Focus:   border-primary-500
Error:   border-danger
```

## Gradients

### Background Gradients
```css
bg-gradient-primary    → Indigo gradient
bg-gradient-secondary  → Teal gradient  
bg-gradient-accent     → Rose gradient
bg-gradient-cool       → Indigo → Teal
bg-gradient-warm       → Rose → Amber
bg-gradient-mesh       → Complex radial gradients
```

### Text Gradients
```tsx
className="gradient-text"  // Indigo → Teal
className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500"
```

## Shadows

```css
shadow-soft         → Subtle elevation
shadow-card         → Standard cards
shadow-card-hover   → Hover state
shadow-glow         → Primary color glow
shadow-glow-secondary → Secondary color glow
shadow-inner-soft   → Inset depth
```

## Quick Copy-Paste Snippets

### Primary Button
```tsx
<button className="btn btn-primary">
  Click Me
</button>
```

### Glass Card
```tsx
<div className="card-glass p-6 backdrop-blur-xl">
  Content here
</div>
```

### Status Badge
```tsx
<span className="badge badge-success">
  Active
</span>
```

### Animated Icon Box
```tsx
<div className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-glow transform hover:scale-110 transition-transform duration-300">
  <Icon className="text-white" size={24} />
</div>
```

### Input Field
```tsx
<input 
  type="text"
  className="input"
  placeholder="Enter text..."
/>
```

### Hover Card
```tsx
<div className="card card-hover">
  Hover over me
</div>
```

## Animation Classes

```css
animate-fade-in      → Fade in on mount
animate-slide-up     → Slide up entrance
animate-slide-down   → Slide down entrance  
animate-scale-in     → Scale in entrance
animate-pulse-soft   → Gentle pulsing
```

## Pro Tips

1. **Always use design tokens** - Never hardcode colors
2. **Layer gradients** - Combine with transparency for depth
3. **Add transitions** - `transition-all duration-300` for smooth UX
4. **Use hover states** - `hover:scale-105` for interactivity
5. **Maintain contrast** - Check WCAG AA compliance
6. **Test dark mode** - All colors have dark variants

## Quick Class Combos

### Premium Button
```
bg-gradient-to-r from-primary-500 to-primary-600 
text-white rounded-lg px-6 py-3 
hover:shadow-lg hover:-translate-y-0.5 
transition-all duration-300 
active:scale-95
```

### Glass Card
```
backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 
rounded-2xl shadow-2xl p-8 
border border-white/20
```

### Stat Display
```
text-3xl font-bold 
text-neutral-900 dark:text-white 
group-hover:text-primary-600 
transition-colors
```

---

**Need help?** Check FRONTEND_REDESIGN.md for detailed documentation.
