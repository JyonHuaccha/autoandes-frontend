import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthService, CLAVE_SESION, rutaInterna } from './auth-service';
import { environment } from '../../../environments/environment';
describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
  });
  afterEach(() => {
    http?.verify();
    TestBed.resetTestingModule();
    vi.useRealTimers();
    sessionStorage.clear();
  });
  function iniciar() {
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  }
  function login() {
    service.login({ username: 'asesor', password: 'Auto2026*' }).subscribe();
    http.expectOne(environment.apiUrl + '/auth/login').flush({
      token: 'jwt-prueba',
      tipo: 'Bearer',
      expiraEnSegundos: 3600,
      username: 'asesor',
      nombreCompleto: 'Asesor',
      roles: ['ASESOR'],
      permisos: ['ORDEN_REGISTRAR', 'ORDEN_LEER'],
    });
  }
  it('guarda vencimiento sesión y permisos al autenticar', () => {
    iniciar();
    login();
    expect(service.token()).toBe('jwt-prueba');
    expect(service.sesion()?.expiraEn).toBe(Date.now() + 3600000);
    expect(JSON.parse(sessionStorage.getItem(CLAVE_SESION)!).username).toBe('asesor');
    expect(service.tienePermiso('ORDEN_REGISTRAR')).toBe(true);
    expect(service.tienePermiso('ORDEN_ANULAR')).toBe(false);
  });
  it('restaura una sesión vigente tras recargar', () => {
    sessionStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({
        token: 'jwt',
        expiraEn: Date.now() + 10000,
        username: 'asesor',
        nombreCompleto: 'Asesor',
        roles: ['ASESOR'],
        permisos: ['ORDEN_LEER'],
      }),
    );
    iniciar();
    expect(service.token()).toBe('jwt');
  });
  it('descarta JSON dañado', () => {
    sessionStorage.setItem(CLAVE_SESION, '{mal');
    iniciar();
    expect(service.token()).toBeNull();
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
  });
  it('descarta sesiones sin vencimiento válido', () => {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ token: 'jwt', roles: [], permisos: [] }));
    iniciar();
    expect(service.token()).toBeNull();
  });
  it('cierra automáticamente al vencer', () => {
    iniciar();
    login();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    vi.advanceTimersByTime(3600000);
    expect(service.token()).toBeNull();
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
    expect(navigate).toHaveBeenCalledWith(
      ['/login'],
      expect.objectContaining({
        queryParams: expect.objectContaining({ expirada: '1' }),
      }),
    );
  });
  it('logout elimina el token', () => {
    iniciar();
    login();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    service.cerrarSesion();
    expect(service.sesion()).toBeNull();
  });
  for (const url of ['https://otro.example', '//otro.example', '/\\otro.example', '/login'])
    it('evita una redirección fuera de la aplicación: ' + url, () => {
      expect(rutaInterna(url)).toBe('/inicio');
    });
  it('conserva una ruta interna de retorno', () =>
    expect(rutaInterna('/ordenes?placa=AAA-111')).toBe('/ordenes?placa=AAA-111'));
});
