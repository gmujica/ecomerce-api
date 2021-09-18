const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        ammount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: 'pending' },
    }, 
    { timestamp: true }
);

module.exports = mongoose.model('order', OrderSchema);