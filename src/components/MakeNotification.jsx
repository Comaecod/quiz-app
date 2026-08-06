import { useState, useEffect, useMemo, useCallback } from 'react';
import { addNotification, getAllNotifications, updateNotification, deleteNotification } from '../services/notificationService';
import { useAuth } from '../auth/contexts/AuthContext';
import { auditService, AUDIT_ACTIONS } from '../auth/services/auditService';
import CustomSelect from './CustomSelect';
import DataTable from './DataTable';
import ConfirmModal from './ConfirmModal';

const toDate = (ts) => {
  if (!ts) return null;
  if (typeof ts.toDate === 'function') return ts.toDate();
  if (ts instanceof Date) return ts;
  const d = new Date(ts);
  return isNaN(d.getTime()) ? null : d;
};

const toInputValue = (ts) => {
  const d = toDate(ts);
  if (!d) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (ts) => {
  const d = toDate(ts);
  if (!d) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
};

const formatDateTime = (ts) => {
  const d = toDate(ts);
  if (!d) return '—';
  const pad = (n) => String(n).padStart(2, '0');
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const isActive = (n) => {
  const exp = toDate(n.expiresAt);
  return exp ? exp > new Date() : false;
};

const emptyForm = { title: '', message: '', expiresAt: '' };

export default function MakeNotification() {
  const { user, isSuperAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAllNotifications();
      setNotifications(list);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (n) => {
    setEditingId(n.id);
    setForm({ title: n.title || '', message: n.message || '', expiresAt: toInputValue(n.expiresAt) });
    setFormError('');
    setShowForm(true);
    setViewing(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim() || !form.expiresAt) return;
    setSubmitting(true);
    setFormError('');
    try {
      if (editingId) {
        await updateNotification(editingId, { title: form.title.trim(), message: form.message.trim(), expiresAt: form.expiresAt });
        await auditService.log(AUDIT_ACTIONS.NOTIFICATION_UPDATED, user?.uid, { notificationId: editingId, title: form.title.trim() });
      } else {
        await addNotification({ title: form.title.trim(), message: form.message.trim(), expiresAt: form.expiresAt });
        await auditService.log(AUDIT_ACTIONS.NOTIFICATION_CREATED, user?.uid, { title: form.title.trim() });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      loadAll();
    } catch (err) {
      setFormError(err.message || 'Failed to save notification');
    }
    setSubmitting(false);
  };

  const handleDelete = async (n) => {
    try {
      await deleteNotification(n.id);
      await auditService.log(AUDIT_ACTIONS.NOTIFICATION_DELETED, user?.uid, { notificationId: n.id, title: n.title });
      if (viewing?.id === n.id) setViewing(null);
      loadAll();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const filtered = useMemo(() => {
    let data = notifications.filter(n => {
      if (statusFilter === 'active' && !isActive(n)) return false;
      if (statusFilter === 'expired' && isActive(n)) return false;
      if (dateFrom) {
        const created = toDate(n.createdAt);
        if (created && created < new Date(`${dateFrom}T00:00:00`)) return false;
      }
      if (dateTo) {
        const created = toDate(n.createdAt);
        if (created && created > new Date(`${dateTo}T23:59:59.999`)) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (n.title || '').toLowerCase().includes(q) || (n.message || '').toLowerCase().includes(q);
      }
      return true;
    });

    data.sort((a, b) => {
      let va, vb;
      if (sortKey === 'createdAt' || sortKey === 'expiresAt') {
        va = toDate(a[sortKey])?.getTime?.() || 0;
        vb = toDate(b[sortKey])?.getTime?.() || 0;
      } else {
        va = String(a[sortKey] ?? '').toLowerCase();
        vb = String(b[sortKey] ?? '').toLowerCase();
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [notifications, search, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true, render: (n) => <span className="font-medium text-gray-900 dark:text-white">{n.title || '—'}</span> },
    { key: 'message', label: 'Message', render: (n) => <span className="text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">{n.message}</span> },
    { key: 'status', label: 'Status', render: (n) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive(n) ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'}`}>
        {isActive(n) ? 'Active' : 'Expired'}
      </span>
    )},
    { key: 'createdAt', label: 'Created', sortable: true, render: (n) => <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(n.createdAt)}</span> },
    { key: 'expiresAt', label: 'Expires', sortable: true, render: (n) => <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(n.expiresAt)}</span> },
    ...(isSuperAdmin ? [{
      key: 'actions', label: 'Actions', className: 'text-center', render: (n) => (
        <div className="flex items-center justify-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(n); }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-all">Edit</button>
          <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(n); }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all">Delete</button>
        </div>
      ),
    }] : []),
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create, manage, and track announcements</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadAll} className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all">+ Create Notification</button>
        </div>
      </div>

      {formError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
          <p className="text-red-600 dark:text-red-400 text-sm">⚠️ {formError}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by title or message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white dark:bg-[#282843] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'expired', label: 'Expired' },
          ]}
          className="min-w-[130px]"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={e => setDateFrom(e.target.value)}
            title="From date"
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#282843] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
          />
          <span className="text-gray-400 text-sm">→</span>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={e => setDateTo(e.target.value)}
            title="To date"
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#282843] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
          />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="px-3 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">Clear</button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        loadingMessage="Loading notifications..."
        emptyMessage={notifications.length === 0 ? 'No notifications found.' : 'No notifications match your filters.'}
        rowKey="id"
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onRowClick={isSuperAdmin ? (n) => setViewing(n) : undefined}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => { if (!submitting) { setShowForm(false); setEditingId(null); } }}>
          <div className="bg-white dark:bg-[#1e1e38] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Notification' : 'Create Notification'}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Exam Schedule Updated"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-primary/50 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Write the notification message..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-primary/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Expires At *</label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 px-6 py-3 rounded-xl font-medium bg-black/5 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all">Cancel</button>
                <button
                  type="submit"
                  disabled={submitting || !form.title.trim() || !form.message.trim() || !form.expiresAt}
                  className="flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Notification' : 'Add Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setViewing(null)}>
          <div className="bg-white dark:bg-[#1e1e38] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{viewing.title}</h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isActive(viewing) ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>{isActive(viewing) ? 'Active' : 'Expired'}</span>
              </div>
              <button onClick={() => setViewing(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewing.message || '—'}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatDateTime(viewing.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Expires</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatDateTime(viewing.expiresAt)}</p>
                </div>
              </div>
              {isSuperAdmin && (
                <div className="flex gap-3 pt-1">
                  <button onClick={() => openEdit(viewing)} className="flex-1 px-6 py-3 rounded-xl font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-all">Edit</button>
                  <button onClick={() => { setConfirmDelete(viewing); }} className="flex-1 px-6 py-3 rounded-xl font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all">Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { handleDelete(confirmDelete); setConfirmDelete(null); }}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? It will be removed for all users."
        confirmText="Delete"
        confirmLoadingText="Deleting..."
      />
    </div>
  );
}
