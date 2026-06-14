<template>
<!-- 页面: 交易设置 -->
    <el-card shadow="never" class="border-0">
        <el-form :model="form" ref="formRef" label-width="160px" class="mt-4">
            <el-form-item label="未支付订单自动关闭(分钟)" prop="close_order_minute">
                <el-input-number v-model="form.close_order_minute" :min="0" />
            </el-form-item>

            <el-form-item label="自动确认收货(天)" prop="auto_received_day">
                <el-input-number v-model="form.auto_received_day" :min="0" />
            </el-form-item>

            <el-form-item label="售后可申请天数" prop="after_sale_day">
                <el-input-number v-model="form.after_sale_day" :min="0" />
            </el-form-item>

            <el-divider />
            <h3>支付宝配置</h3>
            <el-form-item label="app_id" prop="alipay.app_id">
                <el-input v-model="form.alipay.app_id" />
            </el-form-item>
            <el-form-item label="公钥" prop="alipay.ali_public_key">
                <el-input v-model="form.alipay.ali_public_key" />
            </el-form-item>

            <el-divider />
            <h3>微信支付配置</h3>
            <el-form-item label="公众号 APPID" prop="wxpay.app_id">
                <el-input v-model="form.wxpay.app_id" />
            </el-form-item>
            <el-form-item label="商户号 mch_id" prop="wxpay.mch_id">
                <el-input v-model="form.wxpay.mch_id" />
            </el-form-item>
            <el-form-item label="API key" prop="wxpay.key">
                <el-input v-model="form.wxpay.key" />
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
    close_order_minute: 0,
    auto_received_day: 7,
    after_sale_day: 0,
    alipay: { app_id: '', ali_public_key: '', private_key: '' },
    wxpay: { app_id: '', miniapp_id: '', secret: '', appid: '', mch_id: '', key: '', cert_client: '', cert_key: '' }
})

onMounted(() => {
    getSysConfig().then(res => {
        if (res) Object.assign(form.value, res)
    })
})

const submit = () => {
    updateSysConfig(form.value).then(() => toast('保存成功'))
}

</script>