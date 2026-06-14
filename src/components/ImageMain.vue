<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top">
            <el-row :gutter="20">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative" :body-style="{ 'padding': 0 }"
                        :class="{ 'border-blue-500': item.checked }">
                        <el-image :src="item.url" fit="fill" :lazy="true" class="image" :preview-src-list="[item.url]"
                            :initial-index="0"></el-image>
                        <div class="image-name truncate">{{ item.name }}</div>
                        <div class="image-button">

                            <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)" style="margin-right: 10px;"/>

                            <el-button type="primary" text @click="handleEdit(item)">重命名</el-button>
                            <el-popconfirm title="是否要删除该图片？" confirm-button-text="确认" cancel-button-text="取消"
                                placement="bottom" @confirm.stop="handleDelete(item.id)">
                                <template #reference>
                                    <el-button type="primary" text>删除</el-button>
                                </template>
                            </el-popconfirm>

                        </div>
                    </el-card>

                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager , next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-main>

    <el-drawer v-model="drawer" title="上传图片">
        <upload-file :data="{ image_class_id }" @success="handleUploadSuccess" />
    </el-drawer>
</template>

<script setup>
import {
    getImageList,
    updateImage,
    deleteImage
} from '~/api/image'
import { ref, computed } from 'vue'
import {
    showPrompt,
    toast
} from '~/composables/util'
import UploadFile from '~/components/UploadFile.vue'

//上传图片
const drawer = ref(false)
const openUploadFile = () => {
    drawer.value = true
}

//分类
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const list = ref([])
const loading = ref(false)
const image_class_id = ref(0)

function getData(p = null) {
    if (typeof p === 'number') {
        currentPage.value = p
    }

    loading.value = true
    getImageList(image_class_id.value, currentPage.value).then(res => {
        total.value = res.totalCount
        list.value = res.list.map(o => ({
            ...o,
            checked: false
        }))

    }).finally(() => {
        loading.value = false
    })
}

//根据分类ID重新加载图片列表
function loadData(id) {
    currentPage.value = 1
    image_class_id.value = id
    getData()
}

//重命名
const handleEdit = (item) => {
    showPrompt('重命名', item.name).then(({ value }) => {
        loading.value = true
        updateImage(item.id, value).then(res => {
            toast('修改成功')
            getData()
        }).finally(() => {
            loading.value = false
        })
    })
}

//删除
const handleDelete = (id) => {
    loading.value = true
    deleteImage([id]).then(res => {
        toast('删除成功')
        getData()
    }).finally(() => {
        loading.value = false
    })
}

//上传成功
const handleUploadSuccess = (res) => {
    toast('上传成功')
    getData(1)
}

defineProps({
    openChoose:{
        type: Boolean,
        default: false
    }
})

//选中的图片
const emit = defineEmits(['choose'])
const checkedImage = computed(() => {
    return list.value.filter(o => o.checked)
})
const handleChooseChange = (item) => {
    if (item.checked && checkedImage.value.length > 1) {
        item.checked = false
        return toast('最多只能选择一张图片', 'error')
    }
    emit('choose', checkedImage.value)
}

defineExpose({
    loadData,
    openUploadFile
})


</script>

<style scoped>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 120px;
    overflow-y: auto;
    overflow-x: hidden;
}

.image-main .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.el-row {
    margin: 0 !important;
}

.el-col {
    padding-bottom: 10px;
}

.image {
    width: 100%;
    height: 200px;
}

.image-name {
    position: absolute;
    top: 170px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    text-align: left;
    padding-left: 4px;
}

.image-button {
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>