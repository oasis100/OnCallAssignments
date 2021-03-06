if (!Meteor.isClient) {
} else {

    // Handles the result of the consult form submission
    Template.consultForm.events({
        "submit #consultForm": function (event) {
            event.preventDefault();


            if ($('#activate').is(':checked') && (!($('#consultVisible').is(':checked')))) {
                sAlert.warning('Note that the phone number has been activated but the students cannot view the consult webpage.', {
                    effect: 'scale', position: 'top-right',
                    timeout: '10000', onRouteClose: false, stack: true, offset: '0px'
                });
            }

            if ($('#shortName').val() == "") {
                sAlert.error('A name must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#phone').val() == "") {
                sAlert.error('A Twilio phone number must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#phoneMessage').val() == "") {
                sAlert.error('An outgoing message must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#maxSeconds').val() == "") {
                sAlert.error('What is the maximum length of the recording allowed?', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            }

            else {

                var consult =
                {
                    id: $('#id').val(),
                    shortName: $('#shortName').val(),
                    tweetHeader: $('#tweetHeader').val(),
                    consultMD: $('#consultMD').val(),
                    consultVisible: $('#consultVisible').is(':checked'),
                    keyMD: $('#keyMD').val(),
                    keyVisible: $('#keyVisible').is(':checked'),
                    phoneMessage: $('#phoneMessage').val(),
                    hangupMessage: $('#hangupMessage').val(),
                    maxSeconds: $('#maxSeconds').val(),
                    phone: standardizedPhoneFormat($('#phone').val()),
                    voice: $('input:radio[name=voice]:checked').val(),
                    transcribe: $('#transcribe').is(':checked'),
                    voiceCallerIdLookup: $('#voiceCallerIdLookup').is(':checked'),
                    shortURL: $('#shortURL').is(':checked'),
                    activate: $('#activate').is(':checked')
                };


                Meteor.call('upsertConsultData', consult, function (result, error) {
                });
                Router.go('consults');
            }
        },


        "click #deleteConsultButton": function (event) {
            if (confirm("Are you sure you want to delete this consult?")) {
                Meteor.call('deleteConsult', $('#id').val(), function (error, result) {
                    if (result) {
                        sAlert.success('Deleted.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                        Router.go('consults');
                    } else if (error) {
                        console.log(error);
                        sAlert.error('Something went wrong  Check console.log.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                    }
                    else {
                        sAlert.error('Could not delete consult.  Students may have already responded to it.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });

                    }

                });
            }

        },
        // this is paired with the 'tweetLength' helper below to dynamically change the value on the screen
        "keydown #tweet": function (event) {
            Session.set('currenttweet', $('#tweet').val().length);
        }
    });

    // Use jquery to select values in DOM based on what is already in db
    Template.consultForm.onRendered(function () {
        var consult = Consults.findOne({_id: Session.get("consult_id")});
        if (consult.voice == 'alice') {
            $("#voiceAlice").prop("checked", true);
        } else if (consult.voice == 'woman') {
            $("#voiceWoman").prop("checked", true);

        } else if (consult.voice == 'man') {
            $("#voiceMan").prop("checked", true);
        }


        Session.set('currenttweet', $('#tweet').val().length);


    });


    // Retrieve consult responses from Twilio website
    Template.responses.created = function () {
        // consult_id was set by iron router when the route was started
        Responses.find({consult_id: Session.get("consult_id")}).forEach(function (response) {
            // Only hit Twilio if we don't have the information already
            if (!response.recordingURL) {
                Meteor.call('callInfo', response.callSid, function (err, data) {
                    if (err) {
                        sAlert.error('There was an error.  Check the console.log.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                        console.log(err);
                    } else {
                        Meteor.call('recordingInfo', response.callSid, function (err, recordingInfo) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(recordingInfo)

                            }
                        });
                    }
                });
            }
        });
    };


    Template.consultForm.helpers({
            // combined with the keydown event handler above to update tweet length on display.
            tweetLength: function () {
                return Session.get('currenttweet');
            },


            buildTweet: function () {
                var tweet = this.tweetHeader + " ";

                var consultURL = ConsultPages.findOne({consult_id: this._id}).consultURL;

                if (consultURL && this.shortURL) {
                    tweet += "    " + consultURL + "    ";
                } else {
                    tweet += Meteor.absoluteUrl() + "oncall/" + this._id + "    ";
                }

                tweet += "    " + friendlyPhoneFormat(this.phone);

                if (tweet) {
                    return tweet
                }

            },

            twilioPhones: function () {
                // simple:reactive-method
                return ReactiveMethod.call("phoneList");
            },

            phoneSelected: function (selectPhone) {

                if (standardizedPhoneFormat($('#twilioPhoneNumber').val()) == standardizedPhoneFormat(selectPhone)) {
                    return "selected"
                }
            },

            getConsultMD: function (consult_id) {
                return ConsultPages.findOne({consult_id: consult_id}).consultMD;
            }
            ,

            consultVisible: function (consult_id) {
                if (ConsultPages.findOne({consult_id: consult_id}).consultVisible) {
                    return true
                }
            }
            ,
            getKeyMD: function (consult_id) {
                return KeyPages.findOne({consult_id: consult_id}).keyMD;
            }
            ,

            keyVisible: function (consult_id) {
                if (KeyPages.findOne({consult_id: consult_id}).keyVisible) {
                    return true
                }


            }
        }
    )
    ;

 
    Template.consultResponses.helpers({
        responses: function () {
            var consult = Template.parentData(1);

            return Responses.find({consult_id: consult._id}, {createdAt: 1});
        },

        createdAtFormatted: function () {
            return moment(this.createdAt).format("YYYY-MM-DD HH:mm");
        },

        students: function () {
            return Students.find({}, {sort: {lastName: 1, firstName: 1}});

        }



    });
    /*  This was an incredibly hackish way of getting the students associated with the response record.  The problem
     * was trying to associate button presses with forms when they all had the same names and ids. Ended up giving
     *  each form/button/select a different name and pulling the info out of the event.currentTarget scope.*/
    Template.consultResponses.events({
        "submit .studentSelectForm": function (event) {
            event.preventDefault();
            var response_id = event.currentTarget.id;
            var student_id = $("#selector_" + response_id).val();
            var response = {
                student_id: student_id,
                response_id: response_id
            };

            Meteor.call('updateResponse', response, function (err, data) {
                if (err) {
                    sAlert.error('There was an error.  Check the console.log.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });
                    console.log(err);
                } else {
                    $("#btnConfirm_" + response.response_id).removeClass('btn-default').addClass('btn-success').html("Changed");
                    sAlert.success('Response associated with student.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });
                    //  check to see if student phone matches response phone. If not, offer to change it
                    var student_phone = Students.findOne({_id: response.student_id}).phone;
                    var response_phone = Responses.findOne({_id: response.response_id}).from;
                    if (student_phone.length < 7) {
                        var updatePhone = Meteor.call('updateStudentPhone', student_id, response_phone);
                    } else if (student_phone != response_phone) {
                        if (confirm("The phone number associated with this student is " + student_phone + ".   Would you like to change it to " + response_phone + "?")) {
                            var updatePhone = Meteor.call('updateStudentPhone', student_id, response_phone);
                        }
                    }
                }
            });
        }

    });

    // Change the color of the buttons on the responses to blue if they have already been associated with students.
    Template.consultResponses.onRendered(function () {
        var consult_id = this.data._id;

        Responses.find({consult_id: consult_id}).forEach(function (response) {
            if (response.student_id) {
                $("#btnConfirm_" + response._id).removeClass('btn-default').addClass('btn-info').html("Change");
                $("#selector_" + response._id).val(response.student_id);
            }

            var student = Students.findOne({phone: standardizedPhoneFormat(response.from)});
            if (student) {
                $("#selector_" + response._id).val(student._id);
            }
        });


        $('[data-toggle="tooltip"]').tooltip();

        $('#responseTable').DataTable();


    });


}