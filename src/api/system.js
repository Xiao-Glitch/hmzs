import request from '@/utils/request'

/**
 * 获取角色列表
 * @param { page, pageSize } params
 * @returns
 */

export function getRoleListAPI(params) {
  return request({
    url: '/park/sys/role',
    params
  })
}

/**
 * 获取权限树
 * @returns
 */
export function getTreeListAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}
