<template>
  <div class="index-container">
    <el-row :gutter="20">
      <page-header />
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <online-charts />
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <alert-charts />
      </el-col>
      <el-col :lg="24" :md="24" :sm="48" :xl="24" :xs="48">
        <department-online-charts />
      </el-col>
      <!-- <icon-list /> -->
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <todo-info />
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <sys-info />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PageHeader from './components/PageHeader'
  import OnlineCharts from './components/OnlineCharts'
  import AlertCharts from './components/AlertCharts'
  import DepartmentOnlineCharts from './components/DepartmentOnlineCharts.vue'
  import TodoInfo from './components/TodoInfo'
  import SysInfo from './components/SysInfo'

  export default {
    name: 'Index',
    components: {
      PageHeader,
      OnlineCharts,
      AlertCharts,
      DepartmentOnlineCharts,
      TodoInfo,
      SysInfo,
      /*  Plan, */
      // Access,
      // Authorization,
      // ChinaMap,
      // VersionInformation,
      // IconList,
      // MyProject,
    },
    data() {
      return {}
    },
    created() {},
  }
</script>

<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    background: $base-color-background !important;

    :deep {
      .page-header {
        margin-bottom: 20px;
      }

      .onlinecharts,
      .alertcharts,
      .todoinfo {
        min-height: 268px;
        margin-bottom: 20px;
      }

      .el-card {
        .el-card__header {
          position: relative;

          .card-header-tag {
            position: absolute;
            top: 15px;
            right: $base-margin;
          }

          > div > span {
            display: flex;
            align-items: center;

            i {
              margin-right: 3px;
            }
          }
        }

        .el-card__body {
          position: relative;

          .echarts {
            width: 100%;
            height: 200px;
          }

          .el-scrollbar {
            width: 100%;
            height: 200px;
          }

          .card-footer-tag {
            position: absolute;
            right: $base-margin;
            bottom: 15px;
          }
        }
      }

      .bottom {
        padding-top: 20px;
        margin-top: 5px;
        color: #595959;
        text-align: left;
        border-top: 1px solid $base-border-color;
      }
    }
  }
</style>
