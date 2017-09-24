import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

//Imports Collections
import { Questions } from '/imports/api/collections/methods.js';
import { Matches } from '/imports/api/collections/methods.js';
import { User_QuestionsAnswered } from '/imports/api/collections/methods.js';

import './showQuestions.html';
import './showQuestions.css';

Template.StartQuestions.helpers({
    Questions() {
        var match = Matches.find({ "user": String(Meteor.userId()) })
        if (match.count() === 0)
            Meteor.call('createMatch');

        match = Matches.findOne({ "user": String(Meteor.userId()) })
        /*if(match.endOfGame)
            //TODO - Hacer algo cuando un jugador quiera jugar más de una vez
            window.alert("Ya contestaste a todas las pregunas. Por favor, inicia la segunda fase");*/

        var questionID = 1;
        if (match.lastQuestionAnsweredCorrectly != 0) {
            var question = Questions.findOne({ "_id": String(match.lastQuestionAnsweredCorrectly) });

            if (question.hasSecondOption)
                var questionID = Number(match.lastQuestionAnsweredCorrectly) + 2;
            else
                var questionID = Number(match.lastQuestionAnsweredCorrectly) + 1;
        }

        var currentQuestion = Session.get('currentQuestion') || questionID;
        Session.set('currentQuestion', currentQuestion);

        return Questions.findOne({ "_id": String(currentQuestion) });
    },

    UserHasEnded() {
        return Matches.findOne({ "user": String(Meteor.userId()), "GameNumber": GetGameNumber() })
    }
})

Template.GotJoker.helpers({
    UserGotJoker(){
        return hasJoker;
    }
});

var jokerFailed = false;
var hasJoker = false;
var answeredQuestions = 0;
Template.ShowOneQuestion.events({
    'click :button': function (event, template) {
        var answer = template.find('input:radio[name=answer]:checked');
        var userAnswer = $(answer).val();
        $(answer).prop('checked', false); //Set radio button to false

        if (userAnswer == undefined) {
            Bert.alert('Contesta a una pregunta para continuar', 'default', 'fixed-top', 'fa-bell');
            return new Meteor.Error('Contesta a la pregunta para continuar');
        }

        answeredQuestions += 1;
        var idQuestion = Session.get('currentQuestion')
        var rightAnswer = Questions.findOne({ "_id": String(idQuestion) });

        var nextQuestion = AnaliseNextQuestion(rightAnswer, userAnswer);

        Session.set('currentQuestion', nextQuestion);

        // Call CheckAnswer to check if the User Answer is the correct one.
        // The function is located at '\imports\api\collections\questions.js'
        Meteor.call('questions.checkAnswer', Number(userAnswer), Number(idQuestion));
    },
});

Template.informationAboutQuestion.helpers({
    textAnsweredQuestions: function () {
        if (answeredQuestions >= 1)
            return "En esta sesión ha contestado a ";
    },

    numberAnsweredQuestions: function () {
        if (answeredQuestions == 1)
            return answeredQuestions + " pregunta";
        else if (answeredQuestions >= 2)
            return answeredQuestions + " preguntas";
    },
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
        return answered - correct;
    },

    showMark: function () {
        var mark = correct * 10 / answered
        return parseFloat(Math.round(mark * 100) / 100).toFixed(2);
    }
})

Template.NoPermissions.helpers({
    WithoutPermission() {
        Bert.alert('Debe contestar a todas las preguntas para continuar el juego', 'warning', 'fixed-top', 'fa-remove');
    }
});

function GetGameNumber() {
    var getNumber = Matches.findOne({ "user": Meteor.userId() }, { "GameNumber": 1, sort: { "GameNumber": -1 } });
    return getNumber.GameNumber;
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
                Bert.alert('¡Has ganado un Comodín!', 'success', 'growl-top-right', 'fa-child');         
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
                    Bert.alert('Vaya.. Has perdido un comodín', 'danger', 'growl-top-right', 'fa-thumbs-down');                                                             
                }
                else{
                    nextQuestion = Number(rightAnswer.ifFailedGoTo);
                    Bert.alert('Vaya.. Has fallado una pregunta comodín', 'danger', 'growl-top-right', 'fa-thumbs-down');                      
                }    
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


//On Mouse Over
Template.JokerQuestion.events({
    'mouseenter .js-showmessage'(event, instance) {
        //determina un margen de pixels del div al raton
        margin = 150;

        // Modificamos el contenido de la capa
        document.getElementById('flotante').innerHTML = GetJokerText();

        // Posicionamos la capa flotante
        document.getElementById('flotante').style.top = margin + "px";
        document.getElementById('flotante').style.left = margin + "px";
        document.getElementById('flotante').style.display = 'block';
        return;
    },

    'mouseleave .js-showmessage'(event, instance) {
        document.getElementById('flotante').style.display='none';
    },
});

function GetJokerText(){
    return "¡Pregunta Comodín! Si aciertas esta pregunta, ganas una banana-comodín que te salvará" +
    " de retroceder más adelante, y podrás contiunar el circuito. Si no, te tocará retroceder " + 
    "e ir contestando a las 2ª opciones de las preguntas de los círculos rellenos hasta llegar a la siguiente pregunta comodín" + 
    ", pero esta vez sin posibilidad de ganar una banana"
}
