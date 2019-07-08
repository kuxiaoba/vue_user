<template>
  <div class="login_con">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo1.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="loginForm"
        :rules="Fromyanz"
        label-width="0px"
        class="login_from"
        ref="loginFrom"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="success" @click="login">登录</el-button>
          <el-button type="info" @click="reseLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单绑定
      loginForm: {
        username: '',
        password: ''
      },
      // 验证表单是否合格
      Fromyanz: {
        // prop username验证
        username: [{ required: true, message: 'Please input user name', trigger: 'blur' }, { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }],
        password: [{ required: true, message: 'Please input user password', trigger: 'blur' }, { min: 6, max: 10, message: 'Length should be 6 to 15', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      console.log(this)
      this.$refs.loginFrom.validate(async valid => {
        // 如果这个值为false 直接return不发送请求
        if (!valid) return
        var { data: rs } = await this.$http.post('login', this.loginForm)
        if (rs.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        console.log(rs)
        window.sessionStorage.setItem('token', rs.data.token)
        this.$router.push('/home')
      })
    },
    // 重置功能
    reseLoginForm() {
      this.$refs['loginFrom'].resetFields()
    }
  }
}
</script>
 
 <style lang="less" scoped>
.login_con {
  background-color: black;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_from {
    position: absolute;
    bottom: 0;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
 

 