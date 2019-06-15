angular.module("myApp")
    .controller("restorePasswordController", function ($scope) {
        $scope.questions = [
            "The name of your first dog",
            "The name of your 3rd grade teacher",
            "The name of your favorite book",
            "The name of your favorite restaurant"
        ];
        let vm = this;
        vm.questionsFullList = '';
        vm.question1List = '';
        vm.question1List = '';

        function restorePassword() {
            alert("123456")
        }
    });


angular.module("myApp").filter('excludeUsed', function() {
    var filter = function(items, excludeVal1, excludeVal2) {
        var checkItem = function(item) {
            return (item != excludeVal1) && (item != excludeVal2);
        };

        return items.filter(checkItem);
    };

    return filter;
});

