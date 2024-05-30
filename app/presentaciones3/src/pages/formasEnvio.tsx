import {
  mdiChartTimelineVariant,
} from '@mdi/js'
import { Formik, Form, Field, } from 'formik';

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
import { getFormasEnvio, sendDeleteFormasEnvio, sendEditFormasEnvio, sendFormasEnvio } from './apiService/data/components/ApiService';
import { FormasEnvioViewModel } from '../interfaces/FormasEnvioViewModel';
    
const FormasPage = () => {
  //IziToast y Modales
  const [elect, EditOrCreate] = useState('');
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalDelete, setisModalDeleteActive] = useState(false);
  const [isCollapse, setCollapse] = useState(false);
  const toast = useRef<Toast>(null);
  const handleModalAction = () => {
   
    setIsModalInfoActive(false);
  }

  const handleModalCreate = () => {
    EditOrCreate("Create")
    setId("1")
    setCodigo("");
    setDescripcion("");
    setIsModalInfoActive(true);
  }
  //Validador
  const validationSchema = Yup.object().shape({
    foen_Codigo: Yup.string().required('Codigo is requerid').matches(/^[A-Za-z\s]+$/, 'Name should contain only letters and spaces.').test('len', 'Must be exactly 2 characters', val => val.length  == 2),
    foen_Descripcion: Yup.string().required('Descripcion is requerid')
  });
  //Inicializar Variables
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [id, setId] = useState('');
  const [UsuarioCreacion, setUsuarioCreacion] = useState('');
  const [FechaCreacion, setFechaCreacion] = useState('');
  const [UsuarioModificacion, setUsuarioModificacion] = useState('');
  const [FechaModificacion, setFechaModificacion] = useState('');
  //Envio
  const Send = async () => {
    const productData: FormasEnvioViewModel = {
      foen_Id:parseFloat(id),
      foen_Codigo: codigo,
      foen_Descripcion: descripcion,
      usua_UsuarioCreacion: 1,
      foen_FechaCreacion: new Date().toISOString(),
      usua_UsuarioModificacion: 1,
      foen_FechaModificacion: new Date().toISOString(),
      usua_UsuarioEliminacion: 1,
      foen_FechaEliminacion: new Date().toISOString(),
    };
    console.log(productData)
    if (elect == "Create") {
      try {
        const response = await sendFormasEnvio(productData);
        if (response.status === 200) {
          console.log('Success:', response.data);
          setIsModalInfoActive(false);
          fetchFormasEnvio(); 
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
        const response = await sendEditFormasEnvio(productData);
        if (response.status === 200) {
          console.log('Success:', response.data);
          setIsModalInfoActive(false);
          fetchFormasEnvio(); 
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
  const [formasEnvio, setFormasEnvio] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const fetchFormasEnvio = async () => {
    setLoading(true);
    try {
      const data = await getFormasEnvio();
      setFormasEnvio(data);
      setLoading(false);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormasEnvio();
  }, []);
  //HTML

  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpandedDetails, setIsExpandedDetails] = useState(false);
  
  const togglePanel = (formaEnvio) => {
    console.log(formaEnvio);
    setIsExpanded(!isExpanded);
    setId(formaEnvio.foen_Id)
    setCodigo(formaEnvio.foen_Codigo);
    setDescripcion(formaEnvio.foen_Descripcion);
    setUsuarioCreacion(formaEnvio.usuarioCreacionNombre);
    setFechaCreacion(formaEnvio.foen_FechaCreacion);
    setUsuarioModificacion(formaEnvio.usuarioModificacionNombre);
    setFechaModificacion(formaEnvio.foen_FechaModificacion);
    setIsExpandedDetails(!isExpandedDetails);
  };

  const togglePanelDetails = () => {
    setIsExpanded(!isExpanded);
    setId("")
    setCodigo("");
    setDescripcion("");
    setUsuarioCreacion("");
    setFechaCreacion("");
    setUsuarioModificacion("");
    setFechaModificacion("");
    setIsExpandedDetails(!isExpandedDetails);
  };

  const handleEdit = (formaEnvio) => {
    EditOrCreate("Edit")
    console.log(formaEnvio)
    setId(formaEnvio.foen_Id)
    setCodigo(formaEnvio.foen_Codigo);
    setDescripcion(formaEnvio.foen_Descripcion);
    setIsModalInfoActive(true);
  };

  const handleDelete = (formaEnvio) => {
    setId(formaEnvio.foen_Id)
    setCodigo(formaEnvio.foen_Codigo);
    setDescripcion(formaEnvio.foen_Descripcion);
    setisModalDeleteActive(true);
  };
  const Delete = async () => {
    const productData: FormasEnvioViewModel = {
      foen_Id:parseFloat(id),
      foen_Codigo: codigo,
      foen_Descripcion: descripcion,
      usua_UsuarioCreacion: 1, // Valor predeterminado
      foen_FechaCreacion: new Date().toISOString(),
      usua_UsuarioModificacion: 1,
      foen_FechaModificacion: new Date().toISOString(),
      usua_UsuarioEliminacion: 1,
      foen_FechaEliminacion: new Date().toISOString(),
    };
    console.log(productData)

      try {
        const response = await sendDeleteFormasEnvio(productData);
        if (response.status === 200) {
          console.log('Success:', response.data);
          setisModalDeleteActive(false);
          fetchFormasEnvio(); 
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
      foen_Codigo: codigo,
      foen_Descripcion: descripcion,
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
    <label htmlFor="name" className="mb-2">Code</label>
    <Field 
      name="foen_Codigo"
      onChange={(e) => {
        setFieldValue('foen_Codigo', e.target.value);
        setCodigo(e.target.value);
      }}
      className={`border p-2 ${touched.foen_Codigo && errors.foen_Codigo ? 'border-red-500' : 'border-gray-300'}`}
    />
    {touched.foen_Codigo && errors.foen_Codigo && <div className="text-red-500 text-xs mt-1">{errors.foen_Codigo}</div>}
  </div>
  <div className="flex flex-col flex-1">
    <label htmlFor="year" className="mb-2">Description</label>
    <Field 
      name="foen_Descripcion" 
      onChange={(e) => {
        setFieldValue('foen_Descripcion', e.target.value);
        setDescripcion(e.target.value);
      }}
      className={`border p-2 ${touched.foen_Descripcion && errors.foen_Descripcion ? 'border-red-500' : 'border-gray-300'}`}
    />
    {touched.foen_Descripcion && errors.foen_Descripcion && <div className="text-red-500 text-xs mt-1">{errors.foen_Descripcion}</div>}
  </div>
</div>




      
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Add</button>
        <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsModalInfoActive(false)}>Cancel</button>
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
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Formas Envio" main>
        </SectionTitleLineWithButton>

       

  <Button color="info" label="Add" icon={mdiEye} onClick={() => handleModalCreate() } small/>

    <DataTable 
      value={formasEnvio} 
      loading={loading} 
      responsiveLayout="scroll"
      paginator 
      rows={10}
    >
      <Column field="foen_Id" header="Id" sortable />
      <Column field="foen_Codigo" header="Code" sortable />
      <Column field="foen_Descripcion" header="Description" sortable />
      <Column 
       body={rowData => (
        <div className='flex gap-3.5 justify-center'>
          <Button color="info" label="Editar" icon={mdiEye} onClick={() => handleEdit(rowData)} small />
          <Button color="info" label="Detalles" icon={mdiEye} onClick={() => togglePanel(rowData)} small />
          <Button color="info" label="Eliminar" icon={mdiEye} onClick={() => handleDelete(rowData)} small />
        </div>
      )} />
    </DataTable>

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
       )}
            {isExpandedDetails && (
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Formas Envio" main>
        </SectionTitleLineWithButton>

       




    <div className="p-4">
        <table className="w-full ">
          <thead>
            <tr>
            <th className="px-4 py-2 ">Id</th>
              <th className="px-4 py-2 ">Code</th>
              <th className=" px-4 py-2 ">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td className=" px-4 py-2 ">{id}</td>
              <td className=" px-4 py-2 ">{codigo}</td>
              <td className=" px-4 py-2 " >{descripcion}</td>
            </tr>
          </tbody>
        </table>


            <h2>Auditoria</h2>
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

      <Button color="info" label="Cancel" icon={mdiEye} onClick={() => togglePanelDetails() } small/>
      </SectionMain>
       )}
    </>


    
  )
}

FormasPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default FormasPage
