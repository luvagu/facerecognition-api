const handleProfile = (db) => (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            //console.log(user);
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('User not found.');
            }
        })
        .catch(() => res.status(400).json('Error fetching user.'));
}

module.exports = {
    handleProfile: handleProfile
}