import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file 

const SECRET_WORD = process.env.REACT_APP_SECRET_WORD;

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {

    if (!SECRET_WORD)
        throw new Error("Error");
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET_WORD).digest('hex')
}