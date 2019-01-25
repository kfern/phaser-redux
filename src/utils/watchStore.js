import watch from 'redux-watch';
import isEqual from 'is-equal';

// Wrapper de redux-watch
export const watchStore = (store, storeMonitor = []) => {
  storeMonitor.map(i => {
    watchChange(store, i.objectPath, i.onChange);
  });
};

// watchChange(store, 'score.value', handleChangeCounter)
const watchChange = (store, objectPath, onChange) => {
  let change = watch(store.getState, objectPath, isEqual);
  store.subscribe(change((newVal, oldVal, objectPath) => {
    onChange(newVal, oldVal, objectPath);
  }));
};
