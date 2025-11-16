# Survey Question Templates

This document provides comprehensive documentation for all available survey question components in the Thought Metrics web application.

## Overview

The survey system is built with atomic components following the design system established in `custom-input`. All components are responsive and follow a consistent theming approach. The system is fully integrated with the backend API for real-time survey management and response submission.

## API Integration

The survey system connects to the backend API at `VITE_BASE_URL/api/VITE_BASE_API_VERSION/surveys` for:
- Fetching published surveys
- Getting survey details and questions
- Submitting survey responses
- Saving draft responses
- Tracking survey statistics

## Architecture

```
src/
├── core/
│   └── types/
│       └── survey.type.ts          # TypeScript interfaces for all survey types
├── shared/
│   └── ui/
│       └── atoms/
│           └── survey-questions/   # Atomic survey components
│               ├── SurveyQuestionWrapper.tsx
│               ├── LickertScale.tsx
│               ├── StarRating.tsx
│               ├── RadioButtons.tsx
│               ├── Checkboxes.tsx
│               ├── SingleSlider.tsx
│               ├── DoubleSlider.tsx
│               ├── MultipleSlider.tsx
│               ├── MatrixGrid.tsx
│               ├── Ranking.tsx
│               ├── MaxDiff.tsx
│               └── index.ts
├── pages/
│   └── survey-boards/
│       ├── index.astro             # Grid view of all surveys
│       └── [id].astro              # Individual survey detail page
└── shared/
    └── screens/
        └── survey-boards/
            ├── SurveyBoardsComponent.tsx    # Grid layout component
            └── SurveyDetailComponent.tsx    # Survey question renderer
```

## Theme Reference

All components use the following design tokens from `custom-input`:

- **Background**: `bg-custom-grey-5` (input backgrounds)
- **Borders**: `border-custom-grey-2` (default borders)
- **Focus/Active**: `border-primary` (active state borders)
- **Text**: `text-black` (primary text)
- **Primary Color**: `text-primary` / `bg-primary` (accent color #E63946)
- **Hover**: `hover:border-primary` (hover states)
- **Transitions**: `transition-colors` (smooth state changes)

## Survey Question Type Mapping

The backend API uses the following question types (from `QuestionType` enum):

| API Type | Component | Description |
|----------|-----------|-------------|
| `likert-scale` | LickertScale | Numeric rating grid (1-10) |
| `rating` | StarRating | 5-star rating system |
| `mcq-single` | RadioButtons | Single choice selection |
| `mcq-multiple` | Checkboxes | Multiple choice selection |
| `scale` | SingleSlider | Single range slider |
| `double-slider` | DoubleSlider | Dual-handle range slider |
| `multi-slider` | MultipleSlider | Multiple sliders for different aspects |
| `matrix` | MatrixGrid | Grid with dropdown selections |
| `ranking` | Ranking | Drag-and-drop ranking |
| `max-diff` | MaxDiff | Most/least important selection |
| `constant-sum` | ConstantSum | Point allocation across options |

## Available Survey Question Types

### 1. Lickert Scale

A numeric rating scale displayed as a grid of buttons.

**Use Case**: Delivery experience ratings, satisfaction scores

**Props**:
```typescript
{
  minValue: number;         // Starting value (e.g., 1)
  maxValue: number;         // Ending value (e.g., 10)
  minLabel: string;         // Label for minimum value
  maxLabel: string;         // Label for maximum value
  selectedValue?: number;   // Currently selected value
  onValueChange: (value: number) => void;
  description?: string;     // Additional description
}
```

**Example**:
```typescript
<LickertScale
  questionNumber={1}
  totalQuestions={20}
  question="How was your delivery experience?"
  minValue={1}
  maxValue={10}
  minLabel="10 = Fantastic, 1 = Terrible"
  maxLabel=""
  selectedValue={selectedValue}
  onValueChange={handleValueChange}
  progress={0.1}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 2. Star Rating

5-point star rating system with optional image display.

**Use Case**: Ad creativity ratings, product reviews

**Props**:
```typescript
{
  maxStars: number;              // Number of stars (usually 5)
  selectedStars?: number;        // Currently selected stars
  onRatingChange: (rating: number) => void;
  image?: string;                // Optional image to rate
  ratingLabel?: string;          // Label for the rating
}
```

**Example**:
```typescript
<StarRating
  questionNumber={3}
  totalQuestions={20}
  question="Rate this ads creativity"
  maxStars={5}
  selectedStars={4}
  onRatingChange={handleRatingChange}
  image="/images/ad-creative.jpg"
  ratingLabel="Rate this ads creativity"
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 3. Radio Buttons

Single-select from multiple options.

**Use Case**: Single choice questions (e.g., "Which supermarket do you shop at?")

**Props**:
```typescript
{
  options: RadioButtonOption[];  // Array of options
  selectedValue?: string;        // Currently selected option value
  onValueChange: (value: string) => void;
}

interface RadioButtonOption {
  id: string;
  label: string;
  value: string;
}
```

**Example**:
```typescript
<RadioButtons
  questionNumber={3}
  totalQuestions={20}
  question="Which supermarket do you usually shop at?"
  options={[
    { id: '1', label: 'Walmart', value: 'walmart' },
    { id: '2', label: 'Target', value: 'target' },
    { id: '3', label: 'Reliance', value: 'reliance' },
  ]}
  selectedValue="walmart"
  onValueChange={handleValueChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 4. Checkboxes

Multiple-select from multiple options.

**Use Case**: Multi-choice questions (e.g., "Which stores do you shop at?")

**Props**:
```typescript
{
  options: CheckboxOption[];     // Array of options
  selectedValues: string[];      // Array of selected values
  onValueChange: (values: string[]) => void;
}

interface CheckboxOption {
  id: string;
  label: string;
  value: string;
}
```

**Example**:
```typescript
<Checkboxes
  questionNumber={3}
  totalQuestions={20}
  question="Which supermarket do you usually shop at?"
  options={[
    { id: '1', label: 'Walmart', value: 'walmart' },
    { id: '2', label: 'Target', value: 'target' },
  ]}
  selectedValues={['walmart', 'target']}
  onValueChange={handleValueChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 5. Single Slider

A single range slider for numeric input.

**Use Case**: Stress levels, satisfaction ratings

**Props**:
```typescript
{
  minValue: number;              // Minimum slider value
  maxValue: number;              // Maximum slider value
  minLabel?: string;             // Label for min value
  maxLabel?: string;             // Label for max value
  selectedValue?: number;        // Current slider value
  onValueChange: (value: number) => void;
  step?: number;                 // Step increment (default: 1)
}
```

**Example**:
```typescript
<SingleSlider
  questionNumber={3}
  totalQuestions={20}
  question="Please indicate your level of stress at work"
  minValue={0}
  maxValue={10}
  minLabel="Relaxed"
  maxLabel="Extreme Stressed"
  selectedValue={5}
  onValueChange={handleValueChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 6. Double Slider (Range Slider)

A dual-handle slider for range selection.

**Use Case**: Price ranges, age ranges

**Props**:
```typescript
{
  minValue: number;              // Minimum range value
  maxValue: number;              // Maximum range value
  minLabel?: string;             // Label for min value
  maxLabel?: string;             // Label for max value
  selectedRange?: [number, number]; // Current range [min, max]
  onRangeChange: (range: [number, number]) => void;
  step?: number;                 // Step increment (default: 1)
}
```

**Example**:
```typescript
<DoubleSlider
  questionNumber={3}
  totalQuestions={20}
  question="What is your price?"
  minValue={100}
  maxValue={500}
  minLabel="Rs. 100"
  maxLabel="Rs. 500"
  selectedRange={[150, 350]}
  onRangeChange={handleRangeChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 7. Multiple Slider

Multiple sliders for rating different aspects.

**Use Case**: Job satisfaction ratings across multiple dimensions

**Props**:
```typescript
{
  items: SliderItem[];           // Array of items to rate
  minValue: number;              // Min value for all sliders
  maxValue: number;              // Max value for all sliders
  selectedValues: Record<string, number>; // Object with itemId: value
  onValuesChange: (values: Record<string, number>) => void;
}

interface SliderItem {
  id: string;
  label: string;
  minLabel: string;
  maxLabel: string;
}
```

**Example**:
```typescript
<MultipleSlider
  questionNumber={3}
  totalQuestions={20}
  question="Please rate how currently feel about the following aspects of your job"
  items={[
    { id: 'workload', label: 'Workload', minLabel: 'Not content', maxLabel: 'Completely content' },
    { id: 'autonomy', label: 'Autonomy', minLabel: 'Not content', maxLabel: 'Completely content' },
  ]}
  minValue={0}
  maxValue={10}
  selectedValues={{ workload: 5, autonomy: 7 }}
  onValuesChange={handleValuesChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 8. Matrix Grid

A grid-based question with dropdown selections for each row.

**Use Case**: Rating multiple factors with the same options

**Props**:
```typescript
{
  rows: MatrixRowItem[];         // Array of rows
  selectedValues: Record<string, string>; // Object with rowId: optionId
  onValuesChange: (values: Record<string, string>) => void;
}

interface MatrixRowItem {
  id: string;
  label: string;
  options: MatrixOption[];
}

interface MatrixOption {
  id: string;
  label: string;
}
```

**Example**:
```typescript
<MatrixGrid
  questionNumber={3}
  totalQuestions={20}
  question="How important are the following factors in deciding to take a new job?"
  rows={[
    {
      id: 'salary',
      label: 'Salary',
      options: [
        { id: 'not-at-all', label: 'Not at all' },
        { id: 'very', label: 'Very' },
      ]
    }
  ]}
  selectedValues={{ salary: 'very' }}
  onValuesChange={handleValuesChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 9. Ranking

Drag-and-drop ranking interface.

**Use Case**: Prioritizing job benefits, feature preferences

**Props**:
```typescript
{
  items: RankingItem[];          // Array of items to rank
  rankedItems: string[];         // Array of item IDs in ranked order
  onRankingChange: (rankedIds: string[]) => void;
}

interface RankingItem {
  id: string;
  label: string;
}
```

**Example**:
```typescript
<Ranking
  questionNumber={3}
  totalQuestions={20}
  question="Please rank the following job benefits in order of importance to you"
  items={[
    { id: 'salary', label: 'Salary' },
    { id: 'flexible-hours', label: 'Flexible working hours' },
  ]}
  rankedItems={['salary', 'flexible-hours']}
  onRankingChange={handleRankingChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 10. MaxDiff Analysis

Select most and least important from a list.

**Use Case**: Feature importance analysis, preference studies

**Props**:
```typescript
{
  items: MaxDiffItem[];          // Array of items to compare
  mostImportant?: string;        // ID of most important item
  leastImportant?: string;       // ID of least important item
  onSelectionChange: (mostImportant: string, leastImportant: string) => void;
}

interface MaxDiffItem {
  id: string;
  label: string;
}
```

**Example**:
```typescript
<MaxDiff
  questionNumber={3}
  totalQuestions={20}
  question="When considering buying a new phone, among the shown attributes, which of these is the most and least important?"
  items={[
    { id: 'camera', label: 'Camera' },
    { id: 'battery', label: 'Battery' },
  ]}
  mostImportant="camera"
  leastImportant="battery"
  onSelectionChange={handleSelectionChange}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### 11. Constant Sum

Distribute a fixed number of points across multiple options.

**Use Case**: Budget allocation, importance distribution, preference weighting

**Props**:
```typescript
{
  totalPoints: number;                          // Total points to distribute
  options: ConstantSumOption[];                // Array of options
  allocatedPoints: Record<string, number>;     // Current allocation
  onAllocationChange: (allocation: Record<string, number>) => void;
  allowZero?: boolean;                         // Allow 0 points (default: true)
  requireTotal?: boolean;                      // Require exact total (default: true)
}

interface ConstantSumOption {
  id: string;
  label: string;
}
```

**Example**:
```typescript
<ConstantSum
  questionNumber={3}
  totalQuestions={20}
  question="Distribute 100 points across these features based on importance"
  totalPoints={100}
  options={[
    { id: 'price', label: 'Price' },
    { id: 'quality', label: 'Quality' },
    { id: 'service', label: 'Customer Service' },
  ]}
  allocatedPoints={{ price: 40, quality: 35, service: 25 }}
  onAllocationChange={handleAllocationChange}
  requireTotal={true}
  progress={0.3}
  onBack={handleBack}
  onNext={handleNext}
/>
```

## Common Props

All survey components inherit these base props from `BaseSurveyQuestionProps`:

```typescript
{
  questionNumber: number;        // Current question number (1-based)
  totalQuestions: number;        // Total number of questions
  question: string;              // The question text
  comment?: string;              // Optional comment text
  onCommentChange?: (value: string) => void;
  progress: number;              // Progress indicator (0.1 to 0.5)
  onBack?: () => void;           // Back button handler
  onNext?: () => void;           // Next button handler
  error?: string;                // Error message to display
}
```

## Survey Structure

### Survey Boards (Grid View)

Location: `/survey-boards`

Displays all available surveys in a responsive grid layout with:
- Survey title
- Description
- Reward amount and duration
- Status badge (Available/In Progress/Completed)

### Individual Survey

Location: `/survey-boards/[id]`

Renders survey questions sequentially with:
- Question navigation (Back/Next buttons)
- Progress indicator
- Comment section (0-500 characters)
- Dynamic question type rendering

## Usage Example

```typescript
// In your survey detail component
import {
  LickertScale,
  StarRating,
  RadioButtons,
  // ... other components
} from '@/shared/ui/atoms/survey-questions';

const SurveyComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const renderQuestion = () => {
    switch (questions[currentQuestion].type) {
      case 'lickert':
        return (
          <LickertScale
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            question={questions[currentQuestion].text}
            // ... other props
          />
        );
      // ... other cases
    }
  };

  return <div>{renderQuestion()}</div>;
};
```

## Styling Notes

- All components use Tailwind CSS classes
- Responsive breakpoints: `md:` (768px+), `lg:` (1024px+), `xl:` (1280px+)
- Components are fully accessible with proper ARIA labels
- Keyboard navigation is supported for all interactive elements

## Desktop vs Mobile

The components automatically adapt to desktop screens:
- Larger font sizes on desktop
- More spacing and padding
- Grid layouts expand to multiple columns
- Touch-friendly targets on mobile

## API Integration Details

### Service Layer

**Survey Service** (`src/services/survey/survey.service.ts`):
- `listPublicSurveys()` - Fetch all published surveys
- `getSurveyDetails()` - Get survey with questions
- `submitResponse()` - Submit completed survey
- `saveDraft()` - Save progress as draft
- `getUserDrafts()` - Fetch user's saved drafts

### React Query Hooks

**Queries**:
- `useSurveyListQuery` - Fetch survey list with filters
- `useSurveyDetailsQuery` - Fetch single survey with template

**Mutations**:
- `useSubmitSurveyMutation` - Submit survey response
- `useSaveDraftMutation` - Save draft response

### Data Flow

1. **Survey List Page** → Calls `useSurveyListQuery` → Displays grid of surveys
2. **Survey Detail Page** → Calls `useSurveyDetailsQuery` → Renders questions dynamically
3. **Answer Submission** → Calls `useSubmitSurveyMutation` → Shows success message
4. **Draft Saving** → Calls `useSaveDraftMutation` → Saves progress

## Best Practices

1. **Always validate responses** before allowing navigation to next question
2. **Save progress** periodically to prevent data loss
3. **Use TypeScript types** for type safety
4. **Follow atomic design** principles when extending components
5. **Test on multiple devices** for responsive behavior
6. **Provide clear error messages** for validation failures

## Future Enhancements

- Auto-save functionality
- Survey branching/conditional logic
- Multi-language support
- Accessibility improvements (screen reader optimization)
- Analytics integration
- Export survey results to PDF/Excel
