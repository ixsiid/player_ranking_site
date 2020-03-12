const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 10523;

express()
    .use(express.static(path.join(__dirname, 'docs')))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
