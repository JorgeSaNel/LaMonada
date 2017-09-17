import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import './allCollections.js';

Meteor.methods({
    // Check if answer is the correct one and update the DDBB
    'questions.checkAnswer'(answer_User, idQuestion) {
        check(answer_User, Number);
        check(idQuestion, Number);

        // Make sure the user is logged in before inserting on DDBB
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        insertAnswerOnDDBB(idQuestion, answer_User);
    },
    'createMatch'() {
        // Make sure the user is logged in before inserting on DDBB
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        insertNewMatch();
    },
});

function insertAnswerOnDDBB(idQuestion, answer_User) {
    var rightAnswer = Questions.findOne({ "_id": String(idQuestion) });     // Equivalent to SELECT * WHERE "_id" = idQuestion on SQL
    var correctAnswer = false;
    if (rightAnswer.correctAnswer == answer_User) { // Update last Questions Answered Correctly by user in Matches.DB
        correctAnswer = true;
        Matches.update({
            user: Meteor.userId()
        },
            {
                $set: {
                    lastQuestionAnsweredCorrectly: String(idQuestion)
                }
            }
        );
    }
    if (rightAnswer.endOfQuestions) {
        Matches.update({
            user: Meteor.userId()
        },
            {
                $set: {
                    endOfQuestions: true
                }
            }
        );
    }

    User_QuestionsAnswered.insert({
        user: Meteor.userId(),
        question: idQuestion,
        userAnswerWas: answer_User,
        answeredAt: new Date(),
        correctAnswer: correctAnswer,
        GameNumber: gameNumber
    });
}

var gameNumber;
function insertNewMatch() {
    if (Matches.find().count() === 0) {
        gameNumber = 1;
    } else {
        var matchNumber = Matches.findOne({}, { sort: { _id: -1 } });
        gameNumber = matchNumber.GameNumber + 1;
    }

    Matches.insert({
        user: Meteor.userId(),
        createdOn: new Date(),
        GameNumber: gameNumber,
        lastQuestionAnsweredCorrectly: 0
    });
}

