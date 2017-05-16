import { Template } from 'meteor/templating';
import { menu } from './structure/menu.js';
import { footer } from './structure/footer.html';

import './body.html';
import './body.css';

Template.user_loggedout.events({
    "click #login": function (e, tmpl) {
        Meteor.loginWithGoogle({
            //Show what information is needed from the user
            requestPermissions: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets']
        }, function (err) {
            if (err)
                Session.set('errorMessage', err.reason || 'Unknown error');
        });
    }
});

Template.user_loggedin.events({
    "click #logout": function (e, tmpl) {
        Meteor.logout(function (err) {
            if (err) {
                //error handling
            } else {
                //show an alert
            }
        });
    }
});

