# MITIN USA

MITIN Trading’s wholesale catalog brings together Japanese KitKat editions, High Up sparkling waters, BTS Coffee inquiries, and packaged ramen. Ramen lives in the Products menu. The original catalog includes thirteen KitKat entries, thirteen sparkling waters and nine ramen images. The last ramen image shows a collection of Samyang Buldak packages.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open [the local home page](http://127.0.0.1:8000/). Use Ctrl+C in the terminal to stop the server. The HTML, CSS, JavaScript and images in `public/` are ready to serve. Local preview requires no package installation or build command.

## Explore the site

- Open a package on Home, in the moving product strip or in the catalog to see its photo and verified details. Use the inquiry button to carry the selected item into Contact.
- Open the MITIN Trading company artwork on Home, choose **View All Items**, and select a category. Dialogs also close with Escape.
- Use the Products page to search the catalog and filter by collection. Each collection also has its own page.
- The BTS Coffee page offers an inquiry route. The original public coffee page supplied no product names, specifications or packaging images.
- See [the progress log](PROGRESS.md) for numbered checkpoints and [the asset inventory](ASSET-SOURCES.md) for the original image URLs.

## Maintain the catalog

1. Place an authorized, optimized product photo in `public/assets/`. Preserve its aspect ratio. Keep transparency for packages photographed on a transparent background.
2. Append a record to `window.products` in `public/catalog.js`. Supply a unique stable `id`, the verified product `name`, a `category` of `kitkat`, `water`, `coffee` or `ramen`, and an `image` path relative to `public/`. Add `flavor` and `size` when verified on the source listing or packaging. The stable ID also identifies the item in inquiry links.
3. To replace a photo, update its file or point the existing record to the new file. Record its source in `ASSET-SOURCES.md`. `window.brandAssets` in the same catalog file holds the original logo, company artwork, About photograph and KitKat collage.
4. Refresh the local catalog, search for the item, open its details, and follow its inquiry link.

Update the business name, location, customer service address and Faire storefront in `public/company.js`. Shared navigation, page copy and interactions live in `public/app.js`. Edit the eight page titles and descriptions in `scripts/pages.mjs` and run `node scripts/pages.mjs` from the repository root to regenerate those HTML files. Shared typography, category colors, page layouts, focus styles and motion live in `public/site.css`.

## Connect form delivery

The original site uses Wix-hosted contact and subscription features. Production mail delivery, subscriber storage and chat administration require MITIN’s authorized services. MITIN’s verified direct contact is customerservice@mitinusa.com and its wholesale storefront is [MITIN on Faire](https://mitin.faire.com).

Configure `contactEndpoint` and `newsletterEndpoint` separately in `public/company.js`. Each value should be the public URL of a receiver authorized for that form. The receiver must accept a JSON POST using the form’s named fields, validate the data and deliver or securely queue the submission. Respond with a 2xx status after acceptance and a non-2xx status for errors. For a receiver on a different origin, configure CORS for the site origin, POST and the Content-Type header. Keep mail and newsletter service credentials on the server. Verify delivery using a designated test mailbox or list before enabling either service for visitors.

## Deploy from GitHub after approval

Use GitHub to version the source. For public commercial hosting, a static host such as Cloudflare Pages can publish this repository’s `public/` directory directly. GitHub restricts use of its free Pages hosting for running online businesses and sites primarily facilitating commercial transactions. MITIN’s wholesale inquiry catalog should use a host and plan suitable for its business. [GitHub Pages usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

1. Review the local changes and approve the release commit, target branch and audience before pushing. Connecting a host to a branch can trigger deployments on every subsequent push.
2. In the approved hosting account, create a Pages project connected to the MITIN GitHub repository. Select only the intended release branch. Use the repository root, no framework preset, a blank build command and `public` as the output directory. If the host requires a command, enter `exit 0`. [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
3. Inspect the host-provided URL before connecting an existing domain. Check each page, package image, form path, mobile menu and keyboard interaction. Restrict preview access in the hosting account when a review must stay private.
4. For an authorized domain cutover, record the existing Wix DNS targets for rollback. Add the intended hostname to the Pages project under **Custom domains**, then follow the provider’s instructions for that exact hostname. For an externally managed `www` subdomain this usually means a CNAME to the project’s Pages hostname. An apex domain requires additional DNS configuration. Preserve unrelated records, particularly mail records. Confirm certificate activation, both hostname variants and redirects before completing the cutover. [Custom domain setup](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Local verification

Run `node scripts/check.mjs` to validate the original inventory, images and eight route documents. Update the baseline counts when intentionally changing the assortment. The local browser review tested 390, 768, 1024, 1440 and 1920 pixel viewports. Screenshots are in `qa/`. Contact inquiries open a prefilled email draft unless a receiver is configured. Delivery, subscription and live chat require the appropriate service configuration before launch.

For an approved public release, run `node scripts/deployment-seo.mjs https://YOUR-APPROVED-HOST/` with the final HTTPS base URL, including any repository subdirectory. This creates the sitemap and replaces the preview robots exclusion. Review historical Wix URL redirects before a domain cutover, especially the old /ramen Home URL and /team-4 Ramen catalog URL.

The Home scene uses the original product photos with CSS perspective. Change its featured product IDs in `public/showcase.js` and its visual treatment in `public/home.css`. The drink display frames a single can from each original lineup; update its crop if changing those photos. Catalog and editorial page styles are in `public/catalog-style.css` and `public/editorial.css`. After changing JS or CSS, run `node scripts/pages.mjs` to refresh versioned asset URLs for cached browsers.
