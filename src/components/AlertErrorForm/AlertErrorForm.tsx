import { FC, useEffect, useRef } from 'react'
import { Alert } from 'react-bootstrap'

type Props = {
  show: boolean
  message: string
  className?: string
}

const AlertErrorForm: FC<Props> = ({ show, message, className }) => {
  const alertRef = useRef<HTMLDivElement>(null)
  const cachedMessage = useRef<string>()

  useEffect(() => {
    if (cachedMessage.current !== message) {
      cachedMessage.current = message

      alertRef.current?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [message])

  return (
    <Alert
      ref={alertRef}
      show={show}
      variant="danger"
      className={className}
    >
      {message}
    </Alert>
  )
}

export default AlertErrorForm
