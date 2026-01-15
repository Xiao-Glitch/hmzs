<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div v-btn-auth="'parking:card:query'" class="search-container">
      <span class="search-label">车牌号码: </span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态: </span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="doSearch">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div v-btn-auth="'parking:card:list'" class="table">
      <el-table style="width: 100%;" :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="55" label="序号" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="收费类型" prop="chargeType" />
        <el-table-column label="停车总时长" prop="parkingTime" />
        <el-table-column label="缴纳费用（元）" prop="actualCharge" />
        <el-table-column label="缴纳状态" prop="payStatus" :formatter="formatStatus" />
        <el-table-column label="缴纳方式" :prop="payType.paymentMethod" />
        <el-table-column label="缴纳时间" prop="paymentTime" />
      </el-table>
    </div>
    <!-- 分页器 -->
    <div v-btn-auth="'parking:card:list'" class="page-container">
      <el-pagination layout="total, prev, pager, next" :page-size="params.pageSize" :total="total"
        @current-change="currentChange" />
    </div>
  </div>
</template>

<script>
import { getPaymentListAPI } from '@/api/paymaent'
export default {
  name: 'Card',
  data() {
    return {
      selectedList: [],
      list: [], // 停车缴费
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
          name: '待缴费'
        },
        {
          id: 1,
          name: '已缴费'
        }
      ],
      payType: {
        'Alipay': '支付宝'
      }
    }
  },

  mounted() {
    this.getList()
    const t = {
      'aaa' : 'bbb'
    }
    console.log(t.aaa);

  },

  methods: {
    async getList() {
      // 1.调取接口
      const res = await getPaymentListAPI(this.params)
      console.log(res)
      // 2.把后端数据赋值给响应式list
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 格式化状态方法
    formatStatus(row) {
      // console.log(row)
      const MAP = {
        0: '未缴费',
        1: '已缴费'
      }
      return MAP[row.paymentStatus]
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
    delCard(id) {
      this.$confirm('确认删除月卡吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delCardAPI(id)
        // 更新列表
        this.getList()
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
    handleSelectionChange(val) {
      // 获取选择的id并处理成接口需要的数据
      this.selectedList = val.map(item => item.id).join(',')
      console.log(this.selectedList)
    },
    async delAllCard() {
      await delAllCardAPI(this.selectedList)
      this.getList()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
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
