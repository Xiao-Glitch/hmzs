<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id ? '编辑角色' : '添加角色' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="currentActive">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <!--
        v-if: 真实的dom创建和移除
        v-show: 操作的只是css样式的变化  原因: 步骤切换的时候有可能回退 保证dom之前操作过的状态还在
       -->
      <div v-show="currentActive === 1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="infoForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="currentActive === 2" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                show-checkbox
                default-expand-all
                node-key="id"
                highlight-current
                check-strictly
                :props="{ label: 'title', disabled:()=> false }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="currentActive === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <!--
                  在内部通过遍历数组生成每一个树节点的时候 检测当前props选项中
                  是否传入了一个配置项 叫做disabled 如果传入了 调用这个方法拿到它的返回值
                  如果当前拿到的是true 就把当前项禁用掉 如果没有返回true 不禁用

                  arrary.some(item=> 判断条件)
                 -->
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  check-strictly
                  node-key="id"
                  :highlight-current="false"
                  :props="{label: 'title', disabled: ()=> true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <!--
        上一步按钮 只有currentAcitve > 1 才显示
        下一步按钮 等于3不显示
       -->
      <div class="btn-container">
        <el-button v-if="currentActive !== 1" @click="prev">上一步</el-button>
        <el-button v-if="currentActive !== 3" type="primary" @click="next">下一步</el-button>
        <el-button v-if="currentActive === 3" type="primary" @click="confirmAdd">确认添加</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getTreeListAPI, addRoleAPI, getRoleDetailAPI, editRoleAPI } from '@/api/system'

// 递归移除disabled属性
// function remDiabled(treeList) {
//   treeList.forEach(item => {
//     item.disabled = false
//     if (item.children) {
//       remDiabled(item.children)
//     }
//   })
// }

export default {
  name: 'AddRole',
  data() {
    return {
      currentActive: 1, // 当前步骤
      roleForm: {
        roleName: '',
        remark: ''
      },
      roleRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      treeList: [], // 权限树数据
      permsList: [], // 选择的权限列表
      disableTreeList: [] // 禁用的权限树数据
    }
  },
  computed: {
    id() {
      return this.$route.query.roleId
    }
  },
  mounted() {
    this.getTreeList()
    if (this.id) {
      this.getRoleDetail()
    }
  },
  methods: {
    async getRoleDetail() {
      const res = await getRoleDetailAPI(this.id)
      console.log(res)
      const { perms, roleName, remark } = res.data
      this.roleForm = { roleName, remark }
      // 回填权限
      this.$nextTick(() => {
        if (this.$refs.tree && this.$refs.tree.length) {
          this.$refs.tree.forEach((treeInstance, index) => {
            treeInstance.setCheckedKeys(perms[index])
          })
        }
      })
    },
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
    },
    // 上一步
    prev() {
      // if (this.currentActive > 1) {
      //   回到权限配置步骤时 需要把树上的禁用状态移除
      //   remDiabled(this.treeList)
      // }
      this.currentActive--
    },
    // 下一步
    next() {
      if (this.currentActive === 1) {
        this.$refs.infoForm.validate(valid => {
          if (valid) {
            this.currentActive++
          }
        })
      } else if (this.currentActive === 2) {
        // 选择权限信息的状态
        // 目标：判断用户至少选择了一项
        // 思路：获取到用户选择了什么
        this.permsList = []
        this.$refs.tree.forEach(treeInstance => {
          const keys = treeInstance.getCheckedKeys()
          // console.log(keys)
          this.permsList.push(...keys)
          // console.log(this.treeList)
        })
        if (this.permsList.length === 0) {
          return this.$message.warning('请选择权限')
        } else {
          this.currentActive++
          // 回显禁用的树
          this.$refs.diabledTree.forEach((treeInstance, index) => {
            treeInstance.setCheckedKeys(this.permsList)
          })
        }
      }
    },
    // 确认添加
    async confirmAdd() {
      if (this.id) {
        // TODO 编辑角色逻辑
        await editRoleAPI({
          roleId: this.id,
          ...this.roleForm,
          perms: [this.permsList]
        })
      } else {
        // TODO 添加角色逻辑
        await addRoleAPI({
          ...this.roleForm,
          perms: [this.permsList]
        })
        // console.log({
        //   ...this.roleForm,
        //   perms: [this.permsList]
        // })
      }

      this.$message.success(`${this.id ? '角色组编辑成功' : '角色组添加成功'}`) && this.$router.push('/sys/role')
    }
  }
}
</script>

<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
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
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
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
    z-index: 10001;
  }
  .tree-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .tree-item {
      flex: 1;
      padding: 0px 4px;
      text-align: center;
      .tree-title {
        background: #f5f7fa;
        text-align: center;
        padding: 10px 0;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
