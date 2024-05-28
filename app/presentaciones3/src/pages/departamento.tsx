import {
  /*mdiAccountMultiple,
  mdiCartOutline,
  mdiChartPie, */
  mdiChartTimelineVariant,
  /*mdiGithub,
  mdiMonitorCellphone,
  mdiReload, */
} from '@mdi/js'
import { Formik, Form, Field, /*ErrorMessage*/ } from 'formik';
/*import { mdiAccount, mdiBallotOutline, mdiMail, mdiUpload } from '@mdi/js' */
import Head from 'next/head'
/*import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber'; */
import React, { useState, useRef } from 'react'
/*import { Dialog } from 'primereact/dialog' */
import type { ReactElement } from 'react'
import Button from '../components/Button'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
/*import CardBoxWidget from '../components/CardBox/Widget'
import { useSampleClients, useSampleTransactions } from '../hooks/sampleData'
import CardBoxTransaction from '../components/CardBox/Transaction'
import { Client, Transaction } from '../interfaces'
import CardBoxClient from '../components/CardBox/Client'
import SectionBannerStarOnGitHub from '../components/Section/Banner/StarOnGitHub'
import CardBox from '../components/CardBox'
import { sampleChartData } from '../components/ChartLineSample/config'
import ChartLineSample from '../components/ChartLineSample'
import NotificationBar from '../components/NotificationBar'
import TableSampleClients from '../components/Table/SampleClients' */
import { getPageTitle } from '../config'
import { Toast } from 'primereact/toast';
import { mdiEye, /*mdiTrashCan*/ } from '@mdi/js'
import CardBoxModal from '../components/CardBox/Modal'
/*import FormField from '../components/Form/Field'
import Divider from '../components/Divider'
import Buttons from '../components/Buttons' */
import * as Yup from 'yup';
import { ProductViewModel } from '../interfaces/telefonoViewModel'

const DepartamentoPage = () => {
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const toast = useRef<Toast>(null);
  const handleModalAction = () => {
    setIsModalInfoActive(false);
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is requerid').matches(/^[A-Za-z\s]+$/, 'Name should contain only letters and spaces.'),
    year: Yup.number().required('Year is requerid').typeError('Year should be a number').test('len', 'Must be exactly 4 characters', val => val.toString().length  == 4),
    price: Yup.number().required('Price is requerid').typeError('Price should be a number'),
    CPU_model: Yup.string().required('Model is requerid').matches(/^[A-Za-z0-9\s]+$/, 'CPU Model should contain only letters, numbers, and spaces.'),
    Hard_disk_size: Yup.string().required('Hard disk size is requerid').matches(/^[A-Za-z0-9\s.]+$/, 'Hard disk size should contain only letters, numbers, spaces and dots.'),
  });

  const Send = async (values) => {
    const productData : ProductViewModel ={
      name: values.name,
      data: {
        year: parseInt(values.year),
        price: parseFloat(values.price),
        "CPU model": values.CPU_model,
        "Hard disk size": values.Hard_disk_size,
      },
    };


    const response = await fetch('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Success:', responseData);
      setIsModalInfoActive(false);

      toast.current?.show({ severity: 'success', summary: 'Success', detail: `Product added successfully. Status Code: ${response.status}`, life: 3000 });
    } else {
      console.error('Error:', response.statusText);
      alert('Failed to add product');
      toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product. Status Code: ${response.status}`, life: 3000 });
    }

    setIsModalInfoActive(false);
  }
  return (
    <>

<Toast ref={toast} />
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
      name: '',
      year: '',
      CPU_model: '',
      price: '',
      Hard_disk_size: '',
    }}
  validationSchema={validationSchema}
  onSubmit={(values, { setSubmitting }) => {
    if (values.name && values.year && values.price && values.CPU_model && values.Hard_disk_size) {
      Send(values);
    }
    setSubmitting(false);
  }}
  >
  {({ errors, touched })=> (
      <Form className='w-full'>
  <div className="flex justify-between mb-6">
  <div className="flex flex-col mr-4 flex-1"> 
    <label htmlFor="name" className="mb-2">Name</label>
    <Field 
      name="name" 
      className={`border p-2 ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'}`}
    />
    {touched.name && errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
  </div>
  <div className="flex flex-col flex-1">
    <label htmlFor="year" className="mb-2">Year</label>
    <Field 
      type="number" 
      name="year" 
      className={`border p-2 ${touched.year && errors.year ? 'border-red-500' : 'border-gray-300'}`}
    />
    {touched.year && errors.year && <div className="text-red-500 text-xs mt-1">{errors.year}</div>}
  </div>
</div>

<div className="flex justify-between mb-6">
  <div className="flex flex-col mr-4 flex-1"> 
    <label htmlFor="price" className="mb-2">Price</label>
    <Field 
      type="number" 
      name="price" 
      className={`border p-2 ${touched.price && errors.price ? 'border-red-500' : 'border-gray-300'}`}
    />
    {touched.price && errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
  </div>
  <div className="flex flex-col flex-1">
    <label htmlFor="CPU_model" className="mb-2">CPU Model</label>
    <Field 
      name="CPU_model" 
      className={`border p-2 ${touched.CPU_model && errors.CPU_model ? 'border-red-500' : 'border-gray-300'}`}
    />
    {touched.CPU_model && errors.CPU_model && <div className="text-red-500 text-xs mt-1">{errors.CPU_model}</div>}
  </div>
</div>

<div className="flex justify-between mb-6">
  <div className="flex flex-col mr-4 flex-1"> 
    <label htmlFor="Hard_disk_size" className="mb-2">Hard disk size</label>
    <Field 
      name="Hard_disk_size" 
      className={`border p-2 ${touched.Hard_disk_size && errors.Hard_disk_size ? 'border-red-500' : 'border-gray-300'}`}
    />
    {touched.Hard_disk_size && errors.Hard_disk_size && <div className="text-red-500 text-xs mt-1">{errors.Hard_disk_size}</div>}
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
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Fetch" main>
        </SectionTitleLineWithButton>

       

  
  <Button
                    color="info"
                    label="Add"

                    icon={mdiEye}
                    onClick={() => setIsModalInfoActive(true)}
                    small
                  />
      </SectionMain>
    </>
  )
}

DepartamentoPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default DepartamentoPage
