<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index"  width="50px"></el-table-column>
        <el-table-column prop="authName" label="权限名称" style="width: 30%"></el-table-column>
        <el-table-column prop="path" label="路径" style="width: 30%"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level==0" >一级</el-tag>
                <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        tableData:[]
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const {data:res} = await this.$http.get("rights/list");
      this.tableData=res.data;
      console.log(res);
    }
  }
};
</script>

<style scoped>
.oneLevel{
    color: rgb(64,158,255);
    border: rgb(217,236,255);
    background: rgb(236,245,255);
    height: 32px;
    width: 46px;
    text-align: center;
    line-height: 32px;
    font-size: 12px;
}
.twolevel{
    color: #67c23a;
    border: rgb(217,236,255);
    background: rgb(240,249,235);
    height: 32px;
    width: 46px;
    text-align: center;
    line-height: 32px;
    font-size: 12px;
}

.threelevel{
    border: #faecd8;
     color: #e6a23c;
    background:#fdf6ec;
    height: 32px;
    width: 46px;
    text-align: center;
    line-height: 32px;
    font-size: 12px;
}
</style>