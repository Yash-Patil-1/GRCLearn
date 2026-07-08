# UI/UX Design Brief
## GRCLearn — Aston Martin Racing Green Theme

---

## Design System

GRCLearn uses a distinct Aston Martin racing green theme — a clean, professional aesthetic with green accents, warm neutrals, and high readability. This differentiates it from VAPTLearn's dark Hyperstudio theme while maintaining portfolio cohesion through shared component patterns.

---

## Color Palette

| Name | CSS Variable | Hex | Usage |
|------|-------------|-----|-------|
| Racing Green | `--color-racing-green` | `#004D2B` | Primary accent, brand color |
| Champagne | `--color-champagne` | `#C9A96E` | Warm accent (risk, highlights) |
| Charcoal | `--color-charcoal` | `#2C2C2C` | Primary text, headings |
| Ivory | `--color-ivory` | `#F5F0E8` | Light background surfaces |
| Warm Gray | `--color-warm-gray` | `#7A7A7A` | Secondary text, meta info |
| Parchment | `--color-parchment` | `#E5E0D8` | Borders, dividers |
| White | `--color-white` | `#FFFFFF` | Card backgrounds, main content |
| Green | `--color-green` | `#00AC5C` | Correct/success states |
| Red | `--color-red` | `#A52A2A` | Incorrect/error states |
| Orange | `--color-orange` | `#B8860B` | Medium risk, warnings |

### Background Variants
| CSS Variable | Usage |
|-------------|-------|
| `--bg-green-faint` | Light green icon backgrounds |
| `--bg-green-subtle` | XP/success card backgrounds |
| `--bg-green-tag` | Tag/label backgrounds |
| `--bg-champagne-subtle` | Warm accent backgrounds |
| `--bg-orange-subtle` | Warning backgrounds |
| `--bg-red-subtle` | Error backgrounds |
| `--bg-charcoal-overlay` | Mobile menu overlay |

---

## GRC-Specific Components

### StreakBadge
- Horizontal bar showing: Streak (🔥 count), Level (LVL N + XP), Daily Goal progress bar
- Border: parchment, Background: white
- Responsive: wraps on mobile

### Lesson Card (Learn page)
- Numbered list with green accent
- Shows section count + checkpoint count
- Hover: green accent bar slides in
- Chevron on right for navigation

### Control Card (Controls page)
- Control ID badge (green)
- Framework badge
- Family tag
- Description, guidance, evidence sections
- Mapping badges (linked frameworks)
- Priority indicator

### Lesson View (LessonView)
- Progress bar (green) with section counter
- Section navigation + checkpoint questions between sections
- Markdown rendered with styled tables, code blocks, lists
- Key concepts as pill tags
- Result feedback: green (correct) / red (incorrect)
- Lesson completion screen: XP earned, streak, level

### Quiz Page
- Framework selector tabs (nist, ISO, Risk, Compliance, Audit)
- Session tracking with topic & difficulty breakdown
- Hint system
- QuizResults: score card, by-topic breakdown, by-difficulty breakdown, wrong answer review

### Policy Viewer
- Markdown rendered with proper heading hierarchy
- Clean typography for readability

---

## Component States

| Component | State | Visual |
|-----------|-------|--------|
| Button | Default | Racing green bg, white text |
| Button | Ghost | No bg, racing green text on hover |
| Card | Default | White bg, parchment border |
| Card | Hover | Shadow, racing green border tint |
| Nav link | Active | Racing green bg, white text |
| Nav link | Default | Transparent, warm gray text |
| Tag | Racing | Green bg + text variant |
| Tag | Default | White bg, warm gray text variant |
| Input | Focus | Racing green border tint |

---

## Typography & Spacing

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings (h1) | Inter | 24-30px | 700 |
| Headings (h2) | Inter | 18-20px | 700 |
| Body | Inter | 13-15px | 400 |
| Meta text | Inter | 10-12px | 500 |
| Codes/IDs | JetBrains Mono | 11-13px | 400 |
| Buttons | Inter | 13px | 500 |

- 8px border radius (rounded-lg)
- 16-24px card padding
- 24-32px section gap
- White backgrounds, parchment borders
- Subtle shadows (shadow-sm)
- Smooth transitions (duration-200)
