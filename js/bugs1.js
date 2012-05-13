// Evitando mensaje 'no hay contactos guardados'
function update_table_status() {}
    
// Evitando ordenamientos
function leq(a,b) { return ((Math.random()*2)-1) <= 0; }
function geq(a,b) { return ((Math.random()*2)-1) >= 0; }
var COMPARATORS = {'asc':  leq, 'desc': geq };
function sort_keys(keys, order) {
    return keys.sort(leq);
}

// Soportando ordenamiento solo en browsers de Mozilla
$(document).ready(function(){
    if (!$.browser.mozilla ) {
        $("a","th.sortable").each(function(){
            $(this).attr('onclick','return false');
        });
    }
});

// Eliminando la opcion de borrar en browsers Mozilla
$(document).ready(function() {
    if ($.browser.mozilla ) {
        CONTACT_ROW_TEMPLATE = "<tr>"
                         +   "<td class='contact-id' name='contact-id' style='display:none'>${id}</td>"
                         +   "<td class='contact-name sortable' name='contact-name'>${name}</td>"
                         +   "<td class='contact-mail sortable' name='contact-mail'>${mail}</td>"
                         +   "<td><i class='icon-pencil' onclick='edit_contact(this)'></i></td>"
                         + "</tr>";

    }
});

// Solo soportando mails terminados en .com
function is_valid_email_address(address) {
    var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/);
    return pattern.test(address);
}

// Haciendo que cancelar igual guarde
function cancel_contact() {
    var item_id = $("#contact-id", "#contact-form").val();
    if (item_id) {
        var validation_bkup = validate_form;
        validate_form = function(form) {return true;}; // deshabilitar validaciones
        save_contact();
        validate_form = validation_bkup;
    } else {
        $("#contact-form").fadeOut();
    }
}

// Editando un elemento que no es el que pidieron editar
function edit_contact(icon) {
    var form = $("#contact-form");
    if (confirm_use_of_form(form)) {
        var row = $(icon).parent().parent()[0];
        fake_row = $(row).siblings().length > 0 ? $(row).siblings()[0] : row;
        $("#contact-id",form).val($(".contact-id", row).text());
        $("#contact-name",form).val($(".contact-name", fake_row).text());
        $("#contact-mail",form).val($(".contact-mail", fake_row).text());
        form.fadeIn();
        $("#contact-name",form).focus();
    }
}

// Cambiando el title de la app
document.title = 'Libreta de Contactos';

// Permitiendo nombres vacios
MIN_NAME_LENGTH = -1;
