const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['owner', 'renter'],
        required: true,
    },
    key: {
        type: String,
        required: function() {
            return this.role === 'owner';
        },
    },
    resource: {
        processor_name: {
            type: String,
            required: function() {
                return this.role === 'owner';
            },
        },
        cpu_count: {
            type: Number,
            required: function() {
                return this.role === 'owner';
            },
        },
        ram_size: {
            type: Number,
            required: function() {
                return this.role === 'owner';
            },
        },
    },
    provider_id: {
        type: String,
        ref: 'User',
        required: function() {
            return this.role === 'renter';
        },
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
