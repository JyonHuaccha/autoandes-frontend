import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Avisos } from '../../../../core/services/avisos';
import { camposError, mensajeError } from '../../../../core/utils/http-error';
import { noSoloEspacios } from '../../../../core/utils/validadores';
import { ErrorCampo } from '../../../../shared/components/errores-campo/errores-campo';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClienteService } from '../../../clientes/services/cliente-service';
import { VehiculoService } from '../../services/vehiculo-service';
@Component({
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo],
  styleUrl: './vehiculo-form.css',
  templateUrl: './vehiculo-form.html',
})
export class VehiculoForm implements OnInit {
  private readonly service = inject(VehiculoService);
  private readonly clientesService = inject(ClienteService);
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
  readonly clientes = signal<Cliente[]>([]);
  readonly form = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-[0-9]{3}$/)]],
    marca: ['', [Validators.required, noSoloEspacios, Validators.maxLength(40)]],
    modelo: ['', [Validators.required, noSoloEspacios, Validators.maxLength(40)]],
    anio: [
      2026,
      [
        Validators.required,
        Validators.min(1990),
        Validators.max(2027),
        Validators.pattern(/^\d+$/),
      ],
    ],
    clienteId: [0, [Validators.required, Validators.min(1)]],
  });
  ngOnInit() {
    this.clientesService.listar().subscribe({
      next: (r) => this.clientes.set(r),
      error: (e) => this.error.set(mensajeError(e)),
    });
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
        this.avisos.mostrar('Vehiculo guardado correctamente');
        void this.router.navigate(['/vehiculos']);
      },
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeError(e));
        this.campos.set(camposError(e));
      },
    });
  }
}
