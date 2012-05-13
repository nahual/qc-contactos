var current_sort;

$(document).ready(function(){
    $("th.sortable").each(function(){
        $("<a href='' class='sorter' name='"+$(this).attr('name')+"' order='asc' onclick='return sort_table($(this))'>&uArr;</a>").appendTo(this);
        $("<a href='' class='sorter' name='"+$(this).attr('name')+"' order='desc' onclick='return sort_table($(this))'>&dArr;</a>").appendTo(this);
    });
});

function update_sort_links() {
    $('a.sorter').each(function(){
        $(this).removeClass('active_sort');
    });
    var current = $('a.sorter[name='+current_sort.field+'][order='+current_sort.direction+']');
    $(current).addClass('active_sort');
}

function update_current_sort(sort_data) {
    current_sort = sort_data;
    update_sort_links();
}

function sort_keys(keys, order) {
    keys = keys.sort();
    if (order == 'desc') {
        keys = keys.reverse();
    }
    return keys;
}

function sort_table(sort_data) {
    update_current_sort({'field':sort_data.attr('name'),'direction':sort_data.attr('order')});
    var table = $(sort_data).parents("table");
    var converter = sort_data.attr('converter') || function(a) {return a;};

    var table_content = {};
    var keys = [];
    var selector = 'td[name='+sort_data.attr('name')+']';
    $("tbody tr", table).each(function() {
        var key = converter($(selector, this).text());
        table_content[key] = this;
        keys.push(key);
    });
    keys = sort_keys(keys, sort_data.attr('order'));

    $('tbody', table).empty();
    $(keys).each(function(){
        $(table_content[this]).appendTo(table);
    });
    return false;
}

function leq(a,b) {
    return a.toLowerCase().localeCompare(b.toLowerCase()) <= 0;
}

function geq(a,b) {
    return a.toLowerCase().localeCompare(b.toLowerCase()) >= 0;
}

var COMPARATORS = {'asc':  leq, 'desc': geq };

function insert_sorted(table, row) {
    var rows = $('tbody tr', table); 
    if (rows.length == 0) {
        $(row).appendTo('tbody', table);
        return;
    }
    var selector = 'td[name='+current_sort.field+']';
    var value_to_insert = $(selector, row).text();
    var comparator = COMPARATORS[current_sort.direction];
    
    var position;
    $(rows).each(function() {
        if (comparator($(selector, this).text(), value_to_insert)) {
            position = position ? position + 1 : 1;
        } else {
            return false;
        }
    });
    if (position) {
        var before_row = $(rows)[position-1];
        $(row).insertAfter(before_row);
    } else {
        var first_row = $(rows)[0];
        $(row).insertBefore(first_row);
    }
}

