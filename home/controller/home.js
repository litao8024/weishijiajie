mui.init();
//仿IOS弹动效果
mui('.mui-scroll-wrapper').scroll({
	deceleration:0.0005
})
//项目详情
mui('.mui-table-view-cell').on('tap','.project',function(){
	console.log(this.getAttribute("index"))
	localStorage.setItem('index',this.getAttribute("index"))
	mui.openWindow({
		url:"../view/myOrderList.html",
		id:"../view/myOrderList.html",
		extras:{
			name:this.getAttribute("index")
		}
	})
})
//mui('.NewList').on('tap','.ul',function(){
//	alert('22')
//	mui.openWindow({
//		url:"../view/myOrderList.html",
//		id:"../view/myOrderList.html",
//	})
//})
//新到工单
var NewWork = "/manage/phone/index"
HttpRequest(NewWork,function(data){  
	console.log(JSON.stringify(data));
	var view = document.getElementsByClassName('NewList')[0];
	for (var i=0;i<data.length;i++) {
		console.log(data[i].id)
		var cell = document.createElement('div');
		cell.setAttribute('class','mui-table-view-cell');
		cell.setAttribute('style','margin: 0 10px;padding:0px !important');
		cell.setAttribute('id',data[i].id)
		view.appendChild(cell);
		
		var div1 = document.createElement('div');
		div1.setAttribute('class','ProjectName');
		div1.innerText = data[i].item_name;
		cell.appendChild(div1);
		
		var div2 = document.createElement('div');
		div2.setAttribute('class','ProjectState');
		cell.appendChild(div2);
		
		var ul = document.createElement('ul');
		ul.setAttribute('class','mui-grid-view');
		ul.setAttribute('style','padding: 0px;');
		div2.appendChild(ul);
		
		var li = document.createElement('li');
		li.setAttribute('class','mui-table-view-cell mui-media mui-col-xs-12');
		ul.appendChild(li);
		
		var a = document.createElement('a');
		a.setAttribute('class','ProjectIcon');
		a.setAttribute('style','padding: 0px;');
		li.appendChild(a);
		
		var img = document.createElement('img');
		img.setAttribute('class','mui-media-object');
		img.setAttribute('id',data[i].id)
		if (data[i].item_status == 1) {
			img.setAttribute('src','../../img/littlea.png');
			a.appendChild(img);
			var div3 = document.createElement('div');
			div3.setAttribute('class','mui-media-body');
			div3.setAttribute('style','color: #666666;text-align: center;font-size: 1rem;');
			div3.innerHTML = "实施中"
			a.appendChild(div3)
		} else if(data[i].item_status == 2){
			img.setAttribute('src','../../img/littleaa.png');
			a.appendChild(img);
			var div3 = document.createElement('div');
			div3.setAttribute('class','mui-media-body');
			div3.setAttribute('style','color: #666666;text-align: center;font-size: 1rem;');
			div3.innerHTML = "待验收"
			a.appendChild(div3)
		}else{
			img.setAttribute('src','../../img/littleaaa.png');
			a.appendChild(img);
			var div3 = document.createElement('div');
			div3.setAttribute('class','mui-media-body');
			div3.setAttribute('style','color: #666666;text-align: center;font-size: 1rem;');
			div3.innerHTML = "已完成"
			a.appendChild(div3)
		}
		var div4 = document.createElement('div');
		div4.setAttribute('style','height: 30px;');
	}
	view.appendChild(div4)
	mui('.NewList').on('tap','.mui-table-view-cell',function(){
		console.log(this.getAttribute('id'));
		mui.openWindow({
			url:"ProjectDetails.html",
			id:"ProjectDetails.html",
			extras:{
				name:this.getAttribute('id')
			}
		})
	})
	mui('.NewList').on('tap','img',function(){
		console.log(this.getAttribute('id'));
		mui.openWindow({
			url:"ProjectDetails.html",
			id:"ProjectDetails.html",
			extras:{
				name:this.getAttribute('id')
			}
		})
	})
})
