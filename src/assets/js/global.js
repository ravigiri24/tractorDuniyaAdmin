$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})

function focusZero(dis) {
    debugger;
    if ($(dis).val() == 0) {
        $(dis).val() == '';
    }
}

function selectedRow(dis) {
    $('.menu_cate_row').removeClass('selected_menu');
    $(dis).addClass('selected_menu');
}
function arrowCollapse(dis, slide_id){
    if($(dis).find('.mdi').attr('class') == 'mdi mdi-chevron-down'){
        $(dis).find('.mdi').removeClass('mdi-chevron-down');
        $(dis).find('.mdi').addClass('mdi-chevron-up');
    }else{
        $(dis).find('.mdi').removeClass('mdi-chevron-up');
        $(dis).find('.mdi').addClass('mdi-chevron-down');
    }
    $('#'+slide_id).slideToggle();
    // checkMenuheight();
}
function checkMenuheight (){
    debugger;
    let takeaway=false;
    let tableblock = false;
    if($("#takeaway_container").is(":hidden")){
        takeaway = true;
    } 
    if($("#table_inner_container").is(":hidden")){
        tableblock =true;
    }
    if(takeaway){
        
    }
}