import axios from '~/axios'

export function getAgentStatistics() {
    return axios.get('/admin/agent/statistics')
}

export function getAgentList(page = 1, params = {}) {
    return axios.get(`/admin/agent/${page}`, {
        params: {
            keyword: params.keyword || undefined,
            type: params.type || undefined,
            starttime: params.starttime || undefined,
            endtime: params.endtime || undefined,
            level: params.level || undefined,
            user_id: params.user_id || undefined,
            limit: params.limit || 10,
        }
    })
}

export function getUserBillList(page = 1, params = {}) {
    return axios.get(`/admin/user_bill/${page}`, {
        params: {
            type: params.type || undefined,
            starttime: params.starttime || undefined,
            endtime: params.endtime || undefined,
            limit: params.limit || 10,
        }
    })
}

export function setDistributionSetting(data = {}) {
    return axios.post('/admin/distribution_setting/set', data)
}

export function getDistributionSetting() {
    return axios.get('/admin/distribution_setting/get')
}
