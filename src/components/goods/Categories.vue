<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" class="btn" @click="addCateDialog"
        >添加分类</el-button
      >
      <!-- 表格 -->
      <table-tree
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        show-index
        :expand-type="false"
      >
        <!-- 等级 -->
        <template slot="level" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 是否有效 -->
        <template slot="cat_deleted" scope="scope">
          <span
            class="el-icon-success success"
            v-if="scope.row.cat_deleted === false"
          ></span>
          <span class="el-icon-error error" v-else></span>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" class="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" class="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </table-tree>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        ref="addCatFormRef"
        :model="addCatForm"
        label-width="80px"
        :rules="addCateRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类">
          <!--options指定数据源 props用来指定配置对象 clearable清空选择项-->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderPros"
            @change="parentCateChange"
            clearable
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 三级的商品数据源
      categoriesList: [],
      // 总数
      total: 0,
      // 这个需要下包 npm i vue-table-with-tree-grid -S
      columns: [
        {
          // 列的标题
          label: '分类名称',
          // 列的字段
          prop: 'cat_name'
        },
        // 这里写的顺序会导致在页面中的顺序
        {
          // 列的标题
          label: '是否有效',
          // 指定当前列为自定义模板
          type: 'template',
          // 自定义模板的名称
          template: 'cat_deleted'
        },
        {
          // 列的标题
          label: '排序',
          // 指定当前列为自定义模板
          type: 'template',
          // 自定义模板的名称
          template: 'level'
        },
        {
          // 列的标题
          label: '操作',
          // 指定当前列为自定义模板
          type: 'template',
          // 自定义模板的名称
          template: 'opt'
        }
      ],
      // 添加分类的对话框的布尔值
      addCateDialogVisible: false,
      // 添加分类的对象
      addCatForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderPros: {
        // 鼠标经过就展开
        expandTrigger: 'hover',
        // 选择之后提交的数据(id)
        value: 'cat_id',
        // 展示给用户看的数据
        label: 'cat_name',
        children: 'children', // 父子节点之间通过children进行嵌套
        // 设置父子节点不关联
        checkStrictly: true
      },
      // 级联选择器选中的父级分类的id数组
      selectedKeys: [],
      // 表单预校验规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取商品分类列表
    async getCategoriesList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.$message.success('获取商品分类成功')
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCategoriesList()
    },
    // 分页pagenum发生修改的方法
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getCategoriesList()
    },
    // 点击添加商品 出现弹出框
    addCateDialog() {
      // 先获取父级分类的列表 再展示出对话框
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        // 参数设置为2代表获取前两级的所有分类
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.$message.success('获取父级分类成功')
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 级联选择框选择项发生变化触发
    parentCateChange() {
      console.log(this.selectedKeys)
    },
    // 对话框关闭事件 重置表单 清空级联选择器选中的数组
    addCateClosed() {
      this.$refs.addCatFormRef.resetFields()
      this.selectedKeys = []
    },
    // 添加商品分类的方法
    addCate() {
      // 1.预校验
      this.$refs.addCatFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入或选择商品分类')
        }
        // 判断cat_pid是多少
        if (this.selectedKeys.length === 0) {
          this.addCatForm.cat_pid = 0
        } else {
          this.addCatForm.cat_pid = this.selectedKeys[
            this.selectedKeys.length - 1
          ]
        }
        // 级联选择框的数组长度为0，一级分类（cat_level是0）
        this.addCatForm.cat_level = this.selectedKeys.length
        // 发送请求
        const { data: res } = await this.$http.post('categories', this.addCatForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类失败')
        }
        this.$message.success('添加商品分类成功')
        this.getCategoriesList()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
    }
  },
  created() {
    this.getCategoriesList()
  }
}
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 10px;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
