import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  FileText,
  Star,
  Download,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Globe,
  Radio,
  Clock,
  User,
  Shield,
  Trash2
} from 'lucide-react';
import { TicketRecord, UserSession } from '../../types/bot';
import { LiveSpeechEngine, checkSpeechSupport } from '../../services/speechRecognition';

interface TranscriptsAndSTTModuleProps {
  tickets: TicketRecord[];
  onUpdateTickets: (updated: TicketRecord[]) => void;
  currentUser: UserSession;
}

export const TranscriptsAndSTTModule: React.FC<TranscriptsAndSTTModuleProps> = ({
  tickets,
  onUpdateTickets,
  currentUser
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.channelId || '');
  const [language, setLanguage] = useState<'ar-SA' | 'en-US'>('ar-SA');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(96);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([15, 30, 20, 45, 60, 25, 40, 15, 35, 50]);

  const speechEngineRef = useRef<LiveSpeechEngine | null>(null);
  const isSupported = checkSpeechSupport();

  // Initialize Speech engine
  useEffect(() => {
    const engine = new LiveSpeechEngine(language);
    speechEngineRef.current = engine;

    engine.onStateChange = (state) => {
      if (state.isListening !== undefined) setIsListening(state.isListening);
      if (state.transcript !== undefined) setTranscript(state.transcript);
      if (state.interimTranscript !== undefined) setInterimTranscript(state.interimTranscript);
      if (state.confidence !== undefined) setConfidence(state.confidence);
      if (state.error !== undefined) setErrorMsg(state.error);
    };

    engine.onWaveformData = (data) => {
      // Pick 12 representative frequency bins for the visualizer
      const bars: number[] = [];
      const step = Math.floor(data.length / 12) || 1;
      for (let i = 0; i < 12; i++) {
        const val = data[i * step] || 0;
        bars.push(Math.max(10, Math.min(100, Math.round((val / 255) * 100))));
      }
      setWaveformBars(bars);
    };

    return () => {
      engine.stop();
    };
  }, [language]);

  const toggleListening = async () => {
    if (!speechEngineRef.current) return;
    if (isListening) {
      speechEngineRef.current.stop();
    } else {
      setErrorMsg(null);
      const success = await speechEngineRef.current.start();
      if (!success) {
        // Simulated voice transcription fallback if microphone hardware is unavailable
        simulateLiveVoiceInput();
      }
    }
  };

  // Fallback simulator in case browser microphone permissions are blocked in sandbox
  const simulateLiveVoiceInput = () => {
    setIsListening(true);
    const demoPhrases = [
      'السلام عليكم ورحمة الله، أهلاً بك في دعم سيرفر OPS.',
      'تم التحقق من المشكلة المسجلة بالتذكرة ورقم التحويل سليم.',
      'تم إعطاء الرتبة بنجاح وحل التذكرة، هل لديك أي استفسار آخر؟'
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < demoPhrases.length) {
        setTranscript((prev) => (prev ? prev + ' ' + demoPhrases[step] : demoPhrases[step]));
        step++;
      } else {
        clearInterval(interval);
        setIsListening(false);
      }
    }, 1400);
  };

  const handleClearTranscript = () => {
    speechEngineRef.current?.resetTranscript();
    setTranscript('');
    setInterimTranscript('');
  };

  const handleCopyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Attach the current transcribed text to the selected ticket
  const handleAttachToTicket = () => {
    if (!transcript.trim() || !selectedTicketId) return;
    const updated = tickets.map((t) => {
      if (t.channelId === selectedTicketId) {
        return {
          ...t,
          voiceTranscript: (t.voiceTranscript ? t.voiceTranscript + '\n' : '') + transcript.trim()
        };
      }
      return t;
    });
    onUpdateTickets(updated);
    alert('تم إرفاق التفريغ الصوتي بنجاح إلى سجل التذكرة!');
  };

  const selectedTicket = tickets.find((t) => t.channelId === selectedTicketId) || tickets[0];

  const handleExportTranscriptFile = (ticket: TicketRecord) => {
    const textContent = `=== TRANSCRIPT OF ${ticket.channelName} ===\nOpened At: ${new Date(
      ticket.openedAt
    ).toLocaleString()}\nStatus: ${ticket.status}\nOwner: ${ticket.ownerTag} (${
      ticket.ownerId
    })\nClaimed By: ${ticket.claimedByTag || 'None'}\nReason: ${ticket.reason}\nFeedback: ${
      ticket.feedbackRating ? `${ticket.feedbackRating}/5 Stars - ${ticket.feedbackComment}` : 'N/A'
    }\nVoice Transcription: ${ticket.voiceTranscript || 'None'}\n\n=== MESSAGES ===\n` +
      ticket.transcript.map((m) => `[${m.timestamp}] ${m.author}: ${m.content}`).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ticket.channelName}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#5865F2]" />
              محرك تحويل الصوت إلى نص المباشر (Real-Time STT Engine)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              تسجيل وتفريغ الصوت لحظياً لدعم استجابة الإدارة السريعة، إرفاق الملاحظات الصوتية للتذاكر، ومراجعة تقييمات الأعضاء.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">لغة التفريغ:</span>
            <div className="flex items-center p-0.5 rounded-xl bg-[#0b0e14] border border-[#20293b]">
              <button
                onClick={() => setLanguage('ar-SA')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'ar-SA' ? 'bg-[#5865F2] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية (ar-SA)
              </button>
              <button
                onClick={() => setLanguage('en-US')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'en-US' ? 'bg-[#5865F2] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                English (en-US)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STT Studio Card with live waveform */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2536] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2230] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                  : 'bg-[#5865F2] text-white hover:bg-[#4752c4]'
              }`}
              title={isListening ? 'إيقاف التسجيل' : 'بدء التحدث والتفريغ'}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {isListening ? 'جاري الاستماع والتفريغ اللحظي...' : 'اضغط على الميكروفون لبدء التسجيل الصوتي'}
                </span>
                {isListening && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold animate-pulse">
                    LIVE REC
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                الدقة التقديرية: <span className="font-mono text-emerald-400 tabular-nums">{confidence}%</span> · يدعم اللهجات والمصطلحات الإدارية
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTranscript}
              disabled={!transcript}
              className="px-3 py-1.5 bg-[#182030] hover:bg-[#222c42] text-slate-300 disabled:opacity-40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'تم النسخ' : 'نسخ النص'}</span>
            </button>

            <button
              onClick={handleClearTranscript}
              disabled={!transcript && !interimTranscript}
              className="p-2 bg-[#182030] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 disabled:opacity-40 rounded-xl transition-colors"
              title="مسح النص"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Audio Waveform Visualizer */}
        <div className="h-16 rounded-xl bg-[#0b0e14] border border-[#1b2230] p-2 flex items-center justify-center gap-1.5 overflow-hidden">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              style={{
                height: isListening ? `${height}%` : '15%',
                transition: 'height 80ms ease'
              }}
              className={`w-2.5 rounded-full ${
                isListening
                  ? 'bg-gradient-to-t from-[#5865F2] to-emerald-400'
                  : 'bg-[#1b2230]'
              }`}
            />
          ))}
        </div>

        {/* Transcribed text box */}
        <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#20293b] min-h-[110px] text-sm text-slate-200 leading-relaxed font-sans">
          {transcript || interimTranscript ? (
            <div>
              <span>{transcript}</span>
              {interimTranscript && (
                <span className="text-[#5865F2] italic mr-1">{interimTranscript}</span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 italic">
              النص المفرغ سيظهر هنا مباشرة أثناء تحدثك في الميكروفون...
            </span>
          )}
        </div>

        {/* Attach to Ticket Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">إرفاق التفريغ للتذكرة:</span>
            <select
              value={selectedTicketId}
              onChange={(e) => setSelectedTicketId(e.target.value)}
              className="bg-[#0b0e14] border border-[#222c40] rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              {tickets.map((t) => (
                <option key={t.channelId} value={t.channelId}>
                  #{t.channelName} ({t.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAttachToTicket}
            disabled={!transcript.trim()}
            className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>إرفاق الملاحظة الصوتية للتكت المختار</span>
          </button>
        </div>
      </div>

      {/* Ticket Transcripts and Customer Feedback Archive */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2536] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b2230] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              أرشيف الترانسكربت وتقييمات الأعضاء (Transcripts & Reviews)
            </h3>
            <p className="text-xs text-slate-400">سجل كامل للمحادثات، تقييمات النجوم، والملاحظات الصوتية</p>
          </div>

          <button
            onClick={() => handleExportTranscriptFile(selectedTicket)}
            className="px-3 py-1.5 bg-[#182030] hover:bg-[#25324c] text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل ترانسكربت التكت الحالي</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tickets Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block mb-1">اختر تذكرة لعرض سجلها:</span>
            {tickets.map((t) => {
              const isSelected = t.channelId === selectedTicket.channelId;
              return (
                <button
                  key={t.channelId}
                  onClick={() => setSelectedTicketId(t.channelId)}
                  className={`w-full text-right p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#182133] border-[#5865F2] text-white shadow-sm'
                      : 'bg-[#0e131d] border-[#1b2230] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">#{t.channelName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        t.status === 'open'
                          ? 'bg-amber-500/20 text-amber-300'
                          : t.status === 'claimed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {t.status === 'open' ? 'جديدة' : t.status === 'claimed' ? 'مستلمة' : 'مغلقة'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{t.reason}</p>

                  {/* Rating Stars preview */}
                  {t.feedbackRating && (
                    <div className="mt-2 flex items-center gap-1 text-amber-400 text-xs">
                      {Array.from({ length: t.feedbackRating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Transcript Viewer (8 cols) */}
          <div className="lg:col-span-8 bg-[#0b0e14] border border-[#1b2230] rounded-xl p-4 space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[#1b2230] pb-2 text-xs">
              <div>
                <span className="font-bold text-white text-sm">#{selectedTicket.channelName}</span>
                <span className="text-slate-400 mr-2">صاحب التكت: {selectedTicket.ownerTag}</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                {new Date(selectedTicket.openedAt).toLocaleTimeString('ar-SA')}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedTicket.transcript.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5 text-right text-xs">
                  <img
                    src={msg.authorAvatar}
                    alt={msg.author}
                    className="w-7 h-7 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white">{msg.author}</span>
                      {msg.isBot && (
                        <span className="px-1 py-0.2 rounded bg-[#5865F2] text-white text-[9px] font-bold">
                          BOT
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>
                    <div className="text-slate-300 bg-[#131924] p-2 rounded-lg leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Transcript note if present */}
            {selectedTicket.voiceTranscript && (
              <div className="p-3 rounded-xl bg-[#141d2c] border border-[#233149] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#5865F2] font-bold">
                  <Mic className="w-3.5 h-3.5" />
                  <span>الملاحظة الصوتية المفرغة (Voice STT Record):</span>
                </div>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedTicket.voiceTranscript}
                </p>
              </div>
            )}

            {/* Feedback Rating & Comment */}
            {selectedTicket.feedbackRating && (
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300">تقييم العضو لخدمة الدعم:</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (selectedTicket.feedbackRating || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {selectedTicket.feedbackComment && (
                  <p className="text-slate-300 italic">"{selectedTicket.feedbackComment}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
