import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

export const Questions = new Meteor.Collection('questions');

Meteor.methods({
    // Check if the answer is the correct one and update the DDBB
    'questions.checkAnswer'(answer_User, idQuestion, correctAnswer) {

debugger;
        check(answer_User, Number);
        check(idQuestion, Number);
        check(correctAnswer, Boolean);

        // Make sure the user is logged in before inserting on DDBB
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        //TODO - Insert into database the solution
        if (correctAnswer) {
            // Right Answer
        } else {
            // Wrong Answer
        }
    },
});
