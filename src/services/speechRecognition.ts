// Speech-to-Text audio service supporting Web Speech API & Web Audio Waveform

export interface SpeechRecognitionResultState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  language: string;
  isSupported: boolean;
}

// Check browser support for SpeechRecognition
export function checkSpeechSupport(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export class LiveSpeechEngine {
  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  public onStateChange: ((state: Partial<SpeechRecognitionResultState>) => void) | null = null;
  public onWaveformData: ((data: Uint8Array) => void) | null = null;

  private currentLanguage = 'ar-SA';
  private isListening = false;
  private fullTranscript = '';

  constructor(language = 'ar-SA') {
    this.currentLanguage = language;
    this.initRecognition();
  }

  private initRecognition() {
    if (!checkSpeechSupport()) return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRec();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLanguage;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStateChange?.({ isListening: true, error: null });
      this.startAudioWaveform();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      let confidence = 0.95;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
          if (result[0].confidence) confidence = result[0].confidence;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        this.fullTranscript = (this.fullTranscript + ' ' + final).trim();
      }

      this.onStateChange?.({
        transcript: this.fullTranscript,
        interimTranscript: interim,
        confidence: Math.round(confidence * 100)
      });
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition warning:', event.error);
      this.onStateChange?.({ error: `Speech error: ${event.error}` });
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Automatically restart if unexpectedly ended while still listening
        try {
          this.recognition.start();
        } catch {
          this.isListening = false;
          this.stopAudioWaveform();
          this.onStateChange?.({ isListening: false });
        }
      } else {
        this.stopAudioWaveform();
        this.onStateChange?.({ isListening: false });
      }
    };
  }

  public setLanguage(lang: 'ar-SA' | 'en-US') {
    this.currentLanguage = lang;
    if (this.recognition) {
      const wasListening = this.isListening;
      if (wasListening) this.stop();
      this.recognition.lang = lang;
      this.onStateChange?.({ language: lang });
      if (wasListening) this.start();
    }
  }

  public async start(): Promise<boolean> {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      this.onStateChange?.({ error: 'Speech Recognition not supported in this browser' });
      return false;
    }

    try {
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      return false;
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.stopAudioWaveform();
    this.onStateChange?.({ isListening: false, interimTranscript: '' });
  }

  public resetTranscript() {
    this.fullTranscript = '';
    this.onStateChange?.({ transcript: '', interimTranscript: '' });
  }

  public setTranscript(text: string) {
    this.fullTranscript = text;
    this.onStateChange?.({ transcript: text });
  }

  private async startAudioWaveform() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;

      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.microphone.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaveform = () => {
        if (!this.analyser || !this.isListening) return;
        this.analyser.getByteFrequencyData(dataArray);
        this.onWaveformData?.(dataArray);
        this.animFrameId = requestAnimationFrame(updateWaveform);
      };

      updateWaveform();
    } catch (err) {
      console.warn('Audio waveform microphone visualization not accessible:', err);
    }
  }

  private stopAudioWaveform() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
