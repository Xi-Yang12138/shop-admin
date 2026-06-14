import axios from '~/axios'

export function getOrderList(page, query = {}) {
    let q = []
    for (const key in query) {
        if (query[key] || query[key] === 0) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join('&')
    r = r ? '?' + r : ''
    return axios.get(`/admin/order/${page}${r}`)
}

export function deleteOrdersBulk(ids = []) {
    return axios.post('/admin/order/delete_all', { ids })
}

export function shipOrder(id, data) {
    return axios.post(`/admin/order/${id}/ship`, data)
}

export function handleOrderRefund(id, data) {
    return axios.post(`/admin/order/${id}/handle_refund`, data)
}

export function exportOrders(query = {}) {
    let q = []
    for (const key in query) {
        if (query[key] || query[key] === 0) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join('&')
    r = r ? '?' + r : ''
    return axios.post(`/admin/order/excelexport${r}`, {}, { responseType: 'blob' })
}

export function getExpressCompanies(page = 1) {
    return axios.get(`/admin/express_company/${page}`)
}

export function getShipInfo(id) {
    return axios.get(`/admin/order/${id}/get_ship_info`)
}
