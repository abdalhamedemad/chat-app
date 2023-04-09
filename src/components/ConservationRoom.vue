<template>
	<div class="conservation-container">
		<header class="conservation-header">
			id->{{ this.$route.params.id }}
		</header>
		<div class="body">
			<div
				v-for="conversationDataItem in conversationData"
				:key="conversationDataItem._id"
				:class="[
					conversationDataItem.me
						? 'sender-message'
						: 'receiver-message',
				]"
			>
				<p>{{ conversationDataItem.body }}</p>
			</div>
			<!-- <div class="receiver-message"><p>22222</p></div> -->
		</div>
		<footer class="conservation-footer">
			<div class="emoji">@</div>
			<div class="chat-input-message">
				<input
					v-model="message"
					type="text"
					placeholder="write a message"
				/>
			</div>
			<button @click="sendMessage" class="send-message">-></button>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'ConservationRoom',
	data() {
		return {
			message: '',
			conversationData: [],
		};
	},
	sockets: {
		connect() {
			// Fired when the socket connects.
			this.isConnected = true;
			this.$socket.emit('add-user', localStorage.getItem('userId'));
			console.log('connect');
		},
		disconnect() {
			this.isConnected = false;
			console.log('sisssi');
		},
		// reciving() {
		// 	console.log('conneddjdjct, data');
		// },
		// Fired when the server sends something on the "messageChannel" channel.
		messageChannel(data) {
			// this.socketMessage = data;
			// console.log('connect, data', data);
			this.recieveMessage(data);
		},
	},
	methods: {
		recieveMessage(message) {
			console.log('recieve message');
			this.conversationData.push({
				me: false,
				body: message,
			});
		},
		sendMessage() {
			this.$socket.emit('send-msg', {
				message: this.message,
				to: this.$route.params.id,
				from: localStorage.getItem('userId'),
			});
			console.log('send message');
			this.conversationData.push({
				me: true,
				body: this.message,
			});
			this.$store.dispatch('sendMessage', {
				message: this.message,
				toId: this.$route.params.id,
			});
			this.message = '';
		},
	},
	async beforeMount() {
		const conversationData = await this.$store.dispatch(
			'getConversationData',
			{
				toId: this.$route.params.id,
			}
		);
		this.conversationData = conversationData.conversationData;
		console.log('conversationData', this.conversationData);
	},
};
</script>

<style scoped>
input,
p {
	outline: none;
	margin: 0;
	padding: 0;
}
.conservation-header {
	position: absolute;
	width: 100%;
	height: 50px;
	top: 0;
	left: 0;
	background-color: brown;
}
.conservation-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: auto;
	margin-bottom: 50px;
}
.conservation-footer {
	position: absolute;
	width: 100%;
	height: 50px;
	bottom: 0;
	left: 0;
	background-color: brown;
	display: flex;
	align-items: center;
}
.chat-input-message {
	flex-grow: 1;
}
.chat-input-message input {
	width: 100%;
}
.send-message {
}
.conservation-container .body {
	margin-top: 50px;
	display: flex;
	flex-direction: column;
}
.sender-message {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-left: 20px;
	margin-bottom: 5px;
}
.receiver-message {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-right: 20px;
	margin-bottom: 5px;
}
.sender-message p,
.receiver-message p {
	background-color: brown;
	width: fit-content;
	padding: 2px;
	border-radius: 5px;
	color: aliceblue;
}
</style>
