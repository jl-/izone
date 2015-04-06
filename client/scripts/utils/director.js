;
define(['jquery'], function($) {
    var director = {};
    var actors = [];
    var staging = true;


    director.assign = function($actor, onAppear, onActing, onDisappear,opts) {
        if (typeof onAppear === 'function' || typeof onActing === 'function' || typeof onDisappear === 'function') {
            $actor.each(function() {
                var $self = $(this);
                $self.onAppear = onAppear;
                $self.onActing = onActing;
                $self.onDisappear = onDisappear;
                $self.opts = opts || {};
                actors.push($self);
                staging = true;
            });
        }
        return this;
    };

    function throttle(func, context, delay, duration) {
        return function () {
            var tid;
            var startAt = new Date();

            return function (){
                var args = Array.prototype.slice.call(arguments);
                var current = new Date();

                clearTimeout(tid);
                if(delay && current - startAt > delay) {
                    //console.log('...a');
                    func.apply(context,args);
                    startAt = current;
                } else {
                    tid = setTimeout(function(){
                        //console.log('...b');
                        func.apply(context,args);
                    },100);
                }
            };

        }();
    }


    director.direct = function() {
        var $window = $(window),
            data = {},
            actorIndex,
            $actor = null;

        function action() {
            if(actors.length === 0) return;
            data.winScrollTop = $window.scrollTop();
            data.winHeight = $window.height();
            data.winWidth = $window.width();
            for (actorIndex = actors.length - 1; actorIndex >= 0; actorIndex--) {
                $actor = actors[actorIndex];
                if (!$actor.onAppear && !$actor.onActing && !$actor.onDisappear) {
                    actors.splice(actorIndex, 1);
                    continue;
                }
                data.actorOffsetTop = $actor.offset().top;
                data.actorHeight = $actor.outerHeight();

                if (data.winScrollTop + data.winHeight > data.actorOffsetTop && data.actorOffsetTop + data.actorHeight > data.winScrollTop) {
                    $actor.appearing = true;
                    if ($actor.onAppear) {
                        $actor.onAppear.call(this, $actor);
                        if($actor.opts.once !== false)
                        delete $actor.onAppear;
                    }
                    if($actor.onActing){
                        $actor.onActing.call(this,$actor,data);
                    }
                } else if ($actor.appearing) {
                    $actor.appearing = false;
                    if($actor.onDisappear)
                    $actor.onDisappear.call(this, $actor);
                    if($actor.opts.once !== false)
                    delete $actor.onDisappear;
                }
            }
        }
        //$window.scroll(throttle(action,null,60,60));
        $window.scroll(action);
        window.setTimeout(action, 0);
        delete director.direct;
    };

    return director;
});