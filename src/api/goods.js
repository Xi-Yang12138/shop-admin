import axios from '~/axios'

export function getGoodsList(page = 1, params = {}) {
    return axios.get(`/admin/goods/${page}`, {
        params: {
            tab: params.tab || 'all',
            title: params.title || undefined,
            category_id: params.category_id || undefined,
            limit: params.limit || 10,
        }
    })
}

export function createGoods(data) {
    return axios.post('/admin/goods', data)
}

export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)
}

export function changeGoodsStatus(ids, status) {
    return axios.post('/admin/goods/changestatus', { ids, status })
}

export function deleteGoods(ids) {
    return axios.post('/admin/goods/delete_all', {
        ids: Array.isArray(ids) ? ids : [ids]
    })
}

export function restoreGoods(ids) {
    return axios.post('/admin/goods/restore', {
        ids: Array.isArray(ids) ? ids : [ids]
    })
}

export function destroyGoods(ids) {
    return axios.post('/admin/goods/destroy', {
        ids: Array.isArray(ids) ? ids : [ids]
    })
}

export function checkGoods(id, ischeck) {
    return axios.post(`/admin/goods/${id}/check`, { ischeck })
}

export function updateGoodsBanners(id, banners) {
    return axios.post(`/admin/goods/banners/${id}`, { banners })
}

export function readGoods(id) {
    return axios.get(`/admin/goods/read/${id}`)
}
