<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <SideMenu @menu-click="handleMenuClick" />
      </el-aside>
      <el-container>
        <el-main>
          <!-- 动态内容区 -->
          <component :is="currentView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import SideMenu from './components/SideMenu.vue'
  import WorkTicketBox from './components/WorkTicketBox.vue' // 示例内容组件
  import DraftTicketBox from './components/DraftTicketBox.vue'
  import PendingReviewTicketBox from './components/PendingReviewTicketBox.vue'
  import InvalidTicketBox from './components/InvalidTicketBox.vue'
  import HistoryTicketBox from './components/HistoryTicketBox.vue'
  import ProgressTicketBox from './components/ProgressTicketBox.vue'
  export default {
    components: {
      SideMenu,
      WorkTicketBox,
      DraftTicketBox,
      PendingReviewTicketBox,
      InvalidTicketBox,
      HistoryTicketBox,
      ProgressTicketBox,
    },
    data() {
      return {
        currentView: 'WorkTicketBox', // 默认显示的工作票箱组件
      }
    },
    methods: {
      handleMenuClick(index) {
        // 根据菜单索引切换组件
        switch (index) {
          case '1':
            this.currentView = 'WorkTicketBox'
            break
          case '2':
            this.currentView = 'ProgressTicketBox'
            break
          case '3':
            this.currentView = 'DraftTicketBox'
            break
          case '4':
            this.currentView = 'PendingReviewTicketBox'
            break
          case '5':
            this.currentView = 'InvalidTicketBox'
            break
          case '6':
            this.currentView = 'HistoryTicketBox'
            break
          default:
            break
        }
      },
    },
  }
</script>
