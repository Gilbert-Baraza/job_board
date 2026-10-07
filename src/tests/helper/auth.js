import jwt from 'jsonwebtoken'

const createTestToken = ({id = 1,role = 'user'} = {}) => {
    return jwt.sign(
        {
            id,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

export { createTestToken};