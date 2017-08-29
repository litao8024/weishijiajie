mui.init()
mui('.mui-scroll-wrapper').scroll({
	deceleration:0.0005
})
mui('.mui-table-view').on("tap",".daily",function(){
	mui.openWindow({
		url:"Daily.html",
		id:"Daily.html",
		show: {  
	        autoShow: true, //页面loaded事件发生后自动显示，默认为true  
	        aniShow: 'slide-in-bottom', //页面显示动画，默认为”slide-in-right“；  
	        duration: 400 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
	    },
	})
})
