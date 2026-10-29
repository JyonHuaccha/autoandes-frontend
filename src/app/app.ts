import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Aviso } from './shared/components/aviso/aviso';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Aviso],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
