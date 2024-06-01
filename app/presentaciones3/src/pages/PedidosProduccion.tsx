import {
    mdiPlus,
    mdiTrendingNeutral, 
    mdiClose,
    mdiCheck, 
    mdiEye
} from '@mdi/js'
import LayoutAuthenticated from '../layouts/Authenticated'
import type { ReactElement } from 'react'
import React, { useState, useEffect, useRef } from 'react'; 
import Button from '../components/Button'
import { Card } from 'primereact/card';
import Head from 'next/head'
import { getPageTitle } from '../config'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import { Formik, Form, Field } from 'formik';
import { TabView, TabPanel } from 'primereact/tabview';
import * as Yup from 'yup';
import { getEmpleados, getPedidosOrden, getLotes, getLotesStock, sendPedidosProduccion } from './apiService/data/components/ApiService';
import { PedidosProduccionViewModel } from '../interfaces/PedidoProduccionViewModel';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const PedidosProduccionPage = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [buttonExpanded, setButtonExpanded] = useState(true);
    const [isExpandedDetails, setIsExpandedDetails] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);  // Estado para el TabView
    const toast = useRef(null);
    const [table, setTable] = useState(true);
    const [lote_CodigoLote, setlote_CodigoLote] = useState("");
    const [ppro_Fecha, setppro_Fecha] = useState('');
    const [ppr_Observaciones, setppr_Observaciones] = useState('');
    const [lote_Stock, setlote_Stock] = useState('');
    const [ppde_Cantidad, setppde_Cantidad] = useState('')
    const [DataDDL, setDataDDL] = useState([]);

    const validationSchema = Yup.object().shape({
        ppro_Fecha: Yup.string().required('Date is required'),
        ppr_Observaciones: Yup.string().required('Observations are required'),
        ppde_Cantidad: Yup.string().required('Amount are required'),
    });

    const [empleados, setEmpleados] = useState([]);
    const [selectedEmpleados, setSelectedEmpleados] = useState('');
    const [lotes, setLotes] = useState([]);
    const [selectedLotes, setSelectedLotes] = useState('');

    //#region ENVIAR DATOS A LA API
    const Send = async () => {
        const productData: PedidosProduccionViewModel = {
            ppro_Id: 1,
            empl_Id: parseInt(selectedEmpleados),
            empl_NombreCompleto: "",
            ppro_Fecha: new Date().toISOString(),
            ppro_Estados: "true",
            ppro_Observaciones: ppr_Observaciones.toString(),
            ppro_Finalizado: false,
            usua_UsuarioCreacion:1,
            lote_Id: parseInt(DataDDL[0].lote_Id),
            ppde_Cantidad: parseInt(ppde_Cantidad),
            UsuarioCreacionNombre: "",
            ppro_FechaCreacion: new Date().toISOString(),
            usua_UsuarioModificacion: 1,
            UsuarioModificacionNombre: "",
            ppro_FechaModificacion: new Date().toISOString(),
            ppro_Estado: true,
            detalles:"",
            mensaje: "",
        };
        console.log(productData)
        if(ppde_Cantidad > DataDDL[0].lote_Stock){
            toast.current.show({ severity: 'error', summary: 'Error', detail: `La cantidad debe ser menor o igual al stock`, life: 3000 });
        }

        else if(ppde_Cantidad < DataDDL[0].lote_Stock) 
        {
          try {
            const response = await sendPedidosProduccion(productData);
            console.log("Lo que me retorna es: ")
            console.log(response);
            console.log("El ultimo id es: ")
            console.log(response.data.data.messageStatus)
            if (response.status === 200) {
              console.log('Success:', response.data);
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

      //#endregion

    const togglePanel = () => {
        setIsExpanded(!isExpanded);
        setIsExpandedDetails(!isExpandedDetails);
        setButtonExpanded(false);
        setActiveIndex(0);  // Cambia al segundo TabPanel
        setTable(false);
    };

    const togglePanelDetails = () => {
        setIsExpanded(!isExpanded);
        setIsExpandedDetails(!isExpandedDetails);
        setSelectedEmpleados('');
        setButtonExpanded(true);
        setTable(true);
    };

    const goToNextTab = () => {

        if(ppro_Fecha == '' || ppr_Observaciones == '' || selectedEmpleados == '' || selectedEmpleados == "0")
            {
                console.log("Hola Madian");
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Empty fields are not accepted`, life: 3000 });
            }

        else if(ppro_Fecha != "" && ppr_Observaciones != "" && selectedEmpleados != "" && selectedEmpleados != "0")
            {
                setActiveIndex(1);  // Cambia al segundo TabPanel
            }
    };

    //#region  DDL EMPLEADOS
    useEffect(() => {
        const fetchEmpleados = async () => {
          const data = await getEmpleados();
          setEmpleados(data);
        };
        fetchEmpleados();
      }, []);

      const handleChange = (event) => {
        console.log("ID numero 1 PAIS: "+ selectedEmpleados)
        const paisId = event.target.value;
        /*setFieldValue('pais_Id', event.target.value);*/
        setSelectedEmpleados(paisId);
      };

      useEffect(() => {
        if (selectedEmpleados) {
          console.log("ID de ciudad actualizado: " + selectedEmpleados);
        }
      }, [selectedEmpleados]);
       //#endregion

      //#region  DDL LOTES
      useEffect(() => {
        const fetchLotes = async () => {
          const data = await getLotes();
          setLotes(data);
        };
        fetchLotes();
      }, []);

      const handleChanges = async (event) => {
        const lotesid = event.target.value;
        /*setFieldValue('pais_Id', event.target.value);*/
        const data = await getLotesStock(lotesid);
        setDataDDL(data);
        console.log("La data es: " + data.data);
        console.log("Hola Madian");
        console.log(data);
        console.log("El stock es:")
        console.log(data[0].lote_Stock);
        console.log("El codigo de lote es:")
        setlote_CodigoLote(data[0].lote_CodigoLote)
        setlote_CodigoLote(data[0].lote_CodigoLote)
        setlote_Stock(data[0].lote_Stock)
        setSelectedLotes(lotesid);
      };

      /*useEffect(() => {
     }, [setStock]) */
     useEffect(() => {
    }, [setDataDDL])
      //#endregion

      useEffect(() => {
     }, [setlote_Stock])

     useEffect(() => {
    }, [setlote_CodigoLote])

      useEffect(() => {
        if (selectedEmpleados) {
          console.log("ID de ciudad actualizado: " + selectedEmpleados);
        }
      }, [selectedEmpleados]);


      const [PedidosOrden, setPedidosOrden] = useState([]);
      const [loading, setLoading] = useState(false);

      const fetchPedidosOrden= async () => {
        setLoading(true);
        try {
          const data = await getPedidosOrden();
          setPedidosOrden(data);
          setLoading(false);
        } catch (error) {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
          setLoading(false);
        }
      };
  
      useEffect(() => {
        fetchPedidosOrden();
      }, []);

      const holamundo = (rowData) =>{
            console.log(rowData);
      }

    return (
        <>
        <Toast ref={toast} />
            <Head>
                <title>{getPageTitle('Pedidos Produccion')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton icon={mdiTrendingNeutral} title="Pedidos de Produccion" main>
                </SectionTitleLineWithButton>
                {buttonExpanded && (
                    <Button color="info" label="Add" icon={mdiPlus} onClick={() => togglePanel()} />
                )}

                    {table && (
                    <DataTable 
                    value={PedidosOrden} 
                    loading={loading} 
                    responsiveLayout="scroll"
                    paginator 
                    rows={10}
                    >
                    <Column field="peor_Id" header="Id" sortable />
                    <Column field="peor_Codigo" header="Codigo" sortable />
                    <Column field="peor_Impuestos" header="Impuesto" sortable />
                    <Column field="peor_DireccionExacta" header="Direccion" sortable />
                    <Column 
                    body={rowData => (
                    <div className='flex gap-3.5 justify-center'>
                        <Button color="info" label="Editar" icon={mdiEye} onClick={() => holamundo(rowData)} small />
                        <Button color="info" label="Detalles" icon={mdiEye} small />
                    </div>
                    )} />
                    </DataTable>
                    )}
            </SectionMain>

            {isExpandedDetails && (
                <div className="" style={{ marginLeft: '2.0em', marginRight: '2.0em' }}>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>

                <TabPanel header={<div style={{ textAlign: 'center', width: '100%' }}>Header I</div>} disabled={activeIndex !== 0}>
                            <Card className="md:w-25rem">
                                <SectionMain>
                                    <Formik
                                        initialValues={{ 
                                            ppro_Fecha: ppro_Fecha, 
                                            ppr_Observaciones: ppr_Observaciones
                                            }}
                                        validationSchema={validationSchema}
                                        enableReinitialize
                                        onSubmit={(values, { setSubmitting }) => {
                                            Send();
                                            setSubmitting(false);
                                        }}
                                    >
                                        {({ errors, touched, setFieldValue }) => (
                                            <Form className='w-full'>
                                                <div className="flex justify-between mb-6">
                                                    <div className="flex flex-col mr-4 flex-1">
                                                        <label htmlFor="name" className="mb-2">Creation date </label>
                                                        <Field
                                                            name="ppro_Fecha"
                                                            onChange={(e) => {
                                                                setFieldValue('ppro_Fecha', e.target.value);
                                                                setppro_Fecha(e.target.value);
                                                            }}
                                                            className={`border p-2 ${touched.ppro_Fecha && errors.ppro_Fecha ? 'border-red-500' : 'border-gray-300'}`}
                                                            type="Date"
                                                        />
                                                        {touched.ppro_Fecha && errors.ppro_Fecha && <div className="text-red-500 text-xs mt-1">{errors.ppro_Fecha}</div>}
                                                    </div>

                                                    <div className="flex flex-col mr-3 flex-1">
                                                    <label htmlFor="empleado" className="mb-2">Select an employee</label>
                                                    <select id="empleado" name="empl_Id" value={selectedEmpleados} onChange={ handleChange } className="p-dropdown">
                                                        <option value="0">Seleccione</option>
                                                        {empleados.map((empleado) => (
                                                        <option key={empleado.empl_Id} value={empleado.empl_Id} className="p-dropdown-item">{empleado.empl_Nombres + ' '+ empleado.empl_Apellidos}</option>
                                                        ))}
                                                    </select>
                                                    </div>

                                                </div>

                                                <div className="flex justify-between mb-6">
                                                    <div className="flex flex-col mr-4 flex-1">
                                                        <label htmlFor="name" className="mb-2">Observations</label>
                                                        <Field
                                                            name="ppr_Observaciones"
                                                            onChange={(e) => {
                                                                setFieldValue('alde_Nombre', e.target.value);
                                                                setppr_Observaciones(e.target.value);
                                                            }}
                                                            className={`border p-2 ${touched.ppr_Observaciones && errors.ppr_Observaciones ? 'border-red-500' : 'border-gray-300'}`}
                                                        />
                                                        {touched.ppr_Observaciones && errors.ppr_Observaciones && <div className="text-red-500 text-xs mt-1">{errors.ppr_Observaciones}</div>}
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                    <div className='botones'>
                                        <Button color="danger" label="Cancel" icon={mdiClose} onClick={() => togglePanelDetails()} small />
                                        <Button color="success" label="Next " icon={mdiCheck} onClick={goToNextTab} small />
                                    </div>
                                    <style jsx>{`
                                        .botones {
                                            display: flex;
                                            gap: 5px;
                                        }    
                                    `}
                                    </style>
                                </SectionMain>
                            </Card>
                        </TabPanel>
                        <TabPanel header={<div style={{ textAlign: 'center', width: '100%' }}>Header II</div>} disabled={activeIndex !== 1}>
                            <Card className="md:w-25rem">
                                <SectionMain>
                                    <Formik
                                        initialValues={{ 
                                            lote_CodigoLote: lote_CodigoLote, 
                                            lote_Stock: lote_Stock, 
                                            ppde_Cantidad: ppde_Cantidad
                                            }}
                                        validationSchema={validationSchema}
                                        enableReinitialize
                                        onSubmit={(values, { setSubmitting }) => {
                                            Send();
                                            setSubmitting(false);
                                        }}
                                    >
                                        {({ errors, touched, setFieldValue }) => (
                                            <Form className='w-full'>
                                                <div className="flex justify-between mb-6">
                                                    <div className="flex flex-col mr-4 flex-1">
                                                        <label htmlFor="name" className="mb-2">Batch Code</label>
                                                        <Field
                                                            name="lote_CodigoLote"
                                                            onChange={(e) => {
                                                                setlote_CodigoLote(e.target.value);
                                                            }}
                                                            className={`border p-2  border-gray-300`}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mr-4 flex-1">
                                                        <label htmlFor="name" className="mb-2">Stock</label>
                                                        <Field
                                                            name="lote_Stock"
                                                            onChange={(e) => {
                                                                setlote_Stock(e.target.value);
                                                            }}
                                                            disabled="true"
                                                            className={`border p-2  border-gray-300`}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mr-3 flex-1">
                                                    <label htmlFor="lote" className="mb-2">Select an bacth</label>
                                                    <select id="lote" name="lote_Id" value={selectedLotes} onChange={ handleChanges } className="p-dropdown `border p-2  border-gray-300`">
                                                        <option value="0">Seleccione</option>
                                                        {lotes.map((lotes) => (
                                                        <option key={lotes.lote_CodigoLote} value={lotes.lote_CodigoLote} className="p-dropdown-item">{lotes.mate_Descripcion +', '+ lotes.prov_NombreCompania}</option>
                                                        ))}
                                                    </select>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mb-6">
                                                    <div className="flex flex-col mr-4 flex-1">
                                                        <label htmlFor="name" className="mb-2">Amount</label>
                                                        <Field
                                                            name="ppde_Cantidad"
                                                            onChange={(e) => {
                                                                setFieldValue('ppde_Cantidad', e.target.value);
                                                                setppde_Cantidad(e.target.value);
                                                            }}
                                                            className={`border p-2 ${touched.ppde_Cantidad && errors.ppde_Cantidad ? 'border-red-500' : 'border-gray-300'}`}
                                                        />
                                                        {touched.ppde_Cantidad && errors.ppde_Cantidad && <div className="text-red-500 text-xs mt-1">{errors.ppde_Cantidad}</div>}
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                    <div className='botones'>
                                        <Button color="success" label="Okey " icon={mdiCheck} onClick={() => Send()} small />
                                    </div>
                                    <style jsx>{`
                                        .botones {
                                            display: flex;
                                            gap: 5px;
                                        }    
                                    `}
                                    </style>
                                </SectionMain>
                            </Card>
                        </TabPanel>
                    </TabView>
                </div>
            )}
        </>
    )
}

PedidosProduccionPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default PedidosProduccionPage
