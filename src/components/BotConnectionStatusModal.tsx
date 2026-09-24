import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Users,
  Shield,
  KeyRound,
  RefreshCw,
  X,
  ExternalLink,
  Bot,
  Copy,
  Check,
  Code,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { BotActivityStats, ServerDetails, ServerRole } from '../types/bot';

interface BotConnectionStatusModalProps {
  stats: BotActivityStats;
  serverDetails: ServerDetails;
  isOpen: boolean;
  onClose: () => void;
  onUpdateServerDetails: (details: ServerDetails) => void;
  onUpdateServerRoles?: (roles: ServerRole[]) => void;
  onToggleBotOnline: () => void;
}

export const BotConnectionStatusModal: React.FC<BotConnectionStatusModalProps> = ({
  stats,
  serverDetails,
  isOpen,
  onClose,
  onUpdateServerDetails,
  onUpdateServerRoles,
  onToggleBotOnline
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sync' | 'guide' | 'manual'>('sync');

  // Token & Guild Inputs
  const [botToken, setBotToken] = useState('');
  const [guildId, setGuildId] = useState(serverDetails.guildId || '1415773466715750450');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Manual Edit Form
  const [editForm, setEditForm] = useState<ServerDetails>({ ...serverDetails });

  // Code snippet language
  const [codeLang, setCodeLang] = useState<'nodejs' | 'python'>('nodejs');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Real Discord Guild Fetch via Express Proxy
  const handleFetchRealGuild = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!botToken.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'يرجى إدخال Bot Token الخاص بك من Discord Developer Portal أولاً.'
      });
      return;
    }

    if (!guildId.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'يرجى إدخال Server (Guild) ID الخاص بسيرفرك.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/discord/fetch-guild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: botToken.trim(), guildId: guildId.trim() })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر الاتصال بسيرفر ديسكورد');
      }

      // Update server details
      onUpdateServerDetails(data.serverDetails);

      // Update server roles
      if (data.roles && data.roles.length > 0 && onUpdateServerRoles) {
        onUpdateServerRoles(data.roles);
      }

      setStatusMessage({
        type: 'success',
        text: `تم الاتصال بنجاح! تم جلب سيرفر "${data.serverDetails.name}" وعدد الأعضاء (${data.serverDetails.totalMembers.toLocaleString()}) و (${data.roles?.length || 0}) رتبة حقيقية!`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'حدث خطأ أثناء فحص التوكن وجلب بيانات السيرفر من ديسكورد.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSave = () => {
    onUpdateServerDetails(editForm);
    setStatusMessage({
      type: 'success',
      text: 'تم تحديث أرقام وإحصائيات السيرفر بنجاح!'
    });
  };

  const nodeSnippet = `// مثال ربط بوت ديسكورد (Node.js / discord.js v14) بلوحة التحكم
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// رابط لوحة التحكم الخاصة بك
const DASHBOARD_API = '${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/bot/config';

let botConfig = null;

// مزامنة الأوامر والإعدادات من اللوحة تلقائياً كل 30 ثانية
async function syncDashboardConfig() {
  try {
    const res = await axios.get(DASHBOARD_API);
    botConfig = res.data;
    console.log('✅ تم تحديث إعدادات وأوامر البوت من لوحة التحكم بنجاح!');
  } catch (err) {
    console.error('⚠️ تعذر مزامنة لوحة التحكم:', err.message);
  }
}

client.on('ready', () => {
  console.log(\`🟢 تم تسجيل الدخول كـ \${client.user.tag}\`);
  syncDashboardConfig();
  setInterval(syncDashboardConfig, 30000);
});

// تنفيذ الأوامر المخصصة في الشات
client.on('messageCreate', async (message) => {
  if (message.author.bot || !botConfig?.commands) return;

  const content = message.content.trim();
  const cmd = botConfig.commands.find(c => 
    c.enabled && (c.aliases.includes(content) || content.startsWith(c.key))
  );

  if (cmd) {
    // التحقق من الرتب المسموحة المحددة في اللوحة
    const hasRole = cmd.allowedRoles.length === 0 || 
      message.member.roles.cache.some(r => cmd.allowedRoles.includes(r.id));

    if (!hasRole) {
      return message.reply('⚠️ لا تملك الرتبة المطلوبة لتنفيذ هذا الأمر!');
    }

    const replyText = cmd.customReply.replace('{target}', message.author.toString());
    await message.reply(replyText);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);`;

  const pythonSnippet = `# مثال ربط بوت ديسكورد (Python / discord.py) بلوحة التحكم
import discord
from discord.ext import commands, tasks
import aiohttp
import os

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

# رابط لوحة التحكم
DASHBOARD_API = "${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/bot/config"
bot_config = {}

@tasks.loop(seconds=30)
async def sync_dashboard():
    global bot_config
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(DASHBOARD_API) as resp:
                if resp.status == 200:
                    bot_config = await resp.json()
                    print("✅ تم مزامنة إعدادات لوحة التحكم بنجاح!")
    except Exception as e:
        print(f"⚠️ خطأ في مزامنة اللوحة: {e}")

@bot.event
async def on_ready():
    print(f"🟢 البوت متصل الآن باسم {bot.user}")
    sync_dashboard.start()

@bot.event
async def on_message(message):
    if message.author.bot:
        return
    await bot.process_commands(message)

bot.run(os.getenv("DISCORD_BOT_TOKEN"))`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto" dir="rtl">
      <div className="bg-[#101520] border border-[#222c40] rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-auto text-right text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1c2436] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ربط وتشغيل البوت الحقيقي (Real Bot Integration)</h3>
              <p className="text-xs text-slate-400">طريقة تشغيل البوت وربطه بسيرفر الديسكورد ومزامنة الأعضاء والرتب</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2334] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0b0e14] rounded-xl border border-[#1b2333]">
          <button
            onClick={() => setActiveSubTab('sync')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'sync'
                ? 'bg-[#5865F2] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1. مزامنة السيرفر الحقيقي (Live Discord Sync)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'guide'
                ? 'bg-[#5865F2] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. كود تشغيل البوت (Code Integration)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('manual')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'manual'
                ? 'bg-[#5865F2] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. تعديل الأرقام يدوياً</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div>{statusMessage.text}</div>
          </div>
        )}

        {/* TAB 1: Live Discord Sync */}
        {activeSubTab === 'sync' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0c1017] border border-[#1b2333] space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#5865F2]" />
                <span>الاتصال المباشر عبر Discord Developer Portal</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                لجلب اسم السيرفر وعدد الأعضاء الحقيقي وكافة الرتب المنشأة بالسيرفر تلقائياً، ضع بيانات البوت هنا:
              </p>

              <form onSubmit={handleFetchRealGuild} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    توكن البوت (Bot Token):
                  </label>
                  <input
                    type="password"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="مثال: MTI0...ضع توكن البوت من Discord Developer Portal..."
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-[#5865F2] focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    يمكنك الحصول عليه من{' '}
                    <a
                      href="https://discord.com/developers/applications"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#5865F2] hover:underline font-semibold"
                    >
                      Discord Developer Portal &rarr; Applications &rarr; Bot &rarr; Reset Token
                    </a>
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    آيدي السيرفر (Server / Guild ID):
                  </label>
                  <input
                    type="text"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                    placeholder="ضع Server ID هنا (مثال: 1415773466715750450)"
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-[#5865F2] focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    (انقر بزر الفأرة الأيمن على السيرفر في ديسكورد ثم اختر Copy Server ID).
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#5865F2] hover:bg-[#4752c4] active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>{isLoading ? 'جاري الاتصال بديسكورد وجلب البيانات...' : 'مزامنة السيرفر الحقيقي وجلب كافة الرتب والأعضاء'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Current Sync Snapshot */}
            <div className="p-4 rounded-xl bg-[#0c1017] border border-[#1b2333]">
              <span className="text-xs font-bold text-slate-300 block mb-2">بيانات السيرفر المعروضة حالياً:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#121824] border border-[#1c2436]">
                  <span className="text-[10px] text-slate-400 block font-sans">اسم السيرفر</span>
                  <span className="text-white font-bold text-xs truncate block">{serverDetails.name}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#121824] border border-[#1c2436]">
                  <span className="text-[10px] text-slate-400 block font-sans">إجمالي الأعضاء</span>
                  <span className="text-emerald-400 font-bold text-sm">{serverDetails.totalMembers.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#121824] border border-[#1c2436]">
                  <span className="text-[10px] text-slate-400 block font-sans">المتصلين الآن</span>
                  <span className="text-sky-400 font-bold text-sm">{serverDetails.onlineMembers.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#121824] border border-[#1c2436]">
                  <span className="text-[10px] text-slate-400 block font-sans">عدد الرتب</span>
                  <span className="text-amber-400 font-bold text-sm">{serverDetails.rolesCount} رتبة</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bot Code Integration Guide */}
        {activeSubTab === 'guide' && (
          <div className="space-y-4">
            {/* Steps Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#0c1017] border border-[#1b2333] space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#5865F2]/20 text-[#5865F2] font-bold text-xs flex items-center justify-center mb-1">1</span>
                <span className="text-xs font-bold text-white block">تفعيل الـ Intents</span>
                <p className="text-[11px] text-slate-400">
                  من صفحة Bot في بوابة المطورين، فعّل Server Members Intent و Message Content Intent.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0c1017] border border-[#1b2333] space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#5865F2]/20 text-[#5865F2] font-bold text-xs flex items-center justify-center mb-1">2</span>
                <span className="text-xs font-bold text-white block">إدخال البوت للسيرفر</span>
                <p className="text-[11px] text-slate-400">
                  تأكد من إعطاء البوت صلاحية Administrator ووضع رتبة البوت أعلى من رتب الأعضاء.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0c1017] border border-[#1b2333] space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#5865F2]/20 text-[#5865F2] font-bold text-xs flex items-center justify-center mb-1">3</span>
                <span className="text-xs font-bold text-white block">المزامنة مع اللوحة</span>
                <p className="text-[11px] text-slate-400">
                  كود البوت أدناه يسحب الأوامر والرتب من اللوحة عبر API تلقائياً وينفذها.
                </p>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="rounded-xl bg-[#0c1017] border border-[#1b2333] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[#121824] border-b border-[#1b2333]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCodeLang('nodejs')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                      codeLang === 'nodejs' ? 'bg-[#5865F2] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Node.js (discord.js)
                  </button>
                  <button
                    onClick={() => setCodeLang('python')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                      codeLang === 'python' ? 'bg-[#5865F2] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Python (discord.py)
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(codeLang === 'nodejs' ? nodeSnippet : pythonSnippet)}
                  className="px-2.5 py-1 rounded-lg bg-[#1a2334] hover:bg-[#25324b] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>

              <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed" dir="ltr">
                <code>{codeLang === 'nodejs' ? nodeSnippet : pythonSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: Manual Members Breakdown Edit */}
        {activeSubTab === 'manual' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0c1017] border border-[#1b2333] space-y-3">
              <h4 className="text-xs font-bold text-white">تعديل أرقام وإحصائيات السيرفر يدوياً:</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">اسم السيرفر:</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">إجمالي الأعضاء (Total Members):</label>
                  <input
                    type="number"
                    value={editForm.totalMembers}
                    onChange={(e) => setEditForm({ ...editForm, totalMembers: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">المتصلين الآن (Online):</label>
                  <input
                    type="number"
                    value={editForm.onlineMembers}
                    onChange={(e) => setEditForm({ ...editForm, onlineMembers: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">غير متصلين (Offline):</label>
                  <input
                    type="number"
                    value={editForm.offlineMembers}
                    onChange={(e) => setEditForm({ ...editForm, offlineMembers: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عدد البوتات (Bots):</label>
                  <input
                    type="number"
                    value={editForm.botsCount}
                    onChange={(e) => setEditForm({ ...editForm, botsCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">مستوى البوست (Boost Level):</label>
                  <input
                    type="number"
                    value={editForm.boostLevel}
                    onChange={(e) => setEditForm({ ...editForm, boostLevel: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#131924] border border-[#243048] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  حفظ الأرقام الجديدة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c2436]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1b2230] hover:bg-[#253044] text-white rounded-xl text-xs font-semibold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
