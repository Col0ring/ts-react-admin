import request from '@/utils/request'
import Response from '@/interface/Response'

export function reqGetCategoryList(parentId: string): Response {
  return request({
    url: '/manage/category/list',
    method: 'get',
    params: {
      parentId
    }
  })
}

export function reqGetCategory(categoryId: string): Response {
  return request({
    url: '/manage/category/info',
    method: 'get',
    params: {
      categoryId
    }
  })
}

export function reqAddCategory(form: {
  categoryName: string
  parentId: string
}): Response {
  return request({
    url: '/manage/category/add',
    method: 'post',
    data: form
  })
}

export function reqUpdateCategory(form: {
  categoryName: string
  categoryId: string
}): Response {
  return request({
    url: '/manage/category/update',
    method: 'post',
    data: form
  })
}
