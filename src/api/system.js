import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} params
 * @returns
 */

export function getRoleListAPI(params) {
  return request({
    url: '/park/sys/role',
    params
  })
}
