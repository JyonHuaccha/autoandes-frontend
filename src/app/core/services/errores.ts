import { HttpErrorResponse } from '@angular/common/http';
export function mensajeError(e:unknown):string {return e instanceof HttpErrorResponse ? (e.status===0?'No se puede conectar con AutoAndes API.':e.error?.mensaje??'No se pudo completar la operación.'):'No se pudo completar la operación.';}
export function camposError(e:unknown):Record<string,string>{return e instanceof HttpErrorResponse?e.error?.campos??{}:{};}
