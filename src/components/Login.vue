<template>
  <div class="login">
    <div class="content-box">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password"></el-input>
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
      form: {
        username: "admin",
        password: "123"
      },
       rules: {
         //验证用户名是否合法
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          //验证密码是否合法
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
    };
  },
  methods:{
    resetForm(){
      console.log(this);
      this.$refs.form.resetFields();
    },
    login(){
      this.$refs.form.validate((valid)=>{
        // console.log(valid);
        if(!valid)return;
      })
    }
  },
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
</style>