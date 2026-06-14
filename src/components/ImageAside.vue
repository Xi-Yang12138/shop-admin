<template>
    <el-aside width="200px" class="image-aside" v-loading="loading">
        <div class="top">

            <AsideList :active="activeId === item.id" v-for="(item, index) in list" :key="index"
                @edit="handleEdit(item)" @delete="handleDelete(item.id)" @click="handleChangeActiveId(item.id)">{{
                item.name }}
            </AsideList>

        </div>
        <div class="buttom">
            <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>

    </el-aside>

    <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
            </el-form-item>
        </el-form>
    </FormDrawer>

</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
    getImageClassList,
    createImageClass,
    updateImageClass,
    deleteImageClass,
} from '~/api/image_class'
import AsideList from './AsideList.vue'
import FormDrawer from './FormDrawer.vue'
import { toast } from '~/composables/util'

//加载动画
const loading = ref(false)

const list = ref([])
const activeId = ref(0)
const drawerTitle = computed(() => editId.value ? '修改' : '新增')

//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)


//获取数据
function getData(p = null) {
    if (typeof p === 'number') {
        currentPage.value = p
    }

    loading.value = true
    getImageClassList(currentPage.value).then(res => {
        total.value = res.totalCount
        list.value = res.list
        let item = list.value[0]
        if (item) {
            handleChangeActiveId(item.id)
        }
    }).finally(() => {
        loading.value = false
    })
}

getData()

const editId = ref(0)
const formDrawerRef = ref(null)
const form = reactive({
    name: '',
    order: 50
})
const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ]
}
const formRef = ref(null)
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return
        }
        formDrawerRef.value.showLoading()
        const fun = editId.value ? updateImageClass(editId.value, form) : createImageClass(form)
        fun.then(res => {
            toast(drawerTitle.value + '成功')
            getData(editId.value ? currentPage.value : 1)
            formDrawerRef.value.close()
        }).finally(() => {
            formDrawerRef.value.hideLoading()
        })

    })
}

//新增
const handleCreate = () => {
    editId.value = 0
    form.name = ''
    form.order = 50
    formDrawerRef.value.open()
}

//编辑
const handleEdit = (row) => {
    editId.value = row.id
    form.name = row.name
    form.order = row.order
    formDrawerRef.value.open()

}

//删除
const handleDelete = (id) => {
    loading.value = true
    deleteImageClass(id).then(res => {
        toast('删除成功')
        getData()
    }).catch(err => {
        console.log(err.response.data)
    }).finally(() => {
        loading.value = false
    })
}

//选中图库分类ID
const emit = defineEmits(['change'])
//切换分类
function handleChangeActiveId(id) {
    activeId.value = id
    emit('change', id)
}


defineExpose({
    handleCreate
})

</script>

<style scoped>
.image-aside {
    position: relative;
    width: 30%;
    border-right: 1px solid #e4e7ed;
}

.image-aside .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 120px;
    overflow-y: auto;
}

.image-aside .buttom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.aside-list {
    height: 60px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    cursor: pointer;
}

.aside-list:hover,
.active {
    @apply bg-blue-100;
}

.aside-list .edit-btn {
    margin-left: auto;
}
</style>