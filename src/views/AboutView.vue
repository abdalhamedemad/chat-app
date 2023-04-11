<template>
	<div class="about">
		<h1>Attak & analysis Page</h1>
		<input type="text" placeholder="cipherText" v-model="cipherText" />
		<input type="text" placeholder="plainText" v-model="plainText" />
		<input
			type="number"
			placeholder="KeySizeInBits"
			v-model="keySizeInBits"
		/>
		<button
			@click="
				attackToGetThePrivateKey(cipherText, plainText, keySizeInBits)
			"
		>
			attackToGetThePrivateKey
		</button>
		<p>attackD: {{ attackD }}</p>
	</div>
	<input type="text" placeholder="e" v-model="ae" />
	<input type="text" placeholder="n" v-model="an" />
	<button
		@click="
			attackToGetThePrivateKeyFromPublicKeys({
				n: Number(an),
				e: Number(ae),
			})
		"
	>
		attackToGetThePrivateKeyFromPublicKeys
	</button>
	<div>
		PrivateKeys -> p: {{ ap }} q: {{ aq }} phi: {{ aphi }} d: {{ ad }}
	</div>
	<div>
		<h1>Analysis</h1>
		<!--  -->
		<h4>attack with different key sizes</h4>
		<button @click="generateGraph">generate graph</button>
		<Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
	</div>
	<div>
		<h4>Calc time of encryption/decryption with different key sizes</h4>
		<button @click="generateGraphEncryption">
			generateGraphEncryption
		</button>
		<Bar id="my-chart-id" :options="chartOptions2" :data="chartData2" />
	</div>
</template>
<script>
import { Bar } from 'vue-chartjs';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from 'chart.js';

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale
);
export default {
	components: { Bar },
	data() {
		return {
			arrOfTimes: [],
			arrOfKeys: [],
			chartData1: {
				labels: this.arrOfKeys,
				datasets: [{ data: this.arrOfTimes }],
			},
			chartOptions1: {
				responsive: true,
			},
			arrOfTimes2: [],
			arrOfKeys2: [],
			chartData2: {
				labels: this.arrOfKeys2,
				datasets: [{ data: this.arrOfTimes2 }],
			},
			chartOptions2: {
				responsive: true,
			},
			cipherText: '',
			plainText: '',
			KeySizeInBits: '',
			message: '',
			attackD: 0,
			conversationData: [],
			p: 7457,
			q: 7459,
			e: 7,
			n: 55621763,
			d: 15887671,
			ap: '',
			aq: '',
			aphi: '',
			ad: '',
			an: '',
			ae: '',
		};
	},
	computed: {
		chartData() {
			return this.chartData1;
		},
		chartData20() {
			return this.chartData2;
		},
		chartOptions() {
			return this.chartOptions1;
		},
	},
	methods: {
		encodeMessage(message) {
			// 2^1
			let encodedMessage = 0;
			let c = 4;
			for (let i = 0; i < message.length; i++) {
				if (
					97 <= message[i].charCodeAt(0) &&
					message[i].charCodeAt(0) <= 122
				) {
					encodedMessage += 37 ** c * (message[i].charCodeAt(0) - 87);
					// console.log('3', c, message[i].charCodeAt(0) - 87);
				} else if (
					48 <= message[i].charCodeAt(0) &&
					message[i].charCodeAt(0) <= 57
				) {
					encodedMessage += 37 ** c * +message[i];
					// console.log('2', c, +message[i]);
				} else {
					// console.log('1', c, 36);
					encodedMessage += 37 ** c * 36;
				}
				c--;
			}
			console.log('encodedMessage', encodedMessage);
			return encodedMessage;
		},
		decodeMessage(encodedMessage) {
			// let i = 1;
			let plainTextArray = [];
			encodedMessage = Number(encodedMessage);
			while (encodedMessage != 0) {
				let r = encodedMessage % 37;
				console.log('r', r);
				plainTextArray.unshift(r);
				encodedMessage = Math.floor(encodedMessage / 37);
				// i++;
			}
			console.log(plainTextArray);

			plainTextArray = plainTextArray.map((data) => {
				if (10 <= data && data < 36) {
					return String.fromCharCode(data + 87);
				} else if (data == 36) {
					return ' ';
				} else {
					return String(data);
				}
			});
			console.log(plainTextArray);
			return plainTextArray.join('');
		},
		encryptMessage(message, e, n) {
			return this.powerAlgorithmMod(message, e, n);
		},
		decryptMessage(message, d, n) {
			console.log('decryptMessage', message, d, n);
			return this.powerAlgorithmMod(message, d, n);
		},
		powerAlgorithmMod(a, b, n) {
			// eslint-disable-next-line
			a = BigInt(a);
			// eslint-disable-next-line
			n = BigInt(n);
			let binaryB = b.toString(2);
			// eslint-disable-next-line
			let result = BigInt(1);
			for (let i = 0; i < binaryB.length; i++) {
				result = (result * result) % n;
				if (binaryB[i] == 1) {
					result = (result * a) % n;
				}
			}
			return Number(result);
		},
		gcd(a, b) {
			if (b == 0) return a;
			else return this.gcd(b, a % b);
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
		recieveMessage(message) {
			console.log('recieve message');
			// split the message on / to separate each group
			let groupsArray = message.split('|');
			console.log(groupsArray);
			// decrypt the message
			for (let i = 0; i < groupsArray.length; i++) {
				groupsArray[i] = this.decryptMessage(
					groupsArray[i],
					this.d,
					this.n
				);
			}
			console.log('hjh', groupsArray);
			// decode the message
			for (let i = 0; i < groupsArray.length; i++) {
				groupsArray[i] = this.decodeMessage(groupsArray[i]);
			}
			// join the groups
			let decodedMessage = groupsArray.join('');
			this.conversationData.push({
				me: false,
				body: decodedMessage,
			});
		},
		sendMessage() {
			console.log('sendmessage');
			// break the string into a groups of 5 characters
			let groupsArray = this.message.match(/.{1,5}/g);
			console.log('groupArray', groupsArray);
			if (groupsArray[groupsArray.length - 1].length < 5) {
				// add padding
				groupsArray[groupsArray.length - 1] += ' '.repeat(
					5 - groupsArray[groupsArray.length - 1].length
				);
			}
			for (let i = 0; i < groupsArray.length; i++) {
				// encode each group
				groupsArray[i] = this.encodeMessage(groupsArray[i]);
				// encrypt each group
				groupsArray[i] = this.encryptMessage(
					groupsArray[i],
					this.e,
					this.n
				);
			}
			// join the groups
			console.log('groupArray2', groupsArray);
			let encryptedMessage = groupsArray.join('|');
			console.log('encryptedMessage', encryptedMessage);
			this.$socket.emit('send-msg', {
				message: encryptedMessage,
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
		// attcak to know the public key and n using the plain text and cipher text
		attack(cipher, plain) {
			// try all the possible values of e , n and compare the cipher text with the given plain text
			for (let i = 2; i < 10; i++) {
				for (let j = 2; j < 55621763 * 2; j++) {
					if (this.gcd(i, j) == 1) {
						let cipherText = this.encryptMessage(plain, i, j);
						if (cipherText == cipher) {
							console.log('e', i);
							console.log('n', j);
							return;
						}
					}
				}
			}
		},
		getRanArr(lngth) {
			let arr = [];
			do {
				let ran = Math.floor(Math.random() * lngth);
				arr = arr.indexOf(ran) > -1 ? arr : arr.concat(ran);
			} while (arr.length < lngth);
			return arr;
		},
		attackToGetThePrivateKey(cipher, plain, keySizeInBits) {
			console.log('keySizeInBits', keySizeInBits);
			// let randArr = this.getRanArr(15887671 + 500);
			// console.log('randArr', randArr);
			// let randArr = [123456, 1234567, 12345678, 123456789, 15887671];
			let ArrayOfTimeTakenD = [];
			let startTimeAttack = Date.now();
			for (let j = 2000000; j < 15887671 + 500; j++) {
				let startTimeForDecryption = Date.now();
				let plaintText = this.decryptMessage(cipher, Number(j), this.n);
				let timeTakenForDecryption =
					Date.now() - startTimeForDecryption;
				ArrayOfTimeTakenD.push(timeTakenForDecryption);
				if (plaintText == plain) {
					let timeTakenForAttack = Date.now() - startTimeAttack;
					console.log('d', j);
					this.attackD = j;
					return {
						d: j,
						time: timeTakenForAttack,
						averageTimeForDecryption:
							ArrayOfTimeTakenD.reduce((a, b) => a + b, 0) /
							ArrayOfTimeTakenD.length,
					};
				}
			}
		},
		isPrimee(n) {
			for (let i = 2; i <= n / 2; i++) {
				if (n % i === 0) {
					return false;
				}
			}
			return true;
		},
		findPrimeFactors(num) {
			const res = num % 2 === 0 ? [2] : [];
			let start = 3;
			while (start <= num) {
				if (num % start === 0) {
					if (this.isPrimee(start)) {
						res.push(start);
					}
				}
				start++;
			}
			return res;
		},
		attackToGetThePrivateKeyFromPublicKeys(publicKey) {
			let primeFactors = [];
			primeFactors = this.findPrimeFactors(publicKey.n);
			let p = primeFactors[0];
			let q = primeFactors[1];
			let phi = (p - 1) * (q - 1);
			let d = this.inverseModulo(publicKey.e, phi);
			console.log(p, q, phi, d);
			this.ap = p;
			this.aq = q;
			this.aphi = phi;
			this.ad = d;
			return d;
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
			// this.p = p;
			// this.q = q;
			// this.e = e;
			// this.d = d;
			// this.n = p * q;
			// }
			let keys = {
				e,
				n: p * q,
				d,
			};
			return keys;
		},
		generateGraph() {
			// let arrOfKeys = [];
			// let arrOfTimes = [];
			let array = [];
			let array2 = [];
			console.log('gg');
			for (let i = 5; i < 20; i++) {
				let keys = this.generateKeys(i);
				array.push({
					keys,
					keySize: i,
				});
				this.arrOfKeys.push(i);
			}
			console.log('ff');

			for (let i = 0; i < array.length; i++) {
				let startTimeAttack = Date.now();
				let d = this.attackToGetThePrivateKeyFromPublicKeys({
					e: array[i].keys.e,
					n: array[i].keys.n,
				});

				let r = true;
				if (d != array[i].keys.d) {
					r = false;
					console.log(false);
				}
				array2.push({
					s: array[i].keySize,
					r,
					t: Date.now() - startTimeAttack,
				});
				this.arrOfTimes.push(Date.now() - startTimeAttack);
			}
			console.log(array2);
			this.chartData1 = {
				labels: this.arrOfKeys,
				datasets: [{ data: this.arrOfTimes }],
			};
			this.chartData;
		},
		generateGraphEncryption() {
			// let arrOfKeys = [];
			// let arrOfTimes = [];
			let array = [];
			let array2 = [];
			console.log('gg');
			for (let i = 5; i < 30; i++) {
				let keys = this.generateKeys(i);
				array.push({
					keys,
					keySize: i,
				});
				this.arrOfKeys2.push(i);
			}
			console.log('ff');
			for (let i = 0; i < array.length; i++) {
				let startTimeAttack = Date.now();
				this.encryptMessage(12345, array[i].keys.e, array[i].keys.n);
				array2.push({
					s: array[i].keySize,
					t: Date.now() - startTimeAttack,
				});
				this.arrOfTimes2.push(Date.now() - startTimeAttack);
			}
			console.log(array2);
			this.chartData2 = {
				labels: this.arrOfKeys2,
				datasets: [{ data: this.arrOfTimes2 }],
			};
			this.chartData20;
		},
	},
};
</script>
