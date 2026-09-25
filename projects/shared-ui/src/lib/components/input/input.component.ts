import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule
} from '@angular/forms'

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = 'input-' + Math.random().toString(36).substring(2, 9)
  @Input() label?: string
  @Input() placeholder = ''
  @Input() type: 'text' | 'number' | 'password' | 'email' | 'search' = 'text'
  @Input() disabled = false
  @Input() required = false
  @Input() error?: string
  @Input() hint?: string
  @Input() hasPrefix = false
  @Input() hasSuffix = false

  @Output() valueChange = new EventEmitter<string>()

  value = ''

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  writeValue(value: string): void {
    this.value = value || ''
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement
    this.value = input.value
    this.onChange(this.value)
    this.valueChange.emit(this.value)
  }

  onBlur(): void {
    this.onTouched()
  }
}
