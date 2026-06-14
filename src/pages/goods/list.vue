<!-- 页面: 商品管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <el-form :model="searchForm" label-width="80px" class="mb-3 flex items-center">
            <el-form-item label="状态">
                <el-select v-model="searchForm.tab" placeholder="全部" clearable style="width: 180px;">
                    <el-option label="全部" value="all" />
                    <el-option label="审核中" value="checking" />
                    <el-option label="出售中" value="saling" />
                    <el-option label="已下架" value="off" />
                    <el-option label="库存预警" value="min_stock" />
                    <el-option label="回收站" value="delete" />
                </el-select>
            </el-form-item>
            <el-form-item label="关键词">
                <el-input v-model="searchForm.title" placeholder="商品名称、描述" clearable />
            </el-form-item>
            <el-form-item label="分类ID">
                <el-input-number v-model="searchForm.category_id" :min="0" placeholder="分类ID" />
            </el-form-item>
            <el-form-item label="每页">
                <el-input-number v-model="searchForm.limit" :min="1" :max="100" />
            </el-form-item>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="getData(1)">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <ListHeader @create="handleCreate" @refresh="getData" />

        <div class="batch-actions">
            <el-button type="primary" @click="handleBatchStatus(1)" :disabled="!selectedRows.length">批量上架</el-button>
            <el-button type="warning" @click="handleBatchStatus(0)" :disabled="!selectedRows.length">批量下架</el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedRows.length">批量删除</el-button>
            <el-button type="success" @click="handleBatchRestore" :disabled="!selectedRows.length">批量恢复</el-button>
            <el-button type="danger" plain @click="handleBatchDestroy" :disabled="!selectedRows.length">彻底删除</el-button>
            <span class="selected-count">已选 {{ selectedRows.length }} 项</span>
        </div>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="封面" width="120">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="cover" style="width: 80px; height: 80px;" />
                </template>
            </el-table-column>
            <el-table-column prop="title" label="商品名称" />
            <el-table-column prop="category_id" label="分类ID" width="100" />
            <el-table-column label="价格" width="140">
                <template #default="{ row }">
                    ￥{{ row.min_price }} / ￥{{ row.min_oprice }}
                </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="100" />
            <el-table-column label="状态" width="160">
                <template #default="{ row }">
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
                        @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
                <template #default="{ row }">
                    <el-button type="primary" text @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="primary" text @click="handleDelete(row.id)">删除</el-button>
                    <el-button type="primary" text @click="handleView(row.id)">详情</el-button>
                    <el-button type="primary" text @click="handleCheck(row)">审核</el-button>
                    <el-button type="primary" text @click="handleChangeBanners(row)">轮播图</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="商品名称" prop="title">
                    <el-input v-model="form.title" placeholder="请输入商品名称" />
                </el-form-item>
                <el-form-item label="商品分类" prop="category_id">
                    <template v-if="categoryOptions.length">
                        <el-select v-model="form.category_id" placeholder="请选择商品分类" clearable>
                            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name || item.title" :value="item.id" />
                        </el-select>
                    </template>
                    <template v-else>
                        <el-input-number v-model="form.category_id" :min="0" placeholder="分类ID" />
                        <div class="hint">未加载到分类列表时，可手动输入分类ID</div>
                    </template>
                </el-form-item>
                <el-form-item label="封面" prop="cover">
                    <ChooseImage v-model="form.cover" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="kg、件等" />
                </el-form-item>
                <el-form-item label="库存" prop="stock">
                    <el-input-number v-model="form.stock" :min="0" />
                </el-form-item>
                <el-form-item label="库存预警" prop="min_stock">
                    <el-input-number v-model="form.min_stock" :min="0" />
                </el-form-item>
                <el-form-item label="库存显示" prop="stock_display">
                    <el-switch v-model="form.stock_display" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="上架状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="销售价" prop="min_price">
                    <el-input-number v-model="form.min_price" :min="0" :step="0.01" />
                </el-form-item>
                <el-form-item label="原价" prop="min_oprice">
                    <el-input-number v-model="form.min_oprice" :min="0" :step="0.01" />
                </el-form-item>
                <el-form-item label="详情" prop="content">
                    <el-input type="textarea" v-model="form.content" :rows="4" placeholder="请输入商品详情" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from '~/composables/util'
import { getGoodsList, createGoods, updateGoods, changeGoodsStatus, deleteGoods, restoreGoods, destroyGoods, checkGoods, updateGoodsBanners, readGoods } from '~/api/goods'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import ListHeader from '~/components/ListHeader.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'

const selectedRows = ref([])
const categoryOptions = ref([])

const normalizeCategoryResult = (res) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (res.list) return res.list
    return []
}

// 重要函数：handleSelectionChange — 更新当前已选行数组
const handleSelectionChange = (rows) => {
    selectedRows.value = rows
}

// 重要函数：getSelectedIds — 返回当前已选数据的 ID 列表
const getSelectedIds = () => {
    return selectedRows.value.map(item => item.id)
}

// 重要函数：handleBatchStatus — 批量修改选中商品的上架/下架状态
const handleBatchStatus = (status) => {
    const ids = getSelectedIds()
    if (!ids.length) {
        toast('请先选择商品')
        return
    }
    const text = status === 1 ? '上架' : '下架'
    if (!window.confirm(`是否确认批量${text}选中商品？`)) {
        return
    }
    changeGoodsStatus(ids, status).then(() => {
        toast(`批量${text}成功`)
        getData(false)
        selectedRows.value = []
    })
}

// 重要函数：handleBatchDelete — 批量删除选中商品（逻辑删除）
const handleBatchDelete = () => {
    const ids = getSelectedIds()
    if (!ids.length) {
        toast('请先选择商品')
        return
    }
    if (!window.confirm('是否确认批量删除选中商品？')) {
        return
    }
    deleteGoods(ids).then(() => {
        toast('批量删除成功')
        getData(1)
        selectedRows.value = []
    })
}

// 重要函数：handleBatchRestore — 批量恢复选中商品
const handleBatchRestore = () => {
    const ids = getSelectedIds()
    if (!ids.length) {
        toast('请先选择商品')
        return
    }
    if (!window.confirm('是否确认批量恢复选中商品？')) {
        return
    }
    restoreGoods(ids).then(() => {
        toast('批量恢复成功')
        getData(false)
        selectedRows.value = []
    })
}

// 重要函数：handleBatchDestroy — 彻底删除选中商品（不可恢复）
const handleBatchDestroy = () => {
    const ids = getSelectedIds()
    if (!ids.length) {
        toast('请先选择商品')
        return
    }
    if (!window.confirm('彻底删除后无法恢复，是否继续？')) {
        return
    }
    destroyGoods(ids).then(() => {
        toast('彻底删除成功')
        getData(1)
        selectedRows.value = []
    })
}

// 重要函数：handleChangeBanners — 修改商品轮播图
const handleChangeBanners = (row) => {
    const value = window.prompt('请输入轮播图地址，多个用逗号分隔', (row.banners || []).join(','))
    if (value === null) {
        return
    }
    const banners = value.split(',').map(item => item.trim()).filter(Boolean)
    updateGoodsBanners(row.id, banners).then(() => {
        toast('轮播图设置成功')
    })
}

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
        tab: 'all',
        title: '',
        category_id: null,
        limit: 10,
    },
    getList: getGoodsList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => ({
            ...o,
            statusLoading: false
        }))
        total.value = res.totalCount
    },
    delete: deleteGoods,
    updateStatus: (id, status) => changeGoodsStatus([id], status),
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    handleSubmit,
    drawerTitle,
    resetForm,
    handleCreate,
    handleUpdate,
} = useInitForm({
    form: {
        title: '',
        category_id: null,
        cover: '',
        desc: '',
        unit: '',
        stock: 0,
        min_stock: 0,
        status: 1,
        stock_display: 1,
        min_price: 0,
        min_oprice: 0,
        content: ''
    },
    rules: {
        title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分类ID', trigger: 'change' }],
        cover: [{ required: true, message: '请上传商品封面', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
        min_price: [{ required: true, message: '请输入销售价', trigger: 'blur' }],
        min_oprice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
    },
    getData,
    create: createGoods,
    update: updateGoods,
})

// 重要函数：handleView — 读取并展示商品简要信息
const handleView = (id) => {
    readGoods(id).then(res => {
        toast(`商品名称：${res.title}，分类ID：${res.category_id}，库存：${res.stock}`, 'success')
    })
}

// 重要函数：handleCheck — 审核商品（同意或拒绝）
const handleCheck = (row) => {
    const agree = window.confirm('是否同意该商品审核？点击“确定”为同意，取消为拒绝。')
    checkGoods(row.id, agree ? 1 : 2).then(() => {
        toast('审核操作已提交')
        getData(false)
    })
}

</script>

<style scoped>
.buttom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
</style>