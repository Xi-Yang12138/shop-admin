<!-- 页面: 优惠券管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <el-form :model="searchForm" label-width="80px" class="mb-3 flex items-center">
            <el-form-item label="名称">
                <el-input v-model="searchForm.name" placeholder="优惠券名称" clearable />
            </el-form-item>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="getData(1)">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <ListHeader @create="handleCreate" @refresh="getData" />

        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="type" label="类型" width="100">
                <template #default="{ row }">
                    <span>{{ row.type === 1 ? '折扣' : '满减' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="value" label="面值" width="120" />
            <el-table-column prop="total" label="发行量" width="120" />
            <el-table-column prop="min_price" label="最低使用价" width="140" />
            <el-table-column prop="start_time" label="开始时间" width="180">
                <template #default="{ row }">{{ formatTime(row.start_time) }}</template>
            </el-table-column>
            <el-table-column prop="end_time" label="结束时间" width="180">
                <template #default="{ row }">{{ formatTime(row.end_time) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template #default="{ row }">
                    <el-button type="primary" text @click="handleUpdate(row)">编辑</el-button>
                    <el-popconfirm title="是否删除该优惠券？" confirm-button-text="确认" cancel-button-text="取消" placement="bottom"
                        @confirm.stop="handleDelete(row.id)">
                        <template #reference>
                            <el-button type="primary" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入优惠券名称" />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option :label="'满减'" :value="0" />
                        <el-option :label="'折扣'" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input-number v-model.number="form.value" :min="0" />
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model.number="form.total" :min="0" />
                </el-form-item>
                <el-form-item label="最低使用价" prop="min_price">
                    <el-input-number v-model.number="form.min_price" :min="0" />
                </el-form-item>
                <el-form-item label="开始时间" prop="start_time">
                    <el-date-picker v-model="form.start_time" type="datetime" placeholder="选择开始时间" />
                </el-form-item>
                <el-form-item label="结束时间" prop="end_time">
                    <el-date-picker v-model="form.end_time" type="datetime" placeholder="选择结束时间" />
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model.number="form.order" :min="0" />
                </el-form-item>
            </el-form>
        </FormDrawer>

    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util'
import { getCouponList, createCoupon, updateCoupon, deleteCoupon, updateCouponStatus } from '~/api/coupon'
import FormDrawer from '~/components/FormDrawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'

function formatTime(ts) {
    if (!ts) return '-'
    const t = Number(ts)
    // assume seconds
    const d = t < 1e12 ? new Date(t * 1000) : new Date(t)
    return d.toLocaleString()
}

const { searchForm, resetSearchForm, tableData, loading, currentPage, total, limit, getData, handleDelete, handleStatusChange } = useInitTable({
    searchForm: { name: '' },
    getList: getCouponList,
    onGetListSuccess: (res) => {
        tableData.value = Array.isArray(res) ? res : res.list || []
        total.value = res.totalCount || tableData.value.length
    },
    delete: deleteCoupon,
    updateStatus: updateCouponStatus,
})

const { formDrawerRef, formRef, form, rules, handleSubmit, drawerTitle, resetForm, handleCreate, handleUpdate } = useInitForm({
    form: {
        name: '',
        type: 0,
        value: 0,
        total: 0,
        min_price: 0,
        start_time: null,
        end_time: null,
        order: 50,
    },
    rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        value: [{ required: true, message: '请输入面值', trigger: 'blur' }],
        total: [{ required: true, message: '请输入发行量', trigger: 'blur' }],
        min_price: [{ required: true, message: '请输入最低使用价', trigger: 'blur' }],
        start_time: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        end_time: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
    },
    getData,
    create: (data) => {
        const payload = transformDates(data)
        return createCoupon(payload)
    },
    update: (id, data) => {
        const payload = transformDates(data)
        return updateCoupon(id, payload)
    }
})

function transformDates(d) {
    const copy = { ...d }
    if (copy.start_time && copy.start_time instanceof Date) copy.start_time = Math.floor(copy.start_time.getTime() / 1000)
    if (copy.end_time && copy.end_time instanceof Date) copy.end_time = Math.floor(copy.end_time.getTime() / 1000)
    return copy
}

// override handleDelete to show toast
const del = (id) => {
    return deleteCoupon(id).then(() => {
        toast('删除成功')
        getData(1)
    })
}

// replace useInitTable delete with our del
// (note: useInitTable already wired handleDelete to opt.delete; above we passed deleteCoupon, but we want toast behavior)

</script>

<style scoped>
.buttom {
    margin-top: 12px;
    text-align: right
}
</style>
