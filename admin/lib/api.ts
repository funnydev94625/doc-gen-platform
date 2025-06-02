import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// Utility function to check if a JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return true

    const decodedPayload = JSON.parse(atob(payload))

    if (!decodedPayload.exp) return false

    const expirationTime = decodedPayload.exp * 1000
    return Date.now() >= expirationTime
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true
  }
}

// Create a typed API instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to all requests if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        if (isTokenExpired(token)) {
          console.warn("Token is expired, request may fail")
        }
        config.headers['x-auth-token'] = token
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/signin')) {
        window.location.href = '/auth/signin'
      }
    }

    return Promise.reject(error)
  }
)

export default api 