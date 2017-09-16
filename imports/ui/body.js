import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { menu } from './structure/menu.js';
import { footer } from './structure/footer.html';
import { userLogIn } from './userLogIn.js'

//Imports from DDBB
import { Questions } from '../api/collections/questions.js';
import { Matches } from '../api/collections/questions.js';
import { User_QuestionsAnswered } from '../api/collections/questions.js';

import './body.html';
import './body.css';

Template.body.helpers({
    Questions() {
        var match = Matches.find({ "user": String(Meteor.userId()) })
        if (match.count() === 0)
            Meteor.call('createMatch');

        //TODO - Hacer algo cuando un jugador quiera jugar más de una vez
        match = Matches.findOne({ "user": String(Meteor.userId()) });

        if (match.hasSecondOption)
            var questionID = Number(match.lastQuestionAnsweredCorrectly) + 2;
        else
            var questionID = Number(match.lastQuestionAnsweredCorrectly) + 1;

        var currentQuestion = Session.get('currentQuestion') || questionID;
        Session.set('currentQuestion', currentQuestion);

        return Questions.findOne({ "_id": String(currentQuestion) });
    }
})

var answered;
var correct;
Template.showEndOfQuestions.helpers({
    showAllQuestionsAnswered: function () {
        answered = User_QuestionsAnswered.find({
            "user": String(Meteor.userId()),
            "GameNumber": GetGameNumber()
        }).count()

        return answered;
    },

    showAllCorrectQuestions: function () {
        correct = User_QuestionsAnswered.find({
            "user": String(Meteor.userId()),
            "GameNumber": GetGameNumber(),
            correctAnswer: true
        }).count()
        return correct;
    },

    showAllIncorrectQuestions: function () {
        return User_QuestionsAnswered.find({
            "user": String(Meteor.userId()),
            "GameNumber": GetGameNumber(),
            correctAnswer: false
        }).count()
    },

    showMark: function () {
        var mark = correct * 10 / answered
        return parseFloat(Math.round(mark * 100) / 100).toFixed(2);
    },

})

var jokerFailed = false;
var hasJoker = false;
Template.body.events({
    'click :button': function (event, template) {
        var answer = template.find('input:radio[name=answer]:checked');
        var userAnswer = $(answer).val();
        $(answer).prop('checked', false); //Set radio button to false

        if (userAnswer == undefined) {
            //TODO - Mejorar el mostrado por pantalla del error
            window.alert("Contesta a la pregunta para continuar");
            return new Meteor.Error('Contesta a la pregunta para continuar');
        }

        var idQuestion = Session.get('currentQuestion')
        var rightAnswer = Questions.findOne({ "_id": String(idQuestion) });

        var nextQuestion = AnaliseNextQuestion(rightAnswer, userAnswer);

        Session.set('currentQuestion', nextQuestion);

        // Call CheckAnswer to check if the User Answer is the correct one.
        // The function is located at '\imports\api\collections\questions.js'
        Meteor.call('questions.checkAnswer', Number(userAnswer), Number(idQuestion));
    },
});

var ErrorAtCountQuestion = false;
function GetGameNumber() {
    var game = Matches.findOne(
        {
            "user": String(Meteor.userId()), "endOfGame": true
        }, {
            sort: { _id: -1 }
        });

    if (game == undefined && !ErrorAtCountQuestion){
        ErrorAtCountQuestion = true;
        window.alert("Debe contestar a todas las preguntas para continuar el juego");        
    }else{
        ErrorAtCountQuestion = false;
        return game.GameNumber;
    }
}


function AnaliseNextQuestion(rightAnswer, userAnswer) {
    var nextQuestion = 0;
    //Joker Questions - Set currentQuestion to next one
    if (rightAnswer.isJoker) {
        //Correct Answer
        if (rightAnswer.correctAnswer == userAnswer) {
            jokerFailed = false;
            if (rightAnswer.hasSecondOption) {
                hasJoker = true;
                nextQuestion = Number(rightAnswer._id) + 2;
            }
            else
                nextQuestion = Number(rightAnswer._id) + 1;
        }
        else {
            //Wrong Answer
            jokerFailed = true;
            if (!rightAnswer.hasSecondOption)
                nextQuestion = Number(rightAnswer._id) + 1;
            else {
                if (hasJoker) {
                    hasJoker = false;
                    nextQuestion = Number(rightAnswer._id) + 1;
                }
                else
                    nextQuestion = Number(rightAnswer.ifFailedGoTo);
            }
        }
    }
    else {
        //Normal question - Set currentQuestion to next one
        if (rightAnswer.location.circuit == "Circuito") {
            if (rightAnswer.hasSecondOption || (rightAnswer.isUnique && jokerFailed))
                nextQuestion = Number(rightAnswer._id) + 2;
            else
                nextQuestion = Number(rightAnswer._id) + 1;
        }
        else
            nextQuestion = Number(rightAnswer._id) + 2;
    }

    return nextQuestion;
}
