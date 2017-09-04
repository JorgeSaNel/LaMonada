import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Questions = new Meteor.Collection('questions');


// CHECK
// https://forums.meteor.com/t/solved-meteor-methods-and-calls-method-not-found-404-error/19776/4
// https://stackoverflow.com/questions/27739206/error-invoking-method-method-not-found-404

var jokerFailed = false;
Meteor.methods({
    // Check if the answer is the correct one and update the DDBB
    'questions.checkAnswer'(answer_User) {

debugger;
        check(answer_User, Number);

        // Make sure the user is logged in before inserting on DDBB
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        var idQuestion = Session.get('currentQuestion');
        var rightAnswer = Questions.findOne({ "_id": String(idQuestion) });     // SELECT * WHERE "_id" = idQuestion

        var nextQuestion = 0;
        // Set currentQuestion to next one
        if (rightAnswer.location.circuit == "Balance") {
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

        //TODO - Insert into database the solution
        if (rightAnswer.correctAnswer == answer_User) {
            // Right Answer
        } else {
            // Wrong Answer
            if (rightAnswer.isJoker == true) {
                jokerFailed = true;
                nextQuestion = 2;
            }
        }
    },
});


