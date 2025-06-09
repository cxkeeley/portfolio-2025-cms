import { useIntl } from 'react-intl'

import AdminLanguagesAPI from '@api/admin/languagesAPI'

import { initialQueryState } from '@models/apiBase'
import { ID } from '@models/base'
import { Option } from '@models/option'

import { AsyncPaginateSelectField, AsyncPaginateSelectFieldProps } from '@components/Form/AsyncPaginateSelect'

import TypeUtil from '@/utils/typeUtil'

type Props<IsMulti extends boolean> = Omit<AsyncPaginateSelectFieldProps<IsMulti>, 'onSearch'> & {
  articleId: ID
}

const ArticleLanguageSelectField = <IsMulti extends boolean = false>({ articleId, ...props }: Props<IsMulti>) => {
  const intl = useIntl()

  const handleSearch = async (keyword: string, page: number) => {
    const { data } = await AdminLanguagesAPI.getOptionsForArticleLanguageForm({
      ...initialQueryState,
      page,
      phrase: !TypeUtil.isEmpty(keyword) ? keyword : undefined,
      article_id: articleId,
    })

    if (data.data) {
      return {
        ...data.data,
        nodes: data.data.nodes.map(
          (node) =>
            new Option({
              label: node.name,
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
          id: 'article.placeholder.empty_language_option',
        })
      }}
    />
  )
}

export default ArticleLanguageSelectField
