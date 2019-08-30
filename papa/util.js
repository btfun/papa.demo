module.exports = {
    paramToObject(str){
        let strs=str.split('&');
        let obj={};
        strs.forEach(elem => {
            let [name,val]=elem.split('=');
            obj[name]=decodeURIComponent(val);
        });
        return  obj
    },
    objectToParam(obj){
        let list=[];
        for (const key in obj) {
            list.push(key+'='+obj[key])
        }
        return list.join('&')
    }
}