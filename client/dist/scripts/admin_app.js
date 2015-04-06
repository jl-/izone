"use strict";angular.module("app.config",[]).constant("APP_CONFIG",function(){var a="http://localhost:6001";a="http://jlxy.cz";var b={base:a,login:a+"/session",profile:a+"/profile",category:a+"/categories",post:a+"/categories/:categoryId/posts",avatar:a+"/profile/avatar",portfolio:a+"/portfolio"},c={base:"http://qiniu.com",IZONE:"http://i-zone.qiniudn.com/"};return{api:b,qiniu:c}}()),angular.module("app",["ui.router","ui.bootstrap","app.auth","app.config","app.resource","app.utils","ngAnimate","angularFileUpload","ngImgCrop","ngModal","ngImgThumb","ngQiniu"]).config(["$stateProvider","$urlRouterProvider","$animateProvider","APP_CONFIG",function(a,b,c){a.state("session",{url:"/login",templateUrl:"partials/admin/auth/login.tpl.html",controller:"AuthController as authCtrl"}).state("admin",{"abstract":!0,url:"/",resolve:{profile:["Profile",function(a){return a.get()}]},templateUrl:"partials/admin/admin.tpl.html",controller:"AdminController as adminCtrl",data:{requiredAuthentication:!0}}).state("admin.posts",{url:"posts",resolve:{categories:["Category",function(a){return a.list()}]},views:{actionHolder:{templateUrl:"partials/admin/post/action.tpl.html",controller:"PostActionController as postActionCtrl"},"":{templateUrl:"partials/admin/post/post.tpl.html",controller:"PostController as postCtrl"}}}).state("admin.setting",{url:"settings",views:{actionHolder:{templateUrl:"partials/admin/setting/action.tpl.html",controller:"SettingActionController as settingActionCtrl"},"":{templateUrl:"partials/admin/setting/setting.tpl.html",controller:"SettingController as settingCtrl"}}}).state("admin.setting.basis",{url:"/basis",templateUrl:"partials/admin/setting/basis.tpl.html"}).state("admin.setting.edu",{url:"/edu",templateUrl:"partials/admin/setting/edu.tpl.html"}).state("admin.setting.skill",{url:"/skill",templateUrl:"partials/admin/setting/skill.tpl.html"}).state("admin.setting.experience",{url:"/experience",templateUrl:"partials/admin/setting/experience.tpl.html"}).state("admin.setting.project",{url:"/project",templateUrl:"partials/admin/setting/project.tpl.html"}).state("admin.setting.contact",{url:"/contact",templateUrl:"partials/admin/setting/contact.tpl.html"}).state("admin.portfolio",{url:"portfolio",resolve:{portfolios:["Portfolio",function(a){return a.list()}]},views:{actionHolder:{templateUrl:"partials/admin/portfolio/action.tpl.html",controller:"PortfolioActionController as portfolioActionCtrl"},"":{templateUrl:"partials/admin/portfolio/portfolio.tpl.html",controller:"PortfolioController as portfolioCtrl"}}}),b.otherwise("/login"),c.classNameFilter(/^((?!(fa-spin)).)*$/)}]).run(["$rootScope","$state","AUTH_EVENTS","AuthService",function(a,b,c,d){a.$state=b,a.$on(c.loginSucceeded,function(){console.log("login succeed."),b.go("admin.posts")}),a.$on(c.notAuthenticated,function(){console.log("not authorizated event broadcast, return to state: session"),b.go("session")}),a.$on("$stateChangeStart",function(b,e){console.log("stateChangeStart to: "+e.name),e.data&&e.data.requiredAuthentication&&!d.isAuthenticated()&&(b.preventDefault(),console.log(e.name+" needs authenticate"),a.$broadcast(c.notAuthenticated))})}]),angular.module("app").controller("AdminController",["$rootScope","$scope","profile",function(a,b,c){var d=this;d.profile=c,d.status={},console.log("////////// profile /////////"),console.log(d.profile),d.toggleDrawer=function(a){d.status.drawerClosed=void 0===a?!d.status.drawerClosed:a},b.$on("toggleDrawer",function(a,b){d.toggleDrawer(b)}),b.$on("postPreviewAction",function(){b.$broadcast("previewPost")}),b.$on("showPostTags",function(a,c){b.$broadcast("showTags",c)}),b.$on("savePost",function(){b.$broadcast("syncPost")}),b.$on("syncProfileAction",function(){b.$broadcast("syncProfile")}),b.$on("addSettingRecordAction",function(){b.$broadcast("addSettingRecord")}),b.$on("addPortfolioAction",function(){b.$broadcast("addPortfolio")})}]),angular.module("app.utils",[]),angular.module("app.utils").factory("NotificationService",function(){function a(){c.classList.contains("alert")&&(c.classList.remove("alert"),d.innerHTML=""),c.classList.contains("confirm")&&(c.classList.remove("confirm"),f.innerHTML="")}var b={},c=document.getElementById("gl-mask"),d=c.getElementsByClassName("alert-msg")[0],e=c.getElementsByClassName("alert-closer")[0],f=c.getElementsByClassName("confirm-msg")[0],g=c.getElementsByClassName("confirm-btn")[0],h=c.getElementsByClassName("cancel-btn")[0],i=null,j=null,k=null;return b.confirm=function(a,b,d){c.classList.add("confirm"),f.innerHTML=a,i=b,j=d},b.alert=function(a,b){c.classList.add("alert"),d.innerHTML=a,k=b},e.onclick=function(){a(),k&&k()},g.onclick=function(){a(),i()},h.onclick=function(){a(),j()},b}),angular.module("app.utils").directive("markdownHighlight",function(){return{restrict:"EA",replace:!0,scope:{md:"=",rm:"=readmore"},link:function(a,b,c){function d(a){if(a&&(b.html(marked(a)),"true"===c.readMore)){var d=b[0].getElementsByClassName("read-more")[0];d&&d.classList.add("active")}var e=b.find("code");e.length&&angular.forEach(e,function(a){hljs.highlightBlock(a)})}a.$watch("md",d)}}}),angular.module("app.utils").factory("Utils",function(){var a={};return a.insertStrAfterCursor=function(a,b){if(document.selection){var c=document.selection.createRange();return c.text=b,c.text}if("number"==typeof a.selectionStart&&"number"==typeof a.selectionEnd){var d=a.selectionStart,e=a.selectionEnd,f=d,g=a.value;return a.value=g.substring(0,d)+b+g.substring(e,g.length),f+=b.length,a.selectionStart=a.selectionEnd=f,a.value}return a.value+=b,a.value},a}),angular.module("app.resource",["ngResource"]),angular.module("app.resource").factory("Profile",["$resource","APP_CONFIG",function(a,b){return a(b.api.profile,null,{get:{method:"GET"},update:{method:"PUT"},updateAvatar:{url:b.api.avatar,method:"PUT",transformRequest:function(a,b){var c=b();return c["Content-Type"]=void 0,console.log(c),console.log(a),a}}})}]),angular.module("app.resource").factory("Category",["$resource","APP_CONFIG",function(a,b){return a(b.api.category,null,{list:{method:"GET",isArray:!0},getOne:{method:"GET",url:b.api.category+"/:categoryId"},create:{method:"POST"},update:{method:"PUT",url:b.api.category+"/:categoryId"},"delete":{method:"DELETE",url:b.api.category+"/:categoryId"}})}]),angular.module("app.resource").factory("Post",["$resource","APP_CONFIG",function(a,b){return a(b.api.post,null,{create:{method:"POST"},"delete":{method:"DELETE",url:b.api.post+"/:postId"},list:{method:"GET"},getOne:{method:"GET",url:b.api.post+"/:postId"},update:{method:"PUT",url:b.api.post+"/:postId"}})}]),angular.module("app.resource").factory("Portfolio",["$resource","APP_CONFIG",function(a,b){return a(b.api.portfolio,null,{list:{method:"GET",isArray:!0},getOne:{method:"GET",url:b.api.portfolio+"/:portfolioId"},create:{method:"POST"},update:{method:"PUT",url:b.api.portfolio+"/:portfolioId"},"delete":{method:"DELETE",url:b.api.portfolio+"/:portfolioId"}})}]),angular.module("app.auth",[]),angular.module("app.auth").constant("AUTH_EVENTS",{loginSucceeded:"auth-login-successful",loginFailed:"auth-login-failed",logoutSucceeded:"auth-logout-successful",tokenExpired:"auth-token-expired",notAuthenticated:"auth-not-authenticated"}),angular.module("app.auth").factory("AuthInterceptor",["$rootScope","$window","$q","AUTH_EVENTS",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},b.sessionStorage.token&&(a.headers.Authorization="Bearer "+b.sessionStorage.token),console.log(a),a},responseError:function(b){return a.$broadcast({401:d.notAuthenticated,440:d.tokenExpired}[b.status],b),c.reject(b)}}}]),angular.module("app.auth").config(["$httpProvider",function(a){a.interceptors.push("AuthInterceptor")}]),angular.module("app.auth").factory("AuthService",["$window",function(a){var b={};return b.isAuthenticated=function(){return!!a.sessionStorage.token},b}]),angular.module("app.auth").controller("AuthController",["$scope","$http","$window","APP_CONFIG","AUTH_EVENTS",function(a,b,c,d,e){var f=this;f.status={},f.account={email:"",password:""},f.login=function(g){g&&g.email&&g.password&&(f.status.processing=!0,b.post(d.api.login,g).success(function(b){console.log(b),c.sessionStorage.token=b.token,a.$emit(e.loginSucceeded)}).error(function(a){console.log(a),f.error=a.msg}).finally(function(){f.status.processing=!1}))},f.dismissError=function(){delete f.error}}]),angular.module("app").controller("PostController",["$scope","APP_CONFIG","NotificationService","Category","categories","Post","ModalProvider","Utils",function(a,b,c,d,e,f,g,h){function i(a){delete j.temps.post._post,j.post=j.category.posts[a],j.temps.post._post=angular.copy(j.category.posts[a]),j.temps.post.index=a,j.temps.post.cIndex=j.temps.category.index,j.temps.post.modified=!1}var j=this;j.status={},j.temps={category:{},post:{}},j.metas={},j.metas.qiniuImageViewOpt={mode:2,w:620},j.categories=e,console.log(j),j.createCategory=function(){if(j.temps.category.toAdd&&j.temps.category.toAdd.length>0){if(j.categories.some(function(a){return a.name===j.temps.category.toAdd}))return;d.create({name:j.temps.category.toAdd},function(a){delete j.temps.category.toAdd,j.categories.push(a),j.status.addingCategory=!1})}else j.status.addingCategory=!j.status.addingCategory;console.log(j)},j.deleteCategory=function(a,b){b.preventDefault(),b.stopPropagation(),console.log(j),c.confirm("will delete all posts in this category: "+j.categories[a].name+" ok to continue.",function(){d.delete({categoryId:j.categories[a]._id},function(b){console.log(b),void 0!==j.temps.category.index&&(a===j.temps.category.index?(delete j.category,delete j.temps.category.index):a<j.temps.category.index&&j.temps.category.index--),void 0!==j.temps.post.cIndex&&(j.temps.post.cIndex===a?(delete j.post,delete j.temps.post.index,delete j.temps.post.cIndex):j.temps.post.cIndex>a&&j.temps.post.cIndex--),j.categories.splice(a,1),console.log(j)},function(a){console.log(a)})},function(){})},j.setCategory=function(a){j.status.renamingCategory||(j.status.viewingPosts=!0,j.categories[a].cached?(j.category=j.categories[a],j.temps.category.index=a,console.log(j)):d.getOne({categoryId:j.categories[a]._id},function(b){console.log("///// get category /////"),b.cached=!0,j.categories[a]=b,j.category=b,j.temps.category.index=a,console.log(j),j.post||j.setPost(0)}))},j.isCategoryRenaming=function(a){return a===j.temps.category.renamingIndex},j.renameCategory=function(a,b){b.preventDefault(),b.stopPropagation(),j.status.renamingCategory?j.categories[a].name!==j.temps.category.originalName?d.update({categoryId:j.categories[a]._id},{name:j.categories[a].name}).$promise.then(function(){c.alert("rename succeed")},function(){j.categories[a].name=j.temps.category.originalName,c.alert("rename failed..")}).finally(function(){j.status.renamingCategory=!1,delete j.temps.category.renamingIndex,delete j.temps.category.originalName}):(j.status.renamingCategory=!1,delete j.temps.category.renamingIndex,delete j.temps.category.originalName):(j.status.renamingCategory=!0,j.temps.category.renamingIndex=a,j.temps.category.originalName=j.categories[a].name)},j.createPost=function(){f.create({categoryId:j.category._id},null,function(a){console.log("////// create post//////"),console.log(a),j.category.posts.unshift(a)})},j.updatePost=function(a){j.temps.post.modified&&f.update({categoryId:j.categories[j.temps.post.cIndex]._id,postId:j.post._id},j.post,function(b){console.log("///////// update post //////"),console.log(b),delete j.temps.post.modified,a&&a(),c.alert("sync post succeed")},function(){c.alert("sync post failed")})},j.isCurrentPost=function(a){return a===j.temps.post.index},j.setPost=function(b){j.temps.post.modified?c.confirm("pre post modified, save it ?",function(){j.updatePost(function(){i(b)})},function(){a.$apply(function(){j.categories[j.temps.post.cIndex].posts[j.temps.post.index]=j.temps.post._post,i(b)})}):i(b)},j.deletePost=function(a,b){b.preventDefault(),b.stopPropagation(),console.log("////// before delete post ////"),console.log(j),c.confirm("sure you want to delete this post: "+j.category.posts[a].title+" ?",function(){f.delete({categoryId:j.category._id,postId:j.category.posts[a]._id},function(b){console.log("///// delete post /////"),console.log(b),j.post&&j.temps.post.cIndex===j.temps.category.index&&(j.temps.post.index===a?(j.temps.post={},delete j.post):j.temps.post.index>a&&j.temps.post.index--),j.category.posts.splice(a,1),console.log(j)})},function(){})},j.addTag=function(){j.post&&(j.temps.post.newTag&&j.temps.post.newTag.length>0?-1===j.post.tags.indexOf(j.temps.post.newTag)&&(j.post.tags.push(j.temps.post.newTag),delete j.temps.post.newTag,j.markModified()):j.status.addingTag=!j.status.addingTag)},j.removeTag=function(a){j.post.tags.splice(a,1),j.markModified()},j.uploaderOpts={uptoken_url:b.api.post+"/uptoken",domain:b.qiniu.IZONE,unique_names:!1,save_key:!1,init:{FilesAdded:function(b){a.$apply(b)},UploadProgress:function(a,b){console.log("/////// progress ///////"),console.log(b)},FileUploaded:function(a,b,c){j.insertImg(c)},UploadComplete:function(){console.log("upload complete"),j.cancelUploadPostImg()},Error:function(){},Key:function(a,b){var c=b.name;return c}}},j.bla="dfesblabla",j.modal=g.fromTemplateUrl("partials/admin/post/img-insert.tpl.html",{scope:a,pre_append:!0}),console.log(j.modal),j.openImgInsertPanel=function(){j.post&&(j.status.insertingImg=!0,j.modal.show())},j.uploadPostImg=function(){console.log("upload post img"),j.uploader.start()},j.insertImg=function(b){if(b=JSON.parse(b),console.log(b),b&&b.key){var c=Qiniu.imageView2(j.metas.qiniuImageViewOpt,b.key);c="\n!["+b.key+"]("+c+")\n",a.$apply(function(){j.post.content=h.insertStrAfterCursor(document.querySelector(".post-editor-content"),c)}),j.markModified()}},j.cancelUploadPostImg=function(){j.uploader.splice(),j.modal.hide()},j.markModified=function(){j.temps.post.modified=!0},j.tab=function(a){9===a.keyCode&&(a.preventDefault(),j.post.content=h.insertStrAfterCursor(a.target,"    "))},j.preview=function(){j.status.previewing=j.post&&!j.status.previewing},a.$on("previewPost",function(){j.preview()}),a.$on("syncPost",function(){j.updatePost()})}]),angular.module("app").controller("PostActionController",["$scope",function(a){var b=this;b.status={},b.tags=[],b.preview=function(){a.$emit("postPreviewAction")},a.$on("showTags",function(a,c){b.tags=c,b.status.editable=!0}),b.save=function(){a.$emit("savePost")}}]),angular.module("app").controller("SettingController",["$scope","$window","$state","Profile","NotificationService","APP_CONFIG",function(a,b,c,d,e){function f(a){for(var b=atob(a.split(",")[1]),c=[],d=0;d<b.length;d++)c.push(b.charCodeAt(d));return new Blob([new Uint8Array(c)],{type:"image/jpeg"})}function g(b){var c=b.target.files[0];j.temps.rawAvatarFile=c;var d=new FileReader;d.onload=function(b){a.$apply(function(){j.temps.rawAvatar=b.target.result})},d.readAsDataURL(c)}function h(){var a=!0;return j.temps.experience.company||(j.errors.experienceCompanyName="company name is required",a=!1),j.temps.experience.title||(j.errors.experienceTitle="job title is required",a=!1),a}function i(){var a=!0;return j.temps.project.name||(j.errors.projectName="proect name is required",a=!1),j.temps.project.title||(j.errors.projectTitle="proect title is required",a=!1),a}var j=this;j.profile=a.$parent.adminCtrl.profile,j.metas={},j.status={},j.temps={},j.errors={},j.temps.rawAvatarFile=null,j.temps.rawAvatar="",j.temps.croppedAvatar="",j.updateAvatar=function(){var b=new FormData,c=f(j.temps.croppedAvatar);b.append("avatar.jpeg",c),b.append("profileId",j.profile._id),d.updateAvatar(b,function(b){j.profile.avatar=a.$parent.adminCtrl.profile.avatar=b.avatar,j.status.settingAvatar=!1})},j.metas.skillStates=["expert","amatuer"],j.metas.skills=[{name:"design",icon:"fa-behance-square"},{name:"wordpress",icon:"fa-wordpress"},{name:"ios",icon:"fa-apple"},{name:"android",icon:"fa-android"},{name:"html",icon:"fa-html5"},{name:"css",icon:"fa-css3"},{name:"js",icon:"fa-code"},{name:"php",icon:"fa-code"},{name:"git",icon:"fa-git-square"}],j.metas.skillsToAdd=[],j.metas.skillsGotten=[],j.setBirthday=function(a){a.preventDefault(),a.stopPropagation(),j.status.settingBirthday=!j.status.settingBirthday},j.addCharacter=function(){j.temps.character&&j.temps.character.length>0&&-1===j.profile.characters.indexOf(j.temps.character)&&(j.profile.characters.push(j.temps.character),delete j.temps.character)},j.removeCharacter=function(a){j.profile.characters.splice(a,1)},j.addSkill=function(a){var b={name:j.metas.skillsToAdd[a].name,state:"",isMajor:!0,relatives:[],description:""};j.profile.skills.unshift(b),j.metas.skillsGotten.unshift(j.metas.skillsToAdd.splice(a,1)[0]),j.status.selectingSkillToAdd=!1,j.setCurrentSkill(0)},j.removeSkill=function(a,b){b.preventDefault(),b.stopPropagation(),j.profile.skills.splice(a,1),j.metas.skillsToAdd.unshift(j.metas.skillsGotten.splice(a,1)[0]),j.temps.currentSkillIndex===a&&(j.temps.currentSkill=j.temps.currentSkillIcon=j.temps.currentSkillIndex=null)},j.setCurrentSkill=function(a,b){b&&(b.preventDefault(),b.stopPropagation()),j.temps.currentSkill=j.profile.skills[a],j.temps.currentSkillIcon=j.metas.skillsGotten[a].icon,j.temps.currentSkillIndex=a},j.setCurrentSkillState=function(a){j.temps.currentSkill.state=j.metas.skillStates[a],j.status.selectingSkillState=!1},j.addSkillRelative=function(){j.temps.currentSkill&&j.temps.skillRelativeToAdd&&j.temps.skillRelativeToAdd.length>0&&-1===j.temps.currentSkill.relatives.indexOf(j.temps.skillRelativeToAdd)&&(j.temps.currentSkill.relatives.push(j.temps.skillRelativeToAdd),delete j.temps.skillRelativeToAdd)},j.removeSkillRelative=function(a){j.temps.currentSkill.relatives.splice(a,1)},j.addEdu=function(){j.status.addingEdu||(j.status.addingEdu=!0,j.status.editingEdu=!1,j.status.viewingEdu=!1,j.temps.currentEdu={},j.errors={},delete j.temps.currentEduIndex)},j.editEdu=function(){var a={};angular.copy(j.temps.currentEdu,a),j.temps.currentEdu=a,j.status.editingEdu=!0,j.status.viewingEdu=!1},j.saveEdu=function(){return j.temps.currentEdu.school?j.temps.currentEdu.startYear?void(void 0!==j.temps.currentEduIndex?(j.status.editingEdu=!1,j.profile.edu[j.temps.currentEduIndex]=j.temps.currentEdu,j.setCurrentEdu(j.temps.currentEduIndex)):(j.profile.edu.unshift(j.temps.currentEdu),j.status.addingEdu=!1,j.setCurrentEdu(0))):void(j.errors.eduStartYear="startYear is required"):void(j.errors.eduSchool="school name is required")},j.deleteEdu=function(){j.profile.edu.splice(j.temps.currentEduIndex,1),j.temps.currentEdu={},j.status.editingEdu=!1,delete j.temps.currentEduIndex,0===j.profile.edu.length?j.addEdu():j.setCurrentEdu(0)},j.setCurrentEdu=function(a){j.temps.currentEdu=j.profile.edu[a],j.temps.currentEduIndex=a,j.status.viewingEdu=!0,j.status.addingEdu=j.status.editingEdu=!1},j.cancelEditingEdu=function(){j.status.editingEdu=!1,j.profile.edu.length>0&&(j.setCurrentEdu(j.temps.currentEduIndex||0),j.status.addingEdu=!1),j.errors={}},j.isCurrentEdu=function(a){return a===j.temps.currentEduIndex},j.editExperience=function(a){j.temps.experience=angular.copy(j.profile.experiences[a]),j.temps.currentExperienceIndex=a,j.status.editingExperience=!0,j.status.addingExperience=!1},j.addExperience=function(){j.temps.experience={},j.status.editingExperience=!1,j.status.addingExperience=!0},j.saveExperience=function(){h()&&(j.status.editingExperience?j.profile.experiences[j.temps.currentExperienceIndex]=j.temps.experience:j.profile.experiences.unshift(j.temps.experience),j.temps.experience={},j.status.editingExperience=j.status.addingExperience=!1)},j.cancelEditingExperience=function(){j.temps.experience={},delete j.temps.currentExperienceIndex,j.status.editingExperience=!1,j.status.addingExperience=!1},j.deleteExperience=function(b){e.confirm("sure to delete experience? ",function(){a.$apply(function(){j.profile.experiences.splice(b,1)})},function(){})},j.editProject=function(a){j.temps.project=angular.copy(j.profile.projects[a]),j.temps.currentProjectIndex=a,j.status.editingProject=!0,j.status.addingProject=!1},j.addProject=function(){j.temps.project={},j.temps.project.skills=[],j.status.editingProject=!1,j.status.addingProject=!0},j.saveProject=function(){i()&&(j.status.editingProject?j.profile.projects[j.temps.currentProjectIndex]=j.temps.project:j.profile.projects.unshift(j.temps.project),j.temps.project={},j.status.editingProject=j.status.addingProject=!1)},j.cancelEditingProject=function(){j.temps.project={},delete j.temps.currentProjectIndex,j.status.editingProject=!1,j.status.addingProject=!1,delete j.temps.projectSkillToAdd},j.deleteProject=function(b){e.confirm("sure to delete project? ",function(){a.$apply(function(){j.profile.projects.splice(b,1)})},function(){})},j.addProjectSkill=function(){j.temps.projectSkillToAdd&&j.temps.projectSkillToAdd.length>0&&(j.temps.project.skills.some(function(a){return a===j.temps.projectSkillToAdd})||(j.temps.project.skills.push(j.temps.projectSkillToAdd),delete j.temps.projectSkillToAdd))},j.removeProjectSkill=function(a){j.temps.project.skills.splice(a,1)},j.syncProfile=function(){j.profile=d.update(j.profile,function(){e.alert("sync profile succeed.")})},j.dismissError=function(a){delete j.errors[a]},a.$on("syncProfile",function(){j.syncProfile()}),a.$on("addSettingRecord",function(){c.is("admin.setting.experience")?j.status.editingExperience?e.confirm("save current experience ? ",function(){},function(){}):j.addExperience():j.status.editingProject?e.confirm("save current project ? ",function(){},function(){}):j.addProject()}),j.profile.$promise.then(function(){for(var a,b=j.metas.skills.length-1;b>=0;b--)j.profile.skills.some(function(c,d){return a=d,c.name===j.metas.skills[b].name})?j.metas.skillsGotten[a]=j.metas.skills[b]:j.metas.skillsToAdd.push(j.metas.skills[b]);0===j.profile.edu.length?j.addEdu():j.setCurrentEdu(0),angular.element(document.querySelector("#avatar-selector-input")).on("change",g)})}]),angular.module("app").controller("SettingActionController",["$scope",function(a){var b=this;b.syncProfile=function(){a.$emit("syncProfileAction")},b.addRecord=function(){a.$emit("addSettingRecordAction")}}]),angular.module("app").controller("PortfolioController",["$scope","$window","Portfolio","portfolios","NotificationService","APP_CONFIG",function(a,b,c,d,e,f){var g=this;g.status={},g.metas={},g.metas.qiniuImageViewOpt={mode:2,w:320},g.temps={},console.log(d),d.$promise.then(function(){console.log(d),g.portfolios=d.map(function(a){return a.src=Qiniu.imageView2(g.metas.qiniuImageViewOpt,a.key),a}),console.log(g)}),g.uploaderOpts={uptoken_url:f.api.portfolio+"/uptoken",domain:f.qiniu.IZONE,x_vars:function(){var a={};return"title,link,description".split(",").forEach(function(b){a[b]=function(a,c){return c.metas&&c.metas[b]}}),a}(),unique_names:!1,save_key:!1,init:{FilesAdded:function(b){a.$apply(b)},UploadProgress:function(b,c){console.log("/////// progress ///////"),console.log(c),a.$apply(c)},FileUploaded:function(a,b,c){console.log(c);var d=JSON.parse(c);g.portfolios.unshift(d)},UploadComplete:function(){console.log("upload complete"),g.status.adding=!1,g.uploader.splice()},Error:function(){},Key:function(a,b){var c=b.name;return c}}},g.upload=function(){console.log(g.uploader),g.uploader.start()},g.createPortfolios=function(){console.log(g.uploader)},g.removeFile=function(a){g.uploader.removeFile(a)},g.editPortfolioItem=function(a){console.log(a),a.status=a.status||{},a.status.editing?c.update({portfolioId:a._id},a).$promise.then(function(a){console.log("edit succeed"),console.log(a)},function(a){console.log("edit faild"),console.log(a)}).finally(function(){delete a.status}):a.status.editing=!0},g.deletePortfolioItem=function(a,b){console.log(a),e.confirm("sure?",function(){c.delete({portfolioId:a._id}).$promise.then(function(a){console.log("delete succeed"),console.log(a),g.portfolios.splice(b,1)})},function(){})},a.$on("addPortfolio",function(){g.status.adding=!g.status.adding})}]),angular.module("app").controller("PortfolioActionController",["$scope",function(a){var b=this;b.add=function(){a.$emit("addPortfolioAction")}}]);