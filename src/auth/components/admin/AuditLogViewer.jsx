import { useState, useEffect } from 'react';
import { auditService, AUDIT_ACTIONS } from '../../services/auditService';
import { useAuth } from '../../contexts/AuthContext';
import CustomSelect from '../../../components/CustomSelect';
import DataTable from '../../../components/DataTable';
import ConfirmModal from '../../../components/ConfirmModal';

function SelectionCheckbox({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className="w-4 h-4 rounded cursor-pointer accent-primary"
    />
  );
}

function DetailModal({ log, onClose }) {
  if (!log) return null;
  const m = log.metadata || {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="bg-white dark:bg-[#1e1e38] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-[#1e1e38] border-b border-gray-200 dark:border-white/10 p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{log.action.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{log.userEmail || log.userId || 'Unknown'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Action</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">{log.action.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Timestamp</span>
              <span className="text-sm text-gray-900 dark:text-white">{log.timestamp?.toDate?.().toLocaleString() || new Date(log.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
              <span className="text-sm text-gray-500 dark:text-gray-400">Performed By</span>
              <span className="text-sm text-gray-900 dark:text-white">{log.userEmail || log.userId || '—'}</span>
            </div>
            {m.targetEmail && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Target Email</span>
                <span className="text-sm text-gray-900 dark:text-white">{m.targetEmail}</span>
              </div>
            )}
            {m.targetName && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Student Name</span>
                <span className="text-sm text-gray-900 dark:text-white">{m.targetName}</span>
              </div>
            )}
            {m.studentName && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Student Name</span>
                <span className="text-sm text-gray-900 dark:text-white">{m.studentName}</span>
              </div>
            )}
            {m.title && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Assessment</span>
                <span className="text-sm text-gray-900 dark:text-white">{m.title}</span>
              </div>
            )}
            {m.subject && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Subject</span>
                <span className="text-sm text-gray-900 dark:text-white">{m.subject}</span>
              </div>
            )}
            {m.classNum && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Class</span>
                <span className="text-sm text-gray-900 dark:text-white">{m.classNum}</span>
              </div>
            )}
            {m.targetRole && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                <span className="text-sm text-gray-900 dark:text-white capitalize">{m.targetRole}</span>
              </div>
            )}
            {m.type && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Submission Type</span>
                <span className="text-sm text-gray-900 dark:text-white uppercase">{m.type}</span>
              </div>
            )}
            {m.method && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Method</span>
                <span className="text-sm text-gray-900 dark:text-white">{m.method}</span>
              </div>
            )}
            {m.assessmentId && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Assessment ID</span>
                <span className="text-sm text-gray-900 dark:text-white font-mono text-xs">{m.assessmentId}</span>
              </div>
            )}
            {m.targetId && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Target ID</span>
                <span className="text-sm text-gray-900 dark:text-white font-mono text-xs">{m.targetId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuditLogViewer() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const allLogs = await auditService.getLogs({ limit: 200 });
      setLogs(allLogs);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter((log) => {
    if (actionFilter && log.action !== actionFilter) return false;
    if (dateFrom || dateTo) {
      const ts = log.timestamp?.toDate?.() || new Date(log.timestamp);
      if (dateFrom && ts < new Date(dateFrom)) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setDate(end.getDate() + 1);
        if (ts >= end) return false;
      }
    }
    return true;
  });

  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  const selectedCount = selected.size;
  const allSelected = filteredLogs.length > 0 && filteredLogs.every((log) => selected.has(log.id));

  const toggleSelect = (log) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(log.id)) next.delete(log.id);
      else next.add(log.id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) filteredLogs.forEach((log) => next.delete(log.id));
      else filteredLogs.forEach((log) => next.add(log.id));
      return next;
    });
  };

  const handleDelete = async () => {
    const ids = [...selected];
    if (!ids.length) return;
    setDeleting(true);
    try {
      await auditService.deleteLogs(ids);
      await auditService.log(AUDIT_ACTIONS.AUDIT_LOG_DELETED, user?.uid, { count: ids.length });
      setSelected(new Set());
      setConfirmDelete(false);
      loadLogs();
    } catch (err) {
      console.error('Failed to delete logs:', err);
    }
    setDeleting(false);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    if (ts?.toDate) return ts.toDate().toLocaleString();
    return new Date(ts).toLocaleString();
  };

  const logColumns = [
    {
      key: 'select',
      label: '',
      headerRender: () => <SelectionCheckbox checked={allSelected} onChange={toggleSelectAll} />,
      render: (log) => <SelectionCheckbox checked={selected.has(log.id)} onChange={() => toggleSelect(log)} />,
    },
    { key: 'timestamp', label: 'Timestamp', render: (log) => <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatTimestamp(log.timestamp)}</span> },
    { key: 'action', label: 'Action', render: (log) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">{log.action}</span> },
    { key: 'user', label: 'User', render: (log) => <span className="text-gray-900 dark:text-white">{log.userEmail || log.userId || '—'}</span> },
  ];

  return (
    <div className="animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            System activity and change tracking
          </p>
        </div>
        <button onClick={loadLogs} className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Refresh</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <CustomSelect
          value={actionFilter}
          onChange={setActionFilter}
          options={[
            { value: '', label: 'All Actions' },
            ...uniqueActions.map((a) => ({ value: a, label: a })),
          ]}
          className="min-w-[160px]"
        />
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">From</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 rounded-xl bg-white dark:bg-[#282843] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">To</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 rounded-xl bg-white dark:bg-[#282843] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 self-center whitespace-nowrap">{filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''}</span>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center justify-between mb-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <button onClick={toggleSelectAll} className="text-sm font-medium text-primary hover:underline">{allSelected ? 'Deselect all' : 'Select all'}</button>
            <span className="text-sm text-gray-600 dark:text-gray-300">{selectedCount} selected</span>
          </div>
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
            </svg>
            Delete
          </button>
        </div>
      )}

      <DataTable
        columns={logColumns}
        data={filteredLogs}
        loading={loading}
        loadingMessage="Loading logs..."
        emptyMessage="No logs found"
        rowKey="id"
        onRowClick={(log) => setSelectedLog(log)}
      />

      {selectedLog && <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => { if (!deleting) setConfirmDelete(false); }}
        onConfirm={handleDelete}
        isLoading={deleting}
        variant="danger"
        title={`Delete ${selectedCount} log${selectedCount > 1 ? 's' : ''}?`}
        description="This will permanently delete the selected audit logs from Firebase. This action cannot be undone."
        confirmText="Delete"
        confirmLoadingText="Deleting..."
      />
    </div>
  );
}
