import axios from '~/axios'

export function getUserList(page, query = {}) {
    let q = []
    for (const key in query) {
        if (query[key] || query[key] === 0) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join('&')
    r = r ? '?' + r : ''
    return axios.get(`/admin/user/${page}${r}`)
}

export function updateUserStatus(id, status) {
    return axios.post(`/admin/user/${id}/update_status`, { status })
}

export function createUser(data) {
    return axios.post(`/admin/user`, data)
}

export function updateUser(id, data) {
    return axios.post(`/admin/user/${id}`, data)
}

export function deleteUser(id) {
    return axios.post(`/admin/user/${id}/delete`)
}

// 会员等级相关接口
export function getUserLevelList(page, query = {}) {
    let q = []
    for (const key in query) {
        if (query[key] || query[key] === 0) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join('&')
    r = r ? '?' + r : ''
    return axios.get(`/admin/user_level/${page}${r}`)
}

export function createUserLevel(data) {
    return axios.post(`/admin/user_level`, data)
}

export function updateUserLevel(id, data) {
    return axios.post(`/admin/user_level/${id}`, data)
}

export function updateUserLevelStatus(id, status) {
    return axios.post(`/admin/user_level/${id}/update_status`, { status })
}

export function deleteUserLevel(id) {
    return axios.post(`/admin/user_level/${id}/delete`)
}

// 获取所有会员等级用于下拉（后端可能没有单独接口，尝试请求第一页并返回 list）
export function getAllUserLevels() {
    // 请求第一页，返回的数据结构通常包含 list
    return getUserLevelList(1, { limit: 1000 })
}
