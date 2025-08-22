import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMessageComponent, ChatMessageComponent, TypingLoaderComponent,  TextMessageBoxEvent, TextMessageBoxSelectComponent } from '@components/index';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { Message } from '@interfaces/message.interface';

@Component({
  selector: 'app-text-to-audio-page',
  imports: [
    ReactiveFormsModule,
    MyMessageComponent,
    ChatMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
    TextMessageBoxSelectComponent
],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {

  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);

  voices = signal([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);
 

  handleMessageWithSelect({prompt, selectedOption}: TextMessageBoxEvent) {
    const message = `${selectedOption} - ${prompt}`;

    this.messages.update( prev => [...prev, {text: message, isGpt: false}]);
    this.isLoading.set(true);

    this.openAiService.textToAudio(prompt,selectedOption)
    .subscribe( ({message, audioUrl}) => {
      this.isLoading.set(false);
      this.messages.update( prev => [
        ...prev,
        {
          isGpt: true, 
          text: message, 
          audioUrl: audioUrl,
        }
      ])
    })

  }
 }
