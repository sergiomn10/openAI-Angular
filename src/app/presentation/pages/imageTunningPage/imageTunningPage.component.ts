import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  MyMessageComponent,
  ChatMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
  GptMessageEditableImageComponent,
} from '@components/index';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { Message } from '@interfaces/message.interface';

@Component({
  selector: 'app-image-tunning-page',
  imports: [
    MyMessageComponent,
    ChatMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent,
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {
  messages = signal<Message[]>([
    {
      isGpt: true,
      text: 'Dummy image',
      imageInfo: {
        alt: 'Dummy image',
        url: 'http://localhost:3000/gpt/image-generation/1756278661806.png',
      },
    },
  ]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);
  originalImage = signal<string | undefined>(undefined);
  maskImage = signal<string | undefined>(undefined);  

  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { isGpt: false, text: prompt }]);

    this.openAiService.imageGeneration(prompt, this.originalImage(), this.maskImage())
    .subscribe((resp) => {
      this.isLoading.set(false);
      if (!resp) {
        return;
      }

      this.messages.update((prev) => [
        ...prev,
        {
          isGpt: true,
          text: resp.alt,
          imageInfo: resp,
        },
      ]);
    });
  }

  generateVariation() {

    if(!this.originalImage()){
      return;
    }
    this.isLoading.set(true);

    this.openAiService
      .imageVariation(this.originalImage()!)
      .subscribe((resp) => {
        this.isLoading.set(false);
        if (!resp) {
          return;
        }

        this.messages.update(prev =>[...prev, {
          isGpt: true,
          text: resp.alt,
          imageInfo: resp,
        }]);

      });

  }

  handleImageChange(newImage: string, originalImage: string) {
    this.originalImage.set(originalImage);
    this.maskImage.set(newImage);


    
  }
}
