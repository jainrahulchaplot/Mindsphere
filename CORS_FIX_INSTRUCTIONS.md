# 🚨 CORS Error Fix for Production

## **The Problem**
Your production backend on Railway is not configured with the correct CORS origins, causing requests from your frontend to be blocked.

## **🔧 Solution Steps**

### **1. Update Railway Environment Variables**

Go to your Railway dashboard → Variables tab and add/update:

```env
# CORS Configuration - Add your actual frontend URL
CORS_ALLOWED_ORIGINS=https://your-actual-frontend-url.vercel.app,https://your-actual-frontend-url.netlify.app

# Alternative: Use FRONTEND_ORIGIN (single URL)
FRONTEND_ORIGIN=https://your-actual-frontend-url.vercel.app

# Ensure production mode
NODE_ENV=production
```

### **2. Find Your Frontend URL**

Your frontend is likely deployed on:
- **Vercel**: `https://your-app-name.vercel.app`
- **Netlify**: `https://your-app-name.netlify.app`
- **Custom domain**: `https://yourdomain.com`

### **3. Test the Fix**

After updating Railway variables:

1. **Redeploy** your Railway backend (or it will auto-redeploy)
2. **Test** your frontend - CORS errors should be gone
3. **Check logs** in Railway dashboard for CORS configuration

### **4. Debug CORS Issues**

If still having issues, check:

```bash
# Test CORS from your frontend domain
curl -H "Origin: https://your-frontend-url.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS \
     https://mindsphere-production-fc81.up.railway.app/api/v1/health
```

## **🎯 Quick Fix**

**Most likely solution**: Add this to your Railway environment variables:

```env
CORS_ALLOWED_ORIGINS=https://mindsphere.vercel.app,https://mindsphere.netlify.app,https://mindsphere-app.vercel.app
```

Replace with your actual frontend URL!

## **🔍 Verification**

After updating, check Railway logs for:
```
🌍 CORS Origins: ['https://your-frontend-url.vercel.app']
🌍 Environment: production
```

This confirms CORS is properly configured.
