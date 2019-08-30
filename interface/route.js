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

    },1000*30*ins,id)//设置服务器之间的间隔时间
  });

  res.send({
    status:200,
    error:''
  });

});

//仅供测试使用
router.get('/get/data/byId', function (req, res) {


    papaServers.GetItemInfoXMLByItemId(54316846)

    res.send({
      status:200,
      data:{},
      error:''
    });

});




  return router;
};








// module.exports=router;
