import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  Lock,
  Plus,
  Trash2,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Radio,
  Sliders,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { IPWhitelistEntry, UserSession, StaffPointUser } from '../../types/bot';

interface SecurityAndIPModuleProps {
  whitelist: IPWhitelistEntry[];
  isEnforced: boolean;
  onToggleEnforce: () => void;
  onAddWhitelistEntry: (entry: Omit<IPWhitelistEntry, 'id' | 'addedAt'>) => void;
  onRemoveWhitelistEntry: (id: string) => void;
  currentUser: UserSession;
  staffList: StaffPointUser[];
  onSimulateUnauthorized: () => void;
}

export const SecurityAndIPModule: React.FC<SecurityAndIPModuleProps> = ({
  whitelist,
  isEnforced,
  onToggleEnforce,
  onAddWhitelistEntry,
  onRemoveWhitelistEntry,
  currentUser,
  staffList,
  onSimulateUnauthorized
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [ipInput, setIpInput] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState(staffList[0]?.userId || '');
  const [notesInput, setNotesInput] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInput.trim()) return;

    const matchedStaff = staffList.find((s) => s.userId === selectedAdminId);
    const adminName = matchedStaff ? `${matchedStaff.displayName} (${matchedStaff.roles[0] || 'إداري'})` : 'مشرف معتمد';

    onAddWhitelistEntry({
      ipAddress: ipInput.trim(),
      adminName,
      adminId: selectedAdminId,
      notes: notesInput.trim() || 'شبكة معتمدة من مالك السيرفر',
      status: 'active'
    });

    setIpInput('');
    setNotesInput('');
    setShowAddModal(false);
  };

  const handleQuickWhitelistCurrentIp = () => {
    if (whitelist.some((w) => w.ipAddress === currentUser.ip)) {
      alert('عنوان IP الحالي مضاف بالفعل في القائمة البيضاء.');
      return;
    }

    onAddWhitelistEntry({
      ipAddress: currentUser.ip,
      adminName: currentUser.displayName,
      adminId: currentUser.id,
      notes: 'تمت إضافته سريعاً من المتصفح الحالي',
      status: 'active'
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            حماية الرتب وتقييد عناوين IP (Role-Based IP Whitelisting)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            نظام حماية ثنائي: لا يمكن لأي شخص الوصول للوحة إلا إذا كان يمتلك رتبة الأدمنستريتر وعنوان IP الخاص به مصرح في القائمة البيضاء.
          </p>
        </div>

        {/* Master Enforce Toggle */}
        <div className="flex items-center gap-3 bg-[#0e131d] p-2.5 rounded-xl border border-[#20293b]">
          <div className="text-right">
            <span className="text-xs font-semibold text-white block">فرض القائمة البيضاء:</span>
            <span className={`text-[11px] ${isEnforced ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
              {isEnforced ? 'مفعلة بصرامة (Strict Mode)' : 'متوقفة (السماح للجميع)'}
            </span>
          </div>

          <button
            onClick={onToggleEnforce}
            disabled={!currentUser.isOwner}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
              isEnforced ? 'bg-emerald-600' : 'bg-[#2a3449]'
            } ${!currentUser.isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={currentUser.isOwner ? 'تبديل تفعيل القائمة البيضاء' : 'تعديل هذا الخيار مخصص لمالك السيرفر فقط'}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isEnforced ? 'translate-x-0' : '-translate-x-6'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security Status Box & Current IP Detector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current IP status */}
        <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2536] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                عنوان IP المكتشف حالياً:
              </span>
              <span className="font-mono text-white text-xs">{currentUser.ip}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold mb-3">
              <span>حالة عنوانك:</span>
              <span className={currentUser.isWhitelisted ? 'text-emerald-400' : 'text-amber-400'}>
                {currentUser.isWhitelisted ? 'مصرح في القائمة البيضاء ✓' : 'غير مصرح ✕'}
              </span>
            </div>
          </div>

          {!currentUser.isWhitelisted && (
            <button
              onClick={handleQuickWhitelistCurrentIp}
              className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              إضافة عنوان IP الحالي للقائمة البيضاء
            </button>
          )}
        </div>

        {/* Role Authentication Requirement */}
        <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2536] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                صلاحيات الرتبة الإدارية:
              </span>
              <span className="font-bold text-white text-xs">
                {currentUser.isOwner ? 'Server Owner' : currentUser.isAdmin ? 'Administrator' : 'عضو عادي'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-2">
              يشترط امتلاك صلاحية <code className="text-[#5865F2] font-mono font-bold">Administrator</code> على حساب الديسكورد قبل فتح اللوحة.
            </p>
          </div>

          <div className="text-[11px] text-emerald-400 font-semibold">
            {currentUser.isAdmin ? 'حسابك يحقق متطلب الرتبة الإدارية ✓' : 'حسابك لا يمتلك الصلاحيات المطلوبة ✕'}
          </div>
        </div>

        {/* Security Gate Testing Simulator */}
        <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2536] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white mb-1">اختبار بوابة الحظر الأمني:</div>
            <p className="text-xs text-slate-300 mb-3">
              قم بتجربة الدخول كعضو غير مصرح أو من عنوان IP غير مسجل للتحقق من قفل اللوحة.
            </p>
          </div>

          <button
            onClick={onSimulateUnauthorized}
            className="w-full py-1.5 rounded-lg bg-[#1a2232] hover:bg-[#253147] border border-[#2d3a52] text-amber-300 text-xs font-semibold transition-colors"
          >
            اختبار الدخول كحساب غير مصرح
          </button>
        </div>
      </div>

      {/* Whitelist IP Management Table */}
      <div className="bg-[#111622] border border-[#1e2536] rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-[#1b2230] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">عناوين IP المصرح لها بالدخول للوحة</h3>
            <p className="text-xs text-slate-400">فقط الإداريون الذين يملكون هذه العناوين يستطيعون إدارة السيرفر</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            disabled={!currentUser.isOwner}
            className="px-3.5 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة IP جديد للقائمة</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0e131d] text-slate-400 border-b border-[#1b2230] font-medium">
              <tr>
                <th className="p-3">عنوان IP</th>
                <th className="p-3">الإداري المعتمد</th>
                <th className="p-3">تاريخ الإضافة</th>
                <th className="p-3">ملاحظات الشبكة</th>
                <th className="p-3 text-center">الحالة</th>
                <th className="p-3 text-left">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2230]">
              {whitelist.map((item) => (
                <tr key={item.id} className="hover:bg-[#141b27] transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-200">{item.ipAddress}</td>
                  <td className="p-3 text-white font-semibold">{item.adminName}</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">
                    {new Date(item.addedAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="p-3 text-slate-300">{item.notes}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {item.status === 'active' ? 'نشط ومصرح' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-3 text-left">
                    <button
                      onClick={() => onRemoveWhitelistEntry(item.id)}
                      disabled={!currentUser.isOwner}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 disabled:opacity-40 transition-colors"
                      title="حذف من القائمة البيضاء"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add IP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAddSubmit}
            className="bg-[#111622] border border-[#242f44] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#5865F2]" />
              <span>إضافة عنوان IP موثوق جديد</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">عنوان IP (IPv4 أو IPv6):</label>
              <input
                type="text"
                required
                placeholder="مثال: 197.34.12.89 أو 192.168.1.1"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">اختيار الإداري صاحب العنوان:</label>
              <select
                value={selectedAdminId}
                onChange={(e) => setSelectedAdminId(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white"
              >
                {staffList.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.displayName} ({s.roles[0] || 'إداري'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">ملاحظة عن الشبكة أو المكان:</label>
              <input
                type="text"
                placeholder="مثال: فايبر المكتب / شبكة الرياض"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-[#182030] hover:bg-[#25324c] text-slate-300 rounded-xl text-xs font-semibold"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                تأكيد الإضافة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
