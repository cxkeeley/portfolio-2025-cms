import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { FC, useCallback, useMemo, useState } from 'react'
import { Col, Row, Stack } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import AdminCategoryAPI, { PayloadUpdateCategory, ResponseCategory } from '@api/admin/categoriesAPI'
import AdminCategoryLanguagesAPI, {
  PayloadCreateCategoryLanguage,
  PayloadUpdateCategoryLanguage,
} from '@api/admin/categoryLanguagesAPI'

import CategoryLanguageModel from '@models/categoryLanguage'
import { LanguageCodeEnum } from '@models/language'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import {
  CategoryLanguageCreateFormModal,
  CategoryLanguageCreateFormModalShape,
} from '@modules/category-language/components/CategoryLanguageCreateFormModal'
import { CategoryLanguageDetailCard } from '@modules/category-language/components/CategoryLanguageDetailCard'
import {
  CategoryLanguageEditFormModal,
  CategoryLanguageEditFormModalShape,
} from '@modules/category-language/components/CategoryLanguageEditFormModal'
import { CategoryBannerImageCard } from '@modules/category/components/CategoryBannerImageCard'
import { CategoryEditFormModal, CategoryEditFormModalShape } from '@modules/category/components/CategoryEditFormModal'
import { PermissionsControl } from '@modules/permissions'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'
import React from 'react'

const CategoryDetailPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { categoryId } = useParams()
  const [showEditCategoryModalState, , showEditCategoryModal, hideEditCategoryModal] = useBoolState()
  const [showCategoryLanguageCreateModalState, , showCategoryLanguageCreateModal, hideCategoryLanguageCreateModal] =
    useBoolState()
  const [showCategoryLanguageEditModalState, , showCategoryLanguageEditModal, hideCategoryLanguageEditModal] =
    useBoolState()
  const [activeLanguageIndex, setActiveLanguageIndex] = useState(0)

  const {
    data: category,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [QUERIES.ADMIN_CATEGORY_DETAIL, categoryId],
    queryFn: ({ signal }) => AdminCategoryAPI.get(categoryId!, { signal }),
    select: (r) => (r as AxiosResponse<ResponseCategory>).data.data?.category,
    enabled: TypeUtil.isDefined(categoryId),
  })

  const handleEditCategory = async (values: CategoryEditFormModalShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadUpdateCategory>(values), {
      image_file_path: (v) => v ?? null,
    })
    await AdminCategoryAPI.update(categoryId!, payload)

    refetch()
    hideEditCategoryModal()
  }

  const handleCreateCategoryLanguage = async (values: CategoryLanguageCreateFormModalShape) => {
    const payload = FormUtil.parseValues<PayloadCreateCategoryLanguage>(values)
    const response = await AdminCategoryLanguagesAPI.create(payload).then((r) => r.data)

    if (response.data) {
      toast.success(
        intl.formatMessage(
          { id: 'category.alert.create_category_language_success' },
          { name: response.data.category_language.name }
        )
      )
      refetch()
      hideCategoryLanguageCreateModal()
    }
  }

  const handleEditCategoryLanguage = async (
    values: CategoryLanguageEditFormModalShape,
    editedCategoryLanguage: CategoryLanguageModel
  ) => {
    const payload = FormUtil.parseValues<PayloadUpdateCategoryLanguage>(values)
    const response = await AdminCategoryLanguagesAPI.update(editedCategoryLanguage.id, payload).then((r) => r.data)

    if (response.data) {
      toast.success(
        intl.formatMessage(
          { id: 'category.alert.edit_category_language_success' },
          { name: editedCategoryLanguage?.language?.name }
        )
      )
      refetch()
      hideCategoryLanguageEditModal()
    }
  }

  const handleDelete = useCallback(
    async (categoryLanguage: CategoryLanguageModel, index: number) => {
      const { isConfirmed } = await alert.question({
        text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: categoryLanguage.language?.name }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (isConfirmed) {
        try {
          await AdminCategoryLanguagesAPI.delete(categoryLanguage.id)

          refetch()
          // realign active language index
          if (index <= activeLanguageIndex) {
            setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }

          toast.success(
            intl.formatMessage(
              { id: 'category.alert.delete_category_language_success' },
              { name: categoryLanguage.language?.name }
            )
          )
        } catch (err) {
          if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
            alert.error({ text: err.response.data.message })
          } else {
            alert.error({ text: String(err) })
          }
        }
      }
    },
    [activeLanguageIndex, alert, intl, refetch, toast]
  )

  const languages = useMemo<Array<LanguageTab>>(() => {
    if (category?.languages) {
      return category.languages
        .filter((categoryLanguage) => TypeUtil.isDefined(categoryLanguage.language))
        .map((categoryLanguage, i) => ({
          id: categoryLanguage.language!.id,
          code: categoryLanguage.language!.code,
          name: categoryLanguage.language!.name,
          toolbar: categoryLanguage.language!.code !== DEFAULT_LANGUAGE && (
            <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_DELETE}>
              <LanguageTabDeleteButton onClick={() => handleDelete(categoryLanguage, i)} />
            </PermissionsControl>
          ),
        }))
    }
    return []
  }, [category?.languages, handleDelete])

  if (category) {
    const activeLanguage = category?.languages?.at(activeLanguageIndex)
    const canAddLanguage = languages.length < Object.values(LanguageCodeEnum).length
    const hasLanguages = languages.length > 0

    return (
      <Row>
        <Col xs={8}>
          <CategoryBannerImageCard
            bannerImageSrc={category.file.link}
            toolbar={
              <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_UPDATE}>
                <Button
                  variant="light"
                  theme="primary"
                  onClick={showEditCategoryModal}
                >
                  <i className="fa-solid fa-pen" />
                  <FormattedMessage id="vocabulary.edit" />
                </Button>

                <CategoryEditFormModal
                  initialBannerImage={category.file}
                  show={showEditCategoryModalState}
                  onCancel={hideEditCategoryModal}
                  onSubmit={handleEditCategory}
                />
              </PermissionsControl>
            }
          />
        </Col>

        <Col xs={8}>
          {hasLanguages ? (
            <React.Fragment>
              <div className="mb-6">
                <div className="d-flex align-items-center gap-4">
                  <LanguageTabSwitcher
                    current={activeLanguage?.language}
                    tabs={languages}
                    onChange={(_, index) => setActiveLanguageIndex(index)}
                  />

                  {canAddLanguage && (
                    <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_CREATE}>
                      <Button
                        theme="primary"
                        onClick={showCategoryLanguageCreateModal}
                        disabled={!canAddLanguage}
                      >
                        <i className="fa-solid fa-plus" />
                        <FormattedMessage id="category.button.add_language" />
                      </Button>

                      <CategoryLanguageCreateFormModal
                        categoryId={category.id}
                        show={showCategoryLanguageCreateModalState}
                        onHide={hideCategoryLanguageCreateModal}
                        onCancel={hideCategoryLanguageCreateModal}
                        onSubmit={handleCreateCategoryLanguage}
                      />
                    </PermissionsControl>
                  )}
                </div>
              </div>

              {activeLanguage && (
                <React.Fragment>
                  <CategoryLanguageDetailCard
                    categoryLanguage={activeLanguage}
                    toolbar={
                      <Stack
                        direction="horizontal"
                        gap={3}
                      >
                        <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_UPDATE}>
                          <Button
                            theme="primary"
                            variant="light"
                            onClick={showCategoryLanguageEditModal}
                          >
                            <i className="fa-solid fa-pen" />
                            <FormattedMessage id="vocabulary.edit" />
                          </Button>
                        </PermissionsControl>
                      </Stack>
                    }
                  />

                  <CategoryLanguageEditFormModal
                    language={activeLanguage.language!}
                    initialValues={{
                      name: activeLanguage.name,
                      slug: activeLanguage.slug,
                    }}
                    show={showCategoryLanguageEditModalState}
                    onHide={hideCategoryLanguageEditModal}
                    onCancel={hideCategoryLanguageEditModal}
                    onSubmit={(values) => handleEditCategoryLanguage(values, activeLanguage)}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <EmptyContentCard title={<FormattedMessage id="category_language.placeholder.empty_category_language" />}>
              <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_CREATE}>
                <Button
                  theme="primary"
                  onClick={showCategoryLanguageCreateModal}
                  disabled={!canAddLanguage}
                >
                  <i className="fa-solid fa-plus" />
                  <FormattedMessage id="category.button.add_language" />
                </Button>

                <CategoryLanguageCreateFormModal
                  categoryId={category.id}
                  show={showCategoryLanguageCreateModalState}
                  onHide={hideCategoryLanguageCreateModal}
                  onCancel={hideCategoryLanguageCreateModal}
                  onSubmit={handleCreateCategoryLanguage}
                />
              </PermissionsControl>
            </EmptyContentCard>
          )}
        </Col>
      </Row>
    )
  }

  if (isFetching && isLoading) {
    return <FloatLoadingIndicator />
  }

  if (isError) {
    return <ErrorCard />
  }

  return null
}

export default CategoryDetailPage
