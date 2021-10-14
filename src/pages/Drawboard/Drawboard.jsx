import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import './Drawboard.scss';

const Canvas = (props) => {
    const toolsMap = ["canvas_paint", "canvas_eraser"];
    const colorMap = ['black', 'red', 'green', 'blue'];
    const optionsMap = ['canvas_save', 'canvas_clear', 'turn_left_flat', 'turn_right_flat'];
    const faOption = {'canvas_save': 'faSave', 'canvas_clear': 'faTrash', 'turn_left_flat': 'faArrowLeft', 'turn_right_flat': 'faArrowRight'}
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState(undefined);
    const [eraserEnabled, setEraserEnabled] = useState(false);
    const [lineWidth, setLineWidth] = useState(10);
    const [strokeStyle, setStrokeStyle] = useState('black');
    const [step, setStep] = useState(-1);
    const [canvasHistory, setCanvasHistory] = useState([]);
    const canvasRef = useRef(null);

    const getCoordinates = (event) => {
        if (!canvasRef.current) {
            return;
        }

        return { x:event.offsetX , y: event.offsetY };
    }

    const drawLine = useCallback(
        (originalMousePosition, newMousePosition) => {
            if (!canvasRef.current) {
                return;
            }
    
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                context.strokeStyle = strokeStyle;
                context.lineJoin = 'round';
                context.lineWidth = lineWidth;
    
                context.beginPath();
                context.moveTo(originalMousePosition.x, originalMousePosition.y);
                context.lineTo(newMousePosition.x, newMousePosition.y);
                context.closePath();
    
                context.stroke();
            }
        },
        [lineWidth, strokeStyle],
    )

    const clearRect = useCallback(
        ({x, y, width, height}) => {
            if (!canvasRef.current) {
                return;
            }

            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            if (context) {
                context.clearRect(x, y, width, height)
            }
        },
        [],
    )

    const startPaint = useCallback(
        (event) => {
            event.stopPropagation();
            const coordinates = getCoordinates(event);
            if (coordinates) {
                setIsPainting(true);
                setMousePosition(coordinates);
            }
        },
        [],
    )

    const paint = useCallback(
        (event) => {
            event.stopPropagation();
            if (isPainting) {
                const newMousePosition = getCoordinates(event);
                if (mousePosition && newMousePosition) {
                    if (eraserEnabled) {
                        clearRect({
                            x: newMousePosition.x - lineWidth / 2,
                            y: newMousePosition.y - lineWidth / 2,
                            width: lineWidth,
                            height: lineWidth,
                        })
                    } else {
                        drawLine(mousePosition, newMousePosition);
                        setMousePosition(newMousePosition);
                    }
                }
            }
        },
        [isPainting, mousePosition, clearRect, drawLine, eraserEnabled, lineWidth],
    )

    const saveFragment = useCallback(
        () => {
            setStep(step + 1)
            if (!canvasRef.current) {
                return;
            }

            const canvas = canvasRef.current;
            canvasHistory.push(canvas.toDataURL());
            setCanvasHistory(canvasHistory);

        },
        [step, canvasHistory],
    )

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);
        saveFragment();
    }, [saveFragment]);

    const leaveCanvas = useCallback(
        () => {
            setIsPainting(false);
            setMousePosition(undefined)
        },
        [],
    )

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        canvas.addEventListener('mousemove', paint)
        canvas.addEventListener('mouseup', exitPaint)
        canvas.addEventListener('mouseleave', leaveCanvas)
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
            canvas.removeEventListener('mousemove', paint)
            canvas.removeEventListener('mouseup', exitPaint)
            canvas.removeEventListener('mouseleave', leaveCanvas)
        }
    }, [startPaint, paint, exitPaint, leaveCanvas])

    const onToolsClick = useCallback(
        ([e, toolName]) => {
            const el = e.currentTarget;
            if (el.classList[1]) return;
            toolName === "canvas_eraser"
                ? setEraserEnabled(true)
                : setEraserEnabled(false);
            el.classList.add('active');
            el.parentNode.childNodes.forEach(item => {
                item.classList.remove("active");
            })
        },
        []
    );

    const onSizesChange = useCallback(
        (e) => {
            setLineWidth(e.target.value);
        },
        [],
    )

    const onColorsClick = useCallback(
        ([e, selector, color]) => {
            const el = e.target
            if (el.className.includes('active')) return
            setStrokeStyle(color);
            el.classList.add('active')
            el.parentNode.childNodes.forEach((item) => {
                if (!item.matches(selector) || item === el) return
                    item.classList.remove('active')
                })
        },
        [],
    )

    const onColorsChange = useCallback(
        (e) => {
            setStrokeStyle(e.target.value)
        },
        [],
    )

    const saveCanvas = useCallback(
        () => {
            if (!canvasRef.current) {
                return;
            }

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                const compositeOperation = context.globalCompositeOperation
                context.globalCompositeOperation = 'destination-over'
                context.fillStyle = '#fff'
                context.fillRect(0, 0, 890, 580)
                const imageData = canvas.toDataURL('image/png')
                context.putImageData(context.getImageData(0, 0, 890, 580), 0, 0)
                context.globalCompositeOperation = compositeOperation
                const a = document.createElement('a')
                document.body.appendChild(a)
                a.href = imageData
                a.download = 'myPaint'
                a.target = '_blank'
                a.click()
              }
        },
        [],
    )

    const changeCanvas = useCallback(
        (type) => {
            if (!canvasRef.current) {
                return;
            }

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                let currentStep = -1;
                if (type === 'back' && step >= 0) {
                    currentStep = step - 1
                    // go.classList.add('active')
                    if (currentStep < 0) {
                      // back.classList.remove('active')
                    }
                } else if (type === 'go' && step < canvasHistory.length - 1) {
                    currentStep = step + 1
                } else {
                    return;
                }

                context.clearRect(0, 0, 890, 580);
                const canvasPic = new Image();
                canvasPic.src = canvasHistory[currentStep];
                canvasPic.addEventListener('load', () => {
                    context.drawImage(canvasPic, 0, 0)
                })
                setStep(currentStep)
            }
        },
        [canvasHistory, step],
    )

    const checkClearDialog  = useCallback(
        () => {
            clearRect({
                x: 0,
                y: 0,
                width: 890,
                height: 580
            })

            setCanvasHistory([])
            setStep(-1)

        },
        [setCanvasHistory, setStep, clearRect],
    )
    const onOptionsClick = useCallback(
        (toolName) => {
            switch (toolName) {
                case 'canvas_clear':
                  if (step === -1) return
                  // setClearDialogOpen(true)
                  checkClearDialog()
                  break
                case 'canvas_save':
                  saveCanvas()
                  break
                case 'turn_left_flat':
                  changeCanvas('back')
                  break
                case 'turn_right_flat':
                  changeCanvas('go')
                  break
                default:
                    return;
              }
        },
        [saveCanvas, changeCanvas, step, checkClearDialog],
    )

    return (
        <div className='options'>
            
            <div className="canvas">
                <canvas height='580' width='890' style={{ width:'100%', height: '100%' }} ref={canvasRef} />
            </div>
            <div className='toolbar'>
                <div className="toolbar-options">
                    <div className="toolbar-title">
                        Toolbox
                    </div>
                    <div className="toolpanel toolbar-item">
                        {
                            toolsMap.map((tool) => {
                            return (
                                <div onClick={(e) => onToolsClick([e, tool])}  key={ tool }>
                                    <FontAwesomeIcon 
                                        icon={ tool === 'canvas_paint' ? FaIcons['faPencilAlt'] : FaIcons['faEraser'] }
                                        style={{
                                            boxSizing: 'content-box',
                                            margin: '0 8px',
                                            padding: '5px',
                                            width: '24px',
                                            height: '24px',
                                            color: '#343434',
                                        }}
                                        className={
                                            tool === 'canvas_eraser'
                                            ? eraserEnabled
                                                ? 'active'
                                                : ''
                                            : !eraserEnabled
                                                ? 'active'
                                                : ''
                                        }
                                    />
                                </div>
                            )
                            })
                        }
                    </div>
                </div>
                
                <div className="toolbar-handle">
                    <div className="toolbar-title">
                        Options
                    </div>

                    <div className="toolpanel toolbar-item">
                        {
                            optionsMap.map(option => {

                                return (
                                <div onClick={() => onOptionsClick(option)}  key={ option }>
                                    <FontAwesomeIcon 
                                        icon={ FaIcons[faOption[option]] }
                                        style={{
                                            boxSizing: 'content-box',
                                            margin: '0 8px',
                                            padding: '5px',
                                            width: '24px',
                                            height: '24px',
                                            color: '#343434',
                                        }}
                                    />
                                </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="toolbar-sizes">
                    <input 
                        style={ { backgroundColor: eraserEnabled ? '#ebeff4' : strokeStyle } }
                        type='range'
                        id='range'
                        name='range'
                        min='1'
                        max='20'
                        value={lineWidth}
                        onChange={onSizesChange}
                    />
                </div>

                <ol className="toolbar-colors">
                    {
                        colorMap.map((color, index) => {
                            return (
                                <li
                                    className={color === strokeStyle ? color + ' active' : color }
                                    key={index + color}
                                    onClick={(e) => onColorsClick([e, 'li', color])}
                                >
                                </li>
                            )
                        })
                    }
                </ol>

                <div className='toolbar-title'>
                    <input type='color' value={strokeStyle} onChange={onColorsChange} id="currentColor" />
                </div>
            </div>
        </div>
        )
}

export default Canvas;