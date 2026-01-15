<template>
  <div class="rule-container">
    <div v-btn-auth="'parking:rule:list'" class="create-container">
      <el-button type="primary" @click="addRule">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div v-btn-auth="'parking:rule:list'" class="table">
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
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template #default="scope">
            <el-button v-btn-auth="'parking:rule:add_edit'" size="mini" type="text">编辑</el-button>
            <el-button v-btn-auth="'parking:rule:remove'" size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分类 -->
      <el-pagination layout="prev, pager, next" :total="total" :page-size="params.pageSize"
        @current-change="pageChange" />
    </div>
    <el-dialog title="添加楼宇" :visible=0 width="880px" @close="closeDialog" @open="openDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="120px">
          <el-form-item label="计费规则编号" prop="name">
            <el-input placeholder="请输入计费规则编号" v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="计费规则名称" prop="floors">
            <el-input placeholder="请输入计费规则名称" v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="计费方式（全天收费）" prop="area">
            <el-radio v-model="radio" border label="1">时长</el-radio>
            <el-radio v-model="radio" border label="2">按次</el-radio>
            <el-radio v-model="radio" border label="3">分段</el-radio>
          </el-form-item>
          <div style="display: flex;">
            <el-form-item label="免费时长">
              <el-input-number v-model="num" placeholder="请输入免费时长" controls-position="right" @change="handleChange"
                :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="收费上限">
              <el-input placeholder="请输入收费上限" />
            </el-form-item>
          </div>
          <div style="display: flex;">
          <el-form-item label="计费规则" prop="propertyFeePrice">
              <el-input-number style="width: 85px;" v-model="num" placeholder="请输入" controls-position="right" @change="handleChange"
              :max="10"></el-input-number>
            <el-select style="width: 160px; margin: 0 12px;" v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input style="width: 45px;" v-model="num" placeholder="请输入" />
          </el-form-item>
        </div>
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
      num: Number,
      // 规则总数
      total: 0,
      dialogVisible: false,
      addForm: {
        ruleNumber: '',
        ruleName: '',
        freeDuration: '',
        chargeType: '',
        durationPrice: 0,
        chargeCeiling: 0,
        durationType: '',
        durationTime: 0,
        turnPrice: 0,
        partitionFrameTime: 0,
        partitionFramePrice: 0,
        partitionIncreaseTime: 0,
        partitionIncreasePrice: 0,
      },
      options: [
        {
          value: '选项1',
          label: '小时'
        },
        {
          value: '选项2',
          label: '分钟'
        }
      ],
      value: '',
      radio: '1',
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
    closeDialog() {
      this.dialogVisible = false
    },
    openDialog() {
      this.dialogVisible = true
    },
    handleChange(val) {
      console.log(val);

    },
    addRule() {

    },
    // 导出Excel逻辑
    async exportExcel() {
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 获取当前要导出的table数据
      const res = await getRuleListAPI(this.params)
      // 创建一个工作表 要求一个对象数组格式 按照需求调整数据的顺序
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      const sheetData = res.data.rows.map(item => {
        const newObj = {} // 存放正确的顺序的key-value
        tableHeaderKeys.forEach(key => {
          newObj[key] = item[key]
        })
        return newObj
      })
      const worksheet = utils.json_to_sheet(sheetData)

      // 把工作表添加到工作簿中  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, '规则列表')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
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
