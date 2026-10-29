# AutoAndes Web

SPA Angular 22 con componentes standalone. Consume AutoAndes API y mantiene la organización de Pharma: `core`, `shared`, `layout` y `features`; cada recurso tiene `models`, `services` y `pages`.

## Ejecutar

Requiere Node compatible con Angular 22 y el backend iniciado en `http://localhost:8080`.

```powershell
npm ci
npm start
```

`npm start` ejecuta `ng serve`; también puede usar `npx ng serve`. Abra `http://localhost:4200`. La URL del backend está en `src/environments/environment.ts` y `environment.development.ts`.

## Usuarios de prueba

| Usuario | Contraseña de prueba | Rol | Estado |
| --- | --- | --- | --- |
| admin | Auto2026* | ADMIN | Activo |
| asesor | Auto2026* | ASESOR | Activo |
| jefe | Auto2026* | JEFE_TALLER | Activo |
| inactivo | Auto2026* | ASESOR | Inactivo |

## Funcionalidades

- Servicios: búsqueda, ordenamiento, paginación, alta/edición con un único formulario, confirmación de eliminación y cambio de estado.
- Vehículos: cliente y nombre en la lista, filtro por cliente y formulario con clientes obtenidos del backend.
- Órdenes: vehículo/cliente, kilometraje, de 1 a 10 líneas dinámicas, servicios distintos, cantidad de 1 a 5 y total estimado inmediato. El servidor determina los importes guardados.
- Consulta con placa, estado y fechas enviados a la API; detalle de cabecera y líneas; anulación con motivo.
- Reporte de ingresos por servicio y vista de impresión.
- Mensajes de validación del servidor bajo cada campo; mensajes 404/409 en la página; carga, vacío y error; confirmaciones de éxito durante tres segundos.

## Seguridad

`core/auth/AuthService` usa signals y `sessionStorage` con la clave `autoandes.sesion`, guarda el vencimiento y cierra la sesión al expirar. El interceptor de autenticación añade Bearer solo a la API y omite el login. El de errores devuelve al login con `returnUrl` ante 401 protegido y conserva la sesión ante 403.

`authGuard` protege el layout; `invitadoGuard`, el login; `permisoGuard` valida el permiso declarado en la ruta. `appSiPermiso` controla botones y enlaces; el menú reacciona a los permisos de la sesión. El backend vuelve a comprobar todos los permisos.

Rutas: `/login`, `/inicio`, `/servicios`, `/servicios/nuevo`, `/servicios/:id/editar`, `/vehiculos`, `/vehiculos/nuevo`, `/vehiculos/:id/editar`, `/ordenes`, `/ordenes/nueva`, `/ordenes/:id`, `/reportes`, `/acceso-denegado` y página 404.

## Contrato consumido

| Método | Ruta bajo `/api/v1` | Permiso |
| --- | --- | --- |
| POST | `/auth/login` | Público |
| GET | `/auth/me` | Autenticado |
| GET | `/clientes` | VEHICULO_LEER |
| GET | `/servicios`, `/servicios/{id}` | SERVICIO_LEER |
| POST / PUT / DELETE | `/servicios`, `/servicios/{id}` | SERVICIO_ESCRIBIR |
| PATCH | `/servicios/{id}/estado` | SERVICIO_ESCRIBIR |
| GET | `/vehiculos?clienteId`, `/vehiculos/{id}` | VEHICULO_LEER |
| POST / PUT / DELETE | `/vehiculos`, `/vehiculos/{id}` | VEHICULO_ESCRIBIR |
| POST | `/ordenes` | ORDEN_REGISTRAR |
| GET | `/ordenes?placa&estado&desde&hasta`, `/ordenes/{id}` | ORDEN_LEER |
| PATCH | `/ordenes/{id}/anular` | ORDEN_ANULAR |
| GET | `/reportes/ingresos-por-servicio?desde&hasta` | REPORTE_VER |

## Verificación

```powershell
npm run build
npm test -- --watch=false
```

Las pruebas verifican sesión, vencimiento, redirecciones internas, interceptores y el detalle dinámico. No escriben datos en Oracle. Los recursos del catálogo y los clientes siempre provienen del backend; no existen listas simuladas de negocio.

## Versionado

Ramas `main`, `develop` y `examen-a-huaccha`; commits de P4 y P5 y etiqueta `v1.0-examen-u2`.
