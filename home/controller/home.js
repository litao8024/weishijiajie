mui.init();
//仿IOS弹动效果
mui('.mui-scroll-wrapper').scroll({
	deceleration:0.0005
})
//项目详情
mui('.mui-table-view-cell').on('tap','.project',function(){
	alert(this.getAttribute("index"))
	mui.openWindow({
		url:"../view/myOrderList.html",
		id:"../view/myOrderList.html",
	})
})
mui('.NewList').on('tap','.ul',function(){
	alert("om")
	mui.openWindow({
		url:"../view/myOrderList.html",
		id:"../view/myOrderList.html",
	})
})
//点击登陆
document.getElementById('login').addEventListener('tap',function(){
	mui.openWindow({
		url:"../../login.html",
		id:"../../login.html",
		show: {  
	        autoShow: true, //页面loaded事件发生后自动显示，默认为true  
	        aniShow: 'slide-in-bottom', //页面显示动画，默认为”slide-in-right“；  
	        duration: 400 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
	    },
	})
	var detailPage = null;
	if (!detailPage) {
		detailPage = plus.webview.getWebviewById('mine/view/mine.html');
	}
	mui.fire(detailPage,'mine',{
		id:'mine'
	})
})

var url = 'http://43.254.3.166/index.php/app_api/api/login';
var data = {username:"18335929560",password:"12345678"}
ajax('http://43.254.3.166/index.php/app_api/api/login',data,function(data){
	console.log(JSON.stringify(data))
})