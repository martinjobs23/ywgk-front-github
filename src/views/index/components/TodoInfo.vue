<template>
  <vab-card class="todoinfo" shadow="hover">
    <template #header>
      <vab-icon icon="file-info-line" />
      待处理事项
      <el-tag class="card-header-tag">统计</el-tag>
    </template>
    <el-scrollbar>
      <table class="table">
        <tr>
          <td>待审批终端</td>
          <td>
            {{ todoNums.unregisternum }}
          </td>
          <td>待处理工单</td>
          <td>{{ todoNums.workordernum }}</td>
        </tr>
        <tr>
          <td>未结束会议</td>
          <td>{{ todoNums.meetingnum }}</td>
          <td>待核实设备</td>
          <td>{{ todoNums.assetnum }}</td>
        </tr>
      </table>
    </el-scrollbar>
  </vab-card>
</template>

<script lang="ts">
  // import { getTodoNums } from '@/api/index/getChartsData'
  export default defineComponent({
    name: 'Authorization',
    components: {
      // VabChart,
      // VabCount,
    },
    setup() {
      const state = reactive({
        todoNums: {
          unregisternum: null,
          assetnum: null,
          meetingnum: null,
          workordernum: null,
        },
      })

      const fetchData = async () => {
        // const { data } = await getTodoNums(state.todoNums)
        // state.todoNums = data.jsonData[0]
      }

      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        fetchData,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .todoinfo {
    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        padding: 9px 15px !important;
        overflow: hidden;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid #e6e6e6;

        i {
          color: var(--el-color-success);
          vertical-align: -3px;
          cursor: pointer;
        }

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }
  }
</style>
