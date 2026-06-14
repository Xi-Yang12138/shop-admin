import axios from '~/axios'

export function updateProductSkus(id, data) {
    return axios.post(`/admin/goods/updateskus/${id}`, data)
}

export function createSkuCard(data) {
    return axios.post('/admin/goods_skus_card', data)
}

export function updateSkuCard(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}`, data)
}

export function deleteSkuCard(id) {
    return axios.post(`/admin/goods_skus_card/${id}/delete`)
}

export function sortSkuCards(sortdata) {
    return axios.post('/admin/goods_skus_card/sort', { sortdata })
}

export function createSkuValue(data) {
    return axios.post('/admin/goods_skus_card_value', data)
}

export function updateSkuValue(id, data) {
    return axios.post(`/admin/goods_skus_card_value/${id}`, data)
}

export function deleteSkuValue(id) {
    return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}

export function setSkuCardValues(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}/set`, data)
}

// helper: fetch sku cards for a goods (not specified in docs but useful)
// NOTE: getSkuCards and getSkuCardValues removed intentionally.
