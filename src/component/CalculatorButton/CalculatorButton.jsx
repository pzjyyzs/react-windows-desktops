import { Component } from 'react';

class CalculatorButton extends Component {
    render() {
        const { dataAttributes, onClick, className } = this.props;

        return (
            <div 
                onClick={onClick}
                className={className}
                { ...dataAttributes }
            >
                { this.props.children }
            </div>
        )
    }
}

export default CalculatorButton;