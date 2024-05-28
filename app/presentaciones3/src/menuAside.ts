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
        label: 'Axio',
        icon: mdiTable,
      },
      {
        href: '/departamento',
        icon: mdiMonitor,
        label: 'Fetch',
      },
    ],
  },

]

export default menuAside
