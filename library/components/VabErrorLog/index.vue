<script lang="ts" setup>
  import { useErrorLogStore } from '@/store/modules/errorLog'

  const errorLogStore = useErrorLogStore()
  const { errorLogs } = storeToRefs(errorLogStore)
  const { clearErrorLog } = errorLogStore

  const state = reactive({
    dialogVisible: false,
  })

  const clearAll = () => {
    state.dialogVisible = false
    clearErrorLog()
  }
</script>

<template>
  <div v-if="errorLogs.length > 0">
    <el-badge
      type="danger"
      :value="errorLogs.length"
      @click="state.dialogVisible = true"
    >
      <vab-icon icon="bug-line" />
    </el-badge>

    <el-dialog
      v-model="state.dialogVisible"
      append-to-body
      title="异常捕获(温馨提示：错误必须解决)"
      width="70%"
    >
      <el-table border :data="errorLogs">
        <el-table-column label="报错路由" min-width="100">
          <template #default="{ row }">
            {{ row.url }}
          </template>
        </el-table-column>
        <el-table-column label="错误信息" min-width="150">
          <template #default="{ row }">
            {{ row.err.message }}
          </template>
        </el-table-column>
        <el-table-column label="错误详情" min-width="150">
          <template #default="{ row }">
            {{ row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="state.dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="clearAll">暂不显示</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.el-badge) {
    .el-button {
      display: flex;
      align-items: center;
      justify-items: center;
      height: 28px;
    }
  }
</style>
