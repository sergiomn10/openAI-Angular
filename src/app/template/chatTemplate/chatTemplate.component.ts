import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  TextMessageEvent,
  TextMessageBoxEvent,
  MyMessageComponent,
  ChatMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
} from '@components/index';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { Message } from '@interfaces/message.interface';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-template',
  imports: [
    ReactiveFormsModule,
    MyMessageComponent,
    ChatMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './chatTemplate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTemplateComponent {
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    console.log(prompt);
  }

  // handleMessageWithFile({ prompt, file}: TextMessageEvent) {
  //   console.log({prompt, file });
  // }

  // handleMessageWithSelect($event: TextMessageBoxEvent) {

  // }
}
