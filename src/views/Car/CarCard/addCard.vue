<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="id ? '编辑月卡' : '添加月卡'" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="carInfoForm" :model="carInfoForm" :rules="carInfoRules" label-width="100px">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeForm" :model="feeForm" :rules="feeFormRules" label-width="100px">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model.number="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option v-for="item in payMethodList" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { createCardAPI, getDetailAPI, updateCardAPI } from '@/api/card'
export default {
  name: 'AddCard',
  data() {
    const validateCarNumber = (rule, value, callback) => {
      // value 表示输入的值
      // callback 表示校验成功或者失败的回调函数
      const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
      if (!reg.test(value)) {
        // 校验不通过
        callback(new Error('请输入符合规划的车牌号'))
      } else {
        callback()
      }
    }
    return {
      // 表单对象
      carInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      // 规则对象
      carInfoRules: {
        personName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { validator: validateCarNumber, trigger: 'blur' }
        ],
        carBrand: [
          { required: true, message: '请输入车辆品牌', trigger: 'blur' }
        ]
      },
      // 缴费信息表单
      feeForm: {
        payTime: '', // 支付时间
        paymentAmount: null, // 支付金额
        paymentMethod: '' // 支付方式
      },
      // 缴费规则
      feeFormRules: {
        payTime: [
          { required: true, message: '请选择支付时间', trigger: 'blur' }
        ],
        paymentAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      // 支付方式下拉列表
      payMethodList: [
        { id: 'Alipay', name: '支付宝' },
        { id: 'WeChat', name: '微信' },
        { id: 'Cash', name: '线下' }
      ]
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    if (this.id) {
      console.log(this.id)
      this.getCardDetail()
    }
  },
  methods: {
    confirmAdd() {
      // 俩个表单统一验证
      // 调用实例的validate方法
      // 1. 串行校验 第一个表单校验通过 才会校验下一个表单
      // 2. 并行校验 所有表单都通过后才会执行then方法
      this.$refs.carInfoForm.validate(valid => {
        if (valid) {
          // 第二个表单验证
          this.$refs.feeForm.validate(async valid => {
            if (valid) {
              // TODO API
              const reqData = {
                ...this.carInfoForm,
                ...this.feeForm,
                cardStartDate: this.feeForm.payTime[0],
                cardEndDate: this.feeForm.payTime[1]
              }
              delete reqData.payTime
              console.log('提交数据', reqData)
              // 调用接口
              // 根据id判断是添加还是修改
              if (this.id) {
                await updateCardAPI(reqData)
              } else {
                await createCardAPI(reqData)
              }
              // 后续处理
              // 提示用户
              this.$message.success(`${this.id ? '更新成功' : '添加成功'}`)
              // 跳回列表页面
              this.$router.back()
            }
          })
        }
      })
    },
    async getCardDetail() {
      const id = this.$route.query.id
      const res = await getDetailAPI(id)
      const { carInfoId, personName, phoneNumber, carNumber, carBrand } = res.data
      this.carInfoForm = {
        personName,
        phoneNumber,
        carNumber,
        carBrand,
        carInfoId
      }
      const { rechargeId, cardStartDate, cardEndDate, paymentAmount, paymentMethod } = res.data.rechargeList[0]
      this.feeForm = {
        payTime: [cardStartDate, cardEndDate],
        paymentAmount,
        paymentMethod,
        rechargeId
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 100px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
