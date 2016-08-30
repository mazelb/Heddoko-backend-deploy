$(function () {
    if ($.fn.datepicker) {
        $('#Birthday').datepicker({
            autoclose: true,
        });
    }

    if ($.fn.slimScroll) {
        $('#nav').slimScroll({
            height: '100%'
        });
    }
});