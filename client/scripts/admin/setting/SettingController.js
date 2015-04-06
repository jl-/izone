;
'use strict';
angular.module('app')
    .controller('SettingController', ['$scope', '$window', '$state', 'Profile', 'NotificationService', 'APP_CONFIG',
        function($scope, $window, $state, Profile, NotificationService, APP_CONFIG) {
            var scope = this;

            scope.profile = $scope.$parent.adminCtrl.profile;
            scope.metas = {};
            scope.status = {};
            scope.temps = {};
            scope.errors = {};
            scope.temps.rawAvatarFile = null;
            scope.temps.rawAvatar = '';
            scope.temps.croppedAvatar = '';

            function dataURItoBlob(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {
                    type: 'image/jpeg'
                });
            }

            function handleAvatarSelect(e) {
                var file = e.target.files[0];
                scope.temps.rawAvatarFile = file;
                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.$apply(function() {
                        scope.temps.rawAvatar = e.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }

            scope.updateAvatar = function() {
                var data = new FormData();
                var b = dataURItoBlob(scope.temps.croppedAvatar);
                data.append('avatar.jpeg', b);
                data.append('profileId', scope.profile._id);
                Profile.updateAvatar(data, function(data) {
                    scope.profile.avatar = $scope.$parent.adminCtrl.profile.avatar = data.avatar;
                    scope.status.settingAvatar = false;
                });
            };

            scope.metas.skillStates = ['expert', 'amatuer'];

            scope.metas.skills = [{
                name: 'design',
                icon: 'fa-behance-square'
            }, {
                name: 'wordpress',
                icon: 'fa-wordpress'
            }, {
                name: 'ios',
                icon: 'fa-apple'
            }, {
                name: 'android',
                icon: 'fa-android'
            }, {
                name: 'html',
                icon: 'fa-html5'
            }, {
                name: 'css',
                icon: 'fa-css3'
            }, {
                name: 'js',
                icon: 'fa-code'
            }, {
                name: 'php',
                icon: 'fa-code'
            }, {
                name: 'git',
                icon: 'fa-git-square'
            }];
            scope.metas.skillsToAdd = [];
            scope.metas.skillsGotten = [];

            /////////////////////////
            /// basis 
            ////////////////////////
            scope.setBirthday = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.status.settingBirthday = !scope.status.settingBirthday;
            };
            scope.addCharacter = function() {
                if (scope.temps.character && scope.temps.character.length > 0) {
                    if (scope.profile.characters.indexOf(scope.temps.character) === -1) {
                        scope.profile.characters.push(scope.temps.character);
                        delete scope.temps.character;
                    }
                }
            };
            scope.removeCharacter = function(index) {
                scope.profile.characters.splice(index, 1);
            };


            ////////////////////////
            /// skills
            ///////////////////////
            scope.addSkill = function(index, $event) {
                var skill = {
                    name: scope.metas.skillsToAdd[index].name,
                    state: '',
                    isMajor: true,
                    relatives: [],
                    description: ''
                };
                scope.profile.skills.unshift(skill);
                scope.metas.skillsGotten.unshift(scope.metas.skillsToAdd.splice(index, 1)[0]);
                scope.status.selectingSkillToAdd = false;
                scope.setCurrentSkill(0);
            };
            scope.removeSkill = function(index, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.profile.skills.splice(index, 1);
                scope.metas.skillsToAdd.unshift(scope.metas.skillsGotten.splice(index, 1)[0]);
                if (scope.temps.currentSkillIndex === index) {
                    scope.temps.currentSkill = scope.temps.currentSkillIcon = scope.temps.currentSkillIndex = null;
                }
            };
            scope.setCurrentSkill = function(index, $event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                scope.temps.currentSkill = scope.profile.skills[index];
                scope.temps.currentSkillIcon = scope.metas.skillsGotten[index].icon;
                scope.temps.currentSkillIndex = index;
            };
            scope.setCurrentSkillState = function(index, $event) {
                scope.temps.currentSkill.state = scope.metas.skillStates[index];
                scope.status.selectingSkillState = false;
            };
            scope.addSkillRelative = function(){
                if(!scope.temps.currentSkill) return;
                if (scope.temps.skillRelativeToAdd && scope.temps.skillRelativeToAdd.length > 0) {
                    if (scope.temps.currentSkill.relatives.indexOf(scope.temps.skillRelativeToAdd) === -1) {
                        scope.temps.currentSkill.relatives.push(scope.temps.skillRelativeToAdd);
                        delete scope.temps.skillRelativeToAdd;
                    }
                }
            };
            scope.removeSkillRelative = function(index){
               scope.temps.currentSkill.relatives.splice(index,1); 
            };

            ////////////////////////////
            /// education
            ////////////////////////////
            scope.addEdu = function() {
                if (scope.status.addingEdu) {
                    return;
                }
                scope.status.addingEdu = true;
                scope.status.editingEdu = false;
                scope.status.viewingEdu = false;
                scope.temps.currentEdu = {};
                scope.errors = {};
                delete scope.temps.currentEduIndex;
            };
            scope.editEdu = function() {
                var _ = {};
                angular.copy(scope.temps.currentEdu, _);
                scope.temps.currentEdu = _;
                scope.status.editingEdu = true;
                scope.status.viewingEdu = false;
            };
            scope.saveEdu = function() {
                if (!scope.temps.currentEdu.school) {
                    scope.errors.eduSchool = 'school name is required';
                    return;
                }
                if (!scope.temps.currentEdu.startYear) {
                    scope.errors.eduStartYear = 'startYear is required';
                    return;
                }
                if (scope.temps.currentEduIndex !== undefined) {
                    // edit
                    scope.status.editingEdu = false;
                    scope.profile.edu[scope.temps.currentEduIndex] = scope.temps.currentEdu;
                    scope.setCurrentEdu(scope.temps.currentEduIndex);

                } else {
                    // add
                    scope.profile.edu.unshift(scope.temps.currentEdu);
                    scope.status.addingEdu = false;
                    scope.setCurrentEdu(0);
                }
            };
            scope.deleteEdu = function() {
                scope.profile.edu.splice(scope.temps.currentEduIndex, 1);
                scope.temps.currentEdu = {};
                scope.status.editingEdu = false;
                delete scope.temps.currentEduIndex;
                if (scope.profile.edu.length === 0) {
                    scope.addEdu();
                } else {
                    scope.setCurrentEdu(0);
                }
            };
            scope.setCurrentEdu = function(index, $event) {
                scope.temps.currentEdu = scope.profile.edu[index];
                scope.temps.currentEduIndex = index;
                scope.status.viewingEdu = true;
                scope.status.addingEdu = scope.status.editingEdu = false;
            };
            scope.cancelEditingEdu = function() {
                scope.status.editingEdu = false;
                if (scope.profile.edu.length > 0) {
                    scope.setCurrentEdu(scope.temps.currentEduIndex || 0);
                    scope.status.addingEdu = false;
                }
                scope.errors = {};
            };
            scope.isCurrentEdu = function(index) {
                return index === scope.temps.currentEduIndex;
            };

            //////////////
            /// experence
            ///////////////////////////
            scope.editExperience = function(index){
                scope.temps.experience = angular.copy(scope.profile.experiences[index]);
                scope.temps.currentExperienceIndex = index;
                scope.status.editingExperience = true;
                scope.status.addingExperience = false;
            };
            scope.addExperience = function(){
                scope.temps.experience = {};
                scope.status.editingExperience = false;
                scope.status.addingExperience = true;
            };
            function isExperienceValid(){
                var isValid = true;
                if (!scope.temps.experience.company) {
                    scope.errors.experienceCompanyName = 'company name is required';
                    isValid = false;
                }
                if (!scope.temps.experience.title) {
                    scope.errors.experienceTitle = 'job title is required';
                    isValid = false;
                }
                return isValid;
            }
            scope.saveExperience = function(){
                if (!isExperienceValid()) {
                    return;
                }
                if (scope.status.editingExperience) {
                    scope.profile.experiences[scope.temps.currentExperienceIndex] = scope.temps.experience;
                } else {
                    scope.profile.experiences.unshift(scope.temps.experience);
                }
                scope.temps.experience = {};
                scope.status.editingExperience = scope.status.addingExperience = false;
            };
            scope.cancelEditingExperience = function(){
                scope.temps.experience = {};
                delete scope.temps.currentExperienceIndex;
                scope.status.editingExperience = false;
                scope.status.addingExperience = false;
            };
            scope.deleteExperience = function(index){
                NotificationService.confirm('sure to delete experience? ', function() {
                    $scope.$apply(function() {
                        scope.profile.experiences.splice(index, 1);
                    });
                }, function() {

                });
            };


            /////////////////
            /// project
            /////////////////////////////////
            scope.editProject = function(index) {
                scope.temps.project = angular.copy(scope.profile.projects[index]);
                scope.temps.currentProjectIndex = index;
                scope.status.editingProject = true;
                scope.status.addingProject = false;
            };
            scope.addProject = function() {
                scope.temps.project = {};
                scope.temps.project.skills = [];
                scope.status.editingProject = false;
                scope.status.addingProject = true;
            };

            function isProjectValid() {
                var isValid = true;
                if (!scope.temps.project.name) {
                    scope.errors.projectName = 'proect name is required';
                    isValid = false;
                }
                if (!scope.temps.project.title) {
                    scope.errors.projectTitle = 'proect title is required';
                    isValid = false;
                }
                return isValid;
            }
            scope.saveProject = function() {
                if (!isProjectValid()) {
                    return;
                }
                if (scope.status.editingProject) {
                    scope.profile.projects[scope.temps.currentProjectIndex] = scope.temps.project;
                } else {
                    scope.profile.projects.unshift(scope.temps.project);
                }
                scope.temps.project = {};
                scope.status.editingProject = scope.status.addingProject = false;
            };
            scope.cancelEditingProject = function() {
                scope.temps.project = {};
                delete scope.temps.currentProjectIndex;
                scope.status.editingProject = false;
                scope.status.addingProject = false;
                delete scope.temps.projectSkillToAdd;
            };
            scope.deleteProject = function(index) {
                NotificationService.confirm('sure to delete project? ', function() {
                    $scope.$apply(function() {
                        scope.profile.projects.splice(index, 1);
                    });
                }, function() {

                });
            };
            scope.addProjectSkill = function() {
                if (scope.temps.projectSkillToAdd && scope.temps.projectSkillToAdd.length > 0) {
                    if (!scope.temps.project.skills.some(function(element) {
                        return element === scope.temps.projectSkillToAdd;
                    })) {
                        scope.temps.project.skills.push(scope.temps.projectSkillToAdd);
                        delete scope.temps.projectSkillToAdd;
                    }
                }
            };
            scope.removeProjectSkill = function(index) {
                scope.temps.project.skills.splice(index,1);
            };


            scope.syncProfile = function() {
                scope.profile = Profile.update(scope.profile, function(profile) {
                    NotificationService.alert('sync profile succeed.');
                });
            };



            scope.dismissError = function(filed) {
                delete scope.errors[filed];
            };



            $scope.$on('syncProfile', function() {
                scope.syncProfile();
            });
            $scope.$on('addSettingRecord', function() {
                if ($state.is('admin.setting.experience')) {
                    if (scope.status.editingExperience) {
                        NotificationService.confirm('save current experience ? ', function() {

                        }, function() {
                            // reset project and temps.project
                        });
                    } else {
                        scope.addExperience();
                    }
                } else {
                    if (scope.status.editingProject) {
                        NotificationService.confirm('save current project ? ', function() {

                        }, function() {
                            // reset project and temps.project
                        });
                    } else {
                        scope.addProject();
                    }
                }
            });

            scope.profile.$promise.then(function() {
                var index = scope.metas.skills.length - 1,
                    _index;
                for (; index >= 0; index--) {
                    if (scope.profile.skills.some(function(element, i) {
                        _index = i;
                        return element.name === scope.metas.skills[index].name;
                    })) {
                        scope.metas.skillsGotten[_index] = scope.metas.skills[index];
                    } else {
                        scope.metas.skillsToAdd.push(scope.metas.skills[index]);
                    }
                }
                if (scope.profile.edu.length === 0) {
                    scope.addEdu();
                } else {
                    scope.setCurrentEdu(0);
                }

                angular.element(document.querySelector('#avatar-selector-input')).on('change', handleAvatarSelect);
            });
        }
    ]);