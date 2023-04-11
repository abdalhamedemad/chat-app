<template>
	<div class="conservation-container">
		<header style="color: aliceblue" class="conservation-header">
			id->{{ this.$route.params.id }}
			<div>
				<label style="color: aliceblue" for="">p</label>
				<input
					style="width: 50px"
					type="text"
					placeholder="p"
					v-model="p"
				/>
				<label style="color: aliceblue" for="">q</label>
				<input
					style="width: 50px"
					type="text"
					placeholder="q"
					v-model="q"
				/>
				<label style="color: aliceblue" for="">e</label>
				<input
					style="width: 50px"
					type="text"
					placeholder="e"
					v-model="e"
				/>
				<button @click="validKeys">validKeys</button>
				<label style="color: aliceblue" for=""
					>{{
						validKeysFlag ? 'valid' : `invalid+${errorMessage}`
					}}
					p,q,e</label
				>
				<label style="color: aliceblue" for=""
					>Your private key ->{{ d }}
				</label>
			</div>
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
			p: 20011,
			q: 20029,
			e: 7,
			phi: 400760280,
			n: 400800319,
			d: 286257343,
			validKeysFlag: true,
			errorMessage: '',
		};
		// n must be greater that 67364234
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
		isPrime(n) {
			if (n <= 1) return false;
			if (n <= 3) return true;
			if (n % 2 == 0 || n % 3 == 0) return false;
			for (let i = 5; i * i <= n; i = i + 6)
				if (n % i == 0 || n % (i + 2) == 0) return false;
			return true;
		},
		validKeys() {
			// check if p,q are prime
			if (this.p == '' || (this.q == '' && this.e == '')) {
				this.validKeysFlag = false;
				this.errorMessage = 'p,q,e must be filled';
				return;
			}
			this.pi = (this.p - 1) * (this.q - 1);
			this.n = this.p * this.q;
			if (this.n <= 67364234) {
				this.validKeysFlag = false;
				this.errorMessage = 'n must be greater that 67364234';
				return false;
			}
			if (!(this.isPrime(this.p) && this.isPrime(this.q))) {
				this.errorMessage = 'p,q must be prime';
				this.validKeysFlag = false;

				return;
			}
			// check if e is coprime with phi
			if (this.gcd(this.e, this.phi) != 1) {
				this.errorMessage = 'e must be coprime with phi';
				return;
			}
			// check if e is less than phi
			if (this.e > this.phi) {
				this.errorMessage = 'e must be less than phi';
				return;
			}
			// check if e is less than n
			this.d = this.inverseModulo(this.e, this.phi);
			this.validKeysFlag = true;

			return true;
		},
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
		recieveMessage(message) {
			// this.e = Number(message.e);
			// this.n = Number(message.n);
			message = message.message;
			console.log('recieve message');
			// split the message on / to separate each group
			let groupsArray = message.split('|');
			console.log(groupsArray);
			// decrypt the message
			for (let i = 0; i < groupsArray.length; i++) {
				groupsArray[i] = this.decryptMessage(
					groupsArray[i],
					Number(localStorage.getItem('PR')),
					Number(localStorage.getItem('n'))
				);
			}
			console.log('decrypted', groupsArray);
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
			console.log(this.$route.params.id);
			let ll = this.$route.params.id.split('|');
			console.log(ll);
			let toId = this.$route.params.id.split('|')[0];
			let e = Number(this.$route.params.id.split('|')[1]);
			let n = Number(this.$route.params.id.split('|')[2]);
			console.log('to Keys', e, n);
			// console.log('groupArray', groupsArray);
			if (groupsArray[groupsArray.length - 1].length < 5) {
				// add padding
				groupsArray[groupsArray.length - 1] += ' '.repeat(
					5 - groupsArray[groupsArray.length - 1].length
				);
			}
			console.log('sendMessage groupArray', groupsArray);
			for (let i = 0; i < groupsArray.length; i++) {
				// encode each group
				groupsArray[i] = this.encodeMessage(groupsArray[i]);
				// encrypt each group
				groupsArray[i] = this.encryptMessage(groupsArray[i], e, n);
			}
			// join the groups
			console.log('groupArray2', groupsArray);
			let encryptedMessage = groupsArray.join('|');
			console.log('encryptedMessage', encryptedMessage);
			this.$socket.emit('send-msg', {
				message: encryptedMessage,
				to: this.$route.params.id.split('|')[0],
				from: localStorage.getItem('userId'),
				e: e,
				n: n,
			});
			console.log('send message');
			this.conversationData.push({
				me: true,
				body: this.message,
			});
			this.$store.dispatch('sendMessage', {
				message: this.message,
				toId: toId,
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
			let randArr = this.getRanArr(2 ** keySizeInBits);
			let ArrayOfTimeTakenD = [];
			let startTimeAttack = Date.now();
			for (let j = 0; j < randArr.length; j++) {
				let startTimeForDecryption = Date.now();
				let plaintText = this.decryptMessage(
					cipher,
					randArr[j],
					this.n
				);
				let timeTakenForDecryption =
					Date.now() - startTimeForDecryption;
				ArrayOfTimeTakenD.push(timeTakenForDecryption);
				if (plaintText == plain) {
					let timeTakenForAttack = Date.now() - startTimeAttack;
					console.log('d', randArr[j]);
					return {
						d: randArr[j],
						time: timeTakenForAttack,
						averageTimeForDecryption:
							ArrayOfTimeTakenD.reduce((a, b) => a + b, 0) /
							ArrayOfTimeTakenD.length,
					};
				}
			}
		},
	},
	async beforeMount() {
		const conversationData = await this.$store.dispatch(
			'getConversationData',
			{
				toId: this.$route.params.id.split('|')[0],
			}
		);
		this.conversationData = conversationData.conversationData;
		console.log('conversationData', this.conversationData);
		// console.log(this.$route.params.id);
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
	height: 61px;
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
	height: 80%;
	overflow: auto;
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
