import ImageKit from '@imagekit/nodejs';
import dotenv from "dotenv";

dotenv.config();


export var imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});
// export default imagekit;