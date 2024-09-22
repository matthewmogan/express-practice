import bcrypt from "bcrypt";

const saltRounds = 10;

// function for hashing plain text password. More saltrounds = more encryption, documentation reccomends 10 salt rounds
export const hashPassword = (password, saltrounds = saltRounds) => {
    const salt = bcrypt.genSaltSync((saltrounds)) // generates the salt for the hash
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed) // bcrypt hashes the plain password using the same algorithim and salt factor as the hashed password (embedded in the hash code) and compares the outputs. if they match, then this returns true, and if they do not match, this returns false 
} // compares plain vs hashed passwords and returns true if they match and false if they do not
