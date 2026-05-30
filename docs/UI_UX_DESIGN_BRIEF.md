# UI/UX Design Brief
## GRCLearn — Same Hyperstudio Theme as VAPTLearn

---

## Design System

Same Hyperstudio monochrome terminal + amber design as VAPTLearn for portfolio cohesion.
Both projects share the same visual language — they look like they belong together.

**Source:** https://styles.refero.design/style/8eb9c53e-d69c-497a-b640-610856cf3a60

---

## Color Palette

Same as VAPTLearn, plus risk-specific colors:

| Name | Hex | Usage |
|------|-----|-------|
| Midnight Void | `#101010` | Primary background |
| Deep Space | `#080808` | Deeper surfaces |
| Dark Carbon | `#333333` | Borders |
| Ash Gray | `#949494` | Secondary text |
| Polar White | `#F3F3F3` | Primary text |
| Amber Glow | `#E7C59A` | Key accent |
| Neon Green | `#00AC5C` | Compliant / low risk |
| Risk Yellow | `#F39C12` | Medium risk |
| Risk Orange | `#E67E22` | High risk |
| Risk Red | `#E74C3C` | Critical risk |

---

## GRC-Specific Components

### Risk Heat Map
- 5×5 grid with colored cells
- Green → Yellow → Orange → Red gradient
- Clickable cells to filter risks

### Compliance Gauge
- Circular progress (like ScoreGauge from JobMatchAI)
- Shows % of controls implemented
- Color: Green (>80%), Yellow (50-80%), Red (<50%)

### Framework Card
- Dark Carbon background
- Framework name in Polar White (bold)
- Control count badge in Amber Glow
- Click to expand

### Control Card
- Similar to VAPTLearn command card
- Control ID badge (Amber)
- Framework badge (Dark Carbon)
- Priority indicator (Green/Yellow/Red dot)
- Mapping badges (linked frameworks)

### Policy Viewer
- Markdown rendered with proper heading hierarchy
- Table of contents sidebar
- Copy section button

---

## Typography & Spacing

Identical to VAPTLearn:
- Inter for UI, JetBrains Mono for IDs/codes
- 8px radius, 24px card padding, 64px section gap
- No shadows, dark shades for depth
