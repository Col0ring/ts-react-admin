import { Action, Dispatch } from 'redux'
import { SET_HEAD_TITLE, GET_USER_INFO, REMOVE_USER } from './action-types'
import { reqLogin } from '@/api/admin'
import { setUser, removeUser } from '@/utils/auth'
import { LoginUser } from '@/utils/auth'
export type ActionType<T = any> = Action<string> & { data: T }

export function setHeadTitle(headTitle: string): ActionType<string> {
  return {
    type: SET_HEAD_TITLE,
    data: headTitle
  }
}

export function getUserInfo(user: LoginUser): ActionType<LoginUser> {
  return {
    type: GET_USER_INFO,
    data: user
  }
}

export function logout(): ActionType<LoginUser> {
  removeUser()
  return {
    type: REMOVE_USER,
    data: {} as LoginUser
  }
}

// 登录的异步action,cb接收回调
export function login(
  form: { username: string; password: string },
  cb?: () => void
) {
  return async (dispatch: Dispatch) => {
    const res = await reqLogin(form)
    if (res) {
      const user = res.data.data
      setUser(user)
      dispatch(getUserInfo(user))
    } else {
      cb && cb()
    }
  }
}
