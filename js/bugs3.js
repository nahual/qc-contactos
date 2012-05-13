// Evitando mensaje 'no hay contactos guardados'
function update_table_status() {}

// Eliminando el último caracter del contacto al guardar
function extract_contact_data(form) {
    var name = $("#contact-name",form).val();
    return {"id": $("#contact-id", form).val(), "name": name.substring(0,name.length-1), "mail": $("#contact-mail",form).val()};
}

// Duplicando contactos al editar
function remove_contact_to_edit(id) { }

