<!-- 页面: 分销设置 -->
<template>
    <el-card shadow="never" class="border-0">
        <el-form :model="form" ref="formRef" label-width="160px" class="mt-4">
            <el-form-item label="是否启用分销" prop="distribution_open">
                <el-switch v-model="form.distribution_open" :active-value="1" :inactive-value="0" />
            </el-form-item>

            <el-form-item label="一级返佣(%)" prop="store_first_rebate">
                <el-input-number v-model="form.store_first_rebate" :min="0" :max="100" />
            </el-form-item>

            <el-form-item label="二级返佣(%)" prop="store_second_rebate">
                <el-input-number v-model="form.store_second_rebate" :min="0" :max="100" />
            </el-form-item>

            <el-form-item label="分销海报图(多张)" prop="spread_banners">
                <div class="flex items-center">
                    <div v-for="(url, idx) in form.spread_banners" :key="idx" class="mr-2">
                        <ChooseImage v-model="form.spread_banners[idx]" />
                    </div>
                    <el-button @click="addBanner">新增</el-button>
                </div>
            </el-form-item>

            <el-form-item label="自购返佣" prop="is_self_brokerage">
                <el-switch v-model="form.is_self_brokerage" :active-value="1" :inactive-value="0" />
            </el-form-item>

            <el-form-item label="结算天数" prop="settlement_days">
                <el-input-number v-model="form.settlement_days" :min="0" />
            </el-form-item>

            <el-form-item label="佣金到账方式" prop="brokerage_method">
                <el-select v-model="form.brokerage_method" placeholder="选择方式">
                    <el-option label="手动" value="hand" />
                    <el-option label="微信" value="wx" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>

    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { getDistributionSetting, setDistributionSetting } from '~/api/distribution'

const formRef = ref(null)
const form = ref({
    distribution_open: 0,
    store_first_rebate: 0,
    store_second_rebate: 0,
    spread_banners: [],
    is_self_brokerage: 0,
    settlement_days: 7,
    brokerage_method: 'hand',
})

onMounted(() => {
    getDistributionSetting().then(res => {
        if (res) {
            // merge server fields into form
            Object.assign(form.value, res)
            if (!Array.isArray(form.value.spread_banners)) form.value.spread_banners = []
        }
    })
})

const addBanner = () => form.value.spread_banners.push('')

const submit = () => {
    setDistributionSetting(form.value).then(() => {
        // simple toast if util available
        // import toast lazily to avoid extra changes
        const { toast } = require('~/composables/util')
        toast('保存成功')
    })
}

</script>

<style scoped>
.mr-2 {
    margin-right: 8px
}
</style>
