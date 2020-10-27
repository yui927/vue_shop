<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8"
          ><div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" clearable v-model="goodsListQuery.query">
              <!-- 输入查询参数查询商品 -->
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="$router.push('/goods/add')">添加用户</el-button>
          </div></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodList" border stripe>
        <el-table-column type="index" label="#" width="40"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="80">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80">
        </el-table-column>
        <el-table-column prop="add_time" label="添加时间">
          <!-- 定义时间过滤器 -->
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGoodById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsListQuery.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodsListQuery.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表数据
      goodList: [],
      // 商品列表的查询参数
      goodsListQuery: {
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 10 // 每页条数
      },
      // 商品总数
      total: 0
    }
  },
  methods: {
    // 查询商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsListQuery
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      this.goodList = res.data.goods
      this.total = res.data.total
    },
    // 删除商品
    async deleteGoodById(id) {
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
      // 发送请求删除商品
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 分页
    handleCurrentChange(newcurrent) {
      this.goodsListQuery.pagenum = newcurrent
      this.getGoodsList()
    },
    handleSizeChange(newpagesize) {
      this.goodsListQuery.pagesize = newpagesize
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>
