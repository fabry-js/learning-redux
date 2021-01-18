const error = state => next => action => {
    if (action.type === 'error')
        console.log(`Toastify: ${action.payload.message}`)
        // and stop.
    else
        next(action)
}

export default error