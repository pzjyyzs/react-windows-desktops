import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import store from './store/index';
import { Provider } from 'react-redux';
import './public/style/reset.scss';
import './public/style/index.scss';

const Home = asyncComponent(() => import('./pages/Home/Home'));
function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentDidMount() {
      if (!this.state.Component) {
        getComponent().then(({ default: Component }) => {
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }

    componentWillUnmount() {
      //重写组件的setState方法，直接返回空
      this.setState = (state, callback) => {
        return;
      };
    }

    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return null
    }
  }
}

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path='' component={Home}></Route>
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App;
