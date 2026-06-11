// src/shared/ui/atoms/survey-questions/FileUpload.tsx
import type { BaseSurveyQuestionProps } from '@/core/types/survey.type';
import type React from 'react';
import { useRef, useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { useLanguage } from '@/core/hooks/use-language';
import surveyService from '@/services/survey/survey.service';

// Standard file size limit: 5MB
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export interface UploadedFile {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface FileUploadProps extends BaseSurveyQuestionProps {
  questionId: string; // Required for upload
  value?: UploadedFile;
  onFileChange: (file: UploadedFile | null) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  accept?: string;
  subLabel?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  questionId,
  value,
  onFileChange,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  accept,
  subLabel,
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
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `${translations.surveyQuestions.fileTooLarge || 'File size exceeds'} ${maxSizeMB}MB`;
    }
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return translations.surveyQuestions.invalidFileType || 'Invalid file type';
    }
    return null;
  };

  const handleFileSelect = async (file: File) => {
    setFileError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Azure Blob Storage
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
    } catch (err) {
      console.error('File upload error:', err);
      setFileError(translations.surveyQuestions.fileReadError || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAcceptString = (): string => {
    if (accept) return accept;
    return allowedTypes.join(',');
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

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
        {/* Sub-label / Instructions */}
        {subLabel && (
          <p className="text-sm text-custom-grey-3">{subLabel}</p>
        )}

        {/* Drop Zone */}
        {!value ? (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border border-dashed rounded-lg p-8 text-center transition-colors
              ${isUploading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
              ${isDragging
                ? 'border-primary bg-primary/5'
                : 'border-custom-grey-1 hover:border-primary bg-surface-container'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptString()}
              onChange={handleInputChange}
              className="hidden"
              disabled={isUploading}
            />
            <div className="space-y-2">
              {isUploading ? (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-base text-on-surface">
                    {translations.common.uploading || 'Uploading...'}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-custom-grey-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-custom-grey-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-base text-on-surface">
                    {translations.surveyQuestions.dragDropFile || 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-sm text-custom-grey-3">
                    {translations.surveyQuestions.maxFileSize || 'Max size'}: {maxSizeMB}MB
                  </p>
                  <p className="text-xs text-custom-grey-3">
                    {translations.surveyQuestions.allowedTypes || 'Allowed'}: JPG, PNG, PDF
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* File Preview */
          <div className="border border-custom-grey-1 rounded-lg p-4 bg-surface-container">
            <div className="flex items-center gap-4">
              {/* Preview or Icon */}
              {isImage(value.mimeType) ? (
                <img
                  src={value.url}
                  alt={value.fileName}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-custom-grey-2 flex items-center justify-center">
                  <svg className="w-8 h-8 text-custom-grey-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-on-surface truncate">
                  {value.fileName}
                </p>
                <p className="text-sm text-custom-grey-3">
                  {formatFileSize(value.fileSize)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemoveFile}
                className="p-2 text-custom-grey-3 hover:text-red-500 transition-colors"
                title={translations.surveyQuestions.removeFile || 'Remove'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {fileError && (
          <p className="text-sm text-red-500">{fileError}</p>
        )}

        {/* Size limit info */}
        <p className="text-xs text-custom-grey-3">
          {translations.surveyQuestions.supportedFormats || 'Supported formats'}: JPG, PNG, PDF • {translations.surveyQuestions.maxSize || 'Max'}: {maxSizeMB}MB
        </p>
      </div>
    </SurveyQuestionWrapper>
  );
};
