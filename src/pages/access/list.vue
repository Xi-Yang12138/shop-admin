<template>
    <el-card shadow="never" body-class="card-body">
        <ListHeader @create="handleCreate" @refresh="getData" />
        <el-tree style="max-width: 100%" :data="tableData" :props="{ label: 'name', children: 'child' }"
            v-loading="loading" node-key="id" :default-expanded-keys="defaultExpandedKeys" class="tree">
            <template #default='{ data }'>
                <div class="tree-node">
                    <div class="left">
                        <el-tag :type="data.menu ? 'primary' : 'info'">{{ data.menu ? '菜单' : '权限' }}</el-tag>
                        <el-icon class="text-base" v-if="data.icon">
                            <component :is='data.icon'></component>
                        </el-icon>
                        <span class="text-sm">{{ data.name }}</span>
                    </div>
                    <div class="right">
                        <el-switch :model-value="data.status" :active-value="1" :inactive-value="0"
                            :loading="data.statusLoading" :disabled="data.super === 1"
                            @change="handleStatusChange($event, data)">
                        </el-switch>
                        <el-button type="primary" text @click.stop="handleUpdate(data)">修改</el-button>
                        <el-button type="primary" text @click.stop="addChild(data.id)">增加</el-button>
                        <el-popconfirm title="是否要删除该记录？" confirm-button-text="确认" cancel-button-text="取消"
                            placement="bottom" @confirm.stop="handleDelete(data.id)">
                            <template #reference>
                                <el-button type="primary" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>

            </template>
        </el-tree>

        <!-- 新增弹屉 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader v-model="form.rule_id" :options="options"
                        :props="{ value: 'id', label: 'name', children: 'child', checkStrictly: true, emitPath: false }"
                        placeholder="请选择上级菜单" />
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :value="1" border>菜单</el-radio>
                        <el-radio :value="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="form.menu === 1">
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu === 1 && form.rule_id > 0">
                    <el-input v-model="form.frontpath" placeholder="请输入前端路由"></el-input>
                </el-form-item>
                <el-form-item label="后端规则" prop="condition" v-if="form.menu === 0">
                    <el-input v-model="form.condition" placeholder="请输入后端规则"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method" v-if="form.menu === 0">
                    <el-select v-model="form.method" placeholder="请选择请求方式">
                        <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item"
                            :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="1" :max="100" />
                </el-form-item>
            </el-form>

        </FormDrawer>
    </el-card>

</template>

<script setup>
import { ref } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import { getRuleList, createRule, updateRule, updateRuleStatus, deleteRule } from '~/api/rule'
import { useInitTable, useInitForm } from '~/composables/useCommon'
import FormDrawer from '~/components/FormDrawer.vue'
import IconSelect from '~/components/IconSelect.vue'


const options = ref([])
const defaultExpandedKeys = ref([])
const {
    tableData,
    loading,
    getData,
    handleStatusChange,
    handleDelete,
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        options.value = res.rules
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
    },
    delete: deleteRule,
    updateStatus: updateRuleStatus,
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
        rule_id: 0,
        menu: 0,
        name: '',
        condition: '',
        method: 'GET',
        status: 1,
        order: 50,
        icon: '',
        frontpath: '',
    },
    rules: {},
    getData,
    update: updateRule,
    create: createRule,
})

//添加子分类
const addChild = (id) => {
    handleCreate()
    form.rule_id = id
    form.status = 1
}

</script>

<style scoped>
:deep(.card-body) {
    overflow-y: auto;
    height: 80vh;
}

:deep(.el-tree-node__content) {
    height: 50px;
}

.tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.left {
    display: flex;
    align-items: center;
    gap: 10px;
}

:deep(.el-tag__content) {
    padding: 2px 10px;
    border-radius: 4px;
    @apply text-sm text-blue-500;
}

.right {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 20px;
}
</style>
