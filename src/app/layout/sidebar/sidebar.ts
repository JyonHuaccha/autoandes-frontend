import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { MENU } from '../../core/config/menu';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly auth = inject(AuthService);
  readonly items = computed(() =>
    MENU.filter((x) => !x.permiso || this.auth.tienePermiso(x.permiso)),
  );
}
