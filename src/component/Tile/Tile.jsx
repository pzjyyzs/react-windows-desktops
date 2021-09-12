import { Component } from 'react';
import { connect } from 'react-redux';
import './tile.scss';

class Tile extends Component {

    render() {
        const { tileList } = this.props;
        return (
            <div className="tile-grid" >
                { 
                    tileList.map(item => {
                        return (
                            <button
                                key={item.key}
                                className='tile-grid-button'
                            >
                                <div className="tile-btn-content">
                                    <img src={item.img} alt={item.name} className='tile-btn-img' />
                                </div>
                                <span className="tile-btn-text">{item.name}</span>
                            </button>
                        )
                    })
                }
            </div>
        )
    }
}

const initMapStateToProps = (state) => {
    return {
        tileList: state.getIn(['mainReducer', 'tileList']).toJS(),
    }
};

const initMapDispatchToProps = (dispatch) => ({
    
});

export default connect(initMapStateToProps, initMapDispatchToProps)(Tile)