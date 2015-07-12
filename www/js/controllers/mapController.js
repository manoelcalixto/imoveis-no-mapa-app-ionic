angular.module('starter').controller('MapController', ['$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicSlideBoxDelegate',
    '$ionicPopup',
    '$http',
    'LocationsService',
    'InstructionsService',
    function(
        $scope,
        $cordovaGeolocation,
        $stateParams,
        $ionicModal,
        $ionicSlideBoxDelegate,
        $ionicPopup,
        $http,
        LocationsService,
        InstructionsService
    ) {

   $scope.checked = false;

   $scope.buscar=function(imovel){
     console.log(imovel); 
        var c = angular.toJson({imovel : imovel});
        /* post to server*/
        //$http.post("http://localhost:8080/engine/buscarImovel", c, headers: {'Content-Type': 'application/json'}); 
        $http.defaults.useXDomain = true;
        $http({
        url: 'http://localhost:8080/engine/carregar',
        method: "POST",
        data: c,
        headers: { 'Content-Type': 'application/json' }
      }).success(function (response) {
                 console.log(response);
            });


        console.log(c);
    }

        /**
         * Once state loaded, get put map on scope.
         */
        $scope.$on("$stateChangeSuccess", function() {

            $scope.map = {
                defaults: {
                    tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                    maxZoom: 18,
                    zoomControlPosition: 'bottomleft'
                },
                markers: {},
                events: {
                    map: {
                        enable: ['context'],
                        logic: 'emit'
                    }
                },
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                    overlays: {
                        realworld: {
                            name: "Real world data",
                            type: "markercluster",
                            visible: true
                        }
                    }
                },
                center: {
        }
            };

            $scope.goTo(0);

        });

$scope.$on('leafletDirectiveMarker.click', function(e, args) {
    // Args will contain the marker name and other relevant information
   $scope.checked = !$scope.checked
});

        var Location = function() {
            if (!(this instanceof Location)) return new Location();
            this.lat = "";
            this.lng = "";
            this.name = "";
        };

        var local_icons = {
        default_icon: {},
        Casa: {
            iconUrl: 'img/Casa.png',
            iconSize:     [32, 37], // size of the icon
            popupAnchor:  [10, 10],
            labelAnchor: [6, 0] // point from which the popup should open relative to the iconAnchor
        },
        Apartamento: {
            iconUrl: 'img/Apartamento.png',
            iconSize:     [32, 37], // size of the icon
            popupAnchor:  [10, 10],
            labelAnchor: [6, 0] // point from which the popup should open relative to the iconAnchor
        }
    };

    var hash = {};

    hash['Casa'] = local_icons.Casa;
    hash['Apartamento'] = local_icons.Apartamento;

        /**
         * Detect user long-pressing on map to add new location
         */
        $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent) {
            $scope.newLocation = new Location();
            $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
            $scope.modal.show();
        });

        /**
         * Center map on specific saved location
         * @param locationKey
         */
        $scope.goTo = function(locationKey) {

            LocationsService.getImoveis(1).
            then(function(data) {
                $scope.localidade = data;

              for (var i = 0; i < $scope.localidade.length; i++) {
               console.log("teste");
                if ($scope.localidade[i]._source.location !== null) {
                    //local_icons.dinamico.iconUrl = 'img/' + $scope.localidade[i]._source.tipo + '.png';
                    $scope.map.markers[i] = {
                        codigo: $scope.localidade[i]._id,
                        layer: 'realworld',
                        lat: $scope.localidade[i]._source.location.latitude,
                        lng: $scope.localidade[i]._source.location.longitude,
                        message: $scope.localidade[i]._source.tipo,
                        icon: hash[$scope.localidade[i]._source.tipo],
                        label: {
                            message: "R$ " + $scope.localidade[i]._source.preco,
                            options: {
                                noHide: true,
                                direction: 'auto'
                            }
                        }
                    };
                };
                
              }

                
    

            }, function() {
                console.log("erro");
            });
            



        };

        /**
         * Center map on user's current position
         */
        $scope.locate = function() {

            $cordovaGeolocation
                .getCurrentPosition()
                .then(function(position) {
                    $scope.map.center.lat = position.coords.latitude;
                    $scope.map.center.lng = position.coords.longitude;
                    $scope.map.center.zoom = 15;

                    $scope.map.markers.now = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        message: "You Are Here",
                        focus: true,
                        draggable: false
                    };

                }, function(err) {
                    // error
                    console.log("Location error!");
                    console.log(err);
                });

        };

    }
]);