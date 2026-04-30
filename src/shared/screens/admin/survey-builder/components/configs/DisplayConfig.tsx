// components/configs/DisplayConfig.tsx
// Config panel for TEXT_DISPLAY (display-only) elements.

import React from 'react';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const DisplayConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const cfg = question.config;

  return (
    <div className="space-y-4">
      <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          Display-only element — no response is collected from respondents.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Content (HTML)</label>
        <textarea
          value={cfg.displayHtml ?? ''}
          onChange={(e) => setQuestionConfig(qIdx, { displayHtml: e.target.value })}
          rows={6}
          placeholder={'<p>Enter your content here. You can use basic HTML tags:</p>\n<ul><li><strong>Bold</strong></li><li><em>Italic</em></li><li><u>Underline</u></li></ul>'}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
        <p className="text-xs text-gray-400 mt-1">
          Supports HTML: &lt;strong&gt;, &lt;em&gt;, &lt;u&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;/&lt;li&gt;, &lt;br&gt;
        </p>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">Image URL (optional)</label>
        <input
          type="url"
          value={cfg.displayImageUrl ?? ''}
          onChange={(e) => setQuestionConfig(qIdx, { displayImageUrl: e.target.value || undefined })}
          placeholder="https://example.com/image.png"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {cfg.displayImageUrl && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Image max width</label>
          <input
            type="text"
            value={cfg.displayImageMaxWidth ?? ''}
            onChange={(e) => setQuestionConfig(qIdx, { displayImageMaxWidth: e.target.value || undefined })}
            placeholder="e.g. 400px or 80%"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* Live preview */}
      {(cfg.displayHtml || cfg.displayImageUrl) && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preview</span>
          <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
            {cfg.displayHtml && (
              <div
                className="text-sm text-gray-800 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: cfg.displayHtml }}
              />
            )}
            {cfg.displayImageUrl && (
              <img
                src={cfg.displayImageUrl}
                alt="Display element"
                style={{ maxWidth: cfg.displayImageMaxWidth ?? '100%' }}
                className="rounded"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayConfig;
