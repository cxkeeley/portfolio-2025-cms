import { FC } from 'react'

import { KTCard } from '../KTCard'

type ErrorCardProps = {
  title?: string
  message?: string
}

const ErrorCard: FC<ErrorCardProps> = ({
  title = 'System Error',
  message = 'Something went wrong! Please try again later',
}) => {
  return (
    <KTCard>
      <KTCard.Body className="text-center py-20">
        <i className="fa-solid fa-circle-exclamation text-danger fs-4hx mb-5" />
        <h1>{title}</h1>
        <p className="text-muted fw-medium fs-5">{message}</p>
      </KTCard.Body>
    </KTCard>
  )
}

export default ErrorCard

export type { ErrorCardProps }
