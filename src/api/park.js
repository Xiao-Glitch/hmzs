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

/**
 * 获取行业列表
 * @returns
 */

export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}

/**
 * 创建企业
 * @param {*} data
 * @returns
 */

export function createEnterPriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

/**
 * 查找企业
 * @param {*} params
 * @returns
 */

export function getEnterPriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}

/**
 * 编辑企业
 * @param {*} data
 * @returns
 */

export function updateEnterPriseAPI(data) {
  return request({
    url: `/park/enterprise`,
    method: 'PUT',
    data
  })
}

/**
 * 给当前企业添加合同
 * @param {*} data
 * @returns
 */

export function addRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

/**
 * 获取当前企业合同列表
 * @param {*} params
 * @returns
 */

export function getRentListAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'GET'
  })
}

/**
 *  退租合同
 * @param {*} rendId
 * @returns
 */
export function outRentAPI(rendId) {
  return request({
    url: `/park/enterprise/rent/${rendId}`,
    method: 'PUT'
  })
}

/**
 * 删除合同
 * @param {*} rendId
 * @returns
 */

export function delRentAPI(rendId) {
  return request({
    url: `/park/enterprise/rent/${rendId}`,
    method: 'DELETE'
  })
}
