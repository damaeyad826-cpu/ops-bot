import React, { useState } from 'react';
import {
  Ticket,
  Send,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { TicketPanelConfig, UserSession } from '../../types/bot';
import { INITIAL_TICKET_CONFIG, OPS_SERVER_ROLES } from '../../services/botStorage';
import ticketBannerDefault from '../../assets/images/ops_ticket_banner_1790248256630.jpg';

interface TicketsModuleProps {
  config: TicketPanelConfig;
  onSaveConfig: (updated: TicketPanelConfig) => void;
  onSendPanelToChannel: (channelId: string) => void;
  currentUser: UserSession;
}

export const TicketsModule: React.FC<TicketsModuleProps> = ({
  config,
  onSaveConfig,
  onSendPanelToChannel,
  currentUser
}) => {
  const [formData, setFormData] = useState<TicketPanelConfig>({ ...config });
  const [newNote, setNewNote] = useState('');
  const [previewMode, setPreviewMode] = useState<'panel' | 'container'>('panel');
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  const buttonColors: Array<{ id: TicketPanelConfig['buttonColor']; label: string; class: string }> = [
    { id: 'Primary', label: 'أزرق (Blurple)', class: 'bg-[#5865F2] hover:bg-[#4752c4] text-white' },
    { id: 'Success', label: 'أخضر (Success)', class: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    { id: 'Danger', label: 'أحمر (Danger)', class: 'bg-rose-600 hover:bg-rose-700 text-white' },
    { id: 'Secondary', label: 'رمادي (Secondary)', class: 'bg-[#4e5058] hover:bg-[#6d6f78] text-white' }
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setFormData({
      ...formData,
      panelNotes: [...formData.panelNotes, newNote.trim()]
    });
    setNewNote('');
  };

  const handleRemoveNote = (index: number) => {
    setFormData({
      ...formData,
      panelNotes: formData.panelNotes.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    onSaveConfig(formData);
    setSendSuccessMessage('تم حفظ إعدادات لوحة التكت بنجاح ومزامنتها مع البوت!');
    setTimeout(() => setSendSuccessMessage(null), 3000);
  };

  const handleSend = () => {
    onSendPanelToChannel(formData.channelId);
    setSendSuccessMessage(`تم إرسال لوحة التذاكر المحدثة بنجاح إلى الروم #${formData.channelId}`);
    setTimeout(() => setSendSuccessMessage(null), 3500);
  };

  const handleReset = () => {
    if (confirm('هل تريد استعادة الإعدادات الافتراضية للوحة التكت؟')) {
      setFormData({ ...INITIAL_TICKET_CONFIG });
      onSaveConfig(INITIAL_TICKET_CONFIG);
    }
  };

  const getButtonClass = (color: TicketPanelConfig['buttonColor']) => {
    switch (color) {
      case 'Primary':
        return 'bg-[#5865F2] hover:bg-[#4752c4] text-white';
      case 'Success':
        return 'bg-[#248046] hover:bg-[#1a6334] text-white';
      case 'Danger':
        return 'bg-[#da373c] hover:bg-[#a1282c] text-white';
      case 'Secondary':
      default:
        return 'bg-[#4e5058] hover:bg-[#6d6f78] text-white';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#5865F2]" />
            مصمم ومحرر لوحة التذاكر (Visual Ticket Panel Designer)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            تحكم كامل في نصوص اللوحة، ألوان الأزرار، الإيموجي، والصورة، مع معاينة حية لشكل الرسالة داخل الديسكورد.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-[#182030] hover:bg-[#222c42] text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="استعادة الافتراضي"
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

          <button
            onClick={handleSend}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>إرسال اللوحة للديسكورد</span>
          </button>
        </div>
      </div>

      {sendSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{sendSuccessMessage}</span>
        </div>
      )}

      {/* Main layout: Editor (Left 1.2 cols) + Discord Live Preview (Right 1.8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-[#1b2230] pb-2">
              تخصيص نصوص وألوان اللوحة الرئيسية
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">عنوان لوحة الدعم الفني:</label>
              <input
                type="text"
                value={formData.panelTitle}
                onChange={(e) => setFormData({ ...formData, panelTitle: e.target.value })}
                className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">الوصف الأساسي في التكت:</label>
              <textarea
                rows={3}
                value={formData.panelDescription}
                onChange={(e) => setFormData({ ...formData, panelDescription: e.target.value })}
                className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white leading-relaxed"
              />
            </div>

            {/* Bullet Notes List */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                ملاحظات وقواعد فتح التكت (Bullet Notes):
              </label>
              <div className="space-y-1.5 mb-2">
                {formData.panelNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#0e131d] border border-[#20293b] text-xs"
                  >
                    <span className="text-slate-200">
                      • {note}
                    </span>
                    <button
                      onClick={() => handleRemoveNote(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Note */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                  placeholder="أضف ملاحظة أو قاعدة جديدة..."
                  className="flex-1 bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-3 py-1.5 bg-[#222d42] hover:bg-[#2c3a54] text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* Button Color & Text Customizer */}
            <div className="pt-2 border-t border-[#1b2230] space-y-4">
              <h4 className="text-xs font-bold text-white">تخصيص زر فتح التذكرة (Create Ticket Button)</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">نص الزر (Button Label):</label>
                  <input
                    type="text"
                    value={formData.buttonLabel}
                    onChange={(e) => setFormData({ ...formData, buttonLabel: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">إيموجي الزر (Emoji):</label>
                  <input
                    type="text"
                    value={formData.buttonEmoji}
                    onChange={(e) => setFormData({ ...formData, buttonEmoji: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Button Color Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">لون الزر (Discord Style):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {buttonColors.map((col) => {
                    const isSelected = formData.buttonColor === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, buttonColor: col.id })}
                        className={`p-2 rounded-xl text-xs font-semibold transition-all border text-center ${col.class} ${
                          isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111622] scale-102' : 'opacity-80'
                        }`}
                      >
                        {col.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Channels and Roles Setup */}
            <div className="pt-2 border-t border-[#1b2230] space-y-3">
              <h4 className="text-xs font-bold text-white">إعدادات الرومات والرتب في البوت</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    آيدي روم لوحة التكت (Channel ID):
                  </label>
                  <input
                    type="text"
                    value={formData.channelId}
                    onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">الافتراضي: 1551238208216506559</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    آيدي كاتيجوري التذاكر (Category ID):
                  </label>
                  <input
                    type="text"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">الافتراضي: 1384340024849465354</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">رابط صورة البانر (Media Gallery):</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Discord Live Component Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e2536] shadow-md sticky top-20">
            <div className="flex items-center justify-between mb-3 border-b border-[#1b2230] pb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#5865F2]" />
                <h3 className="text-sm font-bold text-white">المعاينة المباشرة داخل ديسكورد</h3>
              </div>

              {/* Toggle preview mode */}
              <div className="flex items-center p-0.5 rounded-lg bg-[#0b0e14] border border-[#20293b]">
                <button
                  onClick={() => setPreviewMode('panel')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    previewMode === 'panel' ? 'bg-[#5865F2] text-white' : 'text-slate-400'
                  }`}
                >
                  لوحة التكت
                </button>
                <button
                  onClick={() => setPreviewMode('container')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    previewMode === 'container' ? 'bg-[#5865F2] text-white' : 'text-slate-400'
                  }`}
                >
                  داخل التذكرة
                </button>
              </div>
            </div>

            {/* Discord Message Preview Frame */}
            <div className="bg-[#313338] rounded-xl p-4 text-[#dbdee1] font-sans border border-[#232428] shadow-inner text-right space-y-3">
              {/* Bot Author Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-black text-xs">
                  OPS
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">OPS Bot</span>
                  <span className="px-1 py-0.2 rounded bg-[#5865F2] text-white text-[9px] font-bold">BOT</span>
                  <span className="text-[10px] text-[#949ba4]">اليوم في 14:00</span>
                </div>
              </div>

              {previewMode === 'panel' ? (
                /* Ticket Panel Preview */
                <div className="bg-[#2b2d31] border border-[#1e1f22] rounded-xl p-3.5 space-y-3">
                  <div className="text-white font-extrabold text-sm border-b border-[#35373c] pb-2">
                    {formData.panelTitle}
                  </div>

                  <div className="text-xs text-[#dbdee1] whitespace-pre-line leading-relaxed">
                    {formData.panelDescription}
                  </div>

                  {formData.panelNotes.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-[#232428] border border-[#1e1f22] space-y-1 text-xs">
                      <div className="font-bold text-[#949ba4] text-[11px] mb-1">تعليمات هامة:</div>
                      {formData.panelNotes.map((n, i) => (
                        <div key={i} className="text-[#dbdee1]">
                          • {n}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Media Gallery Banner Image */}
                  <div className="rounded-lg overflow-hidden border border-[#1e1f22] max-h-36 bg-[#1e1f22]">
                    <img
                      src={formData.imageUrl || ticketBannerDefault}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ticketBannerDefault;
                      }}
                    />
                  </div>

                  {/* Interactive Styled Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className={`w-full sm:w-auto px-4 py-2 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm ${getButtonClass(
                        formData.buttonColor
                      )}`}
                    >
                      <span>{formData.buttonEmoji}</span>
                      <span>{formData.buttonLabel}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Inside Ticket Container Preview */
                <div className="bg-[#2b2d31] border border-[#1e1f22] rounded-xl p-3.5 space-y-3">
                  <div className="text-xs text-[#00a8fc] font-bold">
                    @Eyad (صاحب التذكرة)
                  </div>

                  <div className="text-xs text-[#dbdee1] whitespace-pre-line leading-relaxed">
                    {formData.welcomeMessage}
                  </div>

                  <div className="p-2 rounded-lg bg-[#232428] text-xs">
                    <span className="font-bold text-[#949ba4]">سبب فتح التذكرة: </span>
                    <span className="text-white">مشكلة في تفعيل الرتبة</span>
                  </div>

                  {/* Claim Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md font-semibold text-xs bg-[#248046] text-white flex items-center gap-2"
                    >
                      <span>{formData.claimButtonEmoji}</span>
                      <span>{formData.claimButtonLabel} (+3 نقاط)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 text-[11px] text-slate-400 text-center">
              يتم إنشاء التذكرة داخل كاتيجوري <code className="font-mono text-slate-300">ID: {formData.categoryId}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
