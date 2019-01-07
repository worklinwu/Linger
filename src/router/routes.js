// layout
import layoutDefault from '../layout/default'

// const meta = { requiresAuth: true }

let routes = [
  {
    path: '/',
    redirect: { name: 'Index' },
    component: layoutDefault,
    children: [
      {
        path: '',
        name: 'Index',
        meta: { title: '首页' },
        component: () => import('../views/Index')
      },
      {
        path: '/resource',
        name: 'Resource',
        meta: { title: '资源' },
        component: () => import('../views/Resource')
      }
    ]
  }
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('../views/Login')
  // },
  // {
  //   path: '/forget-password',
  //   name: 'ForgetPassword',
  //   component: () => import('../views/ForgetPassword')
  // },

  // error
  // {
  //   path: '/error',
  //   name: 'Error',
  //   component: () => import('../views/Error')
  // },
  // // 404
  // {
  //   path: '*',
  //   name: 'NotFound',
  //   component: () => import('../views/404')
  // },
  // // 401
  // {
  //   path: '*',
  //   name: 'Unauthorized',
  //   component: () => import('../views/401')
  // }
]

// let _keepAliveRoutes = []
//
// routes.forEach(item => {
//   if (item.meta && item.meta.cache) {
//     _keepAliveRoutes.push(item.name)
//   }
//   if (item.children) {
//     item.children.forEach(chil => {
//       if (chil.meta && chil.meta.cache) {
//         _keepAliveRoutes.push(chil.name)
//       }
//     })
//   }
// })
//
// export const keepAliveRoutes = _keepAliveRoutes

// 重新组织后导出
export default routes
