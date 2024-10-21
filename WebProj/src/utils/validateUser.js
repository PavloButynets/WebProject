const validateUser = (username, password) => {
    const validUsername = typeof username === "string" && username.trim() !== "" && username.trim().length > 2 && username.trim().length < 50;
    const validPassword =
      typeof password === "string" && password.trim().length >= 6;
  
    return validUsername && validPassword;
  };
  
  module.exports = validateUser;