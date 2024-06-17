import request from '@/utils/request'
import { sm2 } from 'sm-crypto'

export async function login(data: any) {
  return request({
    url: '/login/passwordLogin',
    method: 'post',
    data,
  })
}
export async function checkLogCount() {
  return request({
    url: '/login/checkLogCount',
    method: 'post',
  })
}

export async function socialLogin(data: any) {
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/login/userInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'get',
  })
}

/*
export function register(data: any) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}
*/

export function isFirstLogin(data: any) {
  return request({
    url: '/login/isFirstLogin',
    method: 'post',
    data,
  })
}

export function setPassword(data: any) {
  const form2 = {}
  form2['username'] = data.username
  form2['type'] = data.type

  // sm2加密
  const cipherMode = 1
  const public_key =
    '04dbad1b2252d98d00f6f6821ef5183e593f98cb75eb91d2ec05461f6d39c04847db4a9d3f4edcb39521a4d94d5d8d6fddcb2c0eec46447e3c11088dea9bd6bd33'

  const en_data = sm2.doEncrypt(data.password, public_key, cipherMode)
  form2['password'] = en_data

  if (data.oldpassword != undefined) {
    const oldpassword_sm2 = sm2.doEncrypt(
      data.oldpassword,
      public_key,
      cipherMode
    )
    form2['oldpassword'] = oldpassword_sm2
  }

  return request({
    url: '/user/changePassword',
    method: 'post',
    data: form2,
  })
}
