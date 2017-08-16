mui.init();
//仿IOS滑动效果
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});
//全局监听事件
window.addEventListener('mine',function(e){
	alert(e.detail.id)
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
	console.log('sss');
	mui.openWindow({
    url: '../../home/view/myOrderList.html',
    id: '../../home/view/myOrderList.html',
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

//我的工时和积分的提示
mui('.myWorkTime')[0].addEventListener('tap',function(){
		alert('此功能还未开通');
})
mui('.myIntegral')[0].addEventListener('tap',function(){
		alert('此功能还未开通');
})


//提示清理缓存
mui('.clear')[0].addEventListener('tap',function(){
	var btnArray = ['否', '是'];
	mui.confirm('确定要清除本地缓存吗？', btnArray, function(e) {
		if (e.index == 1) {
//						info.innerText = '你刚确认MUI是个好框架';
			mui.toast('清除成功');
		} else {
//						info.innerText = 'MUI没有得到你的认可，继续加油'
			mui.toast('取消清除');
		}
	})
})

//关于我们
mui('.aboutUs')[0].addEventListener('tap',function(){
	console.log('sss');
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


