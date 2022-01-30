const User = require('./model/User');

const { NotFound, Validation } = require('../../errors');

class UserService {
    async findById(id) {
        const user = await User.findById(id);

        if (!user) {
            throw new NotFound(`Could not find "user" with ${id}`);
        }

        return user;
    }

    async findByEmail(email) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFound(`Could not find "user" with ${email}`);
        }

        return user;
    }

    async create(username, email, password) {
        const user = await User.create({ username, email, password });

        return user;
    }

    async deleteById(id) {
        const user = await User.findByIdAndDelete(id, { returnDocument: true });

        if (!user) {
            throw new NotFound(`Could not find "user" with ${id}`);
        }

        return user;
    }

    async updateById(id, payload) {
        const user = await User.findByIdAndUpdate(id, payload, { new: true });

        if (!user) {
            throw new NotFound(`Could not find "user" with ${id}`);
        }

        return user;
    }

    async findByResetToken(token) {
        const user = await User.findOne({ resetToken: token });

        if (!user) {
            throw new Validation(`Invalid token: ${token}`);
        }

        return user;
    }

    async findByMailToken(token) {
        const user = await User.findOne({ mailToken: token });

        if (!user) {
            throw new Validation(`Invalid token: ${token}`);
        }

        return user;
    }
}

module.exports = UserService;
