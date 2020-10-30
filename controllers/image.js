const Clarifai = require('clarifai');

// Clarifai API KEY
const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

const handleApiCall = () => (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(() => res.status(400).json('Unable to work with API.'));
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