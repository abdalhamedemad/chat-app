import { createRouter, createWebHashHistory } from 'vue-router';
// import HomeView from "../views/HomeView.vue";
// import ChatHome from "../components/ChatHome.vue";
import ChatHome from '../views/ChatHomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import ConversationRoomView from '../views/ConversationRoomView.vue';
import AboutView from '../views/AboutView.vue';
const routes = [
	{
		path: '/',
		redirect: '/signup',
	},
	{
		path: '/signup',
		name: 'signup',
		component: SignupView,
	},
	{
		path: '/login',
		name: 'homey',
		component: LoginView,
	},
	{
		path: '/home',
		name: 'home',
		component: ChatHome,
	},
	{
		path: '/chat/:id',
		name: 'chat',
		component: ConversationRoomView,
	},
	{
		path: '/about',
		name: 'about',
		component: AboutView,
	},
	// {
	// 	path: '/about',
	// 	name: 'about',
	// 	// route level code-splitting
	// 	// this generates a separate chunk (about.[hash].js) for this route
	// 	// which is lazy-loaded when the route is visited.
	// 	component: () =>
	// 		import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
	// },
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
