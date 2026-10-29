import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Vehiculo, VehiculoRequest } from '../models/vehiculo.model';
@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/vehiculos';
  listar(clienteId?: number) {
    return this.http.get<Vehiculo[]>(this.url, {
      params: clienteId ? { clienteId } : {},
    });
  }
  obtener(id: number) {
    return this.http.get<Vehiculo>(`${this.url}/${id}`);
  }
  crear(dto: VehiculoRequest) {
    return this.http.post<Vehiculo>(this.url, dto);
  }
  actualizar(id: number, dto: VehiculoRequest) {
    return this.http.put<Vehiculo>(`${this.url}/${id}`, dto);
  }
  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
