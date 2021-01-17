import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect'

let lastID = 0;

const slice = createSlice({
    name: 'bugs',
    initialState: [],
    reducers: {
        bugAdded: (bugs, action) => {
            bugs.push({
                id: ++lastID,
                description: action.payload.description,
                resolved: false
            })
        },
        bugResolved: (bugs, action) => {
            const index = bugs.findIndex(bug => bug.id === action.payload.id)
            bugs[index].resolved = true
        },
        bugAssignedToUser: (bugs, action) => {
            const { bugID, userID } = action.payload
            const index = bugs.findIndex(bug => bug.id === bugID)
            bugs[index].userID = userID
        }
    }
})

export const { bugAdded, bugResolved, bugAssignedToUser } = slice.actions

export default slice.reducer

export const getUnresolvedBugs = createSelector(
    state => state.entities.bugs,
    state => state.entities.projects,
    (bugs, projects) => bugs.filter(bug => !bug.resolved)
)

export const getBugsByUser = userID => createSelector(
    state => state.entities.bugs,
    bugs => bugs.filter(bug => bug.userID === userID)
)
