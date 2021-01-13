import './style.scss';

const BRONZE = 0;
const SILVER = 10;
const GOLD = 100;

class Model {
    constructor(sourceURL) {
        this.url = sourceURL;
        this.contacts = [];
    }

    loadData() {
        $.getJSON({
            url: this.url
            })
            .then((data) => {
                this.contacts = data;
                this.onChangeContacts(this.contacts);
            })
            .then(async (data) => {
                for (var i = 0; i < this.contacts.length; i++) {
                    var contactURL = this.contacts[i].url;
                    var contactData = await $.getJSON({url: contactURL})

                    this.contacts[i].email = contactData.email;
                    this.contacts[i].location = contactData.location;
                    this.contacts[i].company = contactData.company;
                }
                this.onChangeContacts(this.contacts);
        })
    }

    editContact(index, field, data) {
        if (this.contats[index].hasOwnProperty(field))
            this.contacts[index][field] = data;

        this.onChangeContacts(this.contacts);
    }

    sortAsc() {
        this.contacts.sort((a, b) => {
            return (a.login.localeCompare(b.login));
        })
        this.onChangeContacts(this.contacts);
    }

    sortDesc() {
        this.contacts.sort((a, b) => {
            return (a.login.localeCompare(b.login));
        })
        this.contacts.reverse();
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
        $("main table thead tr").append("<th>email</th>");
        $("main table thead tr").append("<th>company</th>");
        $("main table thead tr").append("<th>location</th>");


        $("#tierall").prop("checked", true);
    }

    getTier(num) {
        let tier = "bronze";
        if (num >= 10) {
            tier = "silver";
        }
        if (num >= 100) {
            tier = "gold";
        }

        return tier;
    }

    displayContacts(contacts) {
        $("table").find("tbody").remove();

        let htmlStr = "<tbody>";
        contacts.forEach((contact) => {
            htmlStr += ("<tr class='" + this.getTier(contact.contributions) + "'>");

            htmlStr += "<td><img src='" + contact.avatar_url + "' /></td>";

            htmlStr += "<td>" + contact.id + "</td>" +
                "<td>" + contact.login + "</td>" +
                "<td>" + contact.contributions + "</td>"

            contact.email ? htmlStr += ("<td>" + contact.email + "</td>"): htmlStr += "<td>-</td>";
            contact.company ? htmlStr += ("<td>" + contact.company + "</td>"): htmlStr += "<td>-</td>";
            contact.location ? htmlStr += ("<td>" + contact.location + "</td>"): htmlStr += "<td>-</td>";

            htmlStr += "</tr>";
        })
        htmlStr += "</tbody>";

        $("main table").append(htmlStr);
    }

    filterTiers() {
        $("#tier3").prop("checked") ? $(".bronze").show() :$(".bronze").hide();
        $("#tier2").prop("checked") ? $(".silver").show() :$(".silver").hide();
        $("#tier1").prop("checked") ? $(".gold").show() :$(".gold").hide();

        if ($("#tierall").prop("checked")) {
            $(".bronze").show();
            $(".silver").show();
            $(".gold").show();
        }
    }

    bindFilterButton(fcn) {
        $("#filter-button").on("click", fcn);
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindFilterButton(this.handleFilter.bind(this));
        this.model.bindOnChangeContacts(this.handleChangeContacts.bind(this));
        this.model.loadData();
    }

    handleChangeContacts(contacts) {
        this.view.displayContacts(contacts);
    }

    handleFilter() {
        if ($("#sortasc").prop("checked")) this.model.sortAsc();
        if ($("#sortdesc").prop("checked")) this.model.sortDesc();

        this.view.filterTiers();
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