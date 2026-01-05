import request from '@/utils/request'

/**
 * 获取停车规则列表
 * @param {*} params
 * @returns
 */
export function getRuleListAPI(params) {
  return request({
    url: '/parking/rule/list',
    method: 'GET',
    params
  })
}
