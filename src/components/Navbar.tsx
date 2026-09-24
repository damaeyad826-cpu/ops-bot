import React from 'react';
import { Menu, Shield, Globe, Bell, RefreshCw, Radio } from 'lucide-react';
import { UserSession } from '../types/bot';
import { NavTab } from './Sidebar';

interface NavbarProps {
  activeTab: NavTab;
  currentUser: UserSession;
  ipWhitelistEnforced: boolean;
  onOpenMobile: () => void;
  onSyncBot: () => void;
  isSyncing: boolean;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  overview: { title: 'لوحة النظرة العامة', subtitle: 'مراقبة أداء البوت وإحصائيات خادم OPS لحظياً' },
  commands: { title: 'تخصيص الأوامر والكلمات', subtitle: 'إدارة اختصارات التشغيل، وتعيين رتب وصلاحيات كل أمر' },
  tickets: { title: 'مصمم التكت والدعم الفني', subtitle: 'تعديل ألوان الأزرار، النصوص، والرسائل الترحيبية وإرسال اللوحة' },
  transcripts: { title: 'تحويل الصوت إلى نص والترانسكربت', subtitle: 'محرك STT مباشر لتحويل الصوت لرسائل تكت وسجل المراجعات' },
  moderation: { title: 'أدوات الموديريشن والعقوبات', subtitle: 'التحكم في نقاط التحذير والتايم والسجن ونظام الحماية التلقائي' },
  points: { title: 'نقاط الإدارة والمتصدرين', subtitle: 'استعراض أعلى 10 إداريين، إضافة وتعديل النقاط' },
  logs: { title: 'سجلات البوت والنشاطات', subtitle: 'سجل تدقيق سحابي لجميع الإجراءات والأوامر المنفذة' },
  security: { title: 'حماية الرتب والقائمة البيضاء لـ IP', subtitle: 'التحكم في وصول الأدمن للوحة عبر تقييد عناوين IP المصرحة' },
  oauth: { title: 'بوابة Discord OAuth 2.0', subtitle: 'ربط المصادقة الآمنة وحسابات مدراء الخادم عبر ديسكورد' }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  currentUser,
  ipWhitelistEnforced,
  onOpenMobile,
  onSyncBot,
  isSyncing
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'لوحة التحكم', subtitle: '' };

  return (
    <header className="h-16 bg-[#0e121a]/95 backdrop-blur-md border-b border-[#1b2230] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30" dir="rtl">
      {/* Right side: Mobile Menu + Module Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#182030] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-white tracking-tight">{currentTabInfo.title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">{currentTabInfo.subtitle}</p>
        </div>
      </div>

      {/* Left side: Quick status pills & Sync action */}
      <div className="flex items-center gap-2.5">
        {/* IP Whitelist Security Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141b26] border border-[#20293b] text-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">حماية IP:</span>
          <span className={`font-semibold ${ipWhitelistEnforced ? 'text-emerald-400' : 'text-amber-400'}`}>
            {ipWhitelistEnforced ? 'مفعلة' : 'متوقفة'}
          </span>
        </div>

        {/* User Role Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191f2e] border border-[#263147] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#5865F2]" />
          <span className="text-slate-300 font-medium hidden sm:inline">
            {currentUser.isOwner ? 'المالك' : currentUser.isAdmin ? 'مدير عام' : 'مشرف'}
          </span>
          <span className="font-mono text-[11px] text-slate-400">({currentUser.username})</span>
        </div>

        {/* Sync Bot State Button */}
        <button
          onClick={onSyncBot}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] active:scale-98 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          title="مزامنة الإعدادات فورياً مع البوت"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">مزامنة حية</span>
        </button>
      </div>
    </header>
  );
};
