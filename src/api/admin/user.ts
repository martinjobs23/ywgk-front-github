import request from '@/utils/request'
import { sm2 } from 'sm-crypto'

export function getList(data: any) {
  return request({
    url: '/user/list',
    method: 'post',
    data,
  })
}

export function getPage(data: any) {
  return request({
    url: '/user/page',
    method: 'post',
    data,
  })
}

function sm2encrypt(data: any) {
  // sm2加密
  const cipherMode = 1
  const public_key =
    '04dbad1b2252d98d00f6f6821ef5183e593f98cb75eb91d2ec05461f6d39c04847db4a9d3f4edcb39521a4d94d5d8d6fddcb2c0eec46447e3c11088dea9bd6bd33'

  if (data.password != undefined) {
    const password_sm2 = sm2.doEncrypt(data.password, public_key, cipherMode)
    data.password = password_sm2
  }
}

export function doAdd(data: any) {
  //密码SM2加密
  sm2encrypt(data)

  return request({
    url: '/user/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  //密码SM2加密
  sm2encrypt(data)

  return request({
    url: '/user/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/user/delete',
    method: 'post',
    data,
  })
}
