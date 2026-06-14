<template>
    <div v-if="modelValue">
        <el-image :src="modelValue" fit="cover" :lazy="true" class="choose-image"></el-image>
        
    </div>

    <div class="choose-image-btn" @click="open">
        <el-icon class="icon-plus">
            <Plus />
        </el-icon>
    </div>

    <el-dialog title="选择图片" v-model="dialogVisible" width="70%" top="5vh">

        <el-container class="contain" style="height: 70vh;">
            <el-header class="image-header">
                <el-button type="primary" @click="handleOpenCreate">新增图片分类</el-button>
                <el-button type="warning" @click="handleOpenUpload">上传图片</el-button>

            </el-header>
            <el-container>
                <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
                <ImageMain :openChoose="true" ref="ImageMainRef" @choose="handleChoose" />
            </el-container>
        </el-container>

        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true
}
const close = () => {
    dialogVisible.value = false
}

const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => {
    // console.log(image_class_id);
    ImageMainRef.value.loadData(image_class_id)
}

const handleOpenUpload = () => ImageMainRef.value.openUploadFile()

const props = defineProps({
    modelValue: [String, Array]
})
const emit = defineEmits(['update:modelValue'])

let urls = []
const handleChoose = (e) => {
    urls = e.map(o => o.url)

}

const submit = () => {
    if (urls.length) {     
        emit('update:modelValue', urls[0])
        close()
    }
}

</script>



<style scoped>
.choose-image{
    width: 100px;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    margin-right: 10px;

}
.choose-image-btn {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    @apply hover:bg-gray-200;
}

.icon-plus {
    font-size: 24px;
    @apply text-gray-500;
}

.contain {
    background-color: #f5f7fa;
    height: 100%;
}

.image-header {
    display: flex;
    align-items: center;
}
</style>
