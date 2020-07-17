<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryData.query" placeholder="请输入内容" clearable @clear="handleClear">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialog=true">添加用户</el-button>
        </el-col>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialog" width="50%">
          <!-- 对话框的内容主题区域 -->
          <el-form ref="form" label-width="80px" :rules="addUserrules" :model="addUserForm">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="addUserForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addUserForm.mobile"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="addDialog = false">取消</el-button>
              <el-button type="primary" @click="addUserBtnClick()">确认添加</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-row>
      <el-table style="width: 100%" :data="this.userList" stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="updateDialog=true"
            circle
            size="mini"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          <el-tooltip :enterable="false" class="item" effect="dark" content="修改" placement="top">
            <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="updateDialog" width="50%">
        <!-- 对话框的内容主题区域 -->
        <el-form ref="form" label-width="80px">
          <el-form-item label="用户名称" prop="username">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="updateDialog = false">取消</el-button>
            <el-button type="primary" @click="updateDialog = false">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlecurrentChange"
        :current-page="queryData.pagenum"
        :page-size="queryData.pagesize"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryData: {
        query: "",
        //当前页码
        pagenum: 1,
        //页面展示几条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialog: false,
      addUserrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ required: false, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      },
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      updateDialog: false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryData
      });
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryData.pagesize = newSize;
      this.getUserList();
    },
    handlecurrentChange(newCurrent) {
      this.queryData.pagenum = newCurrent;
      this.getUserList();
    },
    async switchChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("设置状态失败！");
      }
    },
    handleClear() {
      this.getUserList();
    },
    //添加用户的方法
    async addUserBtnClick() {
      console.log(this.addUserForm);
      const { data: res } = await this.$http.post("/users", this.addUserForm);
      console.log(res);
      this.addDialog = false;
    }
  }
};
</script>

<style scoped>
.el-pagination {
  margin-top: 15px;
}
</style>