import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-gpt-message-editable-image',
  imports: [],
  templateUrl: './gptMessageEditableImage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageEditableImageComponent implements AfterViewInit {
  text = input.required<string>();
  imageInfo = input.required<{ url: string; alt: string }>();
  @ViewChild('canvas') canvasElement?: ElementRef<HTMLCanvasElement>;

  @Output() onSelectedImage = new EventEmitter<string>();

  originalImage = signal<HTMLImageElement | null>(null);
  isDrawing = signal(false);
  coords = signal({ x: 0, y: 0 });
  

  ngAfterViewInit(): void {
    if (!this.canvasElement?.nativeElement) {
      return;
    }

    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'Anonymous'; // To avoid CORS issues
    image.src = this.imageInfo().url;

    this.originalImage.set(image);

    image.onload = () => {      
      // Draw the image onto the canvas
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);

    };
  }

  onMouseDown(event: MouseEvent) {
    if(!this.canvasElement?.nativeElement) {
      return;
    }

    this.isDrawing.set(true);

    const startX = event.clientX - this.canvasElement.nativeElement.getBoundingClientRect().left;
    const startY = event.clientY - this.canvasElement.nativeElement.getBoundingClientRect().top;

    this.coords.set({ x: startX, y: startY });
  }

  onMouseMove(event: MouseEvent) {
    if(!this.isDrawing() || !this.canvasElement?.nativeElement) {
      return;
    }

    const canvasRef = this.canvasElement.nativeElement;
    const currentX = event.clientX - canvasRef.getBoundingClientRect().left;
    const currentY = event.clientY - canvasRef.getBoundingClientRect().top;

    //calcular el ancho y alto del rectangulo
    const width = currentX - this.coords().x;
    const height = currentY - this.coords().y;

    const canvasWith = canvasRef.width;
    const canvasHeight = canvasRef.height;

    //ToDO limpiar el canvas 

    const context = canvasRef.getContext('2d')!;
    context.clearRect(0, 0, canvasWith, canvasHeight);
    context.drawImage(this.originalImage()!, 0, 0, canvasWith, canvasHeight);

    // context.fillRect(this.coords().x, this.coords().y, width, height);
    context.clearRect(this.coords().x, this.coords().y, width, height);

  }

  onMouseUp() {
    this.isDrawing.set(false);

    const canvasRef = this.canvasElement!.nativeElement!;

    
    const url = canvasRef.toDataURL('image/png');

    
    this.onSelectedImage.emit(url);

  }


  handleClick() {
    this.onSelectedImage.emit(this.imageInfo().url);
  }
}
