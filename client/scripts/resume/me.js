;
define(['jquery','config'], function($,config) {

    var me = {
        profile: {},
        portfolio: []
    };

    me.getProfile = function(onComplete,onSuccess,onError){
        $.ajax({
            url: config.server.profile,
            type: 'GET',
            dataType: 'json',
            complete: onComplete || function(xhr, textStatus) {
            },
            success:  function(data, textStatus, xhr) {
                me.profile = data;
                if(onSuccess){
                    onSuccess.call(me);
                }
            },
            error: onError || function(xhr, textStatus, errorThrown) {
            }
        });

    };
    me.getPortfolio = function(onComplete,onSuccess,onError){
        $.ajax({
          url: config.server.portfolio,
          type: 'GET',
          dataType: 'json',
          complete: onComplete || function(xhr, textStatus) {
          },
          success: function(data, textStatus, xhr) {
            me.portfolio = data;
            if(onSuccess){
              onSuccess.call(me);
            }
          },
          error: onError || function(xhr, textStatus, errorThrown) {
          }
        });
    };

    return me;
});