import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import './Drawboard.scss';

const Canvas = (props) => {
    const toolsMap = ["canvas_paint", "canvas_eraser"];
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState(undefined);
    const [eraserEnabled, setEraserEnabled] = useState(false);
    const canvasRef = useRef(null);

    const getCoordinates = (event) => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;


        return { x:event.pageX  - canvas.offsetLeft - 1 , y: event.pageY - canvas.offsetTop - 31 };
    }

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

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        }
    }, [startPaint])


    const paint = useCallback(
        (event) => {
            event.stopPropagation();
            if (isPainting) {
                const newMousePosition = getCoordinates(event);
                if (mousePosition && newMousePosition) {
                   /*  if (eraserEnabled) {
                        clearRect({
                            x: newMousePosition.x - lineWidth / 2,
                            y: newMousePosition.y - lineWidth / 2,
                            width: lineWidth,
                            height: lineWidth,
                        })
                    } else { */
                        drawLine(mousePosition, newMousePosition);
                        setMousePosition(newMousePosition);
                    // }
                }
            }
        },
        [isPainting, mousePosition],
    )

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint)
        }
    }, [paint])

    const drawLine = (originalMousePosition, newMousePosition) => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.strokeStyle = 'red';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();

            context.stroke();
        }
    }

    const exitPaint = useCallback(() => {
        setIsPainting(false);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);
        return () => {
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
        };
    }, [exitPaint]);

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

    return (
        <div className='options'>
            <div className='toolbar'>
                options
                <div className="toolpanel toolbar-item">
                    {
                        toolsMap.map((tool, index) => {
                            return (
                                <div onClick={(e) => onToolsClick([e, tool])}  key={ tool }>
                                    <FontAwesomeIcon 
                                        icon={ tool === 'canvas_paint' ? FaIcons['faPencilAlt'] : FaIcons['faEraser'] }
                                        style={{
                                            margin: '0 8px',
                                            padding: '5px',
                                            width: '30px',
                                            height: '30px',
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
                <hr className="toolbar-divider" />
            </div>
            <div className="canvas">
                <canvas height='580' width='890' style={{ width:'100%', height: '100%' }} ref={canvasRef} />
            </div>
        </div>
        )
}

export default Canvas;