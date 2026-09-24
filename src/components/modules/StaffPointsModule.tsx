import React, { useState } from 'react';
import {
  Award,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Shield,
  Ticket,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { StaffPointUser, UserSession } from '../../types/bot';

interface StaffPointsModuleProps {
  staffList: StaffPointUser[];
  onUpdatePoints: (userId: string, deltaPoints: number, reason: string) => void;
  currentUser: UserSession;
}

export const StaffPointsModule: React.FC<StaffPointsModuleProps> = ({
  staffList,
  onUpdatePoints,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffPointUser | null>(null);
  const [pointDelta, setPointDelta] = useState<number>(5);
  const [reason, setReason] = useState('مكافأة تميز في استلام التذاكر وحل المشكلات');
  const [modalType, setModalType] = useState<'add' | 'deduct' | null>(null);

  const sortedList = [...staffList].sort((a, b) => b.points - a.points);
  const filteredList = sortedList.filter(
    (s) =>
      s.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  const handleOpenModal = (staff: StaffPointUser, type: 'add' | 'deduct') => {
    setSelectedStaff(staff);
    setModalType(type);
    setPointDelta(5);
    setReason(type === 'add' ? 'مكافأة تفاعل إداري وحضور مميز' : 'خصم نقاط بسبب مخالفة إدارية أو تأخر في الرد');
  };

  const handleConfirmPointsChange = () => {
    if (!selectedStaff || pointDelta <= 0) return;
    const finalDelta = modalType === 'add' ? pointDelta : -pointDelta;
    onUpdatePoints(selectedStaff.userId, finalDelta, reason);
    setModalType(null);
    setSelectedStaff(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            لوحة وليدربورد نقاط الإدارة (Staff Points & Top 10)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            متابعة إنجازات طاقم الإدارة والدعم، ومكافأة أو خصم النقاط بضغطة زر مع تسجيل سبب الخصم/الإضافة.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن إداري..."
            className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#5865F2]"
          />
        </div>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedList.slice(0, 3).map((staff, idx) => (
          <div
            key={staff.userId}
            className={`p-5 rounded-2xl border relative overflow-hidden bg-[#111622] ${
              idx === 0
                ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-[#111622]'
                : idx === 1
                ? 'border-slate-400/40 bg-gradient-to-b from-slate-400/10 to-[#111622]'
                : 'border-amber-700/40 bg-gradient-to-b from-amber-700/10 to-[#111622]'
            }`}
          >
            <div className="text-2xl mb-2">{medals[idx]}</div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={staff.avatar}
                alt={staff.displayName}
                className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-white truncate">{staff.displayName}</h4>
                <p className="text-xs text-slate-400 truncate">{staff.roles[0] || 'طاقم الإدارة'}</p>
              </div>
            </div>

            <div className="flex items-baseline justify-between border-t border-[#1b2230] pt-3">
              <span className="text-xs text-slate-400">إجمالي النقاط:</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
                {staff.points} نقطة
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>تذاكر: {staff.ticketsClaimed}</span>
              <span>تحذيرات: {staff.warningsIssued}</span>
              <span>تايم أوت: {staff.timeoutsIssued}</span>
            </div>

            {/* Quick adjust buttons */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => handleOpenModal(staff, 'add')}
                className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة نقاط</span>
              </button>
              <button
                onClick={() => handleOpenModal(staff, 'deduct')}
                className="flex-1 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>خصم</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Complete Staff Table */}
      <div className="bg-[#111622] border border-[#1e2536] rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-[#1b2230] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">ترتيب كافة إداريي ومشرفي السيرفر</h3>
          <span className="text-xs text-slate-400 font-mono">العدد الإجمالي: {filteredList.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0e131d] text-slate-400 border-b border-[#1b2230] font-medium">
              <tr>
                <th className="p-3">الترتيب</th>
                <th className="p-3">الإداري</th>
                <th className="p-3">الرتبة</th>
                <th className="p-3 text-center">التذاكر المستلمة</th>
                <th className="p-3 text-center">التحذيرات</th>
                <th className="p-3 text-center">التايم أوت</th>
                <th className="p-3 text-center">مجموع النقاط</th>
                <th className="p-3 text-left">إجراءات سريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2230]">
              {filteredList.map((staff, idx) => (
                <tr key={staff.userId} className="hover:bg-[#141b27] transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-300">
                    {idx < 10 ? medals[idx] : `#${idx + 1}`}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img src={staff.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white">{staff.displayName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">@{staff.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#182133] border border-[#26354f] text-[11px] text-slate-300">
                      {staff.roles[0] || 'إداري'}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-300">{staff.ticketsClaimed}</td>
                  <td className="p-3 text-center font-mono text-slate-300">{staff.warningsIssued}</td>
                  <td className="p-3 text-center font-mono text-slate-300">{staff.timeoutsIssued}</td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-extrabold text-amber-400 text-sm">
                      {staff.points}
                    </span>
                  </td>
                  <td className="p-3 text-left">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => handleOpenModal(staff, 'add')}
                        className="px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-colors"
                      >
                        + نقاط
                      </button>
                      <button
                        onClick={() => handleOpenModal(staff, 'deduct')}
                        className="px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold transition-colors"
                      >
                        - خصم
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Points Modal */}
      {modalType && selectedStaff && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#111622] border border-[#242f44] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {modalType === 'add' ? (
                <Plus className="w-5 h-5 text-emerald-400" />
              ) : (
                <Minus className="w-5 h-5 text-rose-400" />
              )}
              <span>
                {modalType === 'add' ? 'إضافة نقاط لـ' : 'خصم نقاط من'} {selectedStaff.displayName}
              </span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">عدد النقاط:</label>
              <input
                type="number"
                min="1"
                value={pointDelta}
                onChange={(e) => setPointDelta(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">سبب العملية (Audit Reason):</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-[#182030] hover:bg-[#25324c] text-slate-300 rounded-xl text-xs font-semibold"
              >
                إلغاء
              </button>

              <button
                onClick={handleConfirmPointsChange}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold shadow-md transition-all ${
                  modalType === 'add' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                تأكيد {modalType === 'add' ? 'الإضافة' : 'الخصم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
