import { Component } from 'react';
import { View } from 'react-desktop/windows';
import { connect } from 'react-redux';
import Time from '../../component/Date/Time';
import wifi from '../../public/img/app/wifi.png';
import battery from '../../public/img/app/battery.png';
import audio from '../../public/img/app/audio.png';
import sidepane from '../../public/img/app/sidepane.png';
import './menu.scss';
import { actionCreators } from '../Home/store';

class MenuWindow extends Component {

    handlWindow = (apps) => {
        const { openWindowList, handleWindow } = this.props;
        if (apps.isTop) {
            const isShow = !apps.isShow;
            handleWindow(apps, openWindowList, isShow);
        } else {
            handleWindow(apps, openWindowList, true);
        }
    }

    handleStart = () => {
        const { updatePopWindow, popWindow } = this.props;

        updatePopWindow({ ...popWindow, start: !popWindow.start })
    }

    render() {
        const { dataTime, setDataTime, openWindowList } = this.props;
        return (
            <View
                width="100%"
                height="40"
                className="start_menus"
            >
                <View
                    className="start_menus_logo"
                   onClick={this.handleStart}
                >
                    <i className="iconfont icon-do-windows"></i>
                </View>

                <View
                    width="calc(100% - 246px)"
                >
                    { 
                        openWindowList && openWindowList.map(item => {
                            return (
                                <View
                                    key={item.key}
                                    className={item.isTop?"start_menus_win active":"start_menus_win"}
                                >
                                    <View className="start_menus_win_box">
                                        <img src={item.img} alt={item.name} />
                                        <h3>{item.name}</h3>
                                    </View>
                                    <div className="start_menus_win_cover" onClick={this.handlWindow.bind(this, item)} />
                                </View>
                            )
                        })
                    }
                </View>

                <View
                    width={194}
                    style={{ position: 'absolute', right: 0}}
                >
                    <div className="start-icon">
                        <img src={wifi} alt="" style={{ width: '14px'}} />
                    </div>

                    <div className="start-icon">
                        <img src={battery} alt="" style={{ width: '14px'}} />
                    </div>

                    <div className="start-icon">
                        <img src={audio} alt="" style={{ width: '14px'}} />
                    </div>

                    <Time 
                        dataTime={dataTime} 
                        setDataTime={setDataTime} 
                    ></Time>

                    <div className="start-icon">
                        <img src={sidepane} alt="" style={{ width: '14px', filter: 'invert(1)' }} />
                    </div>
                </View>
            </View>
        )
    }
}

const initMapStateToProps = (state) => {
    return {
        popWindow: state.getIn(['mainReducer', 'popWindow']).toJS(),
    }
};

const initMapDispatchToProps = (dispatch) => ({
    updatePopWindow(val) {
        dispatch(actionCreators.updatePopWindow(val))
    }
});

export default connect(initMapStateToProps, initMapDispatchToProps)(MenuWindow)