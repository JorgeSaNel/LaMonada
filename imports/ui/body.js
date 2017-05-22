import { Template } from 'meteor/templating';
import { menu } from './structure/menu.js';
import { footer } from './structure/footer.html';
import { userLogIn } from './userLogIn.js'
import { Questions } from '../api/questions.js';

import './body.html';
import './body.css';

Template.body.helpers({
    Questions() {
        return Questions.find()
    },
})

Template.question.events({
    'click :button': function (event, template) {
        var idQuestion = 1;
        var answer = template.find('input:radio[name=answer]:checked');
        var userAnswer = $(answer).val();

        // SELECT * WHERE "_id" = idQuestion
        var rightAnswer = Questions.findOne({ "_id": idQuestion});

console.log(userAnswer);
console.log(rightAnswer.correctAnswer);

        if (rightAnswer.correctAnswer == userAnswer) {
            console.log("Pregunta Acertada");
        }
        else {
            console.log("Pregunta Fallada");
        }
        //TODO - Insert estado de la pregunta en el usuario
        Meteor.call('questions.checkAnswer', answer, idQuestion);
    }
});
