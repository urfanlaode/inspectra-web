import { env } from '@/app/env'
import axios from 'axios'

export const client = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json'
  }
})

client.interceptors.request.use((config) => {
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)
