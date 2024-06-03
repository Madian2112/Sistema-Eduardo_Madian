import {
  mdiAppleKeyboardControl,
  mdiBorderColor,
  mdiChartTimelineVariant,
  mdiDelete,
  mdiDetails,
  mdiPlus,
} from '@mdi/js'


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
import { getCiudadesPorProvincias, getFormasEnvio, getMaterial, getPaises, getPedidosOrden, getPedidosOrdenDetalles, getProveedores, getProvinciasPorPaises, sendDeleteFormasEnvio, sendEditFormasEnvio, sendFormasEnvio, sendPedidosOrden } from './apiService/data/components/ApiService';
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
import { OrdenPedidosEnvioViewModel } from '../interfaces/PedidoOrdenViewModel';
import { parse } from 'path';



const PedidosOrdenPage = () => {
//Toast
const toast = useRef<Toast>(null);
//Collapse
const [isExpanded, setIsExpanded] = useState(true);
const [isExpandedCreate, setIsExpandedCreate] = useState(false);

const handleModalCreate = () => {
  EditOrCreate("Create")
  setIsExpanded(!isExpanded);
  Setpeor_Codigo("")
  Setprov_Id(null)
  Setduca_No_Duca("")
  Setpeor_Impuestos(0)
  Setciud_Id("")
  setSelectedPais(null)
  setSelectedProvincia(null)
  Setpeor_DireccionExacta("")
  Setpeor_FechaEntrada("")
  Setpeor_Obsevaciones("")
  setIsExpandedCreate(!isExpandedCreate);
}

const handleModalEdit = (EcoEnvio) => {
  console.log(EcoEnvio)
  EditOrCreate("Edit")
  setIsExpanded(!isExpanded);
  Setpeor_Codigo(EcoEnvio.peor_Codigo)
  setSelectProveedor(EcoEnvio.prov_Id.toString())
  console.log(EcoEnvio.prov_Id)
  Setprov_Id(EcoEnvio.prov_Id.toString())
  Setduca_No_Duca("Vacio")
  Setpeor_Impuestos(0)
  if (EcoEnvio.duca_No_Duca != null) {
    Setduca_No_Duca(EcoEnvio.duca_No_Duca)
  }
  if (EcoEnvio.peor_Impuestos != 0) {
    Setpeor_Impuestos(EcoEnvio.peor_Impuestos)
  }
  Setciud_Id(EcoEnvio.ciud_Id)
  setSelectedPais(EcoEnvio.pais_Id)
  setSelectedProvincia(EcoEnvio.pvin_Id)
  Setpeor_DireccionExacta(EcoEnvio.peor_DireccionExacta)
  Setpeor_FechaEntrada(EcoEnvio.peor_FechaEntrada)
  Setpeor_Obsevaciones(EcoEnvio.peor_Obsevaciones)
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
const generateMenuItems = (rowData) => {
  const baseItems = [
    {
      label: 'Details',
      icon: 'pi pi-upload',
      command: () => togglePanel(rowData)
    }
  ];

  if (!rowData.peor_finalizacion) {
    baseItems.push(
      {
        label: 'Edit',
        icon: 'pi pi-refresh',
        command: () => handleModalEdit(rowData)
      },
      {
        label: 'Delete',
        icon: 'pi pi-upload',
        command: () => togglePanel(rowData)
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
const [selectProveedor, setSelectProveedor] = useState(null);
const [Proveedores, setProveedores] = useState([]);
const [selectedPais, setSelectedPais] = useState(null);
const [paises, setPaises] = useState([]);
const [ciudades, setCiudades] = useState([]);
const [selectedCiudad, setSelectedCiudad] = useState(null);
const [provincias, setProvincias] = useState([]);
const [selectedProvincia, setSelectedProvincia] = useState(null);
const [loadingDrop, setLoadingDrop] = useState(false);

const AxioProveedores = async () => {
  setLoadingDrop(true);
  try {
    const data = await getProveedores();
    setProveedores(data);
    setLoadingDrop(false);
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch proveedores', life: 3000 });
    setLoadingDrop(false);
  }
};

const fetchPaises = async () => {
  setLoadingDrop(true);
  try {
    const data = await getPaises();
    setProvincias([]);
    setPaises(data);
    setLoadingDrop(false);
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch paises', life: 3000 });
    setLoadingDrop(false);
  }
};

const fetchProvincias = async (valor) => {
  setLoadingDrop(true);
  try {
      if (valor) {
        setCiudades([]);
        console.log(valor)
        const data = await getProvinciasPorPaises(valor);
        console.log(data)
        setProvincias(data);
      }
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch paises', life: 3000 });
    setLoadingDrop(false);
  }
};

const fetchCiudades = async (valor) => {
  if (valor) {
    const data = await getCiudadesPorProvincias(valor);
    setCiudades(data);
  }
  else {
    setCiudades([]);
    console.log("La provincia no tenia ciuadad");
  }
};

useEffect(() => {
  fetchPaises();
}, []);

useEffect(() => {
  AxioProveedores();
}, []);

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
  pvin_Id:Yup.object().required('Province is requerid'),
  pais_Id: Yup.object().required('Country is requerid'),
  ciud_Id: Yup.string().required('City is requerid'),
  peor_DireccionExacta: Yup.string().required('Exact address is requerid'),
  peor_FechaEntrada: Yup.string().required('Entry date is requerid'),
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
    peor_FechaEntrada: peor_FechaEntrada.toISOString(),
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
      const response = await sendEditFormasEnvio(productData);
      if (response.status === 200) {
        console.log('Success:', response.data);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: `Update successfully`, life: 3000 });
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
//AUTOCOMPLETE


const [Material, setMateriales] = useState([]);
const [MaterialDesc, setMaterialDesc] = useState(null);
const [MaterialDescCodigo, setMaterialDescCodigo] = useState(null);
const [filteredCountries, setFilteredCountries] = useState(null);

const [filteredCountriesCodigo, setfilteredCountriesCodigo] = useState(null);
const fetchMaterial = async () => {
  try {
    const data = await getMaterial();
    setMateriales(data);

  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch materials', life: 3000 });

  }
};
useEffect(() => {
  fetchMaterial()
}, []);

const search = (event) => {
  // Timeout to emulate a network connection
  setTimeout(() => {
      let _filteredCountries;

      if (!event.query.trim().length) {
          _filteredCountries = [...Material];
      }
      else {
          _filteredCountries = Material.filter((country) => {
              return country.mate_Descripcion.toLowerCase().startsWith(event.query.toLowerCase());
          });
      }

      setFilteredCountries(_filteredCountries);
  }, 250);
}
const searchCodigo = (event) => {
  // Timeout to emulate a network connection
  setTimeout(() => {
      let _filteredCountries;

      if (!event.query.trim().length) {
          _filteredCountries = [...Material];
      }
      else {
          _filteredCountries = Material.filter((country) => {
              return country.mate_Id.toString().toLowerCase().startsWith(event.query.toLowerCase());
          });
      }

      setfilteredCountriesCodigo(_filteredCountries);
  }, 250);
}
//Variables

//#endregion

//#region DATAMASTER-DETAIL
const [GetPedidosDetalles, setPedidosDetalles] = useState([]);
const [loadingDetalles, setloadingDetalles] = useState(false);
const GetOrdenPedidosDetalles = async () => {
  setloadingDetalles(true);
  try {
    const data = await getPedidosOrdenDetalles(2);
    console.log("EEEEEES")
    console.log(data)
    setPedidosDetalles(data);
    setloadingDetalles(false);
  } catch (error) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
    setloadingDetalles(false);
  }
};

useEffect(() => {
  GetOrdenPedidosDetalles();
}, []); 
const menuLeftDetalles = useRef(null);
const itemsDetalles = [
  {
      label: 'Options',
      items: [
          {
              label: 'Edit',
              icon: 'pi pi-refresh'
          },
          {
              label: 'Details',
              icon: 'pi pi-upload'
          },
          {
            label: 'Delete',
            icon: 'pi pi-upload'
        }
      ]
  }
];
//#endregion
//Details Table
const [isExpandedDetails, setIsExpandedDetails] = useState(false);
const [FechaCreacion, setFechaCreacion] = useState("");
const [FechaModificacion, setFechaFechaModificacion] = useState("");
const [UsuarioCreacion, setUsuarioCreacion] = useState("");
const [UsuarioModificacion, setUsuarioModificacion] = useState("");
const togglePanel = (EcoEnvio) => {
  console.log(EcoEnvio);
  setIsExpanded(!isExpanded);
  Setpeor_Codigo(EcoEnvio.peor_Codigo)
  Setprov_Id(EcoEnvio.prov_NombreCompania)
  Setduca_No_Duca("Vacio")
  Setpeor_Impuestos(0)
  if (EcoEnvio.duca_No_Duca != null) {
    Setduca_No_Duca(EcoEnvio.duca_No_Duca)
  }
  if (EcoEnvio.peor_Impuestos != 0) {
    Setpeor_Impuestos(EcoEnvio.peor_Impuestos)
  }
  Setciud_Id(EcoEnvio.ciud_Nombre)
  setSelectedPais(EcoEnvio.pais_Nombre)
  setSelectedProvincia(EcoEnvio.pvin_Nombre)
  Setpeor_DireccionExacta(EcoEnvio.peor_DireccionExacta)
  Setpeor_FechaEntrada(EcoEnvio.peor_FechaEntrada)
  Setpeor_Obsevaciones(EcoEnvio.peor_Obsevaciones)
  setFechaCreacion(EcoEnvio.peor_FechaCreacion)
  setFechaFechaModificacion(EcoEnvio.peor_FechaModificacion)
  setUsuarioCreacion(EcoEnvio.usuarioCreacionNombre)
  setUsuarioModificacion(EcoEnvio.usuarioModificacionNombre)
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
            <Button color="success" label="Options" icon={mdiDetails} onClick={(event) =>{menuLeft.current.toggle(event); console.log(rowData)} }small aria-controls="popup_menu_left" aria-haspopup />
          
           </div>
         )} />
      </DataTable>
 
   
    </SectionMain>
   )}


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
    pais_Id: selectedPais,
    pvin_Id: selectedProvincia,
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
          <Dropdown
            value={selectProveedor}
            onChange={(e) => {
              setSelectProveedor(e.value);
              setFieldValue('prov_Id', e.value.prov_Id);
              Setprov_Id(e.value.prov_Id);
            }}
            options={Proveedores}
            optionLabel="prov_NombreCompania"
            placeholder="Select a option"
            className={`border p-2 ${touched.prov_Id && errors.prov_Id ? 'border-red-500' : 'border-gray-300'}`}
            style={{ height: '42px', paddingTop: '0px' }}
          />
          {touched.prov_Id && errors.prov_Id && <div className="text-red-500 text-xs mt-1">{errors.prov_Id}</div>}
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="year" className="mb-2">No. Duca</label>
          <Field
            name="duca_No_Duca"
            onChange={(e) => {
              setFieldValue('duca_No_Duca', e.target.value);
              Setduca_No_Duca(e.target.value);
            }}
            className={`border p-2 ${touched.duca_No_Duca && errors.duca_No_Duca ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.duca_No_Duca && errors.duca_No_Duca && <div className="text-red-500 text-xs mt-1">{errors.duca_No_Duca}</div>}
        </div>
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex flex-col mr-4 flex-1">
          <label htmlFor="name" className="mb-2">Country</label>
          <Dropdown
            value={selectedPais}
            onChange={(e) => {
              setSelectedPais(e.value);
              setFieldValue('pais_Id', e.value);
              fetchProvincias(e.value.pais_Id);
            }}
            options={paises}
            optionLabel="pais_Nombre"
            placeholder="Select a option"
            className={`border p-2 ${touched.pais_Id && errors.pais_Id ? 'border-red-500' : 'border-gray-300'}`}
            style={{ height: '42px', paddingTop: '0px' }}
          />
          {touched.pais_Id && errors.pais_Id && <div className="text-red-500 text-xs mt-1">{errors.pais_Id.toString()}</div>}
        </div>
        <div className="flex flex-col mr-4 flex-1">
          <label htmlFor="year" className="mb-2">Province</label>
          <Dropdown
            value={selectedProvincia}
            onChange={(e) => {
              setSelectedProvincia(e.value);
              setFieldValue('pvin_Id', e.value);
              fetchCiudades(e.value.pvin_Id);

            }}
            options={provincias}
            optionLabel="pvin_Nombre"
            placeholder="Select a option"
            className={`border p-2 ${touched.pvin_Id && errors.pvin_Id ? 'border-red-500' : 'border-gray-300'}`}
            style={{ height: '42px', paddingTop: '0px'  }}
          />
          {touched.pvin_Id && errors.pvin_Id && <div className="text-red-500 text-xs mt-1">{errors.pvin_Id.toString()}</div>}
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="year" className="mb-2">City</label>
          <Dropdown
            value={selectedCiudad}
            onChange={(e) => {
              setSelectedCiudad(e.value);
              setFieldValue('ciud_Id', e.value.ciud_Id);
              Setciud_Id(e.value.ciud_Id);
            }}
            options={ciudades}
            optionLabel="ciud_Nombre"
            placeholder="Select a option"
            className={`border p-2 ${touched.ciud_Id && errors.ciud_Id ? 'border-red-500' : 'border-gray-300'}`}
            style={{ height: '42px', paddingTop: '0px' }}
          />
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
    value={peor_FechaEntrada} 
    onChange={(e) => { 
      Setpeor_FechaEntrada(e.value); 
      setFieldValue('peor_FechaEntrada', e.target.value);
    }} 
    dateFormat="yy/dd/mm" 
    className={`w-full border ${touched.peor_FechaEntrada && errors.peor_FechaEntrada ? 'border-red-500' : 'border-gray-300'}`}
    inputStyle={{ border: 'none' }}
  />

  {touched.peor_FechaEntrada && errors.peor_FechaEntrada && <div className="text-red-500 text-xs mt-1">{errors.peor_FechaEntrada.toString()}</div>}
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
          <div className="flex flex-row flex-grow-2 gap-2 align-items-center">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              style={{ height: '44px' }}
            >
              Cancel
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
    mate_Descripcion: '',
    pedi_Id: peor_Codigo,
    mate_Id: prov_Id,
    prod_Cantidad: selectedPais,
    prod_Precio: selectedProvincia,
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
          <label htmlFor="name" className="mb-2">Material</label>
          <AutoComplete 
      value={MaterialDesc} 
      suggestions={filteredCountries} 
      completeMethod={search} 
      onChange={(e) => {
        setMaterialDesc(e.value); 
        console.log(e.value)
        setFieldValue('mate_Descripcion', e.value.mate_Descripcion); 
        setIMG(e.value.mate_Imagen);
        setMaterialDescCodigo(e.value.mate_Id)
      }} 
      field="mate_Descripcion"
      inputStyle={{ border: 'none',width: '100%'}}

      className={`border w-full ${touched.mate_Descripcion && errors.mate_Descripcion ? 'border-red-500' : 'border-gray-300'}`} 
    />
          {touched.mate_Descripcion && errors.mate_Descripcion && <div className="text-red-500 text-xs mt-1">{errors.mate_Descripcion}</div>}
        </div>
        <div className="flex flex-col mr-4 flex-1">
        <label htmlFor="name" className="mb-2">Code</label>
          <AutoComplete 
      value={MaterialDescCodigo} 
      suggestions={filteredCountriesCodigo} 
      completeMethod={searchCodigo} 
      onChange={(e) => {
        setMaterialDescCodigo(e.value); 
        console.log(e.value)
        setFieldValue('mate_Id', e.value.mate_Id); 
        setIMG(e.value.mate_Imagen);
        setMaterialDesc(e.value.mate_Descripcion)
      }} 
      field="mate_Id"
      inputStyle={{ border: 'none',width: '100%'}}

      className={`border w-full ${touched.mate_Id && errors.mate_Id ? 'border-red-500' : 'border-gray-300'}`} 
    />
          {touched.mate_Id && errors.mate_Id && <div className="text-red-500 text-xs mt-1">{errors.mate_Id}</div>}
        </div>

      </div>

      <div className="flex justify-between mb-6">
        <div className="flex flex-col mr-4 flex-1 justify-between">
        <label htmlFor="name" className="mb-2">Amount</label>
          <Field
            name="prod_Cantidad"
            onChange={(e) => {
              setFieldValue('prod_Cantidad', e.target.value);
              Setpeor_Codigo(e.target.value);
            }}
            className={`border p-2 ${touched.prod_Cantidad && errors.prod_Cantidad ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.prod_Cantidad && errors.prod_Cantidad && <div className="text-red-500 text-xs mt-1">{errors.prod_Cantidad.toString()}</div>}
          <label htmlFor="name" className="mb-2">Price</label>
          <Field
            name="prod_Precio"
            onChange={(e) => {
              setFieldValue('prod_Precio', e.target.value);
              Setpeor_Codigo(e.target.value);
            }}
            className={`border p-2 ${touched.prod_Precio && errors.prod_Precio ? 'border-red-500' : 'border-gray-300'}`}
          />
          {touched.prod_Precio && errors.prod_Precio && <div className="text-red-500 text-xs mt-1">{errors.prod_Precio.toString()}</div>}
        </div>
        <div className="flex flex-col mr-4 flex-1">
        <div className="flex justify-center items-center">
  <img src={IMG} alt="" width="200px" />
</div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
           <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" >Send</button>
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
       >
         <Column field="mate_Descripcion" header="Material" sortable />
         <Column field="prod_Cantidad" header="Amount" sortable />
         <Column field="prod_Precio" header="Price" sortable />
         <Column 
          body={rowData => (
           <div className='flex gap-3.5 justify-center'>
            <Menu model={itemsDetalles} popup ref={menuLeftDetalles} id="popup_menu_left" />
            <Button color="success" label="Options" icon={mdiDetails} onClick={(event) => menuLeftDetalles.current.toggle(event)} small aria-controls="popup_menu_left" aria-haspopup />
          
           </div>
         )} />
      </DataTable>

          </div>
        )}
      </div>
    </div>


   
     
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
        <td className="border px-4 py-2">{prov_Id}</td>
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
        <td className="border px-4 py-2">{selectedPais}</td>
        <td className="border px-4 py-2">{selectedProvincia}</td>
        <td className="border px-4 py-2">{ciud_Id}</td>
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
