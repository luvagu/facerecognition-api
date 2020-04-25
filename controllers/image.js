import Clarifai from 'clarifai';

// Clarifai API KEY
const app = new Clarifai.App({
    apiKey: 'ed86610058d64cb98b284de57f40f0ae'
});

export const handleApiCall = () => (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(() => res.status(400).json('Unable to work with API.'));
}

export const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            //console.log(entries);
            if (entries.length) {
                res.json(entries);
            } else {
                res.status(400).json('Unable to fetch user rank.');
            }
        })
        .catch(() => res.status(400).json('Unable to fetch user rank.'));

    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // });
    // if (!found) {
    //     res.status(400).json('No such user.')
    // }
}

export default { handleApiCall, handleImage };
