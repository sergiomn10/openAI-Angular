import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-message-box',
  imports: [ReactiveFormsModule],
  templateUrl: './textMessageBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxComponent {
  placeholder = input<string>();
  disableCorrections = input<boolean>(false);
  @Output() onMessage = new EventEmitter<string>();

  fb = inject(FormBuilder);
  form = this.fb.group({
    prompt: ['', Validators.required],
  });

  handleSubmit() {
    if(this.form.invalid) return;

    const { prompt } = this.form.value;
    

    this.onMessage.emit(prompt ?? '');
    this.form.reset();
  }
}
