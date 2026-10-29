import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Ingreso } from '../models/reporte.model';
@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/reportes';
  ingresos(desde: string, hasta: string) {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<Ingreso[]>(`${this.url}/ingresos-por-servicio`, {
      params,
    });
  }
}
