const Clarifai = require('clarifai');

// Clarifai API KEY
const app = new Clarifai.App({
    apiKey: 'ed86610058d64cb98b284de57f40f0ae'
});

const handleApiCall = () => (req, res) => {
    if (req.body.input.length > 20) {
        app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
            .then(data => res.json(data))
            .catch(() => res.status(400).json('Unable to work with API.'));
    } else {
        res.status(400).json('Invalid image url. Unable to work with API.');
    }
}

const handleImage = (db) => (req, res) => {
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
}

module.exports = {
    handleApiCall: handleApiCall,
    handleImage: handleImage
}