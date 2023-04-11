<template>
	<div class="login-container">
		<div class="email">
			<label for="u-r-email">Enter U R Email</label>
			<input v-model="email" id="ur-r-email" type="text" />
		</div>
		<div class="email">
			<label for="u-r-email">Enter U R username</label>
			<input v-model="username" id="ur-r-email" type="text" />
		</div>
		<div class="email">
			<label for="u-r-email">key size in bits</label>
			<input
				v-model="keySize"
				id="ur-r-email"
				type="number"
				placeholder="15 to 20"
			/>
			<button @click="generateKeys(keySize)">generate keys</button>
		</div>
		<div class="password">
			<label for="u-r-pass">Enter U R Password</label>
			<input v-model="password" id="ur-r-pass" type="password" />
		</div>
		<div class="submit">
			<button @click="handelSignup">Signup</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TheSignup',
	data() {
		return {
			username: '',
			password: '',
			email: '',
			keySize: '',
			p: null,
			q: null,
			n: null,
			e: null,
			d: null,
		};
	},
	methods: {
		validateUsername() {
			return this.username.length > 5 && this.username.length < 20;
		},
		validatePassword() {
			return this.password.length > 5 && this.password.length < 20;
		},
		validateEmail() {
			return (
				this.email.length > 5 &&
				this.email.length < 20 &&
				this.email.includes('@')
			);
		},
		handelSignup() {
			console.log('handelSignup');
			if (
				!this.validateUsername() ||
				!this.validatePassword() ||
				!this.validateEmail()
			) {
				alert(
					'username is not valid or password is not valid or email is not valid'
				);
				return;
			}
			this.$store
				.dispatch('signup', {
					email: this.email,
					password: this.password,
					username: this.username,
					p: this.p,
					n: this.n,
					q: this.q,
					e: this.e,
					d: this.d,
				})
				.then(() => {
					this.$router.push('/login');
				});
		},
		isPrimee(n) {
			for (let i = 2; i <= n / 2; i++) {
				if (n % i === 0) {
					return false;
				}
			}
			return true;
		},
		generateRandomNumbers(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		},
		generateRandomPrimeNumbers(bitsSize) {
			let p = this.generateRandomNumbers(
				2 ** (bitsSize - 1),
				2 ** bitsSize - 1
			);
			while (!this.isPrimee(p)) {
				p = this.generateRandomNumbers(
					2 ** (bitsSize - 1),
					2 ** bitsSize - 1
				);
			}
			return p;
		},
		gcd(a, b) {
			if (b === 0) return a;
			return this.gcd(b, a % b);
		},
		inverseModulo(a, m) {
			let M = m;
			let x1, x2, y1, y2, q, r, x, y;
			x1 = 0;
			x2 = 1;
			y1 = 1;
			y2 = 0;
			while (m > 0) {
				q = Math.floor(a / m);
				r = a - q * m;
				x = x2 - q * x1;
				y = y2 - q * y1;
				a = m;
				m = r;
				x2 = x1;
				x1 = x;
				y2 = y1;
				y1 = y;
			}
			if (a != 1) {
				return 'a and m are not coprime';
			} else {
				if (x2 < 0) {
					console.log('x2', x2);
					console.log('m', M);
					x2 += M;
					x2 = x2 % M;
				}
				return x2;
			}
		},
		generateKeys(key_size) {
			// if (20 <= Number(key_size) && 25 <= Number(key_size)) {
			console.log(123);
			let p = this.generateRandomPrimeNumbers(Number(key_size));
			console.log(p, this.isPrimee(p));
			let q = this.generateRandomPrimeNumbers(Number(key_size));
			while (q == p) {
				q = this.generateRandomPrimeNumbers(Number(key_size));
			}
			console.log(q, this.isPrimee(p));
			let phi = (p - 1) * (q - 1);
			let e = this.generateRandomNumbers(3, 100);
			while (this.gcd(e, phi) != 1) {
				e = this.generateRandomNumbers(3, 100);
			}
			let d = this.inverseModulo(e, phi);
			console.log('d:', d, 'e:', e, 'p*q', p * q, 'phi', phi, 'e', e);
			this.p = p;
			this.q = q;
			this.e = e;
			this.d = d;
			this.n = p * q;
			// }
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
