<template>
<div class="dialog">
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.show"
    width="width"
    :close-on-click-modal="false"
    :close-on-press-escape ="false"
    :modal-append-to-body="false"
  >
    <div class="form">
      <el-form 
      ref="form" 
      :model="formData" 
      :rules="form_rules"
      label-width="120px" 
      style="margin:10px;width:auto;"
      >
      <el-form-item label="收支類型：">
        <el-select v-model="formData.type" placeholder="收支類型">
          <el-option
            v-for="(formtype,index) in format_type_list"
            :key="index"
            :label="formtype"
            :value="formtype">
          </el-option>
        </el-select>
      </el-form-item>

        <el-form-item prop="describe" label="收支描述：">
          <el-input type="describe" v-model="formData.describe" ></el-input>
        </el-form-item>

        <el-form-item prop="income" label="收入">
          <el-input type="income" v-model="formData.income" ></el-input>
        </el-form-item>

        <el-form-item prop="expend" label="收支：">
          <el-input type="expend" v-model="formData.expend" ></el-input>
        </el-form-item>

        <el-form-item prop="cash" label="帳戶現金：">
          <el-input type="cash" v-model="formData.cash" ></el-input>
        </el-form-item>

        <el-form-item prop="remark" label="備註：">
          <el-input type="remark" v-model="formData.remark" ></el-input>
        </el-form-item>

        <el-form-item class="text_right">
          <el-button @click="dialog.show = false">
            取消
          </el-button>
          <el-button @click="onSubmit('form')" type="primary">
            確定
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
   
  
</div>
</template>

<script>
export default {
name:'dialog',
props:{
  dialog:Object,
  formData:Object
},
data(){
  return{
    format_type_list:[
      "領取現金",
      "領錢手續費",
      "儲值",
      "優惠券",
      "儲值禮卷",
      "轉帳"
    ],

    form_rules:{
      describe:[
        { required: true, message: '收支描述不能為空'},
      ],
      income:[
         { required: true, message: '收入不能為空'},
        
      ],
      expend:[
        {required:true,message:'支出不能為空'},
     
      ],
      cash:[
        {required:true,message:'帳戶現金不能為空'},

      ],
    }
  }
},

methods: {
  onSubmit(form){
    this.$refs[form].validate(valid=>{
      if(valid){
        const url = 
        this.dialog.option == 'add' ? 'add' : `edit/${this.formData.id}`
        this.$axios.post(`/api/profiles/${url}`,this.formData)
        .then( () => {
          // 新增成功
          this.$message({
            message:'新增數據成功',
            type:'success'
          }) 

          // 隱藏對話框
          this.dialog.show = false
          this.$emit('update')
        })
      }
    })
  }
},
}
</script>

<style>

</style>