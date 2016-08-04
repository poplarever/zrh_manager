/**
 * Created by baiyang on 2016/7/7.
 */
var loanApplicationCtrl = angular.module('loanApplicationCtrl', []);
loanApplicationCtrl.controller('LoanApplicationCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {

    var result_list = [];

    var login_user = $rootScope.getObject("login_user");
    $scope.list = function (pageNo, pageSize) {
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "wd": $scope.wd,
            "status": $scope.status
        };
        $http({
            url: api_uri + "loanApplicationManage/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
                angular.forEach($scope.result_list, function (data) {
                    $scope.status = d.result.status;
                    if (data.status == 0) {
                        data.progressText = "未申请";
                    } else if (data.status == 1) {
                        data.progressText = "审核中";
                    } else if (data.status == 2) {
                        data.progressText = "约见中";
                    } else if (data.status == 3) {
                        data.progressText = "跟进中";
                    } else if (data.status == 4) {
                        data.progressText = "成功融资";
                        data.progressBtn = "已结束";
                    } else if (data.status == -1) {
                        data.progressText = "申请取消";
                    }
                });
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
        })
    };
    $scope.apply = function (id) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
            "applyId":id,
        };
        console.log(m_params);
            $http({
                url: api_uri + "applyDeal/apply",
                method: "GET",
                params: m_params
            }).success(function (d) {
                //console.log(d);
                if (d.returnCode == 0) {
                    console.log(d);
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                    console.log(d);
                }

            }).error(function (d) {
                //console.log("login error");
                //$location.path("/error");
            })
    };
    $scope.list(1, 20);
    $scope.changePage = function(page){
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 20);
        });
    };
    $scope.selected = [];
    $scope.ids = [];

    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log("添加id"+$scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
            console.log("删除id"+id);
        }
    };

    $scope.updateSelection = function ($event, id) {
        console.log("点击一下")
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.refresh = function(){
        $scope.list($scope.pageNo1, 10);
    };

    $scope.delete = function () {
        var m_params = {
            "userId": login_user.userId,
            "token": login_user.token,
            ids: $scope.ids
        };
        console.log($scope.ids);
        $.ajax({
            type: 'POST',
            url: api_uri + "loanApplicationManage/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    console.log(data);
                    $scope.list($scope.pageNo1, 10);
                    //$apply();
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    $scope.search_text = null;
    $scope.search = function () {
        $scope.wd = $scope.search_text;
        $scope.list(1, 20);
    };

    $scope.status_text = "全部";
    $scope.choice = function (status) {
        $scope.status = status;
        if ($scope.status == 0) {
            $scope.status_text = "未申请";
        } else if ($scope.status == 1) {
            $scope.status_text = "审核中";
        } else if ($scope.status == 2) {
            $scope.status_text = "约见中";
        } else if ($scope.status == 3) {
            $scope.status_text = "跟进中";
        } else if ($scope.status == 4) {
            $scope.status_text = "成功融资";
        } else if ($scope.status == null) {
            $scope.status_text = "全部";
        }
        $scope.list(1, 20);
    };
});

loanApplicationCtrl.controller('AddCompanyCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    /*添加删除模板*/
    //$scope.model = {
    //    title: "",
    //    content: "",
    //    name: "",
    //};
    //$scope.model_list = [];
    //var id_model = 0;
    //$scope.addModel = function (templateType) {
    //    $scope.model_list.push({
    //        "id_model": id_model,
    //        "templateType": templateType,
    //        "title": $scope.model.title,
    //        "content": $scope.model.content,
    //        "name": "",
    //        "imgList": []
    //    });
    //    id_model++;
    //    console.log($scope.model_list);
    //    $scope.picSave();
    //};
    //$scope.delete = function (id) {
    //    for (var i = 0; i < $scope.model_list.length; i++) {
    //        if ($scope.model_list[i].id_model == id) {
    //            $scope.model_list.splice(i, 1);
    //            console.log("删除id" + id);
    //        }
    //    }
    //    console.log($scope.model_list);
    //};
    /*保存基本信息*/
    $scope.basicMessage = function () {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            //"applyId": '',
            "userId": login_user.userId,
            "token": login_user.token,
            "company_name": $scope.basic.company_name,
            "legal_representative": $scope.basic.legal_representative,
            "register_date": $scope.basic.register_date,
            "registered_capital": $scope.basic.registered_capital,
            "business_address": $scope.basic.business_address,
            "item_category": $scope.basic.item_category,
            "business_type": $scope.basic.business_type,
            "business_scope": $scope.basic.business_scope,
            "linkman": $scope.basic.linkman,
            "phone": $scope.basic.phone,
        };
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "inforTemplate/create",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    console.log("basic success");
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });

    };

    /*保存其他信息*/
    //$scope.other = function () {
    //    console.log($scope.id_basic);
    //    var list = [];
    //    //var list_string = [];
    //    for (var i = 0; i < $scope.model_list.length; i++) {
    //        list.push({
    //            "title": $scope.model_list[i].title,
    //            "name": $scope.model_list[i].name,
    //            "templateType": $scope.model_list[i].templateType,
    //            "content": $scope.model_list[i].content,
    //            "imgList": $scope.model_list[i].imgList
    //        })
    //    }
    //    ;
    //    //var list_string = JSON.stringify(list);
    //    console.log(list);
    //    var login_user = $rootScope.getObject("login_user");
    //    var m_params1 = {
    //        "userId": login_user.userId,
    //        "token": login_user.token,
    //        "comId": $scope.id_basic,
    //        "list": JSON.stringify(list)
    //    };
    //    console.log(m_params1);
    //    $.ajax({
    //        type: 'POST',
    //        url: api_uri + "inforTemplate/saveList",
    //        data: m_params1,
    //        traditional: true,
    //        success: function (data, textStatus, jqXHR) {
    //            console.log(data);
    //            if (data.returnCode == 0) {
    //                console.log("list success");
    //                $state.go("master.person_baojuan");
    //                $scope.$apply();
    //
    //            }
    //            else {
    //                console.log(data);
    //            }
    //        },
    //        dataType: 'json',
    //    });
    //
    //};

    $scope.submitMessage = function () {
        $scope.basicMessage();
    };
    //$scope.saveImg = "";
    //$scope.picSave = function () {
    //    var login_user = $rootScope.getObject("login_user");
    //    var m_params = {
    //        "userId": login_user.userId,
    //        "token": login_user.token,
    //    };
    //
    //    console.log(m_params, "baiyang");
    //    $http({
    //        url: api_uri + "qiniu/getUpToken",
    //        method: "GET",
    //        params: m_params
    //    }).success(function (d) {
    //        console.log(d);
    //        if (d.returnCode == 0) {
    //            $scope.qiniu_token = d.result.uptoken;
    //            $scope.chuan = function (d) {
    //                $scope.saveImg = d;
    //            };
    //            for (var i = 0; i < 10; i++) {
    //                var uploader = Qiniu.uploader({
    //                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
    //                    browse_button: 'img_model_' + i,       //上传选择的点选按钮，**必需**
    //                    //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
    //                    uptoken: $scope.qiniu_token,
    //                    //	        get_new_uptoken: true,
    //                    //save_key: true,
    //                    domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
    //                    container: 'imgList_model_' + i,           //上传区域DOM ID，默认是browser_button的父元素，
    //                    max_file_size: '10mb',           //最大文件体积限制
    //                    flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
    //                    max_retries: 3,                   //上传失败最大重试次数
    //                    dragdrop: false,                   //开启可拖曳上传
    //                    drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    //                    chunk_size: '4mb',                //分块上传时，每片的体积
    //                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    //                    init: {
    //                        'FilesAdded': function (up, files) {
    //                            //                    plupload.each(files, function(file) {
    //                            //                        // 文件添加进队列后,处理相关的事情
    //                            //                    });
    //                        },
    //                        'BeforeUpload': function (up, file) {
    //
    //                        },
    //                        'UploadProgress': function (up, file) {
    //                            // 每个文件上传时,处理相关的事情
    //
    //                        },
    //                        'FileUploaded': function (up, file, info) {
    //                            var res = $.parseJSON(info);
    //
    //                            var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
    //                            console.log($scope.model_list);
    //                            $scope.model_list[$scope.saveImg].imgList.push(file_url);
    //                            console.log($scope.model_list);
    //                            //$scope.$apply();
    //                        },
    //                        'Error': function (up, err, errTip) {
    //                            console.log(err);
    //                            $rootScope.alert("抵押物图片上传失败！");
    //                        },
    //                        'UploadComplete': function () {
    //                            //队列文件处理完毕后,处理相关的事情
    //                        },
    //                        'Key': function (up, file) {
    //                            var time = new Date().getTime();
    //                            var k = 'inforTemplate/saveList/' + login_user.userId + '/' + time;
    //                            return k;
    //                        }
    //                    }
    //
    //                });
    //            }
    //        } else {
    //            console.log(d);
    //        }
    //
    //    }).error(function (d) {
    //        console.log(d);
    //    });
    //
    //};


    //$scope.removeImgList = function (id, index) {
    //    $scope.model_list[id].imgList.splice(index, 1);
    //};
});
