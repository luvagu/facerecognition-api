const handleProfile = (db) => (req, res) => {
    const { id } = req.params;
    //let found = false;
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
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // });
    // if (!found) {
    //     res.status(400).json('No such user.')
    // }
}

export default handleProfile;