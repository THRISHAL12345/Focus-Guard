import StoreModule from 'electron-store'
import { Task, Settings, DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '../renderer/src/lib/constants'

interface StoreSchema {
  tasks: Task[]
  settings: Settings
  categories: string[]
  initialized: boolean
}

const Store = (StoreModule as unknown as { default: typeof StoreModule }).default || StoreModule

export const store = new Store<StoreSchema>({
  schema: {
    tasks: {
      type: 'array',
      default: []
    },
    settings: {
      type: 'object',
      default: DEFAULT_SETTINGS
    },
    categories: {
      type: 'array',
      default: DEFAULT_CATEGORIES
    },
    initialized: {
      type: 'boolean',
      default: false
    }
  }
})
