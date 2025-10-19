// Voice synthesis implementation for Ritualist
class VoiceService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
  }
  
  init() {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
    this.loadVoices();
  }
  
  loadVoices() {
    this.voices = this.synth.getVoices();
    // Default to a neutral voice
    this.selectedVoice = this.voices.find(voice => 
      voice.name === 'Google UK English Female' || 
      voice.name === 'Microsoft Zira' ||
      voice.lang === 'en-US'
    ) || this.voices[0];
  }
  
  setVoice(voiceName) {
    this.selectedVoice = this.voices.find(v => v.name === voiceName) || this.selectedVoice;
  }
  
  speak(text, rate = 1, pitch = 1, volume = 1) {
    if (!this.synth) return;
    
    // Cancel any ongoing speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    this.synth.speak(utterance);
    return utterance;
  }
  
  speakRoutineIntro(routine) {
    const introText = `Time for your ${routine.routineTitle}. This routine will take about ${routine.routineDuration} minutes. Are you ready to begin?`;
    return this.speak(introText);
  }
  
  speakRoutineSteps(routine) {
    let fullText = `Let's begin your ${routine.routineTitle} routine. `;
    
    routine.routineSteps.forEach((step, index) => {
      fullText += `Step ${index + 1}: ${step.text}. Take ${step.duration} minutes for this step. `;
    });
    
    fullText += "When you're done, come back to mark the routine as complete.";
    return this.speak(fullText, 0.9); // Slightly slower for instructions
  }
  
  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export default VoiceService;
