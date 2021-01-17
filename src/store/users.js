import { createSlice } from "@reduxjs/toolkit";

let prevID = 0;

const slice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        userAdded: (users, action) => {
            users.push({
                id: ++prevID,
                name: action.payload.name
            })
        }
    }
})

export const { userAdded } = slice.actions

export default slice.reducer