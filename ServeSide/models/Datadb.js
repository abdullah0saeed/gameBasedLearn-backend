const mongoose = require('mongoose');

const Data = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Parent' // Reference to the parent document
  },
  gradeNo: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true
  },
  definitionInAc: {
    type: String,
    required: false,
    trim: true
  },
  definitionInEn: {
    type: String,
    required: false,
    trim: true
  },
  sentence: {
    type: String,
    required: false,
    trim: true
  },
  numbers: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields to the document
});

module.exports = mongoose.model('Data', Data);


