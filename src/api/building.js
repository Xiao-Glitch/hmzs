import request from '@/utils/request'

/**
 * 获取楼宇列表
 * @param {*} params
 * @returns
 */
export function getBuildingListAPI(params) {
  return request({
    url: '/park/building',
    params
  })
}

/**
 * 获取楼宇详情
 * @param {*} id
 * @returns
 */

export function getBuildingRentListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 获取楼宇详情
 * @param {*} id
 * @returns
 */

export function addBuildingAP(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}


export function getBuildingDetailAPI(id) {
  return request({
    url: `/park/building/${id}`
  })
}

/**
 * 修改楼宇
 * @param {*} data
 * @returns
 */

export function updateBuildingAPI(data) {
  return request({
    url: '/park/building',
    method: 'PUT',
    data
  })
}

/**
 * 删除楼宇
 * @param {*} id
 * @returns
*/

export function delBuildingAPI(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}
