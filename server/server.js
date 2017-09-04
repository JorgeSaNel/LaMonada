import { Meteor } from 'meteor/meteor';
//import '../imports/api/Collections.js';

Questions = new Meteor.Collection('questions');

Meteor.startup(function () {

  // Insert sample data if the questions collection is empty
  // In this case we insert all the questions that users must answer firstly
  
  if (Questions.find().count() === 0) {
    JSON.parse(Assets.getText("questions.json")).questions.forEach(function (doc) {
      Questions.insert(doc);
    });
  }
});