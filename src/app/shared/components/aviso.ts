import { Component,inject } from '@angular/core';import { Avisos } from '../../core/services/avisos';
@Component({selector:'app-aviso',template:`@if(avisos.mensaje()){<div class="toast" role="status">{{avisos.mensaje()}}</div>}`})export class Aviso {readonly avisos=inject(Avisos);}
