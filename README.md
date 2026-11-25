# Shop Admin

基于 **Vue 3 + Element Plus + Vite** 的商城管理后台前端项目。

前端通过 `/api` 反向代理请求后端接口，后端接口由其他团队另外维护，不属于本项目范围。

## 功能清单

- 登录认证（token 存储于 Cookie，路由守卫自动校验）
- 首页数据看板（统计面板、ECharts 趋势图）
- 商品管理（列表 / 上下架 / 批量删除）
- 商品分类管理
- 规格管理（商品规格增删改查、状态开关、批量删除）
- 优惠券管理
- 用户管理（会员列表、状态开关）
- 会员等级管理
- 订单管理（订单状态流转、导出、批量删除）
- 评论管理（评价回复、状态开关）
- 图库管理（图片上传、分类、pick 选择器）
- 通知公告管理
- 基础设置 / 交易设置 / 物流设置
- 分销员设置 / 分销设置
- 管理员管理（超级管理员禁用保护）
- 权限管理（权限点列表）
- 角色管理（关联权限点）

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Vue 3（Composition API，`<script setup>`）、Vue Router 4、Vuex 4 |
| UI | Element Plus、@element-plus/icons-vue |
| 构建 | Vite、WindiCSS |
| 数据请求 | Axios（拦截器统一注入 token / 错误提示） |
| 图表 | ECharts |
| 动画 | GSAP |
| 工具库 | @vueuse/core、@vueuse/integrations（Cookie 等） |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

> 登录账号：`admin` / 密码：`admin`（当前后端仅提供这一组账号密码）。

## 后端接口说明

后端为独立维护的服务，不包含在本仓库内。开发环境下，前端通过 Vite 代理将 `/api` 请求转发到后端地址：

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://ceshi13.dishait.cn', // 指向后端服务
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

如需更换后端接口，请修改 `vite.config.js` 中的 `server.proxy['/api'].target`。接口统一封装于 `src/api/` 目录，并在 `src/axios.js` 中处理请求头（token）、响应数据与错误提示。

## 目录结构

```
shop-admin
├─ src
│  ├─ api/                 # 接口封装（按业务模块拆分）
│  ├─ components/          # 通用组件（ChooseImage、ImageAside、ImageMain、FormDrawer、ListHeader、CountTo、IconSelect、UploadFile 等）
│  ├─ composables/         # 组合式函数（useCommon、useManager、useTabList、auth、util）
│  ├─ directives/          # 自定义指令（v-permission）
│  ├─ layouts/             # 后台布局（侧边菜单、顶部栏、标签页）
│  ├─ pages/               # 页面（按模块分目录，list.vue 为列表页）
│  ├─ router/              # 路由配置
│  ├─ store/               # Vuex 全局状态（用户信息、菜单、权限、侧边栏宽度）
│  ├─ axios.js             # Axios 实例与拦截器
│  ├─ permision.js         # 登录/权限路由守卫（进入拦截）
│  └─ main.js              # 应用入口
├─ index.html
└─ vite.config.js
```

> `src/style.css` 为全局样式，WindiCSS 亦会在编译时生效。

## 目录约定

- 列表页统一使用 `src/composables/useCommon.js` 提供的 `useInitTable` / `useInitForm`，配合共享组件 `ListHeader`、`FormDrawer`、`ChooseImage` 等形成统一交互。
- 图片上传/管理沿用 `ChooseImage` 组件（内部包含 `ImageAside` 分类栏与 `ImageMain` 图片列表）。
- `api/` 下每个文件对应一个业务模块的接口函数，命名如 `getXxxList`、`createXxx`、`updateXxx`、`updateXxxStatus`、`deleteXxx`。

## 部署

支持通过 `gh-pages` 部署到 GitHub Pages：

```bash
npm run build
npm run deploy
```

构建产物位于 `dist/`，`homepage` 字段已在 `package.json` 中配置。

## 环境要求

- Node.js ≥ 18
- 包管理器：npm（仓库提供 `package-lock.json` / 也可用 pnpm）
