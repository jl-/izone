/**
 *
 * Created by jl on 3/25/15.
 */
define(['Snap'],function(Snap){

    var Svg = {};

    var DURS = 400;

    var Helper = {};
    Helper.clear = function (){
        var self = this;
        self.paper.animate({
            opacity: 0
        },DURS,function(){
            self.paper.clear();
            self.paper.animate({
                opacity: 1
            },DURS);
        });
    };
    Helper.random = function(min, max){
        return Math.round(min + (max - min) * Math.random());
    };


    // timing-function
    mina.easeInOutCirc = function (n) {
        if ( ( n *= 2 ) < 1 ) return -0.5 * ( Math.sqrt( 1 - n * n ) - 1 );
        return 0.5 * ( Math.sqrt( 1 - ( n -= 2 ) * n ) + 1 );
    };



    /**
     * Snap.svg Ribbon
     * @param paper Snap.svg Paper
     * @param rectsConf x,y,w,h,fill,duration,delay
     * @constructor
     */
    function Ribbon(paper,rectsConf,clear){
        rectsConf = rectsConf.split(';');
        this.paper = paper;

        if (clear) this.paper.clear();

        this.rects  = rectsConf.map(function(conf,i){
            conf = conf.split(' ');
            var rect = paper.rect(conf[0],conf[1],conf[2],conf[3]).attr({
                fill: conf[4]
            });
            rectsConf[i] = conf;
            return rect;
        });
        this.rectsConf = rectsConf;
    }

    /// default setting for ribbon
    Ribbon.default = '0 0 0 100% l(0,0,0,1)#257669-#132e3e 1500 0;' +
                '0 0 0 100% #1e5b59 1100 400;' +
                '0 0 0 100% #132e3e 800 700;' +
                '0 0 0 100% #0e101a 600 900'; // x,y,w,h,fill,duration,delay

    Ribbon.prototype.go = function(isForward,cb,context) {
        var last = this.rects.length - 1;
        if (typeof isForward === 'function') {
            cb = isForward;
        }
        if(typeof cb === 'function') {
            cb = cb.bind(context || this);
        }
        isForward =  typeof isForward === 'boolean' ? isForward : !this.isForward;
        this.rects.forEach(function(rect,i){
            var conf = this.rectsConf[isForward ? i : last - i];
            if (isForward === this.isForward) {
                rect.attr({
                    width: isForward ? '0' : '100%'
                });
            }
            window.setTimeout(function(){
                rect.animate({
                    width: isForward ? '100%' : '0'
                },+conf[5],mina.easeinout,i === last ? cb : undefined);
            },conf[6]);
        },this);
        this.isForward = isForward;
    };
    Ribbon.prototype.forward = function(cb) {
        this.go(true,cb);
    };
    Ribbon.prototype.backward = function(cb) {
        this.go(false,cb);
    };
    Ribbon.prototype.clear = function(){
        return Helper.clear.apply(this);
    };


    /**
     * Svg.FancyText
      * @param paper
     * @param texts
     * @param conf
     * @constructor
     */
    function FancyText(paper,texts,conf){
        this.paper = paper;
        this.texts = texts;
        this.dx = [];
        this.dy = [];
        this.conf = conf || {};
        this.counter = this.conf.counter || 88;
    }

    FancyText.prototype.arrange = function(){
        var texts = this.texts;
        var centerIndex = Math.floor((texts.length - 1)/ 2);
        var centerText = texts[centerIndex];
        var RANGE = this.counter / 2;
        var i, j, ydiff;
        var dx = this.dx;
        var dy = this.dy;

        for (i = texts.length -1; i >= 0; i--) {
            dx[i] = [];
            dy[i] = [];
            for(j = texts[i].length - 1; j >= 0; j--) {
                dx[i][j] = Helper.random(-RANGE, RANGE);
                dy[i][j] = Helper.random(-RANGE, RANGE);
            }
        }

        centerText = texts[centerIndex] = this.paper.text('46%','50%',centerText).attr({
            textAnchor: 'middle',
            fill: '#00f72c',
            fontSize: '22'
        });
        this.box = centerText.getBBox();
        centerText.attr({
            dx: dx[centerIndex].join(' '),
            dy: dy[centerIndex].join(' ')
        });

        for (i = 0, j = texts.length; i < j; i++) {
            if (i !== centerIndex) {
                ydiff = i - centerIndex;
                ydiff = ydiff < 0 ? ydiff * this.box.height : (ydiff + 1) * this.box.height;
                texts[i] = this.paper.text(this.box.x - (i === 0 ? 8 : 0),this.box.cy + ydiff, texts[i]).attr({
                    fill: '#00f72c',
                    fontSize: '22'
                });
            }
        }
        return this;

    };

    FancyText.prototype.render = function(cb){
        var texts = this.texts;
        var dx = this.dx;
        var dy = this.dy;
        var counter = this.counter;

        function r(){
            if(counter-- < 0) {
                if(cb) cb();
                return;
            }
            for (var i = 0, len = texts.length; i < len; i++) {
                texts[i].attr({
                    dx: FancyText.diff(dx[i]),
                    dy: FancyText.diff(dy[i])
                });
            }
            requestAnimationFrame(r);
        }
        r();
    };

    FancyText.diff = function(origin) {
        var items = [];
        var len = origin.length;
        var item;
        while(len > 0){
            item = origin[--len];
            origin[len] = item > 0 ? item - 0.5 : (item < 0 ? item + 0.5 : item);
            items[len] = origin[len] > 0 ? 0.92 * item * item: -0.92 * item * item;
        }
        return items;
    };





    Svg.Ribbon = Ribbon;
    Svg.FancyText = FancyText;

    return Svg;
});
