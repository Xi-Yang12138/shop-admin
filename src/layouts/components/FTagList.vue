<template>
    <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="width: 100%;"
            @tab-change="changeTab">
            <el-tab-pane :closable="item.path !== '/'" v-for="item in tabList" :key="item.path" :label="item.title"
                :name="item.path">

            </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>

    <div style="height: 40px;"></div>

</template>

<script setup>
import { useTabList } from '~/composables/useTabList'

const {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose,
} = useTabList()


</script>

<style scoped>
.f-tag-list {
    display: flex;
    align-items: center;
    position: fixed;
    top: 100px;
    right: 0;
    padding: 0 4px;
    background-color: #f5f7fa;
    z-index: 100;
}

.f-tag-list .tag-btn {
    background-color: #ffffff;
    padding: 8px;
    border-radius: 4px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
}

:deep(.el-tabs__header) {
    margin: 0;
}

:deep(.el-tabs__nav) {
    border: 0 !important;
}

:deep(.el-tabs__item) {
    background-color: #ffffff;
    margin: 0 4px;
    border: 0 !important;
    height: 32px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    border-radius: 4px;
    line-height: 32px;
    height: 32px;
}

:deep(.is-disabled) {
    background-color: #e3e4e6;
}
</style>