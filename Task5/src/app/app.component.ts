import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoiceRecognitionService } from './voice-recognition/voice-recognition.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'task4';
  transcript: string = '';

  constructor(private voiceService: VoiceRecognitionService) {
    this.voiceService.onResult((result: string) => {
      this.transcript = result;
    });
  }

  startListening() {
    this.voiceService.startRecognition();
  }

  stopListening() {
    this.voiceService.stopRecognition();
  }
}
