import request from '@/utils/request'
import Response from '@/interface/Response'
import { IUserListItem } from '@/interface/User'

export function reqGetUserList(): Response {
  return request({
    url: '/manage/user/list',
    method: 'get'
  })
}

export function reqAddUser(form: IUserListItem): Response {
  return request({
    url: '/manage/user/add',
    method: 'post',
    data: form
  })
}

export function reqUpdateUser(
  form: Pick<IUserListItem, Exclude<keyof IUserListItem, 'password'>>
): Response {
  return request({
    url: '/manage/user/update',
    method: 'post',
    data: form
  })
}

export function reqDeleteUser(userId: string): Response {
  return request({
    url: '/manage/user/delete',
    method: 'post',
    data: {
      userId
    }
  })
}
