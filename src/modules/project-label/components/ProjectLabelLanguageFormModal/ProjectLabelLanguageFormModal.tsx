import { Form, Formik } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import { TextInputField } from '@components/Form/TextInput'
import FormControl from '@components/FormControl/FormControl'

import LanguageForProjectLabelLanguageSelectField from '@modules/language/components/LanguageForProjectLabelLanguageSelectField'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type ProjectLabelLanguageFormModalShape = FormShape<{
  language_id: Option
  name: string
}>

type ProjectLabelLanguageFormModalProps = {
  isShow: boolean
  modalTitle: React.ReactNode
  projectLabelId: ID
  initialValues?: Partial<ProjectLabelLanguageFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<ProjectLabelLanguageFormModalShape>>
  onSubmit: (values: ProjectLabelLanguageFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: ProjectLabelLanguageFormModalShape = {
  language_id: null,
  name: '',
}

const ProjectLabelLanguageFormModal: FC<ProjectLabelLanguageFormModalProps> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
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

      <Formik<ProjectLabelLanguageFormModalShape>
        initialValues={props.initialValues ?? defaultValues}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            setSubmitting(true)
            await props.onSubmit(values)
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
        {({ handleSubmit, isSubmitting, errors, dirty }) => (
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
                    <PermissionsControl
                      allow={[PermissionEnum.ADMIN_LANGUAGE_OPTION_FOR_PROJECT_LABEL_LANGUAGE_FORM]}
                      renderError
                    >
                      <LanguageForProjectLabelLanguageSelectField
                        projectLabelId={props.projectLabelId}
                        name="language_id"
                        isDisabled={props.disabledFields?.language_id}
                      />
                    </PermissionsControl>
                    <FormControl.ErrorMessage message={errors.language_id} />
                  </FormControl>
                </Col>

                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="vocabulary.name" />
                    </FormControl.Label>
                    <TextInputField
                      name="name"
                      isDisabled={props.disabledFields?.name}
                    />
                    <FormControl.ErrorMessage message={errors.name} />
                  </FormControl>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                theme="light"
                onClick={props.onCancel}
                disabled={isSubmitting}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                theme="primary"
                type="submit"
                disabled={!dirty}
                isLoading={isSubmitting}
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

export type { ProjectLabelLanguageFormModalShape }

export default ProjectLabelLanguageFormModal
