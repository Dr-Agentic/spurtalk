# SpurTalk Landing Page

A simple landing page for SpurTalk where users can register their interest.

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling with a blue theme
- `script.js` - Form handling and dynamic year update

## Features

- Responsive design
- Email collection form
- Feature highlights
- Clean, modern UI matching SpurTalk's theme

## Deployment on Cloudflare Pages (Free)

1. Push this folder to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to Cloudflare Dashboard
3. Go to Workers & Pages → Create application → Pages
4. Connect your Git repository
5. Set build settings:
   - Build command: (leave blank for static site)
   - Build output directory: `landing-page`
6. Save and deploy

Your site will be available at a `your-project.pages.dev` subdomain, and you can connect your custom domain `spurtalk.com` in the Pages settings.

## Custom Domain Setup

1. In Cloudflare Dashboard, go to your domain (`spurtalk.com`)
2. Ensure DNS proxy is enabled (orange cloud) for your domain
3. In Pages settings, under Custom domains, add `spurtalk.com`
4. Cloudflare will automatically configure the necessary DNS records

## Cost

- **Cloudflare Pages**: Free tier includes:
  - 500 build minutes/month
  - 100,000 requests/day
  - 100 GB bandwidth/month
  - Custom domains included
- This is more than sufficient for a simple landing page

## Theme

The landing page uses a blue color scheme (`--primary-color: #2563eb`) that can be adjusted to match your app's exact theme by modifying the CSS variables in `styles.css`.