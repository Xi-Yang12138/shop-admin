<template>
    <div>
        <el-card shadow="never" body-class="row" style="margin-bottom: 20px;">
            <template #header>
                <div class="header">
                    <span>{{ title }}</span>
                    <el-tag type="danger">{{ tip }}</el-tag>
                </div>
            </template>

            <el-row :gutter="20">
                <el-col :span="6" :offset="0" v-for="(item, index) in arr" :key="index">
                    <el-card shadow="never" body-class="item">
                        <span class="value">{{ item.value }}</span>
                        <span class="label">{{ item.label }}</span>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
    },
    tip:{
        type: String,
        type: String,
    },
    arr: {
        type: Array,
    }
})
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
}

:deep(.row) {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.el-card {
    border: none;
}

:deep(.item) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    border: none;
    overflow: hidden;
}

.value {
    font-size: 40px;
    margin: 15px 0 30px 0;
}

.label {
    color: #646464;
}

.el-row {
    display: flex;
    flex:1;
    align-items: center;
}
</style>