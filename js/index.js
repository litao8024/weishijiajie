//获取当前应用的版本号
var wgtVer=null;
function plusReady(){
    // 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
        console.log("当前应用版本："+wgtVer);
        console.log(localStorage.getItem('version'))
        console.log(localStorage.getItem('version') > wgtVer)
        if (localStorage.getItem('version') > wgtVer){
        	var btnArray = ['确定', '取消']
			mui.confirm("有新版本啦，是否现在更新？", '提示:', btnArray, function(e){
				console.log(JSON.stringify(e));
				if (e.index == 0) { 
					checkUpdate();
				} 
			});
        }
    });
}
if(window.plus){
    plusReady();
}else{
    document.addEventListener('plusready',plusReady,false);
}
//发起ajax请求检测是否有新版本
// 检测更新
var checkUrl="http://sdms.ecsits.com/resources/views/pack/H5641BFEE_0911120708.apk"
function checkUpdate(){
    plus.nativeUI.showWaiting("检测更新...");
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        switch(xhr.readyState){
            case 4:
            plus.nativeUI.closeWaiting();
            if(xhr.status==200){
                console.log("检测更新成功："+xhr.responseText);
                var newVer=xhr.responseText;
                console.log(newVer);
                alert(wgtVer!=newVer);
                if(wgtVer&&newVer&&(wgtVer!=newVer)){
                	downWgt();  // 下载升级包
                }
            }else{
            	console.log("检测更新失败！");
            	mui.toast("检测更新失败！");
            }
            break;
            default:
            break;
        }
    }
    xhr.open('GET',checkUrl);
    xhr.send();
}
//从服务器下载应用资源包（wgt文件）
// 下载wgt文件
var wgtUrl="http://sdms.ecsits.com/resources/views/newupdate/H5641BFEE.wgt"
function downWgt(){
    plus.nativeUI.showWaiting("正在更新...");
    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
        if ( status == 200 ){ 
            console.log("下载wgt成功："+d.filename);
            installWgt(d.filename); // 安装wgt包
        } else {
            console.log("更新失败！");
            plus.nativeUI.alert("更新失败！");
        }
        plus.nativeUI.closeWaiting();
    }).start();
}
//更新应用资源包（wgt文件）
// 更新应用资源
function installWgt(path){
    plus.nativeUI.showWaiting("正在安装...");
    plus.runtime.install(path,{},function(){
        plus.nativeUI.closeWaiting();
        console.log("安装wgt文件成功！");
        plus.nativeUI.alert("应用资源更新完成！",function(){
            plus.runtime.restart();
        });
    },function(e){
        plus.nativeUI.closeWaiting();
        console.log("安装wgt文件失败["+e.code+"]："+e.message);
        plus.nativeUI.alert("安装失败，请稍后重试！");
    });
}