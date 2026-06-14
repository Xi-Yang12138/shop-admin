<!-- 页面: 评论管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3 flex">
            <el-form-item label="商品标题">
                <el-input v-model="searchForm.title" placeholder="商品标题" clearable></el-input>
            </el-form-item>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <ListHeader @refresh="getData" />

        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="title" label="商品" />
            <el-table-column prop="content" label="评价内容" />
            <el-table-column prop="reply" label="回复" />
            <el-table-column label="状态" width="140">
                <template #default="{ row }">
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading" @change="handleStatusChange($event, row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="时间" width="180" />
            <el-table-column label="操作" width="160">
                <template #default="{ row }">
                    <el-button type="primary" text @click="openReply(row)">回复</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

    </el-card>

    <el-dialog title="回复评价" :visible="replyDialogVisible">
        <el-input type="textarea" v-model="replyContent" rows="6" placeholder="请输入回复内容"></el-input>
        <template #footer>
            <el-button @click="replyDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitReply">提交</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import { useInitTable } from '~/composables/useCommon'
import { toast } from '~/composables/util'
import { getGoodsCommentList, updateGoodsCommentStatus, reviewGoodsComment } from '~/api/comment'

const replyDialogVisible = ref(false)
const replyContent = ref('')
let currentReplyId = 0

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
} = useInitTable({
    searchForm: { title: '' },
    getList: getGoodsCommentList,
    onGetListSuccess: (res) => {
        tableData.value = (res.list || res).map(o => ({ ...o, statusLoading: false }))
        total.value = res.totalCount || res.total || (res.list ? res.list.length : 0)
    },
    delete: () => Promise.resolve(),
    updateStatus: (id, status) => updateGoodsCommentStatus(id, status),
})

function openReply(row) {
    currentReplyId = row.id
    replyContent.value = row.reply || ''
    replyDialogVisible.value = true
}

function submitReply() {
    // 重要函数：submitReply — 提交对评论的回复并刷新列表
    if (!replyContent.value) {
        toast('请输入回复内容', 'warning')
        return
    }
    reviewGoodsComment(currentReplyId, { data: replyContent.value }).then(() => {
        toast('回复成功')
        replyDialogVisible.value = false
        getData()
    })
}

// 重要函数：handleStatusChange — 更新评论启用/禁用状态
function handleStatusChange(status, row) {
    row.statusLoading = true
    updateGoodsCommentStatus(row.id, status).then(() => {
        row.status = status
        toast('状态修改成功')
    }).finally(() => {
        row.statusLoading = false
    })
}

</script>

<style scoped>
.buttom { display:flex; align-items:center; justify-content:center; margin-top:20px }
</style>