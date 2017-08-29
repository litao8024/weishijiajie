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
    }, function ( e ) {  
        console.log( "取消选择图片" );  
    }, {filter:"image"});  
}  
var url="http://43.254.3.166:8080/manage/phone/upload"; 
function uploadImg(e){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		console.log(self.name);
		console.log(e)
		var wt=plus.nativeUI.showWaiting();
		task=plus.uploader.createUpload(url+ "?id=" + self.name,{method:'post',timeout: 120},
		function(t,status){
			if(status==200){
				console.log("上传文件的总大小：" + task.totalSize);
				console.log("上传成功：\n"+t.responseText)
				mui.toast('上传成功');
				wt.close();
				location.reload();
			}else{
				console.log(JSON.stringify(status))
				alert("上传失败："+status)
				wt.close();
			}
		});
	//		task.addData('name','value');
		task.addFile(e,{key:"file"});
		task.start();
	})
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
mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	console.log(self.name);
	var data = {id:self.name};
	ajax("/manage/phone/file",data,function(data){
		console.log(JSON.stringify(data));
		var content = document.getElementsByClassName('mui-scroll')[0];
		if (data == '') {
			var div = document.createElement('div');
			div.setAttribute('class','nonework');
			div.innerHTML="您还没有验收文档";
			content.appendChild(div);
		}else{
			for (var i=0;i<data.length;i++) {
				var div1 = document.createElement('div');
				div1.setAttribute('class','mui-table-view-cell');
				div1.setAttribute('path',data[i].path)
				content.appendChild(div1);
				
				var div2 = document.createElement('div');
				div2.setAttribute('class','mui-slider-right mui-disabled deletee');
				div2.setAttribute('id',data[i].id)
				div1.appendChild(div2);
				
				var a = document.createElement('a');
				a.setAttribute('class','mui-btn mui-btn-red');
				a.innerHTML = "删除";
				div2.appendChild(a);
				
				var div3 = document.createElement('div');
				div3.setAttribute('class','mui-slider-handle');
				div3.setAttribute('idd',data[i].path)
				div1.appendChild(div3);
				
	//			var img = document.createElement('img');
	//			img.setAttribute('id','imgcell');
	//			img.setAttribute('src','../../img/Layer-1.png');
	//			div3.appendChild(img);
				
				var div4 = document.createElement('div');
				div4.setAttribute('class','contentSpan');
				div3.appendChild(div4);
				
				var span1 = document.createElement('span');
				span1.setAttribute('class','title');
				span1.setAttribute('style','width: 90%;text-overflow: ellipsis;overflow: hidden;white-space:nowrap;')
				span1.innerHTML = data[i].name;
				div4.appendChild(span1);
				
				var span2 = document.createElement('span');
				span2.setAttribute('class','time');
				span2.innerHTML = data[i].pass_time;
				div4.appendChild(span2);
				
				var span3 = document.createElement('span');
				span3.setAttribute('class','name');
				span3.innerHTML = data[i].user_name;
				div4.appendChild(span3);
				
				document.getElementsByClassName('deletee')[i].onclick = function(){
					console.log(this.getAttribute('id'));
					var btnArray = ['确定','取消'];
					var work = {id:this.getAttribute('id')};
					mui.confirm('确认删除吗？','提示:',btnArray,function(e){
						if (e.index == 0) {
							console.log('删除')
							ajax('/manage/phone/delete_file',work,function(data){
								console.log(JSON.stringify(data))
								if(data.status == true){
									location.reload();
								}
								mui.toast(data.msg)
							})
						}
					})
				}
				document.getElementsByClassName('mui-slider-handle')[i].onclick = function(){
					var path = this.getAttribute('idd')
					console.log(this.getAttribute('idd'));
					var downURL='http://192.168.100.242' + path;
					console.log('http://192.168.100.242' + path);
					mui.plusReady(function(){
						//开始下载
						plus.nativeUI.showWaiting("下载文件...");
						var dtask = plus.downloader.createDownload(downURL,{}, function(d, status) {
							if(status == 200) { // 下载成功
								console.log("下载成功");
								console.log(JSON.stringify(d))
								var path = d.filename;
								console.log(d.filename);
								mui.toast("下载成功！");
								setTimeout(function(){
									plus.runtime.openFile(path, {},function(e){
										console.log(JSON.stringify(e))
									})
								},1000)
							} else { //下载失败
								plus.nativeUI.alert("Download failed: " + status);
							}
							plus.nativeUI.closeWaiting();
						});
						var i = 0,
						progress = 0;
						dtask.addEventListener("statechanged", function(task, status) {
							switch(task.state) {
								case 0: //调度开始
									console.log("调度开始");
									break;
								case 1: // 开始
									console.log("开始");
									break;
								case 2: //已连接到服务器
									console.log("已连接到服务器");
									break;
								case 3: // 已接收到数据
									progress = Math.round(100 * task.downloadedSize / task.totalSize);
									if(progress == i) {
										i += 5;
									}
									break;
								case 4: // 下载完成         
									console.log("完成");
									break;
							}
						});
						dtask.start();
					})
				} 
			}
		}
	})
})

