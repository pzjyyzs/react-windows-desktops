import { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import store from './store/index';
import { Provider } from 'react-redux';
import './public/style/reset.scss';
import './public/style/index.scss';

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
