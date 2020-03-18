import store from 'store'
import { IUserListItem } from '@/interface/User'
import { IRoleListItem } from '@/interface/Role'
export type LoginUser = IUserListItem & { role?: IRoleListItem }
const auth_key = 'user_key'

export function setUser(user: LoginUser) {
  store.set(auth_key, user)
}

export function getUser(): LoginUser {
  return store.get(auth_key) || {}
}

export function removeUser() {
  store.remove(auth_key)
}
