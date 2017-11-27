mui.init();
mui('.mui-scroll-wrapper').scroll({
	scrollY: true, //是否竖向滚动
	scrollX: false, //是否横向滚动
	startX: 0, //初始化时滚动至x
	startY: 0, //初始化时滚动至y
	indicators: true, //是否显示滚动条
	deceleration:0.0020, //阻尼系数,系数越小滑动越灵敏
	bounce: true //是否启用回弹
})
//监听应用从后台切换到前台
document.addEventListener("resume", function () {
    console.log("应用从后台切换到前台");
    location.reload();
}, false);

//定位
function getposition(){
	plus.nativeUI.showWaiting("正在定位...");
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
		    	plus.nativeUI.closeWaiting();
		        alert("请手动开启GPS"); 
		    } 
		}else if(plus.os.name=="iOS"){
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
			plus.nativeUI.closeWaiting();
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
			var btnArray = ['确定', '取消']; 
			mui.confirm("您的位置：" + data.result.formatted_address + data.result.sematic_description, '提示:', btnArray, function(e) { 
				if (e.index == 0) { 
					mui.plusReady(function(){
						var MessageSelf = plus.webview.currentWebview();
						var item = MessageSelf.name;
						var message = {item_id:item,address:data.result.formatted_address + data.result.sematic_description};
						console.log(JSON.stringify(message))
						ajax("/manage/phone/sign",message,function(data){
							console.log(JSON.stringify(data))
							if(data.count == '0'){
								document.getElementsByClassName('sign')[0].innerHTML = '上班打卡'
							}else if(data.count == '1'){
								document.getElementsByClassName('sign')[0].innerHTML = '下班打卡'
							}else{
								document.getElementsByClassName('sign')[0].innerHTML = '打卡已满';
							}
							mui.toast(data.msg)
						})
					})
				} 
			}); 
		},
		error:function(xhr,type,error){
			console.log(JSON.stringify(xhr))
			console.log(JSON.stringify(type))
			var type = JSON.stringify(type);
//			if (type = "abort") {
//				mui.toast("您的网络未连接或信号不稳定")
//			} 
			console.log(JSON.stringify(error))
		}
	})
}
//获取项目详情信息
mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	console.log(self.name)
	console.log(self.status)
	//是否隐藏申请验收
	var Apply = self.status;
	console.log(Apply)
	console.log(Apply != '1')
	if (Apply != '1'){
		document.getElementById('check').style.display = 'none';
		document.getElementsByClassName('sign')[0].style.display = 'none';
	}
	//相关日报
	mui('.dailyy').on('tap','.daily',function(){
		console.log(this.getAttribute('index'))
		if (Apply != '1') {
			mui.toast('该项目不可编辑')
		} else{
			mui.openWindow({
				url:"Daily.html",
				id:"Daily.html",
				extras:{
					name:self.name
				},
			})
		}
	})
	//问题报告
	mui('.HostName').on("tap",".Problem",function(){
		if (Apply != '1') {
			mui.toast('该项目不可编辑')
		} else{
			mui.openWindow({
				url:"ProblemReport.html",
				id:"ProblemReport.html",
				extras:{
					name:self.name
				}
			})
		}
	})
	//项目文档
	mui(".ItemWps").on("tap",".WpsProblem",function(){
		if (Apply != '1') {
			mui.toast('该项目不可编辑')
		} else{
			mui.openWindow({
				url:"textDocument.html",
				id:"textDocument.html",
				extras:{
					name:self.name
				}
			})
		}
	})
	var status1 = self.status;
	document.getElementById('imgg').setAttribute('index',self.name)
	var day = document.getElementsByClassName('daily')[0];
	day.setAttribute('id',self.name)
	var data = {id:self.name};
	ajax("/manage/phone/details",data,function(data){
		console.log(JSON.stringify(data))
		console.log(data.count)
		if(data.count == '0'){
			document.getElementsByClassName('sign')[0].innerHTML = '上班打卡'
		}else if(data.count == '1'){
			document.getElementsByClassName('sign')[0].innerHTML = '下班打卡'
		}else{
			document.getElementsByClassName('sign')[0].innerHTML = '打卡已满';
		}
		document.getElementById('title').innerHTML = data.item.item_name
		//代理商
		document.getElementById('agent').innerHTML = data.customer.partner;
		//代理商联系人
		document.getElementById('name').innerHTML = data.customer.partner_contacts;
		var partner_contacts = data.customer.partner_contacts;
		var contacts = partner_contacts.split('\\');
		console.log(contacts[1])
		var partner_phone = data.customer.partner_phone;
		var phone = partner_phone.split('\\');
		console.log(partner_phone.split('\\'))
		//代理商联系电话
		document.getElementById('phone').setAttribute('dial',phone[0]);
		document.getElementById('phone').innerHTML = contacts[0] + " " + phone[0];
		var LinkmanPhone = document.getElementsByClassName('LinkmanPhone')[0];
		for (var i=1;i<contacts.length;i++) {
			var a2 = document.createElement('a');
			LinkmanPhone.appendChild(a2);
			var span3 = document.createElement('span');
			span3.setAttribute('class','mui-pull-right dial')
			span3.setAttribute('dial',phone[i])
			span3.innerHTML = contacts[i] + ":" + phone[i];
			a2.appendChild(span3);
		}
		for (var i=0;i<contacts.length;i++) {
			//拨打电话
			document.getElementsByClassName('dial')[i].addEventListener('tap', function() { 
				var btnArray = ['拨打', '取消']; 
				var Phone = this.getAttribute('dial'); 
				mui.confirm('是否拨打 ' + Phone + ' ？', '提示：', btnArray, function(e) { 
					if (e.index == 0) { 
						mui.plusReady(function(){
							plus.device.dial(Phone, false); 
						})
					} 
				}); 
			});
		}
		//代理商邮箱
		document.getElementById('Agent-emial').innerHTML = data.customer.partner_email;
		//最终客户
		document.getElementById('Final-customer').innerHTML = data.customer.final_customer;
		document.getElementsByClassName('redact')[0].setAttribute('name','0');
		//最终客户联系人
		document.getElementById('Final-name').innerHTML = data.customer.final_contacts;
		document.getElementsByClassName('redact')[1].setAttribute('name','1');
		//最终客户电话
		document.getElementById('Final-phone').innerHTML = data.customer.final_phone;
		document.getElementsByClassName('redact')[2].setAttribute('name','2');
		var Fphome = 
		//最终客户邮箱
		document.getElementById('Final-email').innerHTML = data.customer.final_email;
		document.getElementsByClassName('redact')[3].setAttribute('name','3');
		//如果没有信息，进入可编辑页面
		mui('.mui-table-view').on('tap','.redact',function(){
			console.log(this.getAttribute('name'));
			var edit = this.getAttribute('name');
			console.log(edit)
			console.log(status1)
			if(edit=='2' && data.customer.final_phone !=''){
				//拨打最终客户电话
				console.log(status1)
				var btnArray = ['拨打', '编辑'];
				var Phone = data.customer.final_phone; 
				mui.confirm('是否拨打 ' + Phone + ' ？', '提示：', btnArray, function(e) { 
					console.log(JSON.stringify(e))
					if (e.index == 0){
						mui.plusReady(function(){
							plus.device.dial(Phone, false); 
						})
					}else if (e.index==1&&status1 =='1') {
						mui.plusReady(function(){
							var self = plus.webview.currentWebview();
							console.log(self.name)
							mui.openWindow({
								url:"Edit.html",
								id:"Edit.html",
								extras:{
									edit:edit,
									name:self.name
								}
							})
						})
					}else{
						mui.toast('此项目不可编辑');
					}
				}); 
			}else if(status1=='1'){
				mui.plusReady(function(){
					var self = plus.webview.currentWebview();
					console.log(self.name)
					mui.openWindow({
						url:"Edit.html",
						id:"Edit.html",
						extras:{
							edit:edit,
							name:self.name
						}
					})
				})
			}
		})
		//项目备注
		if(data.item.item_remarks){		
			document.getElementById('contentt').innerHTML = data.item.item_remarks;
		}else{
			document.getElementById('contentt').innerHTML = '没有添加备注';
		}
		document.getElementById('place').innerHTML = data.customer.province + data.customer.city + data.customer.address;
		document.getElementById('cycle').innerHTML = data.dispatch.plan + "天";
		document.getElementById('engineer').innerHTML = data.dispatch.user_id;
		document.getElementById('expert').innerHTML = data.dispatch.expert;
		document.getElementById('expert-phone').innerHTML = data.dispatch.phone;
		//拨打项目专家电话
		if (data.dispatch.phone != '') {
			document.getElementById('expert-phone').addEventListener('tap', function() { 
				var btnArray = ['拨打', '取消']; 
				var Phone = data.dispatch.phone; 
				mui.confirm('是否拨打 ' + Phone + ' ？', '提示：', btnArray, function(e) { 
					if (e.index == 0) { 
						mui.plusReady(function(){
							plus.device.dial(Phone, false); 
						})
					} 
				}); 
			});
		}
		document.getElementById('type').innerHTML = data.item.project_line;
//		//相关日报
//		mui('.dailyy').on('tap','.daily',function(){
//			console.log(this.getAttribute('index'))
//			mui.openWindow({
//				url:"Daily.html",
//				id:"Daily.html",
//				extras:{
//					name:self.name
//				},
//			})
//		})
		if(data.daily != ''){
			var daily = document.getElementsByClassName('dailyy')[0];
			var lii = document.createElement('li');
			lii.setAttribute('class','mui-table-view-cell');
			daily.appendChild(lii);
			
			var imgg = document.createElement('img');
			imgg.setAttribute('src','../../img/write-man.png');
			lii.appendChild(imgg)
			
			var div = document.createElement('div');
			div.setAttribute('style','font-weight: 600;display: inline-block;');
			div.innerHTML = "填写人：";
			lii.appendChild(div);
			
			var spann = document.createElement('span');
			spann.setAttribute('id','host');
			spann.setAttribute('style','color: 989898 !important;');
			lii.appendChild(spann);
			document.getElementById('host').innerHTML = data.daily[0].user_id;
			
			for (var i=0;i<data.daily.length;i++) {
				var li = document.createElement('li');
				li.setAttribute('class','mui-table-view-cell Related');
				li.setAttribute('id',data.daily[i].id)
				daily.appendChild(li);
				
				var img = document.createElement('img');
				img.setAttribute('src','../../img/date.png');
				li.appendChild(img);
				
				var div = document.createElement('div');
				div.setAttribute('style','font-weight: 600;display: inline-block;');
				div.setAttribute('class','mui-navigate-right');
				div.innerHTML = "日期：";
				li.appendChild(div);
				
				var span = document.createElement('span');
				span.setAttribute('style','color: 989898 !important;');
				span.innerHTML = data.daily[i].date;
				li.appendChild(span);
			}
			var li1 = document.createElement('li');
			li1.setAttribute('class','mui-table-view-cell more');
			li1.setAttribute('style','text-align: center;');
			li1.setAttribute('id',self.name)
			li1.innerHTML = "更多"
			daily.appendChild(li1);
			mui('.dailyy').on("tap",'.Related',function(){
				console.log(this.getAttribute('id'));
				mui.openWindow({
					url:"DailyNo.html",
					id:"DailyNo.html",
					extras:{
						name:this.getAttribute('id')
					}
				})
			})
			//点击加载更多
			mui('.dailyy').on("tap",'.more',function(){
				console.log(this.getAttribute('id'));
				mui.openWindow({
					url:"../view/DailyList.html",
					id:"DailyList.html",
					extras:{
						name:this.getAttribute('id')
					}
				})
			})
		}
//		//问题报告
//		mui('.HostName').on("tap",".Problem",function(){
//			mui.openWindow({
//				url:"ProblemReport.html",
//				id:"ProblemReport.html",
//				extras:{
//					name:self.name
//				}
//			})
//		})
		if (data.report != '') {
			var HostName = document.getElementsByClassName('HostName')[0];
			console.log(JSON.stringify(data.report))
			for (var i=0;i<data.report.length;i++) {
				var lii = document.createElement('li');
				lii.setAttribute("class","mui-table-view-cell");
				HostName.appendChild(lii);
			
				var a = document.createElement('a');
				a.setAttribute('href','#middlePopover');
				a.setAttribute('problem',data.report[i].problem)
				lii.appendChild(a);
			
				var div3 = document.createElement('div');
				div3.setAttribute('style','margin: 0 0 20px 6px;');
				a.appendChild(div3);
				
				var imgg = document.createElement('img');
				imgg.setAttribute('src','../../img/write-man.png');
				div3.appendChild(imgg)
				
				var divv = document.createElement('div');
				divv.setAttribute('style','display: inline-block;color: rgb(51,51,51);');
				divv.innerHTML = "填写人：";
				div3.appendChild(divv);
			
				var spann = document.createElement('span');
				spann.setAttribute('id','HostName');
				spann.setAttribute('style','color: 989898 !important;')
				spann.setAttribute('problem',data.report[i].problem);
				spann.innerHTML = data.report[i].user_id;
				div3.appendChild(spann);
				
				
				var outdiv1 = document.createElement('div');
				outdiv1.setAttribute('style','margin-bottom:20px');
				a.appendChild(outdiv1)
				
				var img1 = document.createElement('img');
				img1.setAttribute('src','../../img/date.png');
				outdiv1.appendChild(img1);
				
				var div1 = document.createElement('div');
				div1.setAttribute('style','font-weight: 600;display: inline-block;');
				div1.setAttribute('class','mui-navigate-right');
				div1.innerHTML = "日期:";
				outdiv1.appendChild(div1);
				
				var span1 = document.createElement('span');
				span1.setAttribute('style','color: 989898 !important;margin-left: 10px;');
				span1.innerHTML = data.report[i].create_time;
				outdiv1.appendChild(span1);
				
				var outdiv2 = document.createElement('div');
				outdiv2.setAttribute('style','margin-bottom:10px');
				a.appendChild(outdiv2)
				
				var img2 = document.createElement('img');
				img2.setAttribute('src','../../img/case.png');
				outdiv2.appendChild(img2);
				
				var div2 = document.createElement('div');
				div2.setAttribute('style','font-weight: 600;display: inline-block;');
				div2.setAttribute('class','mui-navigate-right');
				div2.innerHTML = "问题类型:";
				outdiv2.appendChild(div2);
				
				var span2 = document.createElement('span');
				span2.setAttribute('style','color: 989898 !important;margin-left: 10px;');
				span2.innerHTML = data.report[i].type;
				outdiv2.appendChild(span2);
			}
		}
//		//项目文档
//		mui(".ItemWps").on("tap",".WpsProblem",function(){
//			mui.openWindow({
//				url:"textDocument.html",
//				id:"textDocument.html",
//				extras:{
//					name:self.name
//				}
//			})
//		})
		var ItemWps = document.getElementsByClassName('ItemWps')[0];
		for (var i=0;i<data.file.length;i++) {
			var li1 = document.createElement('li');
			li1.setAttribute('class','mui-table-view-cell mui-media wps');
			li1.setAttribute('idd',data.file[i].path)
			ItemWps.appendChild(li1);
			
			var a1 = document.createElement('a');
			a1.setAttribute('href','javascript:;');
			li1.appendChild(a1);
			
			var div4 = document.createElement('div');
			div4.setAttribute('class','mui-media-body');
			a1.appendChild(div4);
			
			var div5 = document.createElement('div');
			div5.setAttribute('style','font-weight: 600;overflow: hidden;width: 90%;text-overflow: ellipsis;');
			div5.setAttribute('class','mui-navigate-right');
			div5.innerHTML = data.file[i].name
			div4.appendChild(div5);
			
			var div6 =document.createElement('div');
			div6.setAttribute('style','margin-left: 6px;margin-top:5px;');
			div6.innerHTML = data.file[i].pass_time + ' ' + data.file[i].user_name;
			div4.appendChild(div6)
			
			document.getElementsByClassName('wps')[i].onclick = function(){
				var path = this.getAttribute('idd')
				console.log(this.getAttribute('idd'));
				var downURL=hostDomain + path;
				console.log(hostDomain + path);
				mui.plusReady(function(){
					//开始下载
					plus.nativeUI.showWaiting("正在打开文件...");
					var dtask = plus.downloader.createDownload(downURL,{}, function(d, status) {
						if(status == 200) { // 下载成功
							console.log("下载成功");
							console.log(JSON.stringify(d))
							var path = d.filename;
							console.log(d.filename);
							mui.toast("打开成功！");
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
	})
})
//问题原因
mui('.HostName').on('tap','a',function(){
	document.getElementById('middlePopover').innerHTML = this.getAttribute('problem');
	console.log(this.getAttribute('problem'))
});
//实时更新日报列表
window.addEventListener('submit',function(e){
	location.reload();
	console.log(e.detail.submit)
})
window.addEventListener('submit1',function(e){
	var self = plus.webview.currentWebview();
	console.log(self.name)
	document.getElementById('imgg').setAttribute('index',self.name)
	var day = document.getElementsByClassName('daily')[0];
	day.setAttribute('id',self.name)
	var data = {id:self.name};
	ajax("/manage/phone/details",data,function(data){
		var ItemWps = document.getElementsByClassName('ItemWps')[0];
		ItemWps.innerHTML = ' ';
		
		var li0 = document.createElement('li');
		li0.setAttribute('class','mui-table-view-cell WpsProblem');
		var a0 = document.createElement('a');
		a0.setAttribute('style','color: #72a5f1;font-size: 1.3rem;');
		li0.appendChild(a0);
		a0.innerHTML = '项目文档';
		var span0 = document.createElement('span');
		span0.setAttribute('class','mui-pull-right');
		a0.appendChild(span0);
		var img0 = document.createElement('img');
		img0.setAttribute('src','../../img/wps.png');
		span0.appendChild(img0);
		
		ItemWps.appendChild(li0);
		for (var i=0;i<data.file.length;i++) {
			var li1 = document.createElement('li');
			li1.setAttribute('class','mui-table-view-cell mui-media wps');
			li1.setAttribute('idd',data.file[i].path)
			ItemWps.appendChild(li1);
			
			var a1 = document.createElement('a');
			a1.setAttribute('href','javascript:;');
			li1.appendChild(a1);
			
			var div4 = document.createElement('div');
			div4.setAttribute('class','mui-media-body');
			a1.appendChild(div4);
			
			var div5 = document.createElement('div');
			div5.setAttribute('style','font-weight: 600;overflow: hidden;width: 90%;text-overflow: ellipsis;');
			div5.setAttribute('class','mui-navigate-right');
			div5.innerHTML = data.file[i].name
			div4.appendChild(div5);
			
			var div6 =document.createElement('div');
			div6.setAttribute('style','margin-left: 6px;margin-top:5px;');
			div6.innerHTML = data.file[i].pass_time + ' ' + data.file[i].user_name;
			div4.appendChild(div6)
			
			document.getElementsByClassName('wps')[i].onclick = function(){
				var path = this.getAttribute('idd')
				console.log(this.getAttribute('idd'));
				var downURL=hostDomain + path;
				console.log(hostDomain + path);
				mui.plusReady(function(){
					//开始下载
					plus.nativeUI.showWaiting("正在打开文件...");
					var dtask = plus.downloader.createDownload(downURL,{}, function(d, status) {
						if(status == 200) { // 下载成功
							console.log("下载成功");
							console.log(JSON.stringify(d))
							var path = d.filename;
							console.log(d.filename);
							mui.toast("打开成功！");
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
	})
})
//申请验收
mui('.content').on('tap','.check',function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		console.log(self.name)
		ajax('/manage/phone/apply',{id:self.name},function(data){
			console.log(JSON.stringify(data))
			if (data.status == true) {
				mui.back();
				var detailPage = null;  
			    if(!detailPage){  
			    	detailPage = plus.webview.getWebviewById('pullrefresh_sub.html');  
			    }
				mui.fire(detailPage,'apply',{
					apply:'apply',
				})
				//刷先首页
				var home = null;  
			    if(!home){  
			    	home = plus.webview.getWebviewById('home/view/home.html');  
			    }
				mui.fire(home,'home',{
					home:'home',
				})
			}
			mui.toast(data.msg)
		})
	})
})
////模态框关闭按钮
//function closee(){
//	mui('#show').popover('hide');
//}
