<!-- 页面: 规格管理 -->
<template>
    <el-card shadow="never" class="border-0">
        <div class="controls">
            <el-input v-model.number="goodsId" placeholder="输入商品ID并加载" style="width:240px;margin-right:8px" />
            <el-button type="primary" @click="load">加载规格</el-button>
            <el-button type="success" @click="openCreateCard" :disabled="!goodsId" style="margin-left:8px">添加规格卡</el-button>
            <el-button @click="openUpdateSkus" :disabled="!goodsId" style="margin-left:8px">更新商品规格 (updateskus)</el-button>
        </div>

        <el-row :gutter="16" style="margin-top:16px">
            <el-col :span="12">
                <el-card>
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <div>规格卡列表 ({{ cards.length }})</div>
                    </div>

                    <el-table :data="cards" style="width:100%;margin-top:12px">
                        <el-table-column prop="id" label="ID" width="80" />
                        <el-table-column prop="name" label="名称" />
                        <el-table-column prop="order" label="顺序" width="100">
                            <template #default="{ row }">
                                <el-input-number v-model.number="row.order" size="small" @change="changeOrder(row)" :min="0" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="300">
                            <template #default="{ row }">
                                <el-button size="mini" @click="openEditCard(row)">编辑</el-button>
                                <el-button size="mini" type="primary" @click="openValues(row)">值管理</el-button>
                                <el-button size="mini" type="danger" @click="removeCard(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card>
                    <div>调试 / 手动调用</div>
                    <el-input type="textarea" :rows="10" v-model="rawPayload" placeholder='填写要发送给 updateskus 的 JSON（例如：{"skus":[...]})' />
                    <div style="margin-top:8px">
                        <el-button type="primary" @click="callUpdateSkus" :disabled="!goodsId">发送 updateskus</el-button>
                    </div>
                    <el-divider />
                    <div>返回/状态: {{ statusMsg }}</div>
                </el-card>
            </el-col>
        </el-row>

        <!-- card form dialog -->
        <el-dialog v-model:visible="showCardDialog" title="规格卡">
            <el-form :model="cardForm" label-width="90px">
                <el-form-item label="名称">
                    <el-input v-model="cardForm.name" />
                </el-form-item>
                <el-form-item label="顺序">
                    <el-input-number v-model.number="cardForm.order" :min="0" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="cardForm.type" placeholder="请选择">
                        <el-option :label="'普通'" :value="0" />
                        <el-option :label="'颜色'" :value="1" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showCardDialog = false">取消</el-button>
                <el-button type="primary" @click="saveCard">保存</el-button>
            </template>
        </el-dialog>

        <!-- values dialog -->
        <el-dialog v-model:visible="showValuesDialog" title="管理规格值">
            <div style="margin-bottom:8px">规格卡：{{ currentCard?.name }} (ID: {{ currentCard?.id }})</div>
            <el-input v-model="newValue.name" placeholder="值名称" style="width:240px;margin-right:8px" />
            <el-input-number v-model.number="newValue.order" :min="0" style="width:120px;margin-right:8px" />
            <el-button @click="addValue" type="primary">添加值</el-button>

            <el-table :data="values" style="width:100%;margin-top:12px">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="value" label="值" />
                <el-table-column prop="order" label="顺序" width="100" />
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button size="mini" @click="openEditValue(row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="removeValue(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <template #footer>
                <el-button @click="showValuesDialog = false">关闭</el-button>
                <el-button type="primary" @click="saveValues">保存并设置</el-button>
            </template>
        </el-dialog>

        <!-- edit value dialog -->
        <el-dialog v-model:visible="showEditValueDialog" title="编辑规格值">
            <el-form :model="editValueForm">
                <el-form-item label="名称">
                    <el-input v-model="editValueForm.name" />
                </el-form-item>
                <el-form-item label="值">
                    <el-input v-model="editValueForm.value" />
                </el-form-item>
                <el-form-item label="顺序">
                    <el-input-number v-model.number="editValueForm.order" :min="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEditValueDialog = false">取消</el-button>
                <el-button type="primary" @click="saveEditValue">保存</el-button>
            </template>
        </el-dialog>

        <!-- update skus dialog -->
        <el-dialog v-model:visible="showUpdateSkusDialog" title="更新商品规格 (updateskus)">
            <div>商品ID: {{ goodsId }}</div>
            <el-input type="textarea" :rows="12" v-model="rawPayload" />
            <template #footer>
                <el-button @click="showUpdateSkusDialog = false">取消</el-button>
                <el-button type="primary" @click="callUpdateSkus">发送</el-button>
            </template>
        </el-dialog>

    </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
    createSkuCard,
    updateSkuCard,
    deleteSkuCard,
    sortSkuCards,
    createSkuValue,
    updateSkuValue,
    deleteSkuValue,
    setSkuCardValues,
    updateProductSkus
} from '~/api/skus'
import { readGoods } from '~/api/goods'

const goodsId = ref(null)
const values = ref([])
const statusMsg = ref('')
const rawPayload = ref('')

const showCardDialog = ref(false)
const cardForm = reactive({ id: null, name: '', order: 0, type: 0 })

const showValuesDialog = ref(false)
const showEditValueDialog = ref(false)
const currentCard = ref(null)
const newValue = reactive({ name: '', order: 0 })
const editValueForm = reactive({ id: null, name: '', value: '', order: 0 })

const showUpdateSkusDialog = ref(false)

const cards = ref([])
const loading = ref(false)
const total = computed(() => cards.value.length)

function openCreateCard() {
    cardForm.id = null
    cardForm.name = ''
    cardForm.order = 0
    cardForm.type = 0
    showCardDialog.value = true
}

function openEditCard(row) {
    cardForm.id = row.id
    cardForm.name = row.name
    cardForm.order = row.order
    cardForm.type = row.type || 0
    showCardDialog.value = true
}

async function saveCard() {
    if (!goodsId.value) {
        return statusMsg.value = '请先填写商品ID并加载'
    }
    const payload = { goods_id: goodsId.value, name: cardForm.name, order: cardForm.order, type: cardForm.type }
    try {
        if (cardForm.id) {
            await updateSkuCard(cardForm.id, payload)
        } else {
            await createSkuCard(payload)
        }
        showCardDialog.value = false
        // 刷新列表（接口已删除，触发本地刷新）
        await load()
    } catch (e) {
        console.error(e)
        statusMsg.value = '保存失败'
    }
}

async function removeCard(row) {
    try {
        await deleteSkuCard(row.id)
        await load()
    } catch (e) {
        console.error(e)
    }
}

function changeOrder(row) {
    const sortdata = cards.value.map(c => ({ id: c.id, order: c.order }))
    sortSkuCards(sortdata).then(() => {
        statusMsg.value = '排序已保存'
    }).catch(e => {
        console.error(e)
    })
}

// 加载当前商品的规格卡（设置查询条件并请求 useInitTable）
async function load() {
    if (!goodsId.value) return
    statusMsg.value = '加载中...'
    loading.value = true
    try {
        const res = await readGoods(goodsId.value)
        const data = (res && (res.data || res)) || res
        const goods = data || {}
        cards.value = Array.isArray(goods.goods_skus_card) ? goods.goods_skus_card.slice() : []
        statusMsg.value = '已加载'
    } catch (e) {
        statusMsg.value = '加载失败'
        console.error(e)
    } finally {
        loading.value = false
    }
}

async function openValues(row) {
    currentCard.value = row
    // 使用商品数据内嵌的 values（goods_skus_card_value）填充
    values.value = Array.isArray(row.goods_skus_card_value) ? row.goods_skus_card_value.slice() : []
    showValuesDialog.value = true
}

async function addValue() {
    if (!currentCard.value) return
    const payload = { goods_skus_card_id: currentCard.value.id, name: newValue.name, order: newValue.order, value: newValue.name }
    try {
        const res = await createSkuValue(payload)
        values.value.push({ id: (res && res.id) || Date.now(), name: newValue.name, value: newValue.name, order: newValue.order })
        newValue.name = ''
        newValue.order = 0
    } catch (e) {
        console.error(e)
    }
}

function openEditValue(row) {
    editValueForm.id = row.id
    editValueForm.name = row.name
    editValueForm.value = row.value
    editValueForm.order = row.order
    showEditValueDialog.value = true
}

async function saveEditValue() {
    try {
        await updateSkuValue(editValueForm.id, { goods_skus_card_id: currentCard.value.id, name: editValueForm.name, order: editValueForm.order, value: editValueForm.value })
        // update local list
        const idx = values.value.findIndex(v => v.id === editValueForm.id)
        if (idx !== -1) values.value[idx] = { ...values.value[idx], name: editValueForm.name, value: editValueForm.value, order: editValueForm.order }
        showEditValueDialog.value = false
    } catch (e) {
        console.error(e)
    }
}

async function removeValue(row) {
    try {
        await deleteSkuValue(row.id)
        // remove from local values list
        values.value = values.value.filter(v => v.id !== row.id)
    } catch (e) {
        console.error(e)
    }
}

async function saveValues() {
    // prepare values array: use values.value.map(v => v.value || v.name)
    if (!currentCard.value) return
    const payload = { name: currentCard.value.name, value: values.value.map(v => v.value || v.name || '') }
    try {
        await setSkuCardValues(currentCard.value.id, payload)
        showValuesDialog.value = false
        statusMsg.value = '已设置值'
    } catch (e) {
        console.error(e)
        statusMsg.value = '设置失败'
    }
}

function openUpdateSkus() {
    showUpdateSkusDialog.value = true
}

async function callUpdateSkus() {
    if (!goodsId.value) return statusMsg.value = '请先输入商品ID'
    let body = {}
    try {
        body = rawPayload.value ? JSON.parse(rawPayload.value) : {}
    } catch (e) {
        statusMsg.value = 'JSON 解析失败'
        return
    }
    try {
        await updateProductSkus(goodsId.value, body)
        statusMsg.value = 'updateskus 成功'
        showUpdateSkusDialog.value = false
    } catch (e) {
        console.error(e)
        statusMsg.value = 'updateskus 失败'
    }
}

</script>
<style scoped>
.controls { display:flex; align-items:center }
</style>
