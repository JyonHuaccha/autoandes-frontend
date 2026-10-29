import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mensajeError } from '../../../../core/utils/http-error';
import { Ingreso } from '../../models/reporte.model';
import { ReporteService } from '../../services/reporte-service';
@Component({
  imports: [FormsModule, CurrencyPipe],
  styleUrl: './ingresos.css',
  templateUrl: './ingresos.html',
})
export class Ingresos implements OnInit {
  private readonly service = inject(ReporteService);
  readonly items = signal<Ingreso[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly total = computed(() => this.items().reduce((s, x) => s + x.importeTotal, 0));
  desde = '';
  hasta = '';
  ngOnInit() {
    this.consultar();
  }
  consultar() {
    this.cargando.set(true);
    this.error.set('');
    this.service.ingresos(this.desde, this.hasta).subscribe({
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
  imprimir() {
    window.print();
  }
}
