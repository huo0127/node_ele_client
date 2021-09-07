<template>
    <div class="fillContainer">
      <div>
        <el-form :inline="true" ref="add_data" :model="search_data">
          <!-- 篩選 -->
          <el-form-item label="按照時間篩選：">
            <el-date-picker 
            v-model="search_data.startTime" 
            type="datetime" 
            placeholder="選擇開始時間">
            </el-date-picker>
            --
            <el-date-picker 
            v-model="search_data.endTime" 
            type="datetime" 
            placeholder="選擇結束時間">
            </el-date-picker>
              <el-form-item>
            <el-button type="primary" size="small" icon="search" @click="handleSearch()">篩選</el-button>
          </el-form-item>
          </el-form-item>
          <el-form-item class="btnRight">
            <el-button type="primary" size="small" icon="view" @click="handleAdd()" v-if="user.identity == 'manager'">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%"
        max-height="450"
        border>
        <el-table-column
          type="index"
          label="序号"
          align='center'
          width="70">
        </el-table-column>
        <el-table-column
          prop="date"
          label="創建時間"
          align="center"
          width="250">
            <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="收支類型"
          align="center"
          width="150">
            <template slot-scope="scope">
              <span style="color:#00d053">{{ scope.row.type }}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="describe"
          label="收支描述"
          align="center"
          width="180">
            <template slot-scope="scope">
              <span style="color:#f56767">{{ scope.row.describe }}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="income"
          label="收入"
          align="center"
          width="170">
        </el-table-column>
        <el-table-column
          prop="expend"
          label="支出"
          align="center"
          width="170">
        </el-table-column>
        <el-table-column
          prop="cash"
          label="帳戶現金"
          align="center"
          width="170">
            <template slot-scope="scope">
              <span style="color:#4db3ff">{{ scope.row.cash }}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="備註"
          align="center"
          width="220">
        </el-table-column>
          <el-table-column 
          label="操作"
          align="center"
          prop="operation"
          fixed="right"
          weight="180"
          v-if="user.identity == 'manager'"
          >
          <template slot-scope="scope">
            <el-button
              size="small"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
            <el-button
              size="small"
              icon="delete"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
     <!-- 分頁 -->
      <el-row >
        <el-col :span="24">
          <div class="pagination">
             <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
             >
            </el-pagination>
          </div>
        </el-col>
      </el-row> 
    </div>
    <Dialog :dialog="dialog" @update="getProfile" :formData="formData"></Dialog>
  </div>
</template>

<script>
import Dialog from '../../components/Dialog'
export default {
name:'fundList',
components:{Dialog},
data(){
  return{
    search_data:{
      startTime:'',
      endTime:''
    },
    filterTableData:[],
    tableData:[],
    allTableData:[],
    formData:{
      type:'',
      describe:'',
      income:'',
      expend:'',
      cash:'',
      remark:'',
      id:''
    },
    dialog:{
      show:false,
      title:'',
      option:'edit'
    },
    paginations: {
        page_index: 1, // 當前位於哪頁
        total: 0, // 總數
        page_size: 5, // 1頁顯示多少條
        page_sizes: [5, 10, 15, 20], // 每頁顯示多少條
        layout: "total, sizes, prev, pager, next, jumper" // 翻頁属性
      },
  }
},
computed:{
  user(){
    return this.$store.getters.user
  }
},
created(){
  this.getProfile();
},
methods: {
  getProfile(){
    // 獲取表格數據
    this.$axios.get("api/profiles")
    .then( (res) => {
    this.allTableData = res.data;
    this.filterTableData = res.data;
    // 設置分頁數據
    this.setPaginations()
    }).catch( (err) => {
      console.log(err)
    })
  },

  handleEdit(index,row){
    //  編輯
    this.dialog = {
      show:true,
      title:"修改資金訊息",
      option:'edit'
    }

    this.formData = {
      type:row.type,
      describe:row.describe,
      income:row.income,
      expend:row.expend,
      cash:row.cash,
      remark:row.remark,
      id:row._id
    }
  },

  handleDelete(index, row) {
      // 删除
      this.$axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
        this.$message("删除成功");
        this.getProfile();
      });
    },


  handleAdd(){
     this.dialog = {
      show:true,
      title:"新增資金訊息",
      option:'add'
    }

    this.formData = {
      type:'',
      describe:'',
      income:'',
      expend:'',
      cash:'',
      remark:'',
      id:''
    }
    this.dialog.show = true
  },

  handleSizeChange(page_size){
    // 切換size
    this.paginations.page_index = 1
    this.paginations.page_size = page_size
    this.tableData = this.allTableData.filter((item,index)=>{
      return index < page_size
    })
  },

  handleCurrentChange(page){
    // 獲取當前頁
    let index = this.paginations.page_size * (page - 1)
    // 數據總數
    let nums = this.paginations.page_size * page
    // 容器
    let tables = []

    for (let i = index ; i < nums ; i++){
      if(this.allTableData[i]){
        tables.push(this.allTableData[i])
      }
      this.tableData = tables
    }
  },

  setPaginations(){
    // 分頁屬性
    this.paginations.total = this.allTableData.length
    this.paginations.page_index = 1;
    this.paginations.page_size = 5;
    // 設置默認分頁數據
    this.tableData = this.allTableData.filter((item,index)=>{
      return index < this.paginations.page_size
    })
  },

  handleSearch(){
    // 篩選
    if(!this.search_data.startTime || !this.search_data.endTime){
      this.$message({
        tpye:"warning",
        message:"請選擇時間區間"
      })
      this.getProfile()
      return;
    }
    const sTime = this.search_data.startTime.getTime()
    const eTime = this.search_data.endTime.getTime()

    this.allTableData = this.filterTableData.filter(item=>{
     let date = new Date(item.date)
     let time = date.getTime()
     return time >= sTime && time <= eTime
    })

    // 分頁數據
    this.setPaginations()
  }
},

}
</script>

<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight{
  float:right
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>