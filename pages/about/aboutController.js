// about controller
angular.module("myApp")
.controller("aboutController", function ($scope) {
    // button click count
    $scope.btnCount = 0;
    $scope.myFunc = function() {
        $scope.btnCount++;
    };
    self = this;
    self.images = {
        1: {name:"Rome Symbol", image: "images/symbolRome.jpg"},
        2: {name:"Rome Flag", image: "images/flagRome.jpg"},
        3: {name:"Italy Flag", image: "images/flagItaly.jpg"}
    };
    self.cityImages = {
        1: {name:"Colosseum", image: "images/Colosseum.jpg"},
        2: {name:"Vatican City", image: "images/Vatican.jpg"},
        3: {name:"Borghese Gallery", image: "images/Borghese.jpg"},
        4: {name:"Capitoline Museums", image: "images/Capitoline.jpg"},
        5: {name:"Tonnarello", image: "images/Tonnarello.jpg"},
        6: {name:"Stadio Olimpico", image: "images/Stadio.jpg"}
    };
});