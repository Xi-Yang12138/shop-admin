import axios from '~/axios'

export function getCouponList(page = 1, params = {}) {
  return axios.get(`/admin/coupon/${page}`, { params })
}

export function createCoupon(data) {
  return axios.post('/admin/coupon', data)
}

export function updateCoupon(id, data) {
  return axios.post(`/admin/coupon/${id}`, data)
}

export function deleteCoupon(id) {
  return axios.post(`/admin/coupon/${id}/delete`)
}

export function updateCouponStatus(id, status) {
  return axios.post(`/admin/coupon/${id}/update_status`, { status })
}
