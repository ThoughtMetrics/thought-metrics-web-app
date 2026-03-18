// components/QuestionConfigPanel.tsx

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import TemplateSettingsPanel from './TemplateSettingsPanel';
import TextConfig from './configs/TextConfig';
import ChoiceConfig from './configs/ChoiceConfig';
import ScaleConfig from './configs/ScaleConfig';
import SliderConfig from './configs/SliderConfig';
import MatrixConfig from './configs/MatrixConfig';
import FileConfig from './configs/FileConfig';
import ConditionalLogicConfig from './ConditionalLogicConfig';
import OptionFilterConfig from './configs/OptionFilterConfig';

const TEXT_TYPES = new Set([
  QuestionType.TEXT, QuestionType.TEXTAREA, QuestionType.NUMBER,
  QuestionType.EMAIL, QuestionType.PHONE, QuestionType.DATE,
  QuestionType.CURRENCY,
]);

const CHOICE_TYPES = new Set([
  QuestionType.MCQ_SINGLE, QuestionType.MCQ_MULTIPLE, QuestionType.RANKING,
]);

const SCALE_TYPES = new Set([
  QuestionType.RATING, QuestionType.LIKERT_SCALE, QuestionType.SCALE,
]);

const SLIDER_TYPES = new Set([
  QuestionType.DOUBLE_SLIDER, QuestionType.MULTI_SLIDER,
]);

const MATRIX_TYPES = new Set([
  QuestionType.MATRIX, QuestionType.MAX_DIFF, QuestionType.CONSTANT_SUM,
]);

const LANG_LABELS: Record<SupportedBuilderLanguage, string> = { en: 'English', ta: 'Tamil' };

const QuestionConfigPanel: React.FC = () => {
  const {
    questions,
    selectedQuestionIndex,
    activeLanguage,
    setActiveLanguage,
    setQuestionField,
    setQuestionTranslation,
    changeQuestionType,
  } = useSurveyBuilderStore();

  if (selectedQuestionIndex === null) {
    return (
      <div className="h-full bg-white overflow-y-auto">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Template Settings</h3>
        </div>
        <TemplateSettingsPanel />
      </div>
    );
  }

  const question = questions[selectedQuestionIndex];
  if (!question) return null;

  const lang = activeLanguage;
  const t = question.translations[lang];

  const renderTypeConfig = () => {
    if (TEXT_TYPES.has(question.questionType)) {
      return <TextConfig question={question} qIdx={selectedQuestionIndex} lang={lang} />;
    }
    if (CHOICE_TYPES.has(question.questionType)) {
      return <ChoiceConfig question={question} qIdx={selectedQuestionIndex} lang={lang} />;
    }
    if (SCALE_TYPES.has(question.questionType)) {
      return <ScaleConfig question={question} qIdx={selectedQuestionIndex} lang={lang} />;
    }
    if (SLIDER_TYPES.has(question.questionType)) {
      return <SliderConfig question={question} qIdx={selectedQuestionIndex} />;
    }
    if (MATRIX_TYPES.has(question.questionType)) {
      return <MatrixConfig question={question} qIdx={selectedQuestionIndex} />;
    }
    if (question.questionType === QuestionType.FILE) {
      return <FileConfig question={question} qIdx={selectedQuestionIndex} />;
    }
    return null;
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Question type selector */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <label className="block text-xs text-gray-500 mb-1.5 font-medium">Question Type</label>
        <select
          value={question.questionType}
          onChange={(e) => changeQuestionType(selectedQuestionIndex!, e.target.value as QuestionType)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
        >
          <optgroup label="Text">
            <option value={QuestionType.TEXT}>Short Text</option>
            <option value={QuestionType.TEXTAREA}>Long Text</option>
            <option value={QuestionType.NUMBER}>Number</option>
            <option value={QuestionType.EMAIL}>Email</option>
            <option value={QuestionType.PHONE}>Phone</option>
            <option value={QuestionType.DATE}>Date</option>
            <option value={QuestionType.CURRENCY}>Currency</option>
          </optgroup>
          <optgroup label="Choice">
            <option value={QuestionType.MCQ_SINGLE}>Single Choice (MCQ)</option>
            <option value={QuestionType.MCQ_MULTIPLE}>Multiple Choice</option>
            <option value={QuestionType.RANKING}>Ranking</option>
          </optgroup>
          <optgroup label="Scale">
            <option value={QuestionType.RATING}>Star Rating</option>
            <option value={QuestionType.LIKERT_SCALE}>Likert Scale</option>
            <option value={QuestionType.SCALE}>Slider Scale</option>
            <option value={QuestionType.DOUBLE_SLIDER}>Double Slider</option>
            <option value={QuestionType.MULTI_SLIDER}>Multi Slider</option>
          </optgroup>
          <optgroup label="Grid">
            <option value={QuestionType.MATRIX}>Matrix</option>
            <option value={QuestionType.MAX_DIFF}>Max Diff</option>
            <option value={QuestionType.CONSTANT_SUM}>Constant Sum</option>
            <option value={QuestionType.FILE}>File Upload</option>
          </optgroup>
        </select>
      </div>

      {/* Lang tabs */}
      <div className="flex gap-1 p-3 border-b border-gray-200">
        {(['en', 'ta'] as SupportedBuilderLanguage[]).map((l) => (
          <button
            key={l}
            onClick={() => setActiveLanguage(l)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              lang === l
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Question text */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Question Text ({lang.toUpperCase()})
          </label>
          <textarea
            value={t.text}
            onChange={(e) => {
              setQuestionTranslation(selectedQuestionIndex, lang, { text: e.target.value });
              if (lang === 'en') {
                setQuestionField(selectedQuestionIndex, 'text', e.target.value);
              }
            }}
            placeholder="Enter question text..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Required / Comment toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => setQuestionField(selectedQuestionIndex, 'required', e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-xs font-medium text-gray-700">Required</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.allowComment}
              onChange={(e) => setQuestionField(selectedQuestionIndex, 'allowComment', e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-xs font-medium text-gray-700">Allow Comment</span>
          </label>
        </div>

        {/* Type-specific config */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Question Options
          </h4>
          {renderTypeConfig()}
        </div>

        {/* Option filter — only for MCQ question types */}
        {(question.questionType === QuestionType.MCQ_SINGLE ||
          question.questionType === QuestionType.MCQ_MULTIPLE) && (
          <OptionFilterConfig question={question} qIdx={selectedQuestionIndex} />
        )}

        {/* Conditional logic */}
        <ConditionalLogicConfig question={question} qIdx={selectedQuestionIndex} />
      </div>
    </div>
  );
};

export default QuestionConfigPanel;
