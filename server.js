var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring=require('querystring');
var dns=require('dns');

http.createServer(function(req,res){
	var pathname=url.parse(req.url).pathname;
	var realPath=__dirname+'/static'+pathname;
	//console.log(realPath);
	router(pathname,req,res,realPath)
	//console.log(pathname);
	//res.writeHead(200,{'Content-type':'text/plain'});
	//res.end('hello world');
}).listen(3000);


console.log('server start port 3000');

function router(pathname,req,res,realPath){
	if(pathname=='/favicon.ico'){
		return;
	}else if(pathname=='/index' || pathname=='/'){
		goIndex(res);
	}else if(pathname=='/parse'){
		goDNS(req,res);
	}else{
		dealWithStatic(pathname,realPath,res);
	}
}

function goIndex(res){
	var readPath=__dirname+'/static/'+url.parse('index.html').pathname;
	//console.log(readPath);
	var indexPage=fs.readFileSync(readPath)	;
	res.writeHead(200,{'Content-type':'text/html'});
	res.end(indexPage);
}

function dealWithStatic(pathname,realPath,res){
	fs.exists(realPath,function(exists){
		if(!exists){
			res.writeHead(200,{'Content-type':'text/plain'});
			res.end('404');
		}else{
			//console.log(123);
			//console.log(pathname);
			var pointPostion=pathname.lastIndexOf('.');
			var mmieString=pathname.substring(pointPostion+1);
			//console.log(mmieString);
			var mmieType;
			switch(mmieString){
				case 'css':
					mmieType='text/css';
					break;
				case 'jpg':
					mmieType='image/jpeg';
					break;
				default:
					mmieType='text/plain';
					break;
			}

			//console.log(345);

			fs.readFile(realPath,'binary',function(err,file){
				if(err){
					res.writeHead(200,{'Content-type':'text/plain'});
					res.end(err);
				}else{
					//console.log(789);
					res.writeHead(200,{'Content-type':mmieType});
					res.write(file,'binary');
					res.end();
				}
			})
		}
	})
}

function goDNS(req,res){
	//var str=resAdd(req,res);
	//console.log(str);
	//使用str值进行dns转换
	var postData="";
	//var poststr="";
	req.setEncoding('utf8');
	req.addListener('data',function(postDataChunk){
		postData+=postDataChunk;
	});

	req.addListener('end',function(){
		//console.log(postData);
		var Param=querystring.parse(postData);
		//console.log(Param);
		var poststr=Param.DNS;
		if(poststr=="www.163.com"){
			res.writeHead(200,{'Content-type':'text/plain'});
		    res.end("192.168.2.3");
		}else{
			res.writeHead(200,{'Content-type':'text/plain'});
		    res.end("404");
		}
		//console.log(poststr);
		// dns.resolve4(poststr,function(err,data){
		// 	//console.log(data);
		// 	res.writeHead(200,{'Content-type':'text/plain'});
		// 	res.end(data);
		// });

	});
}

