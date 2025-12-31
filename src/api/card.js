import request from '@/utils/request'

/**
 *获取月卡信息列表
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

/**
 *添加月卡
 * @param {*} params
 * @returns
 */
export function createCardAPI(params) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data: params
  })
}

/**
 *获取月卡详情
 * @param {*} id
 * @returns
 */
export function getDetailAPI(id) {
  return request({
    url: '/parking/card/' + id
  })
}

/**
 *编辑月卡
 * @param {*} params
 * @returns
 */
export function updateCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}

/**
 * 删除月卡
 * @param {*} id
 * @returns
 */
export function delCardAPI(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'DELETE'
  })
}

/**
 * 删除选中月卡
 * @param {*} ids
 * @returns
 */
export function delAllCardAPI(ids) {
  return request({
    url: `/parking/card/${ids}`,
    method: 'DELETE'
  })
}
