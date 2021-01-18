import configureStore from "./store/configureStore";
import { loadBugs, assignBugToUser } from "./store/bugs";
const store = configureStore();

// UI Layer
store.dispatch(loadBugs());

setTimeout(() => store.dispatch(assignBugToUser(1, 2)), 2000)