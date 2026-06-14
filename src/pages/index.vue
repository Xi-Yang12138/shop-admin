<template>
    <div class="contain">
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <template v-if="panels.length === 0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover" body-class="card-body">
                                <template #header>
                                    <div class="header">
                                        <el-skeleton-item variant="text" style="width: 40%" />

                                        <el-skeleton-item variant="text" style="width: 10%" />

                                    </div>
                                </template>
                                <el-skeleton-item variant="text" class="value" style="display:flex; width: 30%" />

                                <el-divider />
                                <div class="sub-item">
                                    <el-skeleton-item variant="text" style="width: 40%" />

                                    <el-skeleton-item variant="text" style="width: 10%" />

                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>


            <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
                <el-card shadow="hover" body-class="card-body">
                    <template #header>
                        <div class="header">
                            <span>{{ item.title }}</span>
                            <el-tag :type="item.unitColor || 'primary'" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>
                    </template>
                    <span class="value">
                        <CountTo :value="item.value" />
                    </span>
                    <el-divider />
                    <div class="sub-item">
                        <span class="sub-title">
                            {{ item.subTitle }}
                        </span>
                        <span class="sub-value">
                            {{ item.subValue }}
                        </span>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <indexNavs />

        <el-row :gutter="20">
            <el-col :span="12" :offset="0">
                <indexChart v-permission="['getStatistics3,GET']" />
            </el-col>

            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <indexCard title="店铺及商品提示" tip="店铺及商品提示" :arr="goods" />
                <indexCard title="交易提示" tip="需要立即处理的交易订单" :arr="order" />
            </el-col>
        </el-row>

    </div>



</template>

<script setup>
import { ref } from 'vue'
import indexNavs from '~/components/indexNavs.vue'
import CountTo from '~/components/CountTo.vue'
import indexChart from '~/components/indexChart.vue'
import indexCard from '~/components/indexCard.vue'
import { getStatistics1, getStatistics2 } from '~/api/index'

const panels = ref([])
const goods = ref([])
const order = ref([])

getStatistics1().then(res => {
    panels.value = res.panels
    // console.log(panels.value)
})

getStatistics2().then(res => {
    // console.log(res)
    goods.value = res.goods
    order.value = res.order
})


</script>

<style scoped>
.el-card {
    border: 0;
    height: 250px;
}

:deep(.card-body) {
    overflow: hidden;
}

.header,
.sub-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.value {
    display: flex;
    font-size: 40px;
    margin: 20px 0 40px 0;
    font-weight: bold;
    color: #616161;
}

.sub-title,
.sub-value {
    color: #646464
}
</style>