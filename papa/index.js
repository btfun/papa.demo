
const request = require('request');
const cheerio = require('cheerio');
var serverConf = require('../conf/serverConf');
var util = require('./util');
var mongoose = require('./dbUtil');
var Schema = mongoose.Schema;

//创建 服务器列表数据 model
var DataServer= new Schema({
    date: { type: Date, default: Date.now },
    author: { type: String, default: "Ser"},
    server_id: Number,
    server_name: String,
    child_server_id: Number,
    child_server_name: String
 }, { versionKey: false });//去掉版本控制 筛选

let dataServerModel= mongoose.model('Server',DataServer);

var dataRoleModel={};
var dataWeaponModel={};
var dataAccouterModel={};
var dataPetIModel={};

let dataInfoModel= {};

const serverId=20;
let headers={
  'Cookie':'PageVisitGuid=a44a5da9-235a-4589-8498-b662feab5b1d; Hm_lvt_c112d6915349a26b3bbd87424a332a4f=1564884906; AnimationCookie=0|serverList; QiBaoCookie=e11a9b30-dd11-48dd-b7af-e507b1ac10a9|W|20|0; RecentServerCookie=N3zlj4znur/kuozljLp8MjB85Y2O5bGx6K665YmR; Hm_lpvt_c112d6915349a26b3bbd87424a332a4f=1564884921; GY-Log-ID=IbIRJr-abff534c3fa5d-020-7JN7vy-19725',
  'Host':'qibao.gyyx.cn',
  'Referer':'http://qibao.gyyx.cn/Buy/Index/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36'
};



 module.exports = function(io){
let socket;
const pageSize=80;

  io.on('connection', function (socketP) {
      console.log('链接成功。。订单。。。。。。。' );
      socket=socketP;
  });

const app={
  init(){

    // this.ServerList()

    // this.getWeaponItemList() //武器
    // this.getAccouterItemList()//装备
    // this.GetItemInfoXMLByItemId(54316846);
    // this.getRoleItemList() //角色暂时不抓取
    // this.getPetItemList()  //暂时不抓取
  },ServerList(){
    //抓取服务器列表数据
    dataServerModel.remove({author: "Ser"}, function(err, docs){
        if(err) console.log(err);
        console.log('删除成功：' + docs);
        app.getServerListData();
    })
  },getServerListData(){

    //抓取服务器列表数据
    request.get(serverConf.ServerList,function (error, response, body){
      if(error)return console.error(error);
      if(200==response.statusCode){
          const $ = cheerio.load(body);
          var list=[];
          $('#js_server .tb_tbody').each(function(i, item) {
            $(item).find('a').each(function(n,elem){
                if($(elem).text()){
                      list.push({
                        server_id: $(elem).attr('data-aid'),
                        server_name: $(elem).attr('data-aname'),
                        child_server_id: $(elem).attr('data-sid'),
                        child_server_name: $(elem).text()
                      })
                }
            })
          });

          dataServerModel.insertMany(list, function(err, docs){
                  if(err) console.log(err);
                  console.log('保存服务器列表成功：' + docs);
          });
          // console.log(  $('#js_server .tb_tbody').html() )
      }

    })

  },getRoleItemList(page, serverId){
    /***
     * 角色列表
     *
     * */
      page=page||1;

      let objss=util.paramToObject(serverConf.RoleStr)

      let objss2=Object.assign(objss,{
        serverId:serverId,
        pageIndex: page,
        pageSize: pageSize
      }) ;

    request({
      url:serverConf.RoleItemList+'?'+util.objectToParam(objss2),
      method: 'GET',
      headers: headers,
      qs:{ }
    },function (error, response, body){
      if(error)return console.error(error);
      if(200==response.statusCode && body){
        let data=JSON.parse(body)


        if(data.Data && data.Data.length>0){

          if(0==Object.keys(dataRoleModel).length){
            let item=data.Data[0];
            let obj={};
            for (const key in item) {
               obj[key]=typeof(item[key])
            }
            var DataRole= new Schema(Object.assign(obj,{
              date: { type: Date, default: Date.now },
              author: { type: String, default: "Ser"},
              info:{ type: String, default: '' }
            }), { versionKey: false });//去掉版本控制 筛选

            try{
              console.log('你大爷')
              dataRoleModel= mongoose.model('Role');
            }catch(e){
              console.log('你大妈')
              dataRoleModel= mongoose.model('Role',DataRole);
            }

            // dataRoleModel= mongoose.model('Role',DataRole);

          }


          dataRoleModel.insertMany(data.Data, function(err, docs){
            if(err) console.log(err);
            console.log(`第${page}页 角色数据保存成功，共${data.PageCount}页${data.TotalCount}条数据`);
            if( page+1 <= data.PageCount){
              setTimeout(()=>{
                  app.getRoleItemList(page+1, serverId)
              },100 * Math.ceil(Math.random()*10) );

            }else{
              console.log('数据保存完毕！！');
              socket.emit('Role', {serverId: serverId, message: '数据保存完毕！！' });
            }
          });
        }
      }

    })

  },getWeaponItemList(page, serverId){
  /***
   * 武器列表
   *
   * */
    page=page||1;

    let objss=util.paramToObject(serverConf.WeaponStr)

    let objss2=Object.assign(objss,{
      serverId:serverId,
      pageIndex: page,
      pageSize: pageSize
    }) ;

    request({
      url:serverConf.WeaponItemList+'?'+util.objectToParam(objss2),
      method: 'GET',
      headers: headers,
      qs:{ }
    },function (error, response, body){
      if(error)return console.error(error);
      if(200==response.statusCode && body){
        let data=JSON.parse(body)


        if(data.Data && data.Data.length>0){

          if(0==Object.keys(dataWeaponModel).length){
            let item=data.Data[0];
            let obj={};
            for (const key in item) {
              obj[key]=typeof(item[key])
            }
            var DataRole= new Schema(Object.assign(obj,{
              date: { type: Date, default: Date.now },
              author: { type: String, default: "Ser"},
              info:{ type: String, default: '' }
            }), { versionKey: false });//去掉版本控制 筛选

            try{
              console.log('你大爷')
              dataWeaponModel= mongoose.model('Weapon')
            }catch(e){
              console.log('你大妈')
              dataWeaponModel= mongoose.model('Weapon',DataRole)
            }

            // dataWeaponModel= mongoose.model('Weapon',DataRole)
          }
          console.log(dataWeaponModel,'dataWeaponModel???')

          dataWeaponModel.insertMany(data.Data, function(err, docs){
            if(err) return console.log(err);

            console.log(`第${page}页 武器数据保存成功，共${data.PageCount}页${data.TotalCount}条数据`);
            socket.emit('WeaponCount', {
                     serverId: serverId,
                     page: page,
                     PageCount: data.PageCount,
                     TotalCount: data.TotalCount,
                     message: `第${page}页 武器数据保存成功，共${data.PageCount}页${data.TotalCount}条数据`
                   });

            if( page+1 <= data.PageCount){
              setTimeout(()=>{
                  app.getWeaponItemList(page+1, serverId)
              },100 * Math.ceil(Math.random()*10) );

            }else{
              console.log('数据保存完毕！！');
              socket.emit('Weapon', {serverId: serverId, message: '数据保存完毕！！' });
            }
          });
        }
      }
    })

  },getAccouterItemList(page, serverId){
  /***
   * 装备列表
   *
   * */
    page=page||1;

    let objss=util.paramToObject(serverConf.AccouterStr)

    let objss2=Object.assign(objss,{
      serverId:serverId,
      pageIndex: page,
      pageSize: pageSize
    }) ;

    request({
      url:serverConf.AccouterItemList+'?'+util.objectToParam(objss2),
      method: 'GET',
      headers: headers,
      qs:{ }
    },function (error, response, body){
      if(error)return console.error(error);
      if(200==response.statusCode && body){
        let data=JSON.parse(body)


        if(data.Data && data.Data.length>0){

          if(0==Object.keys(dataAccouterModel).length){
            let item=data.Data[0];
            let obj={};
            for (const key in item) {
              obj[key]=typeof(item[key])
            }

            console.log(obj,'-=-=-=')

            var DataRole= new Schema(Object.assign(obj,{
              date: { type: Date, default: Date.now },
              author: { type: String, default: "Ser"},
              info:{ type: String, default: '' }
            }), { versionKey: false });//去掉版本控制 筛选
            try{
              console.log('你大爷')
              dataAccouterModel= mongoose.model('Accouter')
            }catch(e){
              console.log('你大妈')
              dataAccouterModel= mongoose.model('Accouter',DataRole)
            }
            // dataAccouterModel= mongoose.model('Accouter',DataRole)
          }


          dataAccouterModel.insertMany(data.Data, function(err, docs){
            if(err) return console.log(err);
            console.log(`第${page}页 装备数据保存成功，共${data.PageCount}页${data.TotalCount}条数据`);
            socket.emit('AccouterCount', {
                     serverId: serverId,
                     page: page,
                     PageCount: data.PageCount,
                     TotalCount: data.TotalCount,
                     message: `第${page}页 装备数据保存成功，共${data.PageCount}页${data.TotalCount}条数据`
                   });

            if( page+1 <= data.PageCount){
              setTimeout(()=>{
                  app.getAccouterItemList(page+1, serverId)
              },100 * Math.ceil(Math.random()*10) );
            }else{
              console.log('数据保存完毕！！');
              socket.emit('Accouter', {serverId: serverId, message: '数据保存完毕！！' });
            }
          });
        }
      }
    })

  },getPetItemList(page, serverId){
 /***
   * 宠物查询列表
   *
   * */
    page=page||1;

    let objss=util.paramToObject(serverConf.PetStr)

    let objss2=Object.assign(objss,{
      serverId:serverId,
      pageIndex: page,
      pageSize: pageSize
    }) ;

    request({
      url:serverConf.PetItemList+'?'+util.objectToParam(objss2),
      method: 'GET',
      headers: headers,
      qs:{ }
    },function (error, response, body){
      if(error)return console.error(error);
      if(200==response.statusCode && body){
        let data=JSON.parse(body)


        if(data.Data && data.Data.length>0){

          if(0==Object.keys(dataPetIModel).length){
            let item=data.Data[0];
            let obj={};
            for (const key in item) {
              obj[key]=typeof(item[key])
            }
            var DataRole= new Schema(Object.assign(obj,{
              date: { type: Date, default: Date.now },
              author: { type: String, default: "Ser"},
              info:{ type: String, default: '' }
            }), { versionKey: false });//去掉版本控制 筛选
            try{
              console.log('你大爷')
              dataPetIModel= mongoose.model('Pet')

            }catch(e){
              console.log('你大妈')
              dataPetIModel= mongoose.model('Pet',DataRole)
            }
            // dataPetIModel= mongoose.model('Pet',DataRole)
          }

          dataPetIModel.insertMany(data.Data, function(err, docs){
            if(err) console.log(err);
            console.log(`第${page}页 宠物数据保存成功，共${data.PageCount}页${data.TotalCount}条数据`);
            socket.emit('PetCount', {
                     serverId: serverId,
                     page: page,
                     PageCount: data.PageCount,
                     TotalCount: data.TotalCount,
                     message: `第${page}页 装备数据保存成功，共${data.PageCount}页${data.TotalCount}条数据`
                   });

            if( page+1 <= data.PageCount){
              setTimeout(()=>{
                  app.getPetItemList(page+1, serverId)
              },100 * Math.ceil(Math.random()*10) );

            }else{
              console.log('数据保存完毕！！');
              socket.emit('Pet', {serverId: serverId, message: '数据保存完毕！！' });
            }
          });

        }
      }
    })

  },
  ///////////////////////
    GetItemInfoXMLByItemId(serId, modelName, id,fn1,fn2){

    request({
      url:serverConf.GetItemInfoXMLByItemId.replace('{ItemInfoCode}',id),
      method: 'GET',
      headers: headers,
      qs:{ }
    },function (error, response, body){
      if(error)return console.error(error);
      if(200==response.statusCode && body){
        const $ = cheerio.load(body);
        // console.log(body)

        let $child=$('attribs').children();
        let obj={};
        let data={};

        $child.toArray().forEach(element => {
          // console.log('>>>>>>>GetItemInfoXMLByItemId>>>>>>',element.name )
            if(element.name=='attrib'){
                //解析属性
                if(!data[element.name]){
                    data[element.name]=[];
                }
                // if('green'==$(element).attr('color')){
                  let attr={
                    color: $(element).attr('color'),
                    value: Number($(element).text()),
                    type: $(element).attr('type')
                  };
                  data[element.name].push(attr);
                // }
            }else{
              //直接解析
              data[element.name]=$(element).text();
            }
        });

        //保存原始数据 列表数据以字符串形式保存
        data.info=encodeURIComponent(body);
        if(data.attrib)data.attrib=(JSON.stringify(data.attrib));

        //
        for (const key in data) {

          if( !Number.isNaN(Number(data[key])) ){
            obj[key]=Number;
            data[key]=Number(data[key]);
          }else{
            if(key=='attrib'){
              obj[key]=[{
                color: String,
                value: Number,
                type: String
              }]
            }else{
              obj[key]=typeof(data[key]);
            }

          }
        }

        // console.log('obj==',obj,data);

        // var DataRole= new Schema(Object.assign(obj,{
        //   ServerCode: Number,
        //   ItemInfoCode: Number,
        //   info: String,
        // }), { versionKey: false });//去掉版本控制 筛选

        var DataRole= new Schema({
          ServerCode: Number,
          ItemInfoCode: Number,
          info: String,
        }, { versionKey: false });//去掉版本控制 筛选

        console.log(modelName, 'info========',{ServerCode: serId, ItemInfoCode: id});

        if(!dataInfoModel[modelName]){
            try{
              console.log('你大爷')
              dataInfoModel[modelName]= mongoose.model(modelName);

            }catch(e){
              console.log('你大妈')
              dataInfoModel[modelName]= mongoose.model(modelName,DataRole);
            }
        }


        let search={ServerCode: serId, ItemInfoCode: id};
     

        dataInfoModel[modelName].find(search, function(err, datalist){
          console.log(err,'find:-11111111111--' ,datalist.length);
        });
        dataInfoModel[modelName].update(search, {info: (JSON.stringify(data)) }, {multi: true}, function(err, docs){
             if(err)return  fn2 && fn2(err);
             
            console.log(`${!!docs.ok?'成功':'失败'}`,'更改：' , docs);

            dataInfoModel[modelName].find(search, function(err, datalist){
              console.log(err,'find:---' , search, datalist[0].info);
            })

            // socket.emit(`${modelName}InfoCount`, {
            //          serverId: serId,
            //          ItemInfoCode: id,
            //          status:200
            //        });

             fn1 && fn1(docs);
        })
 
        // dataInfoModel[modelName].updateMany({ServerCode: serId, ItemInfoCode: id},
        //   { $set:{info: JSON.stringify(data)} }, function(err, datalist){
        //     if(err)return  fn2 && fn2(err);
        //     console.log(`${!!datalist.ok?'成功':'失败'}`,'更改：' , datalist);

        //     console.log('update：' ,datalist);
        //     fn1 && fn1(datalist);
        // });


      }


    })


  },getListByServerCode(serverId,type,fn){
    //有用
      var DataRole= new Schema({}, { versionKey: false });
      let  dataInfoModel;
      // let  dataInfoModel= mongoose.model(type,DataRole);
      try{
        dataInfoModel= mongoose.model(type);
      }catch(e){
        dataInfoModel= mongoose.model(type,DataRole);
      }

      dataInfoModel.find({'ServerCode': serverId}, function(err, datalist){
          if(err)return  fn && fn(err);
          fn && fn(datalist)
      });

  },getServerList(fn){
    // 查询服务器列表数据
      dataServerModel.find({author: "Ser"}, function(err, docs){
        fn && fn(err,docs);

    })

  },getTestItemInfoXMLByItemId(fn){

    let data={
      name:'草拟祖宗28代??狗杂?尼玛?380代？？===',
      age:288,
      sex:'女'
    };
    let search={ServerCode: 368 };
  
    var DataRole= new Schema({
      // ServerCode: Number,
      // ItemInfoCode: Number,
      info: String,//必须有
    }, { versionKey: false });//去掉版本控制 筛选

    let modelName='Accouter';
  
    if(!dataInfoModel[modelName]){
        try{
          console.log('你大爷')
          dataInfoModel[modelName]= mongoose.model(modelName);
        }catch(e){
          console.log('你大妈')
          dataInfoModel[modelName]= mongoose.model(modelName,DataRole);
        }
    }
  
    dataInfoModel[modelName].find(search, { }, function(err, datalist){

      // console.log(err,'find:---' ,datalist);
      fn && fn(datalist)
    })

  
    // dataInfoModel[modelName].update(search, {info: JSON.stringify(data) }, {multi: true}, function(err, docs){
    //      if(err)console.log('error' , err);
    //     console.log('更改成功：' , docs);
    //     dataInfoModel[modelName].find(search, function(err, datalist){
          
    //       // let data=JSON.parse(JSON.stringify(datalist));
    //       console.log(err,'find:---' ,datalist[0].info);
    //     })
  
    // })
   

  }



}

// app.init();



/* 必选查询条件
*  level: 不限， 60-69， 100-129
*  suitPolar: 0
*  serverId: 9
*  itemTypeID: 0
*  state: 0
*  order: 0
*  pageIndex: 1
*  pageSize: 15
*
*/

//查询所有Model中Server所有数据
// dataServerModel.find({author: "Ser"}, function(err, datalist){
//     if(err)return console.log(err);
//
//     console.log('查询所有：' ,datalist);
// })



  return app;
}
