import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { getPageTitle } from '../config';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
/*import { Card } from "primereact/card";*/
import { /*getAldea,*/ getCiudades } from './apiService/data/components/ApiService';
import LayoutAuthenticated from '../layouts/Authenticated';
import type { ReactElement } from 'react';
import SectionMain from "../components/Section/Main";
import SectionTitleLineWithButton from "../components/Section/TitleLineWithButton";
import { mdiChartTimelineVariant } from "@mdi/js";

const CiudadPage = () => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [cities, setCities] = useState([]);
  const [aldeas, setAldeas] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCiudades();
        console.log(response)
        setCities(response);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const fetchAldeas = async (ciud_Id) => {
    const apiUrl = 'https://localhost:44380/api/Aldea/FiltrarPorCiudades?alde_Id=';
    try {
      const response = await axios.get(`${apiUrl}${ciud_Id}`, {
        headers: {
          XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
          'Content-Type': 'application/json',
        },
      });
      console.log("LA DATA ES:")
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      console.error("Error fetching aldeas:", error);
      return [];
    }
  };

  const onRowExpand = async (event) => {
    const ciud_Id = event.data.ciud_Id;
    console.log("EL DATA ID ES")
    console.log(ciud_Id)
    const aldeasData = await fetchAldeas(ciud_Id);
    setAldeas((prevAldeas) => ({
      ...prevAldeas,
      [ciud_Id]: aldeasData,
    }));
  };

  const rowExpansionTemplate = (data) => {
    const aldeasData = aldeas[data.ciud_Id] || [];
    return (
      <DataTable value={aldeasData} responsiveLayout="scroll">
        <Column field="alde_Id" header="ID" />
        <Column field="alde_Nombre" header="Aldea" />
      </DataTable>
    );
  };

  const header = <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Data Master" main />;

  return (
    <>
      <Head>
        <title>{getPageTitle('Departamento')}</title>
      </Head>
      <SectionMain>
        {header}
        <div className="table-container">
          <DataTable value={cities} 
        responsiveLayout="scroll"
        paginator 
        rows={10} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
            onRowExpand={onRowExpand} rowExpansionTemplate={rowExpansionTemplate} dataKey="ciud_Id"
            tableStyle={{ minWidth: '60rem' }}>
            <Column expander style={{ width: '5rem' }} />
            <Column field="ciud_Id" header="Id" sortable />
            <Column field="ciud_Nombre" header="City" sortable />
            <Column field="pvin_Nombre" header="Province" sortable />
          </DataTable>
        </div>
      </SectionMain>
    </>
  );
};

CiudadPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default CiudadPage;