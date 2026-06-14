<!-- 页面: 订单管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="100px" class="mb-3 flex">
            <el-form-item label="类型">
                <el-select v-model="searchForm.tab" placeholder="订单类型" style="width:180px">
                    <el-option v-for="(label, key) in tabs" :key="key" :label="label" :value="key" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单号">
                <el-input v-model="searchForm.no" placeholder="订单号" clearable />
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker v-model="searchForm.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="收货人">
                <el-input v-model="searchForm.name" placeholder="收货人" clearable />
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="searchForm.phone" placeholder="收货人手机号" clearable />
            </el-form-item>
            <el-form-item class="ml-auto">
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 操作 -->
        <div class="top-actions mb-3">
            <el-button type="danger" :disabled="!selectedRows.length" @click="handleBulkDelete">批量删除</el-button>
            <el-button @click="handleExport">导出订单</el-button>
            <el-button text @click="getData">刷新</el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading" @selection-change="onSelectionChange">
            <el-table-column type="selection" width="50" />
            <el-table-column prop="no" label="订单号" width="220" />
            <el-table-column label="收货人/电话" width="220">
                <template #default="{ row }">{{ row.name }}<br/>{{ row.phone }}</template>
            </el-table-column>
            <el-table-column prop="total_price" label="金额" width="120" />
            <el-table-column prop="tab" label="类型/状态" width="160">
                <template #default="{ row }">{{ tabs[row.tab] || row.tab }} / {{ row.status_text || '-' }}</template>
            </el-table-column>
            <el-table-column prop="created_at" label="下单时间" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" text @click="viewOrder(row)">查看</el-button>
                    <el-button type="primary" text @click="ship(row)" v-if="row.can_ship">发货</el-button>
                    <el-button type="primary" text @click="handleRefund(row)" v-if="row.can_refund">退款处理</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="buttom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { toast, showModal, showPrompt } from '~/composables/util'
import { useInitTable } from '~/composables/useCommon'
import { getOrderList, deleteOrdersBulk, shipOrder, handleOrderRefund, exportOrders } from '~/api/order'

const tabs = {
    all: '全部',
    nopay: '待支付',
    noship: '待发货',
    shiped: '已发货',
    received: '已收货',
    finish: '已完成',
    closed: '已关闭',
    refunding: '退款中',
}

const selectedRows = ref([])

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
        no: '',
        timeRange: null,
        name: '',
        phone: ''
    },
    getList(page, form) {
        const q = { ...form }
        if (q.timeRange && q.timeRange.length === 2) {
            q.starttime = q.timeRange[0]
            q.endtime = q.timeRange[1]
        }
        delete q.timeRange
        return getOrderList(page, q)
    },
    onGetListSuccess: (res) => {
        tableData.value = (res.list || res).map(o => ({ ...o }))
        total.value = res.totalCount || res.total || (res.list ? res.list.length : 0)
    },
    delete(ids) { return deleteOrdersBulk(ids) },
})

function onSelectionChange(val) {
    selectedRows.value = val
}

async function handleBulkDelete() {
    const ids = selectedRows.value.map(r => r.id)
    if (!ids.length) return
    await showModal('确认删除所选订单吗？', 'warning')
    deleteOrdersBulk(ids).then(() => {
        toast('删除成功')
        getData(1)
    })
}

async function ship(row) {
    const company = await showPrompt('请输入快递公司', '')
    const no = await showPrompt('请输入快递单号', '')
    shipOrder(row.id, { express_company: company, express_no: no }).then(() => {
        toast('已发货')
        getData()
    })
}

async function handleRefund(row) {
    try {
        await showModal('是否同意退款？', 'warning')
        // 同意
        handleOrderRefund(row.id, { agree: 1 }).then(() => {
            toast('已同意退款')
            getData()
        })
    } catch (e) {
        // 取消 => 输入拒绝理由
        const reason = await showPrompt('请输入拒绝理由', '')
        handleOrderRefund(row.id, { agree: 0, disagree_reason: reason }).then(() => {
            toast('已拒绝退款')
            getData()
        })
    }
}

function viewOrder(row) {
    if (typeof window !== 'undefined' && window.location) {
        window.open(`/#/order/${row.id}`, '_blank')
    }
}

function handleExport() {
    const q = { tab: searchForm.tab }
    if (searchForm.timeRange && searchForm.timeRange.length === 2) {
        q.starttime = searchForm.timeRange[0]
        q.endtime = searchForm.timeRange[1]
    }
    exportOrders(q).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'orders.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
    })
}

</script>

<style scoped>
.top-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
}
.buttom {
    display:flex;
    align-items:center;
    justify-content:center;
    margin-top:20px;
}
</style>