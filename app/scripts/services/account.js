'use strict';

angular.module('cgAngularApp' )
  .factory('Account', function Account($http, $rootScope, $cookieStore, $serverConfig ) {
        return {
            Auth: function (username, password){
	            if (username.length && password.length) {
		            var User = $http.post($serverConfig.DlapServer,
			            {
				            request:
				            {
					            cmd: "login",
					            username: username,
					            password: password
				            }
			            });
		            User.success(function(data, status){
						if(data.response.code == "OK"){
							User.loggedIn = true;
							angular.extend(User,  data.response);
							User.accessLevel = "student";//TODO: this comes from RA

							$cookieStore.put('user', User);
							$cookieStore.put('token', User._token);
						}
			            else
						{
							User.loggedIn = false;
						}
		            });

	                $rootScope.user = User;


	                return User;
                }
                return null;
            },
            isLoggedIn: function() {
                var user = $cookieStore.get('user');
                if(user != null)
                {
                    $rootScope.user = user;
	                //GET COURSES HERE
	                $rootScope.course = {
		                id: "137770"
	                }
                }

                return $rootScope.user != null && $rootScope.user.loggedIn;
            },
	        Logout: function() {
		        $cookieStore.put('user',null);
		        $cookieStore.put('token', null);

		        $rootScope.user = null;
		        $rootScope.course = null;

	        }
        }
  });
