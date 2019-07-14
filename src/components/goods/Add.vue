<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 区域-->
      <!-- label-position  表单域标签的位置-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- name属性为绑定到 v-model 身上 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- props 级联选择器的配置项 -->
              <el-cascader
                v-model=" addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传的后台API地址 -->
            <!-- handleSuccess上传图片成功会调用 -->
            <!-- :on-preview处理图片的预览 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerOBJ"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 副文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="logoVisible" width="50%">
      <img :src="previewPath" alt class="imgpath" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  data() {
    return {
        activeIndex :'0',
        addForm:{
            goods_name:'',
            goods_price:0,
            goods_weight:0,
            goods_number:0,
            //商品所属的分类数组
            goods_cat :[],
            // 图片的数组
            pics:[],
            // 商品的详情描述
            goods_intorduce:'',
            attrs:[]
        },
        addFormRules:{
            goods_name:[
                {required: true, message:'请输入商品名称',
                trigger:'blur'}
            ],
            goods_price:[
                {required: true, message:'请输入商品价格',
                trigger:'blur'}
            ],
            goods_weight:[
                {required: true, message:'请输入商品重量',
                trigger:'blur'}
            ],
            goods_number:[
                {required: true, message:'请输入商品数量',
                trigger:'blur'}
            ],
            goods_cat:[
                  {required: true, message:'请选择商品分类',
                trigger:'blur'}
            ],
            
        },
        // 商品分类列表
        catelist:[],
        cateProps:{
            // 看到的是哪个属性
            label:'cat_name',
            // 选中的谁的值
            value:'cat_id',
            // 哪个属性实现父子节点的嵌套
            children:'children'
        },
        // 动态参数列表数据
            manyTableData :[],
            onlyTableData:[],
            // 图片上传组件的headers请求头
            headerOBJ:{
              Authorization:
              window.sessionStorage.getItem('token')
            },
            // 图片路径
            previewPath:'',
            logoVisible:false
    }
  },
  created() {
      this.getCateList()
  },
  methods: {
    //   获取商品分类的数据
     async getCateList() {
       const {data:res} = await this.$http.get('categories')
       if(res.meta.status !== 200) {
           return this.message.error('获取商品分类数据失败')
       }
       this.catelist = res.data
       console.log(this.catelist);
       
      },
    //   级联选择器选中项变化会触发这个函数
      handleChange(){
          console.log(this.addForm.goods_cat);
          if(this.addForm.goods_cat.length !==3) {
            this.addForm.goods_cat = []
          }
      },
      beforeTabLeave(activeName,oldActiveName){
        // console.log('离开'+oldActiveName);
        // console.log('进入'+activeName);
        if(oldActiveName === '0' && this.addForm.goods_cat.length !==3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
     async tabClick(){
        console.log(this.activeIndex);
        //证明访问的是动态参数面板
        if(this.activeIndex === '1'){
       const {data:res} =  await this.$http.get(`categories/${this.cateId}/attributes`,{
            params: {sel : 'many'}
          })
          if(res.meta.status !== 200)  {
            return this.$message  .error('获取动态参数列表失败')
          }
          res.data.forEach(item => {
            item.attr_vals=
            item.attr_vals.length === 0 ?[]
           :item.attr_vals.split(' ')
          });
          this.manyTableData = res.data
          console.log(this.manyTableData);
          
        }else if (this.activeIndex === '2') {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params: {sel : 'only'}
          })
          if(res.meta.status !== 200)  {
            return this.$message  .error('获取动态参数列表失败')
          }
          console.log(res.data);
          this.onlyTableData = res.data
        }
      },
      // 处理图片预览
      handlePreview(file){
       this.previewPath = file.response.data.url
       this.logoVisible = true
      },
      // 处理移除图片操作
      handleRemove(file){
        console.log(file);
         // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      console.log(filePath);
      
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const index = this.addForm.pics.findIndex(function(item){
        if(item.pic === filePath) {
          return true
        }
      }) 
        console.log(index);
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm)
      },
      handleSuccess(response){
        console.log(response);
        // 1.拼接得到一个图片信息对象
        const picInfo = {pic : response.data.tmp_path}
        // 2.将图片信息对象 push到pics数组
        this.addForm.pics.push(picInfo)
        console.log(this.addForm);  
      },
      // 添加商品
     add (){
        this.$refs.addFormRef.validate(async valid =>{
          if(!valid) {
            return this.$message.error('请填写必要的表单项')
          }
          // 添加的业务逻辑
          // lodash里面的 cloneDeep 方法可以进行深拷贝
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数
          this.manyTableData.forEach(item =>{
            const newInfo = {attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')}
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTableData.forEach(item=>{
            const newInfo = {attr_id : item.attr_id,
            attr_value: item.attr_vals}
             this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          console.log(form);

           // 发起请求添加商品
        // 商品的名称，必须是唯一的

        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
         })
      }
  },
  computed :{
    cateId(){
      if(this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.imgpath {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>


