import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, rutaInterna } from '../../../../core/auth/auth-service';
import { camposError, mensajeError } from '../../../../core/utils/http-error';
import { noSoloEspacios } from '../../../../core/utils/validadores';
import { ErrorCampo } from '../../../../shared/components/errores-campo/errores-campo';
@Component({
  imports: [ReactiveFormsModule, ErrorCampo],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly verClave = signal(false);
  readonly campos = signal<Record<string, string>>({});
  readonly form = this.fb.group({
    username: ['', [Validators.required, noSoloEspacios, Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.maxLength(72)]],
  });
  ingresar() {
    if (this.enviando()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () =>
        void this.router.navigateByUrl(
          rutaInterna(this.route.snapshot.queryParamMap.get('returnUrl')),
        ),
      error: (e) => {
        this.enviando.set(false);
        this.error.set(mensajeError(e));
        this.campos.set(camposError(e));
        this.form.controls.password.reset();
      },
    });
  }
}
