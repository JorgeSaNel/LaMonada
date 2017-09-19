import { Template } from 'meteor/templating';

import './menu.html';
import './menu.css';


Template.menu.events({
    'click .OpenNav'() {
        // Set the checked property to the opposite of its current value
        document.getElementById("mySidenav").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
    },

    'click .closeNav'() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    },
});