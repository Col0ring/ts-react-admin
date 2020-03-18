import request from '@/utils/request'
import Response from '@/interface/Response'
import { IRoleListItem } from '@/interface/Role'

export function reqGetRoleList(): Response {
  return request({
    url: '/manage/role/list',
    method: 'get'
  })
}

export function reqAddRole(roleName: string): Response {
  return request({
    url: '/manage/role/add',
    method: 'post',
    data: {
      roleName
    }
  })
}

export function reqUpdateRole(role: IRoleListItem): Response {
  return request({
    url: '/manage/role/update',
    method: 'post',
    data: role
  })
}
