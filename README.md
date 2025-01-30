# 🎥 Write Any Sh\*t: Your Ultimate Vlogging Web

Write any sh\*t is a simple vlogging platform that allows you to create content, manage, edit and publish your vlogs with ease. From video editing to analysis, Write any has you covered!.

## Made With Nestjs and Nextjs

<div style="display:flex;-items:center;justify-content:center;gap:40px;">
<img src="https://i.namu.wiki/i/X7RPRZJiL_bDk-b5yfaeCqEaINp3iwm7ngVhzN9LDg4hNjz0Bs3QTo7pgbCfGW3xp_sQZxMGUfnxBAXGNFwGKw.svg" width="100" />
<img src="https://www.drupal.org/files/project-images/nextjs-icon-dark-background.png" width="100" />
</div>

## 📋 Table of Contents

- [Features](#features)
- [Technologies](#tec)
- [Installation](#installation)
- [Usage](#usage)

## ✨ Features

- 📝 Intuitive post editing interface
- 📊 Advanced analytics dashboard
- 🔗 Seamless integration with popular social media platforms
- 🎨 Customizable themes and overlays
- 🔒 Secure cloud storage for your content

## 👨‍💻 Technologies

- [Mongoose](https://mongoosejs.com/)
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [ShadCN](https://github.com/shadcn)
- [Passport](http://www.passportjs.org/)
- [JWT](https://jwt.io/)
- [Redis](https://redis.io/)
- [Cloudinary](https://cloudinary.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Lodash](https://lodash.com/)

## 🚀 Installation

To get Write any up and running on your local machine, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/cartesm/was-vlog
   ```

2. Navigate to the project directory:

   ```
   cd was_vlog
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add the following variables:

     ```
     GOOGLE_CLIENT_ID = *key*
     GOOGLE_CLIENT_SECRET = *secret*
     ```

   - Cloudinary variables:
     ```
     CLOUDINARY_API_KEY =  *api key*
     CLOUDINARY_API_SECRET = *api secret*
     CLOUDINARY_CLOUD_NAME = *cloud name*
     ```
   - Opcional server variables:
     ```
     PORT = *port*  // Default = 4000
     ```
   - Client variables:
     ```
     BASE_URL = *base url of the server*
     ```

5. Start the development server:

```
npm run start:dev
```

6. Start the development client:

```
npm run dev
```

## 💻 Usage

Here's a quick guide to get you started with Write any:

1. **Login/Sign Up**: Access the platform at `http://localhost:4000/en/sign-in` and create an account or log in.

2. **Create a post**: Click on the "Write" button and write any sh\*t.

3. **Publish**: Once you're satisfied with your edit, hit "Publish" to share it with your audience.

Made with ❤️ by [Khartes](https://github.com/cartesmt)
