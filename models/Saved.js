var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var SavedSchema = new Schema({
 link: {
    type: String
  },
  headline: {
    type: String
  }
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;
