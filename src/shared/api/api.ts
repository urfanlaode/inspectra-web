import { client } from '@/shared/api/axios-client'
import type { AxiosRequestConfig } from 'axios'

export const api = {
  request: async <T = unknown>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => {
    const reqConfig: AxiosRequestConfig = { ...(config || {}), method, url }
    if (typeof data !== 'undefined') {
      reqConfig.data = data
    }
    const res = await client.request<T>(reqConfig)
    return res.data
  },

  get: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    return api.request<T>('get', url, undefined, config)
  },

  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return api.request<T>('post', url, data, config)
  },

  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return api.request<T>('put', url, data, config)
  },

  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    return api.request<T>('delete', url, undefined, config)
  }
}
