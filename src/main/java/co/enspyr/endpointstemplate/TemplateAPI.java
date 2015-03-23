package co.enspyr.endpointstemplate;

import static co.enspyr.endpointstemplate.OfyService.ofy;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;

import javax.inject.Named;

/**
 * Defines v1 of a template API, which provides simple methods for a user profile.
 */
@Api(
    name = "enpointstemplateapi",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
public class TemplateAPI {

	@ApiMethod(name = "setDisplayName", path = "setDisplayName")
	  public Profile setDisplayName(final User user, @Named("name") String name) throws UnauthorizedException {
		  
		  if (user == null) {
			  throw new UnauthorizedException("Authorization required");
		  }
		  
		  String userId = user.getUserId();
		  
		  // Get the Profile from the datastore if it exists, otherwise create a new one
	      Profile profile = ofy().load().key(Key.create(Profile.class, userId)).now();
	      if (profile == null) profile = new Profile(user); 
	      
		  profile.setDisplayName(name);
		  
		  // Save the entity in the datastore
	      ofy().save().entity(profile).now();
	      
		  return profile;
		  
	  }

	  @ApiMethod(name = "getProfile", path = "getProfile")
	  public Profile getProfile(final User user) throws UnauthorizedException {
	    if (user == null) {
	      throw new UnauthorizedException("Authorization required");
	    }
	    
	    String userId = user.getUserId();
	    Key key = Key.create(Profile.class, userId);

	    // Get the Profile from the datastore if it exists, otherwise create a new one
	    Profile profile = (Profile) ofy().load().key(key).now();
	    if (profile == null) {
	    	profile = new Profile(user); 
	    	// Save the entity in the datastore
	        ofy().save().entity(profile).now();
	    }
	    
	    return profile;
	    
	  }
}
