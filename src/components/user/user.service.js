const User = require('./model/User');

const { NotFound } = require('../../errors');

class UserService {
    static async findById(id) {
        const user = await User.findById(id);

        if (!user) {
            throw new NotFound(`Could not find "user" with ${id}`);
        }

        return user;
    }

    static async findByEmail(email) {
        const user = await User.findOne(email);

        if (!user) {
            throw new NotFound(`Could not find "user" with ${email}`);
        }

        return user;
    }

    static async create(username, email, password) {
        const user = await User.create({ username, email, password });

        return user;
    }

    static async deleteById(id) {
        const user = await User.findByIdAndDelete(
            { _id: id },
            { returnDocument: true }
        );

        if (!user) {
            throw new NotFound(`Could not find "user" with ${id}`);
        }

        return user;
    }

    static async updateById(id, payload) {
        const user = await User.findByIdAndUpdate(id, payload, { new: true });

        if (!user) {
            throw new NotFound(`Could not find "user" with ${id}`);
        }

        return user;
    }
}

module.exports = UserService;
