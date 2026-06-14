import axios from '~/axios'

export function getSysConfig() {
    return axios.get('/admin/sysconfig')
}

export function updateSysConfig(data = {}) {
    return axios.post('/admin/sysconfig', data)
}

export function uploadSysConfigFile(file) {
    const fd = new FormData()
    fd.append('file', file)
    return axios.post('/admin/sysconfig/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}
