
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition: any;
  isListening = false;
  transcript = '';

  constructor() {
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.interimResults = true; // Captures real-time transcription
      this.recognition.lang = 'en-US';        // Language setting
      
    } else {
      console.error('SpeechRecognition is not supported in this browser.');
    }
  }

  
  startRecognition() {
    if (this.recognition) {
      this.isListening = true;
      this.recognition.start();
    } else {
      console.error('SpeechRecognition instance is not available.');
    }
  }

  
  stopRecognition() {
    if (this.recognition) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  
  onResult(callback: (transcript: string) => void) {
    if (this.recognition) {
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        callback(transcript);
      };
    }
  }
}
