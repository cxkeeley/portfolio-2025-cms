import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal, { ModalProps } from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import { TextInputField } from '@components/Form/TextInput'
import FormControl from '@components/FormControl/FormControl'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

import LanguageSelectField from './LanguageSelectField'

type CategoryLanguageCreateFormModalShape = {
  category_id: string
  language_id?: Option
  name: string
}

type CategoryLanguageCreateFormModalProps = ModalProps & {
  initialValues?: Partial<CategoryLanguageCreateFormModalShape>
  categoryId: ID
  onSubmit: (values: CategoryLanguageCreateFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const CategoryLanguageCreateFormModal: FC<CategoryLanguageCreateFormModalProps> = ({
  categoryId,
  initialValues,
  onSubmit,
  onCancel,
  onHide: _onHide,
  ...modalProps
}) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    // reset state
    setError(undefined)

    _onHide()
  }

  return (
    <Modal
      size="lg"
      centered
      onHide={onHide}
      {...modalProps}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">
          <FormattedMessage id="category_language.modal.create_category_title" />
        </Modal.Title>
      </Modal.Header>

      <Formik<CategoryLanguageCreateFormModalShape>
        initialValues={{
          category_id: categoryId as string,
          name: '',
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
                      <FormattedMessage id="model.language" />
                    </FormControl.Label>
                    <LanguageSelectField
                      categoryId={categoryId}
                      name="language_id"
                    />
                    <FormControl.ErrorMessage message={errors.language_id} />
                  </FormControl>
                </Col>

                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="category_language.label.name" />
                    </FormControl.Label>
                    <TextInputField name="name" />
                    <FormControl.ErrorMessage message={errors.name} />
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

export type { CategoryLanguageCreateFormModalProps, CategoryLanguageCreateFormModalShape }

export default CategoryLanguageCreateFormModal
