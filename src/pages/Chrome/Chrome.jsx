import React, { Component } from 'react';
import right from '../../public/img/chrome/icon/right.png';
import left from '../../public/img/chrome/icon/left.png';
import './chrome.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';

class Chrome extends Component {

	constructor(props) {
		super(props);
		this.state = {
			defaultUrl: 'https://www.bing.com',
			url: '',
			list: ['https://www.bing.com']
		}

		this.iframeRef = React.createRef();
	}

	handleBack = () => {
		const { url, list } = this.state;
		let index = list.indexOf(url);
		if (index === 0) {
			return;
		}
		let backUrl = index !== -1 ? list[index - 1] : '';
		if (backUrl) {
			this.setState({
				url: backUrl
			})
		}
	}

	handleForWord = () => {
		const { url, list } = this.state;
		let index = list.indexOf(url);
		if (index === 9) {
			return ;
		}
		let backUrl = index !== -1 ? list[index + 1] : '';
		if (backUrl) {
			this.setState({
				url: backUrl
			})
		}
	}

	handleHome = () => {
		const { defaultUrl } = this.state;
		let iframe = this.iframeRef.current;
		if (iframe) {
			iframe.src = defaultUrl;
		}
		this.setState({
			url: defaultUrl,
			list: [defaultUrl]
		})
	}

	handleKeyWord = (e) => {
		if (e.key === 'Enter') {
			const { list } = this.state;
			let query = e.target.value;
			if (this.isValidURL(query)) {
				if (!query.startsWith('http')) {
					query = "https://" + query;
				}
			} else {
				query = 'https://www.bing.com/search?q=' + query;
			}
			e.target.value = query;

			if (list.length > 10) {
				list.shift();
			}
			list.push(query);
			this.setState({
				list,
				url: query
			})
		}
	}


	handleRefresh = () => {
		let iframe = this.iframeRef.current;
		if (iframe) {
			let address = iframe.src;
			iframe.src = address;
		}
	}

	isValidURL = (string) => {
		var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g);
		return (res !== null)
	}

    render() {
		const { defaultUrl, url } = this.state;
        return (
           <div className='chrome'>
               <div className="chrome-addressbar">
                    <div 
						className="chrome-icon"
						onClick={this.handleBack}
					>
                       <img src={left} alt="" style={{ margin: '0 8px' }} />
                   </div>
                    <div 
						className="chrome-icon"
						onClick={this.handleForWord}
					>
                       <img src={right} alt="" style={{ margin: '0 8px' }} />
                   </div>
                    <div 
						className="chrome-icon"
						onClick={this.handleRefresh}
					>
                        <FontAwesomeIcon 
                            icon={FaIcons['faRedo']}
                            style={{
                                margin: '0 8px',
                                width: '14px',
                                color: '#343434',
                            }}

                        />
                   </div>
                    <div 
						className='chrome-icon'
						onClick={this.handleHome}
					>
                        <FontAwesomeIcon
                            icon={FaIcons['faHome']}
                            style={{
                                margin: '0 8px',
                                width: '14px',
                                color: '#343434'
                            }}
                        />
                    </div>
					<div className="chrome-url">
						<input 
							type="text" 
							defaultValue={defaultUrl} 
							onKeyDown={this.handleKeyWord}
						/>
					</div>
               </div>
			   <div className="chrome-iframe">
				   <iframe ref={this.iframeRef} title='iframe' id="isite" src={url || defaultUrl} frameborder="0"></iframe>
			   </div>
           </div>
        )
    }
}

export default Chrome;