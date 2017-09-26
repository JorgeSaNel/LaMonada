import { Template } from 'meteor/templating';

import './socialMedia.html';
import './socialMedia.css';

Template.ShareOnMedia.events({
    'click #TwitterButton': function (event, template) {
        Bert.alert('Redirigido a la página de Twitter para que puedas twittear', 'success', 'growl-bottom-right', 'fa-twitter');        
    },

    'click #FacebookButton': function (event, template) {
        Bert.alert('Redirigido a la página de Facebook para que puedas compartirlo con tus seguidores', 'success', 'growl-bottom-right', 'fa-facebook');        
    },

    'click #GooglePlusButton': function (event, template) {
        Bert.alert('Redirigido a la página de Google+ para que puedas publicarlo y compartirlo con tu círculo', 'success', 'growl-bottom-right', 'fa-google-plus');        
    },
});