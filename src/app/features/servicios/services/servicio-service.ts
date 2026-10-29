import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Servicio, ServicioRequest } from '../models/servicio.model';
@Injectable({ providedIn: 'root' })
export class ServicioService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/servicios';
  listar() {
    return this.http.get<Servicio[]>(this.url);
  }
  obtener(id: number) {
    return this.http.get<Servicio>(`${this.url}/${id}`);
  }
  crear(dto: ServicioRequest) {
    return this.http.post<Servicio>(this.url, dto);
  }
  actualizar(id: number, dto: ServicioRequest) {
    return this.http.put<Servicio>(`${this.url}/${id}`, dto);
  }
  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  estado(id: number, activo: boolean) {
    return this.http.patch<Servicio>(`${this.url}/${id}/estado`, { activo });
  }
}
