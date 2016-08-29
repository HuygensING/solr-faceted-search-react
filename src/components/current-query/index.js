import React from "react";
import cx from "classnames";


class CurrentQuery extends React.Component {


	removeListFacetValue(field, values, value) {
		const foundIdx = values.indexOf(value);
		if (foundIdx > -1) {
			this.props.onChange(field, values.filter((v, i) => i !== foundIdx));
		}
	}

	removeRangeFacetValue(field) {
		this.props.onChange(field, []);
	}

	removeTextValue(field) {
		this.props.onChange(field, "");
	}

	renderFieldValues(searchField) {
		const { bootstrapCss } = this.props;

		switch (searchField.type) {
			case "list-facet": return searchField.value.map((val, i) => (
					<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})} key={i}
						onClick={() => this.removeListFacetValue(searchField.field, searchField.value, val)}>
						{val}
						<a>{bootstrapCss ? <span className="glyphicon glyphicon-remove-sign"></span> : "❌"}</a>
					</span>
				));

			case "range-facet": return (
				<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}
					onClick={() => this.removeRangeFacetValue(searchField.field)}>
					{searchField.value[0]} - {searchField.value[1]}
					<a>{bootstrapCss ? <span className="glyphicon glyphicon-remove-sign"></span> : "❌"}</a>
				</span>
			);

			case "text": return (
				<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}
					onClick={() => this.removeTextValue(searchField.field)}>
					{searchField.value}
					<a>{bootstrapCss ? <span className="glyphicon glyphicon-remove-sign"></span> : "❌"}</a>
				</span>
			);
		}
		return null;
	}

	render() {
		const { bootstrapCss, query } = this.props;

		const splitFields = query.searchFields
			.filter((searchField) => searchField.value && searchField.value.length > 0)
			.map((searchField, i) => i % 2 === 0 ?
				{ type: "odds", searchField: searchField } : { type: "evens", searchField: searchField });

		const odds = splitFields.filter((sf) => sf.type === "evens").map((sf) => sf.searchField);
		const evens = splitFields.filter((sf) => sf.type === "odds").map((sf) => sf.searchField);

		if (odds.length === 0 && evens.length === 0) { return null; }

		return (
			<div className={cx("current-query", {"panel-body": bootstrapCss})}>
				<div className={cx({"row": bootstrapCss})}>
					<ul className={cx({"col-md-6": bootstrapCss})}>
						{evens.map((searchField, i) => (
							<li className={cx({"list-group-item": bootstrapCss})} key={i}>
								<label>{searchField.label}</label>
								{this.renderFieldValues(searchField)}
							</li>
						))}
					</ul>

					<ul className={cx({"col-md-6": bootstrapCss})}>
						{odds.map((searchField, i) => (
							<li className={cx({"list-group-item": bootstrapCss})} key={i}>
								<label>{searchField.label}</label>
								{this.renderFieldValues(searchField)}
							</li>
						))}

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