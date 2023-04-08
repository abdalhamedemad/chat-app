import { createRouter, createWebHashHistory } from 'vue-router';
// import HomeView from "../views/HomeView.vue";
// import ChatHome from "../components/ChatHome.vue";
import ChatHome from '../views/ChatHomeView.vue';

const routes = [
	{
		path: '/',
		name: 'home',
		component: ChatHome,
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
