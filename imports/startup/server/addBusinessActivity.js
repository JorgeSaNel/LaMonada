import { Meteor } from 'meteor/meteor';
import { BusinessActivity } from '../../api/collections/methods.js';

Meteor.startup(function () {

  // Insert sample data if the questions collection is empty
  // In this case we insert all activities that the company has through years
  if (BusinessActivity.find().count() === 0) {
    JSON.parse(Assets.getText("businessActivity.json")).businessActivity.forEach(function (doc) {
        BusinessActivity.insert(doc);
    });
  }
});