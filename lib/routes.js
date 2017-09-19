FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('MainBody', {main: 'MainPage'});
    }
});

FlowRouter.route('/StartBoard', {
    name: 'StartBoard',
    action() {
        BlazeLayout.render('MainBody', {main: 'StartPlayingOnBoard'});
    }
});