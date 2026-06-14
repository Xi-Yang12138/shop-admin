import { ref, reactive, computed } from 'vue'
import { toast } from '~/composables/util'

//搜索、分页、删除、状态改变
export function useInitTable(opt = {}) {

    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }

    const roles = ref([])

    const tableData = ref([])
    const loading = ref(false)

    //分页
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)

    //获取数据
    function getData(p = null) {
        if (typeof p === 'number') {
            currentPage.value = p
        }

        loading.value = true
        opt.getList(currentPage.value, searchForm).then(res => {
            // console.log(res)
            if (opt.onGetListSuccess && typeof opt.onGetListSuccess === 'function') {
                opt.onGetListSuccess(res)
            } else {
                tableData.value = res.list
                total.value = res.totalCount
            }

        }).finally(() => {
            loading.value = false
        })
    }

    getData()

    //删除
    const handleDelete = (id) => {
        loading.value = true
        opt.delete(id).then(res => {
            toast('删除成功')
            getData(1)
        }).finally(() => {
            loading.value = false
        })
    }

    //状态改变
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status).then(res => {
            row.status = status
            toast('状态改变成功')
        }).finally(() => {
            row.statusLoading = false
        })

    }

    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData,
        handleDelete,
        handleStatusChange,
    }
}

//新增、修改
export function useInitForm(opt = {}) {
    //表单部分
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const defaultForm = opt.form
    const form = reactive({})
    const loading = ref(false)
    const rules = opt.rules
    const handleSubmit = () => {
        formRef.value.validate().then((valid) => {
            if (!valid) return

            formDrawerRef.value.showLoading()

            const fun = updateId.value ? opt.update(updateId.value, form) : opt.create(form)

            fun.then(res => {
                toast(updateId.value ? '修改成功' : '新增成功')
                // 修改刷新当前页，新增刷新第一页
                opt.getData(updateId.value ? false : 1)
            }).finally(() => {
                formDrawerRef.value.hideLoading()
                formDrawerRef.value.close()
                loading.value = false
            })
        })
    }

    //标识
    const updateId = ref(0)
    const drawerTitle = computed(() => {
        return updateId.value ? '修改' : '新增'
    })

    //重置表单
    function resetForm(row = false) {
        if (formRef.value) {
            formRef.value.clearValidate()
        }
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }

    //新增
    const handleCreate = () => {
        updateId.value = 0
        resetForm(defaultForm)
        formDrawerRef.value.open()
    }

    //修改
    const handleUpdate = (row) => {
        updateId.value = row.id
        resetForm(row)
        formDrawerRef.value.open()
    }

    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        handleSubmit,
        updateId,
        drawerTitle,
        resetForm,
        handleCreate,
        handleUpdate,
    }
}
