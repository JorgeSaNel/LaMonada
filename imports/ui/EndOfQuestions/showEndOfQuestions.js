import { Template } from 'meteor/templating';

import { User_QuestionsAnswered } from '/imports/api/collections/methods.js';
import { Questions } from '/imports/api/collections/methods.js';
import { Matches } from '/imports/api/collections/methods.js';

import './showEndOfQuestions.html';
import './showEndOfQuestions.css';


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
    },

    ShowTextCorrectQuestions() {
        return Template.instance().CorrectQuestionsVisible.get();
    },
    ShowTextIncorrectQuestions() {
        return Template.instance().IncorrectQuestionsVisible.get();
    },
})

//On Qlik to Show all questions
Template.showEndOfQuestions.onCreated(function onCreated() {
    this.CorrectQuestionsVisible = new ReactiveVar(false);
    this.IncorrectQuestionsVisible = new ReactiveVar(false);
});

var isClickedShowCorrect = false
var isClickedShowIncorrect = false
Template.showEndOfQuestions.events({
    'click .js-showmessageCorrect'(event, instance) {
        ChangeCorrectQuestionTemplate(instance);
    },

    'click #floating-button-Correct'(event, instance) {
        ChangeCorrectQuestionTemplate(instance);
    },

    'click .js-showmessageIncorrect'(event, instance) {
        ChangeIncorrectQuestionTemplate(instance);

    },
    'click #floating-button-Incorrect'(event, instance) {
        ChangeIncorrectQuestionTemplate(instance);
    },
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.CorrectQuestionsAnswered.helpers({
    CorrectQuestions() {
        var id = 1;
        var idOfUserQuestion = 0;
        var arrayOfQuestions = new Array(correct);;

        while (id != 127) {
            var oneQuestion = User_QuestionsAnswered.findOne({
                "user": String(Meteor.userId()), "GameNumber": GetGameNumber(),
                "question": id, "correctAnswer": true
            });

            if (oneQuestion != undefined) {
                var oneQuestion = Questions.findOne({ "_id": String(oneQuestion.question) });
                if (oneQuestion != undefined) {
                    var arrayOfAnswers = new Array(5);
                    arrayOfAnswers["statement"] = oneQuestion.statement;
                    arrayOfAnswers["answer1"] = oneQuestion.answers.answer_1;
                    arrayOfAnswers["answer2"] = oneQuestion.answers.answer_2;
                    arrayOfAnswers["answer3"] = oneQuestion.answers.answer_3;
                    arrayOfAnswers["corectAnswer"] = oneQuestion.correctAnswer;

                    arrayOfQuestions[idOfUserQuestion] = arrayOfAnswers;
                    idOfUserQuestion = idOfUserQuestion + 1;
                }
            }

            id += 1;
        }
        return arrayOfQuestions;
    }
});

Template.IncorrectQuestionsAnswered.helpers({
    IncorrectQuestions() {
        var id = 1;
        var idOfUserQuestion = 0;
        var arrayOfQuestions = new Array(answered - correct);;

        while (id != 127) {
            var UserQuestion = User_QuestionsAnswered.findOne({
                "user": String(Meteor.userId()), "GameNumber": GetGameNumber(),
                "question": id, "correctAnswer": false
            });

            if (UserQuestion != undefined) {
                var oneQuestion = Questions.findOne({ "_id": String(UserQuestion.question) });
                if (oneQuestion != undefined) {
                    var arrayOfAnswers = new Array(6);
                    arrayOfAnswers["statement"] = oneQuestion.statement;
                    arrayOfAnswers["answer1"] = oneQuestion.answers.answer_1;
                    arrayOfAnswers["answer2"] = oneQuestion.answers.answer_2;
                    arrayOfAnswers["answer3"] = oneQuestion.answers.answer_3;
                    arrayOfAnswers["corectAnswer"] = oneQuestion.correctAnswer;
                    arrayOfAnswers["wrongAnswer"] = UserQuestion.userAnswerWas;

                    arrayOfQuestions[idOfUserQuestion] = arrayOfAnswers;
                    idOfUserQuestion = idOfUserQuestion + 1;
                }
            }

            id += 1;
        }
        return arrayOfQuestions;
    }
});

function ChangeCorrectQuestionTemplate(instance) {
    if (isClickedShowCorrect) {
        isClickedShowCorrect = false;
    }
    else {
        isClickedShowCorrect = true;
    }
    instance.CorrectQuestionsVisible.set(isClickedShowCorrect);
}

function ChangeIncorrectQuestionTemplate(instance) {
    if (isClickedShowIncorrect) {
        isClickedShowIncorrect = false;
    }
    else {
        isClickedShowIncorrect = true;
    }
    instance.IncorrectQuestionsVisible.set(isClickedShowIncorrect);
}

function GetGameNumber() {
    var getNumber = Matches.findOne({ "user": Meteor.userId() }, { "GameNumber": 1, sort: { "GameNumber": -1 } });
    if (getNumber === undefined) {
        new Meteor.Error('Error when getting Game Number from Database');
        return 0;
    }
    return getNumber.GameNumber;
}
