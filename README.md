## Lazy Image Loading
A small app to lazy and progressive load images in React.js

### How does it work?
The app requires an array of image items (store them locally or pull them from an API) as argument, which contains image URLs. On the first load the image downloads the first image immediately and requests further images to store in the browser cache. Once the image slideshow starts and during the slideshow if the threshold limit hits and only fewer images are left for the slideshow, the library requests for more images. Simple!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

