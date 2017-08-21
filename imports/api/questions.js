import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Questions = new Mongo.Collection('questions');

/*Meteor.methods({
    'questions.checkAnswer'(answer_User, idQuestion) {
Console.Log("Entramos");
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        var pregunta = Questions.findOne({ "_id": idQuestion });

        if (pregunta.correctAnswer == answer_User) {
            Console.Log("Pregunta Acertada");
        }
        else {
            Console.Log("Pregunta Fallada");
        }
    },
});*/


