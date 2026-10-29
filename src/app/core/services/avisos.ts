import { Injectable,signal } from '@angular/core';
@Injectable({providedIn:'root'}) export class Avisos { readonly mensaje=signal('');private timer?:ReturnType<typeof setTimeout>;mostrar(mensaje:string){clearTimeout(this.timer);this.mensaje.set(mensaje);this.timer=setTimeout(()=>this.mensaje.set(''),3000);}}
