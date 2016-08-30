$(function () {
    LeftMenu.init();
});


var LeftMenu = {
    controls: {
        container: null
    },
    init: function () {
        this.controls.container = $('#root');
        $('.toggle-min').click(this.onToggle.bind(this));
    },
    onToggle: function (e) {
        e.preventDefault();

        this.controls.container.toggleClass('nav-min');

        return false;
    }
}