<template>
	<!-- <nav>chat home page</nav> -->
	<div class="chat-container">
		<chat-home-compnent v-if="!callUserId"></chat-home-compnent>
		<conservation-room v-else></conservation-room>
		<the-login v-if="0"></the-login>
		<the-signup v-if="0"></the-signup>
	</div>
</template>

<script>
import ChatHomeCompnent from '@/components/ChatHomeCompnent.vue';
import ConservationRoom from '@/components/ConservationRoom.vue';
import TheLogin from '@/components/TheLogin.vue';
import TheSignup from '@/components/TheSignup.vue';
export default {
	name: 'ChatHome',
	components: { ChatHomeCompnent, ConservationRoom, TheLogin, TheSignup },
	data() {
		return {
			callUserId: null,
			users: [],
		};
	},
	methods: {},
	async beforeMount() {
		if (!this.$store.getters['isAuthenticated']) {
			this.$router.push('/login');
		}
	},
};
</script>

<style scoped>
p {
	padding: 0px;
	margin: 0px;
}
.chat-container {
	width: 500px;
	height: 500px;
	background-color: rgb(27, 26, 26);
	margin-left: auto;
	margin-right: auto;
	padding-top: 20px;
	border-radius: 5px;
	position: relative;
}
</style>
