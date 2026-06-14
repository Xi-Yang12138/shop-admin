<template>
    <div class="aside-list" :class="{ 'active': active }">
        <!-- //超出部分省略号 -->
        <span class="truncate">
            <slot />
        </span>
        <el-button text type="primary" size="large" class="edit-btn" @click.stop="$emit('edit')">
            <el-icon>
                <Edit />
            </el-icon>
        </el-button>

        <span @click.stop="() => { }">
            <el-popconfirm title="是否要删除该分类？" confirm-button-text="确认" cancel-button-text="取消"
                @confirm.stop="$emit('delete')">
                <template #reference>
                    <el-button text type="primary" size="large">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </span>
    </div>
</template>

<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
})

defineEmits(['edit', 'delete'])
</script>

<style scoped>
.aside-list {
    height: 100px !important;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    cursor: pointer;
}

.aside-list:hover,
.active {
    @apply bg-blue-100;
}

.aside-list .edit-btn {
    margin-left: auto;
}
</style>
