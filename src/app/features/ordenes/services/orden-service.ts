import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Orden, OrdenRequest } from '../models/orden.model';
@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/ordenes';
  registrar(dto: OrdenRequest) {
    return this.http.post<Orden>(this.url, dto);
  }
  consultar(filtros: Record<string, string>) {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v) params = params.set(k, v);
    });
    return this.http.get<Orden[]>(this.url, { params });
  }
  obtener(id: number) {
    return this.http.get<Orden>(`${this.url}/${id}`);
  }
  anular(id: number, motivo: string) {
    return this.http.patch<Orden>(`${this.url}/${id}/anular`, { motivo });
  }
}
