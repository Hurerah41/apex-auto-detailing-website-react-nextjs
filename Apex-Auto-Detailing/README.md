# Apex Auto Detailing

Next.js App Router conversion of the original Apex Auto Detailing page. The page copy and section markup remain in `content/site.html`; the bundled stylesheets are served from `public/css` in their original load order. Fonts, images, and videos are local under `public`.

## Run locally

```powershell
npm install
npm run dev
```

For a production build and server:

```powershell
npm run build
npm start
```

## Contact configuration

Set verified values in `lib/contact-config.js`:

- `whatsapp`: country code plus digits, without a leading `+`. The contact form opens a prefilled WhatsApp message when configured.
- `phone`: phone number used by the footer contact link.
- `mapsUrl`: verified Google Maps location URL.
- `mapEmbedUrl`: verified embeddable map URL for the contact section.
- `instagramUrl` and `facebookUrl`: verified social profile URLs.

Until `mapEmbedUrl` is set, the map shows a search for Apex Auto Detailing in Karachi rather than asserting an unverified street address. The form is frontend-only; it does not store or transmit inquiries until the user sends its prepared WhatsApp message.

The displayed prices retain the source's sample-pricing labels. The three review cards use the customer text supplied for this page; no aggregate rating has been added. Photos and videos remain reference assets, not claims of Apex work.

## Source files

- Page copy and section markup: `content/site.html`
- Section components and React interactions: `components/`
- Stylesheets, in load order: `public/css/fonts.css`, `public/vendor/bootstrap.min.css`, `public/css/custom.css`, `public/css/responsive.css`, `public/css/loader.css`, `public/css/apex.css`
- Local fonts and media: `public/fonts/` and `public/media/`
- Configurable contact values: `lib/contact-config.js`