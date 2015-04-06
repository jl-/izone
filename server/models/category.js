;'use strict';

var mongoose = require('mongoose'),
    Post = require('./post'),
    Schema = mongoose.Schema;


var Category = new Schema({
    name: {type: String, required: true,unique: true, trim: true},
    posts:[{type:Schema.Types.ObjectId,ref:'Post'}],
    createdAt:{type:Date, default: Date.now()}
});

Category.pre('remove',function(next){
   var category = this;
   (function(i,len,count,cb){
        if(len===0){
            return cb();
        }
        for( ; i<len ; i++){
            (function(i){
                Post.remove({_id: category.posts[i]},function(){
                    if(++count === len){
                        return cb();
                    }
                });
            }(i));
        }
   }(0,category.posts.length,0,next)); 
});



module.exports = mongoose.model('Category',Category);