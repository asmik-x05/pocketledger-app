import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PERSIST, persistReducer } from "redux-persist";
import rootReducer from "./rootReducer";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

export { store, persistor };
