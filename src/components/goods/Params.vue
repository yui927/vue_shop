<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <div class="cascader_box">
        <!-- 级联选择框checkedKeys是双向绑定的数据   -->
        <el-cascader
          v-model="checkedKeys"
          :options="paramsCateList"
          :props="cascaderProps"
          @change="handleChange"
        ></el-cascader>
      </div>
      <!-- tabs标签页 -->
      <el-row>
        <el-col :span="24">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                size="mini"
                :disabled="isdisabled"
                @click="addAttributeVisible = true"
                >添加参数</el-button
              >
              <!-- 动态参数的表格 -->
              <el-table :data="tableDate" border style="width: 100%">
                <el-table-column type="expand" width="180">
                  <template slot-scope="scope">
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="removeAttr(scope.row, i)"
                    >
                      {{ item }}
                    </el-tag>
                    <!-- 添加按钮输入框切换区域 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#" width="180">
                </el-table-column>
                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      class="el-icon-edit"
                      @click="getParams(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      class="el-icon-delete"
                      @click="removeCateById(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <!-- tabs标签页 -->
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <el-button
                type="primary"
                size="mini"
                :disabled="isdisabled"
                @click="addAttributeVisible = true"
                >添加属性</el-button
              >
              <!-- 静态属性的表格 -->
              <el-table :data="tableDate" border style="width: 100%">
                <el-table-column type="expand" width="180">
                  <template slot-scope="scope">
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="removeAttr(scope.row, i)"
                    >
                      {{ item }}
                    </el-tag>
                    <!-- 添加按钮输入框切换区域 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#" width="180">
                </el-table-column>
                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      class="el-icon-edit"
                      @click="getParams(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      class="el-icon-delete"
                      @click="removeCateById(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加动态参数的对话框 -->
    <el-dialog
      :title="'添加' + str"
      :visible.sync="addAttributeVisible"
      width="30%"
      @close="addCateDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item :label="str" prop="attr_name">
          <el-input v-model="addCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog
      :title="'添加' + str"
      :visible.sync="editAttributeVisible"
      width="30%"
      @close="editCateDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item :label="str" prop="attr_name">
          <el-input v-model="editCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择框的数据源
      paramsCateList: [],
      // 级联选择框选中之后的数据
      checkedKeys: [],
      // 级联选择框配置对象
      cascaderProps: {
        // 鼠标经过触发级联选择框的选中
        expandTrigger: 'hover',
        // 展示的数据
        label: 'cat_name',
        // 选中的数据，提交的数据（被关联到checkedKeys数组中）
        value: 'cat_id',
        // 子父项的关联节点
        children: 'children'
      },
      // tabs激活的面板的name值
      activeName: 'many',
      // 挂载标签页数组
      tableDate: [],
      // 控制添加参数的布尔值
      addAttributeVisible: false,
      // 编辑按钮添加参数的布尔值
      editAttributeVisible: false,
      // 添加属性的对象
      addCateForm: {
        attr_name: '',
        attr_sel: ''
      },
      // 编辑属性参数的对象
      editCateForm: {
        attr_name: ''
      },
      // 表单校验规则
      addCateFormRules: {
        attr_name: [
          { required: true, message: '请输入静态属性名称', trigger: 'blur' }
        ]
      },
      // input框显示与隐藏
      inputVisible: false,
      // 输入框的值为空
      inputValue: ''
    }
  },
  methods: {
    // 获取商品分类列表
    async getParamsCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.paramsCateList = res.data
    },
    // 级联选择框修改后会触发的方法
    handleChange() {
      // 获取动态属性动态参数数据方法
      this.getAttirbute()
    },
    async getAttirbute() {
      // 注意有一个问题就是选中了三级后，再重新选择二级，表单内容未清空
      // 如果选中的数组长度不为3,直接将数组清空
      if (this.checkedKeys.length !== 3) {
        this.tableDate = []
        this.checkedKeys = []
        return
      }
      // 发送请求获取数据
      const { data: res } = await this.$http.get(
        `categories/${this.checkedKeys[2]}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      // 想要在标签中拿到attr_vals字符串，需要先将其转变成数组
      res.data.forEach(item => {
        // 为了避免出现空标签的事，在分割之前需要判断字符串是否有长度
        item.attr_vals = item.attr_vals.length ? item.attr_vals.split(',') : []
        // 在循环的时候为每一项加一个输入框的状态和值，这样就不会出现所有输入框一起赋值的情况
        item.inputVisible = false
        item.inputValue = ''
      })
      this.tableDate = res.data
    },
    handleClick() {
      // 切换标签页的时候也会触发调用数据的函数
      this.getAttirbute()
      console.log(this.activeName)
    },
    // 点击添加按钮关闭表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
    },
    // 点击编辑按钮关闭表单
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击确定添加属性或者参数
    async addCate() {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入必填项')
        }
      })
      // 发送请求
      const { data: res } = await this.$http.post(
        `categories/${this.checkedKeys[2]}/attributes`,
        {
          attr_name: this.addCateForm.attr_name,
          attr_sel: this.activeName
        }
      )
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.getAttirbute()
      this.addAttributeVisible = false
    },
    // 点击编辑按钮查询参数 async可以单独出现，加了就是异步函数，返回值是promise对象，没加就是普通函数
    async getParams(row) {
      // 点击编辑按钮的时候将表中的数据获取到编辑框内 但是这种方法会有bug推荐还是使用参数查询
      // this.editCateForm = row
      // this.editAttributeVisible = true
      // 根据id查询参数
      const { data: res } = await this.$http.get(
        `categories/${this.checkedKeys[2]}/attributes/${row.attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editCateForm = res.data
      this.editAttributeVisible = true
    },
    // 点击确定进行编辑
    editCate() {
      // 表单预检验
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入必填项')
        }
        // 校验通过发请求
        const { data: res } = await this.$http.put(
          `categories/${this.checkedKeys[2]}/attributes/${this.editCateForm.attr_id}`,
          {
            attr_name: this.editCateForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败')
        }
        this.$message.success('编辑成功')
        this.getAttirbute()
        this.editAttributeVisible = false
        // 表单置空
        this.editCateForm = {}
      })
    },
    // 点击删除按钮
    async removeCateById(id) {
      // 询问是否删除
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
        return this.$message.info('已取消删除')
      }
      // 发送请求
      const { data: res } = await this.$http.delete(
        `categories/${this.checkedKeys[2]}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getAttirbute()
    },
    // 失去焦点的事件
    handleInputConfirm(row) {
      // 非空校验
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 失去焦点的时候应往attr_vals追加新输入的数据
      row.attr_vals.push(row.inputValue)
      // 得往数据库中追加
      this.saveAttrVals(row)
      row.inputVisible = false
      row.inputValue = ''
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.checkedKeys[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
    },
    // 显示输入框tag
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 移除展开行里的tag标签
    removeAttr(row, i) {
      // splice是返回删除的那个数据组成的数组，所以这里提交请求的时候就是将删掉的那个数据组成的数组作为参数
      row.attr_vals.splice(i, 1)
      // 发请求删除
      this.saveAttrVals(row)
    }
  },
  // 计算属性
  computed: {
    isdisabled() {
      // 在选择框里面选择的是三级的话那么按钮就开启，否则就禁用
      if (this.checkedKeys.length === 3) {
        return false
      }
      return true
    },
    // 返回动态参数和静态属性的计算属性
    str() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  created() {
    this.getParamsCateList()
  }
}
</script>

<style lang="less" scoped>
.cascader_box {
  margin-top: 10px;
}
.el-tag {
  margin: 5px 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
