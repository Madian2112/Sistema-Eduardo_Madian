export interface OrdenPedidosEnvioViewModel {
  peor_Id: number;
  peor_Codigo: string;
  prov_Id: number;
  duca_No_Duca: string;
  ciud_Id: number;
  peor_DireccionExacta: string;
  peor_FechaEntrada: string;
  peor_Impuestos: number;
  usua_UsuarioCreacion:number;
  peor_Obsevaciones: string,
  peor_FechaCreacion: string;
  usua_UsuarioModificacion:number;
  peor_FechaModificacion: string;
}


export interface OrdenPedidosFinishViewModel {
  peor_Id: number;
}

export interface OrdenPedidosDeleteItemViewModel {
  prod_Id: number;
  item_Id:number;
}

export interface OrdenPedidosDetailsSendViewModel {
  orco_Id: number;
  code_Id:number;
  prod_Id: number;
  usua_UsuarioCreacion: number;
  ocpo_FechaCreacion: string;
}

export interface OrdenPedidosEnvioDetailsViewModel {
  pedi_Id: number;
  item_Id: number;
  mate_Id: Number;
  mate_Descripcion: string;
  prod_Cantidad: number;
  prod_Precio: string;
  usua_UsuarioCreacion: number;
  prod_FechaCreacion: string;
}



export interface MaterialesViewModel {
  item_Id: number;
  mate_Id: Number;
  mate_Descripcion: string;
  prod_Cantidad: number;
  prod_Precio: string;
  mate_Imagan: Number;
}