import {
  mdiChartTimelineVariant,
} from '@mdi/js'
import { Formik, Form, Field,} from 'formik';
import Head from 'next/head'
import React, { useState, useRef, useEffect } from 'react'
import type { ReactElement } from 'react'
import Button from '../components/Button'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import axios from 'axios';
import { getPageTitle } from '../config'
import { Toast } from 'primereact/toast';
import { mdiEye, } from '@mdi/js'
import CardBoxModal from '../components/CardBox/Modal'
import * as Yup from 'yup';
import { ProductViewModel } from '../interfaces/telefonoViewModel'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getEcoTasa, getFormasEnvio, sendDeleteEcoTasa, sendDeleteFormasEnvio, sendEcoTasaEdit, sendEcoTasaEnvio, sendEditFormasEnvio, sendFormasEnvio } from './apiService/data/components/ApiService';
import { FormasEnvioViewModel } from '../interfaces/FormasEnvioViewModel';
import { EcoTasaEnvioViewModel } from '../interfaces/EcoTasaViewModel';

const EcoTasaPage = () => {
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
       setRangoInicial("");
       setRangoFinal("");
       setPagar("")
       setIsModalInfoActive(true);
     }
     //Validador
     const validationSchema = Yup.object().shape({
      ecot_RangoIncial: Yup.number().required('Start Range is requerid').test('len', 'It should be bigger', val => val < parseFloat(RangoFinal)),
      ecot_RangoFinal: Yup.number().required('End Range is requerid'),
      ecot_CantidadPagar: Yup.number().required('Cantidad Pagar is requerid')
     });
     //Inicializar Variables
     const [RangoInicial, setRangoInicial] = useState('');
     const [RangoFinal, setRangoFinal] = useState('');
     const [Pagar, setPagar] = useState('');
     const [id, setId] = useState('');
     const [UsuarioCreacion, setUsuarioCreacion] = useState('');
     const [FechaCreacion, setFechaCreacion] = useState('');
     const [UsuarioModificacion, setUsuarioModificacion] = useState('');
     const [FechaModificacion, setFechaModificacion] = useState('');
     //Envio
     const Send = async () => {
       const productData: EcoTasaEnvioViewModel = {
        ecot_Id:parseFloat(id),
        ecot_RangoIncial: RangoInicial,
        ecot_RangoFinal: RangoFinal,
        ecot_CantidadPagar: Pagar,
        usua_UsuarioCreacion: 1,
        ecot_FechaCreacion:  new Date().toISOString(),
        usua_UsuarioModificacion:1,
        ecot_FechaModificacion: new Date().toISOString(),
       };
       console.log(productData)
       if (elect == "Create") {
         try {
           const response = await sendEcoTasaEnvio(productData);
           if (response.status === 200) {
             console.log('Success:', response.data);
             setIsModalInfoActive(false);
             GetEcoTasa(); 
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
           const response = await sendEcoTasaEdit(productData);
           if (response.status === 200) {
             console.log('Success:', response.data);
             setIsModalInfoActive(false);
             GetEcoTasa(); 
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
     const [formasEcoTasa, setformasEcoTasa] = useState([]);
     const [loading, setLoading] = useState(false);
     
 
     const GetEcoTasa = async () => {
       setLoading(true);
       try {
         const data = await getEcoTasa();
         setformasEcoTasa(data);
         setLoading(false);
       } catch (error) {
         toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
         setLoading(false);
       }
     };
 
     useEffect(() => {
      GetEcoTasa();
     }, []);
     //HTML
 
     const [isExpanded, setIsExpanded] = useState(true);
     const [isExpandedDetails, setIsExpandedDetails] = useState(false);
     const togglePanel = (EcoEnvio) => {
       console.log(EcoEnvio);
       setIsExpanded(!isExpanded);
       setId(EcoEnvio.ecot_Id)
       setRangoInicial(EcoEnvio.ecot_RangoIncial);
       setRangoFinal(EcoEnvio.ecot_RangoFinal);
       setPagar(EcoEnvio.ecot_CantidadPagar)
       setUsuarioCreacion(EcoEnvio.usua_UsuarioCreacionNombre);
       setFechaCreacion(EcoEnvio.ecot_FechaCreacion);
       setUsuarioModificacion(EcoEnvio.usua_UsuarioModificacionNombre);
       setFechaModificacion(EcoEnvio.ecot_FechaModificacion);
       setIsExpandedDetails(!isExpandedDetails);
     };
 
     const togglePanelDetails = () => {
       setIsExpanded(!isExpanded);
       setId("");
       setRangoInicial("");
       setRangoFinal("");
       setPagar("");
       setUsuarioCreacion("");
       setFechaCreacion("");
       setUsuarioModificacion("");
       setFechaModificacion("");
       setIsExpandedDetails(!isExpandedDetails);
     };
 
     const handleEdit = (EcoEnvio) => {
       EditOrCreate("Edit")
       console.log(EcoEnvio)
       setId(EcoEnvio.ecot_Id)
       setRangoInicial(EcoEnvio.ecot_RangoIncial);
       setRangoFinal(EcoEnvio.ecot_RangoFinal);
       setPagar(EcoEnvio.ecot_CantidadPagar)
       setIsModalInfoActive(true);
     };
 
     const handleDelete = (EcoEnvio) => {
      setId(EcoEnvio.ecot_Id)
      setRangoInicial(EcoEnvio.ecot_RangoIncial);
      setRangoFinal(EcoEnvio.ecot_RangoFinal);
      setPagar(EcoEnvio.ecot_CantidadPagar)
       setisModalDeleteActive(true);
     };
     const Delete = async () => {
      const productData: EcoTasaEnvioViewModel = {
        ecot_Id:parseFloat(id),
        ecot_RangoIncial: RangoInicial,
        ecot_RangoFinal: RangoFinal,
        ecot_CantidadPagar: Pagar,
        usua_UsuarioCreacion: 1,
        ecot_FechaCreacion:  new Date().toISOString(),
        usua_UsuarioModificacion:1,
        ecot_FechaModificacion: new Date().toISOString(),
       };
       console.log(productData)
 
         try {
           const response = await sendDeleteEcoTasa(productData);
           if (response.status === 200) {
             console.log('Success:', response.data);
             setisModalDeleteActive(false);
             GetEcoTasa(); 
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
        ecot_RangoIncial: RangoInicial,
        ecot_RangoFinal: RangoFinal,
        ecot_CantidadPagar: Pagar
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
       <label htmlFor="name" className="mb-2">Rango Inicial</label>
       <Field 
         name="ecot_RangoIncial"
         onChange={(e) => {
           setFieldValue('ecot_RangoIncial', e.target.value);
           setRangoInicial(e.target.value);
         }}
         className={`border p-2 ${touched.ecot_RangoIncial && errors.ecot_RangoIncial ? 'border-red-500' : 'border-gray-300'}`}
       />
       {touched.ecot_RangoIncial && errors.ecot_RangoIncial && <div className="text-red-500 text-xs mt-1">{errors.ecot_RangoIncial}</div>}
     </div>
     <div className="flex flex-col flex-1">
       <label htmlFor="year" className="mb-2">Rango Final</label>
       <Field 
         name="ecot_RangoFinal" 
         onChange={(e) => {
           setFieldValue('ecot_RangoFinal', e.target.value);
           setRangoFinal(e.target.value);
         }}
         className={`border p-2 ${touched.ecot_RangoFinal && errors.ecot_RangoFinal ? 'border-red-500' : 'border-gray-300'}`}
       />
       {touched.ecot_RangoFinal && errors.ecot_RangoFinal && <div className="text-red-500 text-xs mt-1">{errors.ecot_RangoFinal}</div>}
     </div>
   </div>
   <div className="flex justify-between mb-6">
     <div className="flex flex-col mr-4 flex-1"> 
       <label htmlFor="name" className="mb-2">Cantidad Pagar</label>
       <Field 
         name="ecot_CantidadPagar"
         onChange={(e) => {
           setFieldValue('ecot_CantidadPagar', e.target.value);
           setPagar(e.target.value);
         }}
         className={`border p-2 ${touched.ecot_CantidadPagar && errors.ecot_CantidadPagar ? 'border-red-500' : 'border-gray-300'}`}
       />
       {touched.ecot_CantidadPagar && errors.ecot_CantidadPagar && <div className="text-red-500 text-xs mt-1">{errors.ecot_CantidadPagar}</div>}
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
           <title>{getPageTitle('Eco Tasa')}</title>
         </Head>
         
         {isExpanded && (
         <SectionMain>
           <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Eco Tasa" main>
           </SectionTitleLineWithButton>
   
          
   
     <Button color="info" label="Add" icon={mdiEye} onClick={() => handleModalCreate() } small/>
 
       <DataTable 
         value={formasEcoTasa} 
         loading={loading} 
         responsiveLayout="scroll"
         paginator 
         rows={10}
       >
         <Column field="ecot_Id" header="Id" sortable />
         <Column field="ecot_RangoIncial" header="Rango Inicial" sortable />
         <Column field="ecot_RangoFinal" header="Rango Final" sortable />
         <Column field="ecot_CantidadPagar" header="Pagar" sortable />
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
                 <th className="px-4 py-2 ">Rango Inicial</th>
                 <th className=" px-4 py-2 ">Rango Final</th>
                 <th className=" px-4 py-2 ">Cantidad Pagar</th>
               </tr>
             </thead>
             <tbody>
               <tr>
               <td className=" px-4 py-2 ">{RangoInicial}</td>
                 <td className=" px-4 py-2 ">{RangoFinal}</td>
                 <td className=" px-4 py-2 " >{Pagar}</td>
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

EcoTasaPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EcoTasaPage
