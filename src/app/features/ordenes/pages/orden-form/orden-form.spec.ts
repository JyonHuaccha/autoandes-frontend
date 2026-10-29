import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { OrdenForm } from './orden-form';
import { environment } from '../../../../../environments/environment';
describe('Registro de orden', () => {
  let component: OrdenForm;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrdenForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(OrdenForm);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(environment.apiUrl + '/servicios').flush([
      {
        id: 1,
        codigo: 'SRV-001',
        nombre: 'Aceite',
        precio: 120,
        duracionMin: 30,
        activo: true,
      },
      {
        id: 2,
        codigo: 'SRV-002',
        nombre: 'Alineamiento',
        precio: 80,
        duracionMin: 30,
        activo: true,
      },
      {
        id: 8,
        codigo: 'SRV-008',
        nombre: 'Suspendido',
        precio: 50,
        duracionMin: 30,
        activo: false,
      },
    ]);
    http
      .expectOne(environment.apiUrl + '/vehiculos')
      .flush([{ id: 1, placa: 'AAA-111', clienteNombre: 'Cliente' }]);
  });
  afterEach(() => http.verify());
  it('calcula un total visual y excluye servicios inactivos', () => {
    component.detalles.at(0).setValue({ servicioId: 1, cantidad: 2 });
    expect(component.total()).toBe(240);
    expect(component.servicios().some((x) => x.id === 8)).toBe(false);
  });
  it('rechaza servicios repetidos', () => {
    component.agregar();
    component.detalles.at(0).setValue({ servicioId: 1, cantidad: 1 });
    component.detalles.at(1).setValue({ servicioId: 1, cantidad: 2 });
    expect(component.detalles.hasError('repetido')).toBe(true);
  });
  it('no permite quitar la última línea ni superar diez', () => {
    component.quitar(0);
    expect(component.detalles.length).toBe(1);
    for (let i = 0; i < 12; i++) component.agregar();
    expect(component.detalles.length).toBe(10);
  });
  it('envía solo IDs y cantidades y preserva líneas ante 409', () => {
    component.form.controls.vehiculoId.setValue(1);
    component.form.controls.kilometraje.setValue(44000);
    component.detalles.at(0).setValue({ servicioId: 1, cantidad: 2 });
    component.guardar();
    const r = http.expectOne(environment.apiUrl + '/ordenes');
    expect(r.request.body).toEqual({
      vehiculoId: 1,
      kilometraje: 44000,
      detalles: [{ servicioId: 1, cantidad: 2 }],
    });
    r.flush({ mensaje: 'Último kilometraje 45000' }, { status: 409, statusText: 'Conflict' });
    expect(component.guardando()).toBe(false);
    expect(component.detalles.at(0).value.cantidad).toBe(2);
    expect(component.error()).toContain('45000');
  });
});
