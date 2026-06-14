<!-- 页面: 登录页 -->
<template>
    <el-row class="contain">

        <el-col :lg="16" :md="12" class="left">
            <div>
                <div class="left-title">欢迎光临</div>
                <div class="left-content">电商演示地址</div>
            </div>
        </el-col>

        <el-col :lg="8" :md="12" class="right">
            <div>
                <div class="right-title">欢迎回来</div>
                <div class="right-content">账号密码登录</div>
                <el-form ref="formRef" :rules="rules" :model="form">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" style="width: 240px" placeholder="请输入账号">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <User />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input v-model="form.password" style="width: 240px" type="password" placeholder="请输入密码"
                            show-password>
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <Lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>

                <el-button type="primary" @click="onSubmit" :loading="loading">登录</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { toast } from '~/composables/util'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import { User, Lock } from '@element-plus/icons-vue'
import { setToken } from '~/composables/auth'

//获取store实例
const store = useStore()

const router = useRouter()

const form = reactive({
    username: '',
    password: ''
})

const rules = {
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 5, message: '账号长度必须在 3 到 5 个字符之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 12, message: '密码长度必须在 4 到 12 个字符之间', trigger: 'blur' }
    ]
}

const formRef = ref(null)
const loading = ref(false)

const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        loading.value = true

        store.dispatch('login', form).then(res => {
            toast('登录成功', 'success')
            router.push('/')
        }).finally(() => {
            loading.value = false
        })
    })
}

//监听回车事件
function onKeyup(e) {
    if (e.key === 'Enter') {
        onSubmit()
    }

}

// 添加键盘监听
onMounted(() => {
    document.addEventListener('keyup', onKeyup)
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', onKeyup)
})

</script>

<style scoped>
.contain {
    height: 100vh;
}

.left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #007bff;
}

.left .left-title {
    font-size: 5xl;
    font-weight: bold;
    color: #fff;
    margin-bottom: 4px;
}

.left .left-content {
    color: #fff;
    font-size: 16px;
    font-weight: 400;
}

.right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.left-title {
    font-size: 100px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 60px;
}

.right-title {
    font-size: 50px;
    font-weight: bold;
    margin-bottom: 30px;
}

.right-content {
    margin: 20px 0;
}
</style>