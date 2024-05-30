import * as React from "react";
import axios from 'axios';
import { InfiniteTable, DataSource, InfiniteTablePropColumns, DataSourceData } from "@infinite-table/infinite-react";
import { Card } from "primereact/card";
import { getAldea } from './apiService/data/components/ApiService';
/*import LayoutAuthenticated from '../layouts/Authenticated';
import type { ReactElement } from 'react';*/

// Tipos de datos
type Aldea = {
  alde_Id: string;
  alde_Nombre: string;
  ciud_Id: string;
  ciud_Nombre: string;
  pvin_Id: string;
  pvin_Codigo: string;
  pvin_Nombre: string;
};

type City = {
  ciud_Id: number;
  ciud_Nombre: string;
  pvin_Nombre: string;
};

// Configuración de columnas
const columns: InfiniteTablePropColumns<Aldea> = {
  alde_Id: {
    field: "alde_Id",
    header: "ID",
    defaultWidth: 60,
    resizable: false,
    type: "number",
  },
  firstName: {
    field: "alde_Nombre",
    header: "Aldea",
  },
  ciud_Nombre: {
    field: "ciud_Nombre",
    defaultHiddenWhenGroupedBy: true,
  },
};

const cityColumns: InfiniteTablePropColumns<City> = {
  id: {
    field: "ciud_Id",
    type: "number",
    header: "ID",
    defaultWidth: 80,
    renderRowDetailIcon: true,
  },
  city: {
    field: "ciud_Nombre",
    header: "City",
  },
  country: {
    field: "pvin_Nombre",
    header: "Country",
  },
};

// Función para obtener datos
const fetchDevelopers: DataSourceData<Aldea> = async ({ filterValue, masterRowInfo }) => {
  if (masterRowInfo) {
    filterValue = [
      {
        field: "ciud_Id",
        filter: {
          operator: "eq",
          type: "string",
          value: (masterRowInfo.data as City).ciud_Id,
        },
      },
      ...(filterValue || []),
    ];
  }
  const args = [
    filterValue
      ? "filterBy=" +
        JSON.stringify(
          filterValue.map(({ field, filter }) => {
            return {
              field: field,
              operator: filter.operator,
              value: filter.type === "number" ? Number(filter.value) : filter.value,
            };
          })
        )
      : null,
  ]
    .filter(Boolean)
    .join("&");

  const apiUrl = 'https://localhost:44380/api/Aldea/FiltrarPorCiudades?alde_Id=';
  const values = filterValue ? filterValue.map(({ filter }) => filter.value) : [];
  const hola = args;

  console.log("Los valores son: " + values + hola);
  try {
    const response = await axios.get(`${apiUrl}${values}`, {
      headers: {
        XApiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
        'Content-Type': 'application/json',
      },
    });
    console.log("La data es:" + response.data);
    const data = response.data;
    return data as Aldea[];
  } catch (error) {
    console.error("Error fetching developers:", error);
    return [];
  }
};

// Función para renderizar detalles
const renderDetail = () => {
  return (
    <DataSource<Aldea> data={fetchDevelopers} primaryKey="alde_Id">
      <InfiniteTable<Aldea>
        columns={columns}
        domProps={{ className: 'flex-1' }}
        columnDefaultWidth={120}
      />
    </DataSource>
  );
};

// Componente principal
const CiudadPage = () => {
  return (
      <Card className="p-4 flex-1">
        <DataSource<City> primaryKey={"ciud_Id"} data={getAldea}>
          <InfiniteTable<City>
            columns={cityColumns}
            domProps={{ className: 'flex-1' }}
            rowDetailRenderer={renderDetail}
          />
        </DataSource>
      </Card>
  );
};

/* CiudadPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
} */

export default CiudadPage;
