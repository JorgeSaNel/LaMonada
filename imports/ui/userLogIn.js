import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './userLogIn.html';

/*Template.user_loggedout.rendered = function () {
    $('.dropdown-toggle').dropdown()
}

Template.user_loggedin.rendered = function () {
    $('.dropdown-toggle').dropdown()
}*/

Template.user_loggedout.events({
    "click #login": function (e, tmpl) {
        e.preventDefault();
        
        Meteor.loginWithGoogle({
            //Show what information is needed from the user
            requestPermissions: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets']
        }, function (err) {
            if (err) {
                Session.set('errorMessage', err.reason || 'Unknown error');
                Bert.alert('Error al Iniciar Sesión. Por favor, vuelva a intentarlo', 'warning', 'fixed-top', 'fa-remove');
            } else {
                Bert.alert('Iniciado sesión correctamente', 'success', 'fixed-top', 'fa-check');
            }
        });
    }
});

Template.user_loggedin.events({
    "click #logout": function (e, tmpl) {
        Meteor.logout(function (err) {
            if (err) {
                //An error occured
                Bert.alert('Error al cerrar sesión. Por favor, vuelva a intentarlo', 'warning', 'fixed-top', 'fa-remove');
            } else {
                // your cleanup code here
                Object.keys(Session.keys).forEach(function (key) {
                    Session.set(key, undefined);
                });
                Session.keys = {}; // remove session keys
                //Router.go('/');  // redirect to the home page or elsewhere using iron:router

                Bert.alert('Cerrado sesión correctamente', 'success', 'fixed-top', 'fa-check');
            }
        });
    }
});