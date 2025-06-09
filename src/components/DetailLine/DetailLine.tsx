import { FC } from 'react'
import { PropsWithChildren } from 'react'
import Col, { ColProps } from 'react-bootstrap/Col'
import Row, { RowProps } from 'react-bootstrap/Row'

const Line: FC<PropsWithChildren<RowProps>> = ({ children, ...props }) => {
  return (
    <Row
      className="mb-5 fs-6"
      {...props}
    >
      {children}
    </Row>
  )
}

const Label: FC<PropsWithChildren<ColProps>> = ({ children, md = 4, ...props }) => {
  return (
    <Col
      md={md}
      className="fs-6 text-gray-600"
      {...props}
    >
      {children}
    </Col>
  )
}

const Body: FC<PropsWithChildren<ColProps>> = ({ children, md = 8, ...props }) => {
  return (
    <Col
      md={md}
      className="fs-6 fw-medium text-dark"
      {...props}
    >
      {children}
    </Col>
  )
}

const DetailLine = Object.assign(Line, {
  Label,
  Body,
})

export { DetailLine }
