var CONTACT_ROW_TEMPLATE = "<tr>"
                         +   "<td class='contact-id' name='contact-id' style='display:none'>${id}</td>"
                         +   "<td class='contact-name sortable' name='contact-name'>${name}</td>"
                         +   "<td class='contact-mail sortable' name='contact-mail'>${mail}</td>"
                         +   "<td><i class='icon-pencil' onclick='edit_contact(this)'></i> / <i class='icon-remove' onclick='remove_contact(this);'></i></td>"
                         + "</tr>";
var CURRENT_ID = 0;

function remove_contact_to_edit(id) {
    $("tr", "#contacts-table tbody").each(function() {
        var row_id = $("td.contact-id", this).text()
        if (row_id == id) {
            $(this).remove();
            return false;
        }
    });
}

function extract_contact_data(form) {
    return {"id": $("#contact-id", form).val(), "name": $("#contact-name",form).val(), "mail": $("#contact-mail",form).val()};
}

function get_new_id() {
    rv = CURRENT_ID;
    CURRENT_ID += 1;
    return rv;
}

function save_contact() {
    var form = $("#contact-form");
    $(".control-group", form).each(function() {
        cleanup_errors(this);
    });
    if (!validate_form(form)) {
        return false;
    }
    var data = extract_contact_data(form);
    if (!data.id) {
        data.id = get_new_id();
        if (data.id == -1) {
            return;
        }
    } else {
        remove_contact_to_edit(data.id);
    }
    insert_sorted($("#contacts-table"), generate_contact_row(data));
    update_table_status();
    cleanup_form();
    form.fadeOut();
};

function generate_contact_row(data){
   return $.tmpl( CONTACT_ROW_TEMPLATE, {"id": data.id, "name": data.name, "mail": data.mail});
}

function confirm_use_of_form(form) {
    return form.css('display') == 'none' || confirm('¿Está seguro que quiere abandonar los cambios que estaba haciendo?');
}

function edit_contact(icon) {
    var form = $("#contact-form");
    if (confirm_use_of_form(form)) {
        var row = $(icon).parent().parent()[0];
        $("#contact-id",form).val($(".contact-id", row).text());
        $("#contact-name",form).val($(".contact-name", row).text());
        $("#contact-mail",form).val($(".contact-mail", row).text());
        form.fadeIn();
        $("#contact-name",form).focus();
    }
}

function confirm_contact_removal(contact) {
    return confirm("¿Está seguro que quiere borrar a " + contact + "?");
}

function remove_contact(icon) {
    var row = $(icon).parent().parent()[0];
    var contact = $(".contact-name", row).text();
    if (confirm_contact_removal(contact)){
        $(row).fadeOut(300, function() {
            $(this).remove();
            update_table_status();
        });
        var form = $("#contact-form");
        if ($("#contact-id", form).val() == $(".contact-id", row).text()) {
            form.fadeOut();
        }
    }
}

function cleanup_form(form) {
    $("input", form).each(function(){$(this).val('');});
}

function validate_field(field, validator, error_message) {
    if (!validator(field)) {
        field.parent().addClass("error");
        $("<span class='help-inline'>"+error_message+"</span>").appendTo(field.parent());
        return false;
    }
    return true;
}

function value_already_exists(value, target_class, id) {
    var exists = false;
    $(target_class).each(function(){
        if (this.innerHTML == value && id != $(".contact-id",$(this).parents("tr"))[0].innerHTML) {
            exists = true;
            return false;
        }
    });
    return exists;
}

function is_valid_email_address(address) {
    var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    return pattern.test(address);
}

MIN_NAME_LENGTH = 0;
MAX_NAME_LENGTH = 35;
MIN_MAIL_LENGTH = 0;
MAX_MAIL_LENGTH = 35;

function validate_form(form) {
    var item_id = $("#contact-id", form).val();
    var valid_name = validate_field($("#contact-name",form), function(field) {
                        return $.trim(field.val()).length > MIN_NAME_LENGTH;
                     }, "El contacto tiene que tener un nombre") &&
                     validate_field($("#contact-name",form), function(field) {
                        return !value_already_exists($.trim(field.val()), "."+field.attr("id"), item_id);
                     }, "Ya existe un contacto con este nombre") &&
                     validate_field($("#contact-name",form), function(field) {
                        return $.trim(field.val()).length < MAX_NAME_LENGTH;
                     }, "El nombre del contacto no puede superar los 35 caracteres");

    valid_email = validate_field($("#contact-mail",form), function(field) {
                        return $.trim(field.val()).length > MIN_MAIL_LENGTH;
                  },    "El contacto tiene que tener un email") &&
                  validate_field($("#contact-mail",form), function(field) {
                        return $.trim(field.val()).length < MAX_MAIL_LENGTH;
                     }, "El mail del contacto no puede superar los 35 caracteres") &&
                  validate_field($("#contact-mail",form), function(field) {
                        return is_valid_email_address(field.val());
                  },    "El valor ingresado no es un email") &&
                  validate_field($("#contact-mail",form), function(field) {
                        return !value_already_exists($.trim(field.val()), "."+field.attr("id"), item_id);
                  },    "Ya existe un contacto con este mail");;
    return valid_name && valid_email;
}

function cleanup_errors(input) {
    $(".help-inline", input).remove();
    $(input).removeClass("error");
}

function new_contact() {
    var form = $("#contact-form");
    if (confirm_use_of_form(form)) {
        $(form).fadeIn();
        cleanup_form(form);
        $("#contact-name",form).focus();
    }
}

function cancel_contact() {
    $("#contact-form").fadeOut();
}

function update_table_status() {
    var table = $("#contacts-table tbody");
    var num_rows = $("tr", table).length;
    if (num_rows == 0) {
        $(table).addClass("empty");
    } else {
        $(table).removeClass("empty");
    }
}

function getURLParameter(name) {
    var rv = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    return rv ? decodeURI(rv) : rv;
}

$(document).ready(function() {
    var version = getURLParameter('v');
    if (version) {
        $("#version").text('v'+version);
        $.ajax({
            url: 'js/bugs' + version + '.js',
            dataType: "script",
            async: false
        });
    }
    cleanup_form($('#contact-form'));
    $(".control-group").change(function() {
        cleanup_errors(this);
    });
    update_table_status();
    update_current_sort({'field':'contact-name','direction':'asc'});
});
