function invalidCredentials(email, password, name, street, pincode, city) {
  return (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 8 ||
    !name ||
    name.trim() === "" ||
    !street ||
    street.trim() === "" ||
    !pincode ||
    pincode.trim().length !== 6 ||
    !city ||
    city.trim() === ""
  );
}

module.exports = invalidCredentials;
