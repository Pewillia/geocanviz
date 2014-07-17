(function(){define(["jquery-private","gcviz-func","gcviz-gisgeo","gcviz-gislegend","dojox/data/CsvStore","esri/layers/FeatureLayer","esri/SpatialReference","esri/geometry/Point"],function(j,m,o,e,i,h,l,k){var n,g,b,f,d,c,a;n=function(q,t,p){var x=["lat","latitude","y","ycenter"],s=["lon","long","longitude","x","xcenter"],w=t.substr(0,t.indexOf("\n")),v=b(w),u=new i({data:t,separator:v}),r=j.Deferred();u.fetch({onComplete:function(K){var D,A,z,Q,M,G,F,O,N,J,H,R,L,I=q.vWkid,P=[],y=0,B=u.getAttributes(K[0]),C=B.length,E=K.length;d=f(u,K);c=p;a=q;while(C--){z=B[C];if(m.checkMatch(x,z)){D=z}if(m.checkMatch(s,z)){A=z}}if(typeof D==="undefined"||typeof A==="undefined"){r.resolve(1)}else{if(typeof u.separator==="undefined"){r.resolve(2)}}while(E--){Q=K[E];M=u.getAttributes(Q);G={};F=M.length;while(F--){O=M[F];N=Number(u.getValue(Q,O));G[O]=isNaN(N)?u.getValue(Q,O):N}G.__OBJECTID=y;y++;J=parseFloat(G[D]);H=parseFloat(G[A]);if(isNaN(J)||isNaN(H)){return}R=new l({wkid:4326}),L=new k(H,J,R);L.attributes=G;P.push(L)}setTimeout(function(){o.projectPoints(P,I,g);r.resolve(0)},0)},onError:function(y){r.resolve(y.message)}});return r};g=function(s){var u,r,t,q,p=s.length;while(p--){t=s[p];q=t.attributes,delete t.attributes;r={geometry:t,attributes:q};d.featureSet.features.push(r)}u=new h(d,{id:c});a.addLayer(u);e.getFeatureLayerSymbol(JSON.stringify(u.renderer.toJson()),j("#symbol"+c)[0],c)};b=function(r){var t,u,s=[",","      ",";","|"],v=0,q="",p=s.length;while(p--){u=s[p],t=r.split(u).length;if(t>v){v=t;q=u}}return q};f=function(w,t){var v,u,q,x,r=w.getAttributes(t[0]).reverse(),s=r.length,p={layerDefinition:null,featureSet:{features:[],geometryType:"esriGeometryPoint"}};p.layerDefinition={geometryType:"esriGeometryPoint",objectIdField:"__OBJECTID",type:"Feature Layer",typeIdField:"",drawingInfo:{renderer:{type:"simple",symbol:{type:"esriSMS",style:"esriSMSCircle",color:m.getRandomColor(),size:10,angle:0,xoffset:0,yoffset:0}}},fields:[{name:"__OBJECTID",alias:"__OBJECTID",type:"esriFieldTypeOID",editable:false,domain:null}],types:[],capabilities:"Query"};while(s--){u=r[s];v=w.getValue(t[0],u);q=Number(v);x={name:u,alias:u,type:"",editable:true,domain:null};if(isNaN(q)){x.type="esriFieldTypeString"}else{x.type="esriFieldTypeDouble"}p.layerDefinition.fields.push(x)}return p};return{addCSV:n}})}());