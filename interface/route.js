var express = require('express');
var router = express(); // the main router
var dataModel = require('../papa/dataModel');
var dataServerModel=dataModel.dataServerModel;


module.exports=function(io){
var papaServers = require('../papa/index')(io);

router.get('/get/server/data', function (req, res) {

    // 查询服务器列表数据
    dataServerModel.find({author: "Ser"}, function(err, docs){
      if(err){
        res.send({ status:400, error:err });
      }else{
        res.send({ status:200, data:docs, error:'' });
      }
  })

});

/**
* 根据服务器ID列表获取对应的数据
* server_ids
***/
router.post('/get/data', function (req, res) {
  let ids=req.body.server_ids||[];

  let checkboxWeapon=req.body.checkboxWeapon||false;
  let checkboxAccouter=req.body.checkboxAccouter||false;
  let checkboxRole=req.body.checkboxRole||false;
  let checkboxPet=req.body.checkboxPet||false;

  console.log(checkboxWeapon,checkboxAccouter,checkboxRole,checkboxPet);

  ids.forEach((id,ins)=>{
    setTimeout((_id)=>{

      if(checkboxWeapon)papaServers.getWeaponItemList(1, id, io);
      if(checkboxAccouter)papaServers.getAccouterItemList(1,id, io);
      if(checkboxRole)papaServers.getRoleItemList(1,id, io);
      if(checkboxPet)papaServers.getPetItemList(1,id, io);

    },1000*20*ins,id)//设置服务器之间的间隔时间
  });

  res.send({
    status:200,
    error:''
  });

});

router.post('/get/data/info', function (req, res) {
  let ids=req.body.server_ids||[];
 //查询某个服务器中的装备数据列表 获得id列表
 let checkboxWeapon=req.body.checkboxWeapon||false;
 let checkboxAccouter=req.body.checkboxAccouter||false;

 let checkboxRole=req.body.checkboxRole||false;
 let checkboxPet=req.body.checkboxPet||false;

 ids.forEach((id,ins)=>{


   setTimeout((_id)=>{
    if(checkboxWeapon){
      papaServers.getListByServerCode(_id,'Weapon', (data)=>{
          console.log('Weapon',data.length)
          if(data && data.length>0){

          }
          // length.ItemInfoCode
      })
    }
    if(checkboxAccouter){
      papaServers.getListByServerCode(_id,'Accouter', (data)=>{
        console.log('Accouter',data.length)
        if(data && data.length>0){

          data.forEach((ite,index)=>{
            if(!ite.info){
              //没有详情的时候才抓取
              setTimeout((item)=>{
                // console.log('开始抓取',item.ItemInfoCode)

                item=JSON.parse(JSON.stringify(item));
                console.log('开始抓取',_id , item.ItemInfoCode )

                if(item.ItemInfoCode){
                  papaServers.GetItemInfoXMLByItemId(_id,'Accouter', item.ItemInfoCode,(success)=>{
                    console.log('success')
                  },(error)=>{
                    console.log('error==',error)
                  })
                }


              },1000 * index, ite)
            }

          })
        }

      })
    }


   },1000*30*ins,id)//设置服务器之间的间隔时间
 });

 res.send({
   status:200,
   error:''
 });


});


//仅供测试使用
router.get('/get/data/byId', function (req, res) {


    papaServers.GetItemInfoXMLByItemId(54039205,(success)=>{
          res.send({
            status:200,
            data: success,
            error:''
          });
    },(error)=>{
          res.send({
            status:400,
            data:{},
            error: error
          });
    })


});




  return router;
};








// module.exports=router;
