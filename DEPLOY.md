# Railway Deployment Guide

## 1. Prepare for Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mgnrega-tn.git
   git push -u origin main
   ```

## 2. Deploy to Railway

1. **Go to [Railway.app](https://railway.app/)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**

## 3. Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```
PORT=5000
API_KEY=579b464db66ec23bdd000001a58bd96e288649437367e8b6c365fea3
API_URL=https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722
```

## 4. Database Setup

Railway will automatically detect SQLite. Your `mgnrega.db` file will be included in deployment.

## 5. Build Process

Railway will automatically:
1. Run `npm run build` (installs dependencies + builds React)
2. Run `npm start` (starts the server)
3. Serve your app on a public URL

## 6. Access Your App

After deployment, Railway provides a public URL like:
`https://your-app-name.railway.app`

## 7. Custom Domain (Optional)

In Railway dashboard:
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

- **Build fails**: Check logs in Railway dashboard
- **Database issues**: Ensure `mgnrega.db` is in server folder
- **Environment variables**: Double-check all variables are set

Your MGNREGA Tamil Nadu dashboard will be live and accessible worldwide!