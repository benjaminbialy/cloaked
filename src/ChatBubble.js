import React, { useState } from "react";
import { getDatabase, ref, update } from "firebase/database";
import "./ChatBubble.css";

function ChatBubble(props) {
	const [messageClick, setMessageClick] = useState(false);
	const [reactClick, setReactClick] = useState(false);

	var time = new Date(props.time);

	function padTo2Digits(num) {
		return num.toString().padStart(2, "0");
	}

	function formatDate(date) {
		let daily = "";
		let minutes = padTo2Digits(date.getMinutes());
		let hours = date.getHours();
		let day = "";
		let month = "";
		let year = "";

		if (hours > 12) {
			daily = hours - 12 + ":" + minutes + " pm";
		} else if (hours < 12) {
			daily = hours + ":" + minutes + " am";
		} else {
			daily = hours + ":" + minutes + " pm";
		}

		day = padTo2Digits(date.getDate());
		month = padTo2Digits(date.getMonth() + 1);
		year = date.getFullYear();

		return daily + " " + day + "-" + month + "-" + year;
	}

	const db = getDatabase();
	const messageRef = ref(
		db,
		"chatrooms/" + props.room + "/messages/" + props.id
	);

	const sendReact = (reaction) => {
		// all reacts for a message
		let sendReactArray = [];

		if (props.reacts !== undefined) {
			// add all the existing objects into sendReactArray
			for (let i = 0; i < props.reacts.length; i++) {
				sendReactArray.push(props.reacts[i]);
			}
		}
		// new reaction
		let newReact = {};

		newReact = {
			reactSender: props.thisUserName,
			react: reaction,
		};

		sendReactArray.push(newReact);

		update(messageRef, { reactions: sendReactArray });

		setReactClick(!reactClick);
		setMessageClick(!messageClick);
		console.log(reaction);
	};

	const messageClicked = () => {
		setReactClick(!reactClick);
		setMessageClick(!messageClick);
	};

	return (
		<div
			className="chat__bubble--container"
			style={{
				alignSelf: props.senderUid === props.uid ? "flex-end" : "flex-start",
			}}
		>
			<div
				className="chat__bubble"
				style={{
					flexDirection: props.senderUid === props.uid ? "row" : "row-reverse",
				}}
			>
				<div
					className="chat__bubble--options"
					style={{
						visibility: messageClick === true ? "visible" : "hidden",
						flexDirection:
							props.senderUid === props.uid ? "row" : "row-reverse",
					}}
				>
					<button>reply</button>
				</div>
				<div
					className="chat__bubble--text"
					style={{
						backgroundColor:
							props.senderUid === props.uid ? "white" : "#EDEFF1",
						marginLeft: props.userName === "Admin" ? "15px" : "0",
					}}
					onClick={(e) => {
						messageClicked();
					}}
				>
					<div className="chat__bubble--text--send__info">
						<div>{props.senderUid === props.uid ? "You" : props.userName}</div>
						{props.userName != "Admin" && (
							<div className="chat__bubble--text--send__info--timestamp">
								{formatDate(time)}
							</div>
						)}
					</div>
					<div>{props.message}</div>
				</div>
				{props.userName != "Admin" && (
					<img
						className="chat__bubble--profile__pic"
						src={props.profilePic}
						alt="profile pic"
					/>
				)}
			</div>

			{reactClick == true ? (
				<div className="chat__bubble--container--reacts">
					<div className="chat__bubble__container--reacts--container">
						<span
							onClick={(e) => {
								sendReact("😂");
							}}
							className="emoji"
							role="img"
							aria-label="laugh"
						>
							😂
						</span>
						<span
							onClick={(e) => {
								sendReact("😑");
							}}
							className="emoji"
							role="img"
							aria-label="mid"
						>
							😑
						</span>
						<span
							onClick={(e) => {
								sendReact("😍");
							}}
							className="emoji"
							role="img"
							aria-label="love"
						>
							😍
						</span>
						<span
							onClick={(e) => {
								sendReact("😘");
							}}
							className="emoji"
							role="img"
							aria-label="kiss"
						>
							😘
						</span>
						<span
							onClick={(e) => {
								sendReact("😡");
							}}
							className="emoji"
							role="img"
							aria-label="angry"
						>
							😡
						</span>
						<span
							onClick={(e) => {
								sendReact("😢");
							}}
							className="emoji"
							role="img"
							aria-label="sad"
						>
							😢
						</span>
						<span
							onClick={(e) => {
								sendReact("🤑");
							}}
							className="emoji"
							role="img"
							aria-label="money"
						>
							🤑
						</span>
						<span
							onClick={(e) => {
								sendReact("😬");
							}}
							className="emoji"
							role="img"
							aria-label="awkward"
						>
							😬
						</span>
						<span
							onClick={(e) => {
								sendReact("😵‍💫");
							}}
							className="emoji"
							role="img"
							aria-label="stunned"
						>
							😵‍💫
						</span>
					</div>
				</div>
			) : props.reacts !== undefined ? (
				<div className="chat__bubble--container--reacts">
					<div className="chat__bubble__container--reacts--container">
						<div class="tooltip">
							😑
							<span class="tooltiptext">Benjamin Bialy</span>
						</div>
						<div class="tooltip">
							😑
							<span class="tooltiptext">Benjamin Bialy</span>
						</div>
					</div>
				</div>
			) : (
				<div className="nothing"></div>
			)}
		</div>
	);
}

export default ChatBubble;
