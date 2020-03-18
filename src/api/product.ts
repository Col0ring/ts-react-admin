import request from '@/utils/request'
import Response from '@/interface/Response'
import { IProductListItem } from '@/interface/Product'

export function reqGetProductList(pageNum: number, pageSize: number): Response {
  return request({
    url: '/manage/product/list',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function reqSearchProduct(
  pageNum: number,
  pageSize: number,
  searchName: string,
  searchType: 'productName' | 'productDesc'
): Response {
  return request({
    url: '/manage/product/search',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      [searchType]: searchName
    }
  })
}

export function reqUpdateProductStatus(form: {
  productId: string
  status: 1 | 2
}): Response {
  return request({
    url: '/manage/product/updateStatus',
    method: 'post',
    data: form
  })
}

export type AddProductForm = Pick<
  IProductListItem,
  Exclude<keyof IProductListItem, 'status' | '_id'>
>

export function reqAddProduct(form: AddProductForm): Response {
  return request({
    url: '/manage/product/add',
    method: 'post',
    data: form
  })
}

export type UpdateProductForm = Pick<
  IProductListItem,
  Exclude<keyof IProductListItem, 'status'>
>

export function reqUpdateProduct(form: UpdateProductForm): Response {
  return request({
    url: '/manage/product/update',
    method: 'post',
    data: form
  })
}
