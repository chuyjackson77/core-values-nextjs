# Deployment Guide: assessment.youdoyou.boo

This guide covers deploying the Core Values Assessment to production at `assessment.youdoyou.boo`.

## 🚀 Quick Deploy to Vercel (Recommended for Next.js)

### Prerequisites
- GitHub repository with latest code merged to `main`
- Vercel account (free tier works)
- Access to DNS settings for `youdoyou.boo` domain

### Step 1: Deploy to Vercel

**Option A: Vercel Dashboard** (Easiest)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository: `chuyjackson77/core-values-nextjs`
5. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
   - **Output Directory:** .next
6. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /path/to/core-values-nextjs
vercel --prod
```

### Step 2: Add Custom Domain

1. In Vercel project settings, go to "Domains"
2. Click "Add Domain"
3. Enter: `assessment.youdoyou.boo`
4. Vercel will provide DNS configuration instructions

### Step 3: Configure DNS

**If using Cloudflare, Namecheap, or similar:**

Add a CNAME record:
```
Type:  CNAME
Name:  assessment
Value: cname.vercel-dns.com
TTL:   Auto or 3600
```

**If DNS is with your domain registrar:**

1. Go to DNS settings for `youdoyou.boo`
2. Add CNAME record:
   - Host: `assessment`
   - Points to: `cname.vercel-dns.com`
   - TTL: Automatic

### Step 4: Verify SSL

Vercel automatically provisions SSL certificates. Within 24 hours (usually minutes):
- `https://assessment.youdoyou.boo` will be live
- HTTP automatically redirects to HTTPS

---

## 🔧 Alternative: Deploy to Netlify

### Step 1: Connect Repository

1. Go to [https://netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select: `chuyjackson77/core-values-nextjs`
5. Configure:
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
6. Click "Deploy site"

### Step 2: Add Custom Domain

1. Go to "Domain management"
2. Click "Add custom domain"
3. Enter: `assessment.youdoyou.boo`
4. Follow DNS configuration instructions

---

## 📋 Environment Variables (If Needed)

If you have environment variables (API keys, etc.), set them in your hosting platform:

**Vercel:**
- Settings → Environment Variables

**Netlify:**
- Site settings → Build & deploy → Environment

Common variables for this app:
```
RESEND_API_KEY=your_key_here
```

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All code merged to `main` branch
- [ ] Tests passing (`npm run build` succeeds locally)
- [ ] No console errors in production build
- [ ] Environment variables configured (if any)
- [ ] DNS records ready to update
- [ ] Email functionality tested (Resend API)

---

## 🧪 Testing Production Deployment

After deployment:

1. **Visit the URL:**
   ```
   https://assessment.youdoyou.boo
   ```

2. **Complete Full Assessment:**
   - Select 2-3 categories
   - Complete all rounds
   - Check results screen shows:
     - Win rates
     - Confidence intervals
     - "Backed by Science" badge
   - Verify methodology link works

3. **Check Browser Console:**
   - Should see scientific logging
   - No errors

4. **Test on Multiple Devices:**
   - Desktop
   - Mobile
   - Tablet

5. **Verify Email Functionality:**
   - Submit profile with email
   - Check email delivery

---

## 🔒 Security Headers

The `vercel.json` file includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

These protect against common web vulnerabilities.

---

## 📊 Monitoring

### Vercel Analytics (Recommended)

Enable in Vercel dashboard:
- Go to "Analytics" tab
- Enable Web Analytics
- Track page views, performance, etc.

### Custom Monitoring

Add Google Analytics or similar:
1. Create GA4 property
2. Add tracking code to `app/layout.tsx`
3. Monitor user behavior and assessment completion rates

---

## 🚨 Rollback Procedure

If issues occur in production:

**Vercel:**
1. Go to "Deployments"
2. Find last working deployment
3. Click "⋯" → "Promote to Production"

**Netlify:**
1. Go to "Deploys"
2. Find last working deployment
3. Click "Publish deploy"

**Git:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

---

## 🔄 Continuous Deployment

Both Vercel and Netlify support automatic deployments:

**Every push to `main`:**
- Automatically builds and deploys
- Preview deployments for pull requests
- Instant rollbacks available

**Disable auto-deploy (if needed):**
- Vercel: Settings → Git → Disable auto-deployment
- Netlify: Site settings → Build & deploy → Stop builds

---

## 📞 Support

**Vercel Support:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**Netlify Support:**
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com

**DNS Issues:**
- Use https://dnschecker.org to verify propagation
- CNAME records can take 1-48 hours to propagate

---

## 🎯 Production URL

Once deployed and DNS configured:
```
https://assessment.youdoyou.boo
```

**Expected behavior:**
- ✅ HTTPS with valid SSL certificate
- ✅ Fast load times (Next.js optimized)
- ✅ Scientific scoring system active
- ✅ Multiple category selection working
- ✅ Results with win rates and confidence intervals
- ✅ "Backed by Science" badge visible
- ✅ Professional appearance for paid clients

---

## 📈 Performance Targets

**Lighthouse Scores (aim for):**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

**Load Times:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total Page Size: < 500KB

---

## ✅ Post-Deployment Verification

After going live, verify:

1. **Functionality:**
   - [ ] Assessment completes successfully
   - [ ] All 6 categories appear
   - [ ] Category selection (1-3) works
   - [ ] Scientific scoring produces results
   - [ ] Results show metrics correctly
   - [ ] Email submission works

2. **Performance:**
   - [ ] Pages load quickly
   - [ ] No console errors
   - [ ] Mobile responsive
   - [ ] Images optimized

3. **SEO:**
   - [ ] Meta tags present
   - [ ] Open Graph tags working
   - [ ] robots.txt accessible
   - [ ] sitemap.xml generated

4. **Security:**
   - [ ] HTTPS working
   - [ ] Security headers present
   - [ ] No mixed content warnings

---

**Your assessment is ready for production! 🚀**
