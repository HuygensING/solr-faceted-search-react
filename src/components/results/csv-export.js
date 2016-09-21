import React from "react";
import cx from "classnames";

export default function (props) {
	const { bootstrapCss, onClick } = props;
	return (
		<button onClick={onClick} className={cx({btn: bootstrapCss, "btn-default": bootstrapCss, "pull-right": bootstrapCss, "btn-xs": bootstrapCss})}>
			Export excel
		</button>
	);
}
