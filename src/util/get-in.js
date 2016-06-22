import clone from "./clone-deep";

const _getIn = (path, data) =>
	data ?
		path.length === 0 ? data : _getIn(path, data[path.shift()]) :
		null;



const getIn = (path, data) =>
	_getIn(clone(path), data);


export default getIn;