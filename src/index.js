import './style.scss';

class Model {
    constructor(sourceURL) {
        this.url = sourceURL;
        this.contacts = [];
    }

    loadData() {
        var ths = this;

        $.getJSON({
            url: this.url,
            success: function(data) {
                ths.contacts = data;
                ths.onChangeContacts(ths.contacts);
            }
        })
    }

    editContact(index, field, data) {
        if (this.contats[index].hasOwnProperty(field))
            this.contacts[index][field] = data;

        this.onChangeContacts(this.contacts);
    }

    bindOnChangeContacts(fcn) {
        this.onChangeContacts = fcn;
    }
}

class View {
    constructor() {
        $("main").append("<table></table>");
        $("main table").append("<thead></thead>");

        $("main table thead").append("<tr></tr>");

        $("main table thead tr").append("<th></th>");
        $("main table thead tr").append("<th>id</th>");
        $("main table thead tr").append("<th>username</th>");
        $("main table thead tr").append("<th>contributions</th>");
    }

    displayContacts(contacts) {
        $("table").not("thead").remove("tr");

        let htmlStr = "<tbody>";
        contacts.forEach((contact) => {
            htmlStr += "<tr>";

            htmlStr += "<td><img src='" + contact.avatar_url + "' /></td>";

            htmlStr += "<td>" + contact.id + "</td>" +
                "<td>" + contact.login + "</td>" +
                "<td>" + contact.contributions + "</td>"
            htmlStr += "</tr>";
        })
        htmlStr += "</tbody>";

        $("main table").append(htmlStr);
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindOnChangeContacts(this.view.displayContacts);
        this.model.loadData();
    }
}

new Controller(new Model("https://api.github.com/repos/thomasdavis/backbonetutorials/contributors"),
    new View());

// CONTACTS:
// stores the array of js objects

// DISPLAY:
// takes js objects and puts in table

// START:
// changes data and then updates display
