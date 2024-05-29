import axios from 'axios';


const API_URL = "https://localhost:44380/";



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
    console.log("La data es");
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