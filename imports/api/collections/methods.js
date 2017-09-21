import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

//All Collections
export const Questions = new Meteor.Collection('questions');
export const User_QuestionsAnswered = new Mongo.Collection('questionsAnsweredByUser');
export const Matches = new Mongo.Collection('matches');
export const BusinessActivity = new Mongo.Collection('businessActivity');

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
    //TODO - FINISH
    'insertUserActivity'(){

    }
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
    //If it's the last question, insert the END
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
    var getGameNumber = Matches.findOne({"user": Meteor.userId()}, {"GameNumber": 1, sort: { "GameNumber": -1 }});

    User_QuestionsAnswered.insert({
        user: Meteor.userId(),
        question: idQuestion,
        userAnswerWas: answer_User,
        answeredAt: new Date(),
        correctAnswer: correctAnswer,
        GameNumber: getGameNumber.GameNumber
    });
}

function insertNewMatch() {
    if (Matches.find().count() === 0) {
        var gameNumber = 1;
    } else {
        var matchNumber = Matches.findOne({}, { sort: { _id: -1 } });
        var gameNumber = matchNumber.GameNumber + 1;
    }

    Matches.insert({
        user: Meteor.userId(),
        createdOn: new Date(),
        GameNumber: gameNumber,
        lastQuestionAnsweredCorrectly: 0
    });
}

