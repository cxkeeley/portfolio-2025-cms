import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminArticlesAPI from '@api/admin/articlesAPI'

import { Option } from '@models/option'

import AlertErrorForm from '@components/AlertErrorForm'
import { Button } from '@components/Button'
import { ImageUploadField } from '@components/Form/ImageUpload'
import { TextInputField } from '@components/Form/TextInput'
import FormControl from '@components/FormControl/FormControl'
import { FormSection } from '@components/FormSection'
import { KTCard } from '@components/KTCard'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import ArticleCategorySelectField from '../ArticleCategorySelectField'

type ArticleUpdateFormShape = {
  author_name: string
  image_file_path: string | null
  category_id: Option | null
  reviewer: string | null
}

type Props = {
  initialValues?: ArticleUpdateFormShape
  initialImageSrc?: string
  onSubmit: (values: ArticleUpdateFormShape) => Promise<unknown>
  onCancel: () => void
}

const ArticleUpdateForm: FC<Props> = ({ initialValues, initialImageSrc, onSubmit, onCancel }) => {
  const intl = useIntl()
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <KTCard>
      <Formik<ArticleUpdateFormShape>
        initialValues={{
          author_name: '',
          image_file_path: '',
          reviewer: null,
          category_id: null,
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
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <KTCard.Body>
              <AlertErrorForm
                show={!!error}
                message={error!}
                className="mb-10"
              />

              <FormSection
                title={intl.formatMessage({ id: 'article.form.section_general_title' })}
                description={intl.formatMessage({ id: 'article.form.section_general_description' })}
                isEndOfChild
              >
                <Row className="gap-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article_language.label.image" />
                      </FormControl.Label>
                      <ImageUploadField
                        name="image_file_path"
                        uploadFn={AdminArticlesAPI.uploadImage}
                        initialImageSrc={initialImageSrc}
                        accessor={({ data }) => data.data?.path}
                        cropWidth={600}
                        maxFileSize={1 * 1024 * 1024} // 1 MB
                        minResolutionWidth={600}
                        minResolutionHeight={(600 * 2) / 3}
                        aspectRatio={3 / 2}
                      />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article.label.author_name" />
                      </FormControl.Label>
                      <TextInputField name="author_name" />
                      <FormControl.ErrorMessage message={formik.errors.author_name} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="article.label.reviewer" />
                      </FormControl.Label>
                      <TextInputField name="reviewer" />
                      <FormControl.ErrorMessage message={formik.errors.author_name} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label isRequired>
                        <FormattedMessage id="model.category" />
                      </FormControl.Label>
                      <ArticleCategorySelectField name="category_id" />
                      <FormControl.ErrorMessage message={formik.errors.category_id} />
                    </FormControl>
                  </Col>
                </Row>
              </FormSection>
            </KTCard.Body>

            <KTCard.Footer className="d-flex justify-content-end gap-3">
              <Button
                theme="secondary"
                disabled={formik.isSubmitting}
                onClick={onCancel}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                type="submit"
                theme="primary"
                isLoading={formik.isSubmitting}
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

export type { ArticleUpdateFormShape }

export default ArticleUpdateForm
