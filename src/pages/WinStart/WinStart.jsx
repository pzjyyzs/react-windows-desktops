import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import ProgramsList from '../../component/ProgramsList/ProgramsList';
import './winstart.scss';
import Tile from '../../component/Tile/Tile';

class WinStart extends Component {
    render() {
        const { popWindow } = this.props;
        return (
            <div className="start" data-hide={popWindow.start}>
                <div className="start-panel">
                    <div className="start-panel-icon">
                        <div
                            style={{
                               padding: '12px'
                            }}
                        >
                            <FontAwesomeIcon 
                                icon={FaIcons['faAlignJustify']}
                                style={{
                                    margin: '0 8px',
                                    width: '14px',
                                    color: '#fff',
                                }}
                            />
                        </div>
                        <div className="start-panel-icon-bottom">
                            <div>
                                <FontAwesomeIcon 
                                icon={FaIcons['faFile']}
                                style={{
                                    margin: '0 8px',
                                    width: '14px',
                                    color: '#fff',
                                }}
                                />
                            </div>
                            
                            <div>
                                <FontAwesomeIcon 
                                    icon={FaIcons['faImage']}
                                    style={{
                                        margin: '0 8px',
                                        width: '14px',
                                        color: '#fff',
                                    }}
                                />
                            </div>
                            
                            <div>
                                <FontAwesomeIcon 
                                    icon={FaIcons['faCog']}
                                    style={{
                                        margin: '0 8px',
                                        width: '14px',
                                        color: '#fff',
                                    }}
                                />
                            </div>

                            <div>
                                <FontAwesomeIcon 
                                    icon={FaIcons['faPowerOff']}
                                    style={{
                                        margin: '0 8px',
                                        width: '14px',
                                        color: '#fff',
                                    }}
                                />
                            </div>
                            
                        </div>
                    </div>
                    <div className="start-panel-list">
                        <ProgramsList />
                    </div>
                    <div className="start-panel-table">
                        <span className="text-xs">My Tiles</span>
                        <Tile />
                    </div>
                </div>
            </div>
        )
    }
} 

const initMapStateToProps = (state) => {
    return {
        popWindow: state.getIn(['mainReducer', 'popWindow']).toJS()
    }
};

const initMapDispatchToProps = (dispatch) => ({
    
});

export default connect(initMapStateToProps, initMapDispatchToProps)(WinStart);