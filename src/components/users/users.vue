<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </div></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table border :data="userList" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 使用了插槽这里可以不用prop属性 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                @click="getUserInfo(scope.row.id)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delUserById(scope.row.id)"
              ></el-button>
              <!-- 这里加了个放上去显示字 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-star-off"
                  circle
                  @click="showRolesDialog(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagesize"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        ><el-form
          status-icon
          :model="addUserForm"
          label-width="80px"
          :rules="addFormRules"
          ref="addFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 这是编辑用户的表单 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
        ><el-form
          status-icon
          :model="editUserForm"
          label-width="80px"
          :rules="addFormRules"
          ref="editFormRef"
        >
          <!-- ref="editFormRef"就像绑定了个id类-->
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="addRolesDialogVisible"
        width="30%"
        @close="setClosed"
      >
        <div>
          <p>当前的用户：{{ roleForm.username }}</p>
          <p>当前的角色：{{ roleForm.role_name }}</p>
          分配新角色：<el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRole"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 手机和邮箱自定义校验规则
    var checkEmail = (rule, value, callback) => {
      const regexp = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
      regexp.test(value) ? callback() : callback(new Error('邮箱格式不正确'))
    }
    var checkMobile = (rule, value, callback) => {
      const regexp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      regexp.test(value) ? callback() : callback(new Error('手机格式不正确'))
    }
    return {
      // 用户列表数据
      userList: [],
      queryInfo: {
        query: '', // 输入框中的查询参数
        pagenum: 1, // 当前在第几页
        pagesize: 3 // 每页显示几条数据
      },
      // 用户总数
      total: 0,
      // 控制添加用户对话框展示与隐藏的布尔值
      addDialogVisible: false,
      // 修改添加用户对话框展示与隐藏的布尔值
      editDialogVisible: false,
      // 分配角色对话框的布尔值
      addRolesDialogVisible: false,
      // 分配角色的列表
      roleForm: {},
      rolesList: [],
      value: '',
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加用户的校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 定义请求用户列表数据的方法
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.$message.success('获取用户列表成功!')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 每页条数改变时触发的函数
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      // 重新渲染列表
      this.getUserList()
    },
    // 当前页改变时触发的函数
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getUserList()
    },
    async changeUserState(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('更新状态失败')
        row.mg_state = !row.mg_state
        return
      }
      this.$message.success('更新状态成功')
    },
    // 关闭添加用户对话框的回调，重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定表单
    addUser() {
      // 表单预校验 vaild就是表单验证通过后为true，不通过为false
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写完整信息后提交')
        }
        // 校验通过后再发请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 重新渲染用户列表
        this.getUserList()
        // 点击确定关闭表单
        this.addDialogVisible = false
      })
    },
    // 关闭编辑用户对话框的回调，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 根据用户id查询用户信息
    async getUserInfo(id) {
      // 方式1 可以使用传参的形式直接赋值
      // this.editUserForm.username = row.username
      // this.editUserForm.mobile = row.mobile
      // this.editUserForm.email = row.email
      // 方式2 根据用户id完成查询请求
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      }
      // 将查询到的用户信息保存到data中的editUserForm中
      this.editUserForm = res.data
      // 点击编辑按钮弹出编辑表单
      this.editDialogVisible = true
    },
    // 编辑用户
    editUser() {
      // 预校验 async一定要写在里await最近的函数上
      this.$refs.editFormRef.validate(async boo => {
        if (!boo) {
          return this.$message.error('请填写完整信息')
        }
        // 发送请求
        const { data: res } = await this.$http.put(
          'users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }
        this.$message.success('更新用户成功')
        this.getUserList()
        // 点击确定关闭表单
        this.editDialogVisible = false
      })
    },
    // 删除用户
    async delUserById(id) {
      const res = await this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 删除操作
      const { data: result } = await this.$http.delete('users/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      if (this.total % this.queryInfo.pagesize === 1) {
        this.papagenum--
      }
      this.getUserList()
    },
    // 点击分配角色按钮的时候出现对话框
    async showRolesDialog(row) {
      console.log(row)
      // 展示对话框
      this.addRolesDialogVisible = true
      // 根据id展示分配角色的对话框 查询数据
      this.roleForm = row
      // 发送请求 获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.$message.success('获取角色列表成功!')
      this.rolesList = res.data
    },
    // 分配角色
    async setRole() {
      // 请求数据
      const { data: res } = await this.$http.put(`users/${this.roleForm.id}/role`, {
        rid: this.value
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败!')
      }
      this.$message.success('分配角色成功!')
      // 重新获取角色列表
      this.getUserList()
      // 关闭对话框
      this.addRolesDialogVisible = false
    },
    // 清除分配角色输入框的值
    setClosed() {
      this.value = ''
      this.roleForm = {}
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style>
.el-card {
  margin-top: 15px;
}
</style>
