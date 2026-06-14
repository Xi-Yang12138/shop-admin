<template>
    <el-row :gutter="20">
        <el-col :span="3" :offset="0"  v-for="(item,index) in iconNav" :key="index">
            <el-card shadow="hover" class="header" @click="$router.push(item.path)">
                <div class="nav-item">
                    <el-icon>
                        <component :is="item.icon" :class="item.color" style="margin-bottom: 5px;" />
                    </el-icon>
                    <span>{{ item.title }}</span>
                </div>
            </el-card>

        </el-col>
    </el-row>

</template>

<script setup>
const iconNav = [
    {
        icon: 'user',
        color: 'text-light-blue-500',
        title: '用户',
        path: '/user/list'
    },
    {
        icon: 'shopping-cart',
        color: 'text-violet-500',
        title: '商品',
        path: '/goods/list'
    },
    {
        icon: 'tickets',
        color: 'text-fuchsia-500',
        title: '订单',
        path: '/order/list'
    },
    {
        icon: 'chat-dot-square',
        color: 'text-teal-500',
        title: '评价',
        path: '/comment/list'
    },
    {
        icon: 'picture',
        color: 'text-rose-500',
        title: '图库',
        path: '/image/list'
    },
    {
        icon: 'bell',
        color: 'text-green-500',
        title: '公告',
        path: '/notice/list'
    },
    {
        icon: 'set-up',
        color: 'text-grey-500',
        title: '配置',
        path: '/setting/base'
    },
    {
        icon: 'files',
        color: 'text-yellow-500',
        title: '优惠卷',
        path: '/coupon/list'
    },
]

</script>

<style scoped>
.header{
    margin:20px 0;
    cursor:pointer;
}
.nav-item{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
}
</style>
