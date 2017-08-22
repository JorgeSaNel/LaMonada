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

        return Questions.findOne({"_id" : String(currentQuestion)});
    },
})

var jokerFailed = false;
Template.body.events({
    'click :button': function (event, template) {

        var idQuestion = Session.get('currentQuestion');
        var answer = template.find('input:radio[name=answer]:checked');
        var userAnswer = $(answer).val();

        // SELECT * WHERE "_id" = idQuestion
        var rightAnswer = Questions.findOne({ "_id": String(idQuestion)});

        var nextQuestion = 0;
        // Set currentQuestion to next one
        if(rightAnswer.location.circuit == "Balance"){
                nextQuestion = idQuestion + 2;
        }else if(rightAnswer.isUnique == true){
            if(jokerFailed)
                nextQuestion = idQuestion + 2;
            else
                nextQuestion = idQuestion + 1;
        }else{
            if(jokerFailed)
                nextQuestion = idQuestion + 1;
            else
                nextQuestion = idQuestion + 2;
        }

        if (rightAnswer.correctAnswer == userAnswer) {
            // Right Answer

            //TODO - Insert into database the solution
        }else {
            // Wrong Answer
            if(rightAnswer.isJoker == true){
                jokerFailed = true;
                nextQuestion = 2;
            }
        }
        Session.set('currentQuestion', nextQuestion);        

    //TODO - Insert estado de la pregunta en el usuario
    // ../api/questions.js - La idea es que tire de este fichero
        //Meteor.call('questions.checkAnswer', answer, idQuestion);
    }
});
