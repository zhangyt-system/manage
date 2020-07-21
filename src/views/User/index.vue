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
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="updateClick(scope.row.id)"
              circle
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="updateDialog" width="50%">
        <!-- 对话框的内容主题区域 -->
        <el-form ref="form" label-width="80px" :model="updateMessage">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="updateMessage.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updateMessage.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="updateMessage.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="updateDialog = false">取消</el-button>
            <el-button type="primary" @click="comfirUpdate">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 删除用户的对话框 -->
      <el-dialog title="删除用户" :visible.sync="deleteDialog" width="30%">
        <div class="deletedialog">确定删除用户？</div>
        <el-button @click="deleteDialog=false">取消</el-button>
        <el-button type="primary" @click="deleteDialog=false">确认删除</el-button>
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
        pagesize: 5
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
      updateDialog: false,
      updateMessage: {
        username: "",
        email: "",
        mobile: ""
      },
      currentId: "",
      deleteDialog: false
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
      // console.log(this.addUserForm);
      const { data: res } = await this.$http.post("/users", this.addUserForm);
      // console.log(res);
      this.addDialog = false;
      this.getUserList();
      this.$message.success("添加用户成功！");

    },
    // 修改用户的方法(通过id获取用户信息)
    async updateClick(id) {
      this.updateDialog = true;
      // console.log(id);
      this.currentId = id;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败");
      this.updateMessage = res.data;
      this.updateMessage.username = res.data.username;
      this.updateMessage.email = res.data.email;
      this.updateMessage.mobile = res.data.mobile;
      // console.log(res.data);
    },
    //修改用户的方法
    async comfirUpdate() {
      const { data: res } = await this.$http.put("users/" + this.currentId, {
        email: this.updateMessage.email,
        mobile: this.updateMessage.mobile
      });
      if (res.meta.status !== 200) {
        this.$message.error("修改用户失败！");
      }
      // console.log(this.updateMessage.email + this.updateMessage.mobile);
      // console.log(res);
      //关闭对话框
      this.updateDialog = false;
      //刷新用户列表
      this.getUserList();
      //提示用户
      this.$message.success("修改用户成功！");
    },
    //删除用户
    async deleteUser(id) {
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.data.meta !== 200) {
        this.$message.error("删除用户失败！");
      }
      //关闭对话框
      this.deleteDialog = false;
      //刷新用户列表
      this.getUserList();
      //提示用户
      this.$message.success("删除用户成功！");
      console.log(res);
    }
  }
};
</script>

<style scoped>
.el-pagination {
  margin-top: 15px;
}
.deletedialog {
  /* text-align: center; */
  font-size: 25px;
  margin-bottom: 30px;
}
</style>