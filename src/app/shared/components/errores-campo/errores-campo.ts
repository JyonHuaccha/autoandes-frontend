import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-error-campo',
  styleUrl: './errores-campo.css',
  templateUrl: './errores-campo.html',
})
export class ErrorCampo {
  control = input<AbstractControl | null>(null);
  servidor = input<string>();
  mensaje = input('Revise el valor de este campo.');
}
