mui.init({
	keyEventBind: {
		backbutton: false  //关闭back按键监听
	}
});
mui('.mui-scroll-wrapper').scroll({
	deceleration:0.0005
})
//日报
mui('.daily').on('tap','img',function(){
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
//更多日报
mui('.mui-table-view').on("tap",".more",function(){
	mui.openWindow({
		url:"DailyList.html",
		id:"DailyList.html",
		show: {  
	        autoShow: true, //页面loaded事件发生后自动显示，默认为true  
	        aniShow: 'slide-in-bottom', //页面显示动画，默认为”slide-in-right“；  
	        duration: 400 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
	    },
	})
})
//问题报告
mui('.Problem').on("tap","img",function(){
	mui.openWindow({
		url:"ProblemReport.html",
		id:"ProblemReport.html",
		show:{  
	        autoShow: true, //页面loaded事件发生后自动显示，默认为true  
	        aniShow: 'slide-in-bottom', //页面显示动画，默认为”slide-in-right“；  
	        duration: 400 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
	    }
	})
})
//定位
function getposition(){
	mui.plusReady(function(){
		if(plus.os.name=="Android"){   
		    var context = plus.android.importClass("android.content.Context"); 
		    var locationManager=plus.android.importClass("android.location.LocationManager"); 
		    var main=plus.android.runtimeMainActivity(); 
		    var mainSvr=main.getSystemService(context.LOCATION_SERVICE); 
		    androidIsOpen=mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER); 
		    console.log(androidIsOpen)
		    if(androidIsOpen){ 
			    if (navigator.geolocation){
		            navigator.geolocation.getCurrentPosition(showPosition);
		        }else{
		            mui.toast("Geolocation is not supported by this browser.");
		        }
		    }else{ 
		        alert("请手动开启GPS"); 
		    } 
		}else if(plus.os.name=="iOS"){
			alert('iOS')
		    if (navigator.geolocation){
	            navigator.geolocation.getCurrentPosition(showPosition);
	        }else{
	            mui.toast("Geolocation is not supported by this browser.");
	        }
		}
	})
}
//获取位置的经纬度并进行转换
function showPosition(position){
    var latlon = position.coords.longitude+','+position.coords.latitude;
	var changeUrl = "http://api.map.baidu.com/geoconv/v1/?coords="+latlon+"&from=1&to=5&ak=NRtmCaQPW4r1uveminf1VdpQP0fO02so"
	mui.ajax({
		url:changeUrl,
		dataType:"json",
		success: function(data) {
	    	console.log(JSON.stringify(data));
			var changeLatlon = data.result[0].y+','+data.result[0].x;
			console.log(changeLatlon)
			showLocation(changeLatlon);
	    },
	    error: function(xhr, type, errorThrown) {
	        console.log(JSON.stringify(xhr));
	        mui.toast("位置请求失败，请重新获取")
	    }
	});
}
function showLocation(a){
	mui.ajax('http://api.map.baidu.com/geocoder/v2/?location='+a+'&output=json&pois=0&ak=NRtmCaQPW4r1uveminf1VdpQP0fO02so',{
		dataType:"json",
		type:"post",
		timeout:3000,
		success:function(data){
			console.log(JSON.stringify(data))
			alert("您的位置：" + data.result.formatted_address + data.result.sematic_description);
		},
		error:function(xhr,type,error){
			console.log(JSON.stringify(xhr))
			console.log(JSON.stringify(type))
			var type = JSON.stringify(type);
			if (type = "abort") {
				mui.toast("您的网络未连接或信号不稳定")
			} 
			console.log(JSON.stringify(error))
		}
	})
}