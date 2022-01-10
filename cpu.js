var fork=require('child_process').fork;
var cpus=require('os').cpus();
for(var i=0;i<cpus.length;i++){
  fork('./index.js') // 根据当前机器上的CPU数量赋值相应的node进程
}