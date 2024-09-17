import { mockUsers } from "../constants/constants.mjs"

export const resolveIndexUserByID = (request, response, next) => {
    const { params: {id} } = request
    const parsedID = parseInt(id)
    if (isNaN(parsedID)) return response.status(404).send(`Invalid ID`)
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedID)
    if(findUserIndex === -1) return response.sendStatus(404)
    request.findUserIndex = findUserIndex
    next()
}

export const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}
