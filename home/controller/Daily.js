function submit(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		id = self.name;
		console.log(id);
		var plan = document.getElementById('WorkPlan').value;
		var content = document.getElementById('WorkContent').value;
		var problem = document.getElementById('WorkProblem').value;
		var rate = document.getElementById('AllPlan').value;
		var data ={plan:plan,content:content,problem:problem,rate:rate,item_id:id}
		ajax("/manage/phone/daily_add",data,function(data){
			console.log(JSON.stringify(data));
			if (data.status == true) {
				mui.back();
				var detailPage = null;  
			    if(!detailPage){  
			    	detailPage = plus.webview.getWebviewById('ProjectDetails.html');  
			    }
				mui.fire(detailPage,'submit',{
					submit:'submit',
				})
			}
			mui.toast(data.msg);
		})
	})
}
