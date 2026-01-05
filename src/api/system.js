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

/**
 * 获取当前角色权限点列表
 * @param {*} roleId
 * @returns
 */

export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}

/**
 * 获取当前角色用户列表
 * @param {*} roleId
 * @returns
 */
export function getRoleUserAPI(roleId) {
  return request({
    url: `/park/sys/roleUser/${roleId}`
  })
}

/**
 * 添加角色
 * @param {*} data
 * @returns
 */

export function addRoleAPI(data) {
  return request({
    url: '/park/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 编辑角色
 * @param {*} data
 * @returns
 */
export function editRoleAPI(data) {
  return request({
    url: '/park/sys/role',
    method: 'PUT',
    data
  })
}
