import { createContext, Dispatch, SetStateAction, useContext } from 'react'

import { AsideTab } from '../model'

type AsideContextProps = {
  tabs: Array<AsideTab>
  activeTab?: AsideTab
  setActiveTab: Dispatch<SetStateAction<AsideTab | undefined>>
  maximize: () => void
  minimize: () => void
  toggleMinimize: () => void
}

const AsideContext = createContext<AsideContextProps>({
  tabs: [],
  setActiveTab: () => null,
  maximize: () => null,
  minimize: () => null,
  toggleMinimize: () => null,
})

const useAside = () => useContext(AsideContext)

export { AsideContext, useAside }

export type { AsideContextProps }
