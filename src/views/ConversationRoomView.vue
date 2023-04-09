<template>
	<!-- <nav>chat home page</nav> -->
	<div class="chat-container">
		<conservation-room></conservation-room>
	</div>
</template>

<script>
import ConservationRoom from '@/components/ConservationRoom.vue';
export default {
	name: 'ChatHome',
	components: { ConservationRoom },
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
