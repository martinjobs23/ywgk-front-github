<script setup>
  import { useUserStore } from '@/store/modules/user'

  const userStore = useUserStore()
  const { username } = storeToRefs(userStore)

  const state = reactive({
    description: '欢迎使用运维全过程安全管控系统',
  })

  const handleTips = () => {
    const hour = new Date().getHours()
    return hour < 8
      ? `早上好 ${username.value}，又是元气满满的一天。`
      : hour <= 11
      ? `上午好 ${username.value}，看到你我好开心。`
      : hour <= 13
      ? `中午好 ${username.value}，忙碌了一上午，记得吃午饭哦。`
      : hour < 18
      ? `下午好 ${username.value}，你一定有些累了，喝杯咖啡提提神。`
      : `晚上好 ${username.value}，愿你天黑有灯，下雨有伞。`
  }
  const fetchData = async () => {
    // const {
    //   data: { description },
    // } = await getList()
    // state.description = description
  }

  onMounted(() => {
    fetchData()
  })
</script>

<template>
  <el-col :span="24">
    <vab-card class="page-header" shadow="never">
      <!-- <el-avatar class="page-header-avatar" :src="avatar" /> -->
      <div class="page-header-tip">
        <p class="page-header-tip-title">
          {{ handleTips() }}
        </p>
        <p class="page-header-tip-description" v-html="state.description"></p>
      </div>
    </vab-card>
  </el-col>
</template>

<style lang="scss" scoped>
  .page-header {
    min-height: 145px;
    transition: none;

    :deep {
      * {
        transition: none;
      }

      .el-card__body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }

    &-avatar {
      width: 60px;
      height: 60px;
      margin-right: 20px;
      border-radius: 50%;
    }

    &-tip {
      flex: auto;
      width: calc(100% - 200px);
      min-width: 300px;

      &-title {
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: bold;
        color: #3c4a54;
      }

      &-description {
        min-height: 20px;
        font-size: $base-font-size-default;
        color: #808695;
      }
    }
  }
</style>
