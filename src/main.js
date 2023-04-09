import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import VueSocketIOExt from 'vue-socket.io-extended';
// import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
// import io from 'socket.io-client';
// const socket = io('http://localhost:8080/');
// export const SocketInstance = socketio('http://localhost:8080');
// const options = { path: '/my-app/' };
const app = createApp(App);
app.use(store).use(router);
// app.use(VueSocketIO, SocketInstance);
try {
	// app.use(VueSocketIOExt, socket);
	app.use(
		new VueSocketIO({
			debug: true,
			connection: 'http://localhost:8080',
		})
	);
} catch (e) {
	console.log(e);
}
// app.use(
// 	new VueSocketIO({
// 		debug: true,
// 		connection: 'http://metinseylan.com:1992',
// 	})
// );
app.mount('#app');
