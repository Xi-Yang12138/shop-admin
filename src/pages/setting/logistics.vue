<template>
<!-- 页面: 物流设置 -->
    <el-card shadow="never" class="border-0">
        <el-form :model="form" ref="formRef" label-width="160px" class="mt-4">
            <el-form-item label="运送方式说明" prop="ship">
                <el-input type="textarea" v-model="form.ship" rows="4" />
            </el-form-item>

            <el-form-item label="上传证书(.pem)">
                <input type="file" ref="fileRef" @change="handleFileChange" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>

    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSysConfig, updateSysConfig, uploadSysConfigFile } from '~/api/sysconfig'
import { toast } from '~/composables/util'

const formRef = ref(null)
const fileRef = ref(null)
const form = ref({ ship: '' })

onMounted(() => {
    getSysConfig().then(res => {
        if (res) Object.assign(form.value, res)
    })
})

const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    uploadSysConfigFile(f).then(res => {
        toast('上传成功')
        // server returns path, you may want to store it
    })
}

const submit = () => {
    updateSysConfig(form.value).then(() => toast('保存成功'))
}

</script>
