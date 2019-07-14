<template>
  <div>
    <!-- 面包屑导航   -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"  v-model="queryinfo.query" clearable @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="230px"></el-table-column>
        <el-table-column label="商品质量" prop="goods_weight" width="200px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"  width="190px">
             <template slot-scope="scope">
             {{ scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" >
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="romoveById(scope.row.goods_id)"></el-button>
            </template>

        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
         <!-- :current-page="queryinfo.pagenum"当前是第几页 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数量
      total: 0
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    // 根据分页获取 对应的商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryinfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      console.log(res.data)

      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize){
        this.queryinfo.pagesize = newSize
        this.getGoodList()

    },
    // 当前页码值
    handleCurrentChange(newPage){
        this.queryinfo.pagenum = newPage
        this.getGoodList();
    }
    ,
   async romoveById(id){
     const confirmResult =  await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
        }

        // 删除数据
      const { data: res } = await this.$http.delete(`goods/${id}`)

     if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }

      this.$message.success('删除成功！')
      this.getGoodList()
    },
    goAddpage(){
        this.$router.push('goods/add')
    }
  }
}
</script> 

<style lang="less" scoped>
</style>


