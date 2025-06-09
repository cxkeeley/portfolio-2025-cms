import { Form, Formik } from 'formik'
import { FC, ReactNode, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage } from 'react-intl'

import { Option } from '@models/option'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { FormControl } from '@components/FormControl'
import { KTCard } from '@components/KTCard'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import { OurDoctorPageDoctorDoctorSelectField } from '../OurDoctorPageDoctorDoctorSelectField'

type OurDoctorPageDoctorFormCardShape = {
  doctor_id?: Option
}

type OurDoctorPageDoctorFormCardProps = {
  title: ReactNode
  initialValues?: Partial<OurDoctorPageDoctorFormCardShape>
  onSubmit: (values: OurDoctorPageDoctorFormCardShape) => Promise<void>
  onCancel: () => void
}

const OurDoctorPageDoctorFormCard: FC<OurDoctorPageDoctorFormCardProps> = ({
  title,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>{title}</KTCard.Title>
      </KTCard.Header>
      <Formik<OurDoctorPageDoctorFormCardShape>
        initialValues={{
          ...initialValues,
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            setSubmitting(true)

            await onSubmit(values)
          } catch (err) {
            if (AxiosUtil.isAxiosError(err)) {
              const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
              if (errors) {
                setErrors(errors)
              } else {
                setError(err.response?.data.message)
              }
            } else {
              alert.error({ text: String(err) })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ handleSubmit, errors, isSubmitting }) => (
          <Form
            onSubmit={handleSubmit}
            noValidate
          >
            <KTCard.Body>
              <AlertErrorForm
                show={!!error}
                message={error!}
                className="mb-10"
              />

              <Row>
                <Col>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="model.doctor" />
                    </FormControl.Label>
                    <OurDoctorPageDoctorDoctorSelectField name="doctor_id" />
                    <FormControl.ErrorMessage message={errors.doctor_id} />
                  </FormControl>
                </Col>
              </Row>
            </KTCard.Body>

            <KTCard.Footer className="d-flex justify-content-end py-6 px-9 gap-3">
              <Button
                theme="secondary"
                disabled={isSubmitting}
                onClick={onCancel}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                type="submit"
                theme="primary"
                isLoading={isSubmitting}
              >
                <FormattedMessage id="form.submit" />
              </Button>
            </KTCard.Footer>
          </Form>
        )}
      </Formik>
    </KTCard>
  )
}

export type { OurDoctorPageDoctorFormCardShape, OurDoctorPageDoctorFormCardProps }

export default OurDoctorPageDoctorFormCard
