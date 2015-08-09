	function sNav(NavClass){
		var _this=this;
		//获得所有sNav
		var oNav=_this.getByClass(document,NavClass)[0];
		var aItem=oNav.getElementsByTagName('li');
		this.aHoverItem=[];
		this.aA=oNav.getElementsByTagName('a');
		for (var i =0; i < aItem.length; i++) {
			//获取原Item样式
			var itemWidth=aItem[i].offsetWidth;
			var itemHeight=oNav.offsetHeight;
						
			var oHoverItem=document.createElement('span');
			this.aHoverItem.push(oHoverItem);
		
			//创建滑动容器并设置好位置
			var itemWrap=document.createElement('div');
			this.aA[i].appendChild(itemWrap);
			itemWrap.appendChild(oHoverItem);
			itemWrap.appendChild(aItem[i]);

			//布局转换
			itemWrap.style.position='absolute';
			itemWrap.style.background='yellow';
			//最外层容器占位
			this.aA[i].style.width=itemWidth+'px';
			this.aA[i].style.height=itemHeight+'px';
			//设置itemWrap的Top值
			itemWrap.style.top=-itemHeight+'px';
			//传递参数-滑动距离
			itemWrap.slideHeight=itemHeight;
			//设置item样式
			aItem[i].style.padding='0';
			aItem[i].style.lineHeight=itemHeight+'px';
			//设置oHoverItem样式
			oHoverItem.style.height=itemHeight+'px';
			oHoverItem.style.width=itemWidth+'px';
			oHoverItem.style.display='block';
			oHoverItem.style.lineHeight=itemHeight+'px';
			oHoverItem.innerHTML=this.hoverText?this.hoverText:aItem[i].innerHTML;

			//绑定事件
			function eventRegister(itemWrap){
				_this.myAddEvent(itemWrap,'mouseover',function(ev){
					_this.hoverIn(ev,itemWrap);
				});
				_this.myAddEvent(itemWrap,'mouseout',function(ev){
					_this.hoverOut(ev,itemWrap);
				});
			}
			eventRegister(itemWrap);
			
		}	
		//默认参数设置
		this.slideSpeed=8;
	}
	
	sNav.prototype.setText=function(json){
		//设置hoverItem内容
		for (var i in json) {
			this.aHoverItem[i].innerHTML=json[i];
		};
	}

	sNav.prototype.hoverIn=function(ev,itemWrap){
		this.startMove(itemWrap,{'top':0});
	}

	sNav.prototype.hoverOut=function(ev,itemWrap){
		this.startMove(itemWrap,{'top':-itemWrap.slideHeight});
	}

	 sNav.prototype.startMove=function(obj,json,fn){
		var nowAttr;
		var speed;
		var k=this.slideSpeed;
		var delay=20;
		var _this=this;
		clearInterval(obj.moveTimer);
		obj.moveTimer=setInterval(function(){
			var stop=true;
			for(var attr in json){
				var gotStyle=_this.getStyle(obj,attr);
				var target=json[attr];
				nowAttr=parseInt(gotStyle, 10);
				if(nowAttr!=target){
					stop=false;
				}
				if(stop){
					clearInterval(obj.moveTimer);
					fn&&fn(); 
				}else{
					speed=(target-nowAttr)/k;
					speed=target>nowAttr?Math.ceil(speed):Math.floor(speed);

					obj.style[attr]=(nowAttr+speed)+"px";
				}
			}	
		}, delay);
	}

	 sNav.prototype.myAddEvent=function(obj,evName,fn){
		if (obj.attachEvent){//IE
			obj.attachEvent('on'+evName,function(){
				fn.call(this);//避免this被修改
			});
		}else{
			obj.addEventListener(evName, fn , false);
		}
	}
	sNav.prototype.getByClass=function(oParent,className){
		var aResult=[];
		var arr=oParent.getElementsByTagName('*');
		var re=new RegExp('\\b'+className+'\\b',i);

		for (var i = 0; i < arr.length; i++) {
			if(re.test(arr[i].className)){
				aResult.push(arr[i]);
			}
		};
		return aResult;
	}
	sNav.prototype.getStyle=function(obj,attr){
		var value;
		if(window.getComputedStyle){//IE
			value = getComputedStyle(obj,false)[attr];
		}else{
			value = obj.currentStyle[attr];
		}
		value=parseInt(value,10);
		return value;
	}