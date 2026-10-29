import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { SiPermiso } from '../../shared/directives/si-permiso';
@Component({
  imports: [RouterLink, SiPermiso],
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  readonly auth = inject(AuthService);
}
