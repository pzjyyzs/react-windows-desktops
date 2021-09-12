import mainReducer from '../pages/Home/store/reducer';
import { combineReducers } from 'redux-immutable';

const reducer = combineReducers({
    mainReducer: mainReducer
})

export default reducer;