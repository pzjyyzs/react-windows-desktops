import { Component } from 'react';
import { add, multiply,subtract, divide, mod } from 'mathjs';
import CalculatorButton from '../../component/CalculatorButton/CalculatorButton';
import './calculator.scss';

class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showValue: 0,
            historyValue: '',
            isOperation: false,
            firstNumber: 0,
            operation: '',
        }
    }

    handleChangeNumber = (event) => {
        event.stopPropagation();

        let { showValue, isOperation, firstNumber } = this.state;
        let number = event.target.innerHTML;


        if (!firstNumber && showValue === 0) {
            this.setState({
                showValue: number
            })
        } else {
            if (isOperation) {

                this.setState({
                    showValue: number,
                    isOperation: false
                })

            } else {
                let data = String(showValue).replace(/,/g, '');
                let end = '';
                if (number === '.') {
                    end = `${data}${number}`;
                } else {
                    end = this.formatText(`${data}${number}`);
                }
                let val = end.length > 10 ? showValue : end;
                this.setState({  
                    showValue: val
                });
            }
        }
           
    }

    formatText = (data) => {
        let formatter = new Intl.NumberFormat();
        return formatter.format(data);
    }

    operation = (event) => {
        event.stopPropagation();
        const nowOperation = event.target.innerHTML;
        let { showValue, operation, firstNumber } = this.state;
        if (operation && firstNumber) {
            let firstOperationVal = this.sendOperation(operation, firstNumber, showValue);
            let historyValue = `${String(firstOperationVal).replace(/,/g, '')} ${nowOperation} `;
            this.setState({
                historyValue,
                isOperation: true,
                operation: nowOperation,
                firstNumber: firstOperationVal,
            })
        } else {
            let historyValue = `${String(showValue).replace(/,/g, '')} ${nowOperation} `;
            this.setState({
                historyValue,
                isOperation: true,
                operation: nowOperation,
                firstNumber: showValue,
            })
        }
        
    }

    result = (event) => {
        event.stopPropagation();
        const { firstNumber, showValue, operation } = this.state;
        let val = this.sendOperation(operation, firstNumber, showValue);
        let historyValue = `${firstNumber} ${operation} ${showValue.replace(/,/g, '')} `;
        this.setState({
            showValue: this.formatText(val),
            historyValue,
            firstNumber: 0
        })
    }

    sendOperation = (operation, first, second) => {
        switch(operation) {
            case '*': 
                return multiply(first, second);
            case '+':
                return add(first, second);
            case '-':
                return subtract(first, second);
            case '/':
                return divide(first, second);
            case '%':
                return mod(first, second);
            default: 
                console.log('error');
                return;
        }
    }

    handleClear = (type) => {
        if (type === 'CE') {
            this.setState({
                showValue: 0,
            })
        } else if (type === 'C'){
            this.setState({
                showValue: 0,
                historyValue: '',
                isOperation: false,
                firstNumber: 0,
                operation: ''
            })
        } else {
            let { showValue } = this.state;
            if (showValue === 0) {
                return;
            }
            let replaceVal = showValue.replace(/,/g, '');
            let val = replaceVal.substr(0, replaceVal.length - 1);
            if (val === ''){
                val = 0
            }
            this.setState({
                showValue: val
            })
        }
    }

    handleChangeSgn = (e) => {
        e.stopPropagation();
        const { showValue } = this.state;
        
        this.setState({
            showValue: this.sendOperation('-', 0, showValue),
        })
        
    }

    render() {
        const { showValue, historyValue } = this.state;
        return (
            <div className='calculator'>
                <div className="calculator-menu">

                </div>
                <div className='calculator-history'>
                    <div className='calculator-history-display'>
                        { historyValue }
                    </div>
                </div>
                <div className='calculator-display'>{ showValue }</div>
                <div className='calculator-button-area'>
                    {/* <div className="calculator-row">
                        <CalculatorButton className='calculator-memory-button'></CalculatorButton>
                    </div> */}
                    <div className="calculator-row">
                        {/* 
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.operation}
                        >%</CalculatorButton>
                         <CalculatorButton className='calculator-button'>1/x</CalculatorButton>
                        <CalculatorButton className='calculator-button'>x²</CalculatorButton>
                        <CalculatorButton className='calculator-button'>√2</CalculatorButton>
                         */}
                       
                    </div>
                    <div className="calculator-row">
                       
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.handleClear.bind(this, 'CE')}
                        >CE</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.handleClear.bind(this, 'C')}
                        >C</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.handleClear.bind(this, 'del')}
                        >del</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.operation}
                        >/</CalculatorButton>
                    </div>
                    <div className="calculator-row">
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >7</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >8</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >9</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.operation}
                        >*</CalculatorButton>
                    </div>
                    <div className="calculator-row">
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >4</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >5</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >6</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.operation}
                        >-</CalculatorButton>
                    </div>
                    <div className="calculator-row">
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >1</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >2</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >3</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.operation}
                        >+</CalculatorButton>
                    </div>
                    <div className="calculator-row">
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.handleChangeSgn}
                        >+/-</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button calculator-button-number'
                            onClick={this.handleChangeNumber}
                        >0</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.handleChangeNumber}
                        >.</CalculatorButton>
                        <CalculatorButton 
                            className='calculator-button'
                            onClick={this.result}
                        >=</CalculatorButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default Calculator;