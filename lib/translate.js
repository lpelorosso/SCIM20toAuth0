'use strict';

const Joi = require('joi');

module.exports = {
    toAuth0,
    fromAuth0,
    validateScim,
};

const usersExtensionPath = 'urn:ietf:params:scim:schemas:extension:auth0:2.0:User';
const default_conn_name = 'Username-Password-Authentication';

function toAuth0(scimUser, cb) {
    const auth0User = {
      "connection": (scimUser[usersExtensionPath] && scimUser[usersExtensionPath].connectionName) || default_conn_name,//extension
      "email": scimUser.emails[0].value,
      "username": scimUser.userName,
      "password": scimUser.password,
      "picture": scimUser.photos[0].value,
      "given_name": scimUser.name ? scimUser.name.givenName : undefined,
      "family_name": scimUser.name ? scimUser.name.familyName : undefined,
      "name": scimUser.name ? scimUser.name.formatted : undefined,
    };
    
    cb(null, auth0User);
}

function fromAuth0(auth0User, cb) {
    const scimUser = {
        "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:User",
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
        ],
        "id" : auth0User.user_id,
        "externalId" : auth0User.userName || auth0User.email, 
        "userName": auth0User.userName || auth0User.email,
        "name": {
            "formatted" : auth0User.name,
            "givenName": auth0User.given_name,
            "familyName": auth0User.family_name,
            "middleName": auth0User.middleName,
            "honoricPrefix": auth0User.honoricPrefix,
            "honoricSuffix": auth0User.honoricSuffix
        },
        "emails": [{
            "value": auth0User.email,
            "primary": true
        }],
        "photos": [{
            "value": auth0User.picture,
            "type": "photo"
        }],
        "meta" : {
            "resourceType" : "User",
            "created" : auth0User.created_at,
            "lastModified" : auth0User.updated_at,
            "version" : auth0User.version
        },
        "urn:ietf:params:scim:schemas:extension:auth0:2.0:User": {
            "connectionName": auth0User.identities[0].connection
        }
    };

    process.nextTick(() => cb(null, scimUser));
}

function validateScim(payload, cb) {
    const schema = Joi.object({
        
    });
    
    return Joi.validate(payload, schema, cb);
}