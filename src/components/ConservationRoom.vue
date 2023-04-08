<template>
	<div class="conservation-container">
		<header class="conservation-header"></header>
		<div class="body">
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="receiver-message"><p>22222</p></div>
			<div class="sender-message"><p>1111</p></div>

			<div class="receiver-message"><p>22222</p></div>
		</div>
		<footer class="conservation-footer">
			<div class="emoji">@</div>
			<div class="chat-input-message">
				<input type="text" placeholder="write a message" />
			</div>
			<button class="send-message">-></button>
		</footer>
	</div>
</template>

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
	height: 50px;
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
