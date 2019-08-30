var dbUtil = require('./dbUtil');
var Schema = dbUtil.Schema;

/***
 * 创建各类model
 * 
 * 
 *  */

//创建 服务器列表数据 model
var DataServer= new Schema({
    date: { type: Date, default: Date.now },
    author: { type: String, default: "Ser"},
    server_id: Number,
    server_name: String,
    child_server_id: Number,
    child_server_name: String
 }, { versionKey: false });//去掉版本控制 筛选


 module.exports={
   Schema: Schema,
    dataServerModel: dbUtil.model('Server',DataServer),
   //  dataRoleModel: dbUtil.model('Role',DataRole),
 }
 