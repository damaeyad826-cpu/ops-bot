import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  User,
  Ticket,
  KeyRound,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { AuditLogEntry, UserSession } from '../../types/bot';

interface AuditLogsModuleProps {
  logs: AuditLogEntry[];
  onClearLogs: () => void;
  currentUser: UserSession;
}

export const AuditLogsModule: React.FC<AuditLogsModuleProps> = ({
  logs,
  onClearLogs,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = selectedFilter === 'all' || log.actionType === selectedFilter;
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.moderator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.target && log.target.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getBadgeStyle = (type: AuditLogEntry['actionType']) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'timeout':
        return 'bg-sky-500/15 border-sky-500/30 text-sky-300';
      case 'ban':
      case 'prison':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
      case 'ticket_claim':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      case 'command_edit':
        return 'bg-[#5865F2]/15 border-[#5865F2]/30 text-[#8b95fa]';
      case 'ip_whitelist_edit':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-300';
      default:
        return 'bg-slate-700/30 border-slate-600 text-slate-300';
    }
  };

  const getActionLabel = (type: AuditLogEntry['actionType']) => {
    switch (type) {
      case 'warning':
        return 'تحذير عضو';
      case 'timeout':
        return 'مهلة صمت (Timeout)';
      case 'ban':
        return 'حظر من السيرفر';
      case 'prison':
        return 'سجن إداري';
      case 'ticket_claim':
        return 'استلام تذكرة';
      case 'command_edit':
        return 'تعديل أمر/صلاحيات';
      case 'ip_whitelist_edit':
        return 'تحديث قائمة IP';
      case 'points_edit':
        return 'تعديل نقاط';
      default:
        return type;
    }
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ops_audit_logs_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[#5865F2]" />
            سجل النشاطات والمراقبة المركزية (Centralized Audit Trail)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            سجل سحابي مباشر يرصد كافة إجراءات العقوبات، استلام التذاكر، وتعديلات اللوحة مع وقت وتفاصيل كل حدث.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="px-3 py-2 bg-[#182030] hover:bg-[#25324c] text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير JSON</span>
          </button>

          {currentUser.isOwner && (
            <button
              onClick={onClearLogs}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في السجلات باسم الإداري أو العضو أو التفاصيل..."
            className="w-full bg-[#111622] border border-[#1e2536] rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#5865F2]"
          />
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'warning', label: 'التحذيرات' },
            { id: 'timeout', label: 'التايم أوت' },
            { id: 'ticket_claim', label: 'التذاكر' },
            { id: 'command_edit', label: 'الأوامر' },
            { id: 'ip_whitelist_edit', label: 'قائمة IP' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === f.id
                  ? 'bg-[#5865F2] text-white shadow-xs'
                  : 'bg-[#111622] text-slate-300 hover:text-white border border-[#1e2536]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#111622] border border-[#1e2536] rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-[#1b2230] flex items-center justify-between text-xs text-slate-400">
          <span>العمليات المسجلة: <strong className="text-white font-mono">{filteredLogs.length}</strong></span>
          <span className="font-mono">قاعدة البيانات: WAL Realtime Sync</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <ScrollText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">لا توجد سجلات تطابق شروط البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0e131d] text-slate-400 border-b border-[#1b2230]">
                <tr>
                  <th className="p-3">نوع العملية</th>
                  <th className="p-3">الإداري المنفذ</th>
                  <th className="p-3">الهدف / العضو</th>
                  <th className="p-3">تفاصيل الإجراء</th>
                  <th className="p-3 text-left">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2230]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#141b27] transition-colors">
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getBadgeStyle(
                          log.actionType
                        )}`}
                      >
                        {getActionLabel(log.actionType)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={log.moderator.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-white">{log.moderator.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {log.target ? (
                        <span className="font-mono text-slate-300">@{log.target.name}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-slate-200 leading-relaxed">{log.details}</span>
                    </td>
                    <td className="p-3 text-left font-mono text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
