JQuery源码解读



JQ的一些扩展工具方法（ 妙味讲堂 - 视频笔记 - 第四部分）


1、parseJSON()

JSON.parse()   // 解析字符串类型的JSON


2、eval()  //解析任何格式JSON，性能差




3、parseXML() // 字符串转DOM对象

// 源码实现
parseXML: function(data) {
  var xml, tmp;
  if (!data || typeof data !== "string") {
    return null;//只能解析字符串类型
  }
  try {
    tmp = new DOMParser(); //IE9+
    xml = tmp.parseFromString(data, "text/xml");
  }
  catch (e) {
    xml = null;
  }
  if (!xml || xml.getElementsBysTagName("parsererror").length) {
    jQuery.error("Invalid XML:" + data);
  }
  return xml;
}




4、globalEval()


function test() {
  var newVar = true
}

test();
console.log(newVar)  // 报错





function test1() {
  globalEval("var newVar = true");
}

console.log(newVar) //true



// 解析全局变量
globalEval: function(code) {
  var script, ; indirect = eval;
  code = jQuery.trim(code)

  if (code) {
    if (code.indexOf("use strict ") == 1) {
      script = document.createElement("script");
      script.text = code;
      document.head.appendChild(script).parentNode.removeChild(script);
    }
    else {
      indirecct(code);
    }
  }
}


6、camelCase() //转驼峰


7、nodeName();// 是否制定节点名


8、each()//遍历

var arr = [1, 2, 34, 34, 343,];

$.each(arr.function(i, value){
  console.log(value)
})



// 源码实现
each: function(obj, callback, args) {
  var value,
    i = 0,
    length = obj.length,
    isArray = isArraylike(obj);
  if (args) {
    if (isArray) {
      for (; i < length; i++) {
        value = callback.apply(obj[i], args);
        if (value === false) {
          breack;
        }
      }
    }
    else {
      if (isArray) {
        for (; i < length; i++) {
          value = callback.call(obj[i], i, obj[i]);
          if (value === false) {
            break;
          }
        }
      }
      else {
        for (i in obj) {
          value = callback.call(obj[i], i, obj[i]);
          if (value === false) {
            break;
          }
        }
      }
    }
  }
}



10、trim()//去掉前后空格

// 源码实现
trim: function(text) {
  return text === null ? "" : core_trim.call(text)
}




11、makeArray();//类数组，字符串，JSON转数组



makeArray: function(arr, results) {
  var ret = results || [];
  if (arr != null) {
    if (isArraylike(Object(arr))) {
      //merge 拼接数组
      jQuery.merge(ret, typeof arr === "string" ? [arr] : arr)
    }
    else {
      // 单个直接push
      core_push.call(ret, arr);
    }
  }
  return ret;
}

 
// 判断类数组
12、
function isArraylike(obj) {
  var length = obj.length;
  type = jQuery.type(obj);
  if (jQuery.isWindow(obj)) {
    reutrn false;
  }
  if (obj.nodeType === 1 && length) {
    return false;
  }
  return type === "array" || type !== "function" && (
    length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj
  )
}

13、
// 拼接数组
merge:function(first,second){
   var f = first.length;
   var i = second.length;
   var j = 0;
   if(typeof l ==="number"){   //有length属性,判断是不是数组或类数组，JSON没长度
      for(;j<length;j++){
        first[i++] = second[j]
      }
   }
   else{
    //  second[j++] 下标是0,1,2,3的JSON
     while(second[j]!=undefined){ 
         first[i++] =  second[j++];
     }
   }
   first.length = i;
   return first;
}


// 存在key
inArray(key);//数组
indexOf(key);//字符串



14、
grep();// 过滤新数组

// 实例
var arr = [1,2,3,4];
$.grep(arr,function(n,i){
    return n>2;//大于2 的值作为新数组返回
},
 ture // 反向取值，小于2的值作为新数组返回
)


// 源码实现
grep:function(elems,callback,inv){
     var retVal,
     ret = [],
     i =0,
     length = elems.length,
     inv = !! inv;
     for(;i<length;i++){
       retVal = !!callback(elemes[i],i);
         if(inv === retVal){
             ret.push(elems[i])
         }
       }
     }
     return ret;
}

// 映射
map:function(elems,callback,arg){
    var value,
    i =0,
    length = elems.length,
    isArray = isArraylike(elemes),
    ret = [],

    if(isArray){
      for(;i<length;i++){
          value = callback(elems[i],i,arg);
          if(value!=null){
              ret[ret.length] = value;
          }
      }
    }
    else{
       for(i in elemes){
           value = callback(elems[i],i,args);
           if(value!=null){
               ret[ret.length] = value;
           }
       }
    }
    //  flatten any nested arrays 展平任何嵌套数组
    return core_concat.apply([],ret);
    
}



guid 1;// 全局唯一对象标识符



proxy();// 修改this指向


function show(n){
  console.log(n)
  console.log(this);
}

show(1);//this 指向window

$.proxy(show,document,1)();// this指向document
$.proxy(show,document)(1);// this指向document
// 两种传参



$.proxy(obj,"show")  ==  $.proxy(obj.show,obj);


// 源码实现

proxy:function(fn,context){
    var tmp,args,proxy;
     if(typeof context ==="stirng"){
       tmp = fn[contenxt];
       context = fn;
       fn = tmp;
     }
     if(!jQuery.isFunction(fn)){
         return undefined;
     }

    //  传参 从第三个开始合并参数
     args = core_slice.call(arguments,2);
     proxy = function(){
      //  core_slice.call(arguments)转数组
       return fn.apply(context||this,args.concat(core_slice.call(arguments)))
     }
    // guid 唯一标识
     proxy.guid = fn.guid||jQuery.guid++;
     return proxy;

}



access();//多功能值操作



$().css().attr();// get.set 操作


$("div").css("color");//获取

$("div").css("color","red");


// 对象
$("div").css({
  background: "red",
  color: "white"
})

// 源码实现

access:function(elems,fn,key,value,chainable,emptyGet,raw){
  var i=0,
  length = elems.length,
  bulk = key== null;
  // set many value
  if(jQuery.type(key)==="object"){
    chainable = true;
    for(i in key){
      jQuery.access(elems,fn,i,key[i],true,emptyGet,raw)
    }
  }
  else if(value!==undefined){
      chainable = true;
      if(!jQuery.isFunction(value)){ //不是函数
        raw = true;
      }
      if(bulk){   //  有bulk值 字符串
           if(raw){ 
                fn.call(elems,value);
                fn = null;
           }
           else{  // value 是函数的情况
             bulk = fn;
             fn = function(elem,key,value){
               return bulk.call(jQuery(elem),value);
             }
           }
      }
      if(fn){// 
        for(;i<length;i++){
            fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)))
        }
      }
  }


  // set one value

}



// 获取当前时间，时间戳 new Date().getTime();
now(); // Date.now







$("div").width();//能获取display=none的元素，将display转为visibility: hidden;position: absolute;

$("div").get(0).offfsetWidth();//不能获取display=none的元素



// 节点属性替换，获取属性
swap:function(elem,options,callback,args){
  var ret,name,
  old = {};
  
  // 把新的属性值给到节点元素
  for(name in options){
      old[name] = elem.style[name];
      elem.style[name] = optons[name];
  }

  ret = callback.apply(elem,arg||[]);  //获取属性值

  
// 把旧的属性重新给节点元素设置回去
  for(name in options){
     elem.style[name] = old[name];
  }

  return ret;
}




jQuery.ready.promise = function(){} // 检测DOM测一步操作（内部使用）

function isArraylike(){}  //类数组的判断（内部使用）



