import React from 'react';
import {
  Activity,
  Terminal,
  Ticket,
  Mic,
  ShieldAlert,
  Award,
  ScrollText,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  ChevronDown,
  Server,
  LogOut,
  Sliders
} from 'lucide-react';
import { UserSession, ServerDetails } from '../types/bot';
import botAvatar from '../assets/images/ops_bot_avatar_1790248234276.jpg';

export type NavTab =
  | 'overview'
  | 'commands'
  | 'tickets'
  | 'transcripts'
  | 'moderation'
  | 'points'
  | 'logs'
  | 'security'
  | 'oauth';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: UserSession;
  onSwitchUser: (profileIndex: number) => void;
  botOnline: boolean;
  pingMs: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  serverDetails?: ServerDetails;
  onOpenConnectionModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onSwitchUser,
  botOnline,
  pingMs,
  isOpenMobile,
  onCloseMobile,
  serverDetails,
  onOpenConnectionModal
}) => {
  const [showProfileSwitcher, setShowProfileSwitcher] = React.useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'overview', label: 'لوحة النظرة العامة', icon: <Activity className="w-4 h-4" /> },
    { id: 'commands', label: 'تخصيص الأوامر والكلمات', icon: <Terminal className="w-4 h-4" />, badge: '17' },
    { id: 'tickets', label: 'لوحة ومصمم التكت', icon: <Ticket className="w-4 h-4" /> },
    { id: 'transcripts', label: 'الصوت والترانسكربت STT', icon: <Mic className="w-4 h-4" />, badge: 'Live' },
    { id: 'moderation', label: 'الموديريشن ونقاط العقوبات', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'points', label: 'نقاط الإدارة وليدربورد', icon: <Award className="w-4 h-4" /> },
    { id: 'logs', label: 'سجلات البوت المركزية', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'security', label: 'حماية IP ورتب الإدارة', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Admin' },
    { id: 'oauth', label: 'إعدادات OAuth 2.0', icon: <KeyRound className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-[#0e121a] border-l border-[#1b2230] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
        dir="rtl"
      >
        {/* Server Header */}
        <div className="p-4 border-b border-[#1b2230]">
          <div
            onClick={onOpenConnectionModal}
            className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#141a26] border border-[#222b3d] hover:border-[#5865f2]/40 transition-colors cursor-pointer"
            title="انقر لفحص الاتصال وتعديل إحصائيات السيرفر"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#5865F2] flex-shrink-0 border border-white/10 shadow-sm">
                <img
                  src={botAvatar}
                  alt="OPS Server"
                  className="w-full h-full object-cover"
                />
                <span className={`absolute bottom-0 right-0 w-3 h-3 ${botOnline ? 'bg-emerald-500' : 'bg-rose-500'} border-2 border-[#0e121a] rounded-full`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white truncate">
                    {serverDetails?.name || 'خادم OPS الرسمي'}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5865F2] fill-[#5865F2]/20 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-400 font-mono tabular-nums">
                  {serverDetails ? `${serverDetails.totalMembers.toLocaleString()} عضو (${serverDetails.onlineMembers} متصل)` : '1,482 عضو'}
                </p>
              </div>
            </div>
            <Server className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>

          {/* Bot Status Bar */}
          <div
            onClick={onOpenConnectionModal}
            className="mt-3 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-[#111622] hover:bg-[#161c2b] text-slate-400 font-mono cursor-pointer transition-colors border border-[#1b2333]"
            title="انقر لفحص اتصال البوت والـ Gateway"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${botOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-slate-300">{botOnline ? 'البوت متصل بالسيرفر 🟢' : 'البوت غير متصل 🔴'}</span>
            </div>
            <span className="text-emerald-400 tabular-nums font-bold">{pingMs}ms</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            أقسام لوحة التحكم
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#5865F2] text-white shadow-md shadow-[#5865F2]/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#151c2a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-mono tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#1e2738] text-slate-300 border border-[#2b374d]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Current User & Role Simulation Box */}
        <div className="p-3 border-t border-[#1b2230] bg-[#0b0e14]">
          <div className="relative">
            <button
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#131924] border border-[#1f283a] hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover flex-shrink-0"
                />
                <div className="text-right min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentUser.isOwner
                      ? '👑 سيرفر أونر'
                      : currentUser.isAdmin
                      ? '🛡️ إدارة عليا'
                      : 'عضو محدد'}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Profile Switcher Dropdown (Allows testing role-based security & IP Whitelisting) */}
            {showProfileSwitcher && (
              <div className="absolute bottom-full right-0 mb-2 w-full bg-[#151b27] border border-[#242f44] rounded-xl shadow-xl p-1.5 z-30 space-y-1">
                <div className="px-2 py-1 text-[11px] text-slate-400 border-b border-[#242f44] font-medium">
                  تبديل الحساب (لفحص الصلاحيات و IP)
                </div>
                {[
                  { title: 'Eyad | Server Owner (مكتمل)', role: 'أدمن + أونر + IP مصرح', idx: 0 },
                  { title: 'Faisal | High Council', role: 'أدمنستريتر + IP مصرح', idx: 1 },
                  { title: 'Salem | Moderator Staff', role: 'موديريتور (بدون أدمن)', idx: 2 },
                  { title: 'Regular Member (غير مصرح)', role: 'عضو عادي (محظور)', idx: 3 }
                ].map((prof) => (
                  <button
                    key={prof.idx}
                    onClick={() => {
                      onSwitchUser(prof.idx);
                      setShowProfileSwitcher(false);
                    }}
                    className="w-full text-right px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#20293c] transition-colors flex flex-col"
                  >
                    <span className="font-semibold text-slate-200">{prof.title}</span>
                    <span className="text-[10px] text-slate-400">{prof.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>عنوان IP الحالي:</span>
            <span className="font-mono text-slate-300">{currentUser.ip}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
