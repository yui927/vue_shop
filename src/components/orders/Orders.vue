<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button
              slot="append"
              icon="el-icon-search"
              type="primary"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column type="index" label="#" width="80"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay === '0'" type="warning"
              >未付款</el-tag
            >
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改订单地址"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="changeAddress"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="物流信息"
              placement="top"
            >
              <el-button
                type="success"
                icon="el-icon-location-information"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
      <!-- 修改订单地址的弹框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="changeAddressDialogVisible"
        width="50%"
        @close="changeAddressClose"
      >
      <!-- label-width="100px"是改宽度的 -->
        <el-form
          ref="changeAddressRef"
          :model="changeAddressForm"
          :rules="changeAddressRules"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="name">
            <!-- 级联选择框 -->
            <el-cascader
              v-model="checkedKeys"
              :options="cityData"
              :props="cityProps"
              size="medium"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="changeAddressForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changeAddressDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="changeAddressDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入级联选择框的数据
import cityData from './citydata'
export default {
  data() {
    return {
      dataList: [],
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 修改订单地址的布尔值
      changeAddressDialogVisible: false,
      changeAddressForm: {
        address: ''
      },
      // 表单校验
      changeAddressRules: {
        name: [{ required: true, message: '请选择', trigger: 'blur' }],
        address: [{ required: true, message: '详细地址', trigger: 'blur' }]
      },
      // 级联选择框的值
      cityData,
      // 级联选择框的配置信息
      cityProps: {
        label: 'label',
        value: 'value',
        children: 'children',
        expandTrigger: 'hover'
      },
      checkedKeys: []
    }
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.$message.success('获取订单列表成功')
      console.log(res.data.goods)
      this.dataList = res.data.goods
      this.total = res.data.total
    },
    // 分页
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getOrdersList()
    },
    handleCurrentChange(newcurrent) {
      this.queryInfo.pagenum = newcurrent
      this.getOrdersList()
    },
    // 关闭对话框后表单内容重置 级联数组清空
    changeAddressClose() {
      this.$refs.changeAddressRef.resetFields()
      this.checkedKeys = []
    },
    // 点击修改地址按钮出现弹框
    changeAddress() {
      this.changeAddressDialogVisible = true
    }
  },
  created() {
    this.getOrdersList()
  }
}
</script>

<style>
</style>
