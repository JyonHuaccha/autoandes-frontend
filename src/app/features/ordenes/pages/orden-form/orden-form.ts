import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Avisos } from '../../../../core/services/avisos';
import { camposError, mensajeError } from '../../../../core/utils/http-error';
import { ErrorCampo } from '../../../../shared/components/errores-campo/errores-campo';
import { Servicio } from '../../../servicios/models/servicio.model';
import { ServicioService } from '../../../servicios/services/servicio-service';
import { Vehiculo } from '../../../vehiculos/models/vehiculo.model';
import { VehiculoService } from '../../../vehiculos/services/vehiculo-service';
import { OrdenService } from '../../services/orden-service';
export function sinServiciosRepetidos(control: AbstractControl): ValidationErrors | null {
  const ids = (control.value ?? [])
    .map((d: { servicioId: number }) => d.servicioId)
    .filter((id: number) => id > 0);
  return new Set(ids).size < ids.length ? { repetido: true } : null;
}
@Component({
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, ErrorCampo],
  styleUrl: './orden-form.css',
  templateUrl: './orden-form.html',
})
export class OrdenForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(OrdenService);
  private readonly catalogo = inject(ServicioService);
  private readonly flota = inject(VehiculoService);
  private readonly router = inject(Router);
  private readonly avisos = inject(Avisos);
  readonly servicios = signal<Servicio[]>([]);
  readonly vehiculos = signal<Vehiculo[]>([]);
  readonly error = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly guardando = signal(false);
  readonly cargando = signal(true);
  readonly form = this.fb.group({
    vehiculoId: [0, [Validators.required, Validators.min(1)]],
    kilometraje: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(9999999),
        Validators.pattern(/^\d+$/),
      ],
    ],
    detalles: this.fb.array(
      [this.linea()],
      [Validators.minLength(1), Validators.maxLength(10), sinServiciosRepetidos],
    ),
  });
  readonly valores = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });
  readonly total = computed(() => {
    this.valores();
    this.servicios();
    return this.detalles.controls.reduce((s, _, i) => s + this.subtotal(i), 0);
  });
  get detalles() {
    return this.form.controls.detalles;
  }
  private linea() {
    return this.fb.group({
      servicioId: [0, [Validators.required, Validators.min(1)]],
      cantidad: [
        1,
        [Validators.required, Validators.min(1), Validators.max(5), Validators.pattern(/^\d+$/)],
      ],
    });
  }
  ngOnInit() {
    forkJoin({
      servicios: this.catalogo.listar(),
      vehiculos: this.flota.listar(),
    }).subscribe({
      next: (r) => {
        this.servicios.set(r.servicios.filter((s) => s.activo));
        this.vehiculos.set(r.vehiculos);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  agregar() {
    if (this.detalles.length < 10) this.detalles.push(this.linea());
  }
  quitar(i: number) {
    if (this.detalles.length > 1) this.detalles.removeAt(i);
  }
  precio(i: number) {
    const id = this.detalles.at(i).controls.servicioId.value;
    return this.servicios().find((s) => s.id === Number(id))?.precio ?? 0;
  }
  subtotal(i: number) {
    return (
      Math.round(this.precio(i) * Number(this.detalles.at(i).controls.cantidad.value || 0) * 100) /
      100
    );
  }
  usado(id: number, i: number) {
    return this.detalles.controls.some(
      (g, j) => j !== i && Number(g.controls.servicioId.value) === id,
    );
  }
  guardar() {
    if (this.guardando() || this.cargando()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    this.campos.set({});
    this.service.registrar(this.form.getRawValue()).subscribe({
      next: (o) => {
        this.avisos.mostrar('Orden ' + o.numero + ' registrada correctamente');
        void this.router.navigate(['/ordenes', o.id]);
      },
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeError(e));
        this.campos.set(camposError(e));
      },
    });
  }
}
