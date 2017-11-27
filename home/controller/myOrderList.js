mui.init()
var dpiW = screen.width;//获取屏幕分辨率
//mui('.mui-scroll')[0].style.minHeight = screen.height + "px";
//console.log(document.getElementsByClassName('mui-scroll')[0].style.height)
var s = document.getElementsByClassName('content').length;
console.log(s);
for(var i=0;i<s;i++){
	document.getElementsByClassName('content')[i].style.width = (dpiW/375*285)+'px';
}
//获取首页穿过来的值（判断项目状态）
mui.plusReady(function(){
	var self = localStorage.getItem('index');
	console.log(self)
	var data = {status:self};
	ajax('/manage/phone/lists',data,function(data){
		console.log(JSON.stringify(data))
		console.log(data.length)
		var view = document.getElementsByClassName('mui-table-view')[0];
		if(data == ''){
			var div = document.createElement('div');
			div.setAttribute('style','background: #efeff4;margin-top: 50px;width: 100%; height: 50px;line-height: 50px;text-align: center;color: #A2A2A2;');
			div.innerHTML="此状态下没有工单";
			view.appendChild(div);
			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		}else{
			var amount = data.length>8?8:data.length;
			console.log(amount)
			for (var i=0;i<amount;i++) {
				var cell = document.createElement('li');
				cell.setAttribute('class','mui-table-view-cell');
				cell.setAttribute('status',data[i].item_status)
				cell.setAttribute('id',data[i].id)
				view.appendChild(cell);
				
				var div1 = document.createElement('div');
				div1.setAttribute('class','content');
				div1.setAttribute('style','white-space: nowrap;display: inline-block;line-height: 44px;width: 80%;')
				div1.innerText = data[i].item_name;
				cell.appendChild(div1);
				
				var div2 = document.createElement('div');
				div2.setAttribute('style','float: right;width: 12%;text-align: center;');
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
mui(".mui-table-view").on("tap",'.mui-table-view-cell',function(){
	console.log(this.getAttribute('id'))
	mui.openWindow({
		url:"ProjectDetails.html",
		id:"ProjectDetails.html",
		extras:{
			name:this.getAttribute('id'),
			status:this.getAttribute('status')
		}
	})
})
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 1500);
}
var count = 0;
var i = 0;
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		var self = localStorage.getItem('index');
		console.log(self)
		var data = {status:self};
		ajax('/manage/phone/lists',data,function(data){
			var numbers = (data.length - 8) / 3;
			console.log(numbers)
			mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > numbers)); //参数为true代表没有更多数据了。
			var view = document.body.querySelector('.mui-table-view');
			var cells = document.body.querySelectorAll('.mui-table-view-cell');
			console.log(cells.length)
			console.log(data.length)
			console.log(cells.length >= data.length)
			if (cells.length >= data.length) {
				return false;
			}else{
				for (var i = cells.length, len = i + 3; i < len; i++) {
					console.log(i);
					console.log(len)
					console.log(data.length)
					if (i < data.length) {
						var cell = document.createElement('li');
						cell.setAttribute('class','mui-table-view-cell');
						cell.setAttribute('id',data[i].id)
						view.appendChild(cell);
						
						var div1 = document.createElement('div');
						div1.setAttribute('class','content');
						div1.setAttribute('style','white-space: nowrap;display: inline-block;line-height: 44px;width: 80%;')
						div1.innerText = data[i].item_name;
						cell.appendChild(div1);
						
						var div2 = document.createElement('div');
						div2.setAttribute('style','float: right;width: 12%;text-align: center;');
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
			}
		})
	}, 1500);
}
