// src/shared/ui/atoms/survey-questions/AudioUpload.tsx
import type { BaseSurveyQuestionProps } from '@/core/types/survey.type';
import type React from 'react';
import { useRef, useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { useLanguage } from '@/core/hooks/use-language';
import surveyService from '@/services/survey/survey.service';
import type { UploadedFile } from './FileUpload';

const DEFAULT_MAX_SIZE_MB = 50;
const DEFAULT_MAX_DURATION_SEC = 120;
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg'];

export interface AudioUploadProps extends BaseSurveyQuestionProps {
  questionId: string;
  value?: UploadedFile;
  onFileChange: (file: UploadedFile | null) => void;
  maxSizeMB?: number;
  maxDurationSec?: number;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  questionId,
  value,
  onFileChange,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  maxDurationSec = DEFAULT_MAX_DURATION_SEC,
  comment,
  onCommentChange,
  showComment,
  showIntensePurchase,
  intensePurchaseLabel,
  progress,
  onBack,
  onNext,
  error,
  isNextDisabled,
  isLastQuestion,
  isOptional,
  hasAnswer,
}) => {
  const { translations } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.size > maxSizeBytes) {
        resolve(`File exceeds ${maxSizeMB}MB limit`);
        return;
      }
      if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
        resolve('Only MP3, MP4 audio, WAV, WebM, or OGG files are supported');
        return;
      }
      const audioEl = document.createElement('audio');
      audioEl.preload = 'metadata';
      audioEl.onloadedmetadata = () => {
        URL.revokeObjectURL(audioEl.src);
        if (audioEl.duration > maxDurationSec) {
          resolve(`Audio must be under ${maxDurationSec} seconds`);
        } else {
          resolve(null);
        }
      };
      audioEl.onerror = () => { URL.revokeObjectURL(audioEl.src); resolve(null); };
      audioEl.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    setFileError(null);
    const validationError = await validateFile(file);
    if (validationError) { setFileError(validationError); return; }

    setIsUploading(true);
    try {
      const response = await surveyService.uploadFile(file, surveyId, questionId);
      if (response.success && response.data) {
        onFileChange({
          url: response.data.url,
          fileName: response.data.fileName,
          fileSize: response.data.fileSize,
          mimeType: response.data.mimeType,
        });
      } else {
        setFileError(translations.surveyQuestions.fileReadError || 'Error uploading file');
      }
    } catch {
      setFileError(translations.surveyQuestions.fileReadError || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <SurveyQuestionWrapper
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      question={question}
      surveyId={surveyId}
      surveyLabel={surveyLabel}
      comment={comment}
      onCommentChange={onCommentChange}
      showComment={showComment}
      showIntensePurchase={showIntensePurchase}
      intensePurchaseLabel={intensePurchaseLabel}
      progress={progress}
      onBack={onBack}
      onNext={onNext}
      error={error}
      isNextDisabled={isNextDisabled || isUploading}
      isLastQuestion={isLastQuestion}
      isOptional={isOptional}
      hasAnswer={hasAnswer}
    >
      <div className="space-y-4">
        {!value ? (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileSelect(f); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`border border-dashed rounded-lg p-8 text-center transition-colors ${isUploading ? 'cursor-wait opacity-70' : 'cursor-pointer'} ${isDragging ? 'border-primary bg-primary/5' : 'border-custom-grey-1 hover:border-primary bg-white'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/ogg"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              className="hidden"
              disabled={isUploading}
            />
            <div className="space-y-2">
              {isUploading ? (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <p className="text-base text-black">{translations.common.uploading || 'Uploading...'}</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-custom-grey-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-custom-grey-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 3a4 4 0 014 4v4a4 4 0 01-8 0V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <p className="text-base text-black">Drag & drop or click to upload audio</p>
                  <p className="text-sm text-custom-grey-3">MP3, WAV, OGG · Max {maxSizeMB}MB · Max {maxDurationSec}s</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-custom-grey-1 rounded-lg p-4 bg-white space-y-3">
            <audio src={value.url} controls className="w-full" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black truncate">{value.fileName}</p>
                <p className="text-xs text-custom-grey-3">{formatFileSize(value.fileSize)}</p>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 text-custom-grey-3 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {fileError && <p className="text-sm text-red-500">{fileError}</p>}
      </div>
    </SurveyQuestionWrapper>
  );
};
