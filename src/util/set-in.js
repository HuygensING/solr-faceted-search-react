import clone from "./clone-deep";

// Do either of these:
//  a) Set a value by reference if deref is not null
//  b) Set a value directly in to data object if deref is null
const setEither = (data, deref, key, val) => {
	(deref || data)[key] = val;
	return data;
};

// Set a nested value in data (not unlike immutablejs, but a clone of data is expected for proper immutability)
const _setIn = (path, value, data, deref = null) =>
	path.length > 1 ?
		_setIn(path, value, data, deref ? deref[path.shift()] : data[path.shift()]) :
		setEither(data, deref, path[0], value);

const setIn = (path, value, data) =>
	_setIn(clone(path), value, clone(data));

export default setIn;