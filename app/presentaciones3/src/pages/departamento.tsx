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
import React, { useState } from 'react'
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

import { mdiEye, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '../components/CardBox/Modal'
import FormField from '../components/Form/Field'
import Divider from '../components/Divider'
import Buttons from '../components/Buttons'
const DepartamentoPage = () => {
  const [visible, setVisible] = useState(false)
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
  }

  const Mostrar = (values) => {
    alert(JSON.stringify(values, null, 2));
  }
  return (
    <>
      <Button label="Open Modal" onClick={() => setIsModalInfoActive(true)} />

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

      <Form>
        <FormField>
          <Field name="name" placeholder="Nombre" />
          <Field type="date" name="year" placeholder="Año" />
        </FormField>

        <FormField>
          <Field name="price" placeholder="Precio" />
          <Field type="text" name="CPU_model" placeholder="CPU modelo" />
        </FormField>
        <FormField>
          <Field name="price" placeholder="Precio" />
          <Field type="text" name="Hard_disk_size" placeholder="Tamaño del disco" />
        </FormField>
        <Buttons>
          <Button type="submit" label="Agregar" color="info" />
          <Button label="Cancelar" color="info" outline onClick={handleModalAction} />
        </Buttons>
      </Form>

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
