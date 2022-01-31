const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const { randomBytes, pbkdf2Sync, createHash } = require('crypto');

const ConfigService = require('../../../config/config.service');

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
        },
        resetToken: {
            type: String,
            default: undefined,
        },
        mailToken: {
            type: String,
            default: undefined,
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
        this.salt = randomBytes(32).toString('base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return pbkdf2Sync(password, this.salt, 10000, 64, 'sha256').toString(
            'hex'
        );
    }

    return password;
};

UserSchema.methods.comparePassword = function (password) {
    return this.password === this.hashPassword(password);
};

UserSchema.methods.createToken = function () {
    const token = randomBytes(16).toString('base64');

    const hash = createHash('sha256').update(token).digest('hex');

    return hash;
};

UserSchema.methods.createJWT = function () {
    const { secret, algorithm, expiresIn } = ConfigService.loadJWTConfig();

    return jwt.sign({ id: this._id }, secret, { algorithm, expiresIn });
};

module.exports = model('User', UserSchema);
