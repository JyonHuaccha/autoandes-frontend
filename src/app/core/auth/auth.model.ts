export const PERMISOS=['SERVICIO_LEER','SERVICIO_ESCRIBIR','VEHICULO_LEER','VEHICULO_ESCRIBIR','ORDEN_LEER','ORDEN_REGISTRAR','ORDEN_ANULAR','REPORTE_VER'] as const;
export type Permiso=typeof PERMISOS[number];
export interface LoginRequest {username:string;password:string;}
export interface Perfil {username:string;nombreCompleto:string;roles:string[];permisos:Permiso[];}
export interface LoginResponse extends Perfil {token:string;tipo:string;expiraEnSegundos:number;}
export interface Sesion extends Perfil {token:string;expiraEn:number;}
