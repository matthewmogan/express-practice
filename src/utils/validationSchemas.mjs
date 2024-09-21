export const userValidation = {
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
            errorMessage: "Username must be a string"
        },
    },
    displayname: {
        notEmpty: {
            errorMessage: "displayname cannot be empty"
        },
        isString: {
            errorMessage: "Displayname must be a string"
        },
    },
    password: {
        notEmpty: {
            errorMessage: "password cannot be empty"
        },
        isString: {
            errorMessage: "Password must be a string"
        },
    }
}

export const productValidation = {
    globalbrand: {
        isLength: {
            options: {
                min: 1,
                max: 32
            },
            errorMessage: "globalbrand must be 1 to 32 characters"   
        },
        notEmpty: {
            errorMessage: "globalbrand cannot be empty"
        },
        isString: {
            errorMessage: "globalbrand must be a string"
        }
    },
    storename: {
        notEmpty: {
            errorMessage: "storename cannot be empty"
        },
        isString: {
            errorMessage: "storename must be a string"
        }
    },
    productname: {
        notEmpty: {
            errorMessage: "username cannot be empty"
        },
        isString: {
            errorMessage: "productname must be a string"
        }
    },
    price: {
        notEmpty: {
            errorMessage: "price cannot be empty"
        },
        isDecimal: {
            errorMessage: "price must be a decimal"
        }
    },
    ageRestricted: { 
        notEmpty: {
            errorMessage: "age restricted is required"
        },
        isBoolean: {
            errorMessage: "age restricted must be a boolean"
        }
    }
}