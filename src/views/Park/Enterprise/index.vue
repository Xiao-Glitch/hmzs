<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <!--
        分页 页数位于子组件内部 父组件如果想要用 子传父去获取 @current-change='pageChange'
        清除 叉号位于子组件中 点击叉号时去通知父组件我现在给你清空了 你去做事儿吧 @clear

        子传父的本质: 子组件通过调用父组件中的某个方法 通知它做个事儿
       -->
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="clearSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button v-btn-auth="'park:enterprise:add_edit'" type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
      <el-button v-btn-auth="'park:enterprise:remove'" type="primary" @click="$router.push('/addEnterprise')">删除企业</el-button>

      <auth-btn btn-perm="park:enterprise:remove">
        <el-button>添加</el-button>
      </auth-btn>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @expand-change="expandChange">
        <el-table-column type="expand">
          <template #default="{row}">
            <el-table :data="row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column label="合同状态">
                <template #default="scope">
                  <!--
                    差值表达式支持函数调用吗？支持
                    调用一个函数的时候 差值表达式的位置渲染的是什么？ 函数执行之后的返回值
                   -->
                  <el-tag :type="formatInfoType(scope.row.status)"> {{ formatStatus(scope.row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <!--
                  退租：如果当前是退租的状态 禁用  如果不是退租的状态 启用
                  删除：只有已退租的时候 删除才是启用的 否则就是禁用的
                 -->
                <template #default="scope">
                  <el-button size="mini" :disabled="scope.row.status === 3" type="text" @click="outRent(scope.row.id)">退租</el-button>
                  <el-button size="mini" :disabled="scope.row.status !== 3" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button size="mini" type="text" @click="addRent(row.id)">添加合同</el-button>
            <el-button size="mini" type="text" @click="lookRent(row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="editEnterprise(row.id)">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <!--
      1. 页数分出来  页数 = 总数 / 每页条数  total  pageSize
      2. 点击页数获取数据  @current-change="pageChange"  page 请求数据
     -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加合同弹框 -->
    <el-dialog
      title="添加合同"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
      @open="openDialog"
    >
      <!-- 默认插槽 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in buildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <!--
              上传实现流程：
                1. el-upload 打开本地文件 并且校验这个文件是否符合要求 - File
                2. :http-request = 'upload'
                3. 按照接口的要求格式 得到类型为FormData的对象  new FormData()
                4. 按照要求往formData中添加字段数据 fd.append('字段名', '字段值')
                5. 调用上传接口
                6. 拿到返回的文件地址和其他有用的信息id 存入data中的响应式数据的位置 将来提交表单
             -->
            <el-upload
              ref="uploadRef"
              action="#"
              :http-request="upload"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getListAPI } from '@/api/park'
export default {
  name: 'EnterPrise',
  data() {
    return {
      list: [], // 企业列表
      params: {
        name: '',
        page: 1,
        pageSize: 2
      },
      total: 0,
      dialogVisible: false, // 控制弹窗框打开和关闭
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'blur' }
        ],
        rentTime: [
          { required: true, message: '请选择租贷日期', trigger: 'blur' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      },
      buildingList: [] // 楼宇列表
    }
  },
  mounted() {
    this.getiList()
  },
  methods: {
    async getiList() {
      // 接口调用
      const res = await getListAPI(this.params)
      // console.log(res)
      // 数据解构赋值
      this.list = res.data.rows.map(item => {
        return {
          ...item,
          rentList: []
        }
      })
      this.total = res.data.total
    },
    pageChange(page) {
      this.params.page = page
      this.getiList()
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
