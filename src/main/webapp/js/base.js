
/**
 * @fileoverview
 * Provides methods for the Endpoints Template UI and interaction with the
 * Endpoints Template API.
 *
 * @author nick.meinhold@gmail.com (Nick Meinhold)
 */

/** global namespace for this project. */
var enpointstemplatefrontend = enpointstemplatefrontend || {};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
enpointstemplatefrontend.init = function(apiRoot) {
  // Loads the OAuth and helloworld APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      angular.bootstrap(document, ['endpointstemplateAngApp']); // Bootstrap the angular module after loading the 
		// Google libraries so the Google JavaScript library is ready in the angular modules.
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('enpointstemplateapi', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};


/**
 * @ngdoc object
 * @name endpointstemplateAngApp
 * @requires $routeProvider
 * @requires conferenceControllers
 * @requires ui.bootstrap
 *
 * @description
 * Root app, which routes and specifies the partial html and controller depending on the url requested.
 * ui.bootstrap is used to show the login modal window   
 *
 */
var angApp = angular.module('endpointstemplateAngApp',
    ['endpointstemplateControllers', 'ngRoute', 'ui.bootstrap']).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/view1', {
                    templateUrl: '/partials/view1.html',
                    controller: 'View1Ctrl'
                }).
                when('/view2', {
                    templateUrl: '/partials/view2.html',
                    controller: 'View2Ctrl'
                }).
                when('/conference/detail/:websafeConferenceKey', {
                    templateUrl: '/partials/conference_detail.html',
                    controller: 'ConferenceDetailCtrl'
                }).
                when('/profile', {
                    templateUrl: '/partials/profile.html',
                    controller: 'MyProfileCtrl'
                }).
                when('/', {
                    templateUrl: '/partials/home.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);

/**
 * @ngdoc service
 * @name oauth2Provider
 *
 * @description
 * Service that holds the OAuth2 information shared across all the pages.
 *
 */
angApp.factory('oauth2Provider', function ($modal) {
    var oauth2Provider = {
        CLIENT_ID: '733256089952-v0gfvl7ca166pa1vldth1lh2l1s28ma2.apps.googleusercontent.com',
        SCOPES: 'https://www.googleapis.com/auth/userinfo.email profile',
        signedIn: false
    };

    /**
     * Calls the OAuth2 authentication method.
     */
    oauth2Provider.signIn = function (callback) {
        gapi.auth.signIn({
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'accesstype': 'online',
            'approveprompt': 'auto',
            'scope': oauth2Provider.SCOPES,
            'callback': callback
        });
    };

    /**
     * Logs out the user.
     */
    oauth2Provider.signOut = function () {
        gapi.auth.signOut();
        // Explicitly set the invalid access token in order to make the API calls fail.
        gapi.auth.setToken({access_token: ''})
        oauth2Provider.signedIn = false;
    };

    /**
     * Shows the modal with Google+ sign in button.
     *
     * @returns {*|Window}
     */
    oauth2Provider.showLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/login.modal.html',
            controller: 'OAuth2LoginModalCtrl'
        });
        return modalInstance;
    };

    return oauth2Provider;
});

/**
 * @ngdoc constant
 * @name HTTP_ERRORS
 *
 * @description
 * Holds the constants that represent HTTP error codes.
 *
 */
angApp.constant('HTTP_ERRORS', {
    'UNAUTHORIZED': 401
});

