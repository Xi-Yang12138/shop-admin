<template>
    <div class="f-menu" :style="{ width: store.state.asideWidth }">
        <el-menu :default-active="defaultActive" :unique-opened="true" :collapse="isCollapse" class="border-0"
            @select="handleSelect" :collapse-transition="false">
            <template v-for="(item, index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is='item.icon'></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is='item2.icon'></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                        <component :is='item.icon'></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>

</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const route = useRoute()

//默认选中
const defaultActive = ref(route.path)

//路由变化时，更新默认选中
onBeforeRouteUpdate((to, from) => {
    defaultActive.value = to.path
})

//是否折叠
const isCollapse = computed(() => {
    return store.state.asideWidth === '64px'
})

const asideMenus = computed(() => {
    return store.state.menus
})

const handleSelect = (e) => {
    router.push(e)
}
</script>

<style scoped>
.f-menu {
    transition: all 0.3s ease-in-out;
    position: fixed;
    z-index: 100;
    top: 100px;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 10px 0 10px rgba(0, 0, 0, 0.1);

}

.f-menu::-webkit-scrollbar {
    width: 0;
}
</style>
