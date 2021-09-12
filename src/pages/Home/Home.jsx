import React, { Component } from 'react';
import { View } from 'react-desktop';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import MenuWindow from '../MenuWindow/MenuWindow';
import DesktopApps from '../../component/DesktopApps/DesktopApps';
import WindowsWindow from '../../component/WindowsWindow/WindowsWindow';
import Calculator from '../Calculator/Calculator';
import Chrome from '../Chrome/Chrome';
import WinCalendar from '../WinCalendar/WinCalendar';
import WinStart from '../WinStart/WinStart';
import MineSweeper from './../MineSweeper/MineSweeper';
import Drawboard from './../Drawboard/Drawboard';
import DragIcon from '../../component/DragIcon/DragIcon';


class Home extends Component {

    changePosition = (index) => {
        const desktopWidth = document.body.clientWidth;
        const desktopHeight = document.body.clientHeight - 40;

        let x =  Math.round(desktopWidth / 2 - 300) + index * 20;
        let y = Math.round(desktopHeight / 2 - 200) + index * 20;
        if (x > desktopWidth) {
            x = Math.round(desktopWidth / 2 - 300) - index * 20;
        }

        if ( y > desktopHeight) {
            y = Math.round(desktopHeight / 2 - 200) - index * 20;
        }

        return {
            x,
            y,
            originalWidth: 0,
            originalHeight: 0
        }
    }

    windowType = (item) => {
        switch (item.type) {
            case 'calculator':
                return <Calculator></Calculator>;
            case 'chrome':
                return <Chrome></Chrome>
            case 'MineSweeper':
                return <MineSweeper></MineSweeper>
            case 'Drawboard':
                return <Drawboard></Drawboard>
            default: 
                return <View>test</View>
        }
    }

    render() {
        const { background, dataTime, setDataTime, desktopApps, openWindowList, openWindow,
            closeWindow, handleWindow, updateApps  } = this.props;
        return (
            <View
                width="100%"
                height="100%"
                layout="vertical"
                background={background.type === 'image'?`url("${background.value}") no-repeat center center / cover`:background.value}
                style={{backgroundSize:'cover',overflow:'hidden'}}
            >
                <View
			        width="100%"
				    height="100%"
				    layout="vertical"
				    className="desktop"  
			    >
                    <View
                        height='100%'
                    >
                        <DesktopApps 
                            desktopApps={desktopApps}
                            openWindow={openWindow}
                            openWindowList={openWindowList}
                        >
                            {
                                desktopApps.map(item => {
                                
                                    return (
                                        <DragIcon 
                                            item={item} 
                                            key={item.key} 
                                        ></DragIcon>
                                    )
                                })
                            }
                        </DesktopApps>
                    </View>
                </View>

				<MenuWindow
					dataTime={dataTime}
					setDataTime={setDataTime}
                    openWindowList={openWindowList}
                    handleWindow={handleWindow}
                    openWindow={openWindow}
				>

                </MenuWindow>

                { 
                    openWindowList && openWindowList.map((item, i) => {
                        if (!item.position) {
                            item.position = this.changePosition(i);
                        }

                        return item.isShow && (
                            <WindowsWindow
                                apps={item}
                                key={item.key}
                                openWindowList={openWindowList}
                                openWindow={openWindow}
                                closeWindow={closeWindow}
                                handleWindow={handleWindow}
                                bottomRef={this.menuWindowRef}
                                updateApps={updateApps}
                            >
                               { this.windowType(item) }
                            </WindowsWindow>
                        )
                    })
                }

                <>
                    <WinCalendar />
                    <WinStart />
                </>
            </View>
        )
    }
}

const initMapStateToProps = (state) => {
    return {
        background: state.getIn(['mainReducer','background']).toJS(),
		dataTime: state.getIn(['mainReducer', 'dataTime']).toJS(),
        desktopApps: state.getIn(['mainReducer', 'desktopApps']).toJS(),
        openWindowList: state.getIn(['mainReducer', 'openWindowList']).toJS()
    }
};

const initMapDispatchToProps = (dispatch) => ({
    set_background(type, value) {
        dispatch(actionCreators.setBackground(type, value));
    },
	setDataTime(datatime) {
		dispatch(actionCreators.setDataTime(datatime));
	},
    openWindow(apps, openList) {
        dispatch(actionCreators.openWindow(apps, openList));
    },
    closeWindow(apps, openList) {
        dispatch(actionCreators.closeWindow(apps, openList));
    },
    handleWindow(apps, openList, isShow) {
        dispatch(actionCreators.handleWindow(apps, openList, isShow));
    },
    updateApps(apps, openList, params) {
        dispatch(actionCreators.updateApps(apps, openList, params));
    }
});

export default connect(initMapStateToProps, initMapDispatchToProps)(Home);