import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-hah-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hah-dropdown.component.html',
  styleUrl: './hah-dropdown.component.css',
})
export class HahDropdownComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() labelText: string = '';
  @Input() labelFor: string = '';
  @Input() options: { value: any; label: string }[] = [];
  @Input() isRequired: boolean = false;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  onDropdownChange(event: any): void {
    const selectedValue = event.target.value;
    this.valueChange.emit(selectedValue);
  }
}
