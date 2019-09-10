
> 分类采集初步数据 放到数据库store
  设置筛选条件多条多类型多属性 过滤初步筛选数据后存储到新的数据库 filter
  自主分析筛选 同类型同等级的属性和价格 属性越好价格越低 越有购买价值

  第一步：采集存储数据
  第二部：设计筛选条件
  第三部：设计自动分析算法
  第四部：列出筛选结果

第一次
mongoose.model('xx',Schema({
    server_id: Number,
    server_name: String,
    info: String,
}))
第二次
mongoose.model('xx')
直接更新 info 这个值 不生效 查找能找到对应的数据 用的多条更新{multi: true}
