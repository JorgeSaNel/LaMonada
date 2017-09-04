import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import { menu } from './structure/menu.js';
import { footer } from './structure/footer.html';
import { userLogIn } from './userLogIn.js'
import { Questions } from '../api/questions.js';

import './body.html';
import './body.css';

Template.body.helpers({
    Questions() {
        var currentQuestion = Session.get('currentQuestion') || 1;
        Session.set('currentQuestion', currentQuestion);

        return Questions.findOne({ "_id": String(currentQuestion) });
    },
})

Template.body.events({
    'click :button': function (event, template) {

        var answer = template.find('input:radio[name=answer]:checked');
        var userAnswer = $(answer).val();
        $(answer).prop('checked', false); //Set radio button to false
       
        // Call CheckAnswer to know if the User Answer is the correct one.
        // The function is located at '../api/questions.js'
        Meteor.call('questions.checkAnswer', Number(userAnswer));
    }
});
