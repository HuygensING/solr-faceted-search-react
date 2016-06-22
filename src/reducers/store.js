import {createStore, applyMiddleware, combineReducers} from "redux";
import thunkMiddleware from "redux-thunk";

import reducers from "./index";

const logger = () => next => action => {
	if (action.hasOwnProperty("type")) {
		console.log("[REDUX]", action.type, action);
	}
	return next(action);
};

let data = combineReducers(reducers);

let store = createStore(data, applyMiddleware(logger, thunkMiddleware));

export default store;