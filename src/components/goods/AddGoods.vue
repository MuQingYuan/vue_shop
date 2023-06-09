<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品的信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex * 1"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏样式 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" style="width: 25%">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ ...cateProps, expandTrigger: 'hover' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="val"
                  v-for="(val, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台API地址 -->
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="addBtn" type="primary" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      activeIndex: 0,
      addForm: {
        // 添加商品的表单数据对象
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [
          // 商品所属的分类数组
        ],
        pics: [
          // 上传图片的数组
        ],
        goods_introduce: '', // 商品的详情描述
        attrs: []
      },
      addFormRules: {
        // 添加商品表单的数据对象的验证规则
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [
        // 所有商品分类数据
      ],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [
        // 动态参数列表数据
      ],
      onlyTableData: [
        // 静态属性列表数据
      ],
      upLoadURL: 'http://127.0.0.1:8888/api/private/v1/upload', // 上传图片的URL地址
      headerObj: {
        // 图片上传组件的headers请求头对象
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '', // 图片预览完整地址
      previewVisible: false
    }
  },
  methods: {
    async getCateList() {
      // 获取所有商品分类数据
      const { data: res } = await this.$http({
        method: 'get',
        url: 'categories'
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败!')
      } else {
        this.cateList = res.data
      }
    },
    handleChange() {
      // 级联选择器选中项变化，会触发这函数
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldName) {
      // 切换到下一步骤时阻止事件
      if (this.addForm.goods_cat.length !== 3 && oldName === '0') {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    async tabClicked() {
      // 切换tab下一步骤时,会触发的函数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http({
          method: 'get',
          url: `categories/${this.cateId}/attributes`,
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败!')
        } else {
          this.manyTableData = res.data
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
        }
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http({
          method: 'get',
          url: `categories/${this.cateId}/attributes`,
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败!')
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    handlePreview(file) {
      // 处理图片预览效果
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) {
      // 处理删除图片事件
      // file是封装好的，表示可以拿到删除的那个图片对象
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      // 3.调用数组splice方法，把图片对象从pics数组中移除
      this.addForm.pics.splice(i, 1)
    },
    handleSuccess(response) {
      // 监听图片上传成功事件
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    add() {
      // 添加商品事件
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('请填写必要表单项!')
        } else {
          // 级联选择器是双向绑定数组,而此时要对goods_cat转为字符串,所以会产生矛盾.
          // 解决办法: 对addForm进行深拷贝一份
          const form = JSON.parse(JSON.stringify(this.addForm))
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          // 发起请求添加商品
          const { data: res } = await this.$http.post('goods', form)
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败!')
          } else {
            this.$message.success('添加商品成功!')
            this.$router.push('/goods')
          }
        }
      })
    }
  },
  computed: {
    cateId() {
      // 计算属性存储级联选择器第三项id
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin: 10px 0;
}
</style>
