import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from "@components/index";
import { Message } from '@interfaces/index';

@Component({
  selector: 'app-pros-cons-page',
  imports: [ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent],
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent { 

  
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject( OpenAiService );
  



  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update( (prev) => [
      ...prev,
      {
        isGpt:false,
        text: prompt
      }
    ]);

    this.openAiService.prosConsDiscusser( prompt )
    .subscribe( resp => {
      this.isLoading.set(false);

      this.messages.update( prev => [
        ...prev, // los tres puntos indican que se van a esparcir los valores del array para poder agregar uno nuevo
        {
          isGpt: true,
          text: resp.content[0].text
          
        }
      ] );
    } );

  }
}
