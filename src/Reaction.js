import React from "react";
import "./Reaction.css";

function Reaction(props) {
	return (
		<div className="reaction">
			{props.react}
			<span className="reaction--sender">{props.reactSender}</span>
		</div>
	);
}

export default Reaction;
