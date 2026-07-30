import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import { useAuth } from '@/shared/providers/auth-provider';
import { contentService } from '@/services/strapi-api/content.service';
import ContentAdminService, {
  type AdminContentRecord,
  type ContentCreatePayload,
} from '@/services/api/content-admin.service';
import { ContentType, ContentCategory } from '@/core/types/content.type';
import { toast } from 'sonner';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

const emptyForm: ContentCreatePayload = {
  label: '',
  description: '',
  slug: '',
  type: ContentType.INSIGHT,
  content: '',
  imgUrl: '',
  tags: '',
  publishedDate: '',
  category: ContentCategory.QUANTITATIVE_RESEARCH,
  published: false,
};

function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ContentManagementContent: React.FC = () => {
  const { user, isAuthReady } = useAuth();
  const [records, setRecords] = useState<AdminContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminContentRecord | null>(null);
  const [form, setForm] = useState<ContentCreatePayload>(emptyForm);

  const fetchRecords = async () => {
    if (!isAuthReady || !user) return;
    setLoading(true);
    try {
      const rows = await contentService.getAllForAdmin();
      setRecords(rows as unknown as AdminContentRecord[]);
    } catch {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthReady, user]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (record: AdminContentRecord) => {
    setEditTarget(record);
    setForm({
      label: record.label,
      description: record.description,
      slug: record.rowKey,
      type: record.type,
      content: record.content,
      imgUrl: record.imgUrl,
      tags: record.tags,
      publishedDate: record.publishedDate || '',
      category: record.category,
      published: record.published,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await ContentAdminService.uploadImage(file);
      if (res.data?.url) {
        setForm((f) => ({ ...f, imgUrl: res.data!.url }));
        toast.success('Image uploaded');
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.label || !form.imgUrl) {
      toast.error('Label and image are required');
      return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        const { slug, ...update } = form;
        await ContentAdminService.update(editTarget.partitionKey, editTarget.rowKey, update);
        toast.success('Content updated');
      } else {
        const slug = form.slug || slugify(form.label);
        await ContentAdminService.create({ ...form, slug });
        toast.success('Content created');
      }
      setShowModal(false);
      fetchRecords();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (record: AdminContentRecord) => {
    try {
      await ContentAdminService.setPublished(record.partitionKey, record.rowKey, !record.published);
      toast.success(record.published ? 'Unpublished' : 'Published');
      fetchRecords();
    } catch {
      toast.error('Failed to update publish state');
    }
  };

  const handleDelete = async (record: AdminContentRecord) => {
    if (!confirm(`Delete "${record.label}"? This cannot be undone.`)) return;
    try {
      await ContentAdminService.delete(record.partitionKey, record.rowKey);
      toast.success('Content deleted');
      fetchRecords();
    } catch {
      toast.error('Failed to delete content');
    }
  };

  return (
    <div className="h-full flex bg-surface-container-low text-text-dark">
      <AdminSidebar />

      <main className="h-full overflow-y-auto flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">Content</h1>
              <p className="text-outline mt-1">{records.length} item{records.length !== 1 ? 's' : ''} total</p>
            </div>
            <button
              onClick={openCreate}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              + New Content
            </button>
          </div>

          <div className="bg-surface-container rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center">
                <LoaderUI />
              </div>
            ) : records.length === 0 ? (
              <div className="p-12 text-center text-outline">No content yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-surface-container-high text-sm text-outline">
                  <tr>
                    <th className="p-4">Label</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={`${record.partitionKey}/${record.rowKey}`} className="border-t border-outline-variant">
                      <td className="p-4 font-medium text-on-surface">{record.label}</td>
                      <td className="p-4 text-outline">{record.type}</td>
                      <td className="p-4 text-outline">{record.category || '—'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePublish(record)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            record.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {record.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 text-outline text-sm">{record.rowKey}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEdit(record)}
                          className="text-primary hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">
              {editTarget ? 'Edit Content' : 'New Content'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-outline mb-1">Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2"
                />
              </div>

              {!editTarget && (
                <div>
                  <label className="block text-sm font-medium text-outline mb-1">
                    Slug (auto-generated from label if left blank)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder={slugify(form.label) || 'auto-generated-slug'}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-outline mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-outline mb-1">Content (HTML)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={6}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-outline mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ContentCreatePayload['type'] }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2"
                  >
                    {Object.values(ContentType).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-outline mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ContentCreatePayload['category'] }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2"
                  >
                    {Object.values(ContentCategory).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-outline mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-outline mb-1">Published Date</label>
                  <input
                    type="date"
                    value={form.publishedDate || ''}
                    onChange={(e) => setForm((f) => ({ ...f, publishedDate: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-outline mb-1">Featured Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {form.imgUrl && (
                  <img src={form.imgUrl} alt="" className="mt-2 h-24 rounded object-cover" />
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-outline">
                <input
                  type="checkbox"
                  checked={!!form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                Published
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-outline hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContentManagement: React.FC = () => (
  <AdminRouteGuard>
    <ContentManagementContent />
  </AdminRouteGuard>
);

export default ContentManagement;
