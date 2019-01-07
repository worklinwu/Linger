import store from '@/store'
import axios from 'axios'
import { Toast } from 'vant'
import util from '@/libs/util'
import router from '@/router'

// 路由白名单
// const apiWhiteList = [
//   '/api/login',
//   '/api/register'
// ]
// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: process.env.NODE_ENV === 'development' ? 120000 : 30000 // 请求超时时间 30s
})

// service.defaults.headers.get['Content-Type'] = 'application/json'
// service.defaults.headers.put['Content-Type'] = 'application/json'
service.defaults.headers.post['Content-Type'] = 'application/json'
// service.defaults.headers.delete['Content-Type'] = 'application/json'

// 请求拦截器
// service.interceptors.request.use(
//   config => {
//     // 在请求发送之前做一些处理
//     // 如果是外链，或者是白名单里的url则跳过
//     // if (!(/^https:\/\/|http:\/\//.test(config.url)) && !apiWhiteList.some(item => item === config.url)) {
//     //   // 判断是否需要验证登录的接口
//     //   const token = util.cookies.get('token')
//     //   if (token && token !== 'undefined') {
//     //     // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
//     //     config.headers['Authorization'] = 'Bearer ' + token
//     //   }
//     // }
//
//     return config
//   },
//   error => {
//     // 发送失败
//     Promise.reject(error)
//   }
// )

// 响应拦截器
service.interceptors.response.use(
  function (response) {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const { code, success, message } = dataAxios
    // 根据 code 进行判断
    if (code === undefined) {
      // 直接返回数据的情况
      return dataAxios
    } else if (!code) {
      if (success) {
        if (dataAxios.data === null || dataAxios.data === undefined) {
          return true
        } else {
          return dataAxios.data
        }
      } else {
        Toast.fail(message)
        return null
      }
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {
        case 0:
        case 200:
          // [ 示例 ] code === 0/200 代表没有错误
          return dataAxios.data
        case '99':
          Toast.fail('token无效，请重新登录')
          router.replace({
            name: 'Unauthorized'
          })
          break
        default:
          Toast.fail(`${dataAxios.code} - ${dataAxios.message}`)
      }
    }
  },
  function (error) {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          error.message = '授权错误，请登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 422:
          error.message = '验证出错'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
      }
    }
    Toast.clear()
    Toast.fail(error.message)
    return Promise.reject(error)
  }
)

service.jsonp = (url) => {
  if (!url) {
    console.error('Axios.JSONP 至少需要一个url参数!')
    return;
  }
  return new Promise((resolve, reject) => {
    window.jsonCallBack = (result) => {
      resolve(result)
    }
    var JSONP = document.createElement("script");
    JSONP.type = "text/javascript";
    JSONP.src = `${url}&callback=jsonCallBack`;
    document.getElementsByTagName("head")[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName("head")[0].removeChild(JSONP)
    }, 500)
  })
}

export default service
