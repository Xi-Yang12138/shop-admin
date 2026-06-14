import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

const routes = [{
    path: '/',
    name: 'Admin',
    component: () => import('~/layouts/admin.vue'),
},
{
    path: '/login',
    name: 'Login',
    component: () => import('~/pages/login.vue'),
    meta: {
        title: '登录页'
    }
},
{
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('~/pages/404.vue'),
    meta: {
        title: '404'
    }
}];

const asyncRoutes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('~/pages/index.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/goods/list',
        name: 'GoodsList',
        component: () => import('~/pages/goods/list.vue'),
        meta: { title: '商品管理' }
    },
    {
        path: '/category/list',
        name: 'CategoryList',
        component: () => import('~/pages/category/list.vue'),
        meta: { title: '商品分类管理' }
    },
    {
        path: '/skus/list',
        name: 'SpecList',
        component: () => import('~/pages/skus/list.vue'),
        meta: { title: '规格管理' }
    },
    {
        path: '/coupon/list',
        name: 'CouponList',
        component: () => import('~/pages/coupon/list.vue'),
        meta: { title: '优惠券管理' }
    },
    {
        path: '/user/list',
        name: 'UserList',
        component: () => import('~/pages/user/list.vue'),
        meta: { title: '用户管理' }
    },
    {
        path: '/level/list',
        name: 'MemberList',
        component: () => import('~/pages/level/list.vue'),
        meta: { title: '会员等级管理' }
    },
    {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('~/pages/order/list.vue'),
        meta: { title: '订单管理' }
    },
    {
        path: '/comment/list',
        name: 'CommentList',
        component: () => import('~/pages/comment/list.vue'),
        meta: { title: '评论管理' }
    },
    {
        path: '/image/list',
        name: 'ImageList',
        component: () => import('~/pages/image/list.vue'),
        meta: { title: '图库管理' }
    },
    {
        path: '/notice/list',
        name: 'NoticeList',
        component: () => import('~/pages/notice/list.vue'),
        meta: { title: '通知公告列表管理' }
    },
    {
        path: '/setting/base',
        name: 'SettingBase',
        component: () => import('~/pages/setting/base.vue'),
        meta: { title: '基础设置' }
    },
    {
        path: '/setting/buy',
        name: 'SettingTrade',
        component: () => import('~/pages/setting/trade.vue'),
        meta: { title: '交易设置' }
    },
    {
        path: '/setting/ship',
        name: 'SettingLogistics',
        component: () => import('~/pages/setting/logistics.vue'),
        meta: { title: '物流设置' }
    },
    {
        path: '/distribution/index',
        name: 'DistributorList',
        component: () => import('~/pages/distribution/index.vue'),
        meta: { title: '分销员设置' }
    },
    {
        path: '/distribution/setting',
        name: 'DistributionList',
        component: () => import('~/pages/distribution/list.vue'),
        meta: { title: '分销设置' }
    },
    {
        path: '/manager/list',
        name: 'ManagerList',
        component: () => import('~/pages/manager/list.vue'),
        meta: { title: '管理员管理' }
    },
    {
        path: '/access/list',
        name: 'AccessList',
        component: () => import('~/pages/access/list.vue'),
        meta: { title: '权限管理' }
    },
    {
        path: '/role/list',
        name: 'RoleList',
        component: () => import('~/pages/role/list.vue'),
        meta: { title: '角色管理' }
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//动态添加路由
export function addRoutes(menus) {
    //是否有新的路由
    let hasNewRoutes = false
    const findAndRoutesByMenus = (arr) => {
        arr.forEach(e => {
            let item = asyncRoutes.find(o => o.path === e.frontpath)
            if (item && !router.hasRoute(item.name)) {
                router.addRoute('Admin', item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length > 0) {
                findAndRoutesByMenus(e.child)
            }
        })
    }

    findAndRoutesByMenus(menus)

    return hasNewRoutes
}

