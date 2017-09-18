import { Template } from 'meteor/templating';

import './userLogIn.html';

Template.user_loggedout.rendered = function() {
    $('.dropdown-toggle').dropdown()
}

Template.user_loggedin.rendered = function() {
    $('.dropdown-toggle').dropdown()
}

Template.user_loggedout.events({
    "click #login": function (e, tmpl) {
        event.preventDefault();
        Meteor.loginWithGoogle({
            //Show what information is needed from the user
            requestPermissions: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets']
        }, 
        function (err) {
            if (err)
                Session.set('errorMessage', err.reason || 'Unknown error');
        });
    }
});

Template.user_loggedin.events({
    "click #logout": function (e, tmpl) {
        event.preventDefault();
        Meteor.logout(function (err) {
            if (err) {
                //error handling
            } else {
                //show an alert  
            }
        });
    }
});