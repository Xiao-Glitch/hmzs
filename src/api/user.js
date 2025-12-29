import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */

// 函数: 参数 + 逻辑 + 返回值
export function loginAPI(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

/**
 *
 * @param {*} params {name: string, page: string, pageSize: string}
 * @returns
 */
export function getEnterPriseAPI(params) {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}

/**
 *
 * @param {*} id string
 * @returns
 */
export function delEnterPriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}
