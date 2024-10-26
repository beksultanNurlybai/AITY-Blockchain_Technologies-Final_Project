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
        unique: true,
        index: true,
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
    },
    provider_id: {
        type: String,
        ref: 'User',
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
