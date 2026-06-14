import { ref, reactive } from 'vue'
import { logout, updatePassword } from '~/api/manager'
import { showModal, toast } from '~/composables/util'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export function useRePassword() {

    const router = useRouter()
    const store = useStore()

    //修改密码
    const fromDrawerRef = ref(null)
    // const showDrawer = ref(false)

    const form = reactive({
        oldpassword: '',
        password: '',
        repassword: ''
    })

    const rules = {
        oldpassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 3, max: 5, message: '旧密码长度必须在 3 到 5 个字符之间', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 4, max: 12, message: '密码长度必须在 4 到 12 个字符之间', trigger: 'blur' }
        ],
        repassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 4, max: 12, message: '确认密码长度必须在 4 到 12 个字符之间', trigger: 'blur' }
        ]
    }
    const formRef = ref(null)

    const onSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            fromDrawerRef.value.showLoading()
            updatePassword(form).then(res => {
                toast('修改密码成功，请重新登录！', 'success')
                store.dispatch('logout')
                router.push('/login')
            }).finally(() => {
                fromDrawerRef.value.hideLoading()
            })
        })
    }

    const openRePasswordFrom = () => fromDrawerRef.value.open()

    return {
        fromDrawerRef,
        form,
        rules,
        formRef,
        onSubmit,
        openRePasswordFrom
    }
}

export function useLogout() {
    const router = useRouter()
    const store = useStore()
    function handleLogout() {
        showModal('是否要退出登录？').then(res => {
            logout().finally(() => {
                console.log(res);

                store.dispatch('logout')
                //跳转登录页
                router.push('/login')

                //提示退出登录成功
                toast('退出登录成功！')
            })
        })
    }
    return {
        handleLogout
    }
}