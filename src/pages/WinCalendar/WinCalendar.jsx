import { Component } from 'react';
import { connect } from 'react-redux';
import './WinCalendar.scss';

class WinCalendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        const { loaded } = this.state;
        if (!loaded) {
            window.dycalendar.draw({
                target: '#dycalendar',
                type: 'month',
                dayformat: 'ddd',
                monthformat: "full",
                prevnextbutton: 'show',
                highlighttoday: true
            });
            this.setState({
                loaded: true
            })
        }
    }

    render(){
        const { sidepane } = this.props;
        return (
            <div className='calnpane' data-hide={sidepane}>
                <div id="dycalendar"></div>
            </div>
        )
    }
}

const initMapStateToProps = (state) => {
    return {
        sidepane: state.getIn(['mainReducer','sidepane'])
    }
}


export default connect(initMapStateToProps)(WinCalendar);