import { Component } from 'react';
import { connect } from 'react-redux';
import './programslist.scss';

const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

class ProgramsList extends Component {

    render() {
        const { desktopApps } = this.props;
        return alphabet.map(letter => {
            const appWithLetter = desktopApps.filter((item) => {
                return item.type[0].toLowerCase() === letter.toLowerCase();
            })

            if (appWithLetter.length === 0) return '';

            return (
                <div key={letter}>
                    <div className="letter">
                        <div className="letter-width">
                            <span className="letter-width-text">{letter}</span>
                        </div>
                    </div>

                    { 
                        appWithLetter.map(item => (
                            <button
                                key={item.key}
                                type="button"
                                className="letter-button"
                            >
                                <div className="letter-button-txt">
                                    <img className="letter-button-img" src={item.img} alt={item.type} />
                                    <span className="letter-button-name">{item.type}</span>
                                </div>
                            </button>
                        ))
                    }
                </div>
            )
        })
    }
}

const initMapStateToProps = (state) => {
    return {
        desktopApps: state.getIn(['mainReducer', 'desktopApps']).toJS(),
    }
};

const initMapDispatchToProps = (dispatch) => ({
    
});

export default connect(initMapStateToProps, initMapDispatchToProps)(ProgramsList);