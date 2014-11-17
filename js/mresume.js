var width = window.innerWidth;
var height = window.innerHeight;


//构造函数
function Resume(opts){
  //构造函数需要的参数
  this.outer = opts.outer;

  //构造三步奏
  this.init();
  this.renderDOM();
  this.bindDOM();
}

//第一步 -- 初始化
Resume.prototype.init = function() {
  this.divs = this.outer.getElementsByTagName('li');
  this.len = this.divs.length;

  //设定初始的索引值
  this.idx = 0;
};

//第二步 -- 渲染DOM
Resume.prototype.renderDOM = function() {
  for (var i = 0; i < this.len; i++) {
    this.divs[i].style.height = height;
    this.divs[i].style.webkitTransform = 'translate3d(0px, '+ (i)*height +'px, 0px)';
  }
};

//第三步 -- 绑定 DOM 事件
Resume.prototype.bindDOM = function(){
  var self = this;
  var scaleW = height;
  var outer = self.outer;
  var len = self.len;

  //手指按下的处理事件
  var startHandler = function(evt){

    //记录刚刚开始按下的时间
    self.startTime = new Date() * 1;

    //记录手指按下的坐标
    self.startY = evt.touches[0].pageY;

    //清除偏移量
    self.offsetY = 0;

    //事件对象
    var target = evt.target;
    while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
      target = target.parentNode;
    }
    self.target = target;

  };

  //手指移动的处理事件
  var moveHandler = function(evt){
    //兼容chrome android，阻止浏览器默认行为
    evt.preventDefault();

    //计算手指的偏移量
    self.offsetY = evt.touches[0].pageY - self.startY;

    var lis = outer.getElementsByTagName('li');
    //起始索引
    var i = self.idx - 1;
    //结束索引
    var m = i + 3;

    //最小化改变DOM属性
    for(i; i < m; i++){
      lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
      lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+ ((i-self.idx)*height + self.offsetY) +'px, 0)');
    }
  };

  //手指抬起的处理事件
  var endHandler = function(evt){
    evt.preventDefault();

    //边界就翻页值
    var boundary = height/6;

    //手指抬起的时间值
    var endTime = new Date() * 1;

    //所有列表项
    var lis = outer.getElementsByTagName('li');

    //当手指移动时间超过300ms 的时候，按位移算
    if(endTime - self.startTime > 300){
      if(self.offsetY >= boundary){
        //进入上一页
        self.goIndex('-1');
      }else if(self.offsetY < 0 && self.offsetY < -boundary){
        //进入下一页
        self.goIndex('+1');
      }else{
        self.goIndex('0');
      }
    }else{
      //优化
      //快速移动也能使得翻页
      if(self.offsetY > 50){
        self.goIndex('-1');
      }else if(self.offsetY < -50){
        self.goIndex('+1');
      }else{
        self.goIndex('0');
      }
    }
  };

  //绑定事件
  outer.addEventListener('touchstart', startHandler);
  outer.addEventListener('touchmove', moveHandler);
  outer.addEventListener('touchend', endHandler);
}

Resume.prototype.goIndex = function(n){
  var idx = this.idx;
  var lis = this.outer.getElementsByTagName('li');
  var len = lis.length;
  var cidx;

  //如果传数字 2,3 之类可以使得直接滑动到该索引
  if(typeof n == 'number'){
    cidx = idx;
  //如果是传字符则为索引的变化
  }else if(typeof n == 'string'){
    cidx = idx + n*1;
  }


  //当索引右超出
  if(cidx > len-1){
    cidx = len - 1;
  //当索引左超出  
  }else if(cidx < 0){
    cidx = 0;
  }

  //保留当前索引值
  this.idx = cidx;

  //改变过渡的方式，从无动画变为有动画
  lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
  lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
  lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

  //改变动画后所应该的位移值
  lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
  lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(0, -'+ height +'px, 0)');
  lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d(0, '+ height +'px, 0)');
};



//初始化Resume 实例
new Resume({
  outer : document.getElementById('outer')
});

// var tmp = document.getElementById('aboutme');
// console.log(tmp.getElementsByTagName('div')[0].offsetHeight);

var h_aboutme_title = document.getElementById('aboutme-title').offsetHeight;
var aboutme_detail = document.getElementById('aboutme-detail');
var aboutme_tds = aboutme_detail.getElementsByTagName('td');
var len = aboutme_tds.length;
var i = 0;
var td_height = Math.floor((window.innerHeight - h_aboutme_title) / 14.4);
console.log('h-title:'+h_aboutme_title);
console.log('h-detail:'+aboutme_detail.offsetHeight);
for (i=0; i < len; i++) {
  aboutme_tds[i].style.lineHeight = td_height + 'px';
}