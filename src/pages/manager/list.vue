<!-- 页面: 管理员管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3 flex">
            <el-form-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
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
            <el-table-column label="管理员" width="200">
                <template #default='{ row }'>
                    <div class="flex items-center">
                        <el-avatar :size="40" src="row.avatar">
                            <img
                                :src="row.avatar || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'" />
                        </el-avatar>
                        <div class="ml-2">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所属角色" width="200">
                <template #default='{ row }'>
                    {{ row.role?.name || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="200">
                <template #default='{ row }'>
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :loading="row.statusLoading" :disabled="row.super === 1"
                        @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <small v-if="scope.row.super === 1" class="text-gray-500">暂无操作</small>
                    <div v-else>
                        <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要删除该管理员？" confirm-button-text="确认" cancel-button-text="取消"
                            placement="bottom" @confirm.stop="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <!-- 新增弹屉 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="选择所属角色" clearable filterable>
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>

        </FormDrawer>

    </el-card>


</template>

<script setup>
import { ref } from 'vue'
import { getManagerList, updateManagerStatus, createManager, updateManager, deleteManager } from '~/api/manager'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import ListHeader from '~/components/ListHeader.vue'


import {
    useInitTable,
    useInitForm,
} from '~/composables/useCommon'


const roles = ref([])

// 重要函数：handleDelete/handleStatusChange 等由 useInitTable 提供，用于表格操作
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
    getList: getManagerList,
    onGetListSuccess: (res) => {
        // console.log(res);
        tableData.value = res.list.map(o => ({
            ...o,
            statusLoading: false
        }))
        total.value = res.totalCount
        roles.value = res.roles
    },
    delete: deleteManager,
    updateStatus: updateManagerStatus,
})

// 重要函数：表单相关函数由 useInitForm 提供，用于新增/编辑管理员
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
        username: '',
        password: '',
        role_id: null,
        status: 1,
        avatar: ''
    },
    rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择所属角色', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    },
    getData,
    update: updateManager,
    create: createManager,
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