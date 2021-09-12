import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import './MineSweeper.scss';

/*
    让所有的雷均匀的分布
    其核心思想是从1到n之间随机出一个数和最后一个数(n)交换，然后从1到n-1之间随机出一个数和倒数第二个数(n-1)交换
    假设我们有5个数0，1，2，3，4
    1.从[0,4]这5个位置中（包含0和4）随机出一个数（比如是3）和4号交换。0，1，2，4，3 第4号位置放3的概率就是1/5
    2.从[0,3]这4个位置中（包含0和3）随机出一个数（比如是0）和3号交换 4，1，2，0，3  第3号位置放0的概率就是(4/5)*(1/4)=1/5
    3.从[0,2]这3个位置中（包含0和2）随机出一个数（比如是4）和2号交换。2，1，4，0，3 第2号位置放4的概率就是(4/5)x(3/4)x(1/3)=1/5
    4.从[0,1]这2个位置中（包含0和1）随机出一个数（比如是2）和1号交换。1，2，4，0，3 第1号位置放2的概率就是(4/5)x(3/4)x(2/3)x(1/2)=1/5
    5.从[0,0]这1个位置中（包含0和0）随机出一个数（比如是1）和0号交换。1，2，4，0，3 第0号位置放1的概率就是(4/5)x(3/4)x(2/3)x(1/2)=1/5
*/
function shuffle(mines) {
    for (let i = mines.length - 1; i >= 0; i--) {
        //  Math.floor(Math.random() * 3)  => 0 1 2 
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const tmp = mines[randomIndex];
        mines[randomIndex] = mines[i];
        mines[i] = tmp;
    }
}

function calcNeighbourMineCount(width, height, mines) {
    //64个格子  雷 10个
    const result = new Array(mines.length).fill(0);
    for(let i = 0; i < result.length; i++) {
        if (!mines[i]) {
            continue;
        }

        const y = i % width; // 雷的y轴坐标
        const x = (i - y) / width; // 雷的x轴坐标
        /* 
            计算雷附近的数字
            一个雷为中心的九宫格都有数字
        */
        for (let j = -1; j < 2; j++) {
            const newX = x + j;
            if (newX < 0 || newX === height) {
                continue;
            }
            for (let k = -1; k < 2;k++) {
                const newY = y + k;
                if (newY < 0 || newY === width) {
                    continue;
                }
                result[newX * width + newY]++;
            }
        }
    }
    return result;
}

// 深度优先搜索
function floodfill(x, y, openStatus, width, height, neighbourMineCount) {
    if (x < 0 || y < 0 || x === height || y === width) {
        return;
    }

    const index = x * width + y;
    if (openStatus[index] === 1) {
        return;
    }

    openStatus[index] = 1;
    if (neighbourMineCount[index] > 0) {
        return;
    }

    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            floodfill(x + i, y + j, openStatus, width, height, neighbourMineCount);
        }
    }
}

class MineSweeper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEnd: false,
            mines: [],
            openStatus: [],
            markStatus: [],
            neighbourMineCount:[],
            selectedMineCount:0,
            result: ''
        }
    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.selectedMineCount !== prevState.selectedMineCount && this.state.selectedMineCount === 10){
            const match = this.state.mines.every((isMine, index) => {
                if ((isMine && this.state.markStatus[index] === 1) || (!isMine && this.state.markStatus[index] !== 1)) {
                    return true;
                }
                return false;
            });
            if (match) {
                this.setState({
                    isEnd:true,
                    result: 'win'
                },()=>{
                    alert('win');
                });

            }
        }
    }

    init = () => {
        const total = 64;
        // 64个 格子
        const mines = new Array(total).fill(0);
        // 10 雷
        for(let i = 0; i < 10;i++) {
            mines[i] = 1;
        }

        // 洗牌算法
        shuffle(mines);
        // 计算数字的
        const neighbourMineCount = calcNeighbourMineCount(8, 8, mines);
        this.setState({
            isEnd:false,
            mines,
            // 打开的格子
            openStatus:new Array(total).fill(0),
            // 标记的格子
            markStatus:new Array(total).fill(0),
            neighbourMineCount,
            selectedMineCount:0,
            result: ''
        })
    }

    handleClickLeft = (x, y) => {
        const { isEnd, openStatus, markStatus, mines, neighbourMineCount } = this.state;
        if (isEnd) {
            return;
        }

        const index = x * 8 + y;// 点击格子的索引
        //点过了
        if (openStatus[index] === 1 || markStatus[index] === 1) {
            return;
        }

        //是雷
        if (mines[index]) {
            const copyArray = openStatus.slice(0);
            copyArray[index] = 1;
            this.setState({
                isEnd: true,
                openStatus: copyArray,
                result: 'fail'
            }, () => {
                alert('fail');
            });

            return;
        }

        // 点到数字
        if (neighbourMineCount[index] > 0) {
            const copyArray = openStatus.slice(0);
            copyArray[index] = 1;
            this.setState({
                openStatus: copyArray,
            });
            return;
        }

        const copyArray = openStatus.slice(0);
        floodfill(x, y, copyArray, 8, 8, neighbourMineCount);
        this.setState({
            openStatus: copyArray
        })
    }

    handleClickRight = (x, y) => {
        const { isEnd, openStatus, markStatus } = this.state;
        if (isEnd) {
            return;
        }

        const index = x * 8 + y;
        if (openStatus[index] === 1) {
            return;
        }

        const copyMark = markStatus.slice(0);
        copyMark[index] = (copyMark[index] + 1) % 3; // 以0开始计数 标记有三个状态 0 标记为雷 问好 所以取余
        let selectedMineCount = this.state.selectedMineCount;
        if (copyMark[index] === 2) {
            selectedMineCount--;
        } else if (copyMark[index] === 1) {
            selectedMineCount++;
        }
        this.setState({
            markStatus: copyMark,
            selectedMineCount
        })

    }

    handleContextMenu = (event) => {
        event.preventDefault();
    }

    renderMines = () => {
        const mines = [];
        for(let i = 0;i < 8; i++) {
            const row = [];
            for(let j = 0;j < 8;j++) {
                const index = i * 8 + j;
                let icon = null;
                if (this.state.markStatus[index] === 1) {
                    icon = (
                        <FontAwesomeIcon 
                            icon={FaIcons['faFlag']}
                            style={{
                                margin: '0 8px',
                                width: '34px',
                                color: '#343434',
                            }}
                        />
                    )
                } else if (this.state.markStatus[index] === 2) {
                    icon = (
                        <FontAwesomeIcon 
                            icon={FaIcons['faQuestion']}
                            style={{
                                margin: '0 8px',
                                width: '34px',
                                color: '#343434',
                            }}
                        />
                    )
                } else if (this.state.openStatus[index] === 1) {
                    if(this.state.mines[index]){
                        icon = (
                            <FontAwesomeIcon 
                                icon={FaIcons['faBomb']}
                                style={{
                                    margin: '0 8px',
                                    width: '34px',
                                    color: '#343434',
                                }}
                            />
                        )
                    }else if(this.state.neighbourMineCount[index]>0){
                        icon = (
                            <span>
                                {this.state.neighbourMineCount[index]}    
                            </span>
                        );
                    }
                }

                row.push(
                    <div
                        className={`minesweeper-item ${this.state.openStatus[index] ? 'is-open' : ''}`}
                        key={j}
                        onClick={() => this.handleClickLeft(i, j)}
                        onContextMenu={() => this.handleClickRight(i, j)}
                    >
                        { icon }
                    </div>
                )
            }

            mines.push(
                <div className='minesweeper-row' key={i}>
                    { row }
                </div>
            )
        }

        return (
            <div
                className='minesweeper-container'
            >
                { mines }
            </div>
        )
    }

    reStart = () => {
        this.init();
    }

    render(){
        return (
            <div className="game">
                <div 
                    className='minesweeper'
                    onContextMenu={this.handleContextMenu}
                >
                    { this.renderMines() }
                    <div className="panel-container">
                    <div
                        className='minesweeper-data-container'
                    >
                        <FontAwesomeIcon 
                            icon={FaIcons['faFlag']}
                            style={{
                                margin: '0 8px',
                                width: '60px',
                                color: '#343434',
                            }}
                        />
                        <div>
                            {this.state.selectedMineCount} / 10
                        </div>
                    </div>
                    <div className='minesweeper-result'>
                        { this.state.result && 'result:' + this.state.result }
                    </div>
                    <div>
                        <button
                            className="mine-sweeper-button"
                            onClick={this.reStart}
                        >
                            重开一局
                        </button>

                    </div>
                    </div>
                    
                </div>
            </div>
                
        )
    }
}

export default MineSweeper;