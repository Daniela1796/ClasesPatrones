import jwt from 'jsonwebtoken';

const JWT_SECRET = "sdkjfghwkejfkrhgfjdhbvwjivehwvdfjhwve21354656631";

export class AuthApplication{
    static generateToken(payload: object): string{
        return jwt.sign(payload, JWT_SECRET, {expiresIn: "1H"});
    }

    static verifyToken(token: string): any{
        return jwt.verify(token, JWT_SECRET);
    }
    
}