const mongoose = require('mongoose');
const villageSchema = new mongoose.Schema({
  villageName: {
    type: String,
    required: true,  
  },
  region: {
    type: String,
    required: true,
  },
  landArea: {
    type: Number,  
    required: true,
  },
  latitude: {
    type: Number,  
    required: true,  
  },
  longitude: {
    type: Number,  
    required: true,
  },
  uploadImage: {
    type: String,  
    required: false,  
  },
  categories: {
    type: [String],  
    required: true,
  },
});


const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
