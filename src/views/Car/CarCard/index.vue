<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码: </span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名: </span>
      <el-input v-model="params.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态: </span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="doSearch">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addCard')">添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%;" :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editCrd(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delCard(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :page-size="params.pageSize" :total="total" @current-change="currentChange" />
    </div>
    <!-- 弹窗添加楼宇 -->
    <!-- <el-dialog title="添加楼宇" width="580px"> -->
      <!-- 表单接口 -->
      <!-- <div class="form-container"></div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog> -->
  </div>
</template>

<script>
import { getCardListAPI } from '@/api/card'
export default {
  name: 'Card',
  data() {
    return {
      selectedList: [],
      list: [], // 月卡列表
      params: {
        page: 1,
        pageSize: 5,
        carNumber: '',
        personName: '',
        cardStatus: null
      },
      total: 0,
      statusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '有效'
        },
        {
          id: 1,
          name: '已过期'
        }
      ]
    }
  },

  mounted() {
    this.getList()
  },

  methods: {
    async getList() {
      // 1.调取接口
      const res = await getCardListAPI(this.params)
      console.log(res)
      // 2.把后端数据赋值给响应式list
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 格式化状态方法
    formatStatus(row, column) {
      // console.log(row, column)
      const MAP = {
        0: '有效',
        1: '已过期'
      }
      return MAP[row.cardStatus]
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
    editCrd(id) {
      // console.log(id)
      this.$router.push({
        path: '/addCard',
        query: {
          id
        }
      })
    },
    handleSelectionChange(value) {}
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
  .search-btn{
    margin-left:20px;
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
