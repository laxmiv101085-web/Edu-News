## UI Kit

### Color Tokens

| Token | Value |
| --- | --- |
| `primary-500/600/700` | `#2563EB` / `#1D4ED8` / `#1E40AF` |
| `neutral-50…900` | Slate-inspired grayscale for surfaces |
| `accent-500` | `#F97316` for call-to-actions |
| Semantic | `bg`, `surface`, `border`, `text-primary`, `text-muted`, `success`, `warning`, `danger` |

### Spacing Scale

`0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80px` exposed via Tailwind `spacing`.

### Radius

- `sm`: `6px`
- `md`: `12px`
- `lg`: `20px`
- `round`: `999px`

### Elevation

- `shadow-soft`: cards
- `shadow-medium`: floating panels
- `shadow-deep`: hero & modals

### Motion

- Standard transitions use `[0.4, 0, 0.2, 1]` easing with `250–450ms`.
- Page transitions orchestrated via `AnimateLayout`.
- Micro interactions follow `hover: translateY(-6px)` and `scale 1.02`.

### Accessibility

- Focus-visible ring: `2px` primary outline + offset.
- Toasts announce via ARIA live region (Radix).
- Modals rely on Radix for focus trap.


