<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%;">
        <el-table-column type="index" label="序号" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上线(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ scope.row.chargeType }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分类 -->
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { getRuleListAPI } from '@/api/rule'
import { utils, writeFileXLSX } from 'xlsx'
export default {
  name: 'Building',
  data() {
    return {
      ruleList: [], // 规则列表,
      // 请求参数
      params: {
        page: 1,
        pageSize: 2
      },
      // 规则总数
      total: 0,
      dialogVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getRuleListAPI(this.params)
      // console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
    },
    pageChange(page) {
      this.params.page = page
      this.getList()
    },
    exportExcel() {
      // 导出Excel逻辑
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet([
        { 计费规则编号: 'R001', 计费规则名称: '规则一', 免费时长: 30, 收费上线: 10, 计费方式: '按小时计费', 计费规则: '首小时5元，后续每小时3元' },
        { 计费规则编号: 'R002', 计费规则名称: '规则二', 免费时长: 15, 收费上线: 8, 计费方式: '按半小时计费', 计费规则: '首半小时3元，后续每半小时2元' }
      ])

      // 把工作表添加到工作簿中  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, '规则列表')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']], { origin: 'A1' })
      // 导出Excel文件
      writeFileXLSX(workbook, '停车计费规则.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
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
