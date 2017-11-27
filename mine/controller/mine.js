mui.init({
	keyEventBind:{
		backbutton:false
	}
});
window.addEventListener('mine',function(){
	window.location.reload();
})
var dpiW = screen.width;//获取屏幕分辨率
var dpiH = screen.height;
//设置headerView的宽高
document.getElementsByClassName('headerView')[0].style.height = (dpiW/375*210)+'px';
document.getElementsByClassName('headImg')[0].style.marginTop = (dpiW/375*210)/2-30+'px';
document.getElementsByClassName('mui-scroll')[0].style.minHeight = screen.height - 114 + 'px';
//仿IOS滑动效果
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});
//头像 名称
HttpRequest('/manage/phone/user',function(data){
	console.log(JSON.stringify(data));
	document.getElementById('user_name').innerHTML = data.name;
})
//编辑页面的跳转
mui('.editImg')[0].addEventListener('tap',function(){
	console.log('sss');
	mui.openWindow({
    url: 'myInfo.html',
    id: 'myInfo',
    styles: {
        top: '0px', //新页面顶部位置
        bottom: '0px', //新页面底部位置
        width: '100%', //新页面宽度，默认为100%
        height: '100%', //新页面高度，默认为100%
    },
    extras: {
//	        ..... //自定义扩展参数，可以用来处理页面间传值 
    },
    show: {
        autoShow: true, //页面loaded事件发生后自动显示，默认为true
        aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
//	        duration: 1000 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
    },
	});
})

// 工单列表页面
mui('.myOrderList')[0].addEventListener('tap',function(){
	localStorage.setItem('index','0')
	mui.openWindow({
	    url: '../../home/view/myOrderList.html',
	    id: '../../home/view/myOrderList.html',
	});
})

//我的工时和积分的提示
mui('.myWorkTime')[0].addEventListener('tap',function(){
	var btnArray = ['确定','取消']; 
	mui.confirm("此功能还未开通!",'提示:', btnArray, function(e) { 
		if (e.index == 0) { 
			
		} 
	});
})
mui('.myIntegral')[0].addEventListener('tap',function(){
	var btnArray = ['确定','取消']; 
	mui.confirm("此功能还未开通!",'提示:', btnArray, function(e) { 
		if (e.index == 0){ 
			
		} 
	});
})


//提示清理缓存
mui('.clear')[0].addEventListener('tap',function(){
	var btnArray = ['否', '是'];
	mui.confirm('确定要清除本地缓存吗？','提示:',btnArray, function(e) {
		if (e.index == 1) {
			mui.toast('清除成功');
		} else {
			mui.toast('取消清除');
		}
	})
})

//关于我们
mui('.aboutUs')[0].addEventListener('tap',function(){
	mui.openWindow({
    url: 'aboutUs.html',
    id: 'aboutUs.html',
    styles: {
        top: '0px', //新页面顶部位置
        bottom: '0px', //新页面底部位置
        width: '100%', //新页面宽度，默认为100%
        height: '100%', //新页面高度，默认为100%
    },
    extras: {
//	        ..... //自定义扩展参数，可以用来处理页面间传值 
    },
    show: {
        autoShow: true, //页面loaded事件发生后自动显示，默认为true
        aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
//	        duration: 1000 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
    },
	});
})
//服务条款
mui('.servers')[0].addEventListener('tap',function(){
	mui.openWindow({
    url: '../../home/view/Disclaimer.html',
    id: '../../home/view/Disclaimer.html',
    styles: {
        top: '0px', //新页面顶部位置
        bottom: '0px', //新页面底部位置
        width: '100%', //新页面宽度，默认为100%
        height: '100%', //新页面高度，默认为100%
    },
    extras: {
//	        ..... //自定义扩展参数，可以用来处理页面间传值 
    },
    show: {
        autoShow: true, //页面loaded事件发生后自动显示，默认为true
        aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
//	        duration: 1000 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
    },
	});
})
//退出登录
mui('.quit')[0].addEventListener('tap',function(){
//	mui.back();
	var quit = "/manage/phonelogin/logout"
	HttpRequest(quit,function(data){
		console.log(JSON.stringify(data))
		if(data.status == true){
			mui.openWindow({
				url:"../../login.html",
				id:"../../login.html",
				show: {  
			        aniShow: 'slide-in-bottom',
			    }
			})
			localStorage.setItem('quit','0')
		}
		mui.toast(data.msg)
	})
})

