import { Meteor } from 'meteor/meteor';
import { Questions } from '../../api/collections/questions.js';
import { Matches } from '../../api/collections/questions.js';

Meteor.startup(function () {

  // Insert sample data if the questions collection is empty
  // In this case we insert all the questions that users must answer firstly
  if (Questions.find().count() === 0) {
    JSON.parse(Assets.getText("questions.json")).questions.forEach(function (doc) {
      Questions.insert(doc);
    });
  }
});