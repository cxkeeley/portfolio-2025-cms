import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminCategoryAPI, { PayloadCreateCategory } from '@api/admin/categoriesAPI'

import { CategoryCreateForm, CategoryCreateFormShape } from '@modules/category/components/CategoryCreateForm'

import FormUtil from '@/utils/formUtil'

const CategoryCreatePage: FC = () => {
  const navigate = useNavigate()

  const onSubmit = async (values: CategoryCreateFormShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadCreateCategory>(values), {
      image_file_path: (v) => v ?? null,
    })

    const response = await AdminCategoryAPI.create(payload)

    if (response.data.data?.category) {
      navigate(`/admin/categories/${response.data.data.category.id}`)
    } else {
      navigate('/admin/categories')
    }
  }

  return (
    <CategoryCreateForm
      onSubmit={onSubmit}
      onCancel={() => navigate(-1)}
    />
  )
}

export default CategoryCreatePage
