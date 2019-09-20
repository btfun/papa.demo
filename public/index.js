(function(){

var that;
var dataRoleModel={};
var dataWeaponModel={};
var dataAccouterModel={};
var dataPetIModel={};
var socket = io.connect('//127.0.0.1:5010/');
socket.on('disconnect', function() {
  console.log('长连接已断开')
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
      types:['Accouter','Weapon','Role','Pet'],
      serverCheckboxAll:false,
      serverData:[],
      serverConditionData:[],
      condition:{
        serverDatas:[],
        serverIds:[]
      },
      showTips:false,
      conditionSearchData:[],

    },
    created(){
        that=this
        this.getServerData()
        this.socketOn()
        //查询内容展示列表
        let titles=sessionStorage.getItem('conditionSearchData');
        if(titles){
          that.conditionSearchData=JSON.parse(titles);
          setTimeout(()=>{
            that.serverConditionData.forEach((_)=>{
              _.checkbox=that.conditionSearchData.some(c=>c.child_server_id==_.child_server_id);
            })
          },1000)
        }

    },
    methods:{ 
      changeSearch(item){

        if(!that.conditionSearchData.some(_=>_.child_server_id==item.child_server_id)){
          that.conditionSearchData.push(item)
        }
        console.log(item.child_server_id)
        //勾选查询数据 不勾选则隐藏数据
        if(item.checkbox && 0==item.titles.length)that.getDataById(item)

      },
      changeAll(val){
        that.serverData.forEach((item)=>{
          item.checkbox=val;
        })
      }, changeChild(ite){
          this.serverCheckboxAll=that.serverData.every(_=>_.checkbox);
      }, getRemotServerData(){
        axios.get('/api/remot/server/data').then(function (res) {
          if(200==res.data.status){
              this.$message.success('正在抓取');
              setTimeout(()=>{
                that.getServerData()
              },2000)
          }else{
            console.log(res.error);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getServerData(){
            axios.get('/api/get/server/data').then(function (res) {
              if(200==res.data.status){

                (res.data.data||[]).forEach((item)=>{
                  item.checkbox=false;
                  item.loading=false;
                  item.message='';
                  item.titles=[];
                })
                that.serverData=res.data.data;
                that.serverConditionData=JSON.parse(JSON.stringify(that.serverData));
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
               checkboxWeapon: that.checkboxWeapon,
               checkboxAccouter: that.checkboxAccouter,
               checkboxRole: that.checkboxRole,
               checkboxPet: that.checkboxPet,
             }).then(function (res) {
               if(200==res.data.status){

               }else{
                 console.log(res.error);
               }
             }).catch(function (error) { console.log(error); });

         }).catch(() => { this.showTips=false; });


       },socketOn(){
         function gy(data){
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
         }


        that.types.forEach((_)=>{
          //列表抓取的监听
          socket.on(_+'Count', function (data) {
            gy(data)
          });
          //详情抓取的监听
          socket.on(_+'InfoCount', function (data) {
              console.log(data);
          });
        })

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
          server_ids: this.condition.serverIds,
          checkboxWeapon: that.checkboxWeapon,
          checkboxAccouter: that.checkboxAccouter,
          checkboxRole: that.checkboxRole,
          checkboxPet: that.checkboxPet,
        }).then(function (res) {
          if(200==res.data.status){

          }else{
            console.log(res.error);
          }
        }).catch(function (error) { console.log(error); });


       }).catch(() => {  });



      },getDataById(parms){

        //测试数据
        axios.get('/api/get/data/byId',{
          params:{
            serverId: parms.child_server_id
          }
        }).then(function (res) {
          if(200==res.data.status){
            console.log(res.data);

            let data=res.data.data;

            data.titles.forEach((item)=>{
              let lis=item.child.map(_=>_.CurrentItemPrice);
              console.log(item);
              item.child=item.child.sort(function(a,b){
                return a.ItemLevel>b.ItemLevel?1:-1;
              });
              item.child=item.child.sort(function(a,b){
                return a.ItemLevel==b.ItemLevel && a.CurrentItemPrice> b.CurrentItemPrice ? 1:-1;
              });

              item.max=Math.max.apply(null,lis);
              item.min=Math.min.apply(null,lis);

            })

            parms.titles=data.titles
            sessionStorage.setItem('conditionSearchData',JSON.stringify(that.conditionSearchData))
            // that.content.datas
 
          }else{
            console.log(res.error);
          }
        }).catch(function (error) { console.log(error); });

      }

    }
})




})()
