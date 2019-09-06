var express = require('express');
var router = express(); // the main router
// var dataModel = require('../papa/dataModel');
// var dataServerModel=dataModel.dataServerModel;


module.exports=function(io){
var papaServers = require('../papa/index')(io);

router.get('/remot/server/data', function (req, res) {

  papaServers.ServerList((error,data)=>{
    if(error)return res.send({ status:400, error:err });
  })

  res.send({ status:200, error:'' });
});

router.get('/get/server/data', function (req, res) {

  papaServers.getServerList((error,data)=>{
    if(error)return res.send({ status:400, error:err });

    res.send({ status:200, data:data, error:'' });
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
            data.forEach((ite,index)=>{
              if(!ite.info){
                //没有详情的时候才抓取
                setTimeout((item)=>{
                  item=JSON.parse(JSON.stringify(item));
                  console.log(_id , item.ItemInfoCode ,item.info)
                  if(item.ItemInfoCode && (!item.info || !Object.keys(item.info).length ) ){
                    console.log('开始抓取',_id , item.ItemInfoCode ,item.info)
                    papaServers.GetItemInfoXMLByItemId(_id,'Weapon', item.ItemInfoCode,(success)=>{
                      console.log('success')
                    },(error)=>{
                      console.log('error==',error)
                    })
                  }
                },500 * index, ite)
              }
            })
          }else{
            socket.emit(`WeaponInfoCount`, { status: 404 });
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
                item=JSON.parse(JSON.stringify(item));
                console.log(_id , item.ItemInfoCode ,item.info)
                if(item.ItemInfoCode && (!item.info || !Object.keys(item.info).length ) ){
                  console.log('开始抓取',_id , item.ItemInfoCode ,item.info)
                  papaServers.GetItemInfoXMLByItemId(_id,'Accouter', item.ItemInfoCode,(success)=>{
                    console.log('success')
                  },(error)=>{
                    console.log('error==',error)
                  })
                }
              },500 * index, ite)
            }
          })

        }else{
          socket.emit(`AccouterInfoCount`, { status: 404 });
        }

      })
    }
    if(checkboxPet){
      papaServers.getListByServerCode(_id,'Pet', (data)=>{
        console.log('pet',data.length)
        if(data && data.length>0){
          data.forEach((ite,index)=>{
            if(!ite.info){
              //没有详情的时候才抓取
              setTimeout((item)=>{
                item=JSON.parse(JSON.stringify(item));
                console.log(_id , item.ItemInfoCode )
                if(item.ItemInfoCode && (!item.info || !Object.keys(item.info).length )){
                  console.log('开始抓取',_id , item.ItemInfoCode ,item.info)
                  papaServers.GetItemInfoXMLByItemId(_id,'pet', item.ItemInfoCode,(success)=>{
                    console.log('success')
                  },(error)=>{
                    console.log('error==',error)
                  })
                }
              },500 * index, ite)
            }

          })
        }else{
          socket.emit(`PetInfoCount`, { status: 404 });
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

const request = require('request');
var serverConf = require('../conf/serverConf');
var mongoose = require('../papa/dbUtil');
var Schema = mongoose.Schema;

let dataInfoModel= {};

//仅供测试使用
router.get('/get/data/byId',  function (req, res) {

 function init001(ms){
    return new Promise(function(resolve, reject){
      setTimeout(()=>{
        console.log('=====>>',ms)
        resolve({ data: 'success' })
      },ms*100)
    });

  }
  let data={
    name:'你大爷的???',
    age:288,
    sex:'女'
  };
  let search={ServerCode: 368, ItemInfoCode: 54744052};

  var DataRole= new Schema({
    ServerCode: Number,
    ItemInfoCode: Number,
    info: Object,
    name: String,
    age: Number,
    sex: String
  }, { versionKey: false });//去掉版本控制 筛选
  let modelName='oop';

  if(!dataInfoModel[modelName]){
      try{
        dataInfoModel[modelName]= mongoose.model(modelName);
      }catch(e){
        dataInfoModel[modelName]= mongoose.model(modelName,DataRole);
      }
  }

  // dataInfoModel[modelName].insertMany([
  //   {
  //     ServerCode: 368,
  //     ItemInfoCode: 54744052,
  //     info:{},
  //     name:'你大爷的',
  //     age:28,
  //     sex:'女'
  //   }
  // ], function(err, docs){
  //   if(err) console.log(err);
  //   console.log('更改成功：' , docs);
  // });

  dataInfoModel[modelName].find(search, function(err, datalist){
    console.log(err,'find:---' ,datalist.length);
  })

  dataInfoModel[modelName].update(search, {info: data}, {multi: true}, function(err, docs){
       if(err)console.log('error' , err);

      console.log('更改成功：' , docs);
  })
    // papaServers.GetItemInfoXMLByItemId(54039205,(success)=>{
    //       res.send({
    //         status:200,
    //         data: success,
    //         error:''
    //       });
    // },(error)=>{
    //       res.send({
    //         status:400,
    //         data:{},
    //         error: error
    //       });
    // })
console.log('success===');

          res.send({
            status:200,
            data: 'success',
            error:''
          });

});




  return router;
};








// module.exports=router;
