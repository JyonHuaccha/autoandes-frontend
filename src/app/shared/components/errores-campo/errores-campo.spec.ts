import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorCampo } from './errores-campo';

@Component({
  imports: [ReactiveFormsModule, ErrorCampo],
  template: `
    <input [formControl]="control" />
    <app-error-campo [control]="control" mensaje="El nombre es obligatorio" />
    <button (click)="control.markAsTouched()">Guardar</button>
  `,
})
class FormularioPrueba {
  readonly control = new FormControl('', Validators.required);
}

describe('Errores de campo', () => {
  it('muestra el mensaje al tocar un control aunque su referencia siga siendo la misma', async () => {
    const fixture = TestBed.createComponent(FormularioPrueba);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error-campo')).toBeNull();
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.error-campo')?.textContent).toContain(
      'El nombre es obligatorio',
    );
  });

  it('prioriza los mensajes de validación devueltos por el backend', () => {
    const fixture = TestBed.createComponent(ErrorCampo);
    fixture.componentRef.setInput('servidor', 'La placa debe tener el formato ABC-123');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('La placa debe tener el formato ABC-123');
  });
});
