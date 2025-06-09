import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import AdminMainPageVideosAPI from '@api/admin/mainPageVideoAPI'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import { ToggleSwitchField } from '@components/Form/ToggleSwitch'
import { FormControl } from '@components/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import {
  MAIN_PAGE_VIDEO_CROP_WIDTH,
  MAIN_PAGE_VIDEO_MIN_RESOLUTION_HEIGHT,
  MAIN_PAGE_VIDEO_MIN_RESOLUTION_WIDTH,
  MAIN_PAGE_VIDEO_THUMBNAIL_ASPECT_RATIO,
  MAIN_PAGE_VIDEO_THUMNAIL_MAX_FILE_SIZE,
} from '@modules/main-page-video/constants'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

type MainPageVideoFormCardShape = {
  is_active: boolean
  thumbnail_file_path: string | undefined
  title: string
  uri: string
}

type MainPageVideoFormCardProps = {
  initialValues?: Partial<MainPageVideoFormCardShape>
  initialThumbnailSrc?: string
  onSubmit: (values: MainPageVideoFormCardShape) => Promise<void>
  onCancel: () => void
}

const MainPageVideoFormCard: FC<MainPageVideoFormCardProps> = ({
  initialValues,
  initialThumbnailSrc,
  onSubmit,
  onCancel,
}) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <KTCard>
      <Formik<MainPageVideoFormCardShape>
        initialValues={{
          title: '',
          uri: '',
          is_active: true,
          thumbnail_file_path: undefined,
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
            <KTCard.Body className="py-0">
              <AlertErrorForm
                show={!!error}
                message={error!}
                className="mb-10"
              />

              <FormSection
                title={<FormattedMessage id="form.section_general_title" />}
                description={
                  <FormattedMessage
                    id="form.section_general_description"
                    values={{
                      model: <FormattedMessage id="model.main_page_video" />,
                    }}
                  />
                }
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="main_page_video.label.title" />
                      </FormControl.Label>
                      <TextInputField name="title" />
                      <FormControl.ErrorMessage message={errors.title} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="main_page_video.label.uri" />
                      </FormControl.Label>
                      <TextInputField name="uri" />
                      <FormControl.ErrorMessage message={errors.uri} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="main_page_video.label.thumbnail" />
                      </FormControl.Label>
                      <PermissionsControl
                        allow={[PermissionEnum.ADMIN_MAIN_PAGE_VIDEO_UPLOAD_IMAGE]}
                        renderError
                      >
                        <ImageUploadField
                          initialImageSrc={initialThumbnailSrc}
                          name="thumbnail_file_path"
                          accept={['.png', '.jpg', '.jpeg', '.jfif']}
                          uploadFn={AdminMainPageVideosAPI.uploadImage}
                          cropperModalTitle={<FormattedMessage id="main_page_video.form.adjust_thumnail_image" />}
                          accessor={({ data }) => data.data?.path}
                          cropWidth={MAIN_PAGE_VIDEO_CROP_WIDTH}
                          maxFileSize={MAIN_PAGE_VIDEO_THUMNAIL_MAX_FILE_SIZE}
                          minResolutionWidth={MAIN_PAGE_VIDEO_MIN_RESOLUTION_WIDTH}
                          minResolutionHeight={MAIN_PAGE_VIDEO_MIN_RESOLUTION_HEIGHT}
                          aspectRatio={MAIN_PAGE_VIDEO_THUMBNAIL_ASPECT_RATIO}
                        />
                      </PermissionsControl>
                      <FormControl.ErrorMessage message={errors.thumbnail_file_path} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="main_page_video.label.active" />
                      </FormControl.Label>
                      <ToggleSwitchField name="is_active" />
                      <FormControl.ErrorMessage message={errors.is_active} />
                    </FormControl>
                  </Col>
                </Row>
              </FormSection>
            </KTCard.Body>

            <KTCard.Footer className="d-flex justify-content-end gap-3">
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

export type { MainPageVideoFormCardProps, MainPageVideoFormCardShape }

export default MainPageVideoFormCard
