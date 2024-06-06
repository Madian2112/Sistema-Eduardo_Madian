import axios from 'axios';
import {Aldea} from '../../../../interfaces/AldeaViewModel';

const API_URL = "https://localhost:44380/";


//#region FORMAS DE ENVIO
export const getFormasEnvio = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/FormasEnvio/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//Formas Envio

export const sendFormasEnvio = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/FormasEnvio/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};


export const sendEditFormasEnvio = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/FormasEnvio/Editar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendDeleteFormasEnvio = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/FormasEnvio/Eliminar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};
//#endregion


//#region  ECOTASAAA
export const getEcoTasa = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Ecotasa/Listar',

      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("La data es");
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const sendEcoTasaEnvio = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/Ecotasa/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {

    console.error("Error sending formas envio:", error);
    throw error;
  }
};


export const sendEcoTasaEdit = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/Ecotasa/Editar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendDeleteEcoTasa = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/Ecotasa/Eliminar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};
//#endregion

//#region  MASTER DE CIUDADES
export const getAldeas = async () => {
  
  try {
 const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.')
      return
    }

    const response = await axios.get(
      API_URL + 'api/Aldea/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    )


    const data = await response.data
    return data.data.map((aldea: Aldea) => {
      return {
        alde_Id: aldea.alde_Id,
        alde_Nombre: aldea.alde_Nombre,
        ciud_Id: aldea.ciud_Id,
        ciud_Nombre: aldea.ciud_Nombre,
        pvin_Id: aldea.pvin_Id,
        pvin_Nombre: aldea.pvin_Nombre,
        // status: 'in progress',
        // label: 'documentation',
        // priority: 'medium',
      }
    })
  } catch (error) {
    return []
  }
}

export const getCiudades = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      `${API_URL}api/Ciudades/Listar?ciud_EsAduana=true`,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("La data es");
    console.log(response.data.data);
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//#endregion

//#region Paises
export const getPaises = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Paises/Listar?pais_EsAduana=true',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
export const getPaisesFalse = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Paises/Listar?pais_EsAduana=false',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//#endregion

//#region PROVINCIAS


export const getProvincias = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'aapi/Provincias/Listar?pvin_EsAduana=true',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};



export const getProvinciasPorPaises = async (idpais) => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Provincias/ProvinciasFiltradaPorPais?pais_Id='+idpais,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//#endregion

//#region CIUDADESSSS
export const getCiudadesPorProvincias = async (idprovincia) => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Ciudades/CiudadesFiltradaPorProvincias?pvin_Id='+idprovincia,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//#endregion

          
//region ALDEASSSS
 export const getAldea = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Aldea/Listar',

      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("La data es: " + response.data.data);

    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const sendAldea = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/Aldea/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {

    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendEditAldea = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/Aldea/Editar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {

    console.error("Error sending formas envio:", error);
    throw error;
  }
};    
//#endregion

//#region  EMPLEADOSSS
export const getEmpleados = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Empleados/Listar?empl_EsAduana=true',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//#endregion

//#region Pedidos Produccion

export const getPedidosOrden = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/PedidosProduccion/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const getPedidosProduccion = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/PedidosProduccion/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const sendPedidosProduccionFinalizar = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosProduccion/FinalizarPedidoProduccion',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendPedidosProduccion = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosProduccion/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendPedidosProduccionUpdate = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosProduccion/Editar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};


export const deletePedidosProduccion = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosProduccion/Eliminar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

//#endregion

//#region Pedidos Produccion Detalle 

export const getPedidosProduccionDetalle = async (ppr_Id) => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/PedidosProduccionDetalles/Filtrar?ppro_Id='+ppr_Id,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const sendPedidosProduccionDetalle = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosProduccionDetalles/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendPedidosProduccionDetalleEliminar = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosProduccionDetalles/Eliminar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};


export const editPedidosProduccionDetalle = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosProduccionDetalles/Editar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

//#endregion

//#region LOTEEE
export const getLotes = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Lotes/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const getLotesStock = async (lote_CodigoLote) => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    console.log("EL codigo es: " + lote_CodigoLote)
    const response = await axios.get(
      API_URL + 'api/Lotes/LotesMateriales?lote_CodigoLote='+lote_CodigoLote,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
    console.log("La data del servicio es: " + data)
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

//#endregion
//#region  Material
export const getMaterial = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Materiales/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};


export const getMaterialItems = async (id) => {
  console.log("EL VALOR ES" + id)
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI AL MATERIAL XD");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.post(
      API_URL + 'api/Items/ItemsOrdenPedido?id=' + id, // Enviar el id como query parameter
      {},
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//#endregion
//#region  Pedidos Orden
//Lista

export const getPedidosOrdenDetalles = async (valor) => {
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      
      `${API_URL}api/PedidosOrdenDetalles/Listar?pedi_Id=${valor}`,
      {
        headers: {
          'XApiKey': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const sendPedidosOrden = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosOrden/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendPedidosOrdenSubItems = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PODetallePorPedidoOrdenDetalle/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendPedidosOrdenDetalles = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosOrdenDetalles/Insertar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};


export const sendItemPedidosOrdenDetalles = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosOrdenDetalles/InsertarItems',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendPedidosOrdenEdit = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosOrden/Editar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

//#endregion
//#region Proveedores
export const getProveedores = async () => {
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/Proveedores/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const sendDeletePedidosOrden = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosOrden/FinalizarPedidoOrden',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

export const sendDeleteItemPedidosOrden = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PedidosOrdenDetalles/Eliminar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};


export const sendDeleteSubItemPedidosOrden = async (productData) => {
  try {
    const response = await axios.post(
      API_URL + 'api/PODetallePorPedidoOrdenDetalle/Eliminar',
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending formas envio:", error);
    throw error;
  }
};

//#endregion
//#region CompraDetalle
export const getCompraDetalle = async () => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/OrdenCompra/Listar',
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};

export const getCompraDetalleFiltrado = async (valor) => {
  console.log("Full URL:", API_URL);
  console.log("ENTRO AQUI");
  try {
    const apiKey = "4b567cb1c6b24b51ab55248f8e66e5cc";

    if (!apiKey) {
      console.error('API key is undefined.');
      return [];
    }
    
    const response = await axios.get(
      API_URL + 'api/OrdenCompraDetalles/DibujarDetalles?orco_Codigo=' + valor,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data.data);
    const data = await response.data.data ;
 
    return data;
  } catch (error) {
    console.error("Error fetching formas envio:", error);
    return [];
  }
};
//#endregion