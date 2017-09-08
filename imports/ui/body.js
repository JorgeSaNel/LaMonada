import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { menu } from './structure/menu.js';
import { footer } from './structure/footer.html';
import { userLogIn } from './userLogIn.js'
import { Questions } from '../api/collections/questions.js';

import './body.html';
import './body.css';

Template.body.helpers({
    Questions() {
        var currentQuestion = Session.get('currentQuestion') || 1;
        Session.set('currentQuestion', currentQuestion);

        return Questions.findOne({ "_id": String(currentQuestion) });
    },
})

var jokerFailed = false;
Template.body.events({
    'click :button': function (event, template) {
        var answer = template.find('input:radio[name=answer]:checked');
        var userAnswer = $(answer).val();
        $(answer).prop('checked', false); //Set radio button to false

        var idQuestion = Session.get('currentQuestion')
        var rightAnswer = Questions.findOne({ "_id": String(idQuestion) });     // SELECT * WHERE "_id" = idQuestion
        var correctAnswer = false;
        if (rightAnswer.correctAnswer == userAnswer) {     // It's the right answer
            correctAnswer = true;
        }else{
            if (rightAnswer.isJoker == true) {
                jokerFailed = true;
            }
        }
        // Call CheckAnswer to check if the User Answer is the correct one.
        // The function is located at '\imports\api\collections\questions.js'
        Meteor.call('questions.checkAnswer', Number(userAnswer), Number(idQuestion), correctAnswer);


        // Set currentQuestion to next one
        var nextQuestion = 0;
        if (rightAnswer.isJoker == true) {
            jokerFailed = true;
            nextQuestion = 2;
        }else if (rightAnswer.location.circuit == "Balance") {
            nextQuestion = idQuestion + 2;
        } else if (rightAnswer.isUnique == true) {
            if (jokerFailed)
                nextQuestion = idQuestion + 2;
            else
                nextQuestion = idQuestion + 1;
        } else {
            if (jokerFailed)
                nextQuestion = idQuestion + 1;
            else
                nextQuestion = idQuestion + 2;
        }

        Session.set('currentQuestion', nextQuestion);
    }
});
