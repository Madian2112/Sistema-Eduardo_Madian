import {
    mdiPlus,
    mdiTrendingNeutral, 
    mdiClose,
    mdiCheck, 
    mdiEye,
    mdiCancel
/*    mdiConsoleNetworkOutline*/
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
import { getEmpleados, getPedidosProduccion, getLotes, getLotesStock, sendPedidosProduccion, sendPedidosProduccionDetalle, getPedidosProduccionDetalle, editPedidosProduccionDetalle } from './apiService/data/components/ApiService';
import { PedidosProduccionViewModel } from '../interfaces/PedidoProduccionViewModel';
import { PedidosProduccionDetalleViewModel } from '../interfaces/PedidosProduccionDetalleViewModel';
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
    const [ppro_Id, setppro_Id] = useState(0);
    const [tableppd, settableppd ] = useState(false);
    const [labelButton, setLabelButton] = useState("Save")
    const [saber, setSaber] = useState(1);
    const [ppde_Id, setppde_Id] = useState(1);
    const [CantidadValor, setCantidadValor] = useState('');
    const [CodigoLoteValor, setCodigoLoteValor] = useState('');
    const [isDetails, setIsDetails] = useState(false);
    const [Empleados, setEmpleadoss] = useState('');
    const [Observaciones, setObservaciones] = useState('');
    const [FechaCreacion, setFechaCreacion] = useState('');
    const [UsuarioCreacion, setUsuarioCreacion] = useState('');
    const [FechaModificacion, setFechaModificacion] = useState('');
    const [UsuarioModificacion, setUsuarioModificacion] = useState('');
    const [ID, setID] = useState('');
    const [LabelDetails, setLabelDetails] = useState('Pedidos Produccion');

    const validationSchema = Yup.object().shape({
        ppro_Fecha: Yup.string().required('Date is required'),
        ppr_Observaciones: Yup.string().required('Observations are required'),
        ppde_Cantidad: Yup.string().required('Amount are required'),
    });

    const [empleados, setEmpleados] = useState([]);
    const [selectedEmpleados, setSelectedEmpleados] = useState("");
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
            lote_Id: DataDDL[0].lote_Id,
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

        const ppDetalle: PedidosProduccionDetalleViewModel = {
            ppde_Id: ppde_Id,
            ppro_Id:  ppro_Id, 
            lote_Id: DataDDL[0].lote_Id,
            lote_Stock: lote_Stock.toString(), 
            lote_CodigoLote: "hola",
            ppde_Cantidad: parseInt(ppde_Cantidad),
            mate_Id: 1,
            mate_Descripcion: "hola", 
            colr_Codigo: "hola", 
            colr_Nombre: "hola", 
            tipa_Id: 1, 
            tipa_area: "hola", 
            ppro_Estados: "hola", 
            usua_UsuarioCreacion: 1, 
            usuarioCreacionNombre: "hola", 
            ppde_FechaCreacion: new Date().toISOString(), 
            usua_UsuarioModificacion: 1, 
            ppde_FechaModificacion: new Date().toISOString(), 
            usuarioModificacionNombre: "hola",
            ppde_Estado: true,
        }

        console.log(productData)

        if(ppde_Cantidad == '' || selectedLotes == '' || selectedLotes == "0" || lote_CodigoLote == '' || lote_Stock == '' )
        {
            toast.current.show({ severity: 'error', summary: 'Error', detail: `No se aceptan campos vacios`, life: 3000 });   
        }

        else if(ppde_Cantidad != '' && selectedLotes != '' && selectedLotes != "0" && lote_CodigoLote != '' && lote_Stock != '' )
        {
            if(ppde_Cantidad > DataDDL[0].lote_Stock){
                toast.current.show({ severity: 'error', summary: 'Error', detail: `La cantidad debe ser menor o igual al stock`, life: 3000 });
            }
    
            else if(ppde_Cantidad <= DataDDL[0].lote_Stock) 
            {
                if(saber ==  1)
                {
                        if(ppro_Id == 0)
                        {
                            try {
                                const response = await sendPedidosProduccion(productData);
                                console.log(response.data.data.messageStatus);
                                ppDetalle.ppro_Id = parseInt(response.data.data.messageStatus);
                                setppro_Id(response.data.data.messageStatus)
                                console.log("El id es: " +  ppDetalle.ppro_Id)
                                console.log("Los datos de ppDetall es: ");
                                console.log(ppDetalle);
        
                                const responses = await sendPedidosProduccionDetalle(ppDetalle);
        
                                fetchPedidosProduccionDetalles(response.data.data.messageStatus);
                                settableppd(true);

                                if (response.status === 200 && responses.status === 200) {
                                    setppde_Cantidad('');
                                    setSelectedLotes("0");
                                    setlote_Stock('');
                                    setlote_CodigoLote('')
        
                                  console.log('Success:', response.data);
                                  toast.current?.show({ severity: 'success', summary: 'Success', detail: `Formas envio added successfully`, life: 3000 });
                                } else {
                                  console.error('Error:', response.statusText);
                                  toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
                                }
                              } catch (error) {
                                console.error('Error:', error);
                                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Entro al catch 1', life: 3000 });
                              }
                        }
        
                        else if(ppro_Id != 0)
                        {
                            try {
                                console.log("Hola hola")
                                console.log("El id de ppro es:")
                                console.log(ppro_Id);
                                ppDetalle.ppro_Id = ppro_Id;
                                console.log(ppDetalle);
                                const response = await sendPedidosProduccionDetalle(ppDetalle);
                                fetchPedidosProduccionDetalles(ppro_Id);
                                settableppd(true);
                                if (response.status === 200) {
                                    setppde_Cantidad('');
                                    setSelectedLotes("0");
                                    setlote_Stock('');
                                    setlote_CodigoLote('')
                                  console.log('Success:', response.data);
                                  toast.current?.show({ severity: 'success', summary: 'Success', detail: `Formas envio added successfully`, life: 3000 });
                                } else {
                                  console.error('Error:', response.statusText);
                                  toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
                                }
                              } catch (error) {
                                console.error('Error:', error);
                                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Entro al catch 2', life: 3000 });
                              }
                        }   
                }

                 else if(saber ==  2)
                {
                    try {
                        ppDetalle.ppro_Id = ppro_Id;
                        if(lote_CodigoLote == CodigoLoteValor) 
                        {
                            ppDetalle.ppde_Cantidad = parseInt(ppde_Cantidad) + parseInt(CantidadValor);
                        }
                        const response = await editPedidosProduccionDetalle(ppDetalle);
                        setSaber(1);
                        setLabelButton("Save")
                        fetchPedidosProduccionDetalles(ppro_Id);
                        settableppd(true);
                        if (response.status === 200) {
                            setppde_Cantidad('');
                            setSelectedLotes("0");
                            setlote_Stock('');
                            setlote_CodigoLote('')
                          console.log('Success:', response.data);
                          toast.current?.show({ severity: 'success', summary: 'Success', detail: `Edit pedidos produccion successfully`, life: 3000 });
                        } else {
                          console.error('Error:', response.statusText);
                          toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
                        }
                      } catch (error) {
                        console.error('Error:', error);
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Entro al catch 2', life: 3000 });
                      } 
                }
            }
        }
      }

    useEffect(() => {
    }, [setSaber]);

    useEffect(() => {
    }, [setLabelButton]);

      useEffect(() => {
    }, [setppde_Cantidad]);

    useEffect(() => {
    }, [setSelectedLotes]);

    useEffect(() => {
    }, [setlote_Stock]);

    useEffect(() => {
    }, [setlote_CodigoLote]);

    useEffect(() =>{
    }, [setLotes]);

    useEffect(() => {
    }, [setppro_Id]);

      //#endregion

    const EditTable = async (rowData) => {
        console.log("El codigo de lote es: " + rowData.lote_CodigoLote)
        const data = await getLotesStock(rowData.lote_CodigoLote);
        setDataDDL(data);
        console.log("La data del segundo ddl es: ");
        console.log(data);
        setCantidadValor(rowData.ppde_Cantidad)
        setCodigoLoteValor(rowData.lote_CodigoLote)
        setSelectedLotes(rowData.lote_CodigoLote);
        setlote_Stock(rowData.lote_Stock);
        setlote_CodigoLote(rowData.lote_CodigoLote);
        setppde_Cantidad(rowData.ppde_Cantidad);
        setppro_Id(rowData.ppro_Id)
        setppde_Id(rowData.ppde_Id);
        setLabelButton("Edit");
        setSaber(2)
    } 

    useEffect(() =>{
    }, [setDataDDL]);

    useEffect(() =>{
    }, [setCantidadValor]);

    useEffect(() =>{
    }, [setCodigoLoteValor]);
    
    useEffect(() =>{
    }, [setppde_Id]);

    useEffect(() => {
    }, [setSaber]);

    useEffect(() =>{
    }, [setLabelButton])

    useEffect(() => {
    }, [setppde_Cantidad]);

    useEffect(() => {
    }, [setSelectedLotes]);

    useEffect(() => {
    }, [setlote_Stock]);

    useEffect(() => {
    }, [setlote_CodigoLote]);

    useEffect(() => {
    }, [setppro_Id]);

    const togglePanel = () => {
        setppde_Cantidad('');
        setSelectedLotes("0");
        setlote_Stock('');
        setlote_CodigoLote('')

        setppro_Fecha('');
        setppr_Observaciones('')
        setSelectedEmpleados("0")

        setLabelButton('Save')
        setSaber(1)
        
        setppro_Id(0);
        setIsExpanded(!isExpanded);
        setIsExpandedDetails(!isExpandedDetails);
        setButtonExpanded(false);
        setTable(false);
        setActiveIndex(0);  // Cambia al segundo TabPanel
    };

    useEffect(() =>{
    }, [setppde_Id]);

    useEffect(() => {
    }, [setSaber]);

    useEffect(() =>{
    }, [setLabelButton])

    useEffect(() => {
    }, [setppde_Cantidad]);

    useEffect(() => {
    }, [setSelectedLotes]);

    useEffect(() => {
    }, [setlote_Stock]);

    useEffect(() => {
    }, [setlote_CodigoLote]);


    useEffect(() =>{
    }, [setppro_Fecha]);

    useEffect(() => {
    }, [setppr_Observaciones]);

    useEffect(() =>{
    }, [setSelectedEmpleados])


    useEffect(() => {
    }, [setppro_Id]);

    useEffect(() => {
    }, [setppro_Id]);

    useEffect(() =>{
    }, [setActiveIndex]);

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

    useEffect(() =>{
    }, [setActiveIndex]);


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

      const FieldLote = async (event) => {
        try
        {
            const lotesid = event.target.value;
            /*setFieldValue('pais_Id', event.target.value);*/
            const data = await getLotesStock(lotesid);
    
            setDataDDL(data);
            setlote_CodigoLote(data[0].lote_CodigoLote)
            setlote_CodigoLote(data[0].lote_CodigoLote)
            setlote_Stock(data[0].lote_Stock)
            setSelectedLotes(lotesid);
        }

        catch (error)
        {
            console.log("El error es:" + error); 
        }
      }

      useEffect(() => {
    }, [setDataDDL])
      //#endregion

      useEffect(() => {
     }, [setlote_Stock])

     useEffect(() => {
    }, [setlote_CodigoLote])

      const handleChanges = async (event) => {
        try
        {
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
        }

        catch
        {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Select a valid lot', life: 3000 });
        }
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


      //#region Table Pedidos Prod. Detalle
      const [PedidosProduccionDetalle, setPedidosProduccionDetalle] = useState([]);
      const fetchPedidosProduccionDetalles= async (ppr_Id) => {
        setLoading(true);
        try {
          const data = await getPedidosProduccionDetalle(ppr_Id);
          setPedidosProduccionDetalle(data);
          setLoading(false);
        } catch (error) {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch formas envio', life: 3000 });
          setLoading(false);
        }
      };
  
      useEffect(() => {
      }, [setPedidosProduccionDetalle]);

      //#region Tabla de Pedidos Prod.
      const [PedidosOrden, setPedidosOrden] = useState([]);
      const [loading, setLoading] = useState(false);

      const fetchPedidosOrden= async () => {
        setLoading(true);
        try {
          const data = await getPedidosProduccion();
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

      const EditPPD = async (rowData) => {
        setppro_Id(rowData.ppro_Id);
        const data = await getLotesStock(parseInt(rowData.ppro_Id));
        setDataDDL(data);
        console.log("La data del ddl es: ");
        console.log(data);
        setActiveIndex(1);
        fetchPedidosProduccionDetalles(rowData.ppro_Id);
        settableppd(true);
        setIsExpanded(!isExpanded);
        setIsExpandedDetails(!isExpandedDetails);
        setButtonExpanded(false);
        setTable(false);

        setppde_Cantidad('');
        setSelectedLotes("0");
        setlote_Stock('');
        setlote_CodigoLote('')

        setppro_Fecha('');
        setppr_Observaciones('')
        setSelectedEmpleados("0")

      }

      useEffect(() => {
     }, [setDataDDL])

      useEffect(() => {
      }, [setppro_Id])

      useEffect(() =>{
    }, [setActiveIndex]);

    useEffect(() => {
    }, [setPedidosProduccionDetalle])

    useEffect(() => {
    }, [setppde_Cantidad]);

    useEffect(() => {
    }, [setSelectedLotes]);

    useEffect(() => {
    }, [setlote_Stock]);

    useEffect(() => {
    }, [setlote_CodigoLote]);

    useEffect(() =>{
    }, [setppro_Fecha]);

    useEffect(() => {
    }, [setppr_Observaciones]);

    useEffect(() =>{
    }, [setSelectedEmpleados])

    const Cancel = () => {
        setIsDetails(false);
        settableppd(false);
        setIsExpandedDetails(false);
        setButtonExpanded(true);
        setTable(true);
        setLabelDetails('Pedidos Produccion')
    }

    const Details = (rowData) =>{
        setLabelDetails('Pedidos Produccion Details')
        setIsDetails(true);
        setID(rowData.ppro_Id)
        setEmpleadoss(rowData.empl_NombreCompleto);
        setObservaciones(rowData.ppro_Observaciones);
        setFechaCreacion(rowData.ppro_FechaCreacion);
        setUsuarioCreacion(rowData.usuarioCreacionNombre);
        setFechaModificacion(rowData.ppro_FechaModificacion);
        setUsuarioModificacion(rowData.usuarioModificacionNombre);
        setButtonExpanded(false);
        setTable(false);
    }

    useEffect(() => {
    }, [setLabelDetails])

    useEffect(() => {
    }, [setID])

    useEffect(() => {
    }, [setEmpleadoss])

     useEffect(() => {
     }, [setObservaciones])

     useEffect(() =>{
   }, [setFechaCreacion]);

   useEffect(() => {
   }, [setUsuarioCreacion])

    useEffect(() =>{
    }, [setFechaModificacion]);

    useEffect(() => {
    }, [setUsuarioModificacion])

    return (
        <>
        <Toast ref={toast} />
            <Head>
                <title>{getPageTitle('Pedidos Produccion')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton icon={mdiTrendingNeutral} title={LabelDetails} main>
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
                    <Column field="ppro_Id" header="Id" sortable />
                    <Column field="empl_NombreCompleto" header="Empleado" sortable />
                    <Column field="ppro_Estados" header="Estado" sortable />
                    <Column field="ppro_Observaciones" header="Observaciones" sortable />
                    <Column 
                    body={rowData => (
                    <div className='flex gap-3.5 justify-center'>
                        <Button color="info" label="Editar" icon={mdiEye} onClick={() => EditPPD(rowData)} small />
                        <Button color="info" label="Detalles" icon={mdiEye} onClick={() => Details(rowData)} small />
                    </div>
                    )} />
                    </DataTable>
                    )}
            </SectionMain>

            {isDetails && (
            <Card className="md:w-25rem" style={{ marginTop: '-15px' }}>
            <SectionMain>
            <div className="p-4">
                <table className="w-full ">
                <thead>
                    <tr>
                    <th className="px-4 py-2 ">Id</th>
                    <th className="px-4 py-2 ">Empleado</th>
                    <th className=" px-4 py-2 ">Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td style={{ backgroundColor: 'white' }} className=" px-4 py-2 ">{ID}</td>
                    <td style={{ backgroundColor: 'white' }} className=" px-4 py-2 ">{Empleados}</td>
                    <td style={{ backgroundColor: 'white' }} className=" px-4 py-2 " >{Observaciones}</td>
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

            <Button color="danger" label="Regresar" icon={mdiCancel} onClick={() => Cancel()} small />
            </SectionMain>
            </Card>
            )}

            {isExpandedDetails && (
                <div className="" style={{ marginLeft: '2.0em', marginRight: '2.0em' }}>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header={<div style={{ textAlign: 'center', width: '100%' }}>Header I</div>} disabled={activeIndex == 1}>
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
                        <TabPanel header={<div style={{ textAlign: 'center', width: '100%' }}>Header II</div>} disabled={activeIndex == 0}>
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
                                                                FieldLote(e);
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
                                        <Button color="danger" label="Cancel" icon={mdiCancel} onClick={() => Cancel()} small />
                                        <Button color="success" label={labelButton} icon={mdiCheck} onClick={() => Send()} small />                                    </div>
                                    <style jsx>{`
                                        .botones {
                                            display: flex;
                                            gap: 5px;
                                        }    
                                    `}
                                    </style>
                                </SectionMain>
                            </Card>
                            {tableppd &&(
                    <Card className="md:w-25rem" style={{ marginTop: '20px' }}>
                    <DataTable 
                    value={PedidosProduccionDetalle} 
                    loading={loading} 
                    responsiveLayout="scroll"
                    paginator 
                    rows={10}
                    >
                    <Column field="ppde_Id" header="ID" sortable />
                    <Column field="colr_Codigo" header="Codigo" sortable />
                    <Column field="mate_Descripcion" header="Material" sortable />
                    <Column field="ppde_Cantidad" header="Cantidad" sortable />
                    <Column field="lote_Stock" header="Stock" sortable />
                    <Column field="colr_Nombre" header="Color" sortable />
                    <Column field="tipa_area" header="Area" sortable />
                    <Column 
                    body={rowData => (
                    <div className='flex gap-3.5 justify-center'>
                        <Button color="success" label="Edit" icon={mdiEye} onClick={() => EditTable(rowData)} small />
                    </div>
                    )} />
                    </DataTable>
                    </Card>
                            )}
                        </TabPanel>
                        #endregion
                    </TabView>
                </div>
            )}
        </>
    )
}

PedidosProduccionPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

/*                        <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
                        <Button color="success" label="" icon={mdiDotsVertical} className="mr-2" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />
                     */

export default PedidosProduccionPage
