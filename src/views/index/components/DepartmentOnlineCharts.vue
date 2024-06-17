<template>
  <vab-card class="dapartmentonlinecharts" shadow="hover" skeleton>
    <template #header>
      <vab-icon icon="bar-chart-2-line" />
      各部门在线终端
      <el-tag class="card-header-tag" type="warning">统计</el-tag>
    </template>
    <vab-chart
      :init-options="initOptions"
      :option="option"
      theme="vab-echarts-theme"
    />
    <div class="bottom">
      <span>终端数: {{ terminalnum }}</span>
    </div>
  </vab-card>
</template>

<script>
  // import _ from 'lodash'
  import { onBeforeRouteLeave } from 'vue-router'
  import VabChart from '@/plugins/VabChart'
  // import VabCount from '@/plugins/VabCount'
  // import { getDepartmentOnlineTerminalNums } from '@/api/index/getChartsData'

  export default defineComponent({
    name: 'Authorization',
    components: {
      VabChart,
      // VabCount,
    },
    setup() {
      const state = reactive({
        timer: null,
        terminalnum: 0,
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            data: ['在线', '离线'],
            top: '-3%',
          },
          grid: {
            top: '10%',
            left: '2%',
            right: '4%',
            bottom: '2%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisLabel: {
                show: false, // 隐藏X轴标签
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '在线',
              type: 'bar',
              data: [],
              itemStyle: {
                borderRadius: [2, 2, 0, 0],
                borderColor: '#fff',
                borderWidth: 2,
              },
            },
            {
              name: '离线',
              type: 'bar',
              data: [],
              itemStyle: {
                borderRadius: [2, 2, 0, 0],
                borderColor: '#fff',
                borderWidth: 2,
              },
            },
          ],
        },
      })
      const fetchData = async () => {
        // const { data } = await getDepartmentOnlineTerminalNums()
        // state.terminalnum = data.totalCount
        // state.option.xAxis[0].data = data.jsonDataOrgnazations
        // // state.option.xAxis[0].data = ['部门1', '部门2', '部门3']
        // state.option.series[0].data = data.jsonDataOnline
        // state.option.series[1].data = data.jsonDataOffline
      }

      onBeforeRouteLeave((to, from, next) => {
        clearInterval(state.timer)
        next()
      })

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
