/**
 *
 * @param url - URL of the image to be downloaded
 * @return Returns an img tag with source tag set and image loaded in the background
 */
// const loadImage = (url) => {
//   let image = new Image();
//   image.src= url;
//   return image;
// };

/**
 *
 * @param url - URL of the image to be downloaded
 * @return Returns a promise, if resolved returns the image
 */
const loadImage = url => {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = error => {
      reject(new Error(error));
    };
    image.src = url;
  });
};

export { loadImage };
