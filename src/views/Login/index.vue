<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>

      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="loginHandler">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: localStorage.getItem('remember_key') ? JSON.parse(localStorage.getItem('remember_key'))?.username : '',
        password: localStorage.getItem('remember_key') ? JSON.parse(localStorage.getItem('remember_key'))?.password : ''
      },
      remember: false,
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginHandler() {
      this.$refs.form.validate(async valid => {
        // 所有的表单项都通过校验 valid变量才为true 否则就是false
        if (valid) {
          // 添加记住密码
          if (this.remember) {
            localStorage.setItem('remember_key', JSON.stringify(this.form))
          } else {
            localStorage.removeItem('remember_key')
          }
          // TODO LOGIN
          // 确保token返回之后再跳转到首页 防止首页有一些需要依赖token的组件才能正常显示
          await this.$store.dispatch('user/asyncLogin', this.form)
          // 跳转首页
          this.$router.push('/')
          // 提示用户登录成功
          this.$message({
            type: 'success',
            message: '登录成功'
          })
        }
      })
    }
  }

}

</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}

.bg {
  width: 60vw;
  height: 100vh;
  background: url('~@/assets/login-bg.svg') no-repeat;
  background-position: right top;
  background-size: cover;
}

.box {
  margin: 200px 10% 0;
  flex: 1;

  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }

  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }

    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }

    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}

.login_btn {
  width: 100%;
}
</style>
