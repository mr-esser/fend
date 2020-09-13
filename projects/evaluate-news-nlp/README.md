# About

This is a small web application that can be used to perform a simple sentiment analysis on arbitrary English web documents.

Simply launch the app and bring up the website in your browser. Then, enter a valid URL in the **Document URL** field and press **Analyse** to trigger the analysis. Once complete, the analysis results will appear directly below the input area. Depending on the size of the document you provided, this may take a few seconds. Pop-ups on the result table headers explain the meanings of the values shown.

Internally, the app relies on [MeaningCloud](http:/www.meaningcloud.com)'s NLP offering for the document analysis. So, you will need to sign up for a free API key before using the app.

# Local Setup

1. Install a recent version of Node (>= v14.4.0) and NPM (>= 6.14.8).
2. Install the necessary dependencies by running `npm install`.
3. Sign up for a free API key at [MeaningCloud](https:/www.meaningcloud.com).
4. In the project root folder, create a file `.env` with this line in it: `API_KEY=<YourAPIKey>`.
5. Build the server by running `npm run build-prod`.
6. Start up the server with `npm run start`.
7. Verify that the server is up and running by checking Node's console log. It should mention both, the port (**8080** by default) and the API key you provided.
8. In your browser, navigate to `localhost:8080` to access the web frontend. Prefer a recent version of Google's Chrome.

# Troubleshooting

If anything goes wrong behind the scenes, the frontend will alert you by showing an - admittedly very general - error message. In most cases, the error is either due to the app backend being down, or the URL being inaccessible or pointing to a non-English document.

If none of the above reasons are to blame, take a look at the server console log for more detailed hints as to what went wrong.

Generally, articles from [The Guardian](https://www.theguardian.com) have proven to play nice with MeaningCloud's service. So, they can be considered a good starting point for bug-hunting.

# Development

- The frontend can be served in dev mode by running `npm run build-dev`.
  The dev server is configured to listen on **port 9000** per default and will properly interact with the production backend, if it is running.
- Linting (JS only): `npm run lint`.
- Unit testing: `npm run test`.
- Integration testing: `npm run itest`.
  **Run sparingly! This will consume API credits!**
