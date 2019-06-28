// register controller
angular.module("myApp")
    .controller("registerController", function ($scope) {
        $scope.questions = [
            "The name of your first dog",
            "The name of your 3rd grade teacher",
            "The name of your favorite book",
            "The name of your favorite restaurant"
        ];

        $scope.countries = [
            "Australia",
            "Bolivia",
            "China",
            "Denemark",
            "Israel",
            "Latvia",
            "Monaco",
            "August",
            "Norway",
            "Panama",
            "Switzerland",
            "USA"
        ];

        $scope.categories = [
            { id: 1, name: "Food" },
            { id: 2, name: "Sport" },
            { id: 3, name: "Museums" },
            { id: 4, name: "Culture" },
            { id: 5, name: "Nature" },
            { id: 6, name: "Art" }
        ];

        $scope.selectedCategories = [];

        $scope.questions = [
            "The name of your first dog",
            "The name of your 3rd grade teacher",
            "The name of your favorite book",
            "The name of your favorite restaurant"
        ];
        let vm = this;
        vm.question1List = '';
        vm.question2List = '';

        $scope.register = function() {

            if (validCategories()) {
                alert("Valid registration!");
            } else {
                return;
            }

            function validCategories() {
                if ($scope.selectedCategories.filter(Boolean).length < 2) {
                    alert("Please choose at least 2 categories");
                    return false;
                } else {
                    return true;
                }
            }
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

