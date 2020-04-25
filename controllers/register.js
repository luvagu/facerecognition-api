const handleResgister = (db, bcryptjs) => (req, res) => {
    const { name, email, password } = req.body;
    // validate for empty values
    if (!name || !email || !password) {
        return res.status(400).json('Incorrect form submition.');
    }
    // password storage with bcrypt-nodejs
    // bcrypt.hash(password, null, null, function (err, hash) {
    //     console.log('bcrypt', hash);
    // }); // Async bcrypt-nodejs method hash - library is deprecated, use for test purposes
    // password storage with bcryptjs
    // Sync method
    // const salt = bcryptjs.genSaltSync(10);
    // const hash = bcryptjs.hashSync(password, salt);
    bcryptjs.hash(password, 10, function (err, hash) {
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            name: name,
                            email: loginEmail[0],
                            joined: new Date()
                        })
                        .then(user => {
                            res.json(user[0])
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
            .catch(() => res.status(400).json('Unable to register.'));
        //.catch((err) => res.status(400).json(err)) // it returns info about our db;
    }); // Async bcryptjs method hash - library replacement for bcrypt-nodejs

    // db('login').insert({
    //     name: name,
    //     email: email
    // });
    // database.users.push(
    //     {
    //         id: '125',
    //         name: name,
    //         email: email,
    //         //password: password,
    //         entries: 0,
    //         joined: new Date()
    //     }
    // );
};

export default handleResgister;