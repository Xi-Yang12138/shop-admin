<template>
    <!-- 新增|刷新 -->
    <div class="top">
        <el-button type="primary" @click="$emit('create')">新增</el-button>
        <el-tooltip content="刷新数据" placement="top">
            <el-button text @click="$emit('refresh')">
                <el-icon :size="24">
                    <Refresh />
                </el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<script setup>
defineEmits(['create', 'refresh'])
</script>

<style scoped>
.top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
</style>
