import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {persistStore,persistReducer, FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER,} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import accessTokenReducer from './accesstoken/access_token';

// Define the Redux Persist configuration object
const persistConfig = {
  key: 'root', // Key prefix for the persisted state
  storage, // Storage mechanism to use (e.g., local storage, session storage)
  whitelist: ['access_token'], // List of reducer keys to persist, or use `blacklist` to exclude specific reducers
};

// Wrap the root reducer with the persist configuration
const rootReducer = combineReducers({
  access_token: accessTokenReducer,
  // Add other reducers as needed
});
const persistedReducer = persistReducer(persistConfig, rootReducer);



// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
  })
  // Add other store configurations as needed
});

// Initialize the persisted store
export const persistor = persistStore(store);

export default store;
