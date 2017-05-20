import { Template } from 'meteor/templating';
import { menu } from './structure/menu.js';
import { footer } from './structure/footer.html';
import { userLogIn } from './userLogIn.js'
import { Questions } from '../api/questions.js';

import './body.html';
import './body.css';

Template.body.helpers({
    Questions(){
         return Questions.find()
    }
})
