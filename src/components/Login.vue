<template>
  <div class="login">
    <div class="content-box">
      <el-form ref="form" :model="formdata" :rules="rules" class="container">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="login">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "admin",
        password: "123456"
      },
      rules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      console.log(this);
      this.$refs.form.resetFields();
    },
    login() {
      this.$refs.form.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        //返回的对象是promise ，可以使用async 和 await
        //使用了对象的结构赋值
        const {data:res}=await this.$http.post('login',this.formdata);
        console.log(res);
        if(res.meta.status!==200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        //保存token
        console.log(res);
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      });
    }
  }
};
</script>

<style scoped>
.login {
  height: 100%;
  background-color: #333;
}
.content-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>