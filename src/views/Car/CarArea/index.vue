<template>
  <div class="building-container">
    <div class="create-container">
      <el-button v-btn-auth="'park:building:add_edit'" type="primary" @click="addArea">添加区域</el-button>
      <!-- <el-button v-btn-auth="'park:building:remove'" type="primary" @click="$router.push('/addEnterprise')">删除楼宇</el-button>

      <auth-btn btn-perm="park:building:remove">
        <el-button>添加</el-button>
      </auth-btn> -->
    </div>
    <!-- 表格区域 -->
    <div v-btn-auth="'park:building:list'" class="table">
      <el-table style="width: 100%; color: #34363b;" :data="list" @expand-change="expandChange">
        <el-table-column type="index" label="序号" />
        <el-table-column label="区域名称" prop="areaName" />
        <el-table-column label="车位数（个）" prop="spaceNumber" />
        <el-table-column label="面积(m²)" prop="areaProportion" />
        <el-table-column label="计费规则" prop="ruleName" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button v-btn-auth="'park:building:remove'" size="mini" type="text"
              @click="editArea(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delArea(row.id)">删除</el-button>
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

    <el-dialog title="添加区域" :visible="dialogVisible" width="480px" @close="closeDialog" @open="openDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormAreaRules" label-width="80px">
          <el-form-item label="区域名称" prop="areaName">
            <el-input placeholder="请输入区域名称" v-model="addForm.areaName" />
          </el-form-item>
          <el-form-item label="车位数（个）" prop="spaceNumber">
            <el-input placeholder="请输入车位个数" v-model.number="addForm.spaceNumber" />
          </el-form-item>
          <el-form-item label="面积（m²）" prop="areaProportion">
            <el-input placeholder="请输入面积" v-model.number="addForm.areaProportion">
              <template slot="append">m²</template>
            </el-input>
          </el-form-item>
          <el-form-item label="关联计费规则" prop="ruleId">
            <el-select placeholder="请选择" v-model="addForm.ruleId">
              <el-option v-for="item in ruleNameList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="addForm.remark"></el-input>
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
import { getAreaListAPI, updateAreaAPI, delAreaAPI, addAreaAPI } from '@/api/area'
export default {
  name: 'Building',
  data() {
    return {
      list: [], // 区域列表
      params: {
        name: '',
        page: 1,
        pageSize: 5
      },
      total: 0,
      dialogVisible: false, // 控制弹窗框打开和关闭
      addForm: {
        areaName: '',
        spaceNumber: '',
        areaProportion: '',
        ruleId: '',
        remark: ''
      },
      addFormAreaRules: {
        areaName: [
          { required: true, message: '请输入区域名称！', trigger: 'blur' }
        ],
        spaceNumber: [
          { required: true, message: '请输入车位数！', trigger: 'blur' }
        ],
        areaProportion: [
          { required: true, message: '请输入面积！', trigger: 'blur' }
        ],
        ruleName: [
          { required: true, message: '请选择关联计费规则', trigger: 'blur' }
        ],
      },
      ruleNameList: [
        { id: 1, name: '按分钟计费' },
        { id: 2, name: '按小时计费' },
        { id: 3, name: '按次收费' },
        { id: 4, name: '分段计费' }
      ],
      buildingId: ''
    }
  },
  mounted() {
    this.getAreaList()
  },
  methods: {
    confirmAdd() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // TODO API
          // console.log(this.addForm);
          const res = await addAreaAPI(this.addForm)
          res.code === 10000 && this.$message.success('添加成功')
          this.buildingId = null
          // 1. 弹框关闭
          this.dialogVisible = false
          // 2. 重置一下数据( resetFileds + 手动清除)
          this.$refs.addForm.resetFields()
          // 3. 重新拉取一下列表
          this.getAreaList()
        }
      })
      // 调用接口
    },
    addArea() {
      this.dialogVisible = true
    },
    editArea(id) {
      console.log(id);
    },
    async delArea(id) {
      this.$confirm('确认删除区域吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delAreaAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getAreaList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getAreaList() {
      // 用来做table渲染  用来做下拉框渲染  拆分成俩个接口
      // const res = await getBuildingListAPI({ page: 1, pageSize: 100 })
      // this.list = res.data.rows
      const res = await getAreaListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
      // console.log(res);

    },
    // 分页
    pageChange(page) {
      this.params.page = page
      this.getAreaList()
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
    closeDialog() {
      this.dialogVisible = false
    },
    openDialog() {
      this.getAreaList()
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
