// poi controller
angular.module("myApp")
.controller("poiController", function ($scope) {
    self = this;
    self.cities = {
        1: {name:"Colosseum", description: "The Colosseum and the Arch of Constantine", image: "images/Colosseum.jpg"},
        2: {name:"Vatican City", description: "The smallest independent state in the world", image: "images/Vatican.jpg"},
        3: {name:"Borghese Gallery", description: "Big art park", image: "images/Borghese.jpg"},
        4: {name:"Capitoline Museums", description: "Beautiful museum", image: "images/Capitoline.jpg"},
        5: {name:"Tonnarello", description: "Best restaurant in Rome", image: "images/Tonnarello.jpg"},
        6: {name:"Stadio Olimpico", description: "Olympic stadium at the center of Rome", image: "images/Stadio.jpg"}
    }
});