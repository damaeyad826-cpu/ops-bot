import React from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Users,
  MessageSquare,
  ShieldCheck,
  Ticket,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { BotActivityStats, AuditLogEntry, TicketRecord, ServerDetails } from '../../types/bot';
import serverBanner from '../../assets/images/ops_server_banner_1790248244615.jpg';

interface OverviewModuleProps {
  stats: BotActivityStats;
  auditLogs: AuditLogEntry[];
  tickets: TicketRecord[];
  serverDetails: ServerDetails;
  onNavigateTab: (tab: any) => void;
  onToggleBotOnline: () => void;
  onOpenConnectionModal: () => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  stats,
  auditLogs,
  tickets,
  serverDetails,
  onNavigateTab,
  onToggleBotOnline,
  onOpenConnectionModal
}) => {
  const formatUptime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const statCards = [
    {
      title: 'إجمالي أعضاء السيرفر',
      value: serverDetails.totalMembers.toLocaleString(),
      sub: `${serverDetails.onlineMembers} متصل الآن 🟢 · ${serverDetails.botsCount} بوت`,
      icon: <Users className="w-5 h-5 text-[#5865F2]" />,
      color: 'border-[#5865F2]/20 bg-[#5865F2]/5'
    },
    {
      title: 'سرعة الاستجابة (Ping)',
      value: `${stats.pingMs} ms`,
      sub: 'اتصال فائق السرعة عبر Gateway v10',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/20 bg-emerald-500/5'
    },
    {
      title: 'التذاكر النشطة حالياً',
      value: tickets.filter((t) => t.status !== 'closed').length.toString(),
      sub: `${tickets.filter((t) => t.status === 'claimed').length} تذاكر مستلمة من الطاقم`,
      icon: <Ticket className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/20 bg-amber-500/5'
    },
    {
      title: 'سجل التحذيرات والعقوبات',
      value: stats.totalWarningsCount.toString(),
      sub: 'مراقبة مستمرة للمخالفات',
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/20 bg-rose-500/5'
    }
  ];

  // Daily XP Activity sample data for chart
  const activityData = [
    { day: 'السبت', xp: 2450, msgs: 4200 },
    { day: 'الأحد', xp: 3820, msgs: 6100 },
    { day: 'الإثنين', xp: 3100, msgs: 5400 },
    { day: 'الثلاثاء', xp: 4900, msgs: 8200 },
    { day: 'الأربعاء', xp: 5200, msgs: 9100 },
    { day: 'الخميس', xp: 6800, msgs: 11400 },
    { day: 'الجمعة', xp: 7400, msgs: 12800 }
  ];

  const maxXP = Math.max(...activityData.map((d) => d.xp));

  return (
    <div className="space-y-6" dir="rtl">
      {/* Hero Server Showcase Card */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1e2536] bg-[#111622] shadow-xl">
        <div className="h-36 sm:h-44 w-full relative">
          <img
            src={serverBanner}
            alt="OPS Server Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111622] via-[#111622]/60 to-transparent" />
        </div>

        <div className="p-4 sm:p-6 -mt-14 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#5865F2] border-2 border-[#1e2536] p-0.5 flex-shrink-0 shadow-lg overflow-hidden flex items-center justify-center text-white font-black text-xl">
              OPS
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{serverDetails.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  نشط ومحمي
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                  Boost Level {serverDetails.boostLevel} 💎
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                إدارة شاملة لخصائص البوت، التذاكر، الأوامر، نقاط الإشراف، وحماية عناوين IP.
              </p>

              {/* Server Members Detailed Badges */}
              <div className="flex items-center gap-2 flex-wrap mt-2 text-xs">
                <div className="px-2.5 py-1 rounded-lg bg-[#0e131e] border border-[#1f293d] flex items-center gap-1.5 text-slate-200">
                  <Users className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>الأعضاء:</span>
                  <strong className="font-mono text-white">{serverDetails.totalMembers.toLocaleString()}</strong>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-[#0e131e] border border-[#1f293d] flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>متصل:</span>
                  <strong className="font-mono text-emerald-300">{serverDetails.onlineMembers.toLocaleString()}</strong>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-[#0e131e] border border-[#1f293d] flex items-center gap-1.5 text-slate-400">
                  <span>أوفلاين:</span>
                  <strong className="font-mono text-slate-300">{serverDetails.offlineMembers.toLocaleString()}</strong>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-[#0e131e] border border-[#1f293d] flex items-center gap-1.5 text-amber-400">
                  <span>بوتات:</span>
                  <strong className="font-mono text-amber-300">{serverDetails.botsCount}</strong>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-[#0e131e] border border-[#1f293d] flex items-center gap-1.5 text-sky-400">
                  <span>الرتب:</span>
                  <strong className="font-mono text-sky-300">{serverDetails.rolesCount} رتبة</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bot Master Switch & Connection Details Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenConnectionModal}
              className="px-3.5 py-2 bg-[#171f2e] hover:bg-[#222c40] border border-[#27344c] active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="فحص اتصال البوت بالديسكورد وتعديل عدد الأعضاء"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>فحص اتصال البوت والأعضاء</span>
            </button>

            <div className="flex items-center gap-3 bg-[#0d111a] p-2 rounded-xl border border-[#1b2230]">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">حالة تشغيل البوت:</span>
                <span className={`text-xs font-bold ${stats.botOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stats.botOnline ? 'متصل بالديسكورد 🟢' : 'متوقف مؤقتاً 🔴'}
                </span>
              </div>
              <button
                onClick={onToggleBotOnline}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  stats.botOnline
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {stats.botOnline ? 'إيقاف البوت' : 'تشغيل البوت'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${c.color} bg-[#111622] transition-all hover:translate-y-[-2px]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{c.title}</span>
              <div className="p-2 rounded-lg bg-[#141b28] border border-[#20293b]">{c.icon}</div>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono tabular-nums">{c.value}</div>
            <div className="text-[11px] text-slate-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Server Activity & Bot Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly XP Activity Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#111622] border border-[#1e2536] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#5865F2]" />
                معدل نشاط الشات وروم الرتب (XP النشط)
              </h3>
              <p className="text-xs text-slate-400">تتبع الرسائل ونقاط الخبرة المسجلة خلال الأسبوع</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">روم: #1456620385993887774</span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-[#1b2230]">
            {activityData.map((d, i) => {
              const heightPercent = Math.round((d.xp / maxXP) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-white bg-[#1b2230] px-1.5 py-0.5 rounded shadow-sm">
                    {d.xp} XP
                  </div>
                  <div className="w-full max-w-[36px] bg-[#1a2232] rounded-t-md overflow-hidden h-full flex flex-col justify-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#5865F2] to-[#808cf7] rounded-t-md transition-all duration-500 group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#5865F2]" />
              <span>مجموع نقاط XP المكتسبة اليوم: <strong className="text-white font-mono tabular-nums">7,400 XP</strong></span>
            </div>
            <button
              onClick={() => onNavigateTab('commands')}
              className="text-[#5865F2] hover:underline flex items-center gap-1 text-xs font-semibold"
            >
              عرض أوامر الرتب والنقاط
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Server & Bot Health Diagnostics */}
        <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-emerald-400" />
              أداء السيرفر واستقرار النظام
            </h3>
            <p className="text-xs text-slate-400 mb-4">بيانات الذاكرة والمعالج والوقت التشغيلي</p>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    استهلاك الذاكرة (RAM):
                  </span>
                  <span className="font-mono text-slate-200 tabular-nums">{stats.memoryMb.toFixed(1)} MB</span>
                </div>
                <div className="w-full h-2 bg-[#171e2c] rounded-full overflow-hidden">
                  <div className="w-[28%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" />
                    استهلاك المعالج (CPU):
                  </span>
                  <span className="font-mono text-slate-200 tabular-nums">{stats.cpuPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-[#171e2c] rounded-full overflow-hidden">
                  <div className="w-[12%] h-full bg-[#5865F2] rounded-full" />
                </div>
              </div>

              <div className="pt-2 border-t border-[#1b2230] space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>مدة التشغيل المتواصل:</span>
                  <span className="text-slate-200 font-mono tabular-nums">{formatUptime(stats.uptimeSeconds)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>مجموع رسائل السيرفر:</span>
                  <span className="text-slate-200 font-mono tabular-nums">{stats.messagesProcessed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>قاعدة البيانات:</span>
                  <span className="text-emerald-400 font-mono font-semibold">SQLite WAL (bot.db)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-[#141b27] border border-[#20293b]">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              جاهزية الطاقم الإداري
            </div>
            <p className="text-[11px] text-slate-300">
              5 إداريين متواجدين حالياً لاستلام تذاكر الدعم والتحذيرات.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('commands')}
          className="p-4 rounded-xl bg-[#111622] border border-[#1e2536] hover:border-[#5865F2]/50 hover:bg-[#141a28] transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-white group-hover:text-[#5865F2]">تخصيص الأوامر</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#5865F2] group-hover:translate-x-[-2px] transition-all" />
          </div>
          <p className="text-xs text-slate-400">إضافة كلمات تشغيل جديدة للأوامر والتحكم بالرتب المسموحة</p>
        </button>

        <button
          onClick={() => onNavigateTab('tickets')}
          className="p-4 rounded-xl bg-[#111622] border border-[#1e2536] hover:border-emerald-500/50 hover:bg-[#141a28] transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-white group-hover:text-emerald-400">مصمم لوحة التكت</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-[-2px] transition-all" />
          </div>
          <p className="text-xs text-slate-400">تغيير ألوان الأزرار والوصف وإرسال اللوحة للروم المخصص</p>
        </button>

        <button
          onClick={() => onNavigateTab('transcripts')}
          className="p-4 rounded-xl bg-[#111622] border border-[#1e2536] hover:border-amber-500/50 hover:bg-[#141a28] transition-all text-right group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-white group-hover:text-amber-400">محرك تحويل الصوت STT</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-[-2px] transition-all" />
          </div>
          <p className="text-xs text-slate-400">تسجيل وتفريغ الصوت لحظياً وإرفاقه للتذاكر والملاحظات</p>
        </button>
      </div>
    </div>
  );
};
