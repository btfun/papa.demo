module.exports ={
  ServerList:       'http://qibao.gyyx.cn/Navigation/ServerList/', //服务器列表

  RoleStr:'sex=%E4%B8%8D%E9%99%90&mainPoint=0&zhanLiLv=%E4%B8%8D%E9%99%90&level=&wudaoStage=%E4%B8%8D%E9%99%90&minTao=&maxTao=&minCon=&maxCon=&minWiz=&maxWiz=&minStr=&maxStr=&minDex=&maxDex=&minImmortal=&maxImmortal=&minMagic=&maxMagic=&minPrice=&maxPrice=&serverId=20&r=0.7291797768580983&time=&orderState=&readed=&itemTypeID=0&state=0&order=0&pageIndex=1&pageSize=15&itemState=&keyWord=',
  WeaponStr:'level=&minPrice=&maxPrice=&minHurt=&maxHurt=&minRebuildLevel=&maxRebuildLevel=&suitPolar=0&serverId=20&r=0.5467228835878317&time=&orderState=&readed=&itemTypeID=0&state=0&order=0&pageIndex=1&pageSize=15&itemState=&keyWord=',
  AccouterStr:'level=%E4%B8%8D%E9%99%90&minPrice=&maxPrice=&minHurt=&maxHurt=&minDefense=&maxDefense=&minBlood=&maxBlood=&minMagic=&maxMagic=&minSpeed=&maxSpeed=&minDodge=&maxDodge=&minRebuildLevel=&maxRebuildLevel=&suitPolar=0&serverId=20&retainIntimacy=%E4%B8%8D%E9%99%90&name=&polar=%E4%B8%8D%E9%99%90&r=0.6425663895187359&time=&orderState=&readed=&itemTypeID=0&state=0&order=0&pageIndex=1&pageSize=15&itemState=&keyWord=',
  PetStr:'name=&rank=%E4%B8%8D%E9%99%90&level=%E4%B8%8D%E9%99%90&capacityLevel=%E4%B8%8D%E9%99%90&minPrice=&maxPrice=&martial=%E4%B8%8D%E9%99%90&shape=%E4%B8%8D%E9%99%90&minMagPower=&maxMagPower=&minMaxLife=&maxMaxLife=&minSpeed=&maxSpeed=&minPhyPower=&maxPhyPower=&enchant=%E4%B8%8D%E9%99%90&eclosion=%E4%B8%8D%E9%99%90&magRebuildLevel=%E4%B8%8D%E9%99%90&phyRebuildLevel=%E4%B8%8D%E9%99%90&morphLifeTimes=%E4%B8%8D%E9%99%90&morphMagTimes=%E4%B8%8D%E9%99%90&morphManaTimes=%E4%B8%8D%E9%99%90&morphPhyTimes=%E4%B8%8D%E9%99%90&morphSpeedTimes=%E4%B8%8D%E9%99%90&isCrossServer=0&serverId=20&retainIntimacy=%E4%B8%8D%E9%99%90&eclosionRank=%E4%B8%8D%E9%99%90&zhanliLv=%E4%B8%8D%E9%99%90&r=0.805428854681574&time=&orderState=&readed=&itemTypeID=0&state=0&order=0&pageIndex=1&pageSize=15&itemState=&keyWord=',

  //公共参数： itemTypeID: 0,state: 0,order: 0,pageIndex: 1,pageSize: 15
  RoleItemList:     'http://qibao.gyyx.cn/AdvancedSearch/RoleItemList',     //角色列表 {ItemInfoCode}
  WeaponItemList:   'http://qibao.gyyx.cn/AdvancedSearch/WeaponItemList',   //武器列表 {ItemInfoCode}
  AccouterItemList: 'http://qibao.gyyx.cn/AdvancedSearch/AccouterItemList', //装备列表 {ItemInfoCode}
  PetItemList:      'http://qibao.gyyx.cn/AdvancedSearch/PetItemList',      //宠物查询列表{ItemInfoCode}
  //
  GetItemInfoXMLByItemId: 'http://qibao.gyyx.cn/Buy/GetItemInfoXMLByItemId/{ItemInfoCode}', //物品属性详情

  //serverId: 9,itemType: 0角色 1 武器 2装备
  ItemRecommendList:      'http://qibao.gyyx.cn/AdvancedSearch/ItemRecommendList' //左侧推荐列表
}
