(function(){define(["jquery-private","knockout","gcviz-i18n","gcviz-func","gcviz-gislegend","gcviz-ko"],function(c,d,f,h,g){var a,b,e;a=function(l,j,k){var i=function(p,n,o){var m=this;m.mymap=h.getElemValueVM(n,["map","map"],"js");m.tpVisible=f.getDict("%toolbarlegend-tgvis");m.baseMap=f.getDict("%toolbarlegend-base");m.init=function(){m.layersArray=d.observableArray(o.items);m.basesArray=d.observableArray(o.basemaps);setTimeout(function(){m.changeItemsVisibility()},1000);return{controlsDescendantBindings:true}};m.determineCSS=function(q,r){if(r.last===true){if((r.displaychild.enable||r.customimage.enable)&&r.expand){return"gcviz-leg-imgliopen"}else{return"gcviz-leg-imgli"}}else{if(r.expand){return"gcviz-leg-imgliopen"}else{return"gcviz-leg-imgli"}}};m.openMetadata=function(r){var q=r.href;if(q!==""){window.open(q,"_blank")}};m.createSymbol=function(r,q){var s=r.displaychild;if(s.enable&&typeof s.symbol!=="undefined"){g.getFeatureLayerSymbol(s.symbol,q,r.graphid)}if(!r.expand){c(q).toggle()}};m.changeItemsVisibility=function(t,r){var q,u=m.basesArray().length,s=m.layersArray().length;if(typeof r!=="undefined"){t.visibility.initstate=r.target.checked}while(u--){q=m.basesArray()[u];b(m.mymap,q,q.visibility.initstate,b)}while(s--){q=m.layersArray()[s];b(m.mymap,q,q.visibility.initstate,b)}return true};m.switchRadioButtonVisibility=function(s,r,q){r.visibility.initstate=q;g.setLayerVisibility(s,r.id,q);m.changeItemsVisibility()};m.changeServiceOpacity=function(r,q){g.setLayerOpacity(m.mymap,r,q)};m.toggleViewService=function(r,u){var v=32,q=c(u.target),t=q.parent().parent(),s=q[0].className;if(u.type!=="keyup"||(u.type==="keyup"&&u.keyCode===v)){if(s==="gcviz-leg-imgli"){q.removeClass("gcviz-leg-imgli");q.addClass("gcviz-leg-imgliopen")}else{if(s==="gcviz-leg-imgliopen"){q.removeClass("gcviz-leg-imgliopen");q.addClass("gcviz-leg-imgli")}}t.children("div#childItems.gcviz-legendHolderDiv").toggle();t.children(".gcviz-legendSymbolDiv").toggle();t.children("div#customImage.gcviz-legendHolderImgDiv").toggle();u.stopPropagation()}};m.init()};b=function(p,o,n){var m=o.items;if(!o.visibility.initstate){n=false}if(m.length>0){Object.keys(m).forEach(function(q){b(p,m[q],n,b)})}else{g.setLayerVisibility(p,o.id,n)}};e=new i(l,j,k);d.applyBindings(e,l[0]);return e};return{initialize:a}})}).call(this);