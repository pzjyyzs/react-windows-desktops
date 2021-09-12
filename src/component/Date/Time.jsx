import { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from '../../pages/Home/store';
import './time.scss';

class Time extends Component {

    componentDidMount() {
        this.getTime();
    }

    getTime = () => {
        const { dataTime, setDataTime } = this.props;
        const date = new Date();
        const year = date.getFullYear();
        const weekIndex = date.getDay();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        const week_arr = ['日','一','二','三','四','五','六'];
        if(month <= 9){
            month = '0'+ month;
          }
          if(day <= 9){
            day = '0' + day;
          }
          if(hour <= 9){
            hour = '0' + hour;
          }
          if(minute <= 9){
            minute = '0' + minute;
          }
          if(dataTime.minute !== minute || dataTime.hour !== hour || dataTime.day !== day){
            const week = week_arr[weekIndex]
            const time = {
              year,
              month,
              day,
              hour,
              minute,
              week
            }
            setDataTime(time);
          }
          setTimeout(this.getTime,1000);
    }

    handleShow = () => {
      const { set_sidepane, sidepane } = this.props;
      set_sidepane(!sidepane);
    }

    render() {
        const { year,month,day,hour,minute } = this.props.dataTime;
        return (
            <div 
              className='data_tinme' 
              onClick={this.handleShow}
            >
                <div>
                    {`${hour}:${minute} `}
                </div>
                <div>
                    {`${year}/${month}/${day}`}
                </div>
            </div>
        ) 
    }
}

const initMapStateToProps = (state) => {
  return {
      sidepane: state.getIn(['mainReducer','sidepane'])
  }
}


const initMapDispatchToProps = (dispatch) => ({
  set_sidepane(val) {
    dispatch(actionCreators.setSidepane(val))
  }
})

export default connect(initMapStateToProps, initMapDispatchToProps)(Time);