<template>
  <div class="container">
    <!-- 整个登录区域的大容器 -->
    <div class="login_container">
      <!-- logo区域 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录的表单
      loginForm: {
        username: '',
        password: ''
      },
      // 定义校验规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置内容和表单的校验规则
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录的方法
    login () {
      // 表单的预校验
      this.$refs.loginFormRef.validate(async boo => {
        if (!boo) {
          return this.$message.error('请输入合法账号密码')
        }
        // 发送请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功！')
        // 将服务器返回token令牌存储到本地
        sessionStorage.setItem('token', res.data.token)
        // 编程式导航跳转到home页面
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #2b466b;
}
.login_container {
  display: flex;
  align-items: flex-end;
  width: 450px;
  height: 320px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  box-shadow: 2px 2px 10px #fff;
}
.logo {
  position: absolute;
  left: 50%;
  top: -75px;
  transform: translate(-50%);
  padding: 10px;
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 2px 2px 10px #fff;
  border-radius: 50%;
}
.el-form {
  width: 100%;
  padding: 0 20px;
}
.btns {
  text-align: right;
}
img {
  width: 100%;
  background-color: #efefef;
  border-radius: 50%;
}
</style>
