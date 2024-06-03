import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiVuejs,
  mdiCity, 
  mdiTrello, 
  mdiTrendingUp
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'


const menuAside: MenuAsideItem[] = [
  {
    label: 'Generales',
    icon: mdiViewList,
    menu: [
      {
        href: '/telefonos',
        label: 'Axio',
        icon: mdiTable,
      },
      {
        href: '/departamento',
        icon: mdiMonitor,
        label: 'Fetch',
      },
      {
        href: '/aldea',
        icon: mdiCity,
        label: 'Aldea',
      },
      {
        href: '/CiudadMasterDetails',
        icon: mdiCity,
        label: 'Ciudad',
      },
      {
        href: '/ecoTasa',
        icon: mdiMonitor,
        label: 'Eco Tasa',
      },
      {
        href: '/formasEnvio',
        icon: mdiMonitor,
        label: 'Formas de envio',
      },{
        href: '/PedidosOrden',
        icon: mdiMonitor,
        label: 'Orden de pedidos',
      },
    ],
  },

  {
    label: 'Importaciones',
    icon: mdiTrendingUp,
    menu: [
      {
        href: '/PedidosProduccion',
        label: 'Pedidos de Produccion',
        icon:  mdiTrello
        ,
      },
    ],
  },

]

export default menuAside
