<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片插槽 -->
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" border stripe style="width: 100%">
        <!-- 权限列 -->
        <el-table-column type="expand" width="80">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <!-- 第一层 每层24格-->
            <el-row
              :class="['bb', index1 === 0 ? 'bt' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="6"
                ><el-tag closable @close="removeRoleById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第一层的第二栏里再做个分格 -->
              <el-col :span="18">
                <!-- 第二层 注意这第二层包裹了第三层，所以循环需要写在栏里-->
                <el-row
                  :class="[index1 === 0 ? 'bt' : '', 'vcenter']"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <!-- 第二层第一栏 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRoleById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第二层第二栏 放第三层 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRoleById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-row>
              <el-button type="primary" size="mini" icon="el-icon-edit"
                >修改</el-button
              >
              <el-button type="warning" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-star-off"
                @click="showAddRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的弹出框 -->
    <!-- @click="defaultKeysClose"点击分配权限的时候清空原来的数组 -->
    <el-dialog
      title="分配权限"
      :visible.sync="addRightDialogVisible"
      @close="defaultKeysClose"
      width="30%"
    >
      <!-- 这是一个树形控件 -->
      <!-- show-checkbox是展出复选框 default-expand-all默认展开所有节点 default-checked-keys是展开勾选的数组 node-key是树每个子树唯一的id值-->
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultKeys"
        node-key="id"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      addRightDialogVisible: false,
      // 权限列表数据
      rightsList: [],
      // 这是树型控件的配置对象
      defaultProps: {
        // 展示在树形控件的显示文本
        label: 'authName',
        // 关联节点 就是打开这一层出现下一层
        children: 'children'
      },
      // 默认展开勾选的数组 里面存的是id值
      defaultKeys: [],
      //
      roleId: ''
    }
  },
  methods: {
    // 调用角色列表函数
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    // 点击删除角色指定权限
    async removeRoleById(row, rightId) {
      const result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      // 调用函数
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // 此处因为返回的结果就是最新的数据 所以没必要再调用渲染视图的函数 而是把最新的数据赋值给原来的
      // 重新渲染视图会导致页面刷新，
      row.children = res.data
    },
    // 点击分配权限的时候
    async showAddRightDialog(row) {
      // 存储当前行的id
      this.roleId = row.id
      // 1.弹出权限列表对话
      this.addRightDialogVisible = true
      // 2.获取分配权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.$message.success('获取权限列表成功')
      this.rightsList = res.data
      // 3.调用加载已有权限的函数
      this.getDefaultKeys(row, this.defaultKeys)
    },
    // 加载已有权限的方法
    getDefaultKeys(ele, arr) {
      // 如果没有children节点说明是三级权限，直接将三级权限的id往数组中追加
      if (!ele.children) {
        return arr.push(ele.id)
      }
      // 如果有children节点
      ele.children.forEach(item => {
        return this.getDefaultKeys(item, arr)
      })
    },
    // 当点击其他分配权限的按钮时清空原来的数组数据
    defaultKeysClose() {
      this.defaultKeys = []
    },
    // 全选和半选
    async setRights() {
      // 关闭对话框
      this.addRightDialogVisible = false
      // 以 , 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点)
      const str = this.$refs.treeRef
        .getCheckedKeys()
        .concat(this.$refs.treeRef.getHalfCheckedKeys())
        .join(',')
      // 发送请求
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: str })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.getRolesList()
    }
  },
  created() {
    // 调用角色列表数据
    this.getRolesList()
  }
}
</script>

<style lang='less' scoped>
.bt {
  border-top: 1px solid #ccc;
}
.bb {
  border-bottom: 1px solid #ccc;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
