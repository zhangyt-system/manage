<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="dialogVisibleAddRole = true">添加角色</el-button>
      <el-table :data="roleList" stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column width="60px" type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item,i1) in scope.row.children"
              :key="item.id"
              :class="['oneLevel',i1===0?'brno':'','center']"
            >
              <el-col :span="5">
                <el-tag closable @close="deletePrivale">{{item.authName}}</el-tag>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(ite,i2) in item.children"
                  :key="i2.id"
                  :class="['oneLevel',i2 === 0 ?'brno':'', 'center']"
                >
                  <el-col :span="6">
                    <el-tag closable @close="deletePrivale" type="success">{{ite.authName}}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="deletePrivale"
                      v-for="(it,i3) in ite.children"
                      :key="i3.id"
                      type="warning"
                    >{{it.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row.children}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" width="60px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="350px">
          <el-button icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="deletePrivale()">删除</el-button>
          <el-button icon="el-icon-setting" size="mini" type="warning">分配权限</el-button>
        </el-table-column>
      </el-table>
      <!-- 添加角色的dialog -->
      <el-dialog title="添加角色" :visible.sync="dialogVisibleAddRole">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="form.roleDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="addRole" type="primary">立即添加</el-button>
            <el-button @click="dialogVisibleAddRole = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 删除用户的dialog -->
      <el-dialog title="提示" :visible.sync="dialogVisibleDeleteRole" class="delDialog" width="30%">
        <div class="deleteContainwer">
          <i class="el-icon-warning" type="warning" show-icon></i>
          此操作将永久删除该用户, 是否继续?
        </div>
        <div class="delBtnBox">
          <el-button @click="dialogVisibleDeleteRole=fasle">取消</el-button>
          <el-button type="primary" @click="deleteRole">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        roleName: "",
        roleDesc: ""
      },
      roleList: [],
      dialogVisibleAddRole: false,
      dialogVisibleDeleteRole: false,
      total: 50,
      delId: 0
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.roleList = res.data;
      console.log(res);
    },
    // 添加角色
    async addRole() {
      const { data: res } = await this.$http.post("/roles", this.form);
      // console.log(res);
      if (res.meta.status !== 201) return this.$message.error("创建角色失败！");
      this.$message.success("创建角色成功！");
      this.getRoleList();
      this.dialogVisibleAddRole = false;
      this.form.roleName = "";
      this.form.roleDesc = "";
    },
    //删除角色
    async deleteRole() {
      console.log(this.delId);
      const { data: res } = await this.$http.delete("roles/" + this.delId);
      if (res.meta.status !== 200) {
        this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getRoleList();
      this.dialogVisibleDeleteRole = false;
      console.log(res);
    },
    deleteBtnClick(id) {
      this.delId = id;
      this.dialogVisibleDeleteRole = true;
    },
    // 删除
    deletePrivale() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scope>
.deleteContainwer {
  padding-bottom: 30px;
  padding-left: 30px;
}
.delBtnBox {
  /* float: right; */
  padding-left: 150px;
}
.oneLevel {
  margin: 7px;
  border-top: 1px solid #eee;
}
.brno {
  border: none;
}
.center {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
</style>