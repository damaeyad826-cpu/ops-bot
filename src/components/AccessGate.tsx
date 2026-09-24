import React from 'react';
import { ShieldAlert, Lock, UserX, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserSession } from '../types/bot';

interface AccessGateProps {
  currentUser: UserSession;
  ipWhitelistEnforced: boolean;
  onSwitchToOwner: () => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({
  currentUser,
  ipWhitelistEnforced,
  onSwitchToOwner
}) => {
  const isRoleBlocked = !currentUser.isAdmin;
  const isIpBlocked = ipWhitelistEnforced && !currentUser.isWhitelisted && !currentUser.isOwner;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-[#111622] border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          {isRoleBlocked ? <UserX className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {isRoleBlocked ? 'صلاحيات غير كافية للدخول' : 'عنوان IP غير مصرح في القائمة البيضاء'}
        </h2>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {isRoleBlocked
            ? 'لوحة تحكم خادم OPS مخصصة للإدارة العليا والأدمنستريتر فقط. حسابك الحالي لا يمتلك صلاحية Administrator المطلوبة.'
            : `عنوان IP الخاص بجهازك (${currentUser.ip}) غير مدرج في القائمة البيضاء المعتمدة من مالك السيرفر.`}
        </p>

        {/* Diagnostic info */}
        <div className="bg-[#0b0e14] border border-[#1e2536] rounded-xl p-3 mb-6 text-right text-xs space-y-2 font-mono">
          <div className="flex justify-between items-center text-slate-400">
            <span>الحساب الحالي:</span>
            <span className="text-slate-200">{currentUser.displayName}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>صلاحية الأدمن (Administrator):</span>
            <span className={currentUser.isAdmin ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {currentUser.isAdmin ? 'متوفرة ✓' : 'غير متوفرة ✕'}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>عنوان IP المسجل:</span>
            <span className="text-slate-200">{currentUser.ip}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>حالة القائمة البيضاء:</span>
            <span className={currentUser.isWhitelisted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {currentUser.isWhitelisted ? 'مصرح ✓' : 'غير مدرج ✕'}
            </span>
          </div>
        </div>

        {/* Quick action to switch to owner */}
        <div className="space-y-3">
          <button
            onClick={onSwitchToOwner}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#5865F2] hover:bg-[#4752c4] active:scale-98 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>التبديل إلى حساب مالك السيرفر (Owner) للمعاينة</span>
          </button>

          <p className="text-[11px] text-slate-400">
            يمكن لمالك الخادم فقط إضافة أو تعديل عناوين IP في قسم "حماية IP ورتب الإدارة".
          </p>
        </div>
      </div>
    </div>
  );
};
