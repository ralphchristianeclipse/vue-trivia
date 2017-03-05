import Vue from 'vue';
import App from './App.vue';

function asyncComponents(components) {
    return components.reduce((components,component) => {
        components[component] = () => import(`./${component}.vue`);
        Vue.component(component,components[component]); 
        return components;
    },{})
}

let components = {
    App,
    ...asyncComponents([
        'Home',
        'Trivias',
    ]),
};

export default components;