import ImageKit from '@imagekit/nodejs';

export var imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: "private_yQMuDRF8gbn2yUoOxkrM6KfenRU=",
  urlEndpoint: process.env.URL_ENDPOINT,
});
// export default imagekit;