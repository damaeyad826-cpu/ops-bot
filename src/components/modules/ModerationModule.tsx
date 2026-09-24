import React, { useState } from 'react';
import {
  ShieldAlert,
  Shield,
  Zap,
  Sliders,
  AlertTriangle,
  Award,
  Save,
  RotateCcw,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { ModerationSettings, UserSession } from '../../types/bot';
import { INITIAL_MODERATION } from '../../services/botStorage';

interface ModerationModuleProps {
  settings: ModerationSettings;
  onSaveSettings: (updated: ModerationSettings) => void;
  currentUser: UserSession;
}

export const ModerationModule: React.FC<ModerationModuleProps> = ({
  settings,
  onSaveSettings,
  currentUser
}) => {
  const [form, setForm] = useState<ModerationSettings>({ ...settings });
  const [newBadWord, setNewBadWord] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm('استعادة الإعدادات الافتراضية للموديريشن؟')) {
      setForm({ ...INITIAL_MODERATION });
      onSaveSettings(INITIAL_MODERATION);
    }
  };

  const handleAddBadWord = () => {
    if (!newBadWord.trim()) return;
    const clean = newBadWord.trim().toLowerCase();
    if (!form.badWordsList.includes(clean)) {
      setForm({
        ...form,
        badWordsList: [...form.badWordsList, clean]
      });
    }
    setNewBadWord('');
  };

  const handleRemoveBadWord = (word: string) => {
    setForm({
      ...form,
      badWordsList: form.badWordsList.filter((w) => w !== word)
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#5865F2]" />
            أدوات الحماية والموديريشن المخصصة (Custom Moderation Tools)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            التحكم في أدوات الأوتومود، رتب السجن والعفو، وتحديد قيم نقاط العقوبات والمهام التي يحصل عليها الإداري.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-[#182030] hover:bg-[#222c42] text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>افتراضي</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>تم حفظ ومزامنة إعدادات الموديريشن ونقاط العقوبات مع قاعدة بيانات البوت!</span>
        </div>
      )}

      {/* Auto-Mod Toggles Grid */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#1b2230] pb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#5865F2]" />
          أدوات الحماية التلقائية (Auto-Moderation Toggles)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Anti-Spam */}
          <div className="p-4 rounded-xl bg-[#0e131d] border border-[#1b2230] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-white block">حماية السبام (Anti-Spam)</span>
              <span className="text-xs text-slate-400">إيقاف تكرار الرسائل السريعة تلقائياً</span>
            </div>
            <button
              onClick={() => setForm({ ...form, antiSpam: !form.antiSpam })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                form.antiSpam ? 'bg-[#5865F2]' : 'bg-[#2a3449]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  form.antiSpam ? 'translate-x-0' : '-translate-x-5'
                }`}
              />
            </button>
          </div>

          {/* Mass Mention */}
          <div className="p-4 rounded-xl bg-[#0e131d] border border-[#1b2230] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-white block">حماية المنشن المتعدد (Mass Mention)</span>
              <span className="text-xs text-slate-400">منع منشن أكثر من 4 أعضاء في الرسالة الواحدة</span>
            </div>
            <button
              onClick={() => setForm({ ...form, antiMassMention: !form.antiMassMention })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                form.antiMassMention ? 'bg-[#5865F2]' : 'bg-[#2a3449]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  form.antiMassMention ? 'translate-x-0' : '-translate-x-5'
                }`}
              />
            </button>
          </div>

          {/* Link Filter */}
          <div className="p-4 rounded-xl bg-[#0e131d] border border-[#1b2230] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-white block">فلتر الروابط الخارجية (Link Filter)</span>
              <span className="text-xs text-slate-400">حذف روابط ديسكورد الترويجية والإعلانات غير المصرحة</span>
            </div>
            <button
              onClick={() => setForm({ ...form, linkFilter: !form.linkFilter })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                form.linkFilter ? 'bg-[#5865F2]' : 'bg-[#2a3449]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  form.linkFilter ? 'translate-x-0' : '-translate-x-5'
                }`}
              />
            </button>
          </div>

          {/* Bad Words */}
          <div className="p-4 rounded-xl bg-[#0e131d] border border-[#1b2230] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-white block">فلتر الكلمات المسيئة (Bad Words Filter)</span>
              <span className="text-xs text-slate-400">كتم وتحذير العضو فورياً عند كتابة ألفاظ محظورة</span>
            </div>
            <button
              onClick={() => setForm({ ...form, badWordsFilter: !form.badWordsFilter })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                form.badWordsFilter ? 'bg-[#5865F2]' : 'bg-[#2a3449]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  form.badWordsFilter ? 'translate-x-0' : '-translate-x-5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bad words tags manager */}
        {form.badWordsFilter && (
          <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#20293b] space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">قائمة الكلمات والعبارات المحظورة:</span>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.badWordsList.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1c2436] border border-[#2c3952] text-xs font-mono text-slate-200"
                >
                  <span>{word}</span>
                  <button
                    onClick={() => handleRemoveBadWord(word)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={newBadWord}
                onChange={(e) => setNewBadWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBadWord();
                  }
                }}
                placeholder="أضف كلمة محظورة جديدة..."
                className="flex-1 bg-[#141b28] border border-[#232f47] rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddBadWord}
                className="px-3 py-1.5 bg-[#25324d] hover:bg-[#344569] text-white rounded-xl text-xs font-semibold"
              >
                إضافة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Penalty Action Points Settings (Matching SQLite point_settings table) */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#1b2230] pb-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          توزيع نقاط الإدارة على العقوبات والمهام (Point Rewards Config)
        </h3>
        <p className="text-xs text-slate-400">
          حدد عدد النقاط التي يكتسبها الإداري تلقائياً عند تنفيذ كل إجراء في السيرفر (تُحفظ في جدول point_settings):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#0e131d] border border-[#1b2230] space-y-1">
            <span className="text-xs font-semibold text-slate-300 block">نقاط استلام التكت (ticket_claim):</span>
            <input
              type="number"
              min="0"
              value={form.actionPoints.ticket_claim}
              onChange={(e) =>
                setForm({
                  ...form,
                  actionPoints: { ...form.actionPoints, ticket_claim: parseInt(e.target.value) || 0 }
                })
              }
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-lg px-3 py-2 text-sm font-bold text-emerald-400 font-mono"
            />
            <span className="text-[10px] text-slate-500">الافتراضي: 3 نقاط</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0e131d] border border-[#1b2230] space-y-1">
            <span className="text-xs font-semibold text-slate-300 block">نقاط إصدار تحذير (warning):</span>
            <input
              type="number"
              min="0"
              value={form.actionPoints.warning}
              onChange={(e) =>
                setForm({
                  ...form,
                  actionPoints: { ...form.actionPoints, warning: parseInt(e.target.value) || 0 }
                })
              }
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-lg px-3 py-2 text-sm font-bold text-amber-400 font-mono"
            />
            <span className="text-[10px] text-slate-500">الافتراضي: 1 نقطة</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0e131d] border border-[#1b2230] space-y-1">
            <span className="text-xs font-semibold text-slate-300 block">نقاط إعطاء تايم أوت (timeout):</span>
            <input
              type="number"
              min="0"
              value={form.actionPoints.timeout}
              onChange={(e) =>
                setForm({
                  ...form,
                  actionPoints: { ...form.actionPoints, timeout: parseInt(e.target.value) || 0 }
                })
              }
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-lg px-3 py-2 text-sm font-bold text-sky-400 font-mono"
            />
            <span className="text-[10px] text-slate-500">الافتراضي: 2 نقطة</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0e131d] border border-[#1b2230] space-y-1">
            <span className="text-xs font-semibold text-slate-300 block">نقاط أمر السجن (prison):</span>
            <input
              type="number"
              min="0"
              value={form.actionPoints.prison}
              onChange={(e) =>
                setForm({
                  ...form,
                  actionPoints: { ...form.actionPoints, prison: parseInt(e.target.value) || 0 }
                })
              }
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-lg px-3 py-2 text-sm font-bold text-rose-400 font-mono"
            />
            <span className="text-[10px] text-slate-500">الافتراضي: 3 نقاط</span>
          </div>
        </div>
      </div>

      {/* Role IDs in Code Setup */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#1b2230] pb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          رتب العقوبات والفصل في السيرفر (Role Hierarchy IDs)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              آيدي رتبة السجن (Prison Role ID):
            </label>
            <input
              type="text"
              value={form.prisonRoleId}
              onChange={(e) => setForm({ ...form, prisonRoleId: e.target.value })}
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">الافتراضي: 1514040527899594762</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              آيدي رتبة الميمبر الأساسية (Member Role ID - للعفو):
            </label>
            <input
              type="text"
              value={form.memberRoleId}
              onChange={(e) => setForm({ ...form, memberRoleId: e.target.value })}
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">الافتراضي: 1359738865144954981</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              آيدي رتبة الفصل الإداري (Fired Role ID):
            </label>
            <input
              type="text"
              value={form.firedRoleId}
              onChange={(e) => setForm({ ...form, firedRoleId: e.target.value })}
              className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">الافتراضي: 1491088654318174458</span>
          </div>
        </div>
      </div>
    </div>
  );
};
