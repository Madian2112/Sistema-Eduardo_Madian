export interface PedidosProduccionDetalleViewModel {
    ppde_Id: number;
    ppro_Id: number;
    lote_Id: number;
    lote_Stock: string;
    lote_CodigoLote: string;
    ppde_Cantidad: number;
    mate_Id: number;
    mate_Descripcion: string;
    colr_Codigo: string;
    colr_Nombre: string;
    tipa_Id:number;
    tipa_area: string;
    ppro_Estados: string;
    usua_UsuarioCreacion: number;
    usuarioCreacionNombre: string;
    ppde_FechaCreacion: Date;
    usua_UsuarioModificacion: number;
    usuarioModificacionNombre: string;
    ppde_FechaModificacion: Date;
    ppde_Estado: boolean;
  }
  