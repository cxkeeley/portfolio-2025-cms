export enum StorageKeyEnum {
  ACTIVE_CLINIC_ID = 'gws-active-clinic-id',
  ACTIVE_VIEW_MODE = 'gws-active-view-mode',
  AUTH_TOKEN = 'gws-auth-token',
  I18N_CONFIG = 'gws-i18n-config',
}

interface IStorageUtil {
  set: <T>(key: StorageKeyEnum, value: T) => void

  get: <T>(key: StorageKeyEnum) => T | null

  remove: (key: StorageKeyEnum) => void

  reset: () => void
}

const StorageUtil: IStorageUtil = {
  set: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  },

  get: (key) => {
    const rawValue = window.localStorage.getItem(key)
    if (rawValue) {
      return JSON.parse(rawValue)
    }
    return null
  },

  remove: (key) => {
    window.localStorage.removeItem(key)
  },

  reset: () => {
    Object.values(StorageKeyEnum).forEach((value) => {
      StorageUtil.remove(value)
    })
  },
}

export default StorageUtil
