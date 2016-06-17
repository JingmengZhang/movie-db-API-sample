app.factory('movies', function($http, $q){
	return {
		getMovieList: function() {
            return $http.get('https://api.themoviedb.org/3/collection/528?api_key=2427682e24fef29c09819c298ddd6df4');
		},

		getMovieById: function(id) {
			var url = 'https://api.themoviedb.org/3/movie/'+ id +'?api_key=2427682e24fef29c09819c298ddd6df4';
			return $http.get(url);
		},

		getMovieInfo: function(urls, list) {
			var urlCalls = [], resultData = [];
			var deferred = $q.defer();
			angular.forEach(urls, function(url) {
				urlCalls.push($http.get(url));
			});
			// call all urls, and get all results together
			$q.all(urlCalls).then(function(result) {
				for (var key in result) {
					//merge two JSON file
					var obj = angular.extend({}, result[key].data, list[key]);
					resultData.push(obj);
				}
				deferred.resolve(resultData);
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		}
	};
		
});
