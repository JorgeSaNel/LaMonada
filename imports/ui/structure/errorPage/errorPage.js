import { Template } from 'meteor/templating';

import './errorPage.html';

Template.WithoutPermissions.helpers({
    WithoutPermission() {
        Bert.alert('Debe contestar a todas las preguntas para continuar el juego', 'warning', 'fixed-top', 'fa-remove');
    }
});