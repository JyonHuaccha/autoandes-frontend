import { Injectable,inject } from '@angular/core'; import { HttpClient,HttpParams } from '@angular/common/http'; import { environment } from '../../../environments/environment'; import { Cliente,Servicio,ServicioRequest,Vehiculo,VehiculoRequest,Orden,OrdenRequest,Ingreso } from '../models/autoandes.model';
@Injectable({providedIn:'root'}) export class VehiculoService {private readonly http=inject(HttpClient);private readonly url=environment.apiUrl+'/vehiculos'; listar(clienteId?:number){return this.http.get<Vehiculo[]>(this.url,{params:clienteId?{clienteId}:{}});}obtener(id:number){return this.http.get<Vehiculo>(`${this.url}/${id}`);}
crear(dto:VehiculoRequest){return this.http.post<Vehiculo>(this.url,dto);}
actualizar(id:number,dto:VehiculoRequest){return this.http.put<Vehiculo>(`${this.url}/${id}`,dto);}
eliminar(id:number){return this.http.delete<void>(`${this.url}/${id}`);} }
