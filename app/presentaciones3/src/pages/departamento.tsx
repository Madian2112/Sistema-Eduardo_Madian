import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartPie,
  mdiChartTimelineVariant,
  mdiGithub,
  mdiMonitorCellphone,
  mdiReload,
} from '@mdi/js'
import { Field, Form, Formik } from 'formik'
import { mdiAccount, mdiBallotOutline, mdiMail, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { useState, useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import type { ReactElement } from 'react'
import Button from '../components/Button'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import CardBoxWidget from '../components/CardBox/Widget'
import { useSampleClients, useSampleTransactions } from '../hooks/sampleData'
import CardBoxTransaction from '../components/CardBox/Transaction'
import { Client, Transaction } from '../interfaces'
import CardBoxClient from '../components/CardBox/Client'
import SectionBannerStarOnGitHub from '../components/Section/Banner/StarOnGitHub'
import CardBox from '../components/CardBox'
import { sampleChartData } from '../components/ChartLineSample/config'
import ChartLineSample from '../components/ChartLineSample'
import NotificationBar from '../components/NotificationBar'
import TableSampleClients from '../components/Table/SampleClients'
import { getPageTitle } from '../config'
import { Toast } from 'primereact/toast';
import { mdiEye, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '../components/CardBox/Modal'
import FormField from '../components/Form/Field'
import Divider from '../components/Divider'
import Buttons from '../components/Buttons'

import { ProductViewModel } from '../interfaces/telefonoViewModel'
const DepartamentoPage = () => {
  const [visible, setVisible] = useState(false)
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const toast = useRef<Toast>(null);
  const handleModalAction = () => {
    setIsModalInfoActive(false);
  }

  const Mostrar = async (values) => {
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
      toast.current?.show({ severity: 'success', summary: 'Success', detail: `Product added successfully. Status Code: ${response.status}`, life: 100000 });
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
  title="Agregar"
  buttonColor="info"
  buttonLabel="Agregar"
  isActive={isModalInfoActive}
  onConfirm={handleModalAction}
  onCancel={handleModalAction}
>
  <Formik
    initialValues={{
      name: 'Iphone',
      year: '',
      CPU_model: '',
      price: '',
      Hard_disk_size: '',
    }}
    onSubmit={(values) => {
      Mostrar(values);
    }}
  >
    {() => (
      <Form>
        <FormField>
          <Field name="name" placeholder="Nombre" />
          <Field type="number" name="year" placeholder="Año" />
        </FormField>
        <FormField>
          <Field type="number" name="price" placeholder="Precio" />
          <Field name="CPU_model" placeholder="CPU modelo" />
        </FormField>
        <FormField>
          <Field name="Hard_disk_size" placeholder="Tamaño del disco" />
        </FormField>
        <Buttons>
          <Button type="submit" label="Agregar" color="info" />
          <Button label="Cancelar" color="info" outline onClick={handleModalAction} />
        </Buttons>
      </Form>
    )}
  </Formik>
</CardBoxModal>

      <Head>
        <title>{getPageTitle('Departamento')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Departamento" main>
        </SectionTitleLineWithButton>

       

  
  <Button
                    color="info"
                    label="Agregar"
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
