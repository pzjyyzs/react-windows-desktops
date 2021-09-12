import { fromJS } from 'immutable';
import * as constants from './constants';
import {actionCreators} from "./index";

export const setBackground = (type, value) => {
    const background = {
        type,
        value
    }
    return {
        type: constants.SET_BACKGROUND,
        backgroundDesk: fromJS(background)
    }
}

export const setDataTime = (dataTime) => {
    return {
        type: constants.SET_DATATIME,
        dataTime: fromJS(dataTime)
    }
}

export const addWindowList = (list) => {
    return {
        type: constants.ADD_WINDOWLIST,
        list: fromJS(list)
    }
}

export const setSidepane = (val) => {
    return {
        type: constants.SET_SIDEPANE,
        sidepane: val
    }
}

export const updatePopWindow = (val) => {
    return {
        type: constants.UPDATE_POPWINDOW,
        popWindow: fromJS(val)
    }   
}

export const openWindow = (apps, openList) => {
    return (dispatch) => {
        const openWindowIndex = openList.findIndex((item) => {
            return item.key === apps.key
        })
        let list = openList;
        if (openWindowIndex > -1) {
            const zIndexMax = Math.max.apply(Math, openList.map((o) => o.zIndex));
            if (!apps.hasOwnProperty('zIndex')) {
                apps = openList[openWindowIndex];
            }

            if (zIndexMax !== apps.zIndex) {
                openList.forEach((item, i) => {
                    item.isTop = false;
                    if(item.zIndex >= apps.zIndex){
                      list[i].zIndex = item.zIndex - 10;
                    }
                })
            }

            list[openWindowIndex].zIndex = zIndexMax;
            list[openWindowIndex].isTop = true;  //最顶层
            list[openWindowIndex].isShow = true;
            dispatch(actionCreators.addWindowList(list))
        } else {
            list.forEach((item) => {
                item.isTop = false
            })
            let windowObj = apps;
            windowObj.zIndex = (list.length+1) * 10;
            windowObj.isTop = true;
            list.push(windowObj);
            dispatch(actionCreators.addWindowList(list));
        }
    }
}

export const closeWindow = (apps, openList) => {
    return (dispatch) => {
        let list = openList.filter(item => item.key !== apps.key);
        dispatch(actionCreators.addWindowList(list));
    }
}

export const handleWindow = (apps, openList, isShow) => {
    return (dispatch) => {

        const zIndexMax = Math.max.apply(Math, openList.map((o) => {
            if (o.key === apps.key) {
                return isShow ? o.zIndex : 0
            } else {
                return o.isShow ? o.zIndex : 0;
            }
            
        }));
        openList.forEach(item => {
            item.isTop = false;
            if (item.key === apps.key) {
                item.isShow = isShow;
                item.isTop = isShow;
            }
            // 如果隐藏 那么最大的在最前
            if (!isShow) {
                item.isTop = zIndexMax === item.zIndex;
            }
        });
        dispatch(actionCreators.addWindowList(openList));
    }
}

export const updateApps = (apps, openList, updateParam) => {
    return (dispatch) => {
        let list = openList.map(item => {
            if (apps.key === item.key) {
               
               return  {
                    ...apps,
                    ...updateParam
                }
            }
            return item;
        })
        dispatch(actionCreators.addWindowList(list));
    }
}