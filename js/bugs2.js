// Evitando ordenamientos
function leq(a,b) { return ((Math.random()*2)-1) <= 0; }
function geq(a,b) { return ((Math.random()*2)-1) >= 0; }
var COMPARATORS = {'asc':  leq, 'desc': geq };
function sort_keys(keys, order) {
    return keys.sort(leq);
}

// Poniendo un valor por default no vacio en el formulario
function cleanup_form(form) {
    $("input", form).each(function(){$(this).val('');});
    $($("input", form)[1]).val('Nombre');
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

// Borrando contacto aunque se cancele el delete  en browsers no-Mozilla
$(document).ready(function() {
    if (!$.browser.mozilla ) {
        confirm_contact_removal = function(contact) {
            confirm("¿Está seguro que quiere borrar a " + contact + "?");
            return true;
        }
    }
});

// Tirando mensaje de mail duplicado siempre
function value_already_exists(value, target_class, id) {
    var exists = false;
    $(target_class).each(function(){
        if (this.innerHTML == value &&
           (
                (target_class != ".contact-mail" && id != $(".contact-id", $(this).parents("tr"))[0].innerHTML) ||
                target_class == ".contact-mail"
                )
            ) {
            exists = true;
            return false;
        }
    });
    return exists;
}

// Permitiendo guardar hasta 10 contactos
function get_new_id() {
    if ($("tr","#contacts-table tbody").length == 10) {
        return -1;
    }
    rv = CURRENT_ID;
    CURRENT_ID += 1;
    return rv;
}

