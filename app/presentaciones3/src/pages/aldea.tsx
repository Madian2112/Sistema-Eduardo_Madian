import {
  mdiPlus,
  mdiEye, 
  mdiCity, 
  mdiChartTimelineVariant,
  mdiAppleKeyboardControl,
  mdiBorderColor,
  mdiDetails
} from '@mdi/js'
import { Formik, Form, Field, /*ErrorMessage*/ } from 'formik';
import Head from 'next/head'
import React, { useState, useRef, useEffect } from 'react'
import type { ReactElement } from 'react'
import Button from '../components/Button'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import { getPageTitle } from '../config'
import { Toast } from 'primereact/toast';
import {/* mdiEye, mdiTrashCan*/ } from '@mdi/js' 
import CardBoxModal from '../components/CardBox/Modal'
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
/*import { Dropdown } from 'primereact/dropdown';*/
import { getAldea, sendEditAldea, sendAldea, getPaises, getProvinciasPorPaises, getCiudadesPorProvincias } from './apiService/data/components/ApiService';
/*import { FormasEnvioViewMode } from '../interfaces/FormasEnvioViewModel'; */
import { Aldea } from '../interfaces/AldeaViewModel';
/*import { AldeaTabla } from '../interfaces/AldeaViewModel'; */
import 'primereact/resources/themes/saga-blue/theme.css'; // Importa el tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Importa los estilos de PrimeReact
import 'primeicons/primeicons.css';

/* INICIO DEL CODIGO */
const AldeaPage = () => {
    //IziToast y Modales
    const [elect, EditOrCreate] = useState('');
    const [isModalInfoActive, setIsModalInfoActive] = useState(false);
    const [provincias, setProvincias] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [ciudades, setCiudades] = useState([]);
    const [selectedCiudad, setSelectedCiudad] = useState(0);
    const [paises, setPaises] = useState([]);
    const [selectedPais, setSelectedPais] = useState('');
    const toast = useRef<Toast>(null);

    const handleModalAction = () => {
     
      setIsModalInfoActive(false);
    }

    const handleModalCreate = () => {
      EditOrCreate("Create")
      setDescripcion("");
      setCity("");
      setIsModalInfoActive(true);
      setCiudades([]);
      setSelectedCiudad(0);
      setSelectedPais("0");
      setProvincias([]);
      setSelectedProvincia("");
    }
    //Validador
    const validationSchema = Yup.object().shape({
      alde_Nombre: Yup.string().required('Codigo is requerid').matches(/^[A-Za-z\s]+$/, 'Name should contain only letters and spaces.'),
    });
    //Inicializar Variables
    const [descripcion, setDescripcion] = useState('');
    const [id, setId] = useState('');
    const [city, setCity] = useState("");
    //Envio
    const Send = async () => {
      const productData: Aldea = {
        alde_Id: parseFloat(id),
        alde_Nombre: descripcion, 
        ciud_Id: selectedCiudad, 
        ciud_Nombre: "", 
        pvin_Id: 0, 
        pvin_Codigo: "", 
        pvin_Nombre: "", 
        usua_UsuarioCreacion: 1, 
        usuarioCreacionNombre: "",
        alde_FechaCreacion: new Date().toISOString(), 
        usua_UsuarioModificacion: 1, 
        usuarioModificacionNombre: "",
        alde_FechaModificacion: new Date().toISOString(), 
        usua_UsuarioEliminacion: 1,
        alde_FechaEliminacion: new Date().toISOString(),
        alde_Estado: true,  
      };
      if (elect == "Create") {
        try {
          const response = await sendAldea(productData);
          if (response.status === 200) {
            console.log('Success:', response.data);
            setIsModalInfoActive(false);
            fetchAldea(); 
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Formas envio added successfully`, life: 3000 });
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
          const response = await sendEditAldea(productData);
          if (response.status === 200) {
            console.log('Success:', response.data);
            setIsModalInfoActive(false);
            fetchAldea(); 
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Formas envio added successfully`, life: 3000 });
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

    const [ciudad, setCiudad] = useState('');
    const [UsuarioCreacion, setUsuarioCreacion] = useState('');
    const [FechaCreacion, setFechaCreacion] = useState('');
    const [UsuarioModificacion, setUsuarioModificacion] = useState('');
    const [FechaModificacion, setFechaModificacion] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [isExpandedDetails, setIsExpandedDetails] = useState(false);

    const togglePanel = (formaEnvio) => {
      console.log(formaEnvio);
      setIsExpanded(!isExpanded);
      setId(formaEnvio.alde_Id)
      setCiudad(formaEnvio.ciud_Nombre);
      setDescripcion(formaEnvio.alde_Nombre);
      setUsuarioCreacion(formaEnvio.usuarioCreacionNombre);
      setFechaCreacion(formaEnvio.alde_FechaCreacion);
      setUsuarioModificacion(formaEnvio.usuarioModificacionNombre);
      setFechaModificacion(formaEnvio.alde_FechaModificacion);
      setIsExpandedDetails(!isExpandedDetails);
    };

    const togglePanelDetails = () => {
      setIsExpanded(!isExpanded);
      setId("")
      setCiudad("");
      setDescripcion("");
      setUsuarioCreacion("");
      setFechaCreacion("");
      setUsuarioModificacion("");
      setFechaModificacion("");
      setIsExpandedDetails(!isExpandedDetails);
    };

    //Hooks Almacenar Datos
    const [Aldea, setAldea] = useState([]);
    const [loading, setLoading] = useState(false);
    

    const fetchAldea= async () => {
      setLoading(true);
      try {
        const data = await getAldea();
        setAldea(data);
        setLoading(false);
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchAldea();
    }, []);
    //HTML


    const handleEdit = (formaEnvio) => {
      EditOrCreate("Edit")
      console.log(formaEnvio)
      setId(formaEnvio.alde_Id)
      setDescripcion(formaEnvio.alde_Nombre);
      setSelectedCiudad(formaEnvio.ciud_Id)
      setSelectedProvincia(formaEnvio.pvin_Id)
      setIsModalInfoActive(true);
    };

    /*const handleDelete = (formaEnvio) => {
      setDescripcion(formaEnvio.foen_Descripcion);
      setisModalDeleteActive(true);
    }; */

        /*PARA LOS PAISES */
      useEffect(() => {
        const fetchPaises = async () => {
          setCiudades([]);
          setSelectedCiudad(0);
          const data = await getPaises();
          setPaises(data);
        };
        fetchPaises();
      }, []);

      const handleChange = (event) => {
        setCiudades([]);
        console.log("ID numero 1 PAIS: "+ selectedPais)
        const paisId = event.target.value;
        /*setFieldValue('pais_Id', event.target.value);*/
         setSelectedPais(paisId);
      };

      /* PARA LAS PROVINCIASS */    
      useEffect(() => {
        const fetchProvincias = async () => {
          if (selectedPais) {
            setCiudades([]);
            const data = await getProvinciasPorPaises(selectedPais);
            setProvincias(data);
          }
        };
        fetchProvincias();
      }, [selectedPais]);
    
      const handleChanges = (event) => {
        setCiudades([]);
        console.log("ID numero 1 PROVINCIA: "+ selectedProvincia)
        const provinciaId = event.target.value;
        setSelectedProvincia(provinciaId);
      };

      /* PARA LAS CIUDADESSSS */
      useEffect(() => {
        const fetchCiudades = async () => {
          if (selectedProvincia) {
            const data = await getCiudadesPorProvincias(selectedProvincia);
            setCiudades(data);
            console.log("Se selecciono una provincia con ciudad");
          }
          else {
            setCiudades([]);
            console.log("La provincia no tenia ciuadad");
          }
        };
        fetchCiudades();
      }, [selectedProvincia] );
    
      const handleChangess = (event) => {
        const ciudid = event.target.value;
        console.log("ID numero 1: " + ciudades);
        console.log("ID numero 2: "+ ciudid);
        setCity(ciudid);
        console.log("ID NUEVO: "+ city);
        setSelectedCiudad(ciudid);
      };

      useEffect(() => {
        if (selectedCiudad) {
          console.log("ID de ciudad actualizado: " + selectedCiudad);
        }
      }, [selectedCiudad]);

      const salirmodal = () => {
        setCiudades([]);
        setSelectedCiudad(0);
        setPaises([]);
        setSelectedPais("");
        setProvincias([]);
        setSelectedProvincia("");
      };
    
    return (
      <>
  <Toast ref={toast}/>
  <CardBoxModal
    title="Add"
    buttonColor="info"
    buttonLabel="Add"
    isActive={isModalInfoActive}
    onConfirm={handleModalAction}
    onCancel={handleModalAction}
  >
           
    <Formik
      initialValues={{
        alde_Nombre: descripcion,
        ciud_Id: city,
      }}
    validationSchema={validationSchema}
    enableReinitialize
    onSubmit={(values, { setSubmitting }) => {
      Send();
      setSubmitting(false);
    }}
    >
    {({ errors, touched, setFieldValue  })=> (
        <Form className='w-full'>
    <div className="flex justify-between mb-6">

    <div className="flex flex-col mr-4 flex-1"> 
      <label htmlFor="name" className="mb-2">Village</label>
      <Field 
        name="alde_Nombre"
        onChange={(e) => {
          setFieldValue('alde_Nombre', e.target.value);
          setDescripcion(e.target.value);
        }}
        className={`border p-2 ${touched.alde_Nombre && errors.alde_Nombre ? 'border-red-500' : 'border-gray-300'}`}
      />
      {touched.alde_Nombre && errors.alde_Nombre && <div className="text-red-500 text-xs mt-1">{errors.alde_Nombre}</div>}
    </div>

    <div className="flex flex-col mr-3 flex-1">
    <label htmlFor="pais" className="mb-2">Selecciona un País</label>
    <select id="pais" name="pais_Id" value={selectedPais} onChange={ handleChange } className="p-dropdown">
        <option value="0">Seleccione</option>
        {paises.map((pais) => (
          <option key={pais.pais_Id} value={pais.pais_Id} className="p-dropdown-item">{pais.pais_Nombre}</option>
        ))}
      </select>
    </div>
    </div>

    <div className="flex justify-between mb-6">

    <div className="flex flex-col mr-3 flex-1">
    <label htmlFor="pais" className="mb-2">Selecciona un Provincia</label>
    <select id="provincia" value={selectedProvincia} onChange={handleChanges} className="p-dropdown">
        <option value="">Seleccione</option>
        {provincias.map((provincia) => (
          <option key={provincia.pvin_Id} value={provincia.pvin_Id} className="p-dropdown-item">{provincia.pvin_Nombre}</option>
        ))}
      </select>
    </div>

    <div className="flex flex-col mr-3 flex-1">
    <label htmlFor="pais" className="mb-2">Selecciona una Ciudad</label>
    <select id="ciud_Id" name="ciud_Id" value={selectedCiudad} onChange={handleChangess} className="p-dropdown">
        <option value="">Seleccione</option>
        {ciudades.map((ciudad) => (
          <option key={ciudad.ciud_Id} value={ciudad.ciud_Id} className="p-dropdown-item">{ciudad.ciud_Nombre}</option>
        ))}
      </select>
    </div>

  </div>
        
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Add</button>
          <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onChange={salirmodal} onClick={() => setIsModalInfoActive(false)}>Cancel</button>
        </div>
        </Form>
      )}
    </Formik>
  </CardBoxModal>
  
        <Head>
          <title>{getPageTitle('Departamento')}</title>
        </Head>
      {isExpanded && (   
        <SectionMain>
          <SectionTitleLineWithButton icon={mdiCity} title="Aldea" main>
          </SectionTitleLineWithButton>
  
         
  

    <Button color="info" label="Add" icon={mdiPlus} onClick={() => handleModalCreate() } small/>

      <DataTable 
        value={Aldea} 
        loading={loading} 
        responsiveLayout="scroll"
        paginator 
        rows={10}
      >
        <Column field="alde_Id" header="Id" sortable />
        <Column field="alde_Nombre" header="Aldea" sortable />
        <Column field="ciud_Nombre" header="Ciudad" sortable />
        <Column 
         body={rowData => (
          <div className='flex gap-3.5 justify-center'>
            <Button color="info" label="Editar" icon={mdiBorderColor} onClick={() => handleEdit(rowData)} small />
            <Button color="success" label="Detalles" icon={mdiDetails} onClick={() => togglePanel(rowData)} small />
          </div>
        )} />
      </DataTable>
        </SectionMain>
      )}
        {isExpandedDetails && (
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Aldea Details" main>
        </SectionTitleLineWithButton>

    <div className="p-4">
        <table className="w-full ">
          <thead>
            <tr>
            <th className="px-4 py-2 ">Id</th>
              <th className="px-4 py-2 ">Village</th>
              <th className=" px-4 py-2 ">City</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td className=" px-4 py-2 ">{id}</td>
              <td className=" px-4 py-2 ">{descripcion}</td>
              <td className=" px-4 py-2 " >{ciudad}</td>
            </tr>
          </tbody>
        </table>


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
      </div>

      <Button color="info" label="Cancel" icon={mdiAppleKeyboardControl} onClick={() => togglePanelDetails() } small/>
      </SectionMain>
       )}
      </>
    )
}

AldeaPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default AldeaPage
