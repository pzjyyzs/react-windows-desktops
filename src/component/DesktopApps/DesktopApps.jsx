import React from 'react';
import { View } from 'react-desktop';

function getMaxDistance(arr) {
    const num = arr.sort((a, b) => a - b)
    return num[num.length - 1] - num[0]
}

function checkArrayWithPush(target, key, value)  {
    if (Array.isArray(target[key])) {
      target[key].push(value)
    } else {
      target[key] = [value]
    }
}

 function unique(array, compare = (a, b) => a === b) {
    const result = []
    for (let i = 0, len = array.length; i < len; i++) {
      const current = array[i]
      if (result.findIndex(v => compare(v, current)) === -1) {
        result.push(current)
      }
    }
    return result
}

class DesktopApps extends React.Component {

    $children = [];
    divref = null;
    constructor(props) {
        super(props);
        this.state = {
            indices: [],
            vLines: [],
            hLines: [],
        }
    }

    handleDoubleClick = (item) => {
		const { openWindow, openWindowList } = this.props;
		openWindow(item, openWindowList);
	}

    handleStartDrag = () => {
        this.$children = this.props.children.map((child, i) => {
            const target = this.divref.childNodes[i],
                       width = target.clientWidth,
                       height = target.clientHeight,
                       x =  target.offsetLeft,
                       y = target.offsetTop;
            return {
                target, // 元素
                i, // 序号
                x, // 元素坐标
                y, // 元素坐标
                width, // 宽
                height, // 高
                leftline: x, // 左对齐线
                rightline: x + width,// 右对齐线
                topline: y, // 上对齐线
                bottomline: y + height, // 下对齐线
                verticacenterline:  x + width / 2, // 水平对齐
                horizontalcenterline: y + height / 2, // 垂直对齐线
            }
        });
    }

    calc = (index) => {
        return (x, y) => {
            const child = this.$children[index];
            // 选择不是拖拽的所有元素
            const compares = this.$children.filter((_, i) => i !== index);

            if (compares.length === 0) {
                return { x, y };
            }

            return this.calcAndDrawLines({ x, y }, child, compares);
        }
    }

    calcAndDrawLines = (values, target, compares) => {
        //
        const { v: x, indices: indices_x, lines: vLines } = this.calcPosValues(values, target, compares, 'x');
        const { v: y, indices: indices_y, lines: hLines } = this.calcPosValues(values, target, compares, 'y');

        const indices = unique(indices_x.concat(indices_y))

        if (vLines.length && hLines.length) {
            vLines.forEach(line => {
              const compare = compares.find(({ i }) => i === line.i)
              const { length, origin } = this.calcLineValues({ x, y }, target, compare, 'x')
      
              line.length = length
              line.origin = origin
            })
      
      
            hLines.forEach(line => {
              const compare = compares.find(({ i }) => i === line.i)
              const { length, origin } = this.calcLineValues({ x, y }, target, compare, 'y')
      
              line.length = length
              line.origin = origin
            })
          }

        this.setState({
            vLines,
            hLines,
            indices,
        })

        return { x, y }
    }

    calcPosValues = (values, target, compares, key) => {
        const results = {};
        const directions = {
            x: ['ll', 'rr', 'lr'], // 左对齐，右对齐， 水平对齐
            y: ['tt', 'bb', 'tb'], // 上对齐线，下对齐线，垂直对齐线
        }

        // 取水平方向或者垂直方向的线
        const validDirections = directions[key].filter(dire => ['tt', 'bb', 'll', 'rr', 'tb', 'lr' ].includes(dire));

        compares.forEach(compare => {
            validDirections.forEach(dire => {
                const { near, dist, value, origin, length } = this.calcPosValuesSingle(values, dire, target, compare, key);
                if (near) {
                    checkArrayWithPush(results, dist, { i: compare.i, $: compare.target , value, origin, length, dire })
                }
            })
        })

        const resultArray = Object.entries(results);

        if (resultArray.length) {
            // 如果同一方向的三条线 出现误差 取最小的误差
            const [minDistance, activeCompares] = resultArray.sort(([dist1], [dist2]) =>{
                return Math.abs(dist1) - Math.abs(dist2)

            })[0]
            const dist = parseInt(minDistance)
            return {
                v: values[key] - dist,// 辅助线的坐标
                dist: dist,
                lines: activeCompares,
                indices: activeCompares.map(({ i }) => i),
            }
        }

        return {
            v: values[key],
            dist: 0,
            lines: [],
            indices: [],
        }
    }

    calcPosValuesSingle = (values, dire, target, compare, key) => {
        const { x, y } = values,
                W = target.width,
                H = target.height,
                { leftline, rightline, topline, bottomline, verticacenterline, horizontalcenterline } = compare,
                { origin, length }  = this.calcLineValues({ x, y }, target, compare, key);
        const result = {
                    // 距离是否达到吸附阈值
                    near: false,
                    // 距离差
                    dist: Number.MAX_SAFE_INTEGER,
                    // 辅助线坐标
                    value: 0,
                    // 辅助线长度
                    length,
                    // 辅助线起始坐标（对应绝对定位的top/left）
                    origin,
                }
        
                switch (dire) {
                    case 'lr':
                      result.dist = x + W / 2 - verticacenterline
                      result.value = verticacenterline
                      break
                    case 'll':
                      result.dist = x - leftline
                      result.value = leftline
                      break
                    case 'rr':
                      result.dist = x + W - rightline
                      result.value = rightline
                      break
                    case 'tt':
                      result.dist = y - topline
                      result.value = topline
                      break
                    case 'bb':
                      result.dist = y + H - bottomline
                      result.value = bottomline
                      break
                    case 'tb':
                      result.dist = y + H / 2 - horizontalcenterline
                      result.value = horizontalcenterline
                      break
                    default:
                        return;
                  }

                if (Math.abs(result.dist) < 5 + 1) {
                    result.near = true
                }
              
                return result
    }

    calcLineValues = (values, target, compare, key) => {
        const { x, y } = values,
              { height: H, width: W } = target,
              { leftline, rightline, topline, bottomline } = compare;
        const
              T = y, // 元素的上对齐线的y坐标
              B = y + H, // 下对齐线的y坐标
              L = x, // 左对齐线的x坐标
              R = x + W // 右对齐线的x坐标
        
        const direValues = {
                x: [topline, bottomline, T, B],
                y: [leftline, rightline, L, R],
            }
        
        const length = getMaxDistance(direValues[key]) // 计算拖拽元素和对比元素的辅助线差值
        const origin = Math.min(...direValues[key]) // 获得最小的值
        return { length, origin }
    }

    handleReset = () => {
        this.setState({
            vLines: [], 
            hLines: [], 
            indices: []
        })
    }

    _renderGuideLine = () => {
        const { vLines, hLines } = this.state;
        const commonStyle = {
            position: 'absolute',
            backgroundColor: '#FF00CC',
        }

        return (
            <React.Fragment>
                 {
                 vLines.map(({ length, value, origin }, i) => (
                    <span
                        className="v-line"
                        key={`v-${i}`}
                        style={{ left: value, top: origin, height: length, width: 1, ...commonStyle }}
                    />
                ))}
                {
                hLines.map(({ length, value, origin }, i) => (
                    <span
                        className="h-line"
                        key={`h-${i}`}
                        style={{ top: value, left: origin, width: length, height: 1, ...commonStyle }}
                    />
                ))}
            </React.Fragment>
        )
    }

    render() {
        const { children } = this.props;
        return (
            (
                <View 
                    width='100%'
                >
                    <View
                        className='desktop_apps'
                        layout='vertical'
                    >
                        <div ref={ref =>  this.divref = ref}>
                        {
                            children.map((child, index) => React.cloneElement(child, {
                                _start: this.handleStartDrag,
                                _drag: this.calc(index),
                                _end: this.handleReset,
                                handleDoubleClick: this.handleDoubleClick
                            }))
                        }
                        </div>
                        { this._renderGuideLine() }
                    </View>
                                    
                </View>
            )
        )
    }
}

/* const DesktopApps = ({ desktopApps, openWindow, openWindowList }) => {

    const handleDoubleClick = useCallback(
        (item) => {
            openWindow(item, openWindowList);
        },
        []
    )

    return (
        
    )
} */

/* class DesktopApps extends Component {

    constructor(props) {
        super(props);
        this.appRef = React.createRef();
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
    }

	handleDoubleClick = (item) => {
		const { openWindow, openWindowList } = this.props;
		openWindow(item, openWindowList);
	}

    handleDragStart = () => {
        return false;
    }

    handleDrag = (e) => {
        let x = e.clientX - getStyles(this.appRef.current, 'left'),
            y = e.clientY - getStyles(this.appRef.current, 'top');


        let mouseMove = (e) => {
            this.setState({
                x: e.clientX - x,
                y: e.clientY - y
            })
        }

        let mouseUp = (e) => {
            console.log(e)
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
        document.addEventListener('mousemove', mouseMove);

        document.addEventListener('mouseup',mouseUp);
    }

    render() {
        const { desktopApps } = this.props;
        const { position } = this.state;
        return (
            <View 
                width='100%'
                style={{ padding: '10px 0 0 10px'}}
            >
                <View
                    className='desktop_apps'
                    layout='vertical'
                >
                    {
                        desktopApps.map(item => {
                            return (
								<div
                                    key={item.key}
									className='desktop_app middle_logo'
									onDoubleClick={this.handleDoubleClick.bind(this, item)}
                                    onDragStart={this.handleDragStart}
                                    onMouseDown={this.handleDrag}
                                    ref={this.appRef}
                                    style={{
                                        top: position.y,
                                        left: position.x,
                                    }}
                                >
									<img src={item.img} alt={item.name} />
								    <h3>{item.name}</h3>
                                </div>
                            )
                        })
                    }
                </View>
								
            </View>
        )
    }
} */

export default DesktopApps;