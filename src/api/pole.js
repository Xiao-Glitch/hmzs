import request from '@/utils/request'

export function getPoleListAPI(pramas) {
  return request({
    url: '/pole/info/list',
    method: 'GET',
    params: pramas
  })
}

export function editPoleAPI(data) {
  return request({
    url: '/pole/info',
    method: 'PUT',
    data
  })
}


export function addPoleAPI(data) {
  return request({
    url: '/pole/info',
    method: 'POST',
    data
  })
}

export function delPoleAPI(ids) {
  return request({
    url: `/pole/info/${ids}`,
    method: 'DELETE'
  })
}


export function getAreaDropListAPI() {
  return request({
    url: '/parking/area/dropList'
  })
}
