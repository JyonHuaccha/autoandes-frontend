import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../auth/auth-service';
import { authInterceptor } from './auth-interceptor-interceptor';
import { errorInterceptor } from './error-interceptor-interceptor';
import { environment } from '../../../environments/environment';
describe('Interceptores de seguridad', () => {
  let http: HttpTestingController, client: HttpClient;
  const auth = { token: vi.fn(() => 'jwt'), cerrarSesion: vi.fn() };
  beforeEach(() => {
    auth.cerrarSesion.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: { url: '/ordenes' } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
  });
  afterEach(() => http.verify());
  it('añade Bearer únicamente a la API', () => {
    const u = environment.apiUrl + '/servicios';
    client.get(u).subscribe();
    const r = http.expectOne(u);
    expect(r.request.headers.get('Authorization')).toBe('Bearer jwt');
    r.flush([]);
  });
  for (const u of [
    'https://otro.example/datos',
    environment.apiUrl + '-otro/servicios',
    environment.apiUrl + '/auth/login',
  ])
    it('no expone token en ' + u, () => {
      client.get(u).subscribe();
      const r = http.expectOne(u);
      expect(r.request.headers.has('Authorization')).toBe(false);
      r.flush({});
    });
  it('un 401 protegido cierra la sesión con returnUrl', () => {
    const u = environment.apiUrl + '/ordenes';
    client.get(u).subscribe({ error: () => {} });
    http
      .expectOne(u)
      .flush({ mensaje: 'Token inválido' }, { status: 401, statusText: 'Unauthorized' });
    expect(auth.cerrarSesion).toHaveBeenCalledWith(true, '/ordenes');
  });
  it('un 401 de login no cierra otra vez la sesión', () => {
    const u = environment.apiUrl + '/auth/login';
    client.post(u, {}).subscribe({ error: () => {} });
    http.expectOne(u).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.cerrarSesion).not.toHaveBeenCalled();
  });
  it('un 403 conserva la sesión', () => {
    const u = environment.apiUrl + '/reportes';
    client.get(u).subscribe({ error: () => {} });
    http.expectOne(u).flush({}, { status: 403, statusText: 'Forbidden' });
    expect(auth.cerrarSesion).not.toHaveBeenCalled();
  });
});
