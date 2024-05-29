import * as React from "react";
import LayoutAuthenticated from '../layouts/Authenticated'
import type { ReactElement } from 'react'
import {
  InfiniteTable,
  DataSource,
  InfiniteTablePropColumns,
  DataSourceData,
} from "@infinite-table/infinite-react";
import { HTMLProps } from "react";
import { Card } from "primereact/card";
import {
    mdiPlus,
    mdiEye, 
    mdiCity
  } from '@mdi/js'
  import Head from 'next/head'
  import { useState, useRef, useEffect } from 'react'
  import Button from '../components/Button'
  import SectionMain from '../components/Section/Main'
  import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
  import { getPageTitle } from '../config'
  import { Toast } from 'primereact/toast';
  import {/* mdiEye, mdiTrashCan*/ } from '@mdi/js' 
  import CardBoxModal from '../components/CardBox/Modal'
  import * as Yup from 'yup';
  import { DataTable } from 'primereact/datatable';
  import { Column } from 'primereact/column';
  import { getAldea, sendDeleteAldea, sendEditAldea, sendAldea } from './apiService/data/components/ApiService';
  import cities from "./cities.json";
  
const CiudadPage = () => {

type Developer = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  country: string;
  countryCode: string;
  city: string;
  stack: string;
  currency: string;
  salary: number;
  canDesign: "yes" | "no";
  hobby: string;
  email: string;
  streetName: string;
};

type Aldea = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    country: string;
    countryCode: string;
    city: string;
    stack: string;
    currency: string;
    salary: number;
    canDesign: "yes" | "no";
    hobby: string;
    email: string;
    streetName: string;
  };

const columns: InfiniteTablePropColumns<Developer> = {
  id: {
    field: "id",
    header: "ID",
    defaultWidth: 60,
    resizable: false,
    type: "number",
  },
  firstName: {
    field: "firstName",
    header: "First Name",
  },
  lastName: {
    field: "lastName",
    header: "Last Name",
  },
  country: {
    field: "country",
    defaultHiddenWhenGroupedBy: true,
  },
  city: {
    field: "city",
  },
  age: {
    field: "age",
    type: "number",
    header: "Age",
    defaultWidth: 80,
  },
  salary: {
    field: "salary",
  },
  currency: {
    field: "currency",
  },
  stack: {
    field: "stack",
  },
  hobby: {
    field: "hobby",
  },
  email: {
    field: "email",
  },
};
const url =
  "https://infinite-table.com/.netlify/functions/json-server/developers1k-sql";

const fetchDevelopers: DataSourceData<Developer> = ({
  filterValue,
  masterRowInfo,
}) => {
  if (masterRowInfo) {
    filterValue = [
      {
        field: "city",
        filter: {
          operator: "eq",
          type: "string",
          value: (masterRowInfo.data as City).name,
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
              value:
                filter.type === "number" ? Number(filter.value) : filter.value,
            };
          })
        )
      : null,
  ]
    .filter(Boolean)
    .join("&");
  return fetch(`${url}?${args}`)
    .then((res) => res.json())
    .then((data) => data as Developer[]);
};

const domProps: HTMLProps<HTMLDivElement> = {
  style: {
    flex: 1,
  },
};

type City = {
  id: number;
  name: string;
  country: string;
};

const cityColumns: InfiniteTablePropColumns<City> = {
  id: {
    field: "id",
    type: "number",
    header: "ID",
    defaultWidth: 80,
    renderRowDetailIcon: true,
  },
  city: {
    field: "name",
    header: "City",
  },
  country: {
    field: "country",
    header: "Country",
  },
};

function renderDetail() {
  return (
    <DataSource<Developer> data={fetchDevelopers} primaryKey="id">
      <InfiniteTable<Developer>
        columns={columns}
        domProps={domProps}
        columnDefaultWidth={120}
      />
    </DataSource>
  );
}

  return (
    <Card>
    <DataSource<City> primaryKey={"id"} data={cities}>
      <InfiniteTable<City>
        columns={cityColumns}
        domProps={domProps}
        rowDetailRenderer={renderDetail}
      ></InfiniteTable>
    </DataSource>
    </Card>
  )
}
  
  export default CiudadPage