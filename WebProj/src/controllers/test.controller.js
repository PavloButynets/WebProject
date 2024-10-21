const getTest = (req, res) => {
    console.log('Token is valid');
    res.json({ message: "Token is valid, access granted!" });
}
module.exports = getTest;