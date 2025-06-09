import { useIntl } from 'react-intl'

import AdminCategoriesAPI from '@api/admin/categoriesAPI'

import { initialQueryState } from '@models/apiBase'
import { Option } from '@models/option'

import { AsyncPaginateSelectField, AsyncPaginateSelectFieldProps } from '@components/Form/AsyncPaginateSelect'

import TypeUtil from '@/utils/typeUtil'

type Props<IsMulti extends boolean> = Omit<AsyncPaginateSelectFieldProps<IsMulti>, 'onSearch'>

const ArticleCategorySelectField = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const intl = useIntl()

  const handleSearch = async (keyword: string, page: number) => {
    const { data } = await AdminCategoriesAPI.getOptionsForArticleForm({
      ...initialQueryState,
      page,
      phrase: !TypeUtil.isEmpty(keyword) ? keyword : undefined,
    })

    if (data.data) {
      return {
        ...data.data,
        nodes: data.data.nodes.map(
          (node) =>
            new Option({
              label: node.default_name ?? '',
              value: node.id,
            })
        ),
      }
    }
  }

  return (
    <AsyncPaginateSelectField
      {...props}
      onSearch={handleSearch}
      noOptionsMessage={() => {
        return intl.formatMessage({
          id: 'article.placeholder.empty_category_option',
        })
      }}
    />
  )
}

export default ArticleCategorySelectField
