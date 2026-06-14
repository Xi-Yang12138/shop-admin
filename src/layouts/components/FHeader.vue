<template>
    <div class="header">

        <div class="header-left">
            <el-tooltip effect="dark" content="SHOPPING" placement="bottom">
                <el-icon class="shop-icon">
                    <GoodsFilled />
                </el-icon>
            </el-tooltip>
            <h1 class="shop-name">SHOPPING</h1>
        </div>

        <div class="header-center">
            <div class="fold">
                <el-tooltip effect="dark" content="折叠菜单" placement="bottom">
                    <el-icon class="fold" @click="$store.commit('handleAsideWidth')">
                        <Fold v-if="$store.state.asideWidth === '250px'"/>
                        <Expand v-else />
                    </el-icon>
                </el-tooltip>
            </div>
            <div class="refresh">
                <el-tooltip effect="dark" content="刷新页面" placement="bottom">
                    <el-icon class="refresh" @click="handleRefresh">
                        <Refresh />
                    </el-icon>
                </el-tooltip>
            </div>
        </div>

        <div class="header-right">
            <el-tooltip effect="dark" content="录像" placement="bottom">
                <el-icon class="video-camera">
                    <VideoCamera />
                </el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="fullscreen" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>

            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    <el-avatar :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <form-drawer ref="fromDrawerRef" title="修改密码" :destroyOnClose='true' @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="100px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码" type="password" show-password>
                </el-input>
            </el-form-item>

            <el-form-item prop="password" label="新密码">
                <el-input v-model="form.password" type="password" placeholder="请输入新密码" show-password>
                </el-input>
            </el-form-item>

            <el-form-item prop="repassword" label="确认密码">
                <el-input v-model="form.repassword" type="password" placeholder="请输入确认密码" show-password>
                </el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>

<script setup>
import FormDrawer from '~/components/FormDrawer.vue'
import { useFullscreen } from '@vueuse/core'
import { useRePassword, useLogout } from '~/composables/useManager'

const { isFullscreen, toggle } = useFullscreen()
const {
    fromDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordFrom
} = useRePassword()
const { handleLogout } = useLogout()

const handleCommand = (c) => {
    switch (c) {
        case 'logout':
            handleLogout()
            break;
        case 'rePassword':
            openRePasswordFrom()
            break;
    }
}

const handleRefresh = () => {
    location.reload()
}

</script>

<style scoped>
.header{
    position: fixed;
    width: 100%;
    z-index: 100;
}

.header,
.header .header-left,
.header .header-center,
.header .header-right {
    display: flex;
    align-items: center;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    height: 100px;
    background: #0048ff;
}

.header .header-left {
    width: 20%;
}

.header-left .shop-icon {
    margin-left: 100px;
    font-size: 50px;
}

.header-left .shop-name {
    margin-left: 20px;
    font-size: 30px;
}

.header .header-center {
    margin-left: 100px !important;
    width: 5%;
}

.header .header-center {
    justify-content: space-around;
}

.header-center .fold,
.header-center .refresh,
.header-right .video-camera,
.header-right .fullscreen {
    font-weight: bolder;
    font-size: 25px;
}

.header .header-right {
    margin-left: auto !important;
    width: 16%;
    justify-content: space-around;
}

.el-dropdown-link {
    display: flex;
    align-items: center;
    text-align: center;
    color: #ffffff;
    gap: 10px;
}
</style>