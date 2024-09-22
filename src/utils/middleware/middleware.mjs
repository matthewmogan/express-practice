
// export const resolveIndexUserByID = (request, response, next) => {
//     const { params: {id} } = request
//     const parsedID = parseInt(id)
//     if (isNaN(parsedID)) return response.status(404).send(`Invalid ID`)
//     const findUserIndex = mockUsers.findIndex((user) => user.id === parsedID)
//     if(findUserIndex === -1) return response.sendStatus(404)
//     request.findUserIndex = findUserIndex
//     next()
// }

export const extractUsername = (request, response, next) => {
    const { params: {username} } = request;
    request.username = username
    next()
}

export const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

export const logSessionStore = (request, response, next) => {
    request.sessionStore.get(request.session.id, (error, sessionData) =>{
        if (error) {
            console.log(err);
            throw err;
        }
        console.log("Inside Session Store Get");
        console.log(sessionData)
    })
    next()
}
