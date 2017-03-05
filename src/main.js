import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import VueMoment from 'vue-moment';
import routes from './routes';
import Components from './components';
import axios from 'axios';
import './logo.png';
window.axios = axios;
Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(VueMoment);

Vue.material.registerTheme({
    default: {
        primary: {
            color: 'blue-grey',
            hue: 900
        },
        warn: 'red',
    },
})

const router = new VueRouter({
    mode: 'history',
    routes
});

const app = new Vue({
    el: '#app',
    router,
    render: h => h(Components.App)
});
