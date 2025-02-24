import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-selector-multiple-input',
  templateUrl: './selector-multiple-input.component.html',
  styleUrls: ['./selector-multiple-input.component.scss']
})
export class SelectorMultipleInputComponent<T> implements OnChanges {
  @Input()
  public label!: string;
  @Input()
  public placeholder!: string;
  @Input()
  public errorMessage!: string;
  @Input()
  public options: T[] = [];
  @Input()
  public selectedOptions: T[] = [];
  @Input()
  public optionDisplayFn: (option: T) => string = (option => String(option));
  @Output()
  public selectedOptionsChange = new EventEmitter<T[]>();
  @Input()
  public displayAdvancedSearchOption: boolean = false;
  @Output()
  public displayAdvancedSearchOptionClick = new EventEmitter<void>();

  protected filteredOptions: T[] = this.options;

  ngOnChanges(changes: SimpleChanges): void {
    // Important check because when an option is selected ngOnChanges gets raised. So to prevent restetting filtered options this check is necessary
    if(changes['options'] ){
      this.filteredOptions = this.options;
    }   
  }

  /**
   * Formats the selected options for display
   */
  protected get displaySelectedOptions(): string {
    if (!this.selectedOptions || this.selectedOptions.length === 0) {
      return '';
    }

    const display = this.selectedOptions
      .map(option => this.optionDisplayFn(option))
      .join(', ');

    return `[${this.selectedOptions.length}] ${display}`;
  }

  protected isSelectedOption(option: T): boolean {
    return this.selectedOptions && this.selectedOptions.includes(option)
  }

  /**
   * Sets the filtered options based on the searched value
   * @param searchValue 
   */
  protected onSearchInput(searchValue: string): void {
    // If empty value then just reset the filtered options with all the possible options.
    if (!searchValue) {
      this.filteredOptions = this.options; 
    } else {
      this.filteredOptions = this.options.filter(option =>
        this.optionDisplayFn(option).toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  }

  protected onSelectedOption(selectedOption: T): void {
    const index: number = this.selectedOptions.indexOf(selectedOption);
    if (index === -1) {
      this.selectedOptions.push(selectedOption);
    } else {
      this.selectedOptions.splice(index, 1);
    }

    this.selectedOptionsChange.emit(this.selectedOptions);
  }

  protected onCancelOptionClick(): void {
    this.selectedOptions = [];
    this.selectedOptionsChange.emit(this.selectedOptions);
  }

  protected onAdvancedSearchClick(): void {
    this.displayAdvancedSearchOptionClick.emit();
  }

}
