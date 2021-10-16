const registerValidation = (data) => {
  if(!data.name) return new Error('Invalid name');
  if(data.name.length < 3) return new Error('Name too short');
  if(data.name.length > 32) return new Error('Name too long');
  if(!data.password) return new Error('Invalid password');
  if(data.password.length < 6) return new Error('Password too short');
  if(!emailValidator(data.email)) return new Error('Invalid email');
  return true;
};

const loginValidation = (data) => {
  if(!data.password || data.password.length < 6) return new Error('Please provide a valid password');
  if(!emailValidator(data.email)) return new Error('Please provide a valid email');
  return true;
};

const newsValidation = (data) => {
  if(!data.category) return new Error('No category was given');
  if(data.category.length > 32) return new Error('Category too long');
  if(!data.caption) return new Error('No caption was given');
  if(!data.content) return new Error('No content was given');
  return true;
}

const newsFieldValidation = (field, value) => {
  if(field === 'category') {
    if(!value) return new Error('No category was given');
      {if(value.length > 32) return new Error('Category too long');}
  } else if(field === 'caption')
    {if(!value) return new Error('No caption was given');}
  else if(field === 'content')
    {if(!value) return new Error('No content was given');}
  else if(field === 'tags') {
    if(!value) return new Error('No tag was given');
    if(value.length > 32) return new Error('Tag too long');
  }
  else
    {return new Error(`Invalid field "${field}"`)}
  return true;
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.newsValidation = newsValidation;
module.exports.newsFieldValidation = newsFieldValidation;


const emailValidator = (email) => {
var validPattern = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
if(!email) return false
if(email.length > 254)return false
if(!validPattern.test(email))return false

// Further checking of some things regex can't handle
var parts = email.split("@");
if(parts[0].length > 64)return false

var domainParts = parts[1].split(".");
if(domainParts.some(function(part) { return part.length > 63; }))
  return false
return true;
}