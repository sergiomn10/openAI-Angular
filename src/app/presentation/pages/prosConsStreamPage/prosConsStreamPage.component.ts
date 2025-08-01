import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMessageComponent, ChatMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  imports: [
   ReactiveFormsModule,
    MyMessageComponent,
    ChatMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent { 

  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject( OpenAiService );
  

  abortSignal = signal(new AbortController());



  async handleMessage(prompt: string) {

    this.abortSignal().abort();
    this.abortSignal = signal(new AbortController());

    this.messages.update( prev => [
      ...prev,
      {
        idGpt: false,
        text: prompt
      },
      {
        idGpt: true,
        text: '...'
      }
    ] );

    this.isLoading.set(true);
    const stream = this.openAiService.prosConsStreamDiscusser(prompt, this.abortSignal().signal);
    this.isLoading.set(false);

    for await (const text of stream){
      this.handleStreamResponse(text);
    }

  }
  

  handleStreamResponse( message: string ){
    this.messages().pop();// con pop obtiene el ultimo mensaje de la lista
    const messages = this.messages();

    this.messages.set([...messages,{idGpt:true, text: message}]);
  }
}
