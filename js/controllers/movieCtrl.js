app.controller('movieCtrl', function($scope, movies) {
	// set default page value
	$scope.selected = $scope.selected || 0; // for movie icon
	$scope.selectedCast = $scope.selectedCast || 0; //for cast photo
	$scope.displayFlg = true;

	// with each click on movie icon, change the display info for description and credits
	$scope.select = function(idx) {
		$scope.selected = idx;
		getDspInfo($scope);
		$scope.dscptn = $scope.movies[$scope.selected];
		$scope.castList = $scope.movies[$scope.selected].cast;
		// change the cast selection with better performance
		$scope.selectedCast = 0;
		$scope.castImgPath = $scope.castList[$scope.selectedCast].profile_path;
	};

	// with each click on cast photo, change the photo to current one
	$scope.selectCast = function(idx) {
		$scope.selectedCast = idx;
		$scope.castImgPath = $scope.castList[$scope.selectedCast].profile_path;
	};

	// call factory method to get movie list
	var promise = movies.getMovieList();
	promise.then(function(result) {
		var list = result.data.parts;
		var num = list.length;
		var url, urls=[];
		for(var i=0; i <num; i++) {
			url = 'https://api.themoviedb.org/3/movie/'+ list[i].id +'/credits?api_key=2427682e24fef29c09819c298ddd6df4';
			urls.push(url);
		}
		// call factory method to all related movies' info
		var p = movies.getMovieInfo(urls, list);
		p.then(function (data) {
			$scope.movies = data;
			getDspInfo($scope);
			$scope.dscptn = $scope.movies[$scope.selected];
			$scope.castList = $scope.movies[$scope.selected].cast;
			$scope.castImgPath = $scope.castList[$scope.selectedCast].profile_path;
		});
	}, function(err) {
		$scope.displayFlg = false; 
	});
	// set writers and casts value 
	function getDspInfo(scope) {
		var crewList = scope.movies[scope.selected].crew;
			var writerList = [];
			for (var key in crewList) {
			if (crewList[key].job === 'Writer' || crewList[key].job === 'Screenplay') {
				writerList.push(crewList[key].name);
			}
		}
		scope.writers = writerList.join(', ');

		var stars = [];
		var castList = scope.movies[scope.selected].cast;
		for (var key in castList) {
			if (stars.length < 4) {
				stars.push(castList[key].name);
			} else {
				break;
			}
		}
		scope.stars = stars.join(', ');
	};
});
