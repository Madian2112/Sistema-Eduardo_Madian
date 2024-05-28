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
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    label: 'Generales',
    icon: mdiViewList,
    menu: [
      {
        href: '/telefonos',
        label: 'Telefono',
        icon: mdiTable,
      },
      {
        href: '/departamento',
        icon: mdiMonitor,
        label: 'Departamento',
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
      },
    ],
  },

]

export default menuAside
