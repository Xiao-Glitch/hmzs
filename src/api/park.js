import request from '@/utils/request'

/**
 * 获取企业列表
 * @param {*} params {
 *      name: '',
*       page: 1,
*       pageSize: 10
*     }
 * @returns
 */
export function getListAPI(params) {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}
