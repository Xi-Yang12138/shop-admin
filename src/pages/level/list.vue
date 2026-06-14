<!-- 页面: 会员等级管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="100px" class="mb-3 flex">
            <el-form-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="等级名称" clearable></el-input>
            </el-form-item>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />

        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="等级名称" width="180" />
            <el-table-column prop="level" label="权重" width="100" />
            <el-table-column prop="discount" label="折扣(%)" width="120" />
            <el-table-column prop="max_price" label="累计金额" width="140" />
            <el-table-column prop="max_times" label="累计次数" width="120" />
            <el-table-column label="状态" width="160">
                <template #default='{ row }'>
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :loading="row.statusLoading" @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                    <el-popconfirm title="是否删除该等级？" confirm-button-text="确认" cancel-button-text="取消"
                        placement="bottom" @confirm.stop="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <!-- 新增/修改 弹出抽屉 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input-number v-model="form.level" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="折扣(%)" prop="discount">
                    <el-input-number v-model="form.discount" :min="0" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="累计消费金额" prop="max_price">
                    <el-input-number v-model="form.max_price" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="累计消费次数" prop="max_times">
                    <el-input-number v-model="form.max_times" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>

    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import {
    useInitTable,
    useInitForm,
} from '~/composables/useCommon'
import {
    getUserLevelList,
    createUserLevel,
    updateUserLevel,
    updateUserLevelStatus,
    deleteUserLevel,
} from '~/api/user'

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
} = useInitTable({
    searchForm: {
        keyword: ''
    },
    getList: getUserLevelList,
    onGetListSuccess: (res) => {
        tableData.value = (res.list || res).map(o => ({ ...o, statusLoading: false }))
        total.value = res.totalCount || res.total || (res.list ? res.list.length : 0)
    },
    delete: deleteUserLevel,
    updateStatus: updateUserLevelStatus,
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    handleSubmit,
    drawerTitle,
    handleCreate,
    handleUpdate,
} = useInitForm({
    form: {
        name: '',
        level: 0,
        discount: 100,
        max_price: 0,
        max_times: 0,
        status: 1,
    },
    rules: {
        name: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
        level: [{ required: true, message: '请输入等级权重', trigger: 'change' }],
        discount: [{ required: true, message: '请输入折扣', trigger: 'change' }],
        max_price: [{ required: true, message: '请输入累计金额', trigger: 'change' }],
        max_times: [{ required: true, message: '请输入累计次数', trigger: 'change' }],
    },
    getData,
    update: updateUserLevel,
    create: createUserLevel,
})

</script>

<style scoped>
.buttom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
</style>
