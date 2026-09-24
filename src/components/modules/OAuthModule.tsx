import React, { useState } from 'react';
import {
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Radio,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Server
} from 'lucide-react';
import { UserSession } from '../../types/bot';

interface OAuthModuleProps {
  currentUser: UserSession;
  onLoginViaDiscord: () => void;
}

export const OAuthModule: React.FC<OAuthModuleProps> = ({
  currentUser,
  onLoginViaDiscord
}) => {
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedPre, setCopiedPre] = useState(false);
  const [clientId, setClientId] = useState('1551244802475958282');
  const [clientSecret, setClientSecret] = useState('••••••••••••••••••••••••••••••••');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'identify',
    'guilds',
    'guilds.members.read'
  ]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const devCallback = 'https://ais-dev-r234pda2ao2scugoen5asz-669337408639.europe-west1.run.app/auth/callback';
  const sharedCallback = 'https://ais-pre-r234pda2ao2scugoen5asz-669337408639.europe-west1.run.app/auth/callback';

  const handleCopy = (text: string, isDev: boolean) => {
    navigator.clipboard.writeText(text);
    if (isDev) {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } else {
      setCopiedPre(true);
      setTimeout(() => setCopiedPre(false), 2000);
    }
  };

  const handleTestOAuthLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginViaDiscord();
    }, 1200);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#5865F2]" />
            بوابة ومصادقة Discord OAuth 2.0 (Secure Server Administration)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            ربط لوحة التحكم مباشرة مع منصة Discord للتحقق من هوية الإداريين وصلاحياتهم المشروعة قبل السماح بالدخول.
          </p>
        </div>

        <button
          onClick={handleTestOAuthLogin}
          disabled={isAuthenticating}
          className="px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752c4] active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          {isAuthenticating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <KeyRound className="w-4 h-4" />
          )}
          <span>{isAuthenticating ? 'جاري التحقق من الصلاحيات...' : 'تسجيل الدخول عبر ديسكورد'}</span>
        </button>
      </div>

      {/* Required Setup Credentials for Discord Developer Portal */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#1b2230] pb-2 flex items-center justify-between">
          <span>روابط إعادة التوجيه المطلوبة في Discord Developer Portal</span>
          <a
            href="https://discord.com/developers/applications"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#5865F2] hover:underline flex items-center gap-1 font-semibold"
          >
            فتح Discord Portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          قم بفتح تطبيق البوت في ديسكورد، وتوجه إلى قسم <code className="font-mono text-white bg-[#0e131d] px-1.5 py-0.5 rounded">OAuth2 &gt; General</code>، ثم أضف عناوين الـ Redirect URIs التالية:
        </p>

        <div className="space-y-3">
          {/* Dev URL */}
          <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#1e2536] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold">رابط بيئة التطوير (Development Callback URL):</span>
              <span className="font-mono text-xs text-[#808cf7] break-all select-all">{devCallback}</span>
            </div>
            <button
              onClick={() => handleCopy(devCallback, true)}
              className="px-3 py-1.5 bg-[#182030] hover:bg-[#232e46] text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              {copiedDev ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDev ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>

          {/* Shared URL */}
          <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#1e2536] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold">رابط البيئة المشاركة (Production Callback URL):</span>
              <span className="font-mono text-xs text-[#808cf7] break-all select-all">{sharedCallback}</span>
            </div>
            <button
              onClick={() => handleCopy(sharedCallback, false)}
              className="px-3 py-1.5 bg-[#182030] hover:bg-[#232e46] text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              {copiedPre ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPre ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Client ID & Scopes Configuration */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#1b2230] pb-2">
          بيانات الاعتماد وصلاحيات OAuth2 المطلوبة
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Discord Client ID:</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Client Secret:</label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Scopes */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">الصلاحيات المعتمدة (OAuth Scopes):</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'identify', name: 'identify', desc: 'التحقق من اسم وصورة العضو' },
              { id: 'guilds', name: 'guilds', desc: 'معرفة السيرفرات المشترك بها' },
              { id: 'guilds.members.read', name: 'guilds.members.read', desc: 'التحقق من رتبة الأدمنستريتر في OPS' }
            ].map((scope) => (
              <div
                key={scope.id}
                className="p-3 rounded-xl bg-[#0e131d] border border-[#1b2230] flex items-start gap-2 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold text-white block">{scope.name}</span>
                  <span className="text-[11px] text-slate-400">{scope.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Auth Session Card */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          جلسة المصادقة المفتوحة حالياً
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e131d] border border-[#1b2230]">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full border border-slate-700 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{currentUser.displayName}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  AUTH VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Discord ID: {currentUser.id} · IP: {currentUser.ip}
              </p>
            </div>
          </div>

          <div className="text-left font-mono text-xs text-slate-400 hidden sm:block">
            Token: <span className="text-slate-300">d9a8...3bf2 (24h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
