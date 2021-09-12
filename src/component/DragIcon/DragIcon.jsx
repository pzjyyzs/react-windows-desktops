import React, { useCallback, useRef, useEffect, useState } from 'react';

const DragIcon = ({ item, handleDoubleClick, _start, _drag, _end }) => {
    const [isMove, setIsMove] = useState(false);
    const [mousePosition, setMousePosition] = useState(undefined);
    const appRef = useRef(null);

    const startMove = useCallback(
        (event) => {
            event.stopPropagation();
            if (!appRef.current) {
                return;
            }
            const app = appRef.current;
            const x = event.pageX - app.offsetLeft, // 坐标 - 元素左边的偏移
                y = event.pageY - app.offsetTop; // 
            const coordinates = { x, y }
            setIsMove(true);
            setMousePosition(coordinates);
            _start();
        },
        [_start],
    )

    useEffect(() => {
        if (!appRef.current) {
            return;
        }

        const app = appRef.current;
        app.addEventListener('mousedown', startMove);
        return () => {
            app.removeEventListener('mousedown', startMove)
        }
    }, [startMove]);
    
    const move = useCallback(
        (e) => {
            e.stopPropagation();
            const app = appRef.current;

            if (isMove) {
               if ((e.pageX - mousePosition.x + app.clientWidth) > window.innerWidth) {
                    app.style.left = `${(window.innerWidth - app.clientWidth) / window.innerWidth * 100}%`;
                } else {
                    app.style.left = `${(e.pageX - mousePosition.x) / window.innerWidth * 100}%`;
                }

               if ((e.pageY - mousePosition.y + app.clientHeight) > window.innerHeight) {
                    app.style.top = `${(window.innerHeight - app.clientHeight) / window.innerHeight * 100}%`;
                } else {
                   app.style.top = `${( e.pageY - mousePosition.y ) / window.innerHeight * 100}%`;
                }

               if ((e.pageX - mousePosition.x) <= 0) {
                   app.style.left = 0;
               }

               if ((e.pageY - mousePosition.y) <= 0) {
                   app.style.top = 0;
               }
               
               _drag(app.offsetLeft, app.offsetTop)
            }
        },
        [isMove, mousePosition, _drag],
    )

    useEffect(() => {
        if (!appRef.current) {
            return;
        }
        window.addEventListener('mousemove', move);
        return () => {
            window.removeEventListener('mousemove', move);
        }
    }, [move])

    const exitMove = useCallback(
        () => {
            setIsMove(false);
            _end();
        },
        [_end],
    )

    useEffect(() => {
        if (!appRef.current) {
            return;
        }
        window.addEventListener('mouseup', exitMove);
        //app.addEventListener('mouseleave', exitMove);
        return () => {
            window.removeEventListener('mouseup', exitMove);
            //app.removeEventListener('mouseleave', exitMove);
        }
    }, [exitMove])

    return (
        <div
            key={item.key}
			className='desktop_app middle_logo'
			onDoubleClick={() => handleDoubleClick(item)}
            style={{
                    top: item.iconPosition.y,
                    left: item.iconPosition.x
                }}
            ref={appRef}
        >
			<img src={item.img} alt={item.name} onMouseDown={(e) => e.preventDefault()} draggable="false" />
			<h3>{item.name}</h3>
        </div>
    )
}

export default DragIcon;