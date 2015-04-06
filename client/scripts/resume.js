;
requirejs.config({

    baseUrl: 'scripts',
    // paths config is relative to baseUrl
    paths: {
        //jquery: '../bower_components/jquery/dist/jquery',
        jquery: 'http://cdn.bootcss.com/jquery/2.1.3/jquery.min',

        //mouseWheel: '../bower_components/jquery-mousewheel/jquery.mousewheel.min',
        mouseWheel: 'http://cdn.bootcss.com/jquery-mousewheel/3.1.12/jquery.mousewheel.min',

        //Snap: '../bower_components/snap.svg/dist/snap.svg-min',
        Snap: 'http://cdn.bootcss.com/snap.svg/0.3.0/snap.svg-min',

        //velocity: '../bower_components/velocity/velocity.min',
        velocity: 'http://cdn.bootcss.com/velocity/1.2.2/velocity.min',


        Svg: './resume/Svg',
        svgAssets: './resume/svg-assets',
        appSvg: './resume/app-svg',
        director: './utils/director',
        config: './resume/config',
        me: './resume/me'
    }
});
requirejs(['director', 'velocity', 'config', 'me', 'appSvg'], function(director, velocity, config, me, appSvg) {

    var $blogLink = $('#blog-link');
    var $prefaceToAbout = $('#preface-to-about');
    var $prefaceSvg = $('#preface-svg');

    $prefaceToAbout.on('click',function(event){
        event.preventDefault();
        $('body').animate({
            scrollTop: $('.about').offset().top
        }, 'slow', 'swing');
    });
    /// page loader
    appSvg.load();

    me.getProfile(undefined, function(){
        var $avatar = $('.avatar'),
            $name = $('.name'),
            $location = $('.location'),
            $signature = $('.signature'),
            $skillItems = $('.skill-items');
        $avatar.attr('src',me.profile.avatar).load(function() {
        });




        $name.text(me.profile.name);
        $location.text(me.profile.city);
        $signature.text(me.profile.signature);
        me.profile.skills.forEach(function(element){
            var $skill = $('<div>').addClass('skill'),
                $skillName = $('<span>').addClass('skill-name').text(element.name),
                $skillMetas = $('<div>').addClass('flex-1');
            if(element.relatives.length>0){
                $skillMetas.append($('<span>').addClass('fa fa-circle').css('font-size','0.6em'));
            }
            element.relatives.forEach(function(relative){
                $skillMetas.append($('<code>').addClass('ml-lg').text(relative));
            });
            if(element.description){
                $skillMetas.append($('<blockquote>').addClass('class_name curly-quotes').text(element.description));
            }
            $skill.append($skillName).append($skillMetas);
            if(element.isMajor){
                $skill.append('<span title="major&expert" class="skill-state fa-stack fa-lg"><i class="fa fa-stack-2x fa-bookmark-o"></i><i class="fa fa-star fa-stack-1x"></i></span>');
            }
            $skillItems.append($skill);
            console.log(element);
        });
        $skillItems.addClass('w-6').show();
    });
    me.getPortfolio(undefined, function(data){
        var $portfolioBox = $('.portfolio'),
            $portfolioItems = $('<div>').addClass('flex-row center');
        me.portfolio.forEach(function(item){
            var $portfolioItem = $('<div>').addClass('portfolio-item'),
                $portfolioItemImg = $('<img>').attr('src', config.qiniu.IZONE + '/' + item.key + '?imageView2/2/w/480'),
                $portfolioItemMetas = $('<div>').addClass('portfolio-item-metas');


            $portfolioItemMetas.append($('<a>').addClass('portfolio-item-link').text('Visit'))
                .append($('<h3>').text(item.title));

            $portfolioItem.append($portfolioItemImg).append($portfolioItemMetas);
            //$portfolioItem.addClass('bounceIn');
            $portfolioItems.append($portfolioItem);
        });
        $portfolioBox.append($portfolioItems);
    });





    /*********************************
     * director
     ***************************************/
    director
        .assign($('.parallax'), function($self) {}, function($self, data) {
            if(data.winWidth < 960){
                return ;
            }
            var speed = 4;
            var offsetY = data.actorOffsetTop > 0 ? data.winHeight - data.actorOffsetTop : 0,
                ypos = -((data.winScrollTop + offsetY) / speed),
                coords = '50% ' + ypos + 'px';
            var styles = {};
            styles.backgroundPosition = coords;
            $self.css(styles);
        }, function($self) {})
        .assign($('.preface'),function(){
        },function($self,data){
            var offsetTop = data.actorHeight - 80;
            var speed = 6;
            var offsetY = data.actorOffsetTop > 0 ? data.winHeight - data.actorOffsetTop : 0,
                ypos = -((data.winScrollTop + offsetY) / speed),
                ratio =  data.winScrollTop / data.actorHeight;
            if(data.winScrollTop >= offsetTop){
                if(!$blogLink.is('.fixed')){
                    $blogLink.addClass('fixed');
                }
            } else if($blogLink.is('.fixed')){
                $blogLink.removeClass('fixed');
            }
            $prefaceSvg.css({
                opacity: 1 - ratio * ratio,
                WebkitTransform: 'scale(' + (1 + ratio) + ') rotate(' + (ratio * 30) + 'deg)'
            });
        },function(){
        },{
            once: false
        })
        .assign($('.motto'),function(){
            //appSvg.motto.drawGrid();
        })
        .assign($('.web'),function(){
            window.setTimeout(appSvg.web.drawDevices,800);
        })
        .assign($('.contact'),function(){
            setTimeout(function(){
                $('.mail-btn').addClass('bounceIn');
            },1200);
        })

        .direct()
    ;


    window.setTimeout(function(){
        appSvg.ready();
    },5000);


    document.addEventListener('visibilitychange',function(event){
        document.title = document.hidden ? 'Are you still there?' : 'I\'m JL'
    });

});