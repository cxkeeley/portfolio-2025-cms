import { FC, ReactNode } from 'react'

import { ID } from '@models/base'
import LanguageModel, { LanguageCodeEnum } from '@models/language'

import LanguageTabButton from '../LanguageTabButton'

type LanguageTab = {
  id: ID
  code: LanguageCodeEnum
  name: string
  toolbar?: ReactNode
}

type LanguageTabSwitcherProps = {
  current: LanguageModel | null | undefined
  tabs: Array<LanguageTab>
  onChange: (language: LanguageTab, index: number) => void
}

const LanguageTabSwitcher: FC<LanguageTabSwitcherProps> = ({ current, tabs, onChange }) => {
  return (
    <div className="bg-body p-2 rounded d-inline-flex gap-2">
      {tabs.map((tab, i) => (
        <LanguageTabButton
          isActive={current?.code === tab.code}
          key={tab.id}
          code={tab.code}
          title={tab.name}
          toolbar={tab.toolbar}
          onClick={() => onChange(tab, i)}
        />
      ))}
    </div>
  )
}

export type { LanguageTabSwitcherProps, LanguageTab }

export default LanguageTabSwitcher
