# Frontend Integration Guide - Survey Response Tracking & Draft Status

## ✅ Backend Implementation Complete (2025-11-14)

This document provides comprehensive integration instructions for the new survey response tracking and draft status features implemented in the backend API.

---

## 🎯 Overview of New Features

### 1. User Response Status Tracking
The backend now tracks whether authenticated users have:
- Not started a survey (`hasResponded: false`)
- Started but not completed a survey (`status: 'draft'`, `canUpdate: true`)
- Completed a survey (`status: 'submitted'`, `isCompleted: true`)

### 2. Draft Save/Resume Functionality
Users can:
- Save partial survey responses as drafts
- Resume and continue incomplete surveys
- Auto-save progress while filling out surveys
- Submit drafts when all questions are answered

### 3. Duplicate Submission Prevention
- Users cannot submit multiple responses to the same survey
- If user has already submitted, show "Already Submitted" state
- If user has a draft, show "Continue Survey" button

### 4. Auto-Generated Survey IDs
All surveys now have auto-generated `surveyId` fields:
- **Format**: `TM-[IndustryCode][SequenceNumber]`
- **Examples**: `TM-AM001` (Advertising & Marketing #1), `TM-HR001` (Human Resources #1), `TM-T002` (Technology #2)
- **Purpose**: Unique, readable identifiers for surveys
- **Display**: Should be shown in survey cards and detail pages

### 5. Industry Categorization
All surveys now include an `industry` field:
- **13 predefined categories**: Technology, FMCG, Healthcare, Human Resources, etc.
- **Purpose**: Allow users to filter surveys by industry
- **Display**: Show as a tag/badge on survey cards

---

## 📊 API Response Changes

### 1. Survey List API (`GET /api/v1/surveys`)

**New Response Format** (when authenticated):
```typescript
{
  "success": true,
  "data": [
    {
      "id": "1",
      "surveyId": "TM-AM001",
      "label": "Customer Satisfaction Survey",
      "status": "published",
      "price": 0,
      "industry": "Advertising & Marketing",
      "userResponse": {  // ← NEW FIELD
        "hasResponded": false,
        "canUpdate": false,
        "isCompleted": false
      }
    },
    {
      "id": "2",
      "surveyId": "TM-HR001",
      "label": "Employee Engagement Survey",
      "status": "published",
      "userResponse": {
        "hasResponded": true,
        "status": "draft",  // User started but didn't finish
        "responseId": "65abc123...",
        "canUpdate": true,  // User can continue this survey
        "isCompleted": false
      }
    },
    {
      "id": "3",
      "surveyId": "TM-T001",
      "label": "Tech Product Feedback",
      "status": "published",
      "userResponse": {
        "hasResponded": true,
        "status": "submitted",  // User completed this survey
        "responseId": "65def456...",
        "submittedAt": "2025-11-14T10:30:00.000Z",
        "canUpdate": false,  // User CANNOT resubmit
        "isCompleted": true  // Survey is done
      }
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

### 2. Survey Details API (`GET /api/v1/surveys/:id/details`)

**New Response Format**:
```typescript
{
  "success": true,
  "data": {
    "survey": { ... },
    "template": {
      "name": "Customer Feedback Template",
      "questions": [...]
    },
    "userResponse": {  // ← NEW FIELD
      "hasResponded": true,
      "status": "draft",
      "responseId": "65abc123...",
      "canUpdate": true,
      "isCompleted": false,
      "submittedAt": "2025-11-14T09:15:00.000Z"
    }
  }
}
```

### 3. NEW Draft API Endpoints

#### Save Draft (`POST /api/v1/surveys/:id/draft`)
**Purpose**: Save partial survey response

**Request**:
```typescript
{
  "respondent": {
    "name": "John Doe",
    "email": "john@example.com"
    // userId added automatically by backend if authenticated
  },
  "answers": [
    {
      "questionId": "q1",
      "questionType": "text",
      "answer": "Great product!",
      "comment": ""
    },
    {
      "questionId": "q2",
      "questionType": "mcq-single",
      "answer": "option1",
      "comment": ""
    }
    // Partial answers OK - doesn't need to be complete
  ]
}
```

**Response**:
```typescript
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "surveyId": "1",
    "status": "draft",  // Saved as draft
    "respondent": {
      "name": "John Doe",
      "email": "john@example.com",
      "userId": "user123"
    },
    "answers": [...],
    "submittedAt": "2025-11-14T10:00:00.000Z"
  },
  "message": "Survey draft saved successfully"
}
```

**Auto-Update Behavior**:
- If user already has a draft for this survey, it updates the existing draft
- If user already submitted, returns 400 error

---

#### Get Draft (`GET /api/v1/surveys/:id/draft`)
**Purpose**: Retrieve user's saved draft for a survey

**Response** (if draft exists):
```typescript
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "surveyId": "1",
    "status": "draft",
    "respondent": {
      "name": "John Doe",
      "email": "john@example.com",
      "userId": "user123"
    },
    "answers": [
      {
        "questionId": "q1",
        "questionType": "text",
        "answer": "Great product!",
        "comment": ""
      },
      {
        "questionId": "q2",
        "questionType": "mcq-single",
        "answer": "option1",
        "comment": ""
      }
    ],
    "submittedAt": "2025-11-14T10:00:00.000Z"
  }
}
```

**Response** (if no draft):
```typescript
{
  "success": false,
  "message": "No draft found for this survey"
}
```

---

#### Submit Survey (`POST /api/v1/surveys/:id/submit`)
**Updated Behavior**:
- If user has a DRAFT, submitting will validate all answers
- If validation passes, draft is promoted to "submitted" status
- If validation fails, draft remains as draft (partial submission)
- If user already has a SUBMITTED response, returns 400 error

---

## 🔧 Frontend Implementation Guide

### 1. Update TypeScript Interfaces

**File**: `src/core/types/survey.type.ts`

```typescript
// Update ISurvey interface to include userResponse
interface ISurvey {
  id: string;
  templateMongoId: string;
  label: string;
  status: SurveyStatus | string;
  visibility: 'public' | 'private';
  price?: number | string;
  maxResponses?: number;
  currentResponses: number;
  surveyId?: string;
  industry?: string;
  startDate?: string;
  expireDate?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: {
    timeToComplete?: number;
  };
  // NEW: User response status
  userResponse?: {
    hasResponded: boolean;
    status?: SurveyResponseStatus;
    responseId?: string;
    submittedAt?: string;
    canUpdate: boolean;  // Can user continue this survey?
    isCompleted: boolean;  // Has user finished this survey?
  };
}

// Ensure SurveyResponseStatus includes DRAFT
enum SurveyResponseStatus {
  DRAFT = 'draft',  // ← Make sure this exists
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  DECLINED = 'declined',
}
```

---

### 2. Update Survey List Component

**File**: `src/shared/screens/survey-boards/SurveyBoardsComponent.tsx`

**Display Logic**:
```tsx
function SurveyCard({ survey }: { survey: ISurvey }) {
  // Determine survey state based on userResponse
  const getSurveyState = () => {
    if (!survey.userResponse || !survey.userResponse.hasResponded) {
      return {
        label: 'Available',
        color: 'green',
        buttonText: 'Start Survey',
        disabled: false,
        action: 'start'
      };
    }

    // User has started or completed this survey
    if (survey.userResponse.canUpdate) {
      // Draft status - user can continue
      return {
        label: 'In Progress',
        color: 'yellow',
        buttonText: 'Continue Survey',
        disabled: false,
        action: 'continue'
      };
    }

    if (survey.userResponse.isCompleted) {
      // Submitted status - user cannot resubmit
      const statusLabel = {
        submitted: 'Submitted',
        approved: 'Approved',
        declined: 'Declined'
      }[survey.userResponse.status || 'submitted'];

      return {
        label: statusLabel,
        color: survey.userResponse.status === 'approved' ? 'green' : 'blue',
        buttonText: 'Already Responded',
        disabled: true,
        action: 'none'
      };
    }

    // Fallback
    return {
      label: 'Available',
      color: 'green',
      buttonText: 'Start Survey',
      disabled: false,
      action: 'start'
    };
  };

  const state = getSurveyState();

  return (
    <div className={`survey-card ${state.disabled ? 'opacity-60' : ''}`}>
      <div className="survey-header">
        <div className="survey-title-section">
          <h3>{survey.label}</h3>
          {/* Display Survey ID */}
          <span className="text-xs text-gray-500 font-mono">
            {survey.surveyId || `TM-${survey.id}`}
          </span>
        </div>
        <span className={`badge bg-${state.color}-100 text-${state.color}-800`}>
          {state.label}
        </span>
      </div>

      <div className="survey-info">
        {/* Display Industry as a badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-700">Industry:</span>
          <span className="badge bg-gray-100 text-gray-700">
            {survey.industry || 'General'}
          </span>
        </div>
        <p className="text-sm text-gray-600">Price: ${survey.price || 0}</p>
        <p className="text-sm text-gray-600">
          Time: ~{survey.metadata?.timeToComplete || 15} min
        </p>
        {survey.userResponse?.submittedAt && (
          <p className="text-sm text-gray-600">
            Submitted: {new Date(survey.userResponse.submittedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        className={`btn ${state.disabled ? 'btn-disabled cursor-not-allowed' : 'btn-primary'}`}
        disabled={state.disabled}
        onClick={() => handleSurveyAction(survey, state.action)}
      >
        {state.buttonText}
      </button>
    </div>
  );
}

// Handle survey actions
const handleSurveyAction = (survey: ISurvey, action: string) => {
  if (action === 'start') {
    // Navigate to survey detail page
    navigate(`/surveys/${survey.id}`);
  } else if (action === 'continue') {
    // Navigate to survey detail page (will load draft automatically)
    navigate(`/surveys/${survey.id}`);
  } else if (action === 'none') {
    // Do nothing - already submitted
    toast.info('You have already responded to this survey');
  }
};
```

**CSS Styling** (example):
```css
.survey-card.opacity-60 {
  opacity: 0.6;
  pointer-events: none; /* Prevent interaction with completed surveys */
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.bg-green-100 { background-color: #d1fae5; }
.text-green-800 { color: #065f46; }

.bg-yellow-100 { background-color: #fef3c7; }
.text-yellow-800 { color: #92400e; }

.bg-blue-100 { background-color: #dbeafe; }
.text-blue-800 { color: #1e40af; }
```

---

### 3. Update Survey Detail Component

**File**: `src/shared/screens/survey-boards/SurveyDetailComponent.tsx`

**Load Draft on Mount**:
```tsx
const SurveyDetailComponent = ({ surveyId }: { surveyId: string }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyState, setSurveyState] = useState<'available' | 'draft' | 'completed'>('available');

  // Fetch survey details
  const { data: surveyData, isLoading: isLoadingSurvey } = useSurveyDetailsQuery(surveyId);

  // Fetch user's draft if exists
  const { data: draftData } = useQuery({
    queryKey: ['survey-draft', surveyId],
    queryFn: () => surveyService.getDraft(surveyId),
    enabled: !!surveyId,
    retry: false, // Don't retry if draft doesn't exist
  });

  useEffect(() => {
    if (!surveyData) return;

    const userResponse = surveyData.userResponse;

    // Check if user has already completed this survey
    if (userResponse?.isCompleted) {
      setSurveyState('completed');
      return;
    }

    // Check if user has a draft
    if (userResponse?.canUpdate && draftData?.data) {
      setSurveyState('draft');

      // Load draft answers into state
      const draftAnswers: Record<string, any> = {};
      draftData.data.answers.forEach((answer: any) => {
        draftAnswers[answer.questionId] = {
          answer: answer.answer,
          comment: answer.comment || ''
        };
      });

      setAnswers(draftAnswers);

      // Find the first unanswered question to resume from
      const questions = surveyData.template.questions;
      const firstUnansweredIndex = questions.findIndex(
        (q: any) => !draftAnswers[q.id]
      );

      if (firstUnansweredIndex !== -1) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      } else {
        // All questions answered, show review page
        setCurrentQuestionIndex(questions.length);
      }
    } else {
      // New survey
      setSurveyState('available');
    }

    setIsLoading(false);
  }, [surveyData, draftData]);

  // Render based on survey state
  if (isLoading || isLoadingSurvey) {
    return <LoadingSpinner />;
  }

  if (surveyState === 'completed') {
    return (
      <div className="survey-completed-message">
        <div className="alert alert-info">
          <h3>Survey Already Submitted</h3>
          <p>You have already submitted a response to this survey.</p>
          <p className="text-sm text-gray-600">
            Status: {surveyData?.userResponse?.status}
          </p>
          {surveyData?.userResponse?.submittedAt && (
            <p className="text-sm text-gray-600">
              Submitted on: {new Date(surveyData.userResponse.submittedAt).toLocaleString()}
            </p>
          )}
          <button onClick={() => navigate('/surveys')} className="btn btn-primary mt-4">
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-detail-container">
      {surveyState === 'draft' && (
        <div className="alert alert-warning mb-4">
          <p>You have a saved draft for this survey. Continuing from where you left off...</p>
        </div>
      )}

      {/* Survey form components */}
      <SurveyForm
        questions={surveyData.template.questions}
        currentIndex={currentQuestionIndex}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}  // ← NEW: Save draft button
      />
    </div>
  );
};
```

**Auto-Save Draft Logic**:
```tsx
// Auto-save draft every 30 seconds if answers changed
useEffect(() => {
  const autoSaveInterval = setInterval(async () => {
    if (Object.keys(answers).length > 0 && surveyState !== 'completed') {
      await handleSaveDraft(false); // Silent save (no toast notification)
    }
  }, 30000); // Every 30 seconds

  return () => clearInterval(autoSaveInterval);
}, [answers, surveyState]);

// Save draft manually (called by "Save Draft" button or auto-save)
const handleSaveDraft = async (showNotification = true) => {
  try {
    const answersArray = Object.entries(answers).map(([questionId, data]) => ({
      questionId,
      questionType: getQuestionType(questionId), // Helper function
      answer: data.answer,
      comment: data.comment || ''
    }));

    await surveyService.saveDraft(surveyId, {
      respondent: {
        name: user?.name,
        email: user?.email
      },
      answers: answersArray
    });

    if (showNotification) {
      toast.success('Draft saved successfully');
    }
  } catch (error) {
    console.error('Failed to save draft:', error);
    if (showNotification) {
      toast.error('Failed to save draft');
    }
  }
};
```

**Submit Logic** (updated):
```tsx
const handleSubmit = async () => {
  try {
    // Validate all questions answered
    const questions = surveyData.template.questions;
    const unanswered = questions.filter((q: any) => q.required && !answers[q.id]);

    if (unanswered.length > 0) {
      toast.error(`Please answer all required questions (${unanswered.length} remaining)`);
      return;
    }

    // Prepare submission
    const answersArray = Object.entries(answers).map(([questionId, data]) => ({
      questionId,
      questionType: getQuestionType(questionId),
      answer: data.answer,
      comment: data.comment || ''
    }));

    // Submit survey (backend will promote draft to submitted if exists)
    await surveyService.submitSurvey(surveyId, {
      respondent: {
        name: user?.name,
        email: user?.email
      },
      answers: answersArray
    });

    toast.success('Survey submitted successfully!');
    navigate('/surveys');
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message.includes('already submitted')) {
      toast.error('You have already submitted this survey');
    } else {
      toast.error('Failed to submit survey. Please try again.');
    }
  }
};
```

---

### 4. Update API Service

**File**: `src/services/survey/survey.service.ts`

```typescript
class SurveyService {
  /**
   * Get list of surveys (automatically includes user response status if authenticated)
   */
  async getSurveys(filters?: {
    status?: string;
    industry?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    // Axios automatically includes Authorization header if token exists
    return apiService.get<{
      success: boolean;
      data: ISurvey[];  // Each survey now has userResponse field
      total: number;
      page: number;
      limit: number;
    }>('/surveys', { params: filters });
  }

  /**
   * Get survey details (automatically includes user response status if authenticated)
   */
  async getSurveyDetails(surveyId: string) {
    return apiService.get<{
      success: boolean;
      data: {
        survey: ISurvey;
        template: ISurveyTemplate;
        userResponse?: {  // Present if user is authenticated
          hasResponded: boolean;
          status?: SurveyResponseStatus;
          responseId?: string;
          submittedAt?: string;
          canUpdate: boolean;
          isCompleted: boolean;
        };
      };
    }>(`/surveys/${surveyId}/details`);
  }

  /**
   * NEW: Save survey response as draft
   */
  async saveDraft(surveyId: string, data: ISurveySubmission) {
    return apiService.post<{
      success: boolean;
      data: ISurveyResponse;
      message: string;
    }>(`/surveys/${surveyId}/draft`, data);
  }

  /**
   * NEW: Get user's draft response for a survey
   */
  async getDraft(surveyId: string) {
    return apiService.get<{
      success: boolean;
      data: ISurveyResponse;
    }>(`/surveys/${surveyId}/draft`);
  }

  /**
   * Submit survey response
   * Note: If user has a draft, this will promote it to submitted
   */
  async submitSurvey(surveyId: string, data: ISurveySubmission) {
    return apiService.post<{
      success: boolean;
      data: ISurveyResponse;
      message: string;
    }>(`/surveys/${surveyId}/submit`, data);
  }
}
```

---

### 5. Update React Query Hooks

**File**: `src/services/survey/hooks/use-survey-list.query.ts`

```typescript
export const useSurveyListQuery = (filters?: {
  status?: string;
  industry?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['surveys', filters],
    queryFn: () => surveyService.getSurveys(filters),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
```

**File**: `src/services/survey/hooks/use-survey-details.query.ts`

```typescript
export const useSurveyDetailsQuery = (surveyId: string) => {
  return useQuery({
    queryKey: ['survey-details', surveyId],
    queryFn: () => surveyService.getSurveyDetails(surveyId),
    select: (response) => response.data,
    enabled: !!surveyId,
  });
};
```

**NEW File**: `src/services/survey/hooks/use-save-draft.mutation.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { surveyService } from '../survey.service';
import type { ISurveySubmission } from '@/core/types/survey.type';

export const useSaveDraftMutation = (surveyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISurveySubmission) => surveyService.saveDraft(surveyId, data),
    onSuccess: () => {
      // Invalidate survey list to update userResponse status
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey-draft', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey-details', surveyId] });
    },
  });
};
```

**NEW File**: `src/services/survey/hooks/use-get-draft.query.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { surveyService } from '../survey.service';

export const useGetDraftQuery = (surveyId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['survey-draft', surveyId],
    queryFn: () => surveyService.getDraft(surveyId),
    enabled: enabled && !!surveyId,
    retry: false, // Don't retry if draft doesn't exist (404 is expected)
  });
};
```

---

### 6. Add Industry Filter Component

**File**: `src/shared/screens/survey-boards/SurveyFilters.tsx` (new or existing)

```tsx
import { Industry } from '@/core/types/survey.type';

const INDUSTRIES = [
  { value: '', label: 'All Industries' },
  { value: Industry.ADVERTISING_MARKETING, label: 'Advertising & Marketing' },
  { value: Industry.AUTOMOTIVE, label: 'Automotive' },
  { value: Industry.EDUCATION, label: 'Education' },
  { value: Industry.FINANCIAL_SERVICES, label: 'Financial Services & Insurance' },
  { value: Industry.FMCG, label: 'FMCG' },
  { value: Industry.HEALTHCARE, label: 'Healthcare & Life Sciences' },
  { value: Industry.HUMAN_RESOURCES, label: 'Human Resources' },
  { value: Industry.INTERNET_MEDIA, label: 'Internet & Media' },
  { value: Industry.INVESTOR_PE, label: 'Investor & Private Equity' },
  { value: Industry.RETAIL, label: 'Retail & Merchandising' },
  { value: Industry.TECHNOLOGY, label: 'Technology' },
  { value: Industry.OTHERS, label: 'Others' },
];

function SurveyFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    onFilterChange({ industry: industry || undefined, search: searchTerm || undefined });
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    onFilterChange({ industry: selectedIndustry || undefined, search: search || undefined });
  };

  return (
    <div className="survey-filters">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search surveys..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="search-input"
      />

      {/* Industry Dropdown */}
      <select
        value={selectedIndustry}
        onChange={(e) => handleIndustryChange(e.target.value)}
        className="industry-filter"
      >
        {INDUSTRIES.map((industry) => (
          <option key={industry.value} value={industry.value}>
            {industry.label}
          </option>
        ))}
      </select>

      {/* Active Filters Display */}
      {selectedIndustry && (
        <div className="active-filters">
          <span className="filter-badge">
            {INDUSTRIES.find(i => i.value === selectedIndustry)?.label}
            <button onClick={() => handleIndustryChange('')}>×</button>
          </span>
        </div>
      )}
    </div>
  );
}
```

**Usage in SurveyBoardsComponent**:
```tsx
function SurveyBoardsComponent() {
  const [filters, setFilters] = useState({ industry: '', search: '' });

  const { data, isLoading } = useSurveyListQuery({
    status: 'published',
    visibility: 'public',
    industry: filters.industry,
    search: filters.search,
  });

  return (
    <div className="survey-boards">
      <h1>Available Surveys</h1>

      {/* Filter Component */}
      <SurveyFilters onFilterChange={setFilters} />

      {/* Survey Grid */}
      <div className="survey-grid">
        {data?.data.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 UI/UX Recommendations

### Survey Card States

| User Response State | Badge Label | Badge Color | Button Text | Button State |
|---------------------|-------------|-------------|-------------|--------------|
| Not Started | "Available" | Green | "Start Survey" | Enabled |
| Draft (In Progress) | "In Progress" | Yellow/Orange | "Continue Survey" | Enabled |
| Submitted | "Submitted" | Blue | "Already Responded" | Disabled |
| Approved | "Approved" | Green | "Already Responded" | Disabled |
| Declined | "Declined" | Red | "Already Responded" | Disabled |

### Visual Examples

**Available Survey**:
```
┌──────────────────────────────────┐
│ Customer Survey      [Available] │  ← Green badge
│ TM-R001              ← Survey ID │
│ Industry: [Retail]               │  ← Industry badge
│ Price: $0 • Time: 15 min        │
│ [Start Survey]                   │  ← Primary button
└──────────────────────────────────┘
```

**In Progress (Draft)**:
```
┌──────────────────────────────────┐
│ Employee Survey   [In Progress]  │  ← Yellow badge
│ TM-HR002             ← Survey ID │
│ Industry: [Human Resources]      │  ← Industry badge
│ Last saved: 2 hours ago          │  ← Show last save time
│ [Continue Survey]                │  ← Primary button
└──────────────────────────────────┘
```

**Completed (Submitted)**:
```
┌──────────────────────────────────┐
│ Tech Feedback       [Submitted]  │  ← Blue badge (grayed out)
│ TM-T005              ← Survey ID │
│ Industry: [Technology]           │  ← Industry badge
│ Submitted: Nov 14, 2025          │
│ [Already Responded]              │  ← Disabled button
└──────────────────────────────────┘
```

### Industry Codes Reference

All surveys have auto-generated surveyIds based on their industry:

| Industry | Code | Example SurveyID |
|----------|------|------------------|
| All Industries | ALL | TM-ALL001 |
| Advertising & Marketing | AM | TM-AM001 |
| Automotive | A | TM-A001 |
| Education | E | TM-E001 |
| Financial Services & Insurance | FS | TM-FS001 |
| FMCG | F | TM-F001 |
| Healthcare & Life Sciences | H | TM-H001 |
| Human Resources | HR | TM-HR001 |
| Internet & Media | IM | TM-IM001 |
| Investor & Private Equity | IP | TM-IP001 |
| Retail & Merchandising | R | TM-R001 |
| Technology | T | TM-T001 |
| Others | O | TM-O001 |

**Usage in UI**:
- Display surveyId in monospace font (e.g., `font-mono`)
- Show as secondary text below survey title
- Use in search/filter functionality
- Display in survey detail page header

---

## ⚡ User Flow Diagrams

### Flow 1: New User Starts Survey
```
User clicks "Start Survey"
    ↓
Navigate to survey detail page
    ↓
No draft exists → Show first question
    ↓
User answers question 1
    ↓
Auto-save triggered (30s interval)
    ↓
Draft saved to backend
    ↓
User answers question 2
    ↓
Auto-save triggered
    ↓
Draft updated
    ↓
User clicks "Submit"
    ↓
Validate all answers
    ↓
Submit to backend (promotes draft to submitted)
    ↓
Show success message
```

### Flow 2: User Resumes Draft
```
User sees "In Progress" badge on survey card
    ↓
User clicks "Continue Survey"
    ↓
Navigate to survey detail page
    ↓
Draft exists → Load draft from backend
    ↓
Show alert: "Continuing from where you left off"
    ↓
Populate answers from draft
    ↓
Navigate to first unanswered question
    ↓
User completes remaining questions
    ↓
User clicks "Submit"
    ↓
Validate all answers
    ↓
Submit to backend (promotes draft to submitted)
    ↓
Show success message
```

### Flow 3: User Tries to Resubmit
```
User sees "Submitted" badge on survey card
    ↓
Button is disabled → Cannot click
    ↓
(If user somehow navigates to URL directly)
    ↓
Load survey detail page
    ↓
Check userResponse.isCompleted === true
    ↓
Show "Already Submitted" message
    ↓
Hide survey form
    ↓
Show "Back to Surveys" button
```

---

## 🧪 Testing Checklist

### Frontend Testing

- [ ] **Survey List - Not Started**
  - [ ] Show "Available" badge
  - [ ] Enable "Start Survey" button
  - [ ] Clicking navigates to survey detail page

- [ ] **Survey List - Draft Exists**
  - [ ] Show "In Progress" badge
  - [ ] Enable "Continue Survey" button
  - [ ] Show last saved timestamp
  - [ ] Clicking navigates to survey detail page and loads draft

- [ ] **Survey List - Submitted**
  - [ ] Show "Submitted" badge
  - [ ] Disable "Already Responded" button
  - [ ] Show submitted timestamp
  - [ ] Clicking does nothing or shows toast

- [ ] **Survey Detail - New Survey**
  - [ ] Start from question 1
  - [ ] Auto-save works every 30 seconds
  - [ ] Manual "Save Draft" button works
  - [ ] Submit button validates all answers
  - [ ] Successful submission redirects to survey list

- [ ] **Survey Detail - Load Draft**
  - [ ] Draft loaded on mount
  - [ ] Answers populated correctly
  - [ ] Resume from first unanswered question
  - [ ] Show "continuing draft" alert
  - [ ] Auto-save updates existing draft
  - [ ] Submit promotes draft to submitted

- [ ] **Survey Detail - Already Submitted**
  - [ ] Show "Already Submitted" message
  - [ ] Hide survey form
  - [ ] Show submission details (status, timestamp)
  - [ ] "Back to Surveys" button works

- [ ] **Error Handling**
  - [ ] Handle 400 error for duplicate submission
  - [ ] Handle 404 error when no draft exists (silent, no error shown)
  - [ ] Handle network errors gracefully
  - [ ] Show user-friendly error messages

- [ ] **Survey ID Display**
  - [ ] surveyId shown in survey cards (monospace font)
  - [ ] surveyId shown in survey detail page
  - [ ] surveyId format correct (TM-XX###)
  - [ ] Fallback to `TM-{id}` if surveyId missing

- [ ] **Industry Display & Filter**
  - [ ] Industry badge shown on survey cards
  - [ ] Industry filter dropdown works
  - [ ] Filter by industry updates survey list
  - [ ] Active filter badge shown with clear button
  - [ ] "All Industries" option clears filter

---

## 📊 LocalStorage vs Backend Draft Storage

**Previous Implementation** (LocalStorage only):
- ❌ Drafts lost when clearing browser data
- ❌ Cannot resume on different device
- ❌ No server-side tracking

**New Implementation** (Backend storage):
- ✅ Drafts persist across devices
- ✅ Drafts survive browser data clearing
- ✅ Backend tracks user progress
- ✅ Can show "In Progress" status in survey list

**Migration Strategy**:
1. Keep LocalStorage for offline auto-save (backup)
2. Use backend as primary storage
3. On page load, check backend first
4. If backend has newer draft, use it
5. If localStorage has newer draft, sync to backend

**Optional Enhancement**:
```typescript
// Hybrid approach: LocalStorage + Backend
const syncDraft = async () => {
  const localDraft = localStorage.getItem(`survey_draft_${surveyId}`);
  const backendDraft = await surveyService.getDraft(surveyId);

  if (localDraft && backendDraft) {
    // Compare timestamps
    const localTimestamp = JSON.parse(localDraft).timestamp;
    const backendTimestamp = new Date(backendDraft.data.submittedAt).getTime();

    if (localTimestamp > backendTimestamp) {
      // Local is newer, sync to backend
      await surveyService.saveDraft(surveyId, JSON.parse(localDraft).data);
    }
  }
};
```

---

## 🔒 Security Considerations

### Authentication
- ✅ All draft endpoints use `optionalAuth` middleware
- ✅ User ID extracted from verified JWT token
- ✅ Users can only access their own drafts
- ✅ Anonymous users can still take surveys (no draft functionality)

### Data Validation
- ✅ Backend validates all answers on final submission
- ✅ Drafts do not require validation (partial answers allowed)
- ✅ Duplicate submission prevented server-side

---

## 📝 Summary

### Backend Changes (Complete):

#### Feature 1: User Response Status Tracking & Draft Support
1. ✅ Added `canUpdate` and `isCompleted` fields to user response status
2. ✅ Implemented draft save/update/get methods (`saveDraft`, `updateDraft`, `getDraft`)
3. ✅ Updated submission logic to promote drafts to submitted
4. ✅ Added duplicate submission prevention for completed surveys
5. ✅ Created draft API endpoints (`POST /surveys/:id/draft`, `GET /surveys/:id/draft`)
6. ✅ Added auto-promotion of valid drafts to submitted status

#### Feature 2: Disabled State for Submitted Surveys
1. ✅ Survey list API returns `userResponse.isCompleted` flag
2. ✅ Survey detail API returns user response status
3. ✅ Backend prevents duplicate submissions with clear error message
4. ✅ Three distinct states: Available, In Progress (Draft), Submitted

#### Feature 3: Auto-Generated Survey IDs with Industry
1. ✅ Auto-generate surveyId in format `TM-[IndustryCode][Number]`
2. ✅ Industry codes: AM, HR, T, F, FS, H, E, A, R, IM, IP, O, ALL
3. ✅ Unique surveyId per survey with auto-increment per industry
4. ✅ Industry field available in all survey responses
5. ✅ Backend supports industry filtering in survey list API

### Frontend Changes Required:

#### Feature 1: Draft Status & Resume Functionality
1. **Update TypeScript interfaces** - Add `userResponse` with `canUpdate` and `isCompleted` fields to ISurvey
2. **Update Survey List Component** - Show three states: Available (green), In Progress (yellow), Submitted (blue/disabled)
3. **Update Survey Detail Component**:
   - Load draft on mount using `GET /surveys/:id/draft`
   - Auto-save every 30 seconds using `POST /surveys/:id/draft`
   - Resume from first unanswered question
   - Show "Continuing from where you left off" alert
4. **Add Draft API calls** - `saveDraft()`, `getDraft()` service methods
5. **Add React Query hooks** - `useSaveDraftMutation`, `useGetDraftQuery`

#### Feature 2: Disable Submitted Surveys
1. **Survey List Component**:
   - Check `survey.userResponse.isCompleted`
   - If `true`, disable button and show "Already Responded"
   - Apply opacity/grayed-out styling
2. **Survey Detail Component**:
   - Check `userResponse.isCompleted` on page load
   - If `true`, show "Already Submitted" message and hide form
   - Display submission details (status, timestamp)
3. **Error Handling**:
   - Handle 400 error for duplicate submission attempts
   - Show user-friendly message

#### Feature 3: Display Survey ID & Industry
1. **Survey List Component**:
   - Display `survey.surveyId` (e.g., TM-AM001) below survey title
   - Use monospace font (`font-mono`)
   - Show `survey.industry` as a badge/tag
2. **Survey Detail Component**:
   - Show surveyId in header/breadcrumb
   - Display industry badge
3. **Add Industry Filter**:
   - Create dropdown with 13 industry options
   - Pass `industry` filter to API call
   - Show active filters with clear button
4. **Update CSS**:
   - Add styling for industry badges
   - Add styling for surveyId display (monospace, smaller text)

### Testing Checklist:

#### Draft Functionality
- [ ] Test draft auto-save every 30 seconds
- [ ] Test manual "Save Draft" button
- [ ] Test draft load on return visit
- [ ] Test resume from correct question
- [ ] Test draft → submitted promotion

#### Disabled State
- [ ] Test "Already Responded" button is disabled
- [ ] Test grayed-out styling on submitted surveys
- [ ] Test "Already Submitted" message on detail page
- [ ] Test duplicate submission error handling

#### Survey ID & Industry
- [ ] Test surveyId display in survey cards
- [ ] Test surveyId display in survey detail page
- [ ] Test industry badge display
- [ ] Test industry filter functionality
- [ ] Test search by surveyId

---

**Last Updated**: 2025-11-14
**Backend Status**: ✅ Complete
**Frontend Status**: ⏳ Awaiting Implementation

**Backend Documentation**:
- `USER_SURVEY_RESPONSE_TRACKING.md` - User response tracking & draft status (backend API details)
- `SURVEYID_AUTO_GENERATION.md` - Survey ID auto-generation implementation
- `FRONTEND_INTEGRATION.md` - SurveyID and Industry fields integration guide

**Related Backend Files Modified**:
- `src/services/survey-response.service.ts` - Draft save/update/get methods
- `src/services/survey.service.ts` - User response status in survey list
- `src/controllers/survey-response.controller.ts` - Draft endpoints
- `src/routes/v1/surveys.route.ts` - Draft routes
- `src/utils/survey-id-generator.util.ts` - Auto-generate surveyId
- `src/middleware/auth.middleware.ts` - Optional authentication
