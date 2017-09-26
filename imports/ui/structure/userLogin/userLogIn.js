import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './userLogIn.html';
import './userLogIn.css';

Template.user_loggedin.events({
    "click #logout": function (e, tmpl) {
        Meteor.logout(function (err) {
            if (err) {
                //An error occured
                Bert.alert('Error al cerrar sesión. Por favor, vuelva a intentarlo', 'warning', 'fixed-bottom', 'fa-remove');
            } else {
                // your cleanup code here
                Object.keys(Session.keys).forEach(function (key) {
                    Session.set(key, undefined);
                });
                Session.keys = {}; // remove session keys

                FlowRouter.redirect('/') //Redirect to the home page using FlowRouter
                Bert.alert('Cerrado sesión correctamente', 'success', 'fixed-bottom', 'fa-check');
            }
        });
    }
});

Template.loginButtonsBig.events({
    'click a#loginGoogle': function (e, t) {
        e.preventDefault();
        // your cleanup code here
        Object.keys(Session.keys).forEach(function (key) {
            Session.set(key, undefined);
        });
        Session.keys = {};

        Meteor.loginWithGoogle({
            //Show what information is needed from the user
            //requestPermissions: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets'] //To manage spreadsheets
            requestPermissions: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile']
        }, function (err) {
            if (err) {
                Session.set('errorMessage', err.reason || 'Unknown error');
                Bert.alert('Error al Iniciar Sesión. Por favor, vuelva a intentarlo', 'warning', 'fixed-bottom', 'fa-remove');
            } else {
                Bert.alert('Iniciado sesión correctamente', 'success', 'fixed-bottom', 'fa-check');
                FlowRouter.redirect('/') //Redirect to the home page using FlowRouter
            }
        });
    }
});