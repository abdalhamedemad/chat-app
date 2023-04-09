<template>
	<!-- <nav>chat home page</nav> -->
	<div class="chat-container">
		<the-signup></the-signup>
	</div>
</template>

<script>
import TheSignup from '@/components/TheSignup.vue';
export default {
	name: 'ChatHome',
	components: { TheSignup },
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
