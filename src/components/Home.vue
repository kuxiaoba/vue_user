<template>
  <div>
    home组件
    <el-button type="info" @click="cler">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    cler() {
      // 清空sessionStorage中保存token
      sessionStorage.clear()
      // 编程式导航跳转登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>


