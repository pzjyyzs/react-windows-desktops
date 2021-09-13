import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import { Window,TitleBar } from 'react-desktop/windows';

class WindowsWindow extends Component {

    constructor(props) {
        super(props);
        this.rndRef = React.createRef();
    }

    componentDidMount() {
        const { updateApps, apps, openWindowList } =this.props;
        if (apps.isBigSize) {
            const width = document.body.clientWidth,
                    height = document.body.clientHeight - 40;
            updateApps(apps, openWindowList, {
                disableDrag: true,
                position: {
                    x: 0,
                    y: 0,
                },
                size: {
                    width,
                    height,
                },
                minWidth: width,
                minHeight: height
            })

            this.rndRef.current.updatePosition({
                x: 0,
                y: 0
            })

            this.rndRef.current.updateSize({
                width: width,
                height: height
            });
        }
    }

    handleCloseWindow = (event) => {
        event.stopPropagation();
        const { closeWindow, openWindowList, apps } = this.props;
        closeWindow(apps, openWindowList);
    }

    handleMaxSize = (event) => {
        event.stopPropagation();
        const { updateApps, apps, openWindowList } =this.props;
        if (apps.isBigSize) {
            return;
        }

        const width = document.body.clientWidth,
              height = document.body.clientHeight - 40;

        const { x: windowLeft, y: windowTop } =
            this.extractPositionFromTransformStyle(
                this.rndRef?.current?.resizableElement?.current.style.transform,
        );

        const { clientWidth: windowWidth, clientHeight: windowHeight } =
            this.rndRef.current.resizableElement.current;
        
        if (windowWidth === width && windowHeight === height) {
            this.rndRef.current.updateSize({ width: apps.size.originalWidth, height: apps.size.originalHeight });
            this.rndRef.current.updatePosition({ x: apps.position.originalX, y: apps.position.originalY });
            updateApps(apps, openWindowList, { 
                disableDrag: false,
                size: {
                    width: apps.size.originalWidth, 
                    height: apps.size.originalHeight,
                    originalWidth: apps.size.originalWidth,
                    originalHeight: apps.size.originalHeight
                },
                position: {
                    x: apps.position.originalX, 
                    y: apps.position.originalY,
                    originalX: apps.position.originalX,
                    originalY:  apps.position.originalY
                }
            });
        } else {
            updateApps(apps, openWindowList, { 
                disableDrag: true,
                position: {
                    x: 0,
                    y: 0,
                    originalX: windowLeft,
                    originalY: windowTop
                },
                size: {
                    width,
                    height,
                    originalWidth: windowWidth,
                    originalHeight: windowHeight
                }
            });
            this.rndRef.current.updatePosition({
                x: 0,
                y: 0
            })

            this.rndRef.current.updateSize({
                width: width,
                height: height
            });
        }
    }

    handleMinSize = (event) => {
        event.stopPropagation();
        const { handleWindow, openWindowList, apps } = this.props;

        handleWindow(apps, openWindowList, false);
    }

    handleClick = () => {
        const { openWindow, openWindowList, apps } = this.props;
        openWindow(apps, openWindowList);
    }

    extractPositionFromTransformStyle = (transformStyle) => {
        const matched = transformStyle.matchAll(/[0-9.]+/g);
        try {
            return {
                x: Number(matched.next().value[0]),
                y: Number(matched.next().value[0]),
            };
        } catch {
            return { x: 0, y: 0 };
        }
    }

    positionChange = (e, direction, ref, delta, position) => {
        const { updateApps, apps, openWindowList } =this.props;
        updateApps(apps, openWindowList, { 
            disableDrag: false,
            position: {
                x: position.x,
                y: position.y,
                originalX: apps.position.originalX,
                originalY: apps.position.originalY
            },
            size: {
                width: ref.style.width,
                height: ref.style.height,
                originalWidth: apps.size.originalWidth,
                originalHeight: apps.size.originalHeight
            }
        });
    }

    dragStop = (e, d) => {
        const { updateApps, apps, openWindowList } =this.props;
        updateApps(apps, openWindowList, {
            position: {
                x: d.x, 
                y: d.y,
                originalX: apps.position.originalX,
                originalY:  apps.position.originalY
            }
        })
    }

    handleTest = () => {
        return (
            <div style={{ color: 'red' }}>123</div>
        )
    }

    render() {
        const { apps } = this.props;
        return (
            <Rnd
                style={{ zIndex: apps.zIndex }}
                default={{
                    x: apps.position.x,
                    y: apps.position.y,
                    width: apps.size.width,
                    height: apps.size.height,
                }}
                ref={this.rndRef}
                bounds='window'
                disableDragging={apps.disableDrag}
                onResizeStop={this.positionChange}
                onDragStop={this.dragStop}
                onClick={this.handleClick}
                minWidth={ apps.minWidth ||300 }
                minHeight={ apps.minHeight || 200 }
                maxWidth={ apps.maxWidth }
            >
                <Window
                    chrome
                    width='100%'
                    height='100%'
                >
                    <TitleBar
                        controls
                        title={apps.type}
                        onCloseClick={this.handleCloseWindow.bind(this)}
                        onMaximizeClick={this.handleMaxSize.bind(this)}
                        onMinimizeClick={this.handleMinSize.bind(this)}
                    >
                    </TitleBar>
                    {this.props.children}
                </Window>
            </Rnd>
        )
    }
}

export default WindowsWindow;