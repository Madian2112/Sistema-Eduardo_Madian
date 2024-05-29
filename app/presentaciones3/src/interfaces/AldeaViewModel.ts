export class AldeaTabla {
    alde_Id: number;
    alde_Nombre: string;
    ciud_Nombre: string;
    pvin_Codigo: string;
    pvin_Nombre: string;
  }

export class Aldea{  
  alde_Id: string
  alde_Nombre: string
  ciud_Id: string
  ciud_Nombre: string
  pvin_Id: string
  pvin_Codigo: string
  pvin_Nombre: string
  usua_UsuarioCreacion: number
  usuarioCreacionNombre: string
  alde_FechaCreacion: string
  usua_UsuarioModificacion: number | null
  usuarioModificacionNombre: string | null
  alde_FechaModificacion: string | null
  usua_UsuarioEliminacion: number | null
  alde_FechaEliminacion: string | null
  alde_Estado: boolean
}