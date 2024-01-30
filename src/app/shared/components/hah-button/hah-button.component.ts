import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hah-button',
  standalone: true,
  imports: [],
  templateUrl: './hah-button.component.html',
  styleUrl: './hah-button.component.css',
})
export class HahButtonComponent {
  @Input() buttonText: string = 'Click me';
  @Input() buttonValue: string = '';
  @Input() buttonId: string = '';
  @Input() buttonClass: string = 'btn btn-primary';
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;

  onClick() {
    // You can customize the behavior of the button click here
    alert('Button clicked!');
  }
}
