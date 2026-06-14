<template>
<!-- 页面: 基础设置 -->
    <el-card shadow="never" class="border-0">
        <el-form :model="form" ref="formRef" label-width="160px" class="mt-4">
            <el-form-item label="是否开启注册" prop="open_reg">
                <el-switch v-model="form.open_reg" :active-value="1" :inactive-value="0" />
            </el-form-item>

            <el-form-item label="注册方式" prop="reg_method">
                <el-select v-model="form.reg_method" placeholder="选择">
                    <el-option label="用户名注册" value="username" />
                    <el-option label="手机号注册" value="phone" />
                </el-select>
            </el-form-item>

            <el-form-item label="密码最小长度" prop="password_min">
                <el-input-number v-model="form.password_min" :min="0" />
            </el-form-item>

            <el-form-item label="上传方式" prop="upload_method">
                <el-select v-model="form.upload_method" placeholder="选择">
                    <el-option label="本地" value="local" />
                    <el-option label="OSS" value="oss" />
                </el-select>
            </el-form-item>

            <el-form-item label="上传回调地址" prop="upload_config.http">
                <el-input v-model="form.upload_config.http" placeholder="http://..." />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>

    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSysConfig, updateSysConfig } from '~/api/sysconfig'
import { toast } from '~/composables/util'

const formRef = ref(null)
const form = ref({
    open_reg: 0,
    reg_method: 'username',
    password_min: 6,
    upload_method: 'local',
    upload_config: { http: '' },
})

onMounted(() => {
    getSysConfig().then(res => {
        if (res) Object.assign(form.value, res)
    })
})

const submit = () => {
    updateSysConfig(form.value).then(() => {
        toast('保存成功')
    })
}

</script>
