import { Component, inject } from '@angular/core';
import { Avisos } from '../../../core/services/avisos';
@Component({
  selector: 'app-aviso',
  styleUrl: './aviso.css',
  templateUrl: './aviso.html',
})
export class Aviso {
  readonly avisos = inject(Avisos);
}
