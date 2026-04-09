import axios from 'axios'

const api = axios.create({
    baseURL: 'http://gamevault.test/api',
})

// Aggiunge automaticamente il token ad ogni richiesta
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.Accept = 'application/json'
    return config
})

export default api