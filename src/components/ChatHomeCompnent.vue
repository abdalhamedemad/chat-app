<template>
	<div
		class="chat-item"
		v-for="user in users"
		:key="user._id"
		@click="handelClick(user._id)"
	>
		<div class="chat-photo"></div>
		<div class="chat-content">
			<div class="chat-name">
				<p v-if="user.name != null">{{ user.name }}</p>
			</div>
			<div class="chat-last-message">
				<p>hey ! how are you</p>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'ChatHome',
	components: {},
	data() {
		return {
			users: [],
		};
	},
	methods: {
		handelClick(id) {
			this.$router.push(`/chat/${id}`);
		},
	},
	async beforeMount() {
		if (!this.$store.getters['isAuthenticated']) {
			this.$router.push('/login');
		}
		const res = await this.$store.dispatch('getUsers');
		if (res.status == 200) {
			this.users = res.userData;
		}
	},
};
</script>
<style scoped>
p {
	padding: 0px;
	margin: 0px;
}
div {
	color: red;
}
.chat-item {
	width: calc(100%-20px);
	height: 50px;
	color: black;
	background-color: black;
	padding-left: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
	margin-bottom: 8px;
}
.chat-photo {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: brown;
	margin-right: 20px;
}
.chat-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	color: aliceblue;
}
.chat-content .chat-name {
	color: inherit;
}
.chat-content .chat-last-message {
	color: inherit;
	font-size: 10px;
	overflow: hidden;
}
</style>
