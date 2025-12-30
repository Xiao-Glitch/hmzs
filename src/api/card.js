import request from '@/utils/request'

/**
 *
 * @param {*} params { page, pageSize }
 * @returns
 */
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'GET',
    params
  })
}

export function createCardAPI(params) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data: params
  })
}
