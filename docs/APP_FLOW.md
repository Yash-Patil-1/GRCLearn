# Application Flow
## GRCLearn — Governance, Risk & Compliance Learning Platform

---

## 1. Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (fixed)                │  Main Content              │
│                                 │                            │
│  🏛️  GRCLearn                   │                            │
│                                 │                            │
│  📊 Dashboard                   │  (varies by route)         │
│  📖 Learning Paths              │                            │
│  📋 Framework Explorer          │                            │
│  🔒 Control Library             │                            │
│  ⚠️  Risk Management            │                            │
│  📄 Policy Library              │                            │
│  ✅ Audit Module                │                            │
│  🔗 Framework Mapping           │                            │
│  📈 Metrics                     │                            │
│  🔖 Bookmarks                   │                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Key Pages

### Dashboard
- Progress overview (phases, controls learned)
- Risk heat map (5×5 matrix)
- Compliance score gauge
- Recent activity
- Quick search

### Framework Explorer
- Cards for each framework (NIST, ISO, CIS, etc.)
- Click → hierarchical view (families → controls)
- Framework comparison side-by-side

### Control Detail Page
```
┌─────────────────────────────────────────────────────┐
│  NIST 800-53 | AC-2: Account Management             │
│  Family: Access Control | Priority: High            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📋 Description                                      │
│  Manage information system accounts...              │
│                                                      │
│  🔧 Implementation Guidance                          │
│  • Define account types                             │
│  • Establish approval process                       │
│  • Review accounts periodically                     │
│                                                      │
│  📎 Audit Evidence                                   │
│  • Account inventory                                │
│  • Access review records                            │
│                                                      │
│  🔗 Cross-Framework Mapping                          │
│  ISO 27001: A.5.15, A.5.16                          │
│  CIS v8: 5.1, 5.2, 5.3                             │
│  SOC 2: CC6.1, CC6.2                               │
│  PCI DSS: 7.1, 7.2                                 │
│                                                      │
│  ⚠️  Risks Addressed                                 │
│  • Unauthorized access                              │
│  • Orphaned accounts                                │
│                                                      │
│  [✅ Mark Learned] [🔖 Bookmark] [📝 Note]           │
└─────────────────────────────────────────────────────┘
```

### Risk Management
- Risk register table (sortable by score)
- Add new risk (form: name, likelihood, impact, treatment)
- Risk heat map (5×5 colored matrix)
- Pre-built scenarios to study

### Policy Library
- List of policy templates
- Click → rendered Markdown with sections
- Copy/export functionality

### Audit Module
- Select framework → generate checklist
- Checklist items with evidence requirements
- Mark items as "verified" / "finding"

### Framework Mapping
- Select source control → see all equivalent controls
- Visual mapping table
- Filter by framework pair

---

## 3. Risk Heat Map

```
         Impact →
    L  │ 1  │ 2  │ 3  │ 4  │ 5  │
    i  ├────┼────┼────┼────┼────┤
    k  │ 🟢 │ 🟢 │ 🟡 │ 🟡 │ 🟠 │  1
    e  │ 🟢 │ 🟡 │ 🟡 │ 🟠 │ 🟠 │  2
    l  │ 🟡 │ 🟡 │ 🟠 │ 🟠 │ 🔴 │  3
    i  │ 🟡 │ 🟠 │ 🟠 │ 🔴 │ 🔴 │  4
    h  │ 🟠 │ 🟠 │ 🔴 │ 🔴 │ 🔴 │  5
    ↓  └────┴────┴────┴────┴────┘
```

Colors: Green (Low 1-4), Yellow (Medium 5-9), Orange (High 10-15), Red (Critical 16-25)
