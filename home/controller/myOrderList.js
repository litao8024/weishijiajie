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
var dpiW = screen.width;//获取屏幕分辨率
document.getElementsByClassName('mui-scroll')[0].style.minHeight = screen.height + "px";
console.log(document.getElementsByClassName('mui-scroll')[0].style.height)
var s = document.getElementsByClassName('content').length;
console.log(s);
for(var i=0;i<s;i++){
	document.getElementsByClassName('content')[i].style.width = (dpiW/375*285)+'px';
}
//获取首页穿过来的值（判断项目状态）
mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	console.log(self.name)
	var data = {status:self.name};
	ajax('/manage/phone/lists',data,function(data){
		console.log(JSON.stringify(data))
		var view = document.getElementsByClassName('mui-scroll')[0];
		if(data == ''){
			var div = document.createElement('div');
			div.setAttribute('class','nonework');
			div.innerHTML="此状态下没有工单";
			view.appendChild(div);
		}else{
			for (var i=0;i<data.length;i++) {
				var cell = document.createElement('div');
				cell.setAttribute('class','mui-table-view-cell');
				cell.setAttribute('id',data[i].id)
				view.appendChild(cell);
				
				var div1 = document.createElement('div');
				div1.setAttribute('class','content');
				div1.innerText = data[i].item_name;
				cell.appendChild(div1);
				
				var div2 = document.createElement('div');
				div2.setAttribute('style','float: right;width: 40px;height: 44px;text-align: center;margin-top: 10px;');
				cell.appendChild(div2);
				
				var img = document.createElement('img');
				if (data[i].item_status == 1) {
					img.setAttribute('src','../../img/littlea.png');
					img.setAttribute('style','width: 22px;height: 22px;')
					div2.appendChild(img);
					var div3 = document.createElement('div');
					div3.setAttribute('class','mui-media-body');
					div3.setAttribute('style','color: #666666;text-align: center;font-size: 12px;');
					div3.innerHTML = "实施中";
					div2.appendChild(div3)
				} else if(data[i].item_status == 2){
					img.setAttribute('src','../../img/littleaa.png');
					img.setAttribute('style','width: 22px;height: 22px;')
					div2.appendChild(img);
					var div3 = document.createElement('div');
					div3.setAttribute('class','mui-media-body');
					div3.setAttribute('style','color: #666666;text-align: center;font-size: 12px;');
					div3.innerHTML = "待验收"
					div2.appendChild(div3)
				}else{
					img.setAttribute('src','../../img/littleaaa.png');
					img.setAttribute('style','width: 22px;height: 22px;')
					div2.appendChild(img);
					var div3 = document.createElement('div');
					div3.setAttribute('class','mui-media-body');
					div3.setAttribute('style','color: #666666;text-align: center;font-size: 12px;');
					div3.innerHTML = "已完成"
					div2.appendChild(div3)
				}
			}
		}
	})
})
//点击进入项目详情
mui(".mui-scroll").on("tap",'.mui-table-view-cell',function(){
	console.log(this.getAttribute('id'))
	mui.openWindow({
		url:"ProjectDetails.html",
		id:"ProjectDetails.html",
		extras:{
			name:this.getAttribute('id')
		}
	})
})
