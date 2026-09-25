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

export interface SelectOption {
  value: string
  label: string
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements ControlValueAccessor {
  @Input() id = 'select-' + Math.random().toString(36).substring(2, 9)
  @Input() label?: string
  @Input() placeholder?: string
  @Input() options: SelectOption[] = []
  @Input() disabled = false
  @Input() required = false
  @Input() error?: string

  @Output() selectionChange = new EventEmitter<string>()

  @Input() value = ''

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

  onSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement
    this.value = select.value
    this.onChange(this.value)
    this.selectionChange.emit(this.value)
  }

  onBlur(): void {
    this.onTouched()
  }
}
