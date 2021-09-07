<template>
  <div class="register">
<section class="form_comtainer">
  <div class="manage_tip">
    <span class="title">後臺管理系統</span>
        <el-form :model="registerUser" :rules="rules" ref="registerForm" label-width="80px" class="registerForm">
      <el-form-item label="用戶名" prop="name">
        <el-input  v-model="registerUser.name" placeholder="請輸入使用者名稱"></el-input>
      </el-form-item>

      <el-form-item label="電子信箱" prop="email">
        <el-input  v-model="registerUser.email" placeholder="請輸入電子信箱"></el-input>
      </el-form-item>

      <el-form-item label="密碼" prop="password">
        <el-input type="password" v-model="registerUser.password" placeholder="請輸入密碼"></el-input>
      </el-form-item>

      <el-form-item label="確認密碼" prop="password2">
        <el-input type="password" v-model="registerUser.password2" placeholder="請確認密碼"></el-input>
      </el-form-item>

      <el-form-item label="選擇身分">
        <el-select v-model="registerUser.identity" placeholder="請選擇身分">
          <el-option label="管理員" value="manager"></el-option>
          <el-option label="員工" value="employee"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button tpye="primary" class="submit_btn" @click="submitForm('registerForm')">註冊</el-button>
      </el-form-item>
    </el-form>
  </div>
</section>
  </div>
</template>

<script>
export default {
  name:"register",
  components:{},
  data(){
     var validatePass2 = (rule, value, callback) => {
   
         if (value !== this.registerUser.password) {
          callback(new Error('兩次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return{
      registerUser:{
        name:'',
        email:'',
        password:'',
        password2:'',
        identity:''
      },
      rules:{
        name:[
        {
          required:true,
          message:"用戶名不能空白",
          trigger:"blur"
        },
        {
          min:2,
          max:30,
          message:"長度要在2到30之間",
          trigger:"blur"
        }
        ],
        email:[
          {
          type:"email",
          required:true,
          message:"電子郵件格式不正確",
          trigger:"blur"
          }
        ],
        password:[
          {
            required:true,
            message:"密碼不能為空",
            trigger:"blur"
          },
          {
          min:6,
          max:30,
          message:"長度要在6到30之間",
          trigger:"blur"
          }
        ],
        password2:[
           {
            required:true,
            message:"密碼不能為空",
            trigger:"blur"
          },
          {
          min:6,
          max:30,
          message:"長度要在6到30之間",
          trigger:"blur"
          },
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },

  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          this.$axios.post('./api/users/register',this.registerUser)
          .then(res=>{
            // 註冊成功
            this.$message({
              message:"帳號註冊成功!",
              type:"success"
            })
          })
          this.$router.push('/login')
          } 
        });
      },
  },
};
</script>

<style scoped>
  .register {
  position: relative;
  width: 100%;
  height: 100%;
  background-color:#ccc; 
  background-size: 100% 100%;
  opacity: 0.9;
  }
  .form_comtainer{
    width: 370px;
    height: 210px;
    position: absolute;
    top:10%;
    left:34%;
    padding:25px;
    border-radius: 5px;
    text-align: center;
  }
  .form_comtainer .manage_tip .title {
    font-family: 'Microsoft YaHei';
    font-weight: bold;
    font-size: 26px;
    color: black;
  }
  .registerForm{
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius:5px;
    box-shadow:0px 5px 10px #ccc;
  }
  .submit_btn{
    width: 100%;
  }

</style>