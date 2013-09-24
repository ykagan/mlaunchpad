'use strict';

angular.module('cgAngularApp' )
  .factory('Account', function Account($http, $rootScope, $cookieStore) {
        return {
            Auth: function (username, password){
                if(username.length > 0 && password == username)
                {
                    $rootScope.user = {
                        username: username,
                        password: password,
                        accessLevel: "student",
                        id: "userId1",
                        loggedIn: true
                    };
                    $cookieStore.put('user', $rootScope.user);

                    return true;
                }
                return false;
            },
            isLoggedIn: function()
            {
                var user = $cookieStore.get('user');
                if(user != null)
                {
                    $rootScope.user = user;
                }

                return $rootScope.user != null && $rootScope.user.loggedIn;
            }
        }
  });
