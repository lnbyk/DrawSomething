import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Socket from "./utils/socket";
import HomeScreen from "./screens/HomeScreen";
import GameLobbyScreen from "./screens/GameLobbyScreen";
import RoomCreateModal from "./components/RoomCreateModal";
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import roomReducer from './store/reducers/room'

// import socket io

import "./App.css";

// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";



var mysocket = new Socket()
var a = new Socket();
mysocket.onConnect(111)

const rootReducer = combineReducers({
  room: roomReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  return (
    <Provider store={store}>
      <div className="mainContainer">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={HomeScreen} />
            <Route exact path="/lobby" component={GameLobbyScreen} />
            <Route exact path="/test" component={RoomCreateModal} />
          </Switch>
        </BrowserRouter>
      </div>
    </Provider>
  );
};

export default App;
