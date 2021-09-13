import { fromJS } from 'immutable';
import backgroundImg from '../../../public/img/desktop.jpg';
import document from '../../../public/img/app/documents.png';
import calculator from '../../../public/img/app/calculator.png';
import chrome from '../../../public/img/chrome/chrome.png';
import calendar from '../../../public/img/app/calendar.png';
import mail from '../../../public/img/app/mail.png';
import MineSweeper from '../../../public/img/app/MineSweeper.png';
import Drawboard from '../../../public/img/app/draw.png';

export default fromJS({
    background: {
        type:'image',
        value: backgroundImg
    },
    dataTime: {
        year: '0000',
        month: '00',
        day: '00',
        hour: '00',
        minute: '00',
        week: ''
    },
    desktopApps: [
        { 
            name: '文件夹', 
            type: 'document', 
            img: document, 
            key: 1, 
            isShow: true,
            position: null,
            size: {
                width: 600,
                height: 400,
                originalWidth: 0,
                originalHeight: 0
            },
            iconPosition: {
                x: 0,
                y: 0
            },
            dragline: {
                x: 0,
                y: 0,
                width: 60,
                height: 93,
                leftline: 0,
                rightline: 0 + 60,
                topline: 0,
                bottomline: 0 + 93,
                verticacenterline: 60 / 2,
                horizontalcenterline: 93 / 2,
            },
            disableDrag: false
        },
        { 
            name: '计算器', 
            type: 'calculator', 
            img: calculator, 
            key: 2, 
            isShow: true,
            position: null,
            size: {
                width: 320,
                height: 540,
                originalWidth: 0,
                originalHeight: 0
            },
            iconPosition: {
                x: 0,
                y: 93
            },
            dragline: {
                x: 0,
                y: 93,
                width: 60,
                height: 93,
                leftline: 0,
                rightline: 93 + 60,
                topline: 0,
                bottomline: 93 + 93,
                verticacenterline: 60 / 2,
                horizontalcenterline: (93 + 93) / 2,
            },
            maxWidth: 400,
            disableDrag: false
        },
        
        {
            name: 'Chrome', 
            type: 'chrome', 
            img: chrome, 
            key: 3, 
            isShow: true,
            position: null,
            size: {
                width: 600,
                height: 400,
                originalWidth: 0,
                originalHeight: 0
            },
            iconPosition: {
                x: 0,
                y: 186
            },
            dragline: {
                x: 0,
                y: 186,
                width: 60,
                height: 93,
                leftline: 0,
                rightline: 186 + 60,
                topline: 0,
                bottomline: 186 + 186,
                verticacenterline: 60 / 2,
                horizontalcenterline: (186 + 186) / 2,
            },
            disableDrag: false
        },
        {
            name: 'MineSweeper',
            type: 'MineSweeper',
            img: MineSweeper,
            key: 4,
            isShow: true,
            position: null,
            size: {
                width: 0,
                height: 0,
                originalWidth: 0,
                originalHeight: 0
            },
            iconPosition: {
                x: 0,
                y: 279
            },
            disableDrag: false,
            dragline: {
                x: 0,
                y: 279,
                width: 60,
                height: 93,
                leftline: 0,
                rightline: 279 + 60,
                topline: 0,
                bottomline: 279 + 279,
                verticacenterline: 60 / 2,
                horizontalcenterline: (279 + 279) / 2,
            },
            isBigSize: true
        },
        {
            name: 'Drawboard',
            type: 'Drawboard',
            img: Drawboard,
            key: 5,
            isShow: true,
            position: null,
            size: {
                width: 0,
                height: 0,
                originalWidth: 0,
                originalHeight: 0
            },
            iconPosition: {
                x: 0,
                y: 372
            },
            dragline: {
                x: 0,
                y: 372,
                width: 60,
                height: 93,
                leftline: 0,
                rightline: 372 + 60,
                topline: 0,
                bottomline: 372 + 372,
                verticacenterline: 60 / 2,
                horizontalcenterline: (372 + 372) / 2,
            },
            disableDrag: false,
            isBigSize: true
        }
    ],
    openWindowList: [],
    sidepane: true,
    tileList: [
        {
            name: 'Calculator',
            key: 1,
            img: calculator, 
        },
        {
            name: 'Calendar',
            key: 2,
            img: calendar
        },
        {
            name: 'Mail',
            key: 3,
            img: mail
        }
    ],
    popWindow: {
        start: true
    },

})