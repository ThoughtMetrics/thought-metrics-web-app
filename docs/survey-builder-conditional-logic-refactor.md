# Survey Builder — Conditional Logic & Option Filter Refactor

## Status
Temporarily removed from the editor UI (2026-05-21) to be redesigned with a new atomic-level component system.

---

## What Was Removed

### 1. `ConditionalLogicConfig` — from `QuestionConfigPanel.tsx`
**Previously rendered at the bottom of the right "Question Settings" panel for every question.**

- Import: `import ConditionalLogicConfig from './ConditionalLogicConfig';`
- Rendered as: `<ConditionalLogicConfig question={question} qIdx={selectedQuestionIndex} />`
- Source file: `src/shared/screens/admin/survey-builder/components/ConditionalLogicConfig.tsx`

**What it did:**
- Allowed setting `showIfAll` / `showIfAny` conditions on a question (show this question only if another question's answer matches a rule)
- Mode toggle: "All conditions must match" (AND) vs "Any condition matches" (OR)
- Add/remove condition rows with: source question select, operator select (equals / not_equals / contains), value input
- Store fields written: `question.config.showIfAll`, `question.config.showIfAny`

**Store trigger for highlight (also removed from McqCanvasEditor):**
- `conditionalLogicHighlight: number` counter in store — used to scroll the right panel to this section when a user clicked the branching icon on an MCQ option
- `triggerConditionalLogicHighlight()` — increments the counter
- `useEffect` in `ConditionalLogicConfig` listened to this counter and called `scrollIntoView + ring flash`
- The branching icon button was on each regular option row in `McqCanvasEditor.tsx` — **also removed**

---

### 2. `OptionFilterConfig` — from `QuestionConfigPanel.tsx`
**Previously rendered in the right panel for MCQ / Ranking questions.**

- Import: `import OptionFilterConfig from './configs/OptionFilterConfig';`
- Rendered as: `<OptionFilterConfig question={question} qIdx={selectedQuestionIndex} />`
- Source file: `src/shared/screens/admin/survey-builder/components/configs/OptionFilterConfig.tsx`

**What it did:**
- Filtered which options were visible based on answers to a previous MCQ question
- Linked two MCQ questions: "show option X in this question only if option X was selected in question Y"
- Store field written: `question.config.optionFilter`

---

## Store Fields to Preserve

These fields are still persisted and serialised to the API — they are NOT removed from the type system or store:

| Field | Type | Purpose |
|---|---|---|
| `config.showIf` | `IBuilderShowIfCondition` | Legacy single condition |
| `config.showIfAll` | `IBuilderShowIfCondition[]` | AND-mode conditions |
| `config.showIfAny` | `IBuilderShowIfCondition[]` | OR-mode conditions |
| `config.optionFilter` | object | Option-level filter link |
| `conditionalLogicHighlight` | `number` (store) | UI scroll trigger counter |

The IF/SKIP indicator banners (amber/blue banner in the canvas when a question has conditions set) are still present — they are in `QuestionEditorPanel.tsx` (both single and list view).

---

## Re-implementation Plan

### Design Goals
- Conditional logic should be accessible per-question but not clutter the right panel permanently
- Consider a **dedicated drawer/sheet** that slides in from the right when the user clicks a "Logic" button
- Or a **bottom sheet** that expands within the canvas for the selected question
- Option-level branching (currently on MCQ options) should link directly to setting a `showIfAny` condition on the target question

### Suggested New Component Structure (Atomic)

```
src/shared/screens/admin/survey-builder/
  components/
    logic/                            ← new directory
      ConditionalLogicDrawer.tsx      ← full-screen right drawer
      ConditionalLogicRule.tsx        ← single condition row (atom)
      ConditionalLogicRuleGroup.tsx   ← group of rules with AND/OR toggle
      OptionBranchingMap.tsx          ← visual map of option → target question
      LogicBadge.tsx                  ← reusable IF / SKIP badge chip
```

### Entry Points to Wire Back
1. **Right panel** — add a "Logic" section button that opens `ConditionalLogicDrawer`
2. **MCQ option row** — re-add the branching icon to `McqCanvasEditor.tsx` once the drawer is ready
3. **Canvas IF/SKIP banners** — already present, click them to open the drawer for that question
4. **QuestionListPanel** — the question list sidebar may show logic indicators per question

### Re-adding to QuestionConfigPanel (simple restore)
If the drawer approach is not ready, the original components can be restored by:
1. Re-adding imports to `QuestionConfigPanel.tsx`:
   ```tsx
   import ConditionalLogicConfig from './ConditionalLogicConfig';
   import OptionFilterConfig from './configs/OptionFilterConfig';
   ```
2. Re-adding the `hasOptions` variable:
   ```tsx
   const hasOptions = isMcq || question.questionType === QuestionType.RANKING;
   ```
3. Re-adding the sections before the closing `</div>` of the scroll area:
   ```tsx
   {hasOptions && <OptionFilterConfig question={question} qIdx={selectedQuestionIndex} />}
   <ConditionalLogicConfig question={question} qIdx={selectedQuestionIndex} />
   ```
4. Re-adding the branching icon to `McqCanvasEditor.tsx` option rows and restoring `triggerConditionalLogicHighlight` from the store.
