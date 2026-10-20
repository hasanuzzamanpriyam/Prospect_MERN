const express = require("express");
const router = express.Router();
const SystemSetting = require("../models/SystemSetting");

// GET / - Dynamic robots.txt based on brand settings (mounted at /robots.txt)
router.get("/", async (req, res) => {
  try {
    const settings = await SystemSetting.findOne({}).lean();
    
    const brandName = settings?.brandName || "PROSPCT";
    const siteUrl = settings?.metaUrl || process.env.FRONTEND_URL || "https://app.prospct.io";
    
    const robotsTxt = `# Robots.txt for ${brandName}
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /payment/
Disallow: /settings/
Disallow: /dashboard/
Disallow: /redeem
Disallow: /.env
Disallow: /.git
Disallow: /*.log
Disallow: /*.json
Disallow: /*.md
Disallow: /*.sh

# Allow static assets
Allow: /assets/
Allow: /images/
Allow: /uploads/
Allow: /favicon.ico

Sitemap: ${siteUrl}/sitemap.xml
`;

    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (err) {
    console.error("Failed to generate robots.txt:", err);
    res.set('Content-Type', 'text/plain');
    res.send(`User-agent: *
Disallow: /admin/
Disallow: /api/
Sitemap: ${process.env.FRONTEND_URL || "https://app.prospct.io"}/sitemap.xml`);
  }
});

module.exports = router;