const { Schema, model } = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');

// TODO: add hooks

const UserSchema = new Schema(
    {
        username: {
            type: String,
            min: 4,
            max: 12,
            trim: true,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.salt = randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return pbkdf2Sync(
            password,
            Buffer.from(this.salt, 'base64'),
            1000,
            64,
            'sha256'
        );
    } else {
        return password;
    }
};

UserSchema.methods.comparePassword = function (password) {
    return this.password === this.hashPassword(password);
};

module.exports = model('User', UserSchema);
