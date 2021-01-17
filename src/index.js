import configureStore from './store/configureStore'
import { projectAdded } from './store/projects'
import { bugAdded, bugResolved, getBugsByUser, bugAssignedToUser } from "./store/bugs";
import { userAdded } from "./store/users"

let store = configureStore()

store.subscribe(()=> {
    console.log("Store Changed!")
})

store.dispatch(userAdded({name: 'User 1'}))
store.dispatch(userAdded({name: 'User 2'}))
store.dispatch(projectAdded({ name: 'Project 1' }))
store.dispatch(bugAdded({ description: 'Bug 1' }))
store.dispatch(bugAdded({ description: 'Bug 2' }))
store.dispatch(bugAdded({ description: 'Bug 3' }))
store.dispatch(bugAssignedToUser({bugID: 1, userID: 1}))
store.dispatch(bugResolved({ id: 1 }))

const bugs = getBugsByUser(1)(store.getState())
console.log(bugs)