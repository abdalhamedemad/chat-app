<template>
	<div class="login-container">
		<div class="email">
			<label for="u-r-email">Enter U R Email</label>
			<input v-model="email" id="ur-r-email" type="text" />
		</div>
		<div class="password">
			<label for="u-r-pass">Enter U R Password</label>
			<input v-model="password" id="ur-r-pass" type="password" />
		</div>
		<div class="submit">
			<button @click="handelLogin">Login</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TheSignup',
	data() {
		return {
			password: '',
			email: '',
		};
	},
	methods: {
		validatePassword() {
			return this.password.length > 5;
		},
		validateEmail() {
			return this.email.length > 5 && this.email.includes('@');
		},
		async handelLogin() {
			console.log('handelSignup');
			if (!this.validatePassword() || !this.validateEmail()) {
				alert(
					'username is not valid or password is not valid or email is not valid'
				);
				return;
			}
			const res = await this.$store.dispatch('login', {
				email: this.email,
				password: this.password,
				userId: localStorage.getItem('userId'),
			});
			// console.log('jjj', res);
			if (res == 200) {
				this.$router.push('/home');
			}
		},
	},
};
</script>

<style scoped>
.login-container {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.email,
.password {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-bottom: 20px;
	color: aliceblue;
}
.email label,
.password label {
	color: inherit;
	margin-bottom: 10px;
}
.submit {
	display: flex;
	justify-content: center;
}
.submit button {
	background-color: aliceblue;
	color: black;
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
}
</style>
