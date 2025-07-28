import { Form, Formik } from 'formik'
import { FC, ReactNode, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Option } from '@models/option'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { FormControl } from '@components/FormControl'
import { KTCard } from '@components/KTCard'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import MainPageProjectGroupSelectField from '../MainPageProjectGroupSelectField/MainPageProjectGroupSelectField'

type MainPageProjectGroupFormCardShape = {
  project_group_id?: Option
}

type MainPageProjectGroupFormCardProps = {
  title: ReactNode
  initialValues?: Partial<MainPageProjectGroupFormCardShape>
  onSubmit: (values: MainPageProjectGroupFormCardShape) => Promise<void>
  onCancel: () => void
}

const MainPageProjectGroupFormCard: FC<MainPageProjectGroupFormCardProps> = ({
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
      <Formik<MainPageProjectGroupFormCardShape>
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
                      <FormattedMessage id="model.project_group" />
                    </FormControl.Label>
                    <MainPageProjectGroupSelectField name="project_group_id" />
                    <FormControl.ErrorMessage message={errors.project_group_id} />
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

export type { MainPageProjectGroupFormCardShape, MainPageProjectGroupFormCardProps }

export default MainPageProjectGroupFormCard
