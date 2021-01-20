import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBugs, getUnresolvedBugs, resolveBug } from "../store/bugs";

const BugsList = () => {
    
    const dispatch = useDispatch()
    const bugs = useSelector(getUnresolvedBugs)
    console.log(bugs)
    
    useEffect(() => {
        dispatch(loadBugs())
    }, [dispatch])

    
    return (
        <ul>
            {bugs.map((bug) =>
                <li key={bug.id}> {bug.description} <button onClick={() => resolveBug(bug.id)}>Mark as solved</button></li>
            )}
        </ul>
    )
}

export default BugsList