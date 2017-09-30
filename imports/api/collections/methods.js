import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

//All Collections
export const Questions = new Meteor.Collection('questions');
export const User_QuestionsAnswered = new Mongo.Collection('questionsAnsweredByUser');
export const Matches = new Mongo.Collection('matches');
export const BusinessActivity = new Mongo.Collection('businessActivity');
export const User_ActivityHistory = new Mongo.Collection('activityAnsweredByUser');

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

    'insertUserActivity'(activityId, activityYear, from, to, isCorrect) {
        check(activityId, Number);
        check(activityYear, Number);
        check(from, String);
        check(to, String);
        check(isCorrect, Boolean);

        // Make sure the user is logged in before inserting on DDBB
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        insertUserActivity(activityId, activityYear, from, to, isCorrect);

        checkEndOfActivity(activityId);

    },
    
    //TODO - QUITAR
    'resetear'() {
        // Make sure the user is logged in before inserting on DDBB
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Matches.update({
            user: Meteor.userId(),
            GameNumber: GetGameNumber()
        },
            {
                $set: {
                    lastActivityAnsweredCorrectly: 1,
                    endOfActivity: false,
                    updatedAt: new Date()
                }
            }
        )
    }
});

//Update Collections: Matches - User_QuestionsAnswered
//Use Collections: Questions
function insertAnswerOnDDBB(idQuestion, answer_User) {
    var rightAnswer = Questions.findOne({ "_id": String(idQuestion) });     // Equivalent to SELECT * WHERE "_id" = idQuestion on SQL
    var correctAnswer = false;

    // Update last Questions Answered Correctly by user in Matches.DB
    if (rightAnswer.correctAnswer == answer_User) {
        correctAnswer = true;
        Matches.update({
            user: Meteor.userId()
        },
            {
                $set: {
                    lastQuestionAnsweredCorrectly: String(idQuestion),
                    updatedAt: new Date()
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
                    endOfQuestions: true,
                    updatedAt: new Date()
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
        GameNumber: GetGameNumber()
    });
}

//Update Collections: Matches
function insertNewMatch() {
    if (Matches.find().count() === 0) {
        var gameNumber = 1;
    } else {
        var matchNumber = Matches.findOne({}, { "GameNumber": 1, sort: { "GameNumber": -1 } }); 
        var gameNumber = matchNumber.GameNumber + 1;
    }

    Matches.insert({
        user: Meteor.userId(),
        createdOn: new Date(),
        GameNumber: gameNumber,
        lastQuestionAnsweredCorrectly: 0
    });
}

//Update Collections: User_ActivityHistory - Matches
function insertUserActivity(activityId, activityYear, from, to, isCorrect) {
    User_ActivityHistory.insert({
        user: Meteor.userId(),
        answeredAt: new Date(),
        GameNumber: GetGameNumber(),
        id_Activity: activityId,
        year_Activity: activityYear,
        from: from,
        to: to,
        isCorrect: isCorrect,
    });

    if (isCorrect) {
        Matches.update({
            user: Meteor.userId(),
            GameNumber: GetGameNumber()
        },
            {
                $set: {
                    lastActivityAnsweredCorrectly: activityId,
                    updatedAt: new Date()
                }
            }
        );
    }
}

//Update Collections: Matches
//Use collection: BusinessActivity
function checkEndOfActivity(activityId) {
    var getActivity = BusinessActivity.findOne({ "_id": String(activityId) });

    if (getActivity.endOfActivities) {
        Matches.update({
            user: Meteor.userId(),
            GameNumber: GetGameNumber()
        }, {
                $set: {
                    endOfActivity: true,
                    updatedAt: new Date()
                }
            }
        );
    }
}

//Use Collections: Matches
function GetGameNumber() {
    var getNumber = Matches.findOne({ "user": Meteor.userId() }, { "GameNumber": 1, sort: { "GameNumber": -1 } });
    return getNumber.GameNumber;
}

