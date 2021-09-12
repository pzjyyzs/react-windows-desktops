import defaultState from './state';
import * as constants from './constants';

let state =  (state = defaultState, action) => {
    switch (action.type) {
        case constants.SET_BACKGROUND : 
            return state.set('background', action.backgroundDesk);
        case constants.SET_DATATIME :
            return state.set('dataTime', action.dataTime);
        case constants.ADD_WINDOWLIST :
            return state.set('openWindowList', action.list);
        case constants.SET_SIDEPANE :
            return state.set('sidepane', action.sidepane);
        case constants.UPDATE_POPWINDOW:
            return state.set('popWindow', action.popWindow);
        default:
            return state; 
    }
}
export default state;