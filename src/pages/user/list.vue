<!-- 页面: 用户管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3 flex">
            <el-form-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员等级">
                <el-select v-model="searchForm.user_level_id" placeholder="选择会员等级" clearable filterable style="width:200px">
                    <el-option v-for="item in userLevels" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
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
            <el-table-column label="用户" width="260">
                <template #default='{ row }'>
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar">
                            <img :src="row.avatar || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'" />
                        </el-avatar>
                        <div class="ml-2">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }} {{ row.nickname ? (' | ' + row.nickname) : '' }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="手机/邮箱" width="240">
                <template #default='{ row }'>
                    <div>{{ row.phone || '-' }}<br/>{{ row.email || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="会员等级" width="180">
                <template #default='{ row }'>
                    {{ row.user_level?.name || '-' }}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="160">
                <template #default='{ row }'>
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :loading="row.statusLoading" @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <div>
                        <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要删除该用户？" confirm-button-text="确认" cancel-button-text="取消"
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
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id">
                    <el-select v-model="form.user_level_id" placeholder="选择会员等级" clearable filterable>
                        <el-option v-for="item in userLevels" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
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
import { getUserList, updateUserStatus, createUser, updateUser, deleteUser, getAllUserLevels } from '~/api/user'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import ListHeader from '~/components/ListHeader.vue'


import {
    useInitTable,
    useInitForm,
} from '~/composables/useCommon'


const userLevels = ref([])

// 主动拉取所有会员等级用于下拉（如果列表接口返回等级也会覆盖）
getAllUserLevels().then(res => {
    const list = (res && res.list) || []
    userLevels.value = list
}).catch(() => {
    userLevels.value = []
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
    handleDelete,
    handleStatusChange,
} = useInitTable({
    searchForm: {
        keyword: '',
        user_level_id: null,
    },
    getList: getUserList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => ({
            ...o,
            statusLoading: false
        }))
        total.value = res.totalCount
        userLevels.value = res.user_levels || res.levels || res.levels_list || userLevels.value || []
    },
    delete: deleteUser,
    updateStatus: updateUserStatus,
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
        username: '',
        password: '',
        nickname: '',
        phone: '',
        email: '',
        avatar: '',
        user_level_id: null,
        status: 1,
    },
    rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        user_level_id: [{ required: true, message: '请选择会员等级', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    },
    getData,
    update: updateUser,
    create: createUser,
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