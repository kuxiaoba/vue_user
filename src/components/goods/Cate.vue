<template >
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
      class="treeTable"
        :show-row-hover="false"
        :data="catelist"
        border
        index-text="#"
        show-index
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color:lightgreen;"
            class="el-icon-success"
            v-if="scope.row.cat_deleted ===false"
          ></i>
          <i style="color:lightgree;" v-else class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level ===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size='mini' type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size='mini' type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 8, 14]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加类型对话框 -->
    <el-dialog
  title="添加分类"
  :visible.sync="cadialogVisible"
  width="50%">
 <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
    <el-form-item label="父级分类:" >
         <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cadialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 3,
        pagesize: 5
      },
      // 商品分类数据 默认空
      catelist: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名字',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'opt'
        }
      ],
    cadialogVisible:false,
    // 添加表单数据对象
    addCateForm:{
        // 将要添加的分类名称
        cat_name:'',
        //父级分类的ID
        cat_pid :0,
        // 分类的登记 默认要添加的是一级分类
        cat_level:0
    },
    // 添加分类表单验证规则对象
    addCateFormRules:{
 cat_name :[
     { required:true,message:'请输入分类的名称',trigger:'blur'}
 ]
    },
    // 父级分类的列表
     parentCateList: [],
// 指定级联选择器配置对象
     cascaderProps:{
value:'cat_id',
label:'cat_name',
children:'children'
     },
    //  选中的分级父类id数组
        selectedKeys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      console.log(res.data)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize){
        this.querInfo.pagesize =newSize
        this.getCateList()
    },
    // 监听 pagenum的改变
    handleCurrentChange (newPage){
        this.querInfo.pagenum = newPage
        this.getCateList
    },
    showAddCateDialog(){
        // 先获取父级分类
        this.getParentCate()
        // 对话框
        this.cadialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCate (){
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      console.log(res.data)
      this.parentCateList = res.data
    },
   parentCateChanged(){
       console.log(this.selectedKeys);
    //    若是selectedKeys数组的中长度大于0 证明选了父级分类
    // 反之就说明没有选择
    if(this.selectedKeys.length>0) {
        // 父级分类id
       this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length -1 ]
    //    为当前分类等级赋值
       this.addCateForm.cat_level = this.selectedKeys.length
       return
    }else {
          this.addCateForm.cat_pid=0
           this.addCateForm.cat_level =0
    }
    },
    //点击按钮添加分类
    addCate (){
       this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>

