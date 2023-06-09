import { EnhancedStore, configureStore } from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query';
import { fitsApi } from '../slice/FitsApi.slice';
import tokenReducer from '../slice/token.slice';
import fitsReducer from '../slice/FitsSlice.store';
import messagesReducer, { MessageState } from '../slice/messages.slice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    fitsStore: fitsReducer,
    messages: messagesReducer,
    [fitsApi.reducerPath]: fitsApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fitsApi.middleware)
});

setupListeners(store.dispatch);
