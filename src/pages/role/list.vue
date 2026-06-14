<!-- 页面: 角色管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />

        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" class="flex">
            <el-table-column prop="name" label="角色名称" width="300" />
            <el-table-column prop="desc" label="角色描述" width="300" />
            <el-table-column prop="status" label="状态" width="100">
                <template #default='{ row }'>
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :loading="row.statusLoading" :disabled="row.super === 1"
                        @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
                <template #default="scope">
                    <el-button type="primary" text @click="openSetRule(scope.row)">配置权限</el-button>
                    <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要删除该角色？" confirm-button-text="确认" cancel-button-text="取消" placement="bottom"
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="请输入角色描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!-- 权限配置 -->
        <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRoleSubmit">
            <el-tree-v2 ref="elTreeRef" node-key="id" :default-expanded-keys="defaultExpandedKeys"
                style="max-width: 600px" :data="ruleList" :props="{ label: 'name', children: 'child' }" show-checkbox
                :height="treeHeight" @check="handleTreeCheck">
                <template #default="{ data }">
                    <div class="left">
                        <el-tag :type="data.menu ? 'primary' : 'info'">{{ data.menu ? '菜单' : '权限' }}</el-tag>
                        <el-icon class="text-base" v-if="data.icon">
                            <component :is='data.icon'></component>
                        </el-icon>
                        <span class="text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>

    </el-card>



</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util'
import { getRoleList, createRole, updateRole, deleteRole, updateRuleStatus, setRoleRules } from '~/api/role'
import FormDrawer from '~/components/FormDrawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import {
    useInitTable,
    useInitForm,
} from '~/composables/useCommon'
import { getRuleList } from '~/api/rule'

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
} = useInitTable({
    getList: getRoleList,
    delete: deleteRole,
    updateStatus: updateRuleStatus,
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
        name: '',
        desc: '',
        status: 1,
    },
    rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
    },
    getData,
    update: updateRole,
    create: createRole,
})

const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
//当前角色拥有的权限ID
const ruleIds = ref([])

const openSetRule = (row) => {
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 300
    getRuleList(1).then(res => {
        ruleList.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
        setRuleFormDrawerRef.value.open()

        ruleIds.value = row.rules.map(o => o.id)
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value)
        }, 150)
    })
}
const handleSetRoleSubmit = () => {
    setRuleFormDrawerRef.value.showLoading()
    setRoleRules(roleId.value, ruleIds.value).then(res => {
        toast('权限配置成功')
        getData()
    }).finally(() => {
        setRuleFormDrawerRef.value.hideLoading()
        setRuleFormDrawerRef.value.close()
    })
}

//树节点选中事件
const handleTreeCheck = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

</script>

<style scoped>
.buttom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.left {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>