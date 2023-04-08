<template>
	<!-- <nav>chat home page</nav> -->
	<div class="chat-container">
		<chat-home-compnent v-if="0"></chat-home-compnent>
		<conservation-room v-if="0"></conservation-room>
		<the-login v-if="1"></the-login>
	</div>
</template>

<script>
import ChatHomeCompnent from '@/components/ChatHomeCompnent.vue';
import ConservationRoom from '@/components/ConservationRoom.vue';
import TheLogin from '@/components/TheLogin.vue';
export default {
	name: 'ChatHome',
	components: { ChatHomeCompnent, ConservationRoom, TheLogin },
	data() {
		return {};
	},
	methods: {},
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
