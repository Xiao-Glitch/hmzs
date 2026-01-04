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
      <!-- <el-button v-btn-auth="'park:enterprise:remove'" type="primary" @click="$router.push('/addEnterprise')">删除企业</el-button>

      <auth-btn btn-perm="park:enterprise:remove">
        <el-button>添加</el-button>
      </auth-btn> -->
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
                  <el-button size="mini" :disabled="scope.row.status !== 3" type="text" @click="delRent(scope.row.id)">删除</el-button>
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
            <el-button size="mini" type="text" @click="delEnterprise(row.id)">删除</el-button>
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
import { uploadAPI } from '@/api/common'
import { getListAPI, addRentAPI, getRentListAPI, outRentAPI, delRentAPI, delEnterPriseAPI } from '@/api/park'
import { getBuildingRentListAPI } from '@/api/building'
export default {
  name: 'EnterPrise',
  data() {
    return {
      list: [], // 企业列表
      params: {
        name: '',
        page: 1,
        pageSize: 10
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
    confirmAdd() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // TODO API
          // 处理参数
          const { buildingId, contractId, contractUrl, type, enterpriseId } = this.rentForm
          const reqData = {
            buildingId, contractId, contractUrl, type, enterpriseId,
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          }
          const res = await addRentAPI(reqData)
          console.log(reqData)
          res.code === 10000 && this.$message.success('添加成功') && window.location.reload()
          // 1. 弹框关闭
          this.dialogVisible = false
          // 2. 重置一下数据( resetFileds + 手动清除)
          this.$refs.addForm.resetFields()
          this.rentForm = {
            buildingId: null, // 楼宇id
            contractId: null, // 合同id
            contractUrl: '', // 合同Url
            enterpriseId: null, // 企业名称
            type: 0, // 合同类型
            rentTime: [] // 合同时间
          }
          this.$refs.uploadRef.clearFiles()
          // 3. 重新拉取一下列表
        }
      })
      // 调用接口
    },
    lookRent(id) {
      this.$router.push({
        path: '/enterpriseDetail',
        query: {
          id
        }
      })
    },
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return MAP[status] || 'info'
    },
    formatStatus(status) {
      const MAP = {
        0: '待生效',
        1: '租赁中',
        2: '已到期',
        3: '已退租'
      }
      return MAP[status] || '未知状态'
    },
    async outRent(id) {
      this.$confirm('确认退租吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await outRentAPI(id)
        this.$message({
          type: 'success',
          message: '退租成功!'
        })
        window.location.reload()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退租'
        })
      })
    },
    async delRent(id) {
      this.$confirm('确认删除合同吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRentAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async delEnterprise(id) {
      const res = await getRentListAPI(id)
      if (res.data.length > 0) {
        return this.$message.error('该企业存在租赁合同，无法删除！')
      } else {
        this.$confirm('确认删除该企业吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delEnterPriseAPI(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getiList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    async upload(res) {
      // 把file对象存下来
      const file = res.file
      // 处理formdata
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', 'contract')
      // 调用上传接口
      const _res = await uploadAPI(fd)
      // 存入数据
      this.rentForm.contractId = _res.data.id
      this.rentForm.contractUrl = _res.data.url
    },
    async getBuildingList() {
      // 用来做table渲染  用来做下拉框渲染  拆分成俩个接口
      // const res = await getBuildingListAPI({ page: 1, pageSize: 100 })
      // this.buildingList = res.data.rows
      const res = await getBuildingRentListAPI()
      this.buildingList = res.data
    },
    async getiList() {
      // 接口调用
      const res = await getListAPI(this.params)
      // console.log(res)
      // 数据解构赋值
      this.list = res.data.rows.map(item => {
        return {
          ...item,
          rentList: [] // 合同列表
        }
      })
      console.log(this.list)
      this.total = res.data.total
    },
    // 分页
    pageChange(page) {
      this.params.page = page
      this.getiList()
    },
    doSearch() {
      this.params.page = 1
      this.getiList()
    },
    clearSearch() {
      this.getiList()
    },
    editEnterprise(id) {
      this.$router.push({
        path: '/addEnterprise',
        query: {
          id
        }
      })
    },
    async expandChange(row, rows) {
      // console.log('展开', row, rows)
      const item = rows.find(item => item.id === row.id)
      if (item) {
        const res = await getRentListAPI(row.id)
        // eslint-disable-next-line require-atomic-updates
        row.rentList = res.data
      }
    },
    addRent(id) {
      this.dialogVisible = true

      this.rentForm.enterpriseId = id
    },
    closeDialog() {
      this.dialogVisible = false
    },
    openDialog() {
      this.getBuildingList()
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
