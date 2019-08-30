;var xhr = (function(){
    _doAjax = function(opt){
        var o ,
            url = opt.url,
            type = (opt.type || 'GET').toUpperCase(),
            data = opt.data || null,
            dataType = (opt.dataType || 'JSON').toUpperCase(),
            async = opt.async || true,
            jsonp = opt.jsonp,
            jsonpCallBack = opt.jsonpCallBack || 'jQuery' +  new Date().getTime(),
            timeout = opt.timeout || 30000,
            t ,
            success = opt.success || function(){},
            error = opt.error || function(){},
            complete = opt.complete || function(){};
            console.log(dataType);
        if(window.XMLHttpRequest){
            o = new XMLHttpRequest();
        }else{
            o = new ActiveXObject('Microsoft.XMLHttpRequest');
        }
        if(! url){
            throw new Error('您没有输入地址');
        }
        if(dataType == 'JSONP' && type != 'GET'){
            throw new Error('在JSONP模式下一定要要get方式');
        }
        if(dataType === 'JSONP'){
            console.log(111);
            var Oscript = document.createElement('script');
            Oscript.src = url.indexOf('?') === -1
                        ? url + '?' + jsonp + '=' + jsonpCallBack
                        : url + '&' + jsonp + '=' + jsonpCallBack;
            document.body.appendChild(Oscript);
            document.body.removeChild(Oscript);
            window[jsonpCallBack] = function(datas){
                success(datas);
                console.log(222);
            }
            return;
        }
        o.open(type,url,async);
        'POST' === type && o.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        o.send('GET' === type ? '' : _setDataType(data));
        o.onreadystatechange = function(){
            if(o.readyState === 4){
                if((o.status >= 200 && o.status < 300) || o.status ===304){
                   switch(dataType){
                       case 'JSON':
                            success(JSON.parse(o.responseText));
                            break;
                       case 'TEXT':
                            success(O.responseText);
                            break;
                       case 'XML':
                            success(o.responseXML);
                            break;
                       default:
                            success(JSON.parse(o.responseText));

                   } 
                }else{
                    error();
                }     
            } 
           complete();
           clearTimeout(t);
            t = null;
            o = null;
        }
        t = setTimeout(function(){
            o.abort 
            clearTimeout(t);
            t = null;
            o = null;
            throw  new Error('本次请求抄送');

        },timeout);
    } 
    _setDataType = function(opt){
        var str =''
        for(var key in opt){
            str += key + '=' + opt[key] + '&';
        }
        console.log(str);
        return str.replace(/&$/,'');
        
    }
    xhr = {
        ajax : function(opt){
            _doAjax(opt);
        },
        post: function(url, data, dataType, successCB, errorCB, completeCB){
            _doAjax({
              type: 'POST',
              url: url,
              data: data,
              dataType: dataType,
              success: successCB,
              error: errorCB,
              complete: completeCB
            });
        },
    
        get: function(url, dataType, successCB, errorCB, completeCB){
        _doAjax({
            type: 'GET',
            url: url,
            dataType: dataType,
            success: successCB,
            error: errorCB,
            complete: completeCB
        })
        }
    };
    return xhr;

})(); 

/** 去掉空格*/
function trimSpace(data){
    return data.replace(/\s*/gim,'');
}
/**偏函数 */
Function.prototype.partial = function(){
    var _self = this,
        _args = [].slice.call(arguments);/** 将类数组变成数组*/
    return function()
    {
        var  newArgs = _args.concat(Array.slice.call(arguments));
        return fn.call(_self,newArgs);
    }
}

function tplToHtml(tpl,reg,opt){
    return tpl.replace(reg(),function(node,node){
        return opt[node];
    });
}

function regTpl(){
    return new RegExp('{{(.*?)}}','gim');
    //return /{{(.*?)}}/gim;
}

Array.prototype.myForEach = function(fn){
    var arr = this;
        arrLen = arr.length,
        arg2 = arguments[2] || window; 
    for(var i = 0; i < arrLen;i++){
        fn.apply(arg2,[arr[i],i._self]);
    }
}

Array.prototype.myfilter = function(fn){
    var arr = this,
        arrlen = arr.length,
        arg2 = argument[2] || window,
        nArray = [],
        item;
    for(var i = 0; i < arrlen; i++){
        item = deepClone({},arr[i])
        fn.apply(arg2,[arr[i],item]) ? nArray.push(item)
                                     : '';
    }
    return nArray;
}

function deepClone(target,orgin){
    var tar = target || {},
        toStr = Object.prototype.toString,
        arrType = '[object Array]';
        for(var key in orgin){
            if(typeof(orgin[key]) === 'object' && orgin[key] !== null){
               tar[key] =  toStr.call(orgin[key]) === arrType /** arrType 不一定是数组，用call*/
                                                    ? []
                                                    : {};
                deepClone(tar[key],orgin[key]);
            }else{
                tar[key] = orgin[key];
            }
        }
        return tar;
}

/** 
 * @target:函数防抖 
 */
Function.prototype.stable = function(){
        var t = null,
         _self = this;
    return function(time,execNow){
            if(t){
                clearTimeout(t);
            }
            if(true === execNow){
                var execFlag = !t;
                t = setTimeout(
                    function(){
                        t = null;
                    },time);
                if(execFlag){
                  
                }
            }else{
                t = setTimeout(
                function(){
                    _self();
                },time); 
            }
    }
}

/** 
 * @target:函数防抖 
 */
function debounce(fn,time,triggleNow){
    var t = null,
         res;
         console.log(1223);
    var debounced = function(){
        var arg = [].slice.call(arguments),
            _self = this;
        if(t){
            clearTimeout(t);
        }
        if(triggleNow){
            var execFlag = !t;
            t = setTimeout(function(){
                t = null;
            },time);
            if(execFlag){
            res = fn.apply(_self,arg);
            }
        }else{
            t = setTimeout(function(){
            res = fn.apply(_self,arg);
            },time);       
        }
        return res;
    }

    debounced.remove = function(){
        clearTimeout(t);
        t = null;
    }
    return debounced;
    
}

/** 
 * @target:函数节流
 * @ 不管中间触发多少次，都会先至少执行一次
 * 
 */
function throttle(fn,delay){
    var t = null,
        startime = new Date().getTime();
    return function(){
        var endtime = new Date().getTime(),
            args = Array.prototype.slice.call(arguments),
            _self = this;
        if(t){
            clearTimeout(t);
        }
        if(endtime - startime >= delay){
            fn.bind(_self,arg);
            startime = endtime;
        }else{
            t = setTimeout(function(){
                fn.apply(_self,arg);
            },delay);
        }
    }
}

/** 
 * @target:函数缓存数据（函数记忆）
 * @ 缓存池cache
 * 
 */
function memorize(fn){
    var cache = {};
    return function(){
        var _args = [].prototype.slice.call(arguments),
            k = arguments.length + [].join.call(arguments,',');/**将数组arguments以，的形式变成字符串 */
            return cache[k] = cache[k] || fn.apply(this,args);
    }
}

/** 
 * @target:函数科里化（函数记忆）
 * @ 
 * 
 */
function curry(fn,len){
    var len = len | fn.length,
        func = function(fn){
            var _args = [].prototype.slice.call(arguments);/* 将类数组变成数组*/
            return function(){
                var newArgs = _args.concat([].prototype.slice.call(arguments));
                return fn.apply(this,newArgs);
            }    
        }

        return function(){
            var arglen = arguments.length;
            if(arglen < len){
                var newarr = [fn].concat([].slice.call(arguments));/* 这个要问下*/
                return curry(func.apply(this,newarr),len - arglen);
            }else{
                return fn.apply(this,arguments);
            }
        }
}

/** 
 * @target:数组扁平化
 * @ 
 * 
 */
Array.prototype.flatten = function(){
    /*var arg = Array.prototype.slice.call(arguments),* 数组中不能用这个*/
    var arg = this,
        toStr = Object.prototype.toString,
        strtype = '[object Array]';
        console.log(toStr.call(this));
        console.log(arg);
        if(strtype !== toStr.call(this)){
            throw new Error('只有数据类型才行');
        }
        return   arg.reduce(function(prev,arr,index,array){
            return prev.concat(
                toStr.call(arr) === strtype 
                                ?  arr.flatten()
                                :  arr
            );    
        },[]);

}

var a = [1,2,'2',3,'dasad'];
console.log(a.flatten());