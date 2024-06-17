<template>
  <vab-card class="onlinecharts" shadow="hover" skeleton>
    <template #header>
      <vab-icon icon="donut-chart-fill" />
      终端在线情况
      <el-tag class="card-header-tag" type="warning">总览</el-tag>
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
  import { useSettingsStore } from '@/store/modules/settings'
  import { getOnlineTerminalNums } from '@/api/index/getChartsData'

  export default defineComponent({
    name: 'Authorization',
    components: {
      VabChart,
      // VabCount,
    },
    setup() {
      const settingsStore = useSettingsStore()
      const { echartsGraphic2 } = storeToRefs(settingsStore)
      const state = reactive({
        timer: null,
        terminalnum: 0,
        option: {
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              name: '在线终端',
              type: 'pie',
              radius: ['50%', '80%'],
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
              data: [],
            },
          ],
        },
      })

      watch(
        () => echartsGraphic2.value,
        () => {
          state.option.series[0].itemStyle.color =
            new VabChart.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              echartsGraphic2.value.map((color, offset) => ({
                color,
                offset,
              }))
            )
        }
      )
      const fetchData = async () => {
        const { data } = await getOnlineTerminalNums()
        state.terminalnum = data.totalCount
        state.option.series[0].data = data.jsonData
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
