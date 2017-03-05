import Components from './components';

const routes = [
    {
        path: '/',
        component: Components.Home,
        name: 'home'
    },
    {
        path: '/settings',
        component: Components.Settings,
        name: 'settings'
    },
    {
        path: '/trivias',
        component: Components.Trivias,
        name: 'trivias'
    },
]

export default routes;