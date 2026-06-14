<template>
    <el-card shadow="never" :body-style="{ height: '400px', overflow: 'hidden' }">
        <template #header>
            <div class="header">
                <span>订单统计</span>
                <div>
                    <el-check-tag v-for="(item, index) in options" :key="index" :checked="current === item.value"
                        @click="handleChoose(item.value)">{{ item.text }}</el-check-tag>
                </div>
            </div>
        </template>
        <div ref="el" id="chart" style="width: 100%; height: 400px;"></div>
    </el-card>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts';
import { getStatistics3 } from '~/api/index'
import { useResizeObserver } from '@vueuse/core'

const current = ref('week')
const options = [{
    text: '近1个月',
    value: 'month'
}, {
    text: '近1周',
    value: 'week'
}, {
    text: '近24小时',
    value: 'hour'
},]

const handleChoose = (type) => {
    current.value = type
    getData()
}

let myChart = null;

onMounted(() => {
    const chartDom = document.getElementById('chart');
    if (chartDom) {
        myChart = echarts.init(chartDom);
        getData()
    }
})

onBeforeUnmount(() => {
    //销毁以避免白屏
    if (myChart) echarts.dispose(myChart)
})

function getData() {
    myChart.showLoading()
    getStatistics3(current.value).then(res => {
        // console.log(res);
        let option = {
            xAxis: {
                type: 'category',
                data: res.x
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: res.y,
                    type: 'bar'
                }
            ]
        };
        myChart.setOption(option);
    }).finally(() => {
        myChart.hideLoading()
    })


}

//让ECharts响应式变化
const el = ref(null)
useResizeObserver(el, () => {
    if(myChart) myChart.resize()
})
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    overflow-y: hidden
}

.my-card-body {
    height: 400px;
    background-color: aquamarine;
}

.el-card {
    height: 500px !important;
}
</style>