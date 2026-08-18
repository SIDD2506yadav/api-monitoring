# Frontend Design Guidelines

> Living guide for building the API Monitoring SaaS frontend. Read this document before implementing or modifying frontend UI.

## 1. Purpose

The frontend is the primary user-facing part of the product. It should feel consistent, minimal, reliable, technical, and polished across every feature.

These guidelines are intended to prevent visual and interaction drift as the application grows.

### Core principle

> Build a minimal, developer-focused interface where the data and product functionality remain the visual focus.

The UI should feel like a serious developer/operations tool rather than a generic or overly decorative SaaS template.

---

## 2. UI Foundation: shadcn/ui

**shadcn/ui is the primary UI component foundation for this project.**

Prefer shadcn/ui components whenever an appropriate component exists.

Examples include:

- Button
- Input
- Textarea
- Select
- Checkbox
- Switch
- Dialog
- Sheet
- Dropdown Menu
- Tooltip
- Tabs
- Table
- Card
- Badge
- Alert
- Skeleton
- Separator
- Sidebar
- Toast/Sonner

### Rules

1. Check shadcn/ui before creating a new generic UI component.
2. Prefer existing shadcn components over custom equivalents.
3. Use shadcn variants and composition before creating custom styling.
4. Do not introduce another general-purpose UI component library when shadcn provides an adequate solution.
5. Do not create wrapper components such as `AppButton`, `AppInput`, or `AppDialog` merely for consistency. Create an application component only when it adds genuine domain or reusable behavior.
6. Specialized libraries are allowed when they solve a problem shadcn does not, such as charting.
7. If a shadcn component needs project-specific styling, prefer theme tokens, Tailwind utilities, or a well-defined variant over duplicated custom implementations.

### Component layering

Use this general hierarchy:

```text
shadcn/ui primitives
        ↓
application/layout components
        ↓
domain/feature components
        ↓
pages
```

Do not build a second UI framework on top of shadcn.

---

## 3. Visual Philosophy

The product should be:

- Minimal
- Clean
- Technical
- Professional
- Information-dense without feeling cluttered
- Calm and stable
- Easy to scan
- Accessible

Avoid unnecessary:

- Gradients
- Decorative illustrations inside core dashboard workflows
- Excessive shadows
- Excessive rounded cards
- Large decorative headings
- Constant animation
- Visual noise
- Excessive color usage

The monitoring data itself should provide most of the visual interest.

---

## 4. Design Tokens

Use semantic design tokens rather than arbitrary visual values throughout the application.

### Colors

Use the shadcn semantic color system and CSS variables for the primary theme:

- background
- foreground
- card
- card-foreground
- popover
- popover-foreground
- primary
- primary-foreground
- secondary
- secondary-foreground
- muted
- muted-foreground
- accent
- accent-foreground
- destructive
- border
- input
- ring

Do not scatter arbitrary hex values throughout feature components.

### Status colors

Status colors have consistent meanings across the entire application:

| Status | Meaning |
|---|---|
| Green | Healthy / operational / recovered |
| Red | Down / failed / critical |
| Amber | Degraded / warning |
| Blue | Informational |
| Gray | Unknown / inactive / disabled |

Do not change the meaning of these colors between screens.

### Typography

Use a clear hierarchy:

- Page title
- Section heading
- Body text
- Labels
- Supporting text
- Captions
- Monospace text for technical values where appropriate

Use monospace typography selectively for values such as:

- URLs
- HTTP methods
- Status codes
- Request identifiers
- API keys when displayed safely
- Technical/log-like values

Do not use monospace for the entire application.

### Spacing

Prefer the project's Tailwind/shadcn spacing scale. Avoid arbitrary spacing values unless there is a clear design reason.

Consistency is more important than pixel-level customization of individual screens.

### Radius and shadows

Keep both restrained and consistent. Avoid giving every element a large rounded container and shadow.

---

## 5. Layout and Page Structure

Application pages should generally follow a consistent structure:

```text
App Shell
├── Sidebar / Navigation
└── Main Content
    ├── Page Header
    │   ├── Title
    │   ├── Description (when useful)
    │   └── Primary Action(s)
    └── Page Content
```

### Page headers

A page header should clearly establish:

- Where the user is
- What the page does
- The primary action, if one exists

Do not add descriptions when they do not provide useful information.

### Content density

Prefer clear grouping and hierarchy over excessive whitespace. This is a monitoring product, so users should be able to scan meaningful information quickly.

---

## 6. Sidebar and Navigation

Use the shadcn Sidebar as the foundation for application navigation.

Navigation should be:

- Simple
- Predictable
- Consistent
- Easy to scan

Group navigation only when grouping improves discoverability.

Potential primary areas include:

- Overview / Dashboard
- Monitors
- Incidents
- Status Pages
- Settings

Do not add navigation items before the underlying feature exists.

The active route must be visually obvious while remaining subtle and consistent with the shadcn theme.

On smaller screens, the sidebar should adapt into a mobile-friendly navigation pattern such as a Sheet/drawer rather than forcing the desktop sidebar into a narrow viewport.

---

## 7. Responsive Design

The application must be responsive across desktop, tablet, and mobile.

However, this is a **desktop/laptop-primary product**, not a mobile-first dashboard.

### Priority

| Screen | Priority | Goal |
|---|---:|---|
| Laptop/Desktop | Highest | Full-featured primary experience |
| Large desktop | Highest | Use available space effectively |
| Tablet | High | Comfortable adapted experience |
| Mobile | Medium | Fully usable for monitoring and quick actions |
| Very small screens | Lower | Functional fallback |

### Important rule

> Responsive does not mean identical. Responsive means the layout, density, navigation, and information hierarchy adapt to the available space.

Do not simply shrink desktop layouts onto mobile.

For example, a desktop monitor table may become a compact monitor card on mobile rather than becoming an unusable horizontally overflowing table.

### Desktop

Desktop can use:

- Persistent sidebar
- Multi-column layouts
- Dashboard metric groups
- Larger charts
- Tables
- Side-by-side configuration sections

### Tablet

Adapt layouts by:

- Collapsing the sidebar
- Reducing columns
- Stacking related content
- Reducing non-essential density

### Mobile

Prioritize:

- Current monitor health
- Incident status
- Critical metrics
- Quick actions
- Essential configuration

Do not cram every desktop control into the mobile layout.

---

## 8. Component Creation Rules

Before creating a component:

1. Check whether shadcn already provides it.
2. Check whether an existing project component already solves the problem.
3. Check whether the pattern is genuinely reusable.
4. Prefer composition over duplication.
5. Keep feature-specific components inside their feature when possible.

### Avoid generic component proliferation

Do not create multiple components that only rename or slightly restyle the same shadcn primitive.

Bad:

```text
Button
AppButton
PrimaryButton
ActionButton
DashboardButton
```

Prefer the shadcn Button with its supported variants.

Create a new component when it represents a meaningful application/domain pattern, for example:

```text
MonitorStatus
MonitorCard
IncidentTimeline
PageHeader
AppShell
```

---

## 9. Forms

Forms should use shadcn form primitives and consistent structure.

A field should generally follow:

```text
Label
Supporting description (when useful)
Input/control
Validation/error message
```

Validation errors should be:

- Specific
- Human-readable
- Positioned close to the relevant field
- Visually consistent

Do not rely on color alone to communicate errors.

Monitor configuration forms should progressively reveal advanced options rather than overwhelming the user with every possible setting at once.

---

## 10. Loading, Empty, Error, and Success States

Every meaningful asynchronous feature must consider all relevant states:

```text
Loading
   ↓
Success
   ├── Data
   └── Empty
   ↓
Error
```

### Loading

Prefer shadcn Skeleton or an appropriate loading indicator. Avoid unnecessary full-page spinners.

### Empty states

Empty states should explain what is missing and provide a useful next action.

Good:

> You don't have any monitors yet.
>
> Create your first monitor to start tracking an API.

Bad:

> No data.

### Errors

Errors should tell the user:

- What happened
- Whether anything can be done
- What action to take next, when applicable

### Destructive actions

Use shadcn confirmation patterns such as Alert Dialog when an action can cause meaningful data loss or disruption.

---

## 11. Monitoring-Specific Visual Language

The application should use consistent terminology and visual treatment for monitoring states.

Examples:

- Healthy / operational
- Degraded
- Down
- Recovering / recovered
- Disabled
- Unknown

HTTP and execution results should be presented consistently.

Examples of meaningful result categories:

- Successful HTTP response
- HTTP error response
- Timeout
- DNS failure
- Connection failure
- TLS/transport failure

Do not assume every failure is an HTTP status-code failure. Network and execution failures should have their own meaningful representation.

---

## 12. Data Visualization

Charts are used to answer questions, not merely to decorate the dashboard.

Examples:

```text
Response-time chart
→ Is my API getting slower?

Uptime chart
→ Has reliability changed?

Status/error chart
→ What kind of failures are occurring?
```

Expected future visualizations include:

- Uptime
- Response time
- P95 latency
- P99 latency
- Error rate
- HTTP status distribution
- Incident frequency

### Chart rules

Charts should have consistent:

- Heights
- Typography
- Tooltips
- Axis treatment
- Empty states
- Loading states
- Time-range controls
- Responsive behavior

Do not introduce multiple visual styles for similar charts.

Charts should remain readable in dark and light themes if both themes are supported.

---

## 13. Tables

Tables are appropriate for desktop monitoring workflows where users need to compare many entities.

Typical monitor columns may include:

- Monitor
- Status
- Uptime
- Latency
- Last check
- Actions

On mobile, tables should be transformed or simplified when necessary. Avoid forcing users to perform excessive horizontal scrolling merely to understand monitor health.

---

## 14. Buttons and Actions

Use shadcn Button variants consistently.

General hierarchy:

- Primary: main page action
- Secondary/outline: supporting action
- Ghost: low-emphasis contextual action
- Destructive: irreversible or dangerous action

Avoid having multiple visually dominant buttons compete for attention in the same area.

Button labels should describe the action clearly:

- Create monitor
- Save changes
- Disable monitor
- Delete monitor
- Resolve incident

Avoid vague labels such as `Submit`, `Continue`, or `Click here` when a more specific label is possible.

---

## 15. Links and Navigation Actions

Links should look and behave like links. Buttons should be used for actions.

Use links for navigation such as:

- View monitor
- View incident
- View all monitors

Use buttons for mutations/actions such as:

- Create
- Save
- Delete
- Enable
- Disable
- Resolve

Do not use a clickable `div` when a semantic button or link is appropriate.

---

## 16. Icons

Prefer the icon set used by the shadcn ecosystem (typically Lucide) for interface icons.

Avoid mixing multiple icon libraries without a concrete reason.

Icons should:

- Support meaning
- Have consistent sizing
- Align with surrounding text
- Not replace important labels when the meaning is ambiguous

Icon-only controls must have accessible labels/tooltips where appropriate.

---

## 17. Accessibility

Accessibility is part of the implementation definition of done.

Follow these principles:

- Prefer semantic HTML.
- Use accessible labels for form controls.
- Maintain visible keyboard focus.
- Support keyboard navigation for interactive components.
- Do not rely on color alone to communicate status.
- Maintain sufficient contrast.
- Use ARIA only when semantic HTML or the component library does not already provide the required behavior.
- Respect reduced-motion preferences.
- Ensure dialogs, menus, popovers, and navigation are keyboard accessible.

Do not sacrifice accessibility for visual minimalism.

---

## 18. Animation and Interaction

Animation should communicate state or improve perceived responsiveness.

It should not exist purely for decoration.

Good uses:

- Dialog/drawer transitions
- Status changes
- Loading transitions
- Small feedback interactions
- Expand/collapse behavior

Avoid:

- Constant motion
- Large decorative animations
- Distracting hover effects
- Animation that slows down common workflows

The overall product should feel calm and stable.

---

## 19. Theme Strategy

Keep the theme minimal.

The visual identity should primarily come from:

- shadcn semantic tokens
- typography
- spacing
- layout
- status colors
- restrained accents

Do not introduce large amounts of custom CSS before determining whether shadcn/Tailwind/theme tokens already solve the problem.

If both light and dark themes are supported, all product UI must remain usable and visually coherent in both.

---

## 20. Feature UI Definition of Done

Before considering a frontend feature complete, verify:

- [ ] Existing shadcn components were reused where appropriate.
- [ ] No unnecessary custom generic UI component was introduced.
- [ ] The feature follows existing spacing and typography conventions.
- [ ] Status colors follow the global semantic rules.
- [ ] Loading state exists where asynchronous work occurs.
- [ ] Empty state exists where appropriate.
- [ ] Error state exists where appropriate.
- [ ] Destructive actions have appropriate confirmation/feedback.
- [ ] Keyboard and accessibility behavior is correct.
- [ ] Desktop layout is polished.
- [ ] Tablet layout is usable.
- [ ] Mobile layout is usable and not merely a shrunken desktop layout.
- [ ] No unnecessary visual decoration was introduced.
- [ ] Existing components/patterns were checked before adding new ones.

---

## 21. Decision-Making Rules for Coding Agents

When implementing frontend work, follow this order:

1. Read this guide before making UI changes.
2. Inspect existing components before creating new ones.
3. Prefer shadcn/ui components.
4. Prefer existing project patterns over introducing new patterns.
5. Use semantic theme tokens instead of arbitrary colors.
6. Keep the design minimal and information-focused.
7. Make the feature responsive across desktop, tablet, and mobile.
8. Treat desktop/laptop as the primary experience while ensuring mobile remains fully usable.
9. Consider loading, empty, error, and success states.
10. Consider accessibility before declaring the feature complete.
11. If a new reusable UI convention is introduced, update this guide when appropriate.

### Most important rule

> **Do not introduce a new visual or interaction pattern when an existing shadcn component or established project pattern already solves the problem.**

Consistency is a feature.
