import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Avisos } from '../../../../core/services/avisos';
import { camposError, mensajeError } from '../../../../core/utils/http-error';
import { ErrorCampo } from '../../../../shared/components/errores-campo/errores-campo';
import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { Orden } from '../../models/orden.model';
import { OrdenService } from '../../services/orden-service';
@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    SiPermiso,
    ErrorCampo,
  ],
  styleUrl: './orden-list.css',
  templateUrl: './orden-list.html',
})
export class OrdenList implements OnInit {
  private readonly service = inject(OrdenService);
  private readonly avisos = inject(Avisos);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly items = signal<Orden[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly seleccionada = signal<Orden | null>(null);
  readonly anulando = signal(false);
  readonly errorAnular = signal('');
  readonly campos = signal<Record<string, string>>({});
  readonly motivo = this.fb.control('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(200),
  ]);
  filtros = { placa: '', estado: '', desde: '', hasta: '' };
  ngOnInit() {
    this.consultar();
  }
  consultar() {
    this.cargando.set(true);
    this.error.set('');
    this.service.consultar(this.filtros).subscribe({
      next: (r) => {
        this.items.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  preparar(o: Orden) {
    this.seleccionada.set(o);
    this.motivo.reset();
    this.errorAnular.set('');
    this.campos.set({});
  }
  anular() {
    if (this.anulando()) return;
    if (this.motivo.invalid) {
      this.motivo.markAsTouched();
      return;
    }
    const o = this.seleccionada();
    if (!o) return;
    this.anulando.set(true);
    this.service.anular(o.id, this.motivo.value.trim()).subscribe({
      next: (r) => {
        this.anulando.set(false);
        this.seleccionada.set(null);
        this.avisos.mostrar('Orden ' + r.numero + ' anulada');
        this.consultar();
      },
      error: (e) => {
        this.anulando.set(false);
        this.errorAnular.set(mensajeError(e));
        this.campos.set(camposError(e));
      },
    });
  }
}
