import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import { TextInputField } from '@components/Form/TextInput'
import FormControl from '@components/FormControl/FormControl'

import LanguageForProjectImageLanguageFormSelectField from '@modules/language/components/LanguageForProjectImageLanguageFormSelectField'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormHiddenFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type ProjectImageLanguageFormModalShape = FormShape<{
  image_alt: string
  image_caption: string
  language_id: Option
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  projectImageId: ID
  initialImageSrc?: string
  initialValues?: Partial<ProjectImageLanguageFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<ProjectImageLanguageFormModalShape>>
  hiddenFields?: Partial<FormHiddenFlags<ProjectImageLanguageFormModalShape>>
  onSubmit: (values: ProjectImageLanguageFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: ProjectImageLanguageFormModalShape = {
  image_alt: '',
  image_caption: '',
}

const ProjectImageLanguageFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: ProjectImageLanguageFormModalShape,
    helpers: FormikHelpers<ProjectImageLanguageFormModalShape>
  ) => {
    try {
      helpers.setSubmitting(true)
      await props.onSubmit(values)
    } catch (err) {
      if (AxiosUtil.isAxiosError(err)) {
        const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
        if (errors) {
          helpers.setErrors(errors)
        } else {
          setError(err.response?.data.message || err.message)
        }
      } else {
        alert.error({ text: String(err) })
      }
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <Modal
      size="lg"
      centered={true}
      show={props.isShow}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{props.modalTitle}</Modal.Title>
      </Modal.Header>

      <Formik<ProjectImageLanguageFormModalShape>
        initialValues={props.initialValues ?? defaultValues}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form
            onSubmit={formik.handleSubmit}
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
                {!props.hiddenFields?.language_id && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="vocabulary.language" />
                      </FormControl.Label>
                      <LanguageForProjectImageLanguageFormSelectField
                        name="language_id"
                        projectImageId={props.projectImageId}
                        isDisabled={props.disabledFields?.language_id}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_alt} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.image_alt && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="project_image.label.image_alt" />
                      </FormControl.Label>
                      <TextInputField
                        name="image_alt"
                        isDisabled={props.disabledFields?.image_alt}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_alt} />
                    </FormControl>
                  </Col>
                )}

                {!props.hiddenFields?.image_caption && (
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="project_image.label.image_caption" />
                      </FormControl.Label>
                      <TextInputField
                        name="image_caption"
                        isDisabled={props.disabledFields?.image_caption}
                      />
                      <FormControl.ErrorMessage message={formik.errors.image_caption} />
                    </FormControl>
                  </Col>
                )}
              </Row>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                theme="light"
                onClick={props.onCancel}
                disabled={formik.isSubmitting}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                theme="primary"
                type="submit"
                disabled={!formik.dirty}
                isLoading={formik.isSubmitting}
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

export type { ProjectImageLanguageFormModalShape }

export default ProjectImageLanguageFormModal
