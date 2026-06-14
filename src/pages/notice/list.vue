<!-- 页面: 通知公告管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />

        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="公告标题" width="300" />
            <el-table-column prop="create_time" label="发布时间" width="300" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要删除该公告？" confirm-button-text="确认" cancel-button-text="取消" placement="bottom"
                        @confirm.stop="handleDelete(scope.row.id)">
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

        <!-- 新增弹屉 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="请输入公告内容" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>

        </FormDrawer>

    </el-card>



</template>

<script setup>
import { toast } from '~/composables/util'
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '~/api/notice'
import FormDrawer from '~/components/FormDrawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import {
    useInitTable,
    useInitForm,
} from '~/composables/useCommon'

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
} = useInitTable({
    getList: getNoticeList,
    delete: deleteNotice,
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    handleSubmit,
    updateId,
    drawerTitle,
    resetForm,
    handleCreate,
    handleUpdate,
} = useInitForm({
    form: {
        title: '',
        content: ''
    },
    rules: {
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
    },
    getData,
    update: updateNotice,
    create: createNotice,
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