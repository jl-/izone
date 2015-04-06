/**
 *
 * Created by jl on 3/26/15.
 */
define(['jquery','Snap','Svg','svgAssets'],function($,Snap,Svg,svgAssets){
    var appSvg = {};
    var $prefaceToAbout = $('#preface-to-about');



    var preface = appSvg.preface = {};
    preface.loaderIndicators = '425 300 455 300,465 300 495 300,505 300 535 300,545 300 575 300'.split(',');
    preface.paper = Snap('#preface-svg');
    preface.loaders = null;

    preface.showLoader = function() {
        var line = null;
        preface.paper.clear();
        preface.loaders = preface.paper.g();
        preface.loaderIndicators.forEach(function(indicator){
            indicator = indicator.split(' ');
            line = preface.paper.line(indicator[0], indicator[1], indicator[2], indicator[3]).attr({
                fill: 'none',
                stroke: '#ffffff',
                strokeLinecap: 'round',
                opacity: 0
            });
            line.addClass('blip');
            preface.loaders.add(line);
        });
    };
    preface.hideLoader = function(cb){
        preface.loaders.animate({
            opacity: 0
        },800,cb);
    };

    preface.greet = function(){
        preface.ribbon = new Svg.Ribbon(preface.paper,Svg.Ribbon.default,true);
        preface.ribbon.forward(function(){
            /// fancy text
            var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
            var texts = '/**,* from @Jl ...,* with @love..,*********************************/'.split(',');
            var fancyText = new Svg.FancyText(preface.paper,texts);
            fancyText.arrange().render(function(){
                // draw signature
                drawPath(preface.paper,svgAssets.code,{stroke: '#00f72c'},function(){
                    $prefaceToAbout.fadeIn(200);
                    activePage();
                }).transform('translate(880,520) scale(1)');
            });
        });
    };



    var motto = appSvg.motto = {};
    motto.paper = Snap('#motto-svg');
    motto.drawGrid = function (){
        var WIDTH = 1000, HEIGHT = 600, STEP = 20;
        var group = motto.paper.g();
        var grid = null;
        var pixel = null;
        var path = [];
        var i, j;
        for (i = 200; i < 400; i += STEP) {
            if (i < WIDTH) {
                path.push('M' + i + ',200l0,220');
            }
            if (i < HEIGHT) {
                path.push('M180,' + (i + STEP) + 'l220,0');
            }
        }
        path = path.join('');
        path = 'M200,200l300,0M300,100l0,400';
        grid = drawPath(motto.paper,path,{stroke: '#ff4aff',strokeWidth: 0.4,durs: 1800},function(){
            pixel = motto.paper.rect(300,200,8,8).attr({
                stroke: '#fff',
                fill: 'none',
                strokeWidth: 1
            });
            $('.motto-detail').addClass('bounceInRight');
        });
        group.add(grid)

    };


    var web = appSvg.web = {};
    web.paper = Snap('#web-svg');

    web.drawDevices = function(){
        var webGroup = web.paper.g();
        var macGroup = web.paper.g();
        var tabletGroup = web.paper.g();
        var mobileGroup = web.paper.g();
        var wordGroup = web.paper.g();
        var mac =  {};
        var tablet = {};
        var mobile = {};
        function drawMac(cb){
            var macPath = svgAssets.web.mac;
            var macContent = svgAssets.web.mac.content;
            macGroup.transform('translate(160,140) scale(1)');
            mac.content = {};
            mac.bottom = drawPath(web.paper,macPath.bottom,{
                stroke: '#f5f7fa',
                strokeWidth: 4,
                durs: 1600,
                fill: 'none'
            },function(){
                mac.bottom.attr({
                    fill: '#f5f7fa'
                });
                mac.screen = drawPath(web.paper,macPath.screen,{
                    stroke: '#434a53',
                    strokeWidth: 14,
                    durs: 800
                },function(){
                    mac.content.left = drawRect(web.paper,macContent.left);
                    macGroup.add(mac.content.left);

                    mac.content.buttons = macContent.buttons.map(function(button){
                        var b = drawRect(web.paper,button);
                        macGroup.add(b);
                        return b;
                    });

                    mac.content.leftCenter = drawRect(web.paper,macContent.leftCenter,function(){
                        mac.content.right = drawRect(web.paper,macContent.right);
                        macGroup.add(mac.content.right);
                    });
                    macGroup.add(mac.content.leftCenter);
                });
                macGroup.add(mac.screen);
            });
            macGroup.add(mac.bottom);
        }
        function drawTablet(){
            var tabletConf = svgAssets.web.tablet;
            tabletGroup.transform('translate(14,280) scale(0.76)');
            tablet.screen = drawPath(web.paper,tabletConf.screen,{
                stroke: '#434a53',
                strokeWidth: 18,
                durs: 1200
            },function(){
                tablet.top = drawRect(web.paper,tabletConf.top);
                tabletGroup.add(tablet.top);

                tablet.topCenter = drawRect(web.paper,tabletConf.topCenter,function(){
                    tablet.bottom = drawRect(web.paper,tabletConf.bottom);
                    tabletGroup.add(tablet.bottom);

                    tabletConf.buttons.forEach(function(button){
                        var b = drawRect(web.paper,button);
                        tabletGroup.add(b);
                    });
                    drawMobile();
                });
                tabletGroup.add(tablet.topCenter);
            });
            tabletGroup.add(tablet.screen);
        }

        function drawMobile(){
            var mobileConf = svgAssets.web.mobile;
            mobileGroup.transform('translate(380,300) scale(0.82)');
            mobile.shell = drawRect(web.paper,mobileConf.shell);
            mobileGroup.add(mobile.shell);

            mobile.screen = drawPath(web.paper,mobileConf.screen,{
                stroke: '#eee',
                strokeWidth: 1,
                durs: 800
            });
            mobileGroup.add(mobile.screen);

            mobile.home = drawCircle(web.paper,mobileConf.home);
            mobileGroup.add(mobile.home);

            mobile.top = drawRect(web.paper,mobileConf.top);
            mobileGroup.add(mobile.top);

            mobile.bottom = drawRect(web.paper,mobileConf.bottom,sayHi);
            mobileGroup.add(mobile.bottom);
        }

        function sayHi(){
            var w = 'W';
            var e = 'E';
            var b = 'B';
            var dash = null;
            var hi = 'One Solution';
            var conf = {
                fontSize: '72px',
                fill: '#fff',
                fontWeight: 'bolder',
                textAnchor: 'middle',
                opacity: 0
            };

            w = web.paper.text(5,26,w).attr(conf).animate({
                x: 205,
                opacity: 1,
                y: 126
            },300);
            macGroup.add(w);

            e = web.paper.text(61,70,e).attr(conf).animate({
                x: 116,
                opacity: 1,
                y: 170
            },500);
            tabletGroup.add(e);

            b = web.paper.text(6,18,b).attr(conf).animate({
                x: 60,
                opacity: 1,
                y: 118
            },1000);
            mobileGroup.add(b);

            function hoverText(e){
                function _in(){
                    this.animate({
                        stroke: '#eee',
                        strokeWidth: 3
                    },400);
                }
                function _out(){
                }
                e.hover(_in,_out,e,e);
            }
            [w,e,b].forEach(hoverText);

            dash = drawPath(web.paper,svgAssets.web.dash,{
                durs: 400
            },function(){
                hi = web.paper.text(676,82,hi).attr({
                    fontSize: '26px',
                    fill: '#fff',
                    fontWeight: 'bolder',
                    textAnchor: 'middle'
                });
                macGroup.add(hi);
            });
            macGroup.add(dash);

        }
        webGroup.add(macGroup,tabletGroup,mobileGroup);
        webGroup.transform('scale(0.92) translate(100,0)');

        drawMac();
        drawTablet();

    };




    appSvg.load = function(){
        preface.showLoader();
    };
    appSvg.ready = function(){
        preface.hideLoader(preface.greet);
    };


    function freezePage(){
        $('body').addClass('freeze');
    }
    function activePage(){
        $('body').removeClass('freeze');
    }
    function drawPath(paper,path,conf,cb){
        var pathLen;
        conf = conf || {};
        conf.anim = conf.anim || {};

        path = paper.path(path).attr({
            stroke: conf.stroke || '#ffffff',
            strokeWidth: conf.strokeWidth || 2,
            fill: conf.fill || 'none' ,
            strokeLinecap: conf.strokeLinecap ||'round',
            strokeLinejoin: conf.strokeLinejoin || 'round'
        });


        conf.anim['stroke-dashoffset'] = 0;
        pathLen= path.getTotalLength();
        path.attr({
            "stroke-dasharray": pathLen + " " + pathLen,
            "stroke-dashoffset": pathLen
        }).animate(conf.anim, conf.durs || 2500,mina.easeInOut,cb);
        return path;
    }
    function drawLine(paper,conf,cb){
        var line = paper.line(conf,x1,conf,y1,conf.x2,conf.y2).attr(conf.attr || {});
        if(conf.anim) {
            line.animate(conf.anim,conf.durs || 2000,mina.easeInOutCirc,cb);
        }
        return line;
    }
    function drawRect(paper,conf,cb) {
        var rect = paper.rect(conf.x,conf.y,conf.width,conf.height,conf.rx,conf.ry).attr(conf.attr || {});
        if(conf.anim) {
            rect.animate(conf.anim,conf.durs || 2000,mina.easeInOut,cb);
        }
        return rect;
    }
    function drawCircle(paper,conf,cb) {
        var circle = paper.circle(conf.x,conf.y,conf.r).attr(conf.attr || {});
        if(conf.anim) {
            circle.animate(conf.anim,conf.durs || 2000,mina.easeInOutCirc,cb);
        }
        return circle;
    }

    return appSvg;
});
