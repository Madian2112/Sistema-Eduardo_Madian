import {
  mdiPlus,
  mdiEye, 
  mdiCity
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
import { getAldea, sendDeleteAldea, sendEditAldea, sendAldea, getPaises, getProvinciasPorPaises, getCiudadesPorProvincias } from './apiService/data/components/ApiService';
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
    const [isModalDelete, setisModalDeleteActive] = useState(false);
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
    const [city, setCity] = useState("");
    //Envio
    const Send = async () => {
      const productData: Aldea = {
        alde_Estado: true, 
        alde_FechaCreacion: new Date().toISOString(),
        alde_FechaEliminacion: new Date().toISOString(),
        alde_FechaModificacion: new Date().toISOString(),
        alde_Id: 0, 
        alde_Nombre: descripcion, 
        ciud_Id: selectedCiudad, 
        ciud_Nombre: "", 
        pvin_Codigo: "", 
        pvin_Id: 0, 
        pvin_Nombre: "", 
        usua_UsuarioCreacion: 1, 
        usua_UsuarioEliminacion: 1, 
        usua_UsuarioModificacion: 1, 
        usuarioCreacionNombre: "", 
        usuarioModificacionNombre: ""
      };
      console.log("El id de la ciudad es: " + selectedCiudad)
      console.log("La data que se agrega al view model es: "+productData)
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
      setDescripcion(formaEnvio.alde_Nombre);
      setSelectedCiudad(formaEnvio.ciud_Id)
      setSelectedProvincia(formaEnvio.pvin_Id)
      setIsModalInfoActive(true);
    };

    /*const handleDelete = (formaEnvio) => {
      setDescripcion(formaEnvio.foen_Descripcion);
      setisModalDeleteActive(true);
    }; */

    const Delete = async () => {
      const productData: Aldea = {
        alde_Estado: true, 
        alde_FechaCreacion: new Date().toISOString(),
        alde_FechaEliminacion: new Date().toISOString(),
        alde_FechaModificacion: new Date().toISOString(),
        alde_Id: 0, 
        alde_Nombre: descripcion, 
        ciud_Id: selectedCiudad, 
        ciud_Nombre: "", 
        pvin_Codigo: "", 
        pvin_Id: 0, 
        pvin_Nombre: "", 
        usua_UsuarioCreacion: 1, 
        usua_UsuarioEliminacion: 1, 
        usua_UsuarioModificacion: 1, 
        usuarioCreacionNombre: "", 
        usuarioModificacionNombre: ""
      };
      console.log(productData)

        try {
          const response = await sendDeleteAldea(productData);
          if (response.status === 200) {
            console.log('Success:', response.data);
            setisModalDeleteActive(false);
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

 
    };

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
        <Column field="ciud_Id" header="Ciudad ID" sortable />
        <Column field="ciud_Nombre" header="Ciudad" sortable />
        <Column field="pvin_Id" header="Provincia ID" sortable />
        <Column 
         body={rowData => (
          <div className='flex gap-3.5 justify-center'>
            <Button color="info" label="Editar" icon={mdiEye} onClick={() => handleEdit(rowData)} small />
            <Button color="info" label="Detalles" icon={mdiEye} onClick={() => handleEdit(rowData)} small />
          </div>
        )} />
      </DataTable>
      <div className="p-4">
          <table className="w-full mb-6 text-center">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center">Code</th>
                <th className=" px-4 py-2 text-center">Description</th>
                <th className=" px-4 py-2 text-center">Creation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className=" px-4 py-2 text-center">12</td>
                <td className=" px-4 py-2 text-center" >Con</td>
                <td className=" px-4 py-2 text-center">{new Date().toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

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
                <td className="border px-4 py-2">Edit</td>
                <td className="border px-4 py-2">Admin</td>
                <td className="border px-4 py-2">{new Date().toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

    <CardBoxModal
    title="Delete"
    buttonColor="info"
    buttonLabel="Add"
    isActive={isModalDelete}
    onConfirm={handleModalAction}
    onCancel={handleModalAction}
  >

<div className="text-center mb-4">
          <p>Are you sure you want to delete?</p>
        </div>
        <div className="flex justify-center gap-4">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={Delete}>Yes</button>
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => setisModalDeleteActive(false)}>No</button>
        </div>
  </CardBoxModal>
        </SectionMain>
      </>
    )
}

AldeaPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default AldeaPage
