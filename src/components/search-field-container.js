import React from "react";
import cx from "classnames";

class SearchFieldContainer extends React.Component {

	render() {
		const { bootstrapCss } = this.props;
		return (
			<div className={cx({"col-md-3": bootstrapCss})}>
				<div className={cx({"panel": bootstrapCss, "panel-default": bootstrapCss})}>
					<header className={cx({"panel-heading": bootstrapCss})}>
						<label>Search</label>
					</header>

					<ul className={cx("solr-search-fields", {"list-group": bootstrapCss})}>
						{this.props.children}
					</ul>
				</div>
			</div>
		);
	}
}

SearchFieldContainer.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	children: React.PropTypes.array
};

export default SearchFieldContainer;