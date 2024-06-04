import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-check-box-input',
  templateUrl: './check-box-input.component.html',
  styleUrls: ['./check-box-input.component.scss']
})
export class CheckBoxInputComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() hintMessage!: string;
  @Input() value!: boolean ;
  @Output() valueChange = new EventEmitter<boolean>();

  constructor() {
  }

  protected onValueChange(value: boolean) {
    this.value = value;
    this.valueChange.emit(this.value);
  }

}
