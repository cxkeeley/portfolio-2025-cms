import axios, { AxiosResponse } from 'axios'

import { Response } from '@models/apiBase'
import ArticleLanguageImageModel from '@models/articleLanguageImage'
import { ID } from '@models/base'

import { API_URL } from '@/constants/constant'

type ResponseArticleLanguageImage = Response<{ article_language_image: ArticleLanguageImageModel }>

type PayloadArticleLanguageImageUpload = {
  file: File
  article_language_id: ID
}

interface IAdminArticleLanguageImagesAPI {
  uploadImage: (payload: PayloadArticleLanguageImageUpload) => Promise<AxiosResponse<ResponseArticleLanguageImage>>
}

const ADMIN_ARTICLE_LANGUAGE_IMAGE_URL = `${API_URL}/admin/article-language-images`

const AdminArticleLanguageImagesAPI: IAdminArticleLanguageImagesAPI = {
  uploadImage: (payload) => {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('article_language_id', payload.article_language_id)

    return axios.post(`${ADMIN_ARTICLE_LANGUAGE_IMAGE_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default AdminArticleLanguageImagesAPI
