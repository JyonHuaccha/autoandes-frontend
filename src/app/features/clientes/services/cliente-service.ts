import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Cliente } from '../models/cliente.model';
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/clientes';
  listar() {
    return this.http.get<Cliente[]>(this.url);
  }
}
