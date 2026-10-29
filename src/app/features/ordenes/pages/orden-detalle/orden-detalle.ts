import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { mensajeError } from '../../../../core/utils/http-error';
import { Orden } from '../../models/orden.model';
import { OrdenService } from '../../services/orden-service';
@Component({
  imports: [RouterLink, CurrencyPipe, DatePipe],
  styleUrl: './orden-detalle.css',
  templateUrl: './orden-detalle.html',
})
export class OrdenDetalle implements OnInit {
  private readonly service = inject(OrdenService);
  private readonly route = inject(ActivatedRoute);
  readonly orden = signal<Orden | null>(null);
  readonly error = signal('');
  readonly cargando = signal(true);
  ngOnInit() {
    this.service.obtener(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: (r) => {
        this.orden.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
}
