import {
  mdiPlus,
  mdiTrendingNeutral, 
  mdiClose,
  mdiCheck, 
  mdiEye,
  mdiCancel, 
  mdiDetails, 
  mdiAppleKeyboardControl
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
import { getEmpleados, getPedidosProduccion, getLotes, getLotesStock, sendPedidosProduccion, sendPedidosProduccionDetalle, getPedidosProduccionDetalle, editPedidosProduccionDetalle, deletePedidosProduccion, sendPedidosProduccionDetalleEliminar, 
      sendPedidosProduccionUpdate, sendPedidosProduccionFinalizar } from './apiService/data/components/ApiService';
import { PedidosProduccionViewModel } from '../interfaces/PedidoProduccionViewModel';
import { PedidosProduccionDetalleViewModel } from '../interfaces/PedidosProduccionDetalleViewModel';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import CardBoxModal from '../components/CardBox/Modal'
import Moment from 'moment';

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
  const [Row, setRow] = useState('');
  const [PedidosOrden, setPedidosOrden] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saberDelete, setsaberDelete] = useState(0);
  const [ValorPPD, setValorPPD] = useState(0);
  const [idPrem, setidPrem] = useState('');
  const [hola, sethola] = useState(0);
  const [FechaProv, setFechaProv] = useState("");
  const [ObservacionesProv, setObservacionesProv] = useState("");
  const [EmpleadosProv, setEmpleadosProv] = useState("");
  const [ValorProvPPR, setValorProvPPR] = useState(0);
  const [Finalizado, setFinalizado] = useState(false);
  const [ModalFinalizar, setModalFinalizar] = useState(false);

  const validationSchema = Yup.object().shape({
      ppro_Fecha: Yup.string().required('Date is required'),
      ppr_Observaciones: Yup.string().required('Observations are required').matches(/^[A-Za-z0-9]+$/, 'Observations should contain only letters, numbers.'),
      ppde_Cantidad: Yup.string().required('Amount are required').matches(/^[0-9]+$/, 'Amount should contain only numbers.'),
  });

  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleados, setSelectedEmpleados] = useState("");
  const [lotes, setLotes] = useState([]);
  const [selectedLotes, setSelectedLotes] = useState('');

  //#region ENVIAR DATOS A LA API
  const Send = async () => {
      try 
      {
      const productData: PedidosProduccionViewModel = {
          ppro_Id: 1,
          empl_Id: parseInt(selectedEmpleados),
          empl_NombreCompleto: "",
          ppro_Fecha: ppro_Fecha,
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
          toast.current.show({ severity: 'error', summary: 'Error', detail: `Empty fields are not accepted`, life: 3000 });   
      }

      else if(ppde_Cantidad != '' && selectedLotes != '' && selectedLotes != "0" && lote_CodigoLote != '' && lote_Stock != '' )
      {
          if(DataDDL[0].lote_Stock == 0)
          {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: 'The lot is out of stock', life: 3000 });
          }

          else
          {
              if(ppde_Cantidad > DataDDL[0].lote_Stock){
                  toast.current.show({ severity: 'error', summary: 'Error', detail: `The quantity must be less than or equal to the stock`, life: 3000 });
              }
      
              else if(ppde_Cantidad <= DataDDL[0].lote_Stock) 
              {
                  if(saber ==  1)
                  {
                          if(ppro_Id == 0)
                          {
                              try {
                                  const response = await sendPedidosProduccion(productData);
                                  console.log("El response data es: ", response);
                                  console.log("El response status es: ",response.data.data.messageStatus);
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
                                    toast.current?.show({ severity: 'success', summary: 'Success', detail: `Orders Production Detail & Production Orders Added Successfullys envio added successfully`, life: 3000 });
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
                                    toast.current?.show({ severity: 'success', summary: 'Success', detail: `Orders Production Detail Added Successfully`, life: 3000 });
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
                            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Orders Production Detail Edited Successfully`, life: 3000 });
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
      }
      catch
      {
          console.log("Entro aqui")
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Select a Batch', life: 3000 });
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

  useEffect(() => {
  }, [setValorPPD]);

    //#endregion

    const Delete = async () => {
      const productData: PedidosProduccionViewModel = {
          ppro_Id: ppro_Id,
          empl_Id: 1,
          empl_NombreCompleto: "",
          ppro_Fecha: new Date().toISOString(),
          ppro_Estados: "true",
          ppro_Observaciones: "",
          ppro_Finalizado: false,
          usua_UsuarioCreacion:1,
          lote_Id: 1,
          ppde_Cantidad: 1,
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
          ppde_Id: ValorPPD,
          ppro_Id:  1, 
          lote_Id: 1,
          lote_Stock: "", 
          lote_CodigoLote: "hola",
          ppde_Cantidad: 1,
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

      if(saberDelete == 1)
      {
          try {
              const response = await deletePedidosProduccion(productData);
  
              console.log("El resultado del response es: ")
              console.log(response);
              
              if (response.data.data.messageStatus == 1) {
                  const data = await getPedidosProduccion();
                  setPedidosOrden(data);
                  setLoading(false);
                  isModalDelete(false)
                console.log('Success:', response.data);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: `Orders Production Detail Deleted Successfully`, life: 3000 });
              } 
              else if(response.data.data.messageStatus == 2)
              {
                  isModalDelete(false)
                  toast.current?.show({ severity: 'error', summary: 'Error', detail: `Has dependencies on other tables`, life: 3000 });
              }
              else {
                  isModalDelete(false)
                console.error('Error:', response.statusText);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
              }
            } 
            catch (error) {
              isModalDelete(false)
              console.error('Error:', error);
              toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Entro al catch 2', life: 3000 });
            } 
      }

      else if(saberDelete == 2)
      {
          try {
              const response = await sendPedidosProduccionDetalleEliminar(ppDetalle);
  
              console.log("El resultado del response es: ")
              console.log(response);
              
              if (response.status == 200) {
                  const data = await getPedidosProduccion();
                  setPedidosOrden(data);

                  const dataa = await getPedidosProduccionDetalle(ppro_Id);
                  setPedidosProduccionDetalle(dataa);
                  setLoading(false);

                  isModalDelete(false)
                console.log('Success:', response.data);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: `Orders Production Detail Deleted Successfully`, life: 3000 });
              } 
              else {
                  isModalDelete(false)
                console.error('Error:', response.statusText);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
              }
            } 
            catch (error) {
              isModalDelete(false)
              console.error('Error:', error);
              toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Entro al catch 2', life: 3000 });
            } 
      }
    }

    useEffect(() => {
  }, [setPedidosOrden])

  const [modalDelete, isModalDelete] = useState(false);

  const ModalDelete = () => {
      isModalDelete(true)
  }

  const handleModalAction = () => {
      isModalDelete(false);
  }

    useEffect(() => {
  }, [setRow]);

  const EditTable = async () => {
      console.log("La data del Row es: ");
      console.log("El lote codigo es: " + Row.lote_CodigoLote);
      setDataDDL(Row.lote_CodigoLote);
      console.log(Row)
      setCantidadValor(Row.ppde_Cantidad)
      setCodigoLoteValor(Row.lote_CodigoLote)
      setSelectedLotes(Row.lote_CodigoLote);
      setlote_Stock(Row.lote_Stock);
      setlote_CodigoLote(Row.lote_CodigoLote);1
      setppde_Cantidad(Row.ppde_Cantidad);
      setppro_Id(Row.ppro_Id)
      setppde_Id(Row.ppde_Id);
      const data = await getLotesStock(Row.lote_CodigoLote);
      setDataDDL(data);
      console.log("La data del segundo ddl es: ");
      console.log(data);
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
      sethola(1);
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
  }, [sethola]);

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
      setValorProvPPR(0);

      setIsExpanded(!isExpanded);
      setIsExpandedDetails(!isExpandedDetails);
      setSelectedEmpleados('');
      setButtonExpanded(true);
      setTable(true);
  };

  useEffect(() => {
  }, [setValorProvPPR])

  const goToNextTab = async () => {

      if(hola == 1)
      {
          setppro_Id(0);
      }
      console.log("Formato fecha: ", ppro_Fecha)

      if(ppro_Fecha == '' || ppr_Observaciones == '' || selectedEmpleados == '' || selectedEmpleados == "0")
          {
              console.log("Hola Madian");
              toast.current.show({ severity: 'error', summary: 'Error', detail: `Empty fields are not accepted`, life: 3000 });
          }

      else if(ppro_Fecha != "" && ppr_Observaciones != "" && selectedEmpleados != "" && selectedEmpleados != "0")
          {
            if(ValorProvPPR == 1)
              {
                const NuevaFecha = new Date(FechaProv);
          
                // setppro_Fecha(NuevaFecha.toLocaleDateString('en-CA'));  

                console.log("Los valores de empleados son: ", selectedEmpleados," y ", EmpleadosProv );
                console.log("Los valores de observaciones son: ", ppr_Observaciones, " y " , ObservacionesProv);
                console.log("Los valores de la fecha son: ", ppro_Fecha,  " y ", NuevaFecha.toLocaleDateString('en-CA'))

                if(selectedEmpleados == EmpleadosProv && ppr_Observaciones == ObservacionesProv && ppro_Fecha == NuevaFecha.toLocaleDateString('en-CA'))
                {
                  setActiveIndex(1);  // Cambia al segundo TabPanel
                }

                else if(selectedEmpleados != EmpleadosProv || ppr_Observaciones != ObservacionesProv || ppro_Fecha != FechaProv)
                {
                  const productData: PedidosProduccionViewModel = {
                    ppro_Id: ppro_Id,
                    empl_Id: parseInt(selectedEmpleados),
                    empl_NombreCompleto: "",
                    ppro_Fecha: ppro_Fecha.toString(),
                    ppro_Estados: "true",
                    ppro_Observaciones: ppr_Observaciones.toString(),
                    ppro_Finalizado: false,
                    usua_UsuarioCreacion:1,
                    lote_Id: 1,
                    ppde_Cantidad: 1,
                    UsuarioCreacionNombre: "",
                    ppro_FechaCreacion: new Date().toISOString(),
                    usua_UsuarioModificacion: 1,
                    UsuarioModificacionNombre: "",
                    ppro_FechaModificacion: new Date().toISOString(),
                    ppro_Estado: true,
                    detalles:"",
                    mensaje: "",
                };
                {
                  try {
                      console.log("La data de producData es: ")
                      console.log(productData);
                      const response = await sendPedidosProduccionUpdate(productData);
                      console.log("El response del editado es: ")
                      console.log(response);
                      // ppDetalle.ppro_Id = parseInt(response.data.data.messageStatus);
                      // setppro_Id(response.data.data.messageStatus)
                      // console.log("El id es: " +  ppDetalle.ppro_Id)
                      // console.log("Los datos de ppDetall es: ");
                      // console.log(ppDetalle);

                      // const responses = await sendPedidosProduccionDetalle(ppDetalle);

                      // fetchPedidosProduccionDetalles(response.data.data.messageStatus);
                      // settableppd(true);

                      setppro_Id(ppro_Id);
                      fetchPedidosOrden();
                      if (response.status === 200) {
                        console.log('Success:', response.data);
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: ` Production Orders Edit Successfullys envio added successfully`, life: 3000 });
                        setActiveIndex(1);  // Cambia al segundo TabPanel
                      } else {
                        console.error('Error:', response.statusText);
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Entro al catch 1', life: 3000 });
                    }
                }
              }

              else
              {
                setActiveIndex(1);  // Cambia al segundo TabPanel
              }
              
          }
          else
          {
            setActiveIndex(1);  // Cambia al segundo TabPanel
          }
      }
  }

  useEffect(() => {
  }, [setppro_Id]);

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
    const fetchPedidosProduccionDetalles = async (ppr_Id) => {
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

    useEffect(() =>{
    }, [setppro_Fecha])

    useEffect(() =>{
    }, [setppr_Observaciones])

    useEffect(() =>{
    }, [setSelectedEmpleados])

    const EditPPD = async (rowData) => {

      if(Finalizado == true)
      {
        toast.current.show({ severity: 'info', summary: 'Information', detail: 'The order is finalized', life: 3000 });
      }

      else
     {
      setValorProvPPR(1);
      
      setActiveIndex(0);
      settableppd(true);
      setIsExpanded(!isExpanded);
      setIsExpandedDetails(!isExpandedDetails);
      setButtonExpanded(false);
      setTable(false);

      setppde_Cantidad('');
      setSelectedLotes("0");
      setlote_Stock('');
      setlote_CodigoLote('')

      console.log("Formato de fecha es: " + Date.parse(FechaProv).toString())

      const NuevaFecha = new Date(FechaProv);

      console.log("Nueva fecha: "+ NuevaFecha.toLocaleDateString('en-CA'))

      setppro_Fecha(NuevaFecha.toLocaleDateString('en-CA'));   
     }             



      // setppr_Observaciones('')
      // setSelectedEmpleados("0")

    }

    useEffect(() => {
   }, [setValorProvPPR])

  //   useEffect(() =>{
  // }, [setActiveIndex]);

  // useEffect(() => {
  // }, [setPedidosProduccionDetalle])

  // useEffect(() => {
  // }, [setppde_Cantidad]);

  // useEffect(() => {
  // }, [setSelectedLotes]);

  // useEffect(() => {
  // }, [setlote_Stock]);

  // useEffect(() => {
  // }, [setlote_CodigoLote]);

  useEffect(() =>{
  }, [setppro_Fecha]);

  // useEffect(() => {
  // }, [setppr_Observaciones]);

  // useEffect(() =>{
  // }, [setSelectedEmpleados])

  const Cancel = () => {

      setValorProvPPR(0);

      fetchPedidosOrden();
      setIsDetails(false);
      settableppd(false);
      setIsExpandedDetails(false);
      setButtonExpanded(true);
      setTable(true);
      setLabelDetails('Pedidos Produccion')
  }

  useEffect(() => {
  }, [setValorProvPPR])

  const Details = (rowData) =>{
      setLabelDetails('Pedidos Produccion Details')
      setIsDetails(true);
      setButtonExpanded(false);
      setTable(false);
  }

  const menuLeft = useRef(null); 
  const generateMenuItems = (rowData) => {
    
      const baseItems = [
        {
          label: 'Edit',
          icon: 'pi pi-user-edit',
          command: () => EditPPD(rowData)
        },
        {
          label: 'Details',
          icon: 'pi pi-book',
          command: () => Details(rowData)
        }, 
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => ModalDelete()
        }, 
        ...(!Finalizado ? [{
          label: 'Finish',
          icon: 'pi pi-send',
          command: () => isModalFinalizarT()
      }] : [])
      ];
      
      return baseItems;

    };

    const generateMenuItemsPPD = (rowData) => {
    
      const baseItems = [
        {
          label: 'Edit',
          icon: 'pi pi-user-edit',
          command: () => EditTable()
        }, 
        {
          label: 'Delete',
          icon: 'ppi pi-trash',
          command: () => ModalDelete()
        }
      ];
      
      return baseItems;

    };

    useEffect(() => {
  }, [setRow]);

  const isModalFinalizar = () => {
    setModalFinalizar(false);
  }

  const isModalFinalizarT = () => {
    setModalFinalizar(true);
  }

  const finalizar = async () => {
    const productData: PedidosProduccionViewModel = {
      ppro_Id: ppro_Id,
      empl_Id: 1,
      empl_NombreCompleto: "",
      ppro_Fecha: new Date().toISOString(),
      ppro_Estados: "true",
      ppro_Observaciones: "",
      ppro_Finalizado: false,
      usua_UsuarioCreacion:1,
      lote_Id: 1,
      ppde_Cantidad: 1,
      UsuarioCreacionNombre: "",
      ppro_FechaCreacion: new Date().toISOString(),
      usua_UsuarioModificacion: 1,
      UsuarioModificacionNombre: "",
      ppro_FechaModificacion: new Date().toISOString(),
      ppro_Estado: true,
      detalles:"",
      mensaje: "",
  };

    try {
      const response = await sendPedidosProduccionFinalizar(productData);

      console.log("El resultado del response es: ")
      console.log(response);
      
      if (response.data.data.messageStatus == 1) {
          const data = await getPedidosProduccion();
          setPedidosOrden(data);
          setLoading(false);
          setModalFinalizar(false);
          setValorProvPPR(0);

          setIsDetails(false);
          settableppd(false);
          setIsExpandedDetails(false);
          setButtonExpanded(true);
          setTable(true);

        console.log('Success:', response.data);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: `Production order successfully completed`, life: 3000 });
      } 
      else if(response.data.data.messageStatus == 2)
      {
          isModalDelete(false)
          toast.current?.show({ severity: 'error', summary: 'Error', detail: `Has dependencies on other tables`, life: 3000 });
      }
      else {
          isModalDelete(false)
        console.error('Error:', response.statusText);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product`, life: 3000 });
      }
    } 
    catch (error) {
      isModalDelete(false)
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Entro al catch 2', life: 3000 });
    } 

  }

  useEffect(()=> {
  }, [setValorProvPPR])

  useEffect(() => {
    fetchPedidosOrden();
  }, []);

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

                  <CardBoxModal
                      title="Delete"
                      buttonColor="info"
                      buttonLabel="Add"
                      isActive={modalDelete}
                      onConfirm={handleModalAction}
                      onCancel={handleModalAction}
                  >
                  
                  <div className="text-center mb-4">
                          <p>Are you sure you want to delete?</p>
                          </div>
                          <div className="flex justify-center gap-4">
                          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={Delete}>Yes</button>
                          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => isModalDelete(false)}>No</button>
                          </div>
                  </CardBoxModal>

                  <CardBoxModal
                      title="Finish"
                      buttonColor="info"
                      buttonLabel="Add"
                      isActive={ModalFinalizar}
                      onConfirm={isModalFinalizar}
                      onCancel={isModalFinalizar}
                  >
                  
                  <div className="text-center mb-4">
                          <p>Are you sure you can finish this production order?</p>
                          </div>
                          <div className="flex justify-center gap-4">
                          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={finalizar}>Yes</button>
                          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalFinalizar(false)}>No</button>
                          </div>
                  </CardBoxModal>

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
                  <Column field="ppro_Fecha" header="Fecha" sortable />
                  <Column field="ppro_Observaciones" header="Observaciones" sortable />
                  <Column 
                  body={rowData => (
                      <div className='flex gap-3.5 justify-center'>
                      <Menu model={generateMenuItems(rowData)} popup ref={menuLeft} id="popup_menu_left" />
                      <Button color="success" label="Options" icon={mdiDetails} onClick={(event) =>{ setppro_Id(rowData.ppro_Id);  menuLeft.current.toggle(event);
                        fetchPedidosProduccionDetalles(rowData.ppro_Id);
                        setFechaProv(rowData.ppro_Fecha);
                        setObservacionesProv(rowData.ppro_Observaciones)
                        setEmpleadosProv(rowData.empl_Id)

                        setppr_Observaciones(rowData.ppro_Observaciones)
                        setSelectedEmpleados(rowData.empl_Id)

                        setFinalizado(rowData.ppro_Finalizado);

                        setsaberDelete(1)
                        setID(rowData.ppro_Id)
                        setEmpleadoss(rowData.empl_NombreCompleto);
                        setObservaciones(rowData.ppro_Observaciones);
                        setFechaCreacion(rowData.ppro_FechaCreacion);
                        setUsuarioCreacion(rowData.usuarioCreacionNombre);
                        setFechaModificacion(rowData.ppro_FechaModificacion);
                        setUsuarioModificacion(rowData.usuarioModificacionNombre);
            
            } }small aria-controls="popup_menu_left" aria-haspopup />
                    
                     </div>
                  // <div className='flex gap-3.5 justify-center'>
                  //     <Button color="info" label="Editar" icon={mdiEye} onClick={() => EditPPD(rowData)} small />
                  //     <Button color="info" label="Detalles" icon={mdiEye} onClick={() => Details(rowData)} small />
                  // </div>
                  )} />
                  </DataTable>
                  )}
          </SectionMain>

          {isDetails && (
          <Card className="md:w-25rem" style={{ marginTop: '-15px' }}>
          <SectionMain>
          <div className="p-4" style={{ marginTop: '-30px' }}>
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

          <Button color="info" label="Cancel" icon={mdiAppleKeyboardControl} onClick={() => Cancel() } small/>
          </SectionMain>
          </Card>
          )}

          {isExpandedDetails && (
              <div className="" style={{ marginLeft: '2.0em', marginRight: '2.0em' }}>
              <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
              <TabPanel leftIcon={mdiCheck} header={<div style={{ textAlign: 'center', width: '100%' }}>Pedidos Produccion</div>} disabled={activeIndex == 1}>
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
                                  <div className="flex flex-row flex-grow-2 gap-2 align-items-center mt-6">
                                      <button
                                      type="button"
                                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                      style={{ height: '44px' }}
                                      onClick={() => togglePanelDetails()}
                                      >
                                      Leave
                                      </button>
                                      <button
                                      type="submit"
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                      style={{ height: '44px' }}
                                      onClick={goToNextTab}
                                      >
                                      Add
                                      </button>
                                  </div>
                                  {/* <div className='botones'>
                                      <Button color="danger" label="Cancel" icon={mdiClose} onClick={() => togglePanelDetails()} small />
                                      <Button color="success" label="Next " icon={mdiCheck} onClick={goToNextTab} small />
                                  </div>  */}
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
                      <TabPanel header={<div style={{ textAlign: 'center', width: '100%' }}>Pedidos Produccion Detalles</div>} disabled={activeIndex == 0}>
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
                                  <div className="flex flex-row flex-grow-2 gap-2 align-items-center mt-6">
                                      <button
                                      type="button"
                                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                      style={{ height: '44px' }}
                                      onClick={() => Cancel()}
                                      >
                                      Leave
                                      </button>
                                      <button
                                      type="submit"
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                      style={{ height: '44px' }}
                                      onClick={Send}
                                      >
                                      Add
                                      </button>
                                      <button
                                      type="submit"
                                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                      style={{ height: '44px' }}
                                      onClick={isModalFinalizarT}
                                      >
                                      Finish
                                      </button>
                                  </div>
                                  {/* <div className='botones'>
                                      <Button color="danger" label="Cancel" icon={mdiCancel} onClick={() => Cancel()} small />
                                      <Button color="success" label={labelButton} icon={mdiCheck} onClick={() => Send()} small />       
                                  </div>
                                  <style jsx>{`
                                      .botones {
                                          display: flex;
                                          gap: 5px;
                                      }    
                                  `}
                                  </style> */}
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
                      <Menu model={generateMenuItemsPPD(rowData)} popup ref={menuLeft} id="popup_menu_left" />
                      <Button color="success" label="Options" icon={mdiDetails} onClick={(event) =>{ setRow(rowData);  menuLeft.current.toggle(event); setsaberDelete(2); setValorPPD(rowData.ppde_Id)
            } }small aria-controls="popup_menu_left" aria-haspopup />
                    
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

export default PedidosProduccionPage
