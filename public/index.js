(function(){

var that;
var dataRoleModel={};
var dataWeaponModel={};
var dataAccouterModel={};
var dataPetIModel={};
var socket = io.connect('//127.0.0.1:5010/');
socket.on('disconnect', function() {
  console.log(666)
    // connected = false;
 // socket.connect();

});
new Vue({
    el:'#root',
    data:{
      checkboxWeapon:false,
      checkboxAccouter:true,
      checkboxRole:false,
      checkboxPet:false,
      loading:false,
      serverCheckboxAll:false,
      serverData:[],
      condition:{
        serverDatas:[],
        serverIds:[]
      },
      showTips:false

    },
    created(){
        that=this
        this.getServerData()
        this.socketOn()
    },
    methods:{
      changeAll(val){
        that.serverData.forEach((item)=>{
          item.checkbox=val;
        })
      }, changeChild(ite){
          this.serverCheckboxAll=that.serverData.every(_=>_.checkbox);
      }, getServerData(){
            axios.get('/api/get/server/data').then(function (res) {
              if(200==res.data.status){

                (res.data.data||[]).forEach((item)=>{
                  item.checkbox=false;
                  item.loading=false;
                  item.message='';
                })
                that.serverData=res.data.data;

                // console.log(that.serverData);
              }else{
                console.log(res.error);
              }
            }).catch(function (error) {
              console.log(error);
            });

        },getNewData(){

          this.condition.serverIds=that.serverData.filter(_=>_.checkbox).map(_=>_.child_server_id);

          this.condition.serverDatas=that.serverData.filter(_=>_.checkbox).map(_=>_);
          this.showTips=true;

          if(0==this.condition.serverIds.length)return this.$message.warning('服务器列表数据不能为空');
          that.$confirm('抓取数据过程比较漫长可能1-30分钟，请勿重复抓取','重新抓取这些数据？', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
             this.loading=!this.loading;
             axios.post('/api/get/data',{
               server_ids:this.condition.serverIds,
               checkboxWeapon:false,
               checkboxAccouter:true,
               checkboxRole:false,
               checkboxPet:false,
             }).then(function (res) {
               if(200==res.data.status){

               }else{
                 console.log(res.error);
               }
             }).catch(function (error) { console.log(error); });

         }).catch(() => { this.showTips=false; });


       },socketOn(){

         socket.on('AccouterCount', function (data) {
           let serData=that.condition.serverDatas.filter(_=>_.child_server_id==data.serverId)[0]||{};
           // console.log('serData',serData);
           if(data.page==data.PageCount){
              that.loading=false;
              serData.message=data.message;
              serData.loading=false;
           }else{
             // console.log(data.message);
             serData.message=data.message;
             serData.loading=true;

           }

             console.log(serData.message);
         });
         socket.on('WeaponCount', function (data) {
           let serData=that.condition.serverDatas.filter(_=>_.child_server_id==data.serverId)[0]||{};
           // console.log('serData',serData);

           if(data.page==data.PageCount){
              that.loading=false;
              serData.message=data.message;
              serData.loading=false;
           }else{
             // console.log(data.message);
             serData.message=data.message;
             serData.loading=true;
           }
             console.log(serData.message);
         });

         socket.on('Role', function (data) {
             console.log(data);
         });
         socket.on('Pet', function (data) {
             console.log(data);
         });

       },getDataByInfo(){

        this.condition.serverIds=that.serverData.filter(_=>_.checkbox).map(_=>_.child_server_id);
        this.condition.serverDatas=that.serverData.filter(_=>_.checkbox).map(_=>_);

        if(0==this.condition.serverIds.length)return this.$message.warning('服务器列表数据不能为空');

        that.$confirm('抓取【详情数据】过程比较漫长可能1-30分钟，请勿重复抓取','抓取详情数据？', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {

        axios.post('/api/get/data/info',{
          server_ids:this.condition.serverIds,
          checkboxWeapon:false,
          checkboxAccouter:true,
          checkboxRole:false,
          checkboxPet:false,
        }).then(function (res) {
          if(200==res.data.status){

          }else{
            console.log(res.error);
          }
        }).catch(function (error) { console.log(error); });


       }).catch(() => {  });



      },getDataById(){
        //测试数据
        axios.get('/api/get/data/byId',{
          params:{

          }
        }).then(function (res) {
          if(200==res.data.status){

          }else{
            console.log(res.error);
          }
        }).catch(function (error) { console.log(error); });

      }

    }
})




})()
