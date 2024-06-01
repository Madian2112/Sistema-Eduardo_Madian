export interface PedidosProduccionViewModel {
    ppro_Id: number;
    empl_Id: number;
    empl_NombreCompleto: string;
    ppro_Fecha: string;
    ppro_Estados: string;
    ppro_Observaciones: string;
    ppro_Finalizado: boolean;
    usua_UsuarioCreacion:number;
    lote_Id: number;
    ppde_Cantidad: number;
    UsuarioCreacionNombre: string;
    ppro_FechaCreacion: string;
    usua_UsuarioModificacion:number;
    UsuarioModificacionNombre: string;
    ppro_FechaModificacion: string;
    ppro_Estado: boolean;
    detalles: "";
    mensaje: string;
  }
  