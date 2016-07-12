var superCtrl = angular.module('superCtrl', []);
superCtrl.controller('UserListCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":login_user.userId,
            "token":login_user.token,
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({
            url: api_uri + "p/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
                /*angular.forEach($scope.result_list, function (data) {
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
                });*/
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            //$location.path("/error");
        })
    };
    $scope.list(1,4);
    $scope.changePage = function(page){
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 4);
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
    }


   /* $scope.submit = function () {
        var m_params = {
            "userId":$rootScope.userId,
            "token":$rootScope.token,
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
                    console.log('baiyang');
                    console.log(data);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };*/
});
superCtrl.controller('CreateUserCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams){
    var timesTamp = new Date().getTime();
    var timesTamp1 = String(timesTamp).substring(0,10);
    $scope.timestamp = parseInt(timesTamp1);
    $scope.submit = function () {
        var m_params = {
            "timestamp": $scope.timestamp,
            "email":$scope.email,
            "name":$scope.name,
            "mobile":$scope.mobile,
            "empNo":$scope.empNo,
            "password":$scope.password,
            "signature":$rootScope.encryptByDES($scope.email+$scope.password+$scope.timestamp),
        };
        console.log(m_params);
        $http({
            url: api_uri+"p/user/create",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
               /* $rootScope.login_user = {
                    "userId":d.result.split("_")[0],
                    "token":d.result.split("_")[1]
                }*/
               /* $rootScope.putObject("login_user", $rootScope.login_user);
                $location.path("/master");*/
            }else {
                console.log(d);
            }

        }).error(function (d) {
            $scope.changeErrorMsg("网络故障请稍后再试......");
            $location.path("/login");
        })
    };
})
