import {
  mdiAppleKeyboardControl,
  mdiBorderColor,
  mdiChartTimelineVariant,
  mdiDelete,
  mdiDetails,
  mdiPlus,
} from '@mdi/js'

import { DataScroller } from 'primereact/datascroller';
import { Formik, Form, Field, } from 'formik';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Head from 'next/head'
import React, { useState, useRef, useEffect } from 'react'
import { Panel } from 'primereact/panel';
import type { ReactElement } from 'react'
import Button from '../components/Button'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import { getPageTitle } from '../config'
import { Toast } from 'primereact/toast';
import { mdiEye} from '@mdi/js'
import CardBoxModal from '../components/CardBox/Modal'
import * as Yup from 'yup';
import { ProductViewModel } from '../interfaces/telefonoViewModel'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getCiudadesPorProvincias, getCompraDetalle, getCompraDetalleFiltrado, getFormasEnvio, getMaterial, getMaterialItems, getPaises, getPedidosOrden, getPedidosOrdenDetalles, getProveedores, getProvinciasPorPaises, sendDeleteFormasEnvio, sendDeleteItemPedidosOrden, sendDeletePedidosOrden, sendEditFormasEnvio, sendFormasEnvio, sendItemPedidosOrdenDetalles, sendPedidosOrden, sendPedidosOrdenDetalles, sendPedidosOrdenEdit, sendPedidosOrdenSubItems } from './apiService/data/components/ApiService';
import { FormasEnvioViewModel } from '../interfaces/FormasEnvioViewModel';
import { Menu } from 'primereact/menu';
import { TabMenu } from 'primereact/tabmenu';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Console } from 'console';
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';
import { Checkbox } from 'primereact/checkbox';
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from 'primereact/calendar';
import { OrdenPedidosDeleteItemViewModel, OrdenPedidosDetailsSendViewModel, OrdenPedidosEnvioDetailsViewModel, OrdenPedidosEnvioViewModel, OrdenPedidosFinishViewModel } from '../interfaces/PedidoOrdenViewModel';
import { parse } from 'path';
import { ListBox } from 'primereact/listbox';
import { Row } from 'primereact/row';



const PedidosOrdenPage = () => {
//Toast
const toast = useRef<Toast>(null);
//Collapse
const [isExpanded, setIsExpanded] = useState(true);
const [isExpandedCreate, setIsExpandedCreate] = useState(false);
const [pais_id, setpais_id] = useState("");
const [pvin_Id, setpvin_Id] = useState("");

const handleModalCreate = () => {
  EditOrCreate("Create")
  setEnviado(0);
  setIsExpanded(!isExpanded);
  Setpeor_Codigo("")
  Setduca_No_Duca("")
  Setpeor_Impuestos(0)
  Setciud_Id("")
  setpais_id("")

setSelectProveedor("0")
setSelectedProvincia("0")
  setSelectDefaultProveedor("0")
  setSelectedPais("0")
  setSelectDefaultPaisId("0")
  setDefaulProvinciaId("0")
  setSelectedProvincia(null)
  Setpeor_DireccionExacta("")
  Setpeor_FechaEntrada("")
  Setpeor_Obsevaciones("")
  setIsExpandedCreate(!isExpandedCreate);
}

const handleModalCreateLeave = () => {

  setIsExpanded(!isExpanded);

  setIsExpandedCreate(!isExpandedCreate);
}

const handleModalCreateLeaveModal = () => {
 setisModalAddDetails(false)
}

const handleModalEdit = (EcoEnvio) => {
  EditOrCreate("Edit")
  setIsExpanded(!isExpanded);
  setEnviado(1);


  setIsExpandedCreate(!isExpandedCreate);
}


//Opciones para el crear o editar
const [elect, EditOrCreate] = useState('');

//TabMenu
const [activeIndex, setActiveIndex] = useState(0);
const [Enviado, setEnviado] = useState(1);
const formikRef = useRef(null);
  const itemsTabMenu = [
    { label: 'Details General', icon: 'pi pi-home' },
    { label: 'Details Producto', icon: 'pi pi-chart-line' }
  ];

  const handleTabChange = async (index) => {
    if (Enviado === 0) {
      if (formikRef.current) {
        const formErrors = await formikRef.current.validateForm();
        if (Object.keys(formErrors).length === 0) {
         
          Send();
        } else {
          formikRef.current.setTouched(formErrors, false);
        }
      }
    } else {
      if (activeIndex == 1) {
        setActiveIndex(0);
      }else{
        setActiveIndex(1);
      }
    }
    console.log(activeIndex)
  };

  const tailwindStyles = {
    root: 'overflow-x-auto',
    menu: 'flex m-0 p-0 list-none flex-nowrap bg-white border-solid border-gray-300 border-b-2 outline-none no-underline text-base list-none justify-center',
    menuitem: 'mr-0 w-1/2 flex justify-center',  
    action: (isActive) =>
      classNames(
        'cursor-pointer select-none flex items-center justify-center relative no-underline overflow-hidden w-full',  // Estilo ajustado
        'border-b-2 p-5 font-bold rounded-t-lg',
        'focus:outline-none focus:outline-offset-0 focus:shadow-[inset_0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]',
        {
          'border-gray-300 bg-white text-gray-700 hover:bg-white hover:border-gray-400 hover:text-gray-600 dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 dark:hover:bg-gray-800/80': !isActive,
          'bg-white border-blue-500 text-blue-500 dark:bg-gray-900 dark:border-blue-300 dark:text-blue-300': isActive
        }
      ),
    icon: 'mr-2'
  };


//#region DataTable
const [GetPedidosOrden, setGetPedidosOrden] = useState([]);
const [loading, setLoading] = useState(false);
const GetOrdenPedidos = async () => {
  setLoading(true);
  try {
    const data = await getPedidosOrden();
    setGetPedidosOrden(data);
    setLoading(false);
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
    setLoading(false);
  }
};

useEffect(() => {
  GetOrdenPedidos();
}, []); 
const menuLeft = useRef(null);
const [Prueba, setPrueba] = useState([]);
const generateMenuItems = (rowData) => {
  console.log("peor_finalizacion value:", Prueba); // Agrega este log

  const baseItems = [
    {
      label: 'Details',
      icon: 'pi pi-upload',
      command: () => togglePanel(rowData)
    }
  ];

  if (!Prueba) {
    baseItems.push(
      {
        label: 'Edit',
        icon: 'pi pi-refresh',
        command: () => handleModalEdit(rowData)
      },
      {
        label: 'Finish',
        icon: 'pi pi-upload',
        command: () => setisModalFinishActive(true)
      }
    );
  }

  return baseItems;
};
//#endregion

//#region CREATE-FINISH-UPDATE
//Variables
const [peor_Id, Setpeor_Id] = useState(0);
const [peor_Codigo, Setpeor_Codigo] = useState('');
const [prov_Id, Setprov_Id] = useState('');
const [ciud_Id, Setciud_Id] = useState('');
const [duca_No_Duca, Setduca_No_Duca] = useState('');
const [peor_DireccionExacta, Setpeor_DireccionExacta] = useState('');
const [peor_FechaEntrada, Setpeor_FechaEntrada] = useState(null);
const [peor_Obsevaciones, Setpeor_Obsevaciones] = useState('');
const [peor_Impuestos, Setpeor_Impuestos] = useState(0);

//DropDowns
const [Proveedores, setProveedores] = useState([]);
const [defaultProveedorId, setSelectDefaultProveedor] = useState('0'); 
const [selectProveedor, setSelectProveedor] = useState(null);

useEffect(() => {
    const fetchProveedores = async () => {
        setLoadingDrop(true);
        try {
            const data = await getProveedores();
            setProveedores(data);
            const defaultProveedor = data.find(prov => prov.prov_Id === parseInt(defaultProveedorId));
            if (parseInt(defaultProveedorId) != 0 ) {
              Setprov_Id("1")
            }
            setSelectProveedor(defaultProveedor);
            setLoadingDrop(false);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch proveedores', life: 3000 });
            setLoadingDrop(false);
        }
    };

    fetchProveedores();
}, [defaultProveedorId]);


const [paises, setPaises] = useState([]);
const [defaultPaisId, setSelectDefaultPaisId] = useState('0'); 
const [selectedPais, setSelectedPais] = useState(null);

useEffect(() => {
const fetchPaises = async () => {
  setLoadingDrop(true);
  try {
    const data = await getPaises();
    setPaises(data);

    if (parseInt(defaultPaisId) != 0) {
      setpais_id("1")
    }

    setLoadingDrop(false);
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch paises', life: 3000 });
    setLoadingDrop(false);
  }
};
fetchPaises()
}, [defaultPaisId]);

const [ciudades, setCiudades] = useState([]);
const [defaultCiudadId, setdefaultCiudadId] = useState('0');
const [selectedCiudad, setSelectedCiudad] = useState(null);


const [provincias, setProvincias] = useState([]);
const [defaultProvinciaId, setDefaulProvinciaId] = useState('0');
const [selectedProvincia, setSelectedProvincia] = useState(null);


const fetchProvincias = async (valor) => {
  setLoadingDrop(true);
  try {
      if (valor) {
        setCiudades([]);
        console.log(valor)
        const data = await getProvinciasPorPaises(valor);
        setProvincias(data);
        const defaultProvin = data.find(prov => prov.pvin_Id === parseInt(defaultProvinciaId));
        if (parseInt(defaultProvinciaId) != 0 ) {
          setpvin_Id("1")
        }
        setSelectProveedor(defaultProvin);
      }
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch paises', life: 3000 });
    setLoadingDrop(false);
  }
};

useEffect(() => {
  fetchProvincias(defaultPaisId)
}, [defaultProvinciaId]);

const fetchCiudades = async (valor) => {
  if (valor) {
    const data = await getCiudadesPorProvincias(valor);
    setCiudades(data);
    const defaultCiudad = data.find(prov => prov.ciud_Id === parseInt(defaultCiudadId));
    if (parseInt(defaultCiudadId) != 0 ) {
      Setciud_Id("1")
    }
    setSelectedCiudad(defaultCiudad);
  }
  else {
    setCiudades([]);
    console.log("La provincia no tenia ciuadad");
  }
};

useEffect(() => {
  fetchCiudades(defaultProvinciaId)
}, [defaultCiudadId]);
const [loadingDrop, setLoadingDrop] = useState(false);












//Impuesto
const [checked, setChecked] = useState(false);

const ValorImpuesto = () => {
  if (checked) {
    Setpeor_Impuestos(1);
  } else {
    Setpeor_Impuestos(0);
  }
  console.log(peor_Impuestos);
};


//Validaciones
const validationSchema = Yup.object().shape({
  peor_Codigo: Yup.string().required('Code is requerid'),
  prov_Id: Yup.string().required('Supplier is requerid'),
  pvin_Id:Yup.string().required('Province is requerid'),
  pais_Id: Yup.string().required('Country is requerid'),
  ciud_Id: Yup.string().required('City is requerid'),
  peor_DireccionExacta: Yup.string().required('Exact address is requerid'),
  peor_FechaEntrada: Yup.date().required('Entry date is requerid'),
  peor_Obsevaciones: Yup.string().required('Observations is requerid'),
 });


//#endregion
//#region CREATE
const Send = async () => {
  const productData: OrdenPedidosEnvioViewModel = {
    peor_Id:peor_Id,
    peor_Codigo: peor_Codigo,
    prov_Id:parseFloat(prov_Id),
    duca_No_Duca: duca_No_Duca,
    ciud_Id:parseFloat(ciud_Id),
    peor_DireccionExacta: peor_DireccionExacta,
    peor_FechaEntrada: peor_FechaEntrada,
    peor_Impuestos: peor_Impuestos,
    peor_Obsevaciones: peor_Obsevaciones,
    usua_UsuarioCreacion: 1,
    peor_FechaCreacion:new Date().toISOString(),
    usua_UsuarioModificacion: 1,
    peor_FechaModificacion: new Date().toISOString(),
  };
  console.log(productData)
  if (elect == "Create") {
    try {
      const response = await sendPedidosOrden(productData);
      if (response.status === 200) {
        if (response.data.message == "Operación completada exitosamente.") {
          console.log(response)
          console.log('Success:', response.data);
          console.log("The code is:", response.data.data.messageStatus)
          Setpeor_Id(parseFloat(response.data.data.messageStatus))
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Added successfully`, life: 3000 });
          setActiveIndex(1);
          setEnviado(1);
        }else{
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Error`, life: 3000 });
        }
      
      } else {
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 });
    }
  }else if(elect == "Edit") {
    try {
      const response = await sendPedidosOrdenEdit(productData);
      if (response.status === 200) {
        if (response.data.message == "Operación completada exitosamente.") {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Added successfully`, life: 3000 });
          setActiveIndex(1);
         
        }else{
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Error`, life: 3000 });
        }
      
      } else {
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 });
    }
  }
 
}
//#endregion
const [IMG, setIMG] = useState("");


//#region DETAILS
const [Material, setMateriales] = useState([]);
const [MaterialDesc, setMaterialDesc] = useState(null);
const [mate_Descripcion, setmate_Descripcion] = useState("");
const [MaterialDescCodigo, setMaterialDescCodigo] = useState(null);
const [filteredCountries, setFilteredCountries] = useState(null);
const [selectedCountry, setSelectedCountry] = useState(null);
const [filteredCountriesCodigo, setfilteredCountriesCodigo] = useState(null);
const fetchMaterial = async () => {
  try {
    const data = await getMaterial();
    const mappedData = data.map(item => ({
      item_Id: item.mate_Id,
      mate_Id: item.mate_Id,
      mate_Descripcion: item.mate_Descripcion,
      prod_Cantidad: item.prod_Cantidad,
      prod_Precio: item.prod_Precio,
      mate_Imagen: item.mate_Imagen
    }));
    setMateriales(mappedData);
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch materials', life: 3000 });

  }
};

const fetchMaterialDuca = async (Valor) => {
  try {
    const data = await getMaterialItems(Valor);
    const mappedData = data.map(item => ({
      item_Id: item.item_Id,
      mate_Id: item.item_Id,
      mate_Descripcion: item.item_IdentificacionComercialMercancias,
      prod_Cantidad: item.item_Cantidad,
      prod_Precio: item.item_ValorUnitario,
      mate_Imagen: item.mate_Imagen
    }));
    setMateriales(mappedData);
    return mappedData.length;

  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch materials', life: 3000 });
    return (0)

  }
};
const [ItemOMaterial, setItemOMaterial] = useState(0);
const [Active, setActive] = useState(false);
const handleInputChange = async (e) => {

  const count = await fetchMaterialDuca(e);

  if (count > 0) {
   
    setItemOMaterial(1)
    setActive(true)
  } else {
    setItemOMaterial(0)
    setActive(false)
    fetchMaterial();
  }
};
useEffect(() => {
  fetchMaterial()
}, []);

const itemTemplate = (data, setFieldValue) => {
  return (
    <div className="col-12">
      <div className="flex flex-column xl:flex-row xl:items-center p-4 gap-4">
        <img
          className="w-10 h-10 sm:w-14 sm:h-14 xl:w-16 xl:h-16 shadow-2 block xl:block mx-auto border-round"
          src={data.mate_Imagen}
          alt={data.mate_Descripcion}
        />
        <div className="flex flex-col lg:flex-row justify-between items-center xl:items-center lg:flex-1 gap-4">
          <div className="flex flex-col items-center lg:items-start gap-3">
            <div className="text-center lg:text-left text-base font-semibold text-600">
              {data.mate_Descripcion}
            </div>
          </div>
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-2 lg:ml-auto">
            <span
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
              onClick={() => {
                setFieldValue('mate_Descripcion', data.mate_Descripcion);
                setFieldValue('mate_Id', data.mate_Id)
                setFieldValue('item_Id', data.item_Id)
                if (ItemOMaterial == 1) {
                  setFieldValue('prod_Cantidad', data.prod_Cantidad)
                  setFieldValue('prod_Precio', data.prod_Precio)
                }

 }}
            >
              Add to Cart
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


const validationSchemaDetails = Yup.object().shape({
  mate_Descripcion: Yup.string().required('Material is requerid'),
  prod_Cantidad: Yup.number().required('Amount is requerid').typeError('Should be a number'),
  prod_Precio:Yup.number().required('Price is requerid').typeError('Should be a number'),
 });

 const SendDetails = async (values) => {
  const productData: OrdenPedidosEnvioDetailsViewModel = {
    pedi_Id:peor_Id,
    item_Id: values.item_Id,
    mate_Descripcion:values.mate_Descripcion,
    mate_Id: values.mate_Id,
    prod_Cantidad:values.prod_Cantidad,
    prod_Precio: values.prod_Precio,
    usua_UsuarioCreacion:1,
    prod_FechaCreacion: new Date().toISOString(),
  };
  console.log(productData)

    try {
      if (ItemOMaterial == 0) {
        
      
      const response = await sendPedidosOrdenDetalles(productData);
      if (response.status === 200) {
        if (response.data.message == "Operación completada exitosamente.") {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Added successfully`, life: 3000 });
          GetOrdenPedidosDetalles(peor_Id);
        }else{
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Error`, life: 3000 });
        }
      
      } else {
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    }else{
      const response = await sendItemPedidosOrdenDetalles(productData);
      if (response.status === 200) {
        if (response.data.message == "Operación completada exitosamente.") {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Added successfully`, life: 3000 });
          GetOrdenPedidosDetalles(peor_Id);
        }else{
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Error`, life: 3000 });
        }
      
      } else {
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    }

    } catch (error) {
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 });
    }
 
 
}


//Variables

//#endregion

//#region DATAMASTER-DETAIL
const [GetPedidosDetalles, setPedidosDetalles] = useState([]);
const [loadingDetalles, setloadingDetalles] = useState(false);
const GetOrdenPedidosDetalles = async (valor) => {
  setloadingDetalles(true);
  try {
    const data = await getPedidosOrdenDetalles(valor);
    const parsedData = data.map(item => ({
      ...item,
      detalles: JSON.parse(item.detalles)
    }));
    console.log("Datos parseados:", parsedData);
    setPedidosDetalles(parsedData);
    setloadingDetalles(false);
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
    setloadingDetalles(false);
  }
};
const renderDetalles = (rowData) => {
  console.log("EL DETALLES ES")
  console.log(rowData)
  return (
    <DataTable value={rowData.detalles} responsiveLayout="scroll">
      <Column field="clie_Nombre_O_Razon_Social" header="Client Name" sortable />
      <Column field="code_CantidadPrenda" header="Quantity" sortable />
      <Column field="code_SexoEvaluado" header="Sexo" sortable />
      <Column field="esti_DescripcionEvaludado" header="Descripcion" sortable />
      <Column field="orco_Id" header="Code" sortable />
    </DataTable>
  );
};

useEffect(() => {
  GetOrdenPedidosDetalles(peor_Codigo);
}, []); 
const menuLeftDetalles = useRef(null);
const ItemDetallesX = (ItemOMaterial) => {
  const items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Add',
          icon: 'pi pi-upload',
          command: () => setisModalAddDetails(true)
        }
      ]
    }
  ];

  if (ItemOMaterial == 0) {
    items[0].items.push(
      {
        label: 'Edit',
        icon: 'pi pi-refresh',
        command: () => console.log('Edit clicked')
      }
    );
  } else if (ItemOMaterial == 1) {
    items[0].items.push(
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: () => setisModalDeleteActive(true)
      }
    );
  }

  return items;
};



const itemsDetalles = ItemDetallesX(ItemOMaterial);
//#endregion
//Details Table
const [expandedRows, setExpandedRows] = useState(null);
const [isExpandedDetails, setIsExpandedDetails] = useState(false);
const [proveedor, setproveedor] = useState("");
const [ciudad, setciudad] = useState("");
const [provincia, setprovincia] = useState("");
const [pais, setpais] = useState("");
const [FechaCreacion, setFechaCreacion] = useState("");
const [FechaModificacion, setFechaFechaModificacion] = useState("");
const [UsuarioCreacion, setUsuarioCreacion] = useState("");
const [UsuarioModificacion, setUsuarioModificacion] = useState("");
const togglePanel = (EcoEnvio) => {
  setIsExpanded(!isExpanded);
  setIsExpandedDetails(!isExpandedDetails);
};

const togglePanelDetails = () => {
  setIsExpanded(!isExpanded);
  Setpeor_Codigo("")
  Setprov_Id("")
  Setciud_Id("")
  Setpeor_DireccionExacta("")
  Setpeor_FechaEntrada("")
  Setpeor_Obsevaciones("")
  setIsExpandedDetails(!isExpandedDetails);
};

//#region FINISH
const [isModalFinish, setisModalFinishActive] = useState(false);

const Delete = async () => {
  const productData: OrdenPedidosFinishViewModel = {
    peor_Id:peor_Id
  };
  console.log(productData)

    try {
      const response = await sendDeletePedidosOrden(productData);
      if (response.status === 200) {
        console.log('Success:', response.data);
        setisModalFinishActive(false);
        GetOrdenPedidos(); 
        toast.current?.show({ severity: 'success', summary: 'Success', detail: `Delete successfully`, life: 3000 });
      } else {
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 });
    }


};
//#endregion

//Delete Detalle Item
const [isModalDelete, setisModalDeleteActive] = useState(false);
const [item_Id, setitem_Id] = useState(0);
const [prod_Id, setprod_Id] = useState(0);
const DeleteItem = async () => {
  const productData: OrdenPedidosDeleteItemViewModel = {
    prod_Id:prod_Id,
    item_Id:item_Id
  };
  console.log(productData)

    try {
      const response = await sendDeleteItemPedidosOrden(productData);
      if (response.status === 200) {
        console.log('Success:', response.data);
        setisModalDeleteActive(false);
        GetOrdenPedidosDetalles(peor_Id)
        toast.current?.show({ severity: 'success', summary: 'Success', detail: `Delete successfully`, life: 3000 });
      } else {
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 });
    }


};   

//#region ADD DETAILS
const [isModalAddDetails, setisModalAddDetails] = useState(false);
const [CompraDetalle, setCompraDetalle] = useState([]);
const [CompraDetalleFiltrado, setCompraDetalleFiltrado] = useState([]);
const [SelectCompraDetalle, setSelectCompraDetalle] = useState(null);
const validationSchemaAdd = Yup.object().shape({
  code_Id: Yup.string().required('Requerid'),
  orco_Id: Yup.string().required('Requerid'),

 });

 //DROPDOWNS
 const AxioCompraDetalle = async () => {

  try {

        const data = await getCompraDetalle();
        setCompraDetalle(data);

  
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch paises', life: 3000 });

  }
};

useEffect(() => {
  AxioCompraDetalle()
}, []);


const AxioFiltradoCompra = async (valor) => {

  try {

        const data = await getCompraDetalleFiltrado(valor);
        setCompraDetalleFiltrado(data);

  
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch paises', life: 3000 });

  }
};
const [filteredCode, setfilteredCode] = useState(null);
const search = (event) => {
  // Timeout to emulate a network connection
  setTimeout(() => {
      let _filteredCountries;

      if (!event.query.trim().length) {
          _filteredCountries = [...CompraDetalle];
      }
      else {
          _filteredCountries = CompraDetalle.filter((country) => {
              return country.orco_Codigo.toLowerCase().startsWith(event.query.toLowerCase());
          });
      }

      setfilteredCode(_filteredCountries);
  }, 250);
}

const SendSubDetails = async (values) => {
  const productData: OrdenPedidosDetailsSendViewModel = {
    prod_Id:prod_Id,
    code_Id:values.code_Id,
    orco_Id:values.orco_Id,
    usua_UsuarioCreacion: 1,
    ocpo_FechaCreacion:new Date().toISOString(),
  };


    try {
      const response = await sendPedidosOrdenSubItems(productData);
      if (response.status === 200) {
        if (response.data.message == "Operación completada exitosamente.") {
          setisModalAddDetails(false)
          GetOrdenPedidosDetalles(peor_Id);
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Added successfully`, life: 3000 });

        }else{
          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Error`, life: 3000 });
        }
      
      } else {
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 });
    }
 
  
 
}
//#endregion

// Inicializar el estado con el valor por defecto

  return (
    <>
    <Toast ref={toast}/>

    <Head>
           <title>{getPageTitle('Pedidos Orden')}</title>
    </Head>


    {isExpanded && (
      
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Pedidos Orden" main></SectionTitleLineWithButton>
      
      <Button color="info" label="Add" icon={mdiPlus} onClick={() => handleModalCreate() } small/>

      <DataTable 
         value={GetPedidosOrden} 
         loading={loading} 
         responsiveLayout="scroll"
         paginator 
         rows={10}
       >
         <Column field="peor_Codigo" header="Code" sortable />
         <Column field="pais_Nombre" header="Country" sortable />
         <Column field="ciud_Nombre" header="City" sortable />
         <Column field="empl_Creador" header="Empleado" sortable />
         <Column 
          body={rowData => (
           <div className='flex gap-3.5 justify-center'>
            <Menu model={generateMenuItems(rowData)} popup ref={menuLeft} id="popup_menu_left" />
            <Button color="success" label="Options" icon={mdiDetails} onClick={(event) =>{setPrueba(rowData.peor_finalizacion);  menuLeft.current.toggle(event);
            Setpeor_Codigo(rowData.peor_Codigo);  setproveedor(rowData.prov_NombreCompania); 
            Setduca_No_Duca("Vacio");
            Setpeor_Impuestos(0);
            if (rowData.duca_No_Duca != null) {
              Setduca_No_Duca(rowData.duca_No_Duca)
            }
            if (rowData.peor_Impuestos != 0) {
              Setpeor_Impuestos(rowData.peor_Impuestos)
            }
            setciudad(rowData.ciud_Nombre)
            setpais(rowData.pais_Nombre)
            setprovincia(rowData.pvin_Nombre)
            Setpeor_DireccionExacta(rowData.peor_DireccionExacta)
            Setpeor_FechaEntrada(rowData.peor_FechaEntrada)
           
            Setpeor_Obsevaciones(rowData.peor_Obsevaciones)
            setFechaCreacion(rowData.peor_FechaCreacion)
            setFechaFechaModificacion(rowData.peor_FechaModificacion)
            setUsuarioCreacion(rowData.usuarioCreacionNombre)
            setUsuarioModificacion(rowData.usuarioModificacionNombre)
       
       
            //Editado
            Setpeor_Id(rowData.peor_Id)
            Setciud_Id(rowData.ciud_Id)
         
            sendDeleteFormasEnvio

            GetOrdenPedidosDetalles(rowData.peor_Id)
            if (rowData.duca_No_Duca != null) {
              handleInputChange(rowData.duca_No_Duca)
            }

            setDefaulProvinciaId(rowData.prov_Id)
            setSelectedPais(rowData.pais_Id)
            setSelectDefaultPaisId(rowData.pais_Id)
            setDefaulProvinciaId(rowData.pvin_Id)
            setdefaultCiudadId(rowData.ciud_Id)
            Setprov_Id(rowData.prov_Id)

            console.log(rowData.pais_Nombre)
            


      
    
  
  } }small aria-controls="popup_menu_left" aria-haspopup />
          
           </div>
         )} />
      </DataTable>
 
   
    </SectionMain>
   )}
  <CardBoxModal
  title="Finish"
  buttonColor="info"
  buttonLabel="Add"
  isActive={isModalFinish}
  onConfirm={handleModalCreate}
  onCancel={handleModalCreate}
>

<div className="text-center mb-4">
        <p>Are you sure you want to finish?</p>
      </div>
      <div className="flex justify-center gap-4">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={Delete}>Yes</button>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"  onClick={() => setisModalFinishActive(false)}>No</button>
      </div>
</CardBoxModal>

<CardBoxModal
  title="delete"
  buttonColor="info"
  buttonLabel="Add"
  isActive={isModalDelete}
  onConfirm={handleModalCreate}
  onCancel={handleModalCreate}
>

<div className="text-center mb-4">
        <p>Are you sure you want to delete?</p>
      </div>
      <div className="flex justify-center gap-4">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={DeleteItem}>Yes</button>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"  onClick={() => setisModalDeleteActive(false)}>No</button>
      </div>
</CardBoxModal>

{isExpandedCreate && (
      
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Pedidos Orden" main></SectionTitleLineWithButton>
        
    
  
        <div className="card">
      <div className={tailwindStyles.root}>
        <ul className={tailwindStyles.menu}>
          {itemsTabMenu.map((item, index) => (
            <li key={item.label} className={tailwindStyles.menuitem}>
              <button
                className={tailwindStyles.action(activeIndex === index)}
                onClick={() => handleTabChange({ index })}
              >
                <i className={`${tailwindStyles.icon} ${item.icon}`}></i>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ padding: '20px', overflow: 'hidden' }}>
        {activeIndex == 0 && (
          <div>
<Formik
    innerRef={formikRef}
  initialValues={{
    peor_Codigo: peor_Codigo,
    prov_Id: prov_Id,
    pais_Id: pais_id,
    pvin_Id: pvin_Id,
    duca_No_Duca: duca_No_Duca,
    ciud_Id: ciud_Id,
    peor_DireccionExacta: peor_DireccionExacta,
    peor_FechaEntrada: peor_FechaEntrada,
    peor_Obsevaciones: peor_Obsevaciones,
    peor_Impuestos: peor_Impuestos,
  }}
  validationSchema={validationSchema}
  onSubmit={(values, { setSubmitting }) => {
    setSubmitting(false);
    Send();
  }}
>
  {({ errors, touched, setFieldValue }) => (
    <Form className="w-full">
      <div className="flex justify-between mb-6">
        <div className="flex flex-col mr-4 flex-1">
          <label htmlFor="name" className="mb-2">Code</label>
          <Field
            name="peor_Codigo"
            onChange={(e) => {
              setFieldValue('peor_Codigo', e.target.value);
              Setpeor_Codigo(e.target.value);
            }}
            className={`border p-2 ${touched.peor_Codigo && errors.peor_Codigo ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.peor_Codigo && errors.peor_Codigo && <div className="text-red-500 text-xs mt-1">{errors.peor_Codigo}</div>}
        </div>
        <div className="flex flex-col mr-4 flex-1">
          <label htmlFor="year" className="mb-2">Proveedor</label>
          <select
         
                value={selectProveedor}
                className={`border p-2 ${touched.prov_Id && errors.prov_Id ? 'border-red-500' : 'border-gray-300'}`}
                style={{ height: '42px', paddingTop: '0px' }}
                onChange={(e) => {
                  setSelectProveedor(e.target.value);
                  setFieldValue('prov_Id', e.target.value);
                  Setprov_Id(e.target.value);
                }}
            >
                <option value="0" disabled>Select a option</option>
                {Proveedores.map((prov) => (
                    <option key={prov.prov_Id} value={prov.prov_Id}>
                        {prov.prov_NombreCompania}
                    </option>
                ))}
            </select>
          
          {touched.prov_Id && errors.prov_Id && <div className="text-red-500 text-xs mt-1">{errors.prov_Id.toString()}</div>}
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="year" className="mb-2">No. Duca</label>
          <Field
            name="duca_No_Duca"
            onChange={(e) => {
              setFieldValue('duca_No_Duca', e.target.value);
              Setduca_No_Duca(e.target.value);
              const count = fetchMaterialDuca(e.target.value);

              handleInputChange(e.target.value)



            }}
            className={`border p-2 ${touched.duca_No_Duca && errors.duca_No_Duca ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.duca_No_Duca && errors.duca_No_Duca && <div className="text-red-500 text-xs mt-1">{errors.duca_No_Duca}</div>}
        </div>
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex flex-col mr-4 flex-1">
          <label htmlFor="name" className="mb-2">Country</label>
          <select
                value={selectedPais}
       
                className={`border p-2 ${touched.pais_Id && errors.pais_Id ? 'border-red-500' : 'border-gray-300'}`}
                style={{ height: '42px', paddingTop: '0px' }}
                onChange={(e) => {
                  setSelectedPais(e.target.value);
                  setFieldValue('pais_Id', e.target.value);
                  fetchProvincias(e.target.value);
                }}
            >
                <option value="0" disabled>Select a option</option>
                {paises.map((pais) => (
                    <option key={pais.pais_Id} value={pais.pais_Id}>
                        {pais.pais_Nombre}
                    </option>
                ))}
            </select>
   
          {touched.pais_Id && errors.pais_Id && <div className="text-red-500 text-xs mt-1">{errors.pais_Id.toString()}</div>}
        </div>
        <div className="flex flex-col mr-4 flex-1">
          <label htmlFor="year" className="mb-2">Province</label>
          <select
                value={selectedProvincia}
              
                onChange={(e) => {
                  setSelectedProvincia(e.target.value);
                  setFieldValue('pvin_Id', e.target.value);
                  fetchCiudades(e.target.value);
                }}
                className={`border p-2 ${touched.pvin_Id && errors.pvin_Id ? 'border-red-500' : 'border-gray-300'}`}
                style={{ height: '42px', paddingTop: '0px' }}
            >
                <option value="" disabled>Select a option</option>
                {provincias.map((prov) => (
                    <option key={prov.pvin_Id} value={prov.pvin_Id}>
                        {prov.pvin_Nombre}
                    </option>
                ))}
            </select>
          {touched.pvin_Id && errors.pvin_Id && <div className="text-red-500 text-xs mt-1">{errors.pvin_Id.toString()}</div>}
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="year" className="mb-2">City</label>
          <select
                value={selectedCiudad}
                onChange={(e) => {
                  setSelectedCiudad(e.target.value);
                  setFieldValue('ciud_Id', e.target.value);
                  Setciud_Id(e.target.value);
                }}
                className={`border p-2 ${touched.ciud_Id && errors.ciud_Id ? 'border-red-500' : 'border-gray-300'}`}
                style={{ height: '42px', paddingTop: '0px' }}
            >
                <option value="" disabled>Select a option</option>
                {ciudades.map((ciud) => (
                    <option key={ciud.ciud_Id} value={ciud.ciud_Id}>
                        {ciud.ciud_Nombre}
                    </option>
                ))}
            </select>
    
          {touched.ciud_Id && errors.ciud_Id && <div className="text-red-500 text-xs mt-1">{errors.ciud_Id.toString()}</div>}
        </div>
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex flex-col mr-4 flex-1">
          <label htmlFor="name" className="mb-2">Exact direction</label>
          <Field
            name="peor_DireccionExacta"
            onChange={(e) => {
              setFieldValue('peor_DireccionExacta', e.target.value);
              Setpeor_DireccionExacta(e.target.value);
            }}
            className={`border p-2 ${touched.peor_DireccionExacta && errors.peor_DireccionExacta ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.peor_DireccionExacta && errors.peor_DireccionExacta && <div className="text-red-500 text-xs mt-1">{errors.peor_DireccionExacta}</div>}
        </div>
        <div className="flex flex-col mr-4 flex-1">
  <label htmlFor="name" className="mb-2">Entry date</label>
  <style jsx>{`
  .p-inputtext {
    border: none !important;
  }
  .p-component {
    border: none !important;
  }
`}</style>
  <Calendar 
    value={peor_FechaEntrada ? new Date(peor_FechaEntrada) : null} 
    onChange={(e) => { 
      Setpeor_FechaEntrada(e.value); 
      setFieldValue('peor_FechaEntrada', e.target.value);
    }} 
    dateFormat="yy/dd/mm" 
    className={`w-full border ${touched.peor_FechaEntrada && errors.peor_FechaEntrada ? 'border-red-500' : 'border-gray-300'}`}
    inputStyle={{ border: 'none' }}
  />

  {touched.peor_FechaEntrada && errors.peor_FechaEntrada && <div className="text-red-500 text-xs mt-1">Fecha vacia</div>}
</div>
        <div className="flex flex-col flex-1 items-center">
          <label htmlFor="impuesto" className="mb-2">Impuesto</label>
          <div className="card flex justify-center w-full">
            <Checkbox onChange={e => { setChecked(e.checked); ValorImpuesto() }} checked={checked}></Checkbox>
          </div>
        </div>
      </div>
      <div className="flex flex-col mb-6">
        <div className="flex flex-1 mb-4">
          <div className="flex flex-col flex-grow mr-4">
            <label htmlFor="name" className="mb-2">Observations</label>
            <Field
              name="peor_Obsevaciones"
              onChange={(e) => {
                setFieldValue('peor_Obsevaciones', e.target.value);
                Setpeor_Obsevaciones(e.target.value);
              }}
              className={`border p-2 ${touched.peor_Obsevaciones && errors.peor_Obsevaciones ? 'border-red-500' : 'border-gray-300'}`}
            />
            {touched.peor_Obsevaciones && errors.peor_Obsevaciones && <div className="text-red-500 text-xs mt-1">{errors.peor_Obsevaciones}</div>}
          </div>
          <div className="flex flex-row flex-grow-2 gap-2 align-items-center mt-6">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              style={{ height: '44px' }}
              onClick={() => handleModalCreateLeave()}
            >
              Leave
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              style={{ height: '44px' }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Form>
  )}
</Formik>
          </div>
        )}
        {activeIndex == 1 && (
          <div>
            <Formik
  initialValues={{
    mate_Descripcion: "",
    item_Id: "",
    mate_Id: "",
    prod_Cantidad: "",
    prod_Precio: "",
  }}
  validationSchema={validationSchemaDetails}
  onSubmit={(values, { setSubmitting }) => {
    setSubmitting(false);
    SendDetails(values);
  }}
>
  {({ errors, touched, setFieldValue }) => (
    <Form className="w-full">
      <div className="flex justify-between mb-6">
        <div className="flex flex-col mr-4 flex-1 ">
        <div className="card">
      <DataScroller
        value={Material}
        itemTemplate={(data) => itemTemplate(data, setFieldValue)}
        rows={200}
        buffer={0.4}
        inline scrollHeight="300px"
        header="List of Products"
      />
    </div>
 
        
        </div>
        <div className="flex flex-col mr-4 flex-1 justify-between">
        <label htmlFor="name" className="mb-2">Material</label>
        <Field
            disabled={true}
            name="mate_Descripcion"
            className={`border p-2 ${touched.mate_Descripcion && errors.mate_Descripcion ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.mate_Descripcion && errors.mate_Descripcion && <div className="text-red-500 text-xs mt-1">{errors.mate_Descripcion}</div>}
          <label htmlFor="name" className="mb-2">Amount</label>
          <Field
           disabled={Active}
            name="prod_Cantidad"
            onChange={(e) => {
              setFieldValue('prod_Cantidad', e.target.value);
            }}
            className={`border p-2 ${touched.prod_Cantidad && errors.prod_Cantidad ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.prod_Cantidad && errors.prod_Cantidad && <div className="text-red-500 text-xs mt-1">{errors.prod_Cantidad.toString()}</div>}
          <label htmlFor="name" className="mb-2">Price</label>
          <Field
            disabled={Active}
            name="prod_Precio"
            onChange={(e) => {
              setFieldValue('prod_Precio', e.target.value);
            }}
            className={`border p-2 ${touched.prod_Precio && errors.prod_Precio ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.prod_Precio && errors.prod_Precio && <div className="text-red-500 text-xs mt-1">{errors.prod_Precio.toString()}</div>}
        </div>

      </div>

      <div className="flex flex-row flex-grow-2 gap-2 align-items-center justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              style={{ height: '44px' }}
              onClick={() => handleModalCreateLeave()}
            >
              Leave
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              style={{ height: '44px' }}
            >
              Add
            </button>
          </div>

    </Form>
  )}
</Formik>
<DataTable 
        value={GetPedidosDetalles} 
        loading={loadingDetalles} 
        responsiveLayout="scroll"
        paginator 
        rows={10}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={renderDetalles}
      >
        <Column expander style={{ width: '3em' }} />
         <Column field="mate_Descripcion" header="Material" sortable />
         <Column field="prod_Cantidad" header="Amount" sortable />
         <Column field="prod_Precio" header="Price" sortable />
         <Column 
          body={rowData => (
           <div className='flex gap-3.5 justify-center'>
            <Menu model={itemsDetalles} popup ref={menuLeftDetalles} id="popup_menu_left" />
            <Button color="success" label="Options" icon={mdiDetails} onClick={(event) => {menuLeftDetalles.current.toggle(event); setitem_Id(rowData.item_Id); setprod_Id(rowData.prod_Id) }} small aria-controls="popup_menu_left" aria-haspopup />
          
           </div>
         )} />
      </DataTable>

          </div>
        )}
      </div>
    </div>
  <CardBoxModal
  title="Add"
  buttonColor="info"
  buttonLabel="Add"
  isActive={isModalAddDetails}
  onConfirm={handleModalCreateLeaveModal}
  onCancel={handleModalCreate}
>

<div className="text-center mb-4">
<Formik
  initialValues={{

    code_Id: "",
    orco_Id: "",
  }}
  validationSchema={validationSchemaAdd}
  onSubmit={(values, { setSubmitting }) => {
    setSubmitting(false);
    SendSubDetails(values);
  }}
>
  {({ errors, touched, setFieldValue }) => (
    <Form className="w-full">
      <div className="flex justify-between mb-6">
        <div className="flex flex-col mr-4 flex-1">
        <label htmlFor="name" className="mb-2 w-full text-left">Orden Compra</label>
        <div className="card flex justify-content-center">
            <AutoComplete field="orco_Codigo" value={SelectCompraDetalle}    className={`border w-46 ${touched.orco_Id && errors.orco_Id ? 'border-red-500' : 'border-gray-300'}`} suggestions={filteredCode} completeMethod={search} inputStyle={{ border: 'none' }} onChange={(e) =>{ setSelectCompraDetalle(e.value), setFieldValue('orco_Id', e.value.orco_Id);; AxioFiltradoCompra(e.value.orco_Codigo)}} />
        </div>
      
          {touched.orco_Id && errors.orco_Id && <div className="text-red-500 text-xs mt-1">{errors.orco_Id}</div>}
        </div>
        <div className="flex flex-col mr-4 flex-1">
        <label htmlFor="name" className="mb-2 mr-28">Detalle</label>
          <Dropdown
            value={SelectCompraDetalle}
            onChange={(e) => {

              setFieldValue('code_Id', e.value.code_Id);
              setSelectCompraDetalle(e.value)
            }}
            options={CompraDetalleFiltrado}
            optionLabel="esti_Descripcion"
            placeholder="Select a option"
            className={`border p-2 w-46 ${touched.code_Id && errors.code_Id ? 'border-red-500' : 'border-gray-300'}`}
            style={{ height: '42px', paddingTop: '0px' }}
          />
          {touched.orco_Id && errors.orco_Id && <div className="text-red-500 text-xs mt-1">{errors.orco_Id}</div>}
        </div>
    
      </div>
      <div className="flex flex-row flex-grow-2 gap-2 align-items-center mt-6 justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              style={{ height: '44px' }}
              onClick={() => setisModalAddDetails(false)}
            >
              Leave
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              style={{ height: '44px' }}
            >
              Add
            </button>
          </div>
    </Form>
  )}
</Formik>
      </div>
     
</CardBoxModal>

   
     
      </SectionMain>
     )}




{isExpandedDetails && (
         <SectionMain>
           <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Formas Envio" main>
           </SectionTitleLineWithButton>
   
          
   
  
 
 
           <div className="p-4">
  <table className="w-full mb-4 border-collapse">
    <thead>
      <tr className="bg-gray-200">
        <th className="border px-4 py-2 min-w-[350px]">Code</th>
        <th className="border px-4 py-2 min-w-[350px]">Proveedor</th>
        <th className="border px-4 py-2 min-w-[350px]">Duca</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2">{peor_Codigo}</td>
        <td className="border px-4 py-2">{proveedor}</td>
        <td className="border px-4 py-2">{duca_No_Duca}</td>
      </tr>
    </tbody>
  </table>
  <table className="w-full mb-4 border-collapse">
    <thead>
      <tr className="bg-gray-200">
        <th className="border px-4 py-2 min-w-[350px]">Country</th>
        <th className="border px-4 py-2 min-w-[350px]">Provicen</th>
        <th className="border px-4 py-2 min-w-[350px]">City</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2">{pais}</td>
        <td className="border px-4 py-2">{provincia}</td>
        <td className="border px-4 py-2">{ciudad}</td>
      </tr>
    </tbody>
  </table>
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-200">
        <th className="border px-4 py-2 min-w-[350px]">Entry Date</th>
        <th className="border px-4 py-2 min-w-[350px]">Exact Address</th>
        <th className="border px-4 py-2 min-w-[350px]">Impuesto</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2">{peor_FechaEntrada}</td>
        <td className="border px-4 py-2">{peor_DireccionExacta}</td>
        <td className="border px-4 py-2">{peor_Impuestos}</td>
      </tr>
    </tbody>
  </table>
</div>
 
           <h2 className='font-extrabold ml-1 mt-1 mb-1'>Auditoria</h2>
           <table className="w-full border-collapse">
             <thead>
               <tr>
                 <th className="border px-4 py-2">Action</th>
                 <th className="border px-4 py-2">User</th>
                 <th className="border px-4 py-2">Date</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td className="border px-4 py-2">Create</td>
                 <td className="border px-4 py-2">{UsuarioCreacion}</td>
                 <td className="border px-4 py-2">{FechaCreacion}</td>
               </tr>
               <tr>
                 <td className="border px-4 py-2">Edit</td>
                 <td className="border px-4 py-2">{UsuarioModificacion}</td>
                 <td className="border px-4 py-2">{FechaModificacion}</td>
               </tr>
             </tbody>
           </table>
      
 
         <Button color="info" label="Cancel" icon={mdiAppleKeyboardControl} onClick={() => togglePanelDetails() } small/>
         </SectionMain>
          )}
    </>


    
  )
}

PedidosOrdenPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default PedidosOrdenPage
