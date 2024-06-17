<template>
  <vab-card class="alertcharts" shadow="hover" skeleton>
    <template #header>
      <vab-icon icon="bar-chart-2-line" />
      已处理告警数量
      <el-tag class="card-header-tag" type="warning">月</el-tag>
    </template>
    <vab-chart
      :init-options="initOptions"
      :option="option"
      theme="vab-echarts-theme"
    />
    <div class="bottom">
      <span>
        告警数: {{ alertnum }}
        <!--        <vab-count-->
        <!--          :decimals="countConfig.decimals"-->
        <!--          :duration="countConfig.duration"-->
        <!--          :end-val="countConfig.endVal"-->
        <!--          :prefix="countConfig.prefix"-->
        <!--          :separator="countConfig.separator"-->
        <!--          :start-val="countConfig.startVal"-->
        <!--          :suffix="countConfig.suffix"-->
        <!--        />-->
        <el-tag class="card-footer-tag" type="success">倒计时 {{ n }}s</el-tag>
      </span>
    </div>
  </vab-card>
</template>

<script>
  import _ from 'lodash'
  import { onBeforeRouteLeave } from 'vue-router'
  import VabChart from '@/plugins/VabChart'
  // import VabCount from '@/plugins/VabCount'
  import { useSettingsStore } from '@/store/modules/settings'
  // import { getAlertCount } from '@/api/index/getChartsData'

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
        recent: '1 DAY',
        n: 5,
        alertnum: 0,
        countConfig: {
          startVal: 0,
          endVal: _.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        initOptions: {
          renderer: 'svg',
        },
        option: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '5%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisTick: {
                alignWithLabel: true,
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
              name: '告警数',
              type: 'bar',
              barWidth: '60%',
              data: [],
              // label: {
              //   show: true,
              //   rotate: 0,
              // },
              itemStyle: {
                borderRadius: [2, 2, 0, 0],
                color: new VabChart.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  echartsGraphic2.value.map((color, offset) => ({
                    color,
                    offset,
                  }))
                ),
              },
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
        state.recent = '1 WEEK'
        // const { data } = await getAlertCount()
        // state.option.series[0].data = data.jsonData
        // state.option.xAxis[0].data = data.xAxis
        // state.alertnum = data.totalCount
      }

      onBeforeRouteLeave((to, from, next) => {
        clearInterval(state.timer)
        next()
      })

      onMounted(() => {
        fetchData()
        state.timer = setInterval(() => {
          if (state.n > 0) {
            state.n--
          } else {
            state.option.series[0].type = _.sample(
              _.pull(['bar', 'scatter', 'line'], state.option.series[0].type)
            )
            state.n = 5
          }
        }, 1000)
      })

      return {
        ...toRefs(state),
        fetchData,
      }
    },
  })
</script>
