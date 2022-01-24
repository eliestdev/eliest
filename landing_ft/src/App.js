import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Landing from './views/Landing';
import HowToPlay from './views/How-to-play';
import Agent from './views/Agent'
import Supervisor from './views/Supervisor'
import Contact from './views/Contact'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/how" component={HowToPlay} />
        <Route exact path="/how/agent" component={Agent} />
        <Route exact path="/how/supervisor" component={Supervisor} />
        <Route exact path="/contact" component={Contact} />
      </Switch>
   </BrowserRouter>
  );
}

export default App;
