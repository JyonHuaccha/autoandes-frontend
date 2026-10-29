import { inject } from '@angular/core';import { CanActivateFn,Router } from '@angular/router';import { AuthService } from '../auth/auth.service';import { Permiso } from '../auth/auth.model';
export const permisoGuard:CanActivateFn=(route)=>{const p=route.data['permiso'] as Permiso|undefined;return !p||inject(AuthService).tienePermiso(p)?true:inject(Router).createUrlTree(['/acceso-denegado']);};
