TabularTables = {};


Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Students = new Tabular.Table({
    name: "StudentList",
    collection: Students,
    columns: [
        {data: "studentid", title: "Student ID"},
        {data: "username", title: "Username"},
        {data: "lastName", title: "Last Name"},
        {data: "firstName", title: "First Name"},
        {data: "email", title: "Email"},
        {data: "gradYear", title: "Graduating"},
        {
            data: "phone",
            title: "Phone",
            render: function (val) {
                return friendlyPhoneFormat(val)
            }

        },
        {
            data: "_id",
            title: "View/Edit/Delete",
            render: function (val, type, doc) {
                return "<a href = '/studentForm/" + val + "'>View/Edit/Delete</a>";

            }
        }

    ]
})
;

TabularTables.Users = new Tabular.Table({
    name: "UserList",
    collection: Meteor.users,
    columns: [
        {data: "username", title: "username"},
        {
            data: "_id",
            title: "Send Password",
            render: function (val, type, doc) {
                return "<a href = '/passwordUser/" + val + "'>Send Password Link</a>";

            }
        },
        {
            data: "_id",
            title: "View/Edit/Delete",
            render: function (val, type, doc) {
                return "<a href = '/editUserForm/" + val + "'>View/Edit/Delete</a>";

            }
        }

    ]
});


TabularTables.Consults = new Tabular.Table({
    name: "ConsultList",
    collection: Consults,
    columns: [
        {
            data: "createdAt",
            title: "Created",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {data: "shortName", title: "Name"},
        {data: "tweetHeader", title: "Tweet Alert"},
        {
            data: "_id", title: "Consult/Hits",
            render: function (val) {
                var consultpage = ConsultPages.findOne({consult_id: val});
                var consult = Consults.findOne({_id: val});
                if (consultpage.consultURL && consult.shortURL) {
                    return "<a href = " + consultpage.consultURL + " target='_blank' >Consult</a> / " + Math.round(consultpage.count);
                } else {
                    return "<a href = " + Meteor.absoluteUrl() + "oncall/" + val + " target='_blank' >Consult</a> / " + Math.round(consultpage.count);
                }

            }
        },

        // the key url is the same as the consult url, just with the id reversed


        {
            data: "_id", title: "Key",
            render: function (val) {
                return "<a href = " + Meteor.absoluteUrl() + "key/" + reverse(val) + " target='_blank' >Key</a>";
            }
        },


        {
            data: "phone",
            title: "Phone",
            render: function (val) {
                return friendlyPhoneFormat(val)
            }

        },
        {
            data: "_id",
            title: "Edit",
            render: function (val, type, doc) {
                return "<a href = '/consultForm/" + val + "'>Edit/Review/Grade</a>";

            }
        },
        {
            data: "activate",
            title: "Active?",
            render: function (val) {
                if (val) {
                    return "Active";
                }


            }
        }

    ]
});



