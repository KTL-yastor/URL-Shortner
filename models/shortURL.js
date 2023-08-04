const mongoose = require('mongoose');
const shortId = require('shortid');


const shortUrlSchema = new mongoose.Schema({

    full: {
        type: String,
        required: true
    },

    short: {
        type: String,
        
        
    
    },

    clicks: {

        type: Number,
        required: true,
        default: 0

    }

});

shortUrlSchema.pre('save', async function (next) {
    // Sprawdzamy, czy pole 'short' już jest ustawione
    if (!this.short) {
        this.short = await generateNextShort();
    }
    next();
});

// Funkcja generująca kolejny unikalny numer
async function generateNextShort() {
    
    const lastNumber = await mongoose.model('ShortUrl').countDocuments({});
    console.log(lastNumber);
    const nextNumber = lastNumber + 1;
    console.log(nextNumber.toString(36));
    return nextNumber.toString(36);
}

//funkcja ktora bedzie obliczala ile jest juz obiektow w bazie i na tej podstawie stworzy skrot

module.exports = mongoose.model('ShortUrl', shortUrlSchema); // This is the model that we will use to create new short URLs.