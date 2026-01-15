import request from '@/utils/request'

/**
 * 获取缴费列表
 * @param {*} params
 * @returns
 */
export function getPaymentListAPI(params) {
  return request({
    url: '/parking/payment/list',
    method: 'GET',
    params
  })
}


export function getCar(id) {
  return request({
    url: '/parking/payment/detail',
    method: 'GET',
    params: {
      id
    }
  })
}
