const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['provider', 'renter'],
        required: true,
    },
    key: {
        type: String,
        required: function() {
            return this.role === 'provider';
        },
    },
    is_active: {
        type: Boolean,
        required: function() {
            return this.role === 'provider';
        },
    },
    resource: {
        processor_name: {
            type: String,
        },
        cpu_count: {
            type: Number,
        },
        ram_size: {
            type: Number,
        },
        price: {
            type: Number
        }
    },
    provider_id: {
        type: String,
        ref: 'User',
    },
}, { timestamps: true });

userSchema.index({ key: 1 }, { unique: true, partialFilterExpression: { key: { $exists: true, $ne: null } } });

const User = mongoose.model('User', userSchema);

module.exports = User;
