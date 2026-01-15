<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div v-btn-auth="'pole:info:add_edit'" class="search-container">
      <span class="search-label">一体杆名称: </span>
      <el-input v-model="params.poleName" clearable placeholder="请输入一体杆名称" class="search-main" />
      <span class="search-label">一体杆编号: </span>
      <el-input v-model="params.poleNumber" clearable placeholder="请输入一体杆编号" class="search-main" />
      <span class="search-label">运行状态: </span>
      <el-select v-model="params.poleStatus" placeholder="请选择运行状态">
        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="doSearch">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button v-btn-auth="'pole:info:add_edit'" type="primary" @click="addPole">添加一体杆</el-button>
      <el-button v-btn-auth="'pole:info:remove'" @click="delAllCard">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div v-btn-auth="'pole:info:list'" class="table">
      <el-table style="width: 100%;" :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <el-table-column label="一体杆名称" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" prop="poleIp" />
        <el-table-column label="安装区域" prop="areaName" />
        <el-table-column label="一体杆类型" prop="poleType" :formatter="formatType" />
        <el-table-column label="运行状态" prop="poleStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button v-btn-auth="'parking:rule:add_edit'" size="mini" type="text"
              @click="editPole(scope.row)">编辑</el-button>
            <el-button v-btn-auth="'parking:rule:remove'" size="mini" type="text"
              @click="delPole(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div v-btn-auth="'pole:info:list'" class="page-container">
      <el-pagination layout="total, prev, pager, next" :page-size="params.pageSize" :total="total"
        @current-change="currentChange" />
    </div>

    <el-dialog title="添加一体杆" :visible="dialogVisible" width="680px" @close="closeDialog" @open="openDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormAreaRules" label-width="120px">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input placeholder="请输入一体杆名称" v-model="addForm.poleName" />
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input placeholder="请输入一体杆编号" v-model="addForm.poleNumber" />
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-input placeholder="请输入一体杆IP" v-model="addForm.poleIp">
            </el-input>
          </el-form-item>
          <el-form-item label="关联区域" prop="areaId">
            <el-select placeholder="请选择关联区域" v-model="addForm.areaId">
              <el-option v-for="item in dropList" :key="item.areaId" :value="item.areaId"
                :label="item.areaName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一体杆类型" prop="poleType">
            <el-select placeholder="请选择一体杆类型" v-model="addForm.poleType">
              <el-option v-for="item in dropType" :key="item.id" :value="item.ename" :label="item.name"></el-option>
            </el-select>
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
import { getPoleListAPI, delPoleAPI, editPoleAPI, addPoleAPI, getAreaDropListAPI } from '@/api/pole'
export default {
  name: 'Card',
  data() {
    return {
      selectedList: [],
      list: [], // 一体杆
      params: {
        page: 1,
        pageSize: 10,
        poleName: '',
        poleNumber: '',
        poleStatus: null
      },
      RodId: null,
      dialogVisible: false,
      total: 0,
      statusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '异常'
        }
      ],
      addForm: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: null,
        poleType: ''
      },
      dropList: [],
      dropType: [
        {
          id: '0',
          ename: 'entrance',
          name: '入口'
        },
        {
          id: '1',
          ename: 'export',
          name: '出口'
        }
      ],
      addFormAreaRules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'change' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'change' }
        ]
      }
    }
  },

  mounted() {
    this.getList()
    this.getAreaDropList()
  },

  methods: {
    async getList() {
      // 1.调取接口
      const res = await getPoleListAPI(this.params)
      console.log(res)
      // 2.把后端数据赋值给响应式list
      this.list = res.data.rows
      this.total = res.data.total
    },
    async getAreaDropList() {
      const res = await getAreaDropListAPI()
      this.dropList = res.data
    },
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          if (this.RodId) {
            const res = await editPoleAPI(this.addForm)
            res.code === 10000 && this.$message.success('修改成功')

          } else {
            const res = await addPoleAPI(this.addForm)
            res.code === 10000 && this.$message.success('添加成功')
          }
          this.$refs.addForm.resetFields()
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    addPole() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    openDialog() {
      this.dialogVisible = true
    },
    // 格式化状态方法
    formatStatus(row) {
      // console.log(row, column)
      const MAP = {
        0: '正常',
        1: '异常'
      }
      return MAP[row.poleStatus]
    },
    formatType(row) {
      const MAP = {
        'entrance': '入口',
        'export': '出口'
      }
      return MAP[row.poleType]
    },
    currentChange(page) {
      console.log(page)
      this.params.page = page
      this.getList()
    },
    doSearch() {
      this.params.page = 1
      this.getList()

    },
    editPole(row) {
      console.log(row)
      this.dialogVisible = true
      this.addForm = {
        id: row.id,
        poleName: row.poleName,
        poleNumber: row.poleNumber,
        poleIp: row.poleIp,
        areaId: row.areaId,
        poleType: row.poleType
      }
      this.RodId = row.id
    },
    delPole(ids) {
      return this.$confirm('确认删除当前选中的一体杆吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delPoleAPI(ids)
        console.log(res);

        if (res.code === 10000) {
          // 更新列表
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }

        return res;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      // 获取选择的id并处理成接口需要的数据
      this.selectedList = val.map(item => item.id).join(',')
      // console.log(this.selectedList)
    },
    async delAllCard() {
      // 检查是否选择了任何项目
      if (!this.selectedList || this.selectedList.length === 0) {
        this.$message.warning('请至少选择一个一体杆');
        return;
      }

      const res = await this.delPole(this.selectedList)
      if(res && res.code === 10000) {
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
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
