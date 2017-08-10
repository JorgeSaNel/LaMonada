Meteor.startup(function () {
  // Insert sample data if the student collection is empty
  if (Student.find().count() === 0) {
    JSON.parse(Assets.getText("student.json")).student.forEach(function (doc) {
      Student.insert(doc);
    });
  }
});