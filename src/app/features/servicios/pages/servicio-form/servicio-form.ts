import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Avisos } from '../../../../core/services/avisos';
import { camposError, mensajeError } from '../../../../core/utils/http-error';
import { noSoloEspacios } from '../../../../core/utils/validadores';
import { ErrorCampo } from '../../../../shared/components/errores-campo/errores-campo';
import { ServicioService } from '../../services/servicio-service';
@Component({
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo],
  styleUrl: './servicio-form.css',
  templateUrl: './servicio-form.html',
})
export class ServicioForm implements OnInit {
  private readonly service = inject(ServicioService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly avisos = inject(Avisos);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly id = this.route.snapshot.paramMap.has('id')
    ? Number(this.route.snapshot.paramMap.get('id'))
    : null;
  readonly disponible = signal(this.id === null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly form = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(/^SRV-[0-9]{3}$/)]],
    nombre: [
      '',
      [Validators.required, noSoloEspacios, Validators.minLength(3), Validators.maxLength(80)],
    ],
    precio: [
      0,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(99999999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
    ],
    duracionMin: [
      60,
      [Validators.required, Validators.min(15), Validators.max(480), Validators.pattern(/^\d+$/)],
    ],
  });
  ngOnInit() {
    if (this.id !== null) {
      if (!Number.isSafeInteger(this.id) || this.id <= 0) {
        this.error.set('Identificador de registro inválido');
        return;
      }
      this.cargando.set(true);
      this.service.obtener(this.id).subscribe({
        next: (r) => {
          this.form.patchValue(r);
          this.disponible.set(true);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(mensajeError(e));
          this.cargando.set(false);
        },
      });
    }
  }
  guardar() {
    if (this.guardando() || this.cargando() || !this.disponible()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    this.campos.set({});
    const dto = this.form.getRawValue();
    const peticion = this.id ? this.service.actualizar(this.id, dto) : this.service.crear(dto);
    peticion.subscribe({
      next: () => {
        this.avisos.mostrar('Servicio guardado correctamente');
        void this.router.navigate(['/servicios']);
      },
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeError(e));
        this.campos.set(camposError(e));
      },
    });
  }
}
