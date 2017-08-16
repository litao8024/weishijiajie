mui.init()
mui('.mui-scroll-wrapper').scroll({
	 scrollY: true, //是否竖向滚动
	 scrollX: false, //是否横向滚动
	 startX: 0, //初始化时滚动至x
	 startY: 0, //初始化时滚动至y
	 indicators: false, //是否显示滚动条
	 deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
	 bounce: true, //是否启用回弹 
});
//拍照
mui('.mui-bar-nav').on("tap",'.picture',function(){
	if(mui.os.plus){
		var a = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		mui.plusReady(function(){
			plus.nativeUI.actionSheet({
//				title: "修改头像",
				cancel: "取消",
				buttons: a
			}, function(b) {
				switch (b.index) {
					case 0:
						break;
					case 1:
						getImage();
						break;
					case 2:
						galleryImg();
						break;
					default:
						break
				}
			})	
		})
	}
})
//拍照
function getImage() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL() + "?version=" + new Date().getTime();
			var dstname="_downloads/"+getUid()+".jpg";
			compressImage(s,dstname);
			//变更大图预览的src
			//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
//					document.querySelector("#__mui-imageview__group .mui-slider-item img").src = s + "?version=" + new Date().getTime();;;
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/head.jpg"
	})
}

// 从相册中选择图片  
function galleryImg() {  
	// 从相册中选择图片  
	console.log("从相册中选择图片:");  
    plus.gallery.pick( function(path){ 
    	//上传图片到服务器的方法
    		console.log(path); 
    		var dstname="_downloads/"+getUid()+".jpg";
    		compressImage(path,dstname);
		    uploadImg(path);
    }, function ( e ) {  
        console.log( "取消选择图片" );  
    }, {filter:"image"} );  
}  
var url="http://43.254.3.166/index.php/app_api/api/editUserInfo"; 
//	var url="http://mall.ecsits.com/index.php/app_api/api/editUserInfo"; 
function uploadImg(e){
	console.log(e)
	var wt=plus.nativeUI.showWaiting();
	task=plus.uploader.createUpload(url+"?path=123",{method:'post',timeout: 120},
	function(t,status){
		if(status==200){
			document.getElementById("head-img").src = e;
			localStorage.setItem('print',e);
			console.log("上传文件的总大小：" + task.totalSize);
			console.log("上传成功：\n"+t.responseText)
			mui.toast('修改成功');
			wt.close();
		}else{
			alert("上传失败："+status)
			wt.close();
		}
	});
//		task.addData('name','value');
	task.addFile(e,{key:"image"});
	task.start();
}
//压缩图片，这个比较变态的方法，无法return 
function compressImage(src,dstname){ 
    plus.zip.compressImage({ 
            src: src, 
            dst: dstname, 
            overwrite:true, 
            quality: 20 
        }, 
        function(event) { 
             console.log("Compress success:"+event.target); 
             uploadImg(event.target);
            return event.target; 
        }, 
        function(error) { 
            console.log(error); 
            return src; 
            alert("Compress error!"); 
        }); 
}	
// 产生一个随机数 
function getUid() { 
    return Math.floor(Math.random() * 100000000 + 10000000).toString(); 
}