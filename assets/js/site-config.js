/* =========================================================
   SITE CONFIG — single source of truth for clinic metadata.
   Update here, propagates to JS (WhatsApp links, etc.).
   Page-level HTML (footer, contact) duplicates these values
   for SEO/no-JS resilience; keep them in sync if updated.
   ========================================================= */

window.SITE_CONFIG = {
  name: "Ritvikk's Tooth Clinic",
  doctor: "Dr. Deepika Mod",
  phone: "+91 90160 71487",
  phoneRaw: "+919016071487",
  whatsapp: "919016071487",
  email: "contact@ritvikkstoothclinic.com", // TODO: confirm with clinic
  address: {
    line1: "9 Royal Millenium Complex",
    line2: "6 Royal Park, Off University Road",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360005",
    country: "India"
  },
  hours: {
    weekdays: "Mon–Sat: 10:00 AM – 6:00 PM",
    sunday: "Sunday: Closed"
  },
  mapsUrl: "https://maps.google.com/?q=Ritvikk+Tooth+Clinic+Rajkot",
  mapsEmbedSrc: "https://www.google.com/maps?q=Ritvikk+Tooth+Clinic+Rajkot&output=embed",
  instagram: "https://www.instagram.com/deepika_mod",
  googleReviewsUrl: "" // TODO: paste Google Business Profile review URL
};
