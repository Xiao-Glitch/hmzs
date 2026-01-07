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

/**
 * 获取员工列表
 * @param { page, pageSize} params
 * @returns
 */

export function getEmployeeListAPI(params) {
  return request({
    url: '/park/sys/user',
    params
  })
}

/**
 * 添加员工
 * @param {*} data
 * @returns
 */

export function createEmployeeAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 删除员工
 * @param {*} id
 * @returns
 */

export function delEmployeeAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}
