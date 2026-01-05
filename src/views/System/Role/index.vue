<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div v-for="(item, index) in roleList" :key="item.roleId" class="role-item" :class="{ active: currentIndex === index }" @click="switchTab(index)">
        <div class="role-info">
          <svg-icon :icon-class="currentIndex === index ?'user-active': 'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <svg-icon icon-class="more" />
        </div>
      </div>
      <el-button class="addBtn" size="mini">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <div class="tree-wrapper">
        <div v-for="item in treeList" :key="item.id" class="tree-item">
          <div class="tree-title"> {{ item.title }} </div>
          <el-tree
            ref="tree"
            :data="item.children"
            :props="defaultProps"
            :show-checkbox="true"
            default-expand-all
            node-key="id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI } from '@/api/system'

// 递归添加disabled属性
function addDiabled(treeList) {
  treeList.forEach(item => {
    item.disabled = true
    if (item.children) {
      addDiabled(item.children)
    }
  })
}
export default {
  name: 'Role',
  data() {
    return {
      roleList: [], // 角色列表
      currentIndex: 0,
      treeList: [], // 权限树
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  async mounted() {
    await this.getRoleList()
    await this.getTreeList()
    // 组件初始化默认高亮
    // this.roleList && treeList 都不为空
    this.switchTab(0)
  },
  methods: {
    async switchTab(idx) {
      this.currentIndex = idx
      // 拿到当前的角色id
      const roleId = this.roleList[idx].roleId
      // 使用id获取高亮权限点的列表
      const res = await getRoleDetailAPI(roleId)
      const perms = res.data.perms
      // console.log(this.$refs.tree)
      // 变量tree实例组成的数据 分别调用他身上的高亮方法 闯入需要高亮的权限点数据
      this.$refs.tree.forEach((treeInstance, index) => {
        treeInstance.setCheckedKeys(perms[index])
      })
    },
    async getRoleList() {
      const res = await getRoleListAPI()
      // console.log('res', res)
      this.roleList = res.data
    },
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      addDiabled(this.treeList)
      // console.log('treeList', this.treeList)
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:10px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
