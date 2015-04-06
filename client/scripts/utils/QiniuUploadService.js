/**
 *
 * Created by jl on 2/7/15.
 */
;
'use strict';
angular.module('app.utils')
    .factory('QiniuUploadService', function() {
        var service = {};

        var uploader = null;
        var _options = {
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: 'qiniu-pick-file-btn',       //上传选择的点选按钮，**必需**
            uptoken_url: '/token',
            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            // uptoken : '<Your upload token>',
            //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            // unique_names: true,
            // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
            // save_key: true,
            // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
            domain: 'http://qiniu-plupload.qiniudn.com/',
            //bucket 域名，下载资源时用到，**必需**
            container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '100mb',           //最大文件体积限制
            flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
            max_retries: 3,                   //上传失败最大重试次数
            dragdrop: true,                   //开启可拖曳上传
            drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                //分块上传时，每片的体积
            auto_start: true
        };
        service.getUploader = function(opts,isNew){
            if(!isNew && uploader) return uploader;
            opts = angular.extend({}, _options ,opts);
            uploader = Qiniu.uploader(opts);
            return uploader;
        };

        return service;
    });