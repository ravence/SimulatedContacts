import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.scss'

const BRONZE = 0;
const SILVER = 10;
const GOLD = 100;

class Model {
    constructor(sourceURL) {
        this.url = sourceURL;
        this.contacts = [];
    }

    async loadData() {
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
            .catch((error) => {
                this.onChangeContacts(this.contacts);
                alert(error.statusText);
        })
    }

    editContact(index, fieldToData) {
        console.log(fieldToData);
        fieldToData.forEach((element) => {
            this.contacts[index][element.name] = element.value;
        })

        this.onChangeContacts(this.contacts);
    }

    getContact(index) {
        if (index < this.contacts.length)
            return this.contacts[index]
        else
            return null;
    }

    bindOnChangeContacts(fcn) {
        this.onChangeContacts = fcn;
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
}

class View {
    constructor() {

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
                "<td>" + contact.contributions + "</td>";

            htmlStr += this.drawExternalLoad(contact, "email");
            htmlStr += this.drawExternalLoad(contact, "company");
            htmlStr += this.drawExternalLoad(contact, "location");


            htmlStr += "<td><button class='btn btn-secondary edit' data-toggle='modal' data-target='#editContact'>edit</button></td>"

            htmlStr += "</tr>";
        })
        htmlStr += "</tbody>";

        $("main table").append(htmlStr);
    }

    drawExternalLoad(contact, field) {
        var str = "<td>"
        if (contact[field] === undefined) {
            str += '<div class="spinner-border spinner-border-sm" role="status">';
        }
        else if (contact[field] === null) {
            str+= '-';
        }
        else {
            str += contact[field];
        }
        str += "</td>";
        return str;
    }

    filterTiers() {
        $("#tier-filter").val() === "Bronze" ? $(".bronze").show() :$(".bronze").hide();
        $("#tier-filter").val() === "Silver" ? $(".silver").show() :$(".silver").hide();
        $("#tier-filter").val() === "Gold" ? $(".gold").show() :$(".gold").hide();

        if ($("#tier-filter").val() === "All") {
            $(".bronze").show();
            $(".silver").show();
            $(".gold").show();
        }
    }

    modalOnShow(contact) {
        $("#edit-form").trigger("reset");

        $("#username-input").val(contact.login);
        $("#contributions-input").val(contact.contributions);
        $("#email-input").val(contact.email);
        $("#company-input").val(contact.company);
        $("#location-input").val(contact.location);
    }

    bindFilterButton(fcn) {
        $("#filter-button").on("click", fcn);
    }

    bindEditButton(fcn) {
        $("table").on("click", ".edit", (event) => {
            fcn(event.target.parentElement.parentElement);
        });
    }

    bindSubmit(fcn) {
        $(".submit").on("click", fcn);
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.i = -1

        this.view.bindFilterButton(this.handleFilter.bind(this));
        this.model.bindOnChangeContacts(this.handleChangeContacts.bind(this));
        this.view.bindSubmit(this.handleSubmitEdit.bind(this));
        this.model.loadData();

        this.view.bindEditButton(this.handleEdit.bind(this));
    }

    handleChangeContacts(contacts) {
        this.view.displayContacts(contacts);
    }

    handleEdit(tableRow) {
        this.i = $.inArray(tableRow, $("tbody tr"))
        this.view.modalOnShow(this.model.contacts[this.i]);
    }

    handleSubmitEdit() {
        if (!document.getElementById("edit-form").reportValidity())
            return;
        let changes = $("#edit-form").serializeArray();
        this.model.editContact(this.i, changes);
        $("#editContact").modal("hide");

    }

    handleFilter() {
        if ($("#sort-select").val() === "asc") this.model.sortAsc();
        if ($("#sort-select").val() === "desc") this.model.sortDesc();

        this.view.filterTiers();
    }
}

let x = new Controller(new Model("https://api.github.com/repos/thomasdavis/backbonetutorials/contributors"),
    new View());
