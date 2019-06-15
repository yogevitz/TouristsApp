// login controller
angular.module("myApp")
    .controller("registerController", function ($scope) {
        // button click count

        $scope.category = (function () {
                checked = ($scope.input("input[type=checkbox]:checked")).length;
                if(!(checked > 1)) {
                    alert("You must check at least two checkbox.");
                    return false;
                }
                else {
                    alert("registerd");
                    return true;
                }


        });
    });

