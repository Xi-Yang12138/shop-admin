<!-- 页面: 商品分类管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <el-form :model="searchForm" label-width="80px" class="mb-3 flex items-center">
            <el-form-item label="分类名称">
                <el-input v-model="searchForm.name" placeholder="分类名称" clearable />
            </el-form-item>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="getData(1)">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <ListHeader @create="handleCreate" @refresh="getData" />

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="分类名称" />
            <el-table-column label="状态" width="140">
                <template #default="{ row }">
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
                <template #default="{ row }">
                    <el-button type="primary" text @click="handleUpdate(row)">编辑</el-button>
                    <el-popconfirm title="是否要删除该分类？" confirm-button-text="确认" cancel-button-text="取消" placement="bottom"
                        @confirm.stop="handleDelete(row.id)">
                        <template #reference>
                            <el-button type="primary" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type="primary" text @click="handleViewItems(row)">关联商品</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称" />
                </el-form-item>
            </el-form>
        </FormDrawer>

        <el-dialog title="分类关联商品" v-model="itemDialogVisible" width="60%">
            <el-form :model="itemForm" label-width="100px" class="mb-4">
                <el-form-item label="分类ID">
                    <el-input v-model="selectedCategoryId" disabled />
                </el-form-item>
                <el-form-item label="商品ID" prop="product_id">
                    <el-input-number v-model="itemForm.product_id" :min="1" placeholder="请输入商品ID" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddItem">关联商品</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="itemList" stripe style="width: 100%" v-loading="itemLoading">
                <el-table-column prop="id" label="关联ID" width="100" />
                <el-table-column prop="product_id" label="商品ID" width="120" />
                <el-table-column prop="product_name" label="商品名称" />
                <el-table-column label="操作" width="140">
                    <template #default="{ row }">
                        <el-popconfirm title="是否删除该关联？" confirm-button-text="确认" cancel-button-text="取消"
                            placement="bottom" @confirm.stop="handleDeleteItem(row.id)">
                            <template #reference>
                                <el-button type="primary" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util'
import { getCategoryList, createCategory, updateCategory, updateCategoryStatus, deleteCategory, getCategoryItemList, addCategoryItem, deleteCategoryItem } from '~/api/category'
import FormDrawer from '~/components/FormDrawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'

const itemDialogVisible = ref(false)
const selectedCategoryId = ref(null)
const itemLoading = ref(false)
const itemList = ref([])
const itemForm = ref({
    product_id: null
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
        name: ''
    },
    getList: getCategoryList,
    onGetListSuccess: (res) => {
        tableData.value = Array.isArray(res) ? res : res.list || []
        total.value = res.totalCount || tableData.value.length
    },
    delete: deleteCategory,
    updateStatus: updateCategoryStatus,
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
        name: ''
    },
    rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
    },
    getData,
    create: createCategory,
    update: updateCategory,
})

const handleViewItems = (row) => {
    selectedCategoryId.value = row.id
    itemForm.value = { product_id: null }
    itemDialogVisible.value = true
    loadItemList(row.id)
}

const loadItemList = (category_id) => {
    itemLoading.value = true
    getCategoryItemList(category_id).then(res => {
        itemList.value = Array.isArray(res) ? res : res.list || []
    }).finally(() => {
        itemLoading.value = false
    })
}

const handleAddItem = () => {
    if (!itemForm.value.product_id) {
        toast('请输入商品ID')
        return
    }
    addCategoryItem({ category_id: selectedCategoryId.value, product_id: itemForm.value.product_id }).then(() => {
        toast('关联商品成功')
        itemForm.value.product_id = null
        loadItemList(selectedCategoryId.value)
    })
}

const handleDeleteItem = (id) => {
    deleteCategoryItem(id).then(() => {
        toast('删除关联成功')
        if (selectedCategoryId.value) {
            loadItemList(selectedCategoryId.value)
        }
    })
}
</script>
