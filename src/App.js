import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomeScreen from './screens/HomeScreen'
import GameLobbyScreen from './screens/GameLobbyScreen';
import RoomCreateModal from './components/RoomCreateModal';

// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";


const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomeScreen}  />
        <Route exact path="/lobby" component={GameLobbyScreen} />
        <Route exact path="/test" component={RoomCreateModal}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
