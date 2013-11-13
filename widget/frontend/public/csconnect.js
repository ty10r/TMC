/*
 * Copyright (c) 2000-2012 ChoiceStream, Inc.  All Rights Reserved
 */
(function(E,D,C){var B="CSConnect",F=function(){},A=E.console||{info:F,warn:F};if(E[B]!=C){A.warn(B+" previously loaded")}else{(function(){var AS="79964.5",AB=1,AY=[-1,-2],V=D.location.protocol,AE=V.match("^http"),z=((V==="https:")?"https":"http")+"://",N,s=D.domain.length?("."+(D.domain.match(/^.*?\.?([^\.]+\.[^\.]+)$/))[1]):C,Ai="csgid",Z="zone_id",q="reco_html",K="get_zone_pos",Af=B.toLowerCase(),P=Af+"-params",g=Af+"-rec-id",X=Af+"-item-id",v=Af+"-context",Ah=Af+"-target",Y="ccm",AT="ccp",d="m_err",AQ="a_clk",AJ="a_rld",j="m_rvw",AI,x,W="csc_g",AV=31536000000,T,Ab,Ad="csc_u",I=31536000000,AL,m,R="csc_c",M=31536000000,AP=Object.prototype.hasOwnProperty,AK=Object.prototype.toString,b=Array.prototype.slice,a=function(Am,An){var Al=0,Ak=this.length,Aj=[];for(Al;Al<Ak;Al+=1){Aj.push(Am.call(An,this[Al],Al))}return Aj},AC=D.createElement("div"),Ae=function(){return(new Date()).getTime()},p=function(Aj,Ak){return AP.call(Aj,Ak)},AD=function(Aj,Ak){return Aj[Ak]!==C},AA=function(Am,Aj,Ak){var Al;for(Al in Am){if(p(Am,Al)){if(Aj.call(Ak,Al)===false){return false}}}},r=function(Am,Ak,Al){var Aj={};AA(Am,function(An){if(Ak.call(Al,An)!==false){Aj[An]=Am[An]}},Al);return Aj},u=function(){var Aj=arguments[0];a.call(b.call(arguments,1),function(Ak){AA(Ak,function(Al){Aj[Al]=Ak[Al]})});return Aj},AX=function(Ak,Aj){return AK.call(Ak).match(/\s([a-zA-Z]+)/)[1].toLowerCase()===Aj},e=function(Aj){return AX(Aj,"object")},L=function(Aj){return AX(Aj,"array")},AW=function(Aj){return AX(Aj,"function")},Ag=function(Aj){return AX(Aj,"string")},l=function(Aj){return AX(Aj,"number")},AZ=function(Aj){return AX(Aj,"boolean")},G=function(Aj){return Ag(Aj)||l(Aj)},S=function(Aj){if(Aj==C||Aj===""){return true}else{if(L(Aj)&&Aj.length){return false}else{if(e(Aj)){return AA(Aj,function(){return false})===false?false:true}}}},AG=function(Aj){return Ag(Aj)&&Aj.replace(/\-([a-z])/g,function(Al,Ak){return Ak.toUpperCase()})},i=AC.dataset?function(Ak,Aj,Al){if(Al!==C){Ak.dataset[AG(Aj)]=Al}else{return Ak.dataset[AG(Aj)]}}:function(Ak,Aj,Al){if(Al!==C){Ak.setAttribute("data-"+Aj,Al)}else{return Ak.getAttribute("data-"+Aj)}},y={stringify:function(Ak){var Aj=[];if(e(Ak)){AA(Ak,function(Al){Aj.push('"'+Al+'":'+y.stringify(Ak[Al]))});return"{"+Aj.sort().join(",")+"}"}else{if(L(Ak)){return"["+a.call(Ak,function(Al){return y.stringify(Al)}).join(",")+"]"}else{if(AW(Ak)){return'"'+(""+Ak).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\//g,"\\/").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")+'"'}else{if(Ag(Ak)){return'"'+Ak+'"'}else{return""+Ak}}}}},parse:E.JSON?E.JSON.parse:function(Aj){return(new Function("return "+Aj))()}},h=(function(){var Ak=false,Aj=[];return function(Al,Am,An){if(AW(Am)){Aj.push([Al,Am,L(An)?An:[An]])}if(!Ak){if(!D.body){return E.setTimeout(h,1)}Ak=true}a.call(Aj,function(Ao){Ao[1].apply(Ao[0],Ao[2])});Aj=[]}}()),AR=function(Aj){return Ag(Aj)?encodeURIComponent(Aj).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A"):Aj},H=function(Aj){return Ag(Aj)?decodeURIComponent(Aj).replace(/%21/g,"!").replace(/%27/g,"'").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2A/g,"*"):Aj},o=function(Al,Ao,Am,An,Ap){var Aj="",Ak;if(Al!==C){if(Ao!==C){if(Ao===null){Am=-86400000}An=(An!==C)?"; domain="+An:"";Ap="; path="+(Ap!==C?Ap:"/");if(l(Am)){Ak=new Date();Ak.setTime(Ak.getTime()+Am);Aj="; expires="+Ak.toGMTString()}D.cookie=Al+"="+AR(Ao)+Aj+An+Ap;return Ao}else{return H((D.cookie.match(Al+"=([^;]+)")||[])[1])}}},Aa=function(){return{gid:x,uid:T,cuid:Ab,cid:AL,ccid:m,bn:AS}},w=function(Ak,Aj){return N+Ak+"/"+AI+"/"+Aj},O=function(Ak){var Aj=[];AA(Ak,function(Al){if(!S(Ak[Al])){var Am=e(Ak[Al])?y.stringify(Ak[Al]):Ak[Al];Aj.push(AR(Al)+"="+AR(Am))}});return Aj.join("&")},AM=function(Aj){Aj="Failed to "+Aj+"; "+a.call(b.call(arguments,1),function(Ak){return y.stringify(Ak)}).join("; ");A.warn(Aj);if(AB){(new Image()).src=w(AT,d)+"?"+O(u(Aa(),{msg:Aj,"_":Ae()}))}},Ac=Function.prototype.bind||function(Al){if(!AW(this)){AM("Can only bind to a function",b.call(arguments));return this}var Aj=b.call(arguments,1),Am=function(){},Ak=this,An=function(){return Ak.apply(this instanceof Am?this:Al||E,Aj.concat(b.call(arguments)))};Am.prototype=this.prototype;An.prototype=new Am();return An},J=AC.addEventListener?function(Ak,Al,Aj){Ak.addEventListener(Al,Aj,false)}:function(Ak,Al,Aj){Ak.attachEvent("on"+Al,Ac.call(Aj,Ak))},c=AC.removeEventListener?function(Ak,Al,Aj){Ak.removeEventListener(Al,Aj,false)}:function(Ak,Al,Aj){Ak.detachEvent("on"+Al,Ac.call(Aj,Ak))},k=function(){return{vx:E.pageXOffset||D.body.scrollLeft,vy:E.pageYOffset||D.body.scrollTop,vxp:E.innerWidth||D.documentElement.clientWidth,vyp:E.innerHeight||D.documentElement.clientHeight}},U=AC.getBoundingClientRect?function(Ak){var Aj=Ak.getBoundingClientRect(),Al=k();return u({rx:Aj.left+Al.vx,ry:Aj.top+Al.vy,rxp:Aj.width,ryp:Aj.height},Al)}:function(Aj){var Ak={rx:0,ry:0,rxp:Aj.offsetWidth,ryp:Aj.offsetHeight};do{Ak.rx+=Aj.offsetLeft;Ak.ry+=Aj.offsetTop}while((Aj=Aj.offsetParent)&&Aj.nodeName!=="body");return u(Ak,k(Aj))},AN=(function(){var Al=AE&&E.XMLHttpRequest&&function(){return new E.XMLHttpRequest()},Ak=!(Al&&AD(Al(),"withCredentials")),Aj=function(Am){return Am===false?"&"+O({"_":Ae()}):""};return function(An){var At=(Ag(An.type)&&(/^(?:POST|GET)$/).test(An.type))?An.type:"GET",Ap=O(An.data),Ar=An.that,Ax,As,Ao,Aq=function(Az,A1){Ao=Ae()-As;var A0=[A1,{rt:Ao,s:Az}];if(Ax!==C){E.clearTimeout(Ax)}if((Az>=200&&Az<300)||Az===304||Az===1223){if(AW(An.success)){An.success.apply(Ar,A0)}}else{if(Az===AY[1]){if(AW(An.abort)){An.abort.apply(Ar,A0)}}else{if(AW(An.error)){An.error.apply(Ar,A0)}}}if(Az!==AY[0]&&AW(An.complete)){An.complete.apply(Ar,A0)}};if(Ak||Ag(An.callback)){var Am=An.callBack||("jsonp"+(""+Math.random()).slice(2)),Aw=D.head||D.getElementsByTagName("head")[0]||D.documentElement,Av=D.createElement("script"),Ay=function(){E[B][Am]=C;try{delete E[B][Am]}catch(Az){AM("delete JSONP callback",{cb:Am,e:Az})}Aw.removeChild(Av);Aw=Av=null};E[B][Am]=E[B][Am]||function(Az){Aq(200,Az);Ay()};Av.type="text/javascript";Av.src=An.url+"?"+Ap+"&jcb="+B+"."+Am+Aj(An.cache);Av.setAttribute("async","async");Aw.insertBefore(Av,Aw.firstChild);As=Ae();if(l(An.timeout)){Ax=E.setTimeout(function(){Aq(AY[0]);E[B][Am]=function(Az){Aq(AY[1],Az);Ay()}},An.timeout)}}else{var Au=Al();if(At==="POST"){Au.open(At,An.url,true)}else{Au.open(At,An.url+"?"+Ap+Aj(An.cache),true)}Au.withCredentials=true;Au.onreadystatechange=function(){if(Au.readyState!==4){return }Aq(Au.aborted?AY[1]:Au.status,Au.responseText)};if(At==="POST"){Au.send(Ap.replace(/%20/g,"+"))}else{Au.send()}As=Ae();if(l(An.timeout)){Ax=E.setTimeout(function(){Aq(AY[0]);Au.aborted=true},An.timeout)}}if(AW(An.send)){An.send.call(Ar)}}}()),AF=function(Ak,Aj,Al){if(S(Ak)||S(Aj)||!Ag(Ak)||!Ag(Aj)){throw new SyntaxError("Object creation failed. API_KEY: "+Ak+", CONTEXT: "+Aj)}AI=Ak;this.context=Aj;this.anchors=[];this.handlers={};this.params={};if(e(Al)){AA(Al,function(Am){this.param(Am,Al[Am])},this)}},AO=function(Aj){if(G(Aj)){T=Aj;Ab=o(Ad,T,I,s)}else{AM("set uid value",{v:Aj})}return this},f=function(Aj){if(G(Aj)){AL=Aj;m=o(R,AL,M,s)}else{AM("set cid value",{v:Aj})}return this},t=function(Aj,Ak){if(Ag(Aj)&&!S(Aj)&&(G(Ak)||AZ(Ak))){this.params[Aj]=Ak}else{AM("set param value",{n:Aj,v:Ak})}return this},Q=function(Al,Ak){if(G(Al)&&!S(Al)){var Aj={"id":Al};if(!S(Ak)){if(e(Ak)){Aj.params=r(Ak,function(Am){if(!Ag(Am)||S(Am)||!(G(Ak[Am])||AZ(Ak[Am]))){AM("set anchor param value",{eid:Al,p:Am,o:Ak});return false}},this)}else{AM("set anchor params",{eid:Al,o:Ak})}}this.anchors.push(Aj)}else{AM("add anchor",{id:Al})}return this},AH=function(Ak,Aj){if(Ag(Ak)&&e(Aj)&&!S(Ak)&&!S(Aj)){this.handlers[Ak]=r(Aj,function(Al){if(!(/^on(?:Success|Error|Complete)$/).test(Al)||!AW(Aj[Al])){AM("set zoneHandlers function value",{eid:Ak,p:Al,o:Aj});return false}})}else{AM("set zoneHandlers functions",{eid:Ak,o:Aj})}return this},n=(function(){var Ak=function(Aq){try{return e(Aq)?Aq:y.parse(Aq)}catch(Ap){}},Aj=function(As,Aq,At,Ar,Ap){(new Image()).src=w(AT,AJ)+"?"+O(u(Aa(),Ar||{},{rid:As,rt:Aq,pt:At,ty:Ap,"_":Ae()}))},An=(function(){var Ap={},Aq=function(){var Ar=k();Ap=r(Ap,function(Au){var At=Ap[Au].dims,As=Ap[Au].buffer;if(!((As.y>Ar.vy+Ar.vyp)||(As.x>Ar.vx+Ar.vxp)||(As.yp<Ar.vy)||(As.xp<Ar.vx))){(new Image()).src=w(AT,j)+"?"+O(u(Aa(),At,Ar,{rid:Au,"_":Ae()}));return false}});if(S(Ap)){c(window,"scroll",Aq)}};return function(Ar){if(S(Ap)){J(window,"scroll",Aq)}Ap[Ar.rid]={dims:Ar.dims,buffer:{x:Ar.dims.rx+Ar.buffer.x,y:Ar.dims.ry+Ar.buffer.y,xp:Ar.dims.rx+Ar.dims.rxp-Ar.buffer.x,yp:Ar.dims.ry+Ar.dims.ryp-Ar.buffer.y}};Aq()}}()),Ao=function(Ap){Ap=Ap||E.event;var At=Ap.target||Ap.srcElement||D,As=this.id,Ar,Aq;if(Ap.type==="keydown"){Ar=Ap.keyCode||Ap.which;if(l(Ar)&&Ar!==13){return }}if(S(As)){AM("Track click element does not have an ID")}else{while(S(Aq=i(At,g))){if(At.id===As||At.nodeName==="body"){return }At=At.parentNode}(new Image()).src=w(AT,AQ)+"?"+O(u(Aa(),{rid:Aq,id:i(At,X),c:i(At,v),t:i(At,Ah),"_":Ae()}))}At=null},Am=function(Ap,Aq,Ar){if(p(Ap,Aq)){try{Ap[Aq].call(E,Ar)}catch(As){A.warn(As);AM("process zoneHandler",{p:Aq,o:Ap[Aq]});if(Aq==="onSuccess"){Am(Ap,"onError",Ar)}return false}}return true},Al=function(Ax,Ap,As,Au){var Av=Ae(),Ar=D.getElementById(Ax),At=Ap.attributes,Aq=At.response_id,Az=function(A1){var A0,A2;if(Am(As,"onSuccess",Ap)){if((A0=At[K])&&e(A0)){A2=U(Ar);An({rid:Aq,dims:A2,buffer:A0})}Aj(Aq,Au.rt,Ae()-Av,A2,A1)}},Ay=function(A0){Am(As,"onError",Ap);AM.apply(this,[A0,{eid:Ax,rt:Au.rt,rid:Aq,pt:Ae()-Av}])};if(Ap.status.code===0){if(Ar!==null&&Ar.nodeType===1){J(Ar,"mousedown",Ao);J(Ar,"keydown",Ao);if(p(Ap,q)){try{while(Ar.hasChildNodes()){Ar.removeChild(Ar.firstChild)}if((Ar.innerHTML+=Ap.reco_html||"")!==""){Az("html")}else{Ay("update element with response HTML")}}catch(Aw){Ay("update element")}}else{Az("json")}}else{Ay("find element or it has a nodeType not equal to 1")}Am(As,"onComplete",Ap);Ar=null}else{Am(As,"onError",Ap);Am(As,"onComplete",Ap);AM("update reco zone due to server error",{eid:Ax,rt:Au.rt,rid:Aq,pt:Ae()-Av})}};return function(Ap){if(this.sent){AM("resend request (requests can only be sent once)",{o:this});return }if(!S(Ap)){if(l(Ap)){this.timeout=Ap}else{AM("set send delay value",{to:Ap,o:this})}}if(D.webkitHidden){J(D,"webkitvisibilitychange",Ac.call(this.send,this));return }else{c(D,"webkitvisibilitychange",Ac.call(this.send,this))}AN({url:w(Y,this.context),cache:false,timeout:this.timeout,data:u(Aa(),{j:y.stringify({params:this.params,anchors:this.anchors})}),that:this,send:function(){this.sent=true},success:function(As,Aq){var Ar=Ak(As),At={};if(!e(Ar)){AM("parse response to an object on success",{o:this,rt:Aq.rt,re:As});AA(this.handlers,function(Au){Am(this.handlers[Au],"onError");Am(this.handlers[Au],"onComplete")},this);return }if(p(Ar,Ai)){x=o(W,Ar[Ai],AV,s)}if(p(Ar,"status")&&Ar.status.code===0){a.call(Ar.reco_sets,function(Av){var Au=Av.attributes,Aw=Au[Z];h(this,Al,[Aw,Av,p(this.handlers,Aw)?this.handlers[Aw]:{},Aq]);At[Aw]=true},this)}AA(this.handlers,function(Au){if(!p(At,Au)){Am(this.handlers[Au],"onError");Am(this.handlers[Au],"onComplete")}},this)},error:function(Ar,Aq){if(Aq.s!==AY[0]){AM("respond without error",{o:this,rt:Aq.rt,re:Ar})}AA(this.handlers,function(As){Am(this.handlers[As],"onError");Am(this.handlers[As],"onComplete")},this)},abort:function(As,Aq){var Ar=Ak(As);if(!e(Ar)){AM("parse response to an object on timeout",{o:this,rt:Aq.rt,re:As})}else{a.call(Ar.reco_sets,function(At){AM("respond before timeout",{o:this,rt:Aq.rt,rid:At.attributes.response_id})},this)}}})}}()),AU=function(){AF.apply(this,arguments)};AU.prototype={uid:function(){return AO.apply(this,arguments)},cid:function(){return f.apply(this,arguments)},param:function(){return t.apply(this,arguments)},anchor:function(){return Q.apply(this,arguments)},zoneHandlers:function(){return AH.apply(this,arguments)},send:function(){n.apply(this,arguments)}};a.call(D.scripts||D.getElementsByTagName("script"),function(Aj){var Ak=Aj.src.match(/(?:\w+:\/\/|)(.+)csconnect\.js$/),Al;if(Ak){Al=y.parse(i(Aj,P)||"{}");N=Al.endpoint||z+Ak[1]}});E[B]=AU;if(!S(x=o(W))){x=o(W,x,AV,s)}if(!S(Ab=o(Ad))){Ab=o(Ad,Ab,I,s)}if(!S(m=o(R))){m=o(R,m,M,s)}A.info(B+" loaded")}())}}(window,document))
