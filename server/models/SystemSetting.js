// models/SystemSetting.js
const mongoose = require("mongoose");

const SystemSettingSchema = new mongoose.Schema(
  {
    googleClientId: { type: String, default: "" },
    googleClientSecret: { type: String, default: "" },
    stripeSecretKey: { type: String, default: "" },
    stripePublishableKey: { type: String, default: "" },
    maintenanceMode: { type: Boolean, default: false },
    coinPaymentsPublicKey: { type: String, default: "" },
    coinPaymentsPrivateKey: { type: String, default: "" },
    telegramBotUsername: { type: String, default: "" },
    telegramBotToken: { type: String, default: "" },
    receiverEmail: { type: String, default: "" },
    linkedinClientId: { type: String, default: "" },
    linkedinClientSecret: { type: String, default: "" },
    debounceApi: { type: String, default: "" },
    payProGlobalEncryptionKey: { type: String, default: "" },
    payProGlobalIV: { type: String, default: "" },
    heleketMerchantId: { type: String, default: "" },
    heleketPaymentApiUrl: { type: String, default: "" },

    // SMTP (email delivery) settings
    smtpHost: { type: String, default: process.env.SMTP_HOST || "" },
    smtpPort: { type: Number, default: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587 },
    smtpSecure: { type: Boolean, default: process.env.SMTP_SECURE === "true" },
    smtpUser: { type: String, default: process.env.SMTP_USER || "" },
    smtpPass: { type: String, default: process.env.SMTP_PASS || "" },
    smtpFrom: {
      type: String,
      default:
        process.env.SMTP_FROM ||
        (process.env.SMTP_USER ? `"Prospct" <${process.env.SMTP_USER}>` : ""),
    },

    // Custom UI text values (editable via admin panel)
    loginHeroStat: { type: String, default: "200,00+" },
    loginSwiperSlides: {
      type: [
        {
          quote: { type: String, default: "" },
          name: { type: String, default: "" },
          title: { type: String, default: "" },
          image: { type: String, default: "" },
        },
      ],
      default: [],
    },

    // arr of payment methods with title and image for checkout
    paymentMethods: {
      type: [
        {
          title: { type: String, required: true },
          src: { type: String, required: true },
          disabled: { type: Boolean, default: false },
        },
      ],
      default: [
        {
          title: "Credit/Debit Card (alternative)",
          src: "/images/payment-method/Visa-Mastercard.webp",
          disabled: false,
        },
        {
          title: "Pay Pro Global",
          src: "/images/payment-method/payproglobal.jfif",
          disabled: false,
        },
        {
          title: "Heleket",
          src: "/images/payment-method/heleket.png",
          disabled: false,
        },
        {
          title: "Fast Spring",
          src: "/images/payment-method/fast-spring.png",
          disabled: false,
        },
      ],
    },

    // Keep this for backward compatibility
    paymentCardOrder: { type: [String], default: [] },

    // Payment redirect mode: controls how payment gateways open
    // Values: "same-tab" (default), "new-tab", "popup"
    paymentRedirectMode: {
      type: String,
      enum: ["same-tab", "new-tab", "popup"],
      default: "same-tab",
    },

    // Brand Identity (editable via admin panel)
    brandName: { type: String, default: "PROSPCT" },
    brandTagline: { type: String, default: "B2B Prospect Intelligence Platform" },
    brandLogoUrl: { type: String, default: "/images/logo.png" },
    brandFaviconUrl: { type: String, default: "/favicon.ico" },
    brandPrimaryColor: { type: String, default: "#7c3aed" }, // purple-600
    brandSecondaryColor: { type: String, default: "#06b6d4" }, // cyan-500
    brandFontFamily: { type: String, default: "Inter" },
    brandLogoLightUrl: { type: String, default: "/images/logo-light.png" },
    brandLogoDarkUrl: { type: String, default: "/images/logo-dark.png" },
    copyrightText: { type: String, default: "Built with ❤️ by the PROSPCT Team" },
    metaTitle: { type: String, default: "PROSPCT - B2B Prospect Intelligence Platform" },
    metaDescription: { type: String, default: "Comprehensive B2B prospect intelligence platform with advanced search, team collaboration, and payment integrations." },
    ogImageUrl: { type: String, default: "/images/og-image.png" },
    twitterHandle: { type: String, default: "@prospct" },
    supportEmail: { type: String, default: "support@prospct.io" },
    privacyPolicyUrl: { type: String, default: "/privacy" },
    termsOfServiceUrl: { type: String, default: "/terms" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SystemSetting", SystemSettingSchema);
