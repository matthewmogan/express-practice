import { createUser, getUserByUsername } from "../handlers/users.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import * as validator from "express-validator"
import { hashPassword } from "../utils/encryption.mjs";
import * as encryption from "../utils/encryption.mjs"
import { Error } from "mongoose";

// mock express validator and its module functions
jest.mock("express-validator", () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false), // mock validationResult.isEmpty() will return false
        array: jest.fn(() => [{msg: "Invalid Field"}]) // mock validationResult.array() will return an array
    })),
    matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        displayname: "test_name"
    }))
}));
// mock the encryption middlewear helper
jest.mock("../utils/encryption.mjs", () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`)
}))
// mock the User model
jest.mock("../mongoose/schemas/user.mjs", )
// mock the response
const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn().mockReturnThis()
}
// mock the request
const mockRequest = {}

describe("Post - Create a user", () => {
    
    it ("should sendStatus 400 when there are errors", async () => {
        await createUser(mockRequest,mockResponse);
        expect (validator.validationResult).toHaveBeenCalledTimes(1);
        expect (validator.validationResult).toHaveBeenCalledWith(mockRequest);
        expect (mockResponse.status).toHaveBeenCalledWith(400);
        expect (mockResponse.send).toHaveBeenCalledWith([{msg: "Invalid Field"}])
    })

    it("should return a status of 201 and create the user when there are no errors", async () => {
        jest.spyOn(validator,"validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => {
                return true
            }) // this overrides the isEmpty return value above of false, without having to remock the entire module again
        }))
        // to check if the save method of the mock User instance was called. this spies on the save method of the instance. we also want to spy on the return value of save. Syntactic sugar with: expect(User.mock.instances[0].save).toHaveBeenCalled()
        const saveMethod = jest
            .spyOn(User.prototype, "save")
            .mockResolvedValueOnce({
                _id: "1",
                username: "test",
                password: "hashed_password",
                displayname: "test_name"
            })
        await createUser(mockRequest, mockResponse); 
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest)
        expect(validator.matchedData).toHaveBeenCalledWith(mockRequest)
        expect(encryption.hashPassword).toHaveBeenCalledWith("password")
        expect(encryption.hashPassword).toHaveReturnedWith("hashed_password")
        expect(User).toHaveBeenCalled()
        expect(User).toHaveBeenCalledWith({
            username: "test",
            password: "hashed_password",
            displayname: "test_name"
        })
        // if you want to see the properties of the mock User instance: console.log(User.mock.instances[0])       
        expect(saveMethod).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.send).toHaveBeenCalledWith({
            _id: "1",
            username: "test",
            password: "hashed_password",
            displayname: "test_name"
        })
    })
    
    it("send status of 400 when database fails to save user", async () => {
        jest.spyOn(validator,"validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => {
                return true
            }) // this overrides the isEmpty return value above of false, without having to remock the entire module again
        }))
        const saveMethod = jest.spyOn(User.prototype, "save").mockImplementationOnce(() => Promise.reject(new Error|("failed to save user")))
        await createUser(mockRequest, mockResponse)
        expect(saveMethod).toHaveBeenCalled()
        expect (mockResponse.sendStatus).toHaveBeenCalledWith(400)
    })
})