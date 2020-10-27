<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <!-- 这个需要数值型 需要将拿到的active隐式转换为数值 -->
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs标签页 -->
      <!-- 这个需要字符串型 -->
      <el-form
        label-position="top"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
      >
        <!-- before-leave切换标签页之前的钩子函数 -->
        <!-- tab-click是切换标签页时触发的函数 -->
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
              ></el-input> </el-form-item
            ><el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
              ></el-input> </el-form-item
            ><el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handlerChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- tab-click切换标签页的时候触发 -->
          <!-- 第一个面板 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 第二个面板 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- label绑定的就是名称 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 第三个面板 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- on-success上传成功的钩子 -->
            <!-- on-remove 移除文件触发的钩子 -->
            <!-- on-preview 点击文件列表中已上传的文件时的钩子 -->
            <!-- 在main.js中已经将完整地址存到baseUrl中，这里为了方便后期修改 -->
            <!-- action="http://127.0.0.1:8888/api/private/v1/upload" -->
            <el-upload
              :action="actionUrl"
              :headers="tokenObj"
              list-type="picture-card"
              :on-success="onUploadSuccess"
              :on-remove="onRemoveFile"
              :on-preview="onPreview"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 第四个面板 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addbtn" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img class="previewImg" :src="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条绑定的值 表示步骤从1开始
      active: '0',
      // 添加商品的对象
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 添加商品的校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      // 级联选择框的配置对象
      cascaderProps: {
        // 展示的字段
        label: 'cat_name',
        // 选中提交的字段
        value: 'cat_id',
        // 子父节点关联字段
        children: 'children',
        // 触发条件
        expandTrigger: 'hover'
      },
      // 级联选择器的数据源
      cateList: [],
      manyData: [],
      onlyData: [],
      // 上传图片的请求头中需要加Authorization字段
      tokenObj: {
        Authorization: sessionStorage.getItem('token')
      },
      // 图片地址 在main.js中已经将完整地址存到baseUrl中，这里为了方便后期修改
      actionUrl: sessionStorage.getItem('baseUrl') + 'upload',
      // 图片预览的弹出框的布尔值
      previewDialogVisible: false,
      // 图片预览的url
      previewImg: ''
    }
  },
  methods: {
    async getCateList() {
      // 注意try和catch必须连用不然会报错
      try {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$meaasge.error('获取商品分类列表数据失败')
        }
        this.$message.success('获取商品分类列表数据成功')
        this.cateList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 级联选择框的change事件
    handlerChange() {
      // 控制只能选中三级分类,就是级联选择框不是三级分类时，就置为空
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = [])
      }
    },
    beforeLeave(active, oldactive) {
      // 数组的长度 旧值是0 active是新的值 oldactive是新的值
      if (this.addForm.goods_cat.length !== 3 && oldactive === '0') {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 切换标签页的时候触发
    async tabClick() {
      // 如果标签页为1
      // if (this.active === '1') {
      // const { data: res } = await this.$http.get(
      //   `categories/${this.addForm.goods_cat[2]}/attributes`,
      //   {
      //     params: { sel: 'many' }
      //   }
      // )
      // console.log(res)
      // } else if (this.active === '2') { // 注意else if 必须写在if}后面，否则会报错
      //   const { data: res } = await this.$http.get(
      //     `categories/${this.addForm.goods_cat[2]}/attributes`,
      //     {
      //       params: { sel: 'only' }
      //     }
      //   )
      //   console.log(res)
      // }
      // 以上方法除了参数sel不一样其他都一样所以可以进行抽离
      if (this.active === '1') {
        // console.log(this.getAttribute('many')) // 直接log这个打印的是promise对象
        // 为了在页面上渲染出来
        this.manyData = await this.getAttribute('many')
        // 将manyData这个数组遍历拿到每一项中的数据
        this.manyData.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
      } else if (this.active === '2') {
        this.onlyData = await this.getAttribute('only')
      }
    },
    // 获取动态参数和静态属性方法的处理
    async getAttribute(sel) {
      const { data: res } = await this.$http.get(
        `categories/${this.addForm.goods_cat[2]}/attributes`,
        {
          params: { sel: sel }
        }
      )
      if (res.meta.status !== 200) {
        return this.$meaasge.error('获取数据失败')
      }
      return res.data // 注意这里数据不return的话拿到就是undefined
    },
    // 文件上传成功的时候使用 response是elementui提供自带参数
    onUploadSuccess(response) {
      // 图片上传成功之后response对象中可以获取到临时路径
      // pics就是用来存放图片路径的,以对象的形式
      this.addForm.pics.push({ pic: response.data.tmp_path })
    },
    // 移除文件时触发 flie是elementui提供自带参数
    onRemoveFile(file) {
      // findIndex拿到满足条件的索引 file.response.data.tmp_path是删除的当前图片的临时路径
      const i = this.addForm.pics.findIndex(
        item => item.pic === file.response.data.tmp_path
      )
      // 截取数组
      this.addForm.pics.splice(i, 1)
    },
    // 图片预览
    onPreview(file) {
      // 弹出对话框
      this.previewDialogVisible = true
      // 点击图片的完整路径
      // console.log(file.response) 这是elementui自带属性结果就是返回成功的数据与状态码
      this.previewImg = file.response.data.url
    },
    // 添加商品
    addGoods() {
      // 预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写数据信息')
        }
        // 准备发送请求添加商品，需要处理两个字段
        // 处理manyData
        this.manyData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        // 处理onlyData
        this.onlyData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        // 发送请求
        // 使用lodash中的cloneDeep方法或者别的深拷贝的方式将数据进行拷贝
        const newAddForm = JSON.parse(JSON.stringify(this.addForm))
        // 处理新对象中的goods_cat字段转为字符串
        newAddForm.goods_cat = newAddForm.goods_cat.join(',')
        const { data: res } = await this.$http.post('goods', newAddForm)
        console.log(res.data)
        if (res.meta.status !== 201) {
          return this.$message.error('创建商品失败')
        }
        this.$message.success('创建商品成功')
        // 编程式导航跳转到商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style scoped lang="less">
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin: 20px 0;
}
.addbtn {
  margin-top: 10px;
}
</style>
