;var InitSearch = (function(){
    var Search = function(node){
        this.node = node;
        this.init();
    };

    Search.prototype = {
        init: function(){
            var data ,
                _self = this;
            data = _self.getData(_self.node);
            _self.setData(data);
            _self.bindEvent();
        },

        bindEvent: function(){
            var _self = this,
                getData = _self._getDataFromInput.bind(_self);
                console.log(this.searchInput);
               
                this.searchInput.addEventListener('input', debounce(getData,500,false),false);
        },

        getData: function(data){
            return JSON.parse(data.getAttribute('data-config'));
        },

        setData: function(data){
            console.log(data.input);
            this.searchInput = document.getElementsByClassName(data.input)[0];
            this.wdList = document.getElementsByClassName(data.wdList)[0];
            this.ListTpl = document.getElementById(data.ListTpl).innerHTML;
        },

        _getDataFromInput: function(){
            var _self = this,
                val =   trimSpace(_self.searchInput.value),
                valLen = val.length;
            if(valLen > 0){
                _self._getDataFromJSONP(val);
            }
            else{
				_self.wdList.innerHTML = '';
                    _self.wdList.style.display = 'none';
			}
        },
	
        _getDataFromJSONP: function(value){
            var _self = this;
            xhr.ajax({
                url: 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd='+ value,
                type: 'GET',
                dataType: 'JSONP',
                jsonpCallBack: '',
                jsonp: 'cb',
                //https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=&oq=%25E4%25BA%E4%BA%AC%E4%B8%9C%25AC%25E4%25B8%259C&rsv_pq=b66ffe3300055424&rsv_t=33b2aUAeT%2B025Orp9d2H%2F9iD9OjkE8jzS6L0ooCqSVyYd0KwI6HAqeFN1HI&rqlang=cn&rsv_enter=0
                success: function(data){
                    console.log(data);
                    _self._render(data);
                }
            })
        },

        _render: function(data){
            var _self = this,
                list = '',
                data = data.s
                val =   trimSpace(_self.searchInput.value),
                valLen = val.length;
                if(valLen){
                    data.forEach(function(arr,index){
						console.log(_self._setStyle(val,arr));
                        if(index <=3){
                            list += _self.ListTpl.replace(/{{(.*?)}}/gim,function(node,key){
                                return{
                                    wdLink:arr,
                                    wd:_self._setStyle(val,arr)
                                }[key];
                            })
                        }
                    });
					console.log(list);
                    _self.wdList.innerHTML = list;
                    _self.wdList.style.display = 'block';
                }
                else{
					console.log(555);
                    _self.wdList.innerHTML = '';
                    _self.wdList.style.display = 'none';
                }
        },
		
		_setStyle: function(value,word){
			;
			return '<span class = "font-normal">' + value+ '</span>' + word.replace(value,'');
		}
    };
    return Search;
    
})();

new InitSearch(document.getElementsByClassName('search-wrap')[0]);