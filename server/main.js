import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
  // Insert sample data if the student collection is empty
  if (Student.find().count() === 0) {
    JSON.parse(Assets.getText("student.json")).student.forEach(function (doc) {
      Student.insert(doc);
    });
  }
});

// export const Lists = new Mongo.Collection('lists');

// Meteor.startup(() => {
//   if (Lists.find().count() === 0) {
//     const data = [
//       {
//         name: 'Meteor Principles',
//         items: [
//           'Data on the Wire',
//           'One Language',
//           'Database Everywhere',
//           'Latency Compensation',
//           'Full Stack Reactivity',
//           'Embrace the Ecosystem',
//           'Simplicity Equals Productivity',
//         ],
//       },
//       {
//         name: 'Languages',
//         items: [
//           'Lisp',
//           'C',
//           'C++',
//           'Python',
//           'Ruby',
//           'JavaScript',
//           'Scala',
//           'Erlang',
//           '6502 Assembly',
//         ],
//       },
//       {
//         name: 'Favorite Scientists',
//         items: [
//           'Ada Lovelace',
//           'Grace Hopper',
//           'Marie Curie',
//           'Carl Friedrich Gauss',
//           'Nikola Tesla',
//           'Claude Shannon',
//         ],
//       },
//     ];

//     let timestamp = (new Date()).getTime();

//     data.forEach((list) => {
//       const listId = Lists.insert({
//         name: list.name,
//         incompleteCount: list.items.length,
//       });

//       list.items.forEach((text) => {
//         Todos.insert({
//           listId,
//           text,
//           createdAt: new Date(timestamp),
//         });

//         timestamp += 1; // ensure unique timestamp.
//       });
//     });
//   }
// });
