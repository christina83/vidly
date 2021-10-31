// Create a new rental

const Joi = require('joi');
const mongoose = require('mongoose');


// Create model und simultaneously the schema
const Rental = mongoose.model('Rental', new mongoose.Schema ({
    customer: {
        type: new mongoose.Schema ({  // weil ich nicht alle Attribute von customer übernehmen will 
            name: {
                type: String,
                required: true,
                minlength: 5, 
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),  
        required: true
    },
    movie: {
        type: new mongoose.Schema({  // weil ich nicht alle Attribute von movie übernehmen will 
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date  // nicht required, weil ich das Rückgabedatum noch nicht kenne
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

        
// Es sollen vom Customer nur seine ID und Movie übergeben werden bei der Ausleihe, alles andere wird vom Server gesetzt
function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
};

exports.Rental = Rental;
exports.validate = validateRental;