<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div v-btn-auth="'park:building:list'" class="search-container">
      <div class="search-label">楼宇名称：</div>
      <!--
        分页 页数位于子组件内部 父组件如果想要用 子传父去获取 @current-change='pageChange'
        清除 叉号位于子组件中 点击叉号时去通知父组件我现在给你清空了 你去做事儿吧 @clear

        子传父的本质: 子组件通过调用父组件中的某个方法 通知它做个事儿
       -->
      <el-input v-model="params.name" clearable placeholder="请输入楼宇名称" class="search-main" @clear="clearSearch" />
      <el-button v-btn-auth="'park:building:query'" type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button v-btn-auth="'park:building:add_edit'" type="primary" @click="addBuilding">添加楼宇</el-button>
      <!-- <el-button v-btn-auth="'park:building:remove'" type="primary" @click="$router.push('/addEnterprise')">删除楼宇</el-button>

      <auth-btn btn-perm="park:building:remove">
        <el-button>添加</el-button>
      </auth-btn> -->
    </div>
    <!-- 表格区域 -->
    <div v-btn-auth="'park:building:list'" class="table">
      <el-table style="width: 100%" :data="list" @expand-change="expandChange">
        <el-table-column type="index" label="序号" />
        <el-table-column label="楼宇名称" width="320" prop="name" />
        <el-table-column label="层数" prop="floors" />
        <el-table-column label="在管面积(m²)" prop="area" />
        <el-table-column label="物业费(元/m²)" prop="propertyFeePrice" />
        <el-table-column label="状态" prop="">
          <template #default="scope">
            <!--
              差值表达式支持函数调用吗？支持
              调用一个函数的时候 差值表达式的位置渲染的是什么？ 函数执行之后的返回值
              -->
            <el-tag :type="formatInfoType(scope.row.status)"> {{ formatStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button v-btn-auth="'park:building:remove'" size="mini" type="text"
              @click="editBuilding(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delBuilding(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <!--
      1. 页数分出来  页数 = 总数 / 每页条数  total  pageSize
      2. 点击页数获取数据  @current-change="pageChange"  page 请求数据
     -->
    <div v-btn-auth="'park:building:list'" class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="params.pageSize"
        @current-change="pageChange" />
    </div>

    <el-dialog title="添加楼宇" :visible="dialogVisible" width="480px" @close="closeDialog" @open="openDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormBuilding" label-width="80px">
          <el-form-item label="楼宇名称" prop="name">
            <el-input placeholder="请输入楼宇名称" v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input placeholder="请输入楼宇层数" v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input placeholder="请输入在管面积" v-model="addForm.area">
              <template slot="append">m²</template>
            </el-input>
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input placeholder="请输入物业费" v-model="addForm.propertyFeePrice">
              <template slot="append">元/m²</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getBuildingListAPI, addBuildingAP, updateBuildingAPI, delBuildingAPI, getBuildingDetailAPI } from '@/api/building'
export default {
  name: 'Building',
  data() {
    return {
      list: [], // 楼宇列表
      params: {
        name: '',
        page: 1,
        pageSize: 5
      },
      total: 0,
      dialogVisible: false, // 控制弹窗框打开和关闭
      addForm: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: '',
      },
      addFormBuilding: {
        name: [
          { required: true, message: '请输入楼宇', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇楼层', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入在管面积', trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入物业费', trigger: 'blur' }
        ],
      },
      buildingId: ''
    }
  },
  mounted() {
    this.getBuildingList()
  },
  methods: {
    confirmAdd() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // TODO API
          if (this.buildingId) {
            const reqData = {
              ...this.addForm,
              id: this.buildingId
            }
            console.log('这是修改');

            const res = await updateBuildingAPI(reqData)
            res.code === 10000 && this.$message.success('修改成功')
          } else {
            const res = await addBuildingAP(this.addForm)
            res.code === 10000 && this.$message.success('添加成功')
            console.log('这是添加');

          }
          this.buildingId = null
          // 1. 弹框关闭
          this.dialogVisible = false
          // 2. 重置一下数据( resetFileds + 手动清除)
          this.$refs.addForm.resetFields()
          this.addForm = {
            name: '',
            floors: '',
            area: '',
            propertyFeePrice: '',
          },
            // 3. 重新拉取一下列表
            this.getBuildingList()
        }
      })
      // 调用接口
    },
    addBuilding() {
      this.dialogVisible = true
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
        0: '空置中',
        1: '租赁中'
      }
      return MAP[status] || '未知状态'
    },

    async getBuildingList() {
      // 用来做table渲染  用来做下拉框渲染  拆分成俩个接口
      // const res = await getBuildingListAPI({ page: 1, pageSize: 100 })
      // this.list = res.data.rows
      const res = await getBuildingListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
    },

    async editBuilding(id) {
      const res = await getBuildingDetailAPI(id)
      console.log(res);

      if (res.code !== 10000) return
      this.dialogVisible = true
      this.buildingId = id  // 添加这一行来保存要编辑的楼宇ID
      const { area, name, floors, propertyFeePrice } = res.data
      this.addForm = {
        name,
        floors,
        area,
        propertyFeePrice
      }
    },
    async delBuilding(id) {
      this.$confirm('确认删除楼宇吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delBuildingAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getBuildingList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分页
    pageChange(page) {
      this.params.page = page
      this.getBuildingList()
    },
    doSearch() {
      this.params.page = 1
      this.getBuildingList()
    },
    clearSearch() {
      this.getBuildingList()
    },
    async expandChange(row, rows) {
      // console.log('展开', row, rows)
      const item = rows.find(item => item.id === row.id)
      if (item) {
        const res = await getRentListAPI(row.id)
        // eslint-disable-next-line require-atomic-updates
        row.rentList = res.data
        this.total = res.data.total
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

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
