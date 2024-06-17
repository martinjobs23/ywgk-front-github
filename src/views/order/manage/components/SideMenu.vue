<template>
  <el-menu
    class="el-menu-vertical-demo"
    default-active="1"
    @click="onMenuItemClick"
  >
    <el-menu-item index="1" @click="onMenuItemClick($event)">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>全部工作票</span>
      </template>
    </el-menu-item>
    <el-menu-item index="2" @click="onMenuItemClick($event)">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>进行中工作票</span>
      </template>
    </el-menu-item>
    <el-menu-item index="3" @click="onMenuItemClick($event)">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>草稿工作票</span>
      </template>
    </el-menu-item>
    <el-menu-item index="4" @click="onMenuItemClick($event)">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>待审核工作票</span>
      </template>
    </el-menu-item>
    <el-menu-item index="5" @click="onMenuItemClick($event)">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>失效工作票</span>
      </template>
    </el-menu-item>
    <el-menu-item index="6" @click="onMenuItemClick($event)">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>历史工作票</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>
<script>
  export default {
    name: 'SideMenu',
    emits: ['menu-click'],
    methods: {
      onMenuItemClick(event) {
        // 触发自定义事件，传递点击的菜单项索引
        this.$emit('menu-click', event.index)
      },
    },
  }
</script>
