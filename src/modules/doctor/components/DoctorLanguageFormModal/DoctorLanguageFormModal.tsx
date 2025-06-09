import { Form, Formik } from 'formik'
import { FC, ReactNode, useState } from 'react'
import { Alert, Col, Modal, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import { TextInputField } from '@components/Form/TextInput'
import { TextareaField } from '@components/Form/Textarea'
import { FormControl } from '@components/FormControl'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

import DoctorLanguageSelectField from '../DoctorLanguageSelectField'

type DoctorLanguageFormShape = {
  language_id: Option | null
  quote: string | null
  quote_author: string | null
}

type Props = {
  initialValues?: DoctorLanguageFormShape
  isShow: boolean
  title: ReactNode
  doctorId: ID
  onSubmit: (values: DoctorLanguageFormShape) => Promise<void>
  onCancel: () => void
  onExited?: () => void
}

const DoctorLanguageFormModal: FC<Props> = ({
  initialValues,
  isShow,
  title,
  doctorId,
  onSubmit,
  onCancel,
  onExited,
}) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const initial: DoctorLanguageFormShape = {
    language_id: null,
    quote: null,
    quote_author: null,
    ...initialValues,
  }

  return (
    <Modal
      size="lg"
      centered
      show={isShow}
      onHide={onCancel}
      onExited={onExited}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{title}</Modal.Title>
      </Modal.Header>

      <Formik<DoctorLanguageFormShape>
        initialValues={initial}
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
                setError(err.response?.data.message || err.message)
              }
            } else {
              alert.error({ text: String(err) })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ handleSubmit, isSubmitting, dirty, errors }) => (
          <Form
            onSubmit={handleSubmit}
            noValidate
          >
            <Modal.Body className="scroll-y mx-5 mx-xl-15 my-7">
              <Alert
                show={TypeUtil.isDefined(error)}
                variant="danger"
                className="p-5 mb-10"
              >
                {error}
              </Alert>

              <Row className="gap-7">
                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="vocabulary.language" />
                    </FormControl.Label>
                    <DoctorLanguageSelectField
                      doctorId={doctorId}
                      name="language_id"
                    />
                    <FormControl.ErrorMessage message={errors.language_id} />
                  </FormControl>
                </Col>

                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label>
                      <FormattedMessage id="doctor_language.label.quote" />
                    </FormControl.Label>
                    <TextareaField
                      rows={5}
                      name="quote"
                    />
                    <FormControl.ErrorMessage message={errors.quote} />
                  </FormControl>
                </Col>

                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label>
                      <FormattedMessage id="doctor_language.label.quote_author" />
                    </FormControl.Label>
                    <TextInputField name="quote_author" />
                    <FormControl.ErrorMessage message={errors.quote_author} />
                  </FormControl>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                theme="light"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                theme="primary"
                type="submit"
                disabled={isSubmitting || !dirty}
                data-kt-indicator={isSubmitting ? 'on' : 'off'}
              >
                <FormattedMessage id="form.submit" />
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export type { DoctorLanguageFormShape }

export default DoctorLanguageFormModal
