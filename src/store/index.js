import { createStore } from 'vuex';

export default createStore({
	state: {},
	getters: {
		isAuthenticated() {
			return localStorage.getItem('token') != undefined;
		},
	},
	mutations: {
		setUserData(state, payload) {
			if (payload.responseStatus == 200)
				Object.assign(state.userData, payload.responseData); // assign data to user Data
			return payload.responseStatus;
		},
	},
	actions: {
		async signup(context, payload) {
			try {
				const response = await fetch(
					`http://localhost:8080/auth/signup`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'accessToken'
							)}`,
						},
						body: JSON.stringify({
							email: payload.email,
							password: payload.password,
							name: payload.username,
						}),
					}
				);
				const responseData = await response.json();
				console.log(responseData);
				return response.status;
				// context.commit('setUserData', {
				// 	responseData,
				// 	responseStatus: response.status,
				// });
			} catch (error) {
				throw new Error('Creating a user failed!');
			}
		},
		async login(context, payload) {
			try {
				const response = await fetch(
					`http://localhost:8080/auth/login`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'accessToken'
							)}`,
						},
						body: JSON.stringify({
							email: payload.email,
							password: payload.password,
						}),
					}
				);
				const responseData = await response.json();
				console.log(responseData);
				localStorage.setItem('token', responseData.token);
				localStorage.setItem('userId', responseData.userId);
				console.log(response.status);
				return response.status;
				// context.commit('setUserData', {
				// 	responseData,
				// 	responseStatus: response.status,
				// });
			} catch (error) {
				throw new Error('Creating a user failed!');
			}
		},
		async sendMessage(context, payload) {
			try {
				const response = await fetch(
					`http://localhost:8080/feed/send-message`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token'
							)}`,
						},
						body: JSON.stringify({
							userId: localStorage.getItem('userId'),
							message: payload.message,
							toId: payload.toId,
						}),
					}
				);
				const responseData = await response.json();
				console.log(responseData);
				return response.status;
			} catch (error) {
				throw new Error('Creating a user failed!');
			}
		},
		async getUsers() {
			try {
				const response = await fetch(
					`http://localhost:8080/feed/users`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token'
							)}`,
						},
					}
				);
				const responseData = await response.json();
				console.log(responseData);
				return {
					status: response.status,
					userData: responseData.userData,
				};
			} catch (error) {
				throw new Error('Creating a user failed!');
			}
		},
		async getConversationData(context, payload) {
			try {
				const response = await fetch(
					`http://localhost:8080/feed/conversation-data`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token'
							)}`,
						},
						body: JSON.stringify({
							userId: localStorage.getItem('userId'),
							toId: payload.toId,
						}),
					}
				);
				const responseData = await response.json();
				console.log(responseData);
				return {
					status: response.status,
					conversationData: responseData.conversationData,
				};
			} catch (error) {
				throw new Error('Creating a user failed!');
			}
		},
	},
	modules: {},
});
