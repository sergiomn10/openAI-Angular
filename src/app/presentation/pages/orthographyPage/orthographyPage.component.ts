import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageBoxFileComponent, TextMessageEvent, TextMessageBoxSelectComponent, TextMessageBoxEvent, GptMessageOrthographyComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-orthography-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
    GptMessageOrthographyComponent
],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {

  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject( OpenAiService );
  



  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update( (prev) => [
      ...prev,
      {
        idGpt: false,
        text: prompt,
      }
    ]);

    //para que se dispare el metodo del servicio hay que suscribirse ya que retorna un Observable
    this.openAiService.checkOrthography( prompt )
    .subscribe( resp =>{
      this.isLoading.set(false);
      
      this.messages.update( prev => [
        ...prev,
        {
          idGpt: true,
          text: resp.message,
          info: resp,
        }
      ]);
    });
  }
  
  
}
