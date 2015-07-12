angular.module('starter').factory('LocationsService', function($http, $ionicLoading) {
     $ionicLoading.show({
    template: 'Carregando...'
    })
    return {
        getImoveis: function(quarto) {
            return $http.get('http://45.55.214.198:9200/imoveis/_search'
			,{
                params: {
                    q: "*:*",
                    size: "10000"
                }
            }).then(function(response) { //then() returns a promise which
            $ionicLoading.hide()
            return response.data.hits.hits;
        });
    }
}
});