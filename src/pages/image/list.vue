<!-- 页面: 图库管理 -->
<template>
    <el-container class="contain" :style="{ height: h + 'px' }">
        <el-header class="image-header">
            <el-button type="primary" @click="handleOpenCreate">新增图片分类</el-button>
            <el-button type="warning" @click="handleOpenUpload">上传图片</el-button>

        </el-header>
        <el-container>
            <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
            <ImageMain ref="ImageMainRef" />
        </el-container>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 100 - 40 - 40

const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => {
    // console.log(image_class_id);
    ImageMainRef.value.loadData(image_class_id)
}

const handleOpenUpload = () => ImageMainRef.value.openUploadFile()
</script>

<style scoped>
.contain {
    background-color: #f5f7fa;
    height: 100%;
}

.image-header {
    display: flex;
    align-items: center;
}
</style>
