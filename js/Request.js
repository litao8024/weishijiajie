//定义服务器地址
//var hostDomain = "http://43.254.3.166:8080";
var hostDomain = "http://sdms.ecsits.com";
//网络请求方法
//url		请求的子路经和参数（News?item=最新&pageIndex=1）
//callback	回调函数
function HttpRequest (url, callback) {
	//拼接成完整的URL
	var hURL = hostDomain + url
	mui.ajax(hURL,{
		dataType:'json',
		type:'get',
		timeout:10000,
		beforeSend: function() {
			mui.plusReady(function(){
				plus.nativeUI.showWaiting();
			})
		},
		complete:function(){
			mui.plusReady(function(){
				plus.nativeUI.closeWaiting();
			})
		},
		success:function (data) {
			//responeText
			//回调，传json数据
			callback(data);
		},
		error:function (xhr, type, error) {
			console.log(JSON.stringify(xhr))
			console.log(JSON.stringify(type))
			console.log(JSON.stringify(error))
			if(JSON.stringify(type) == 'abort'){
				mui.toast('您的网络未连接或信号不好！')
			}
		}
	});
}
function ajax(url,data,callback){
	var hURL = hostDomain + url
	console.log(JSON.stringify(data))
	mui.ajax(hURL,{
		data:data,
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		beforeSend: function() {
			mui.plusReady(function(){
				plus.nativeUI.showWaiting();
			})
		},
		complete:function(){
			mui.plusReady(function(){
				plus.nativeUI.closeWaiting();
			})
		},
		success:callback,
		error:function(xhr,type,error){
			console.log(JSON.stringify(xhr))
			console.log(JSON.stringify(type))
			console.log(JSON.stringify(error))
			if(JSON.stringify(type) == 'abort'){
				mui.toast('您的网络未连接或信号不好！')
			}
		}
	});
}