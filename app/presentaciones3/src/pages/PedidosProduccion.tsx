
import {
    mdiPlus,
    mdiEye, 
    mdiCity, 
    mdiChartTimelineVariant, 
    mdiTrendingNeutral, 
    mdiClose,
    mdiCheck
  } from '@mdi/js'
import LayoutAuthenticated from '../layouts/Authenticated'
import type { ReactElement } from 'react'
import React, {useState} from 'react'; 
import Button from '../components/Button'
import { Card } from 'primereact/card';
import Head from 'next/head'
import { getPageTitle } from '../config'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import { vendored } from 'next/dist/server/future/route-modules/pages/module.compiled';
import { Formik, Form, Field, /*ErrorMessage*/ } from 'formik';
import { TabView, TabPanel } from 'primereact/tabview';
import * as Yup from 'yup';
import { V4MAPPED } from 'dns';

const PedidosProduccionPage =  () =>{

    const [isExpanded, setIsExpanded] = useState(true);
    const [buttonexpamded, setButton] = useState(true);
    const [isExpandedDetails, setIsExpandedDetails] = useState(false);
    const [descripcion, setDescripcion] = useState('');

    const validationSchema = Yup.object().shape({
        alde_Nombre: Yup.string().required('Codigo is requerid').matches(/^[A-Za-z\s]+$/, 'Name should contain only letters and spaces.'),
      });

      const Send = async() =>{

      }

    const togglePanel = () => {
        setIsExpanded(!isExpanded);
        setIsExpandedDetails(!isExpandedDetails);
        setButton(false)
      };

      const togglePanelDetails = () => {
        setIsExpanded(!isExpanded);
        setIsExpandedDetails(!isExpandedDetails);
        setButton(true)
      };
      
      
    return(
        <>
                <Head>
                <title>{getPageTitle('Pedidos Produccion')}</title>
                </Head>
                <SectionMain>
                <SectionTitleLineWithButton icon={mdiTrendingNeutral} title="Pedidos de Produccion" main>
                </SectionTitleLineWithButton>
                {buttonexpamded &&(
                <Button color="info" label="Add" icon={mdiPlus} onClick={() => togglePanel() }/>
                )}
                </SectionMain>


            {isExpandedDetails && (
            <div className="" style={{ marginLeft: '2.0em', marginRight: '2.0em' }}>
                <TabView>
                <TabPanel header="Header I">
            <Card className="md:w-25rem">
                        <SectionMain>
                            <Formik
                            initialValues={{
                                alde_Nombre: descripcion,
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
                            </div>
                                
                            </Form>
                            )}
                            </Formik>
                        <div className='botones'>
                        <Button color="danger" label="Cancel" icon={mdiClose} onClick={() => togglePanelDetails() } small/>
                        <Button color="success" label="Next " icon={mdiCheck} onClick={() => togglePanelDetails() } small/>
                        </div>
                        <style jsx>{`
                        .botones{
                            display:flex;
                            gap: 5px;
                        }    
                        `
                        }
                        </style>
                        </SectionMain>
                        </Card>
                        </TabPanel>
                        <TabPanel header="Header II">
                        <Card className="md:w-25rem">
                        <SectionMain>
                            <Formik
                            initialValues={{
                                alde_Nombre: descripcion,
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
                            <label htmlFor="name" className="mb-2">City</label>
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
                            </div>
                                
                            </Form>
                            )}
                            </Formik>
                        <div className='botones'>
                        <Button color="danger" label="Cancel" icon={mdiClose} onClick={() => togglePanelDetails() } small/>
                        <Button color="success" label="Okey " icon={mdiCheck} onClick={() => togglePanelDetails() } small/>
                        </div>
                        <style jsx>{`
                        .botones{
                            display:flex;
                            gap: 5px;
                        }    
                        `
                        }
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