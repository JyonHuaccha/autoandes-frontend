import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth-service';
import { Avisos } from '../../../../core/services/avisos';
import { mensajeError } from '../../../../core/utils/http-error';
import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClienteService } from '../../../clientes/services/cliente-service';
import { Vehiculo } from '../../models/vehiculo.model';
import { VehiculoService } from '../../services/vehiculo-service';
@Component({
  imports: [RouterLink, FormsModule, SiPermiso],
  styleUrl: './vehiculo-list.css',
  templateUrl: './vehiculo-list.html',
})
export class VehiculoList implements OnInit {
  readonly auth = inject(AuthService);
  private readonly service = inject(VehiculoService);
  private readonly clientesService = inject(ClienteService);
  private readonly avisos = inject(Avisos);
  readonly items = signal<Vehiculo[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly clienteId = signal('');
  readonly busqueda = signal('');
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly pagina = signal(0);
  readonly tamanio = 10;
  readonly orden = signal('placa');
  readonly asc = signal(true);
  readonly filtrados = computed(() => {
    const q = this.busqueda().toLocaleLowerCase();
    const key = this.orden() as keyof Vehiculo;
    const sign = this.asc() ? 1 : -1;
    return this.items()
      .filter((x) => Object.values(x).join(' ').toLocaleLowerCase().includes(q))
      .sort((a, b) =>
        typeof a[key] === 'number'
          ? sign * (Number(a[key]) - Number(b[key]))
          : sign * String(a[key]).localeCompare(String(b[key]), 'es'),
      );
  });
  readonly visibles = computed(() =>
    this.filtrados().slice(this.pagina() * this.tamanio, (this.pagina() + 1) * this.tamanio),
  );
  readonly paginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / this.tamanio)));
  ngOnInit() {
    this.cargar();
    this.clientesService.listar().subscribe({
      next: (r) => this.clientes.set(r),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.service.listar(this.clienteId() ? Number(this.clienteId()) : undefined).subscribe({
      next: (r) => {
        this.items.set(r);
        this.pagina.set(Math.min(this.pagina(), this.paginas() - 1));
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  buscar(value: string) {
    this.busqueda.set(value);
    this.pagina.set(0);
  }
  ordenar(key: string) {
    if (this.orden() === key) this.asc.update((x) => !x);
    else {
      this.orden.set(key);
      this.asc.set(true);
    }
    this.pagina.set(0);
  }
  eliminar(item: Vehiculo) {
    if (
      !confirm('¿Eliminar este vehiculo? La API rechazará la operación si tiene órdenes asociadas.')
    )
      return;
    this.service.eliminar(item.id).subscribe({
      next: () => {
        this.avisos.mostrar('Vehiculo eliminado');
        this.cargar();
      },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
