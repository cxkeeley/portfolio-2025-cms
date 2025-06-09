import { FC, PropsWithChildren, ReactNode } from 'react'

import { KTCard } from '@components/KTCard'

import { EmptyContentPlaceholder } from '../EmptyContentPlaceholder'

type Props = {
  title: ReactNode
}

const EmptyContentCard: FC<PropsWithChildren<Props>> = ({ title, children }) => {
  return (
    <KTCard>
      <KTCard.Body className="text-center py-15">
        <EmptyContentPlaceholder.Illustration className="mb-1" />
        <EmptyContentPlaceholder.Title
          As="h4"
          className="mb-8"
        >
          {title}
        </EmptyContentPlaceholder.Title>

        {children}
      </KTCard.Body>
    </KTCard>
  )
}

export default EmptyContentCard
