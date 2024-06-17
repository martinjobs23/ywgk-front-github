<script lang="ts" setup>
  const { dependencies, devDependencies, lastBuildTime } = __APP_INFO__
</script>

<template>
  <vab-card class="todoinfo" shadow="hover">
    <template #header>
      <vab-icon icon="information-line" />
      系统版本信息
      <el-tag class="card-header-tag">系统部署时间：{{ lastBuildTime }}</el-tag>
    </template>
    <el-scrollbar>
      <table class="table">
        <tr>
          <td>vue</td>
          <td>
            {{ dependencies['vue'] }}
            <!-- <el-popover
              content="已升级至最新版本"
              placement="top-start"
              trigger="hover"
              :width="200"
            >
              <template #reference>
                <vab-icon icon="arrow-up-line" />
              </template>
            </el-popover> -->
          </td>
          <td>unplugin-auto-import</td>
          <td>{{ devDependencies['unplugin-auto-import'] }}</td>
        </tr>
        <tr>
          <td>axios</td>
          <td>{{ dependencies['axios'] }}</td>
          <td>echarts</td>
          <td>{{ dependencies['echarts'] }}</td>
        </tr>
        <tr>
          <td>pinia</td>
          <td>{{ dependencies['pinia'] }}</td>
          <td>vue-router</td>
          <td>{{ dependencies['vue-router'] }}</td>
        </tr>
        <tr>
          <td>typescript</td>
          <td>
            {{ devDependencies['typescript'] }}
          </td>
          <td>element-plus</td>
          <td>
            {{ dependencies['element-plus'] }}
            <!-- <el-popover
              content="已升级至最新版本"
              placement="top-start"
              trigger="hover"
              :width="200"
            >
              <template #reference>
                <vab-icon icon="arrow-up-line" />
              </template>
            </el-popover> -->
          </td>
        </tr>
      </table>
    </el-scrollbar>
  </vab-card>
</template>

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
