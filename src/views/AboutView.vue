<template>
	<div class="about">
		<h1>This is an about page</h1>
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
</template>
<script>
export default {
	data() {
		return {
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
		};
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
			// console.log('decryptMessage', message, d, n);
			return this.powerAlgorithmMod(Number(message), d, n);
		},
		powerAlgorithmMod(a, b, n) {
			let binaryB = b.toString(2);
			let result = 1;
			for (let i = 0; i < binaryB.length; i++) {
				result = (result * result) % n;
				if (binaryB[i] == 1) {
					result = (result * a) % n;
				}
			}
			return result;
		},
		gcd(a, b) {
			if (b == 0) return a;
			else return this.gcd(a, a % b);
		},
		inverseModulo(a, m) {
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
	},
};
</script>
