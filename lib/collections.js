Students = new Meteor.Collection('students');
Consults = new Meteor.Collection('consults');
Credentials = new Meteor.Collection('credentials');  // login information for voice/messaging service
Responses = new Meteor.Collection('responses');
ConsultPages = new Meteor.Collection('consultpages');
KeyPages = new Meteor.Collection('keypages');

ConfirmedStudentResponses = new Meteor.Collection(null);  // local non-saved collection