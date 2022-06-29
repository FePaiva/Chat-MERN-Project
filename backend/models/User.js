const mongoose = require('mongoose'); 

// to validate the email
const {isEmail} = require('validator');

const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name can't be blank."]
  },
  email: {
    type: String, 
    lowercase: true,
    unique: true,
    required: [true, "Email can't be blank."],
    index: true,
    validate: [isEmail, "Invalid email address."],
  },
  password: {
    type: String,
    required: [true, "Password can't be blank."]
  },
  picture: {
      type: String,
    },
    newMessages: {
      type: Object,
      default: {}
    },
    status: {
      type: String,
      default: 'online'
    }
    // minimize so we can have the empty objects.
}, {minimize: false});

// to hide(hash) the password before user is saved
UserSchema.pre('save', function (next){
  const user = this;
  if(!user.isModified('password')) 
  return next();

  bcrypt.genSalt(10, function(err, salt){
    if(err) 
    return next(err);

    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);

      user.password = hash
      next();
    })
  })
})

// to not send users password back
UserSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({email});
  if(!user) throw new Error('Invalid email or password.');

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new Error('Invalid email or password.')
  return user
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
