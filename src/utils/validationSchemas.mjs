export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 1,
                max: 32
            },
            errorMessage: "username must be 1 to 32 characters"   
        },
        notEmpty: {
            errorMessage: "username cannot be empty"
        },
        isString: {
            errorMessage: "USername must be a string"
        },
    },
    displayname: {
        notEmpty: {
            errorMessage: "username cannot be empty"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "username cannot be empty"
        }
    }
}