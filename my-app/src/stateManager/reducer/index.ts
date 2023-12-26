import { composeWithDevTools } from '@redux-devtools/extension';
import { createStore } from 'redux'
import { combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSession from './userSession';
import commonStates from './common';
import analyticsStates from './analytics';

const persistConfig = {
  key: 'root',
  storage,
}

//comine all subreducers 
const rootReducer = combineReducers({
  userSession,
  commonStates,
  analyticsStates
});
const persistedReducer = persistReducer(persistConfig, rootReducer)

export let store = createStore(persistedReducer, composeWithDevTools())
export let persistor = persistStore(store)