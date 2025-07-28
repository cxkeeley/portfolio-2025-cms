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

import { MainPageTeamTeamSelectField } from '../MainPageTeamTeamSelectField'

type MainPageTeamFormCardShape = {
  team_id?: Option
}

type MainPageTeamFormCardProps = {
  title: ReactNode
  initialValues?: Partial<MainPageTeamFormCardShape>
  onSubmit: (values: MainPageTeamFormCardShape) => Promise<void>
  onCancel: () => void
}

const MainPageTeamFormCard: FC<MainPageTeamFormCardProps> = ({ title, initialValues, onSubmit, onCancel }) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <KTCard>
      <KTCard.Header>
        <KTCard.Title>{title}</KTCard.Title>
      </KTCard.Header>
      <Formik<MainPageTeamFormCardShape>
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
                      <FormattedMessage id="model.team" />
                    </FormControl.Label>
                    <MainPageTeamTeamSelectField name="team_id" />
                    <FormControl.ErrorMessage message={errors.team_id} />
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

export type { MainPageTeamFormCardShape, MainPageTeamFormCardProps }

export default MainPageTeamFormCard
