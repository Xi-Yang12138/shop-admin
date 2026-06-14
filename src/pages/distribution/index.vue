<!-- 页面: 分销员设置 -->
<template>
    <el-card shadow="never" class="border-0">
        <el-row :gutter="20" style="margin-bottom:20px">
            <el-col :span="6" v-for="(item, index) in panels" :key="index">
                <el-card shadow="hover" body-class="card-body">
                    <template #header>
                        <div class="header">
                            <span>{{ item.label }}</span>
                        </div>
                    </template>
                    <div class="value">{{ item.value }}</div>
                </el-card>
            </el-col>
        </el-row>

        <el-form :model="searchForm" label-width="80px" class="mb-3 flex">
            <el-form-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/用户" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="searchForm.type" placeholder="请选择" clearable>
                    <el-option label="全部" value="all" />
                    <el-option label="今天" value="today" />
                </el-select>
            </el-form-item>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column label="用户" width="240">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar"></el-avatar>
                        <div class="ml-2">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="140" />
            <el-table-column prop="email" label="邮箱" width="180" />
            <el-table-column prop="create_time" label="注册时间" width="180" />
            <el-table-column prop="share_num" label="分享数" width="100" />
            <el-table-column prop="order_price" label="订单金额" width="120" />
            <el-table-column prop="commission" label="佣金" width="120" />
            <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">{{ row.status === 1 ? '启用' : '禁用' }}</template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getAgentStatistics, getAgentList } from '~/api/distribution'
import ListHeader from '~/components/ListHeader.vue'
import { useInitTable } from '~/composables/useCommon'

const panels = ref([])

getAgentStatistics().then(res => {
    if (res && res.panels) panels.value = res.panels
})

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
} = useInitTable({
    searchForm: { keyword: '', type: 'all' },
    getList: getAgentList,
    onGetListSuccess: (res) => {
        tableData.value = (res.list || res).map(o => ({ ...o }))
        total.value = res.totalCount || 0
    },
})

</script>

<style scoped>
.value{ font-size:28px; font-weight:600 }
.buttom{ display:flex; align-items:center; justify-content:center; margin-top:20px }
</style>
