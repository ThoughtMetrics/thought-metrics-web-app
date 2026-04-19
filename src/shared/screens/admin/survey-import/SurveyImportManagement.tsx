// src/shared/screens/admin/survey-import/SurveyImportManagement.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, FileText, BarChart2, RefreshCw, X, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import surveyImportService from '@/services/api/survey-import.service';
import type { ImportSurvey, ColumnPreview, ImportJobStatus } from '@/services/api/survey-import.service';
import { ROUTES } from '@/routes/routeConfig';
import { SurveyAnalyticsDetailPanel } from '../survey-analytics-dashboard';
import type { ISurvey } from '@/core/types/survey.type';

// ── System field labels for the column override dropdown ──────────────────
const SYSTEM_FIELD_OPTIONS: { value: string; label: string }[] = [
  { value: 'respondent.name',   label: 'Respondent Name (encrypted)' },
  { value: 'respondent.email',  label: 'Respondent Email (encrypted)' },
  { value: 'respondent.phone',  label: 'Respondent Phone (encrypted)' },
  { value: 'submittedAt',       label: 'Submission Date' },
  { value: 'location.latitude', label: 'GPS Latitude' },
  { value: 'location.longitude',label: 'GPS Longitude' },
  { value: 'submitterZone',     label: 'Zone' },
  { value: 'submitterDistrict', label: 'District' },
  { value: 'submitterAc',       label: 'Assembly Constituency (AC)' },
];

function friendlyFieldLabel(field: string): string {
  const match = SYSTEM_FIELD_OPTIONS.find((o) => o.value === field);
  if (match) return match.label;
  if (field.startsWith('answer:')) return `Survey answer (${field.replace('answer:', '')})`;
  return field;
}

function formatDate(d?: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Wizard step types ─────────────────────────────────────────────────────
type WizardStep = 'name' | 'upload' | 'progress';

interface WizardState {
  step: WizardStep;
  surveyId: string;
  templateMongoId: string;
  surveyName: string;
  preview: ColumnPreview | null;
  columnMap: Record<string, string>;
  jobId: string | null;
  jobStatus: ImportJobStatus | null;
}

// ── Main component ────────────────────────────────────────────────────────
function SurveyImportManagementContent() {
  const [surveys, setSurveys] = useState<ImportSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<ImportSurvey | null>(null);

  // Wizard modal
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizard, setWizard] = useState<WizardState>({
    step: 'name',
    surveyId: '',
    templateMongoId: '',
    surveyName: '',
    preview: null,
    columnMap: {},
    jobId: null,
    jobStatus: null,
  });

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load surveys ────────────────────────────────────────────────────────
  const loadSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const data = await surveyImportService.listSurveys();
      setSurveys(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load surveys');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSurveys(); }, [loadSurveys]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
    abortRef.current?.abort();
  }, []);

  // ── Open wizard for a new survey ────────────────────────────────────────
  const openNewSurvey = () => {
    setWizard({ step: 'name', surveyId: '', templateMongoId: '', surveyName: '', preview: null, columnMap: {}, jobId: null, jobStatus: null });
    setWizardOpen(true);
  };

  // ── Open wizard to import more for an existing survey ───────────────────
  const openImportMore = async (survey: ImportSurvey) => {
    // templateMongoId is returned by the survey list endpoint — use it directly.
    // Fall back to fetching from jobs only if it's somehow missing.
    let templateMongoId = survey.templateMongoId ?? '';
    if (!templateMongoId) {
      try {
        const jobs = await surveyImportService.listJobs(survey.surveyId);
        if (jobs.length > 0) templateMongoId = jobs[0].templateMongoId ?? '';
      } catch { /* ignore */ }
    }

    setWizard({
      step: 'upload',
      surveyId: survey.surveyId,
      templateMongoId,
      surveyName: survey.label,
      preview: null,
      columnMap: {},
      jobId: null,
      jobStatus: null,
    });
    setWizardOpen(true);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    abortRef.current?.abort();
    abortRef.current = null;
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  // ── Step 1: Create survey ───────────────────────────────────────────────
  const [nameLoading, setNameLoading] = useState(false);

  const handleCreateSurvey = async () => {
    if (!wizard.surveyName.trim()) { toast.error('Survey name is required'); return; }
    try {
      setNameLoading(true);
      const result = await surveyImportService.createSurvey(wizard.surveyName.trim());
      setWizard((w) => ({ ...w, surveyId: result.surveyId, templateMongoId: result.templateMongoId, step: 'upload' }));
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to create survey');
    } finally {
      setNameLoading(false);
    }
  };

  // ── Step 2: File upload & column preview ───────────────────────────────
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    const maxMB = 200;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`File too large. Maximum is ${maxMB}MB.`);
      return;
    }
    try {
      setUploadLoading(true);
      const preview = await surveyImportService.previewColumns(wizard.surveyId, file);
      setWizard((w) => ({ ...w, preview, columnMap: { ...preview.detectedMap } }));
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to read file');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleColumnOverride = (header: string, newField: string) => {
    setWizard((w) => ({ ...w, columnMap: { ...w.columnMap, [header]: newField } }));
  };

  const [importLoading, setImportLoading] = useState(false);

  const handleStartImport = async () => {
    if (!wizard.preview) { toast.error('Please upload a file first'); return; }
    try {
      setImportLoading(true);
      const result = await surveyImportService.startImport({
        surveyId: wizard.surveyId,
        templateMongoId: wizard.templateMongoId,
        filePath: wizard.preview.filePath,
        mimeType: wizard.preview.mimeType,
        columnMap: wizard.columnMap,
        totalRows: wizard.preview.totalRows,
      });
      setWizard((w) => ({ ...w, jobId: result.jobId, step: 'progress' }));
      startStreaming(result.jobId);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to start import');
    } finally {
      setImportLoading(false);
    }
  };

  // ── Step 3: SSE streaming (with polling fallback) ──────────────────────
  const startPolling = (jobId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const status = await surveyImportService.getJobStatus(jobId);
        setWizard((w) => ({ ...w, jobStatus: status }));
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          if (status.status === 'completed') {
            toast.success(`Import complete — ${status.insertedCount.toLocaleString()} responses inserted`);
            void loadSurveys();
          } else {
            toast.error('Import failed. Check the error log.');
          }
        }
      } catch { /* ignore polling errors */ }
    }, 2000);
  };

  const startStreaming = (jobId: string) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    surveyImportService
      .streamJobStatus(
        jobId,
        (status) => {
          setWizard((w) => ({ ...w, jobStatus: status as ImportJobStatus }));
          if (status.status === 'completed') {
            toast.success(`Import complete — ${status.insertedCount.toLocaleString()} responses inserted`);
            void loadSurveys();
          } else if (status.status === 'failed') {
            toast.error('Import failed. Check the error log.');
          }
        },
        ctrl.signal
      )
      .catch((err: unknown) => {
        if ((err as Error)?.name === 'AbortError') return; // wizard closed — expected
        // SSE unavailable — fall back to 2-second polling
        startPolling(jobId);
      });
  };

  const handleDownloadErrors = () => {
    if (!wizard.jobStatus?.failedRows?.length) return;
    const blob = new Blob([JSON.stringify(wizard.jobStatus.failedRows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `import-errors-${wizard.jobId}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const progress = wizard.jobStatus
    ? wizard.jobStatus.totalRows > 0
      ? Math.round((wizard.jobStatus.processedRows / wizard.jobStatus.totalRows) * 100)
      : 0
    : 0;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex bg-gray-50">
      <AdminSidebar />

      <div className="h-full overflow-y-auto flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Survey Import</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Import legacy agent-type survey responses from CSV or Excel files.
            </p>
          </div>
          <button
            onClick={openNewSurvey}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import New Survey
          </button>
        </div>

        {/* Surveys table */}
        <div className="bg-white rounded-xl border border-gray-200">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-sm text-red-500">{error}</div>
          ) : surveys.length === 0 ? (
            <div className="text-center py-16">
              <Upload className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">No import surveys yet. Click "Import New Survey" to get started.</p>
            </div>
          ) : (
            <div className="text-sm">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_180px_90px_110px_210px] border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="px-4 py-3">Survey Name</div>
                <div className="px-4 py-3">Survey ID</div>
                <div className="px-4 py-3 text-right">Responses</div>
                <div className="px-4 py-3">Created</div>
                <div className="px-4 py-3 text-right">Actions</div>
              </div>
              {/* Survey rows — each row owns its own analytics panel so it expands inline */}
              {surveys.map((s) => (
                <div key={s.surveyId} className="border-b border-gray-50 last:border-0">
                  <div className="grid grid-cols-[1fr_180px_90px_110px_210px] hover:bg-gray-50 transition-colors">
                    <div className="px-4 py-3 font-medium text-gray-800 truncate">{s.label}</div>
                    <div className="px-4 py-3 font-mono text-xs text-gray-500 truncate">{s.surveyId}</div>
                    <div className="px-4 py-3 text-right text-gray-700">{(s.currentResponses ?? 0).toLocaleString()}</div>
                    <div className="px-4 py-3 text-gray-500">{formatDate(s.createdAt)}</div>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSurvey((prev) => prev?.id === s.id ? null : s)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                            selectedSurvey?.id === s.id
                              ? 'bg-primary/10 text-primary border-primary/40'
                              : 'text-primary border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          {selectedSurvey?.id === s.id ? 'Hide' : 'Analytics'}
                        </button>
                        <button
                          onClick={() => void openImportMore(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Import More
                        </button>
                      </div>
                    </div>
                  </div>
                  {selectedSurvey?.id === s.id && (
                    <div className="border-t border-blue-100 bg-blue-50/30 px-6 py-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {s.label} — Analytics
                        </h3>
                        <button
                          onClick={() => setSelectedSurvey(null)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <SurveyAnalyticsDetailPanel
                        survey={selectedSurvey as unknown as ISurvey}
                        onDownload={() => {}}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wizard Modal */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-gray-800">
                  {wizard.step === 'name' && 'New Import Survey'}
                  {wizard.step === 'upload' && `Import: ${wizard.surveyName || wizard.surveyId}`}
                  {wizard.step === 'progress' && 'Import Progress'}
                </h2>
              </div>
              <button onClick={closeWizard} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-100 text-xs text-gray-400">
              {(['name', 'upload', 'progress'] as WizardStep[]).map((s, i) => (
                <React.Fragment key={s}>
                  <span className={wizard.step === s ? 'text-primary font-medium' : ''}>
                    {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                  {i < 2 && <ChevronRight className="w-3 h-3" />}
                </React.Fragment>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* ── Step 1: Survey Name ────────────────────────────────── */}
              {wizard.step === 'name' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Give this import dataset a name. You can import additional responses into the same survey later.
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Survey Name</label>
                    <input
                      type="text"
                      value={wizard.surveyName}
                      onChange={(e) => setWizard((w) => ({ ...w, surveyName: e.target.value }))}
                      placeholder="e.g. Tamil Nadu Field Survey 2024"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      onKeyDown={(e) => { if (e.key === 'Enter') void handleCreateSurvey(); }}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => void handleCreateSurvey()}
                      disabled={nameLoading || !wizard.surveyName.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {nameLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Upload & Column Mapping ───────────────────── */}
              {wizard.step === 'upload' && (
                <div className="space-y-5">
                  {/* Drop zone */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) void handleFileSelect(e.target.files[0]); }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const f = e.dataTransfer.files[0];
                        if (f) void handleFileSelect(f);
                      }}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      {uploadLoading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-gray-500">Reading file…</p>
                        </div>
                      ) : wizard.preview ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <p className="text-sm font-medium text-gray-700">
                            File loaded — {wizard.preview.totalRows.toLocaleString()} rows detected
                          </p>
                          <p className="text-xs text-gray-400">{wizard.preview.headers.length} columns found. Click to change file.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-gray-300" />
                          <p className="text-sm font-medium text-gray-600">Drop CSV or Excel file here</p>
                          <p className="text-xs text-gray-400">or click to browse — max 200MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column mapping table */}
                  {wizard.preview && wizard.preview.headers.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Column Mapping
                        <span className="ml-2 text-gray-400 normal-case font-normal">
                          — Review auto-detected fields and override if needed
                        </span>
                      </h3>
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wide">
                              <th className="px-3 py-2 text-left font-medium">CSV Column</th>
                              <th className="px-3 py-2 text-left font-medium">Maps to</th>
                              <th className="px-3 py-2 text-left font-medium">Sample</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wizard.preview.headers.map((header) => (
                              <tr key={header} className="border-b border-gray-50 last:border-0">
                                <td className="px-3 py-2 font-mono text-gray-700">{header}</td>
                                <td className="px-3 py-2">
                                  <select
                                    value={wizard.columnMap[header] ?? `answer:${header.toLowerCase().replace(/[\s_-]/g, '')}`}
                                    onChange={(e) => handleColumnOverride(header, e.target.value)}
                                    className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary/30"
                                  >
                                    <optgroup label="Survey Answer (keep as question)">
                                      <option value={`answer:${header.toLowerCase().replace(/[\s_-]/g, '')}`}>
                                        Keep as survey answer
                                      </option>
                                    </optgroup>
                                    <optgroup label="System Field">
                                      {SYSTEM_FIELD_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                      ))}
                                    </optgroup>
                                  </select>
                                </td>
                                <td className="px-3 py-2 text-gray-400 max-w-[140px] truncate">
                                  {wizard.preview!.sampleRows[0]?.[header] ?? '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Security note */}
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Name, email, and phone fields are <strong>encrypted at rest</strong> using AES-256-GCM before being saved to the database.
                      Zone, district, AC, and location fields remain plaintext for analytics queries.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button onClick={closeWizard} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={() => void handleStartImport()}
                      disabled={importLoading || !wizard.preview}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {importLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Start Import
                      {wizard.preview && ` (${wizard.preview.totalRows.toLocaleString()} rows)`}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Progress ───────────────────────────────────── */}
              {wizard.step === 'progress' && (
                <div className="space-y-5">
                  {!wizard.jobStatus ? (
                    <div className="flex items-center justify-center py-8 gap-3 text-sm text-gray-500">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Starting import…
                    </div>
                  ) : (
                    <>
                      {/* Status badge */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          wizard.jobStatus.status === 'completed' ? 'bg-green-100 text-green-700' :
                          wizard.jobStatus.status === 'failed'    ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {wizard.jobStatus.status.charAt(0).toUpperCase() + wizard.jobStatus.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-400">{wizard.jobId}</span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{wizard.jobStatus.processedRows.toLocaleString()} / {wizard.jobStatus.totalRows.toLocaleString()} rows</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              wizard.jobStatus.status === 'failed' ? 'bg-red-400' : 'bg-primary'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Counts */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <p className="text-2xl font-bold text-green-600">{wizard.jobStatus.insertedCount.toLocaleString()}</p>
                          <p className="text-xs text-green-600 mt-0.5">Inserted</p>
                        </div>
                        <div className={`rounded-xl p-4 text-center ${wizard.jobStatus.failedCount > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                          <p className={`text-2xl font-bold ${wizard.jobStatus.failedCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {wizard.jobStatus.failedCount.toLocaleString()}
                          </p>
                          <p className={`text-xs mt-0.5 ${wizard.jobStatus.failedCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>Failed</p>
                        </div>
                      </div>

                      {/* Actions on completion */}
                      {(wizard.jobStatus.status === 'completed' || wizard.jobStatus.status === 'failed') && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {wizard.jobStatus.status === 'completed' && (
                            <a
                              href={`/admin/survey-analytics?surveyId=${wizard.surveyId}`}
                              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              <BarChart2 className="w-4 h-4" />
                              View Analytics
                            </a>
                          )}
                          {wizard.jobStatus.failedCount > 0 && wizard.jobStatus.failedRows?.length > 0 && (
                            <button
                              onClick={handleDownloadErrors}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              Download Error Log
                            </button>
                          )}
                          <button
                            onClick={closeWizard}
                            className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      )}

                      {(wizard.jobStatus.status === 'processing' || wizard.jobStatus.status === 'pending') && (
                        <p className="text-xs text-gray-400 text-center">
                          Processing in background — you can close this window and check back later.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Export with guard ─────────────────────────────────────────────────────
export function SurveyImportManagement() {
  return (
    <AdminRouteGuard>
      <SurveyImportManagementContent />
    </AdminRouteGuard>
  );
}
