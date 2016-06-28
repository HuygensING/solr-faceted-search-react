import React from "react";
import cx from "classnames";

const labelStyle = {

};


class CurrentQuery extends React.Component {

	render() {
		const { bootstrapCss } = this.props;
		return (
			<div className={cx("current-query", {"panel-body": bootstrapCss})}>
				<div className={cx({"row": bootstrapCss})}>
					<ul className={cx({"col-md-6": bootstrapCss})}>
						<li className={cx({"list-group-item": bootstrapCss})}>
							<label style={labelStyle}>Characteristics</label>
							<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}>
								asd
								&nbsp;
								<a>
									❌
								</a>
							</span>
						</li>
						<li className={cx({"list-group-item": bootstrapCss})}>
							<label style={labelStyle}>All text fields</label>
							<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}>asd</span>
							<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}>asdasd</span>
						</li>
					</ul>
					<ul className={cx({"col-md-6": bootstrapCss})}>
						<li className={cx({"list-group-item": bootstrapCss})}>
							<label style={labelStyle}>Date of birth as dasdasdsas</label>
							<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}>asd</span>
						</li>
						<li className={cx({"list-group-item": bootstrapCss})}>
							<label style={labelStyle}>test</label>
							<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}>asd</span>
							<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}>asdasd</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

CurrentQuery.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	onChange: React.PropTypes.func,
	query: React.PropTypes.object
};

export default CurrentQuery;