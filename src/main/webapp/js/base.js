
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
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
enpointstemplatefrontend.CLIENT_ID =
    '733256089952-v0gfvl7ca166pa1vldth1lh2l1s28ma2.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
enpointstemplatefrontend.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
enpointstemplatefrontend.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
enpointstemplatefrontend.userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      enpointstemplatefrontend.signedIn = true;
      document.getElementById('signinButton').innerHTML = 'Sign out';
      document.getElementById('setDisplayName').disabled = false;
      enpointstemplatefrontend.getProfile(); 
    }
  });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
enpointstemplatefrontend.signin = function(mode, callback) {
  gapi.auth.authorize({client_id: enpointstemplatefrontend.CLIENT_ID,
      scope: enpointstemplatefrontend.SCOPES, immediate: mode},
      callback);
};

/**
 * Presents the user with the authorization popup.
 */
enpointstemplatefrontend.auth = function() {
  if (!enpointstemplatefrontend.signedIn) {
    enpointstemplatefrontend.signin(false,
        enpointstemplatefrontend.userAuthed);
  } else {
    enpointstemplatefrontend.signedIn = false;
    document.getElementById('signinButton').innerHTML = 'Sign in';
    document.getElementById('setDisplayName').disabled = true;
    enpointstemplatefrontend.outputDisplayName('Not logged in.'); 
  }
};

/**
 * Prints a message to the message log.
 * param {Object} message Message to print.
 */
enpointstemplatefrontend.print = function(message) {
  var element = document.createElement('div');
  element.classList.add('row');
  element.innerHTML = message;
  document.getElementById('outputLog').appendChild(element);
};

/**
 * Outputs the display name in the banner.
 * param {Object} profile Profile with display name.
 */
enpointstemplatefrontend.outputDisplayName = function(name) {
  document.getElementById('displayName').innerHTML = name;
};

/**
 * Sets the user's display name via the API.
 * @param {string} name Display name for the profile.
 */
enpointstemplatefrontend.setDisplayName = function(name) {
  gapi.client.enpointstemplateapi.setDisplayName({'name': name}).execute(
      function(resp) {
        if (!resp.code) {
        	enpointstemplatefrontend.outputDisplayName("Welcome "+resp.displayName);
        } else {
          window.alert(resp.message);
        }
      });
};

/**
 * Retrieves the profile for the current user via the API.
 * Also sets the display name. 
 */
enpointstemplatefrontend.getProfile = function() {
  gapi.client.enpointstemplateapi.getProfile().execute(
      function(resp) {
        if (!resp.code) {
        	enpointstemplatefrontend.outputDisplayName("Welcome "+resp.displayName);
        } else {
          window.alert(resp.message);
        }
      });
};

/**
 * Enables the button callbacks in the UI.
 */
enpointstemplatefrontend.enableButtons = function() {
  
	document.getElementById('setDisplayName').onclick = function() {
		enpointstemplatefrontend.setDisplayName(document.getElementById('dispName').value); 
	  }
  
	document.getElementById('signinButton').onclick = function() {
		enpointstemplatefrontend.auth();
	}
};

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
      enpointstemplatefrontend.enableButtons();
      enpointstemplatefrontend.signin(true, enpointstemplatefrontend.userAuthed);
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('enpointstemplateapi', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};
