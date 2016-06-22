import xhr from "xhr";

export default {
	performXhr: function (options, accept, reject = () => { console.warn("Undefined reject callback! "); (console.trace || () => {})(); }) {
		xhr(options, accept, reject);
	}
};
