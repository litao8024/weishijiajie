mui.init();
////引导图            
mui.plusReady(function() {
	var launchFlag = plus.storage.getItem("launchFlag");
	if(launchFlag) {
		loadPage();
	} else {
		mui.openWindow({
			url: "home/guide.html",
			id: "guide"
			});
		}
});
function loadPage(){
	//底部选项卡切换跳转
	//跳转页面
	var subpages = ['home/home.html', 'project/project.html', 'mine/mine.html'];
	var subpage_style = {
	    top: '0px',
		bottom: '51px'
	};
	//首次启动切滑效果
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
        for (var i = 0; i < 3; i++) {
            var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
            if (i > 0) {
             sub.hide();
            }
            self.append(sub);
        }
        console.log('ssss');
	});
	
	//点击切换
	var home,project,mine,self
	function getPage(){
  	   	self = plus.webview.currentWebview();
		home=plus.webview.getWebviewById("home/home.html");  
      	project = plus.webview.getWebviewById("project/project.html");
  		mine = plus.webview.getWebviewById("mine/mine.html");
    }
	mui("#nav").on("tap","#home",function(){//点击触发 
	  	getPage()  
	    home.show();
	    console.log('lll')
	    mui('img')[0].src = 'img/on-homepage.png';
	    mui('img')[2].src = 'img/me.png';
	    mui('img')[1].src = 'img/news-.png';
	    project.hide();
	    mine.hide();
	})  
	mui("#nav").on("tap","#project",function(){//点击触发  
	    getPage()
	    project.show(); 
	    mui('img')[1].src = 'img/on-news.png';
	    mui('img')[0].src = 'img/homepage.png';
	    mui('img')[2].src = 'img/me.png';
	    home.hide();
	    mine.hide();
	})  
	mui("#nav").on("tap","#mine",function(){//点击触发
	    getPage()
	    mine.show();
	    mui('img')[2].src = 'img/on-me.png';
	    mui('img')[0].src = 'img/homepage.png';
	    mui('img')[1].src = 'img/news-.png';
	        home.hide();
	        project.hide();
	    })  
}          	
         