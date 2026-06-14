<template>
    <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="false"
        :destroy-on-close="destroyOnClose">
        <div class="fromDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="action">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="info" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
const showDrawer = ref(false)

const props = defineProps({
    title: String,
    size: {
        type: String,
        default: '45%'
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: '提交'
    }
})

const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

//打开
const open = () => showDrawer.value = true

//关闭
const close = () => showDrawer.value = false

//提交
const emit = defineEmits(['submit'])
const submit = () => emit('submit')

//向父组件暴露以下方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})

</script>

<style scoped>
.fromDrawer {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
}

.fromDrawer .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.fromDrawer .action {
    height: 50px;
    margin-top: auto;
}
</style>