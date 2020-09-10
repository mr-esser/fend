const app = require('./js/app');

const PORT = 8080;
app.listen(PORT, function() {
  console.log(`NLP app listening on port ${PORT}`);
  console.log(`App working dir is '${__dirname}'`);
  // Note(!): env is prepared by the app module
  console.log(`MeaningCloud API key is ${process.env.API_KEY}`);
});
