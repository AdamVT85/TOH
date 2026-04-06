import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import { parseString } from 'set-cookie-parser';
import { config as config$1, singleton, fields, collection } from '@keystatic/core';

function makeHandler(_config) {
  return async function keystaticAPIRoute(context) {
    var _context$locals, _ref, _config$clientId, _ref2, _config$clientSecret, _ref3, _config$secret;
    const envVarsForCf = (_context$locals = context.locals) === null || _context$locals === void 0 || (_context$locals = _context$locals.runtime) === null || _context$locals === void 0 ? void 0 : _context$locals.env;
    const handler = makeGenericAPIRouteHandler({
      ..._config,
      clientId: (_ref = (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_ID) !== null && _ref !== void 0 ? _ref : tryOrUndefined(() => {
        return process.env.KEYSTATIC_GITHUB_CLIENT_ID;
      }),
      clientSecret: (_ref2 = (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_SECRET) !== null && _ref2 !== void 0 ? _ref2 : tryOrUndefined(() => {
        return process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
      }),
      secret: (_ref3 = (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_SECRET) !== null && _ref3 !== void 0 ? _ref3 : tryOrUndefined(() => {
        return process.env.KEYSTATIC_SECRET;
      })
    }, {
      slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG"
    });
    const {
      body,
      headers,
      status
    } = await handler(context.request);
    let headersInADifferentStructure = /* @__PURE__ */ new Map();
    if (headers) {
      if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key.toLowerCase())) {
            headersInADifferentStructure.set(key.toLowerCase(), []);
          }
          headersInADifferentStructure.get(key.toLowerCase()).push(value);
        }
      } else if (typeof headers.entries === "function") {
        for (const [key, value] of headers.entries()) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
        if ("getSetCookie" in headers && typeof headers.getSetCookie === "function") {
          const setCookieHeaders2 = headers.getSetCookie();
          if (setCookieHeaders2 !== null && setCookieHeaders2 !== void 0 && setCookieHeaders2.length) {
            headersInADifferentStructure.set("set-cookie", setCookieHeaders2);
          }
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
      }
    }
    const setCookieHeaders = headersInADifferentStructure.get("set-cookie");
    headersInADifferentStructure.delete("set-cookie");
    if (setCookieHeaders) {
      for (const setCookieValue of setCookieHeaders) {
        var _options$sameSite;
        const {
          name,
          value,
          ...options
        } = parseString(setCookieValue);
        const sameSite = (_options$sameSite = options.sameSite) === null || _options$sameSite === void 0 ? void 0 : _options$sameSite.toLowerCase();
        context.cookies.set(name, value, {
          domain: options.domain,
          expires: options.expires,
          httpOnly: options.httpOnly,
          maxAge: options.maxAge,
          path: options.path,
          sameSite: sameSite === "lax" || sameSite === "strict" || sameSite === "none" ? sameSite : void 0
        });
      }
    }
    return new Response(body, {
      status,
      headers: [...headersInADifferentStructure.entries()].flatMap(([key, val]) => val.map((x) => [key, x]))
    });
  };
}
function tryOrUndefined(fn) {
  try {
    return fn();
  } catch {
    return void 0;
  }
}

const config = config$1({
  storage: process.env.NODE_ENV === "production" ? { kind: "github", repo: "AdamVT85/TOH" } : { kind: "local" },
  collections: {
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "src/content/articles/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        subtitle: fields.text({ label: "Subtitle / Tagline" }),
        seriesLabel: fields.text({
          label: "Series Label (optional)",
          description: 'e.g. "Part of: The Golden Age of Travel"'
        }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/articles",
          publicPath: "/src/assets/articles/"
        }),
        heroImageAlt: fields.text({ label: "Hero Image Alt Text" }),
        publishDate: fields.date({ label: "Publish Date" }),
        updatedDate: fields.date({ label: "Last Updated" }),
        excerpt: fields.text({
          label: "Excerpt / Meta Description",
          multiline: true,
          description: "Used for SEO meta description and article cards. Max 160 characters."
        }),
        watchList: fields.array(
          fields.object({
            title: fields.text({ label: "Film Title" }),
            year: fields.text({ label: "Year" }),
            image: fields.image({
              label: "Poster Image",
              directory: "src/assets/articles",
              publicPath: "/src/assets/articles/"
            })
          }),
          {
            label: "Watch List (sidebar)",
            description: "Films to watch before reading. Optional.",
            itemLabel: (props) => props.fields.title.value
          }
        ),
        relatedStars: fields.array(
          fields.relationship({ label: "Related Star", collection: "starGuides" }),
          { label: "Related Star Guides" }
        ),
        relatedVenues: fields.array(
          fields.relationship({ label: "Related Venue", collection: "venues" }),
          { label: "Related Venues" }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: "Related Article", collection: "articles" }),
          { label: "Related Articles" }
        ),
        body: fields.markdoc({
          label: "Article Body",
          options: {
            image: {
              directory: "src/assets/articles",
              publicPath: "/src/assets/articles/"
            }
          }
        })
      }
    }),
    starGuides: collection({
      label: "Star Guides",
      slugField: "name",
      path: "src/content/star-guides/*",
      format: { contentField: "body" },
      schema: {
        name: fields.slug({ name: { label: "Star Name" } }),
        nickname: fields.text({
          label: "Nickname / Tagline",
          description: `e.g. "The World's Most Beautiful Animal"`
        }),
        birthYear: fields.integer({ label: "Birth Year" }),
        deathYear: fields.integer({ label: "Death Year" }),
        portraitImage: fields.image({
          label: "Portrait Image",
          directory: "src/assets/stars",
          publicPath: "/src/assets/stars/"
        }),
        heroImage: fields.image({
          label: "Hero Background Image",
          directory: "src/assets/stars",
          publicPath: "/src/assets/stars/"
        }),
        excerpt: fields.text({ label: "Excerpt / Meta Description", multiline: true }),
        publishDate: fields.date({ label: "Publish Date" }),
        updatedDate: fields.date({ label: "Last Updated" }),
        keyFilms: fields.array(
          fields.object({
            title: fields.text({ label: "Film Title" }),
            year: fields.text({ label: "Year" })
          }),
          {
            label: "Key Films",
            itemLabel: (props) => props.fields.title.value
          }
        ),
        keyDestinations: fields.array(fields.text({ label: "Destination" }), {
          label: "Key Destinations (for map pins)"
        }),
        relatedStars: fields.array(
          fields.relationship({ label: "Related Star", collection: "starGuides" }),
          { label: "Related Star Guides" }
        ),
        relatedVenues: fields.array(
          fields.relationship({ label: "Related Venue", collection: "venues" }),
          { label: "Featured Venues" }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: "Related Article", collection: "articles" }),
          { label: "Related Articles" }
        ),
        body: fields.markdoc({
          label: "Guide Body",
          options: {
            image: {
              directory: "src/assets/stars",
              publicPath: "/src/assets/stars/"
            }
          }
        })
      }
    }),
    venues: collection({
      label: "Venues",
      slugField: "name",
      path: "src/content/venues/*",
      format: { contentField: "story" },
      schema: {
        name: fields.slug({ name: { label: "Venue Name" } }),
        locationLine: fields.text({ label: "Address Line" }),
        venueType: fields.select({
          label: "Venue Type",
          options: [
            { label: "Hotel", value: "Hotel" },
            { label: "Restaurant", value: "Restaurant" },
            { label: "Bar", value: "Bar" },
            { label: "Museum", value: "Museum" },
            { label: "Theatre", value: "Theatre" },
            { label: "Landmark", value: "Landmark" },
            { label: "Beach", value: "Beach" },
            { label: "Casino", value: "Casino" },
            { label: "Cemetery", value: "Cemetery" },
            { label: "Studio", value: "Studio" },
            { label: "Other", value: "Other" }
          ],
          defaultValue: "Hotel"
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Open", value: "Open" },
            { label: "Seasonal", value: "Seasonal" },
            { label: "Members Only", value: "Members Only" },
            { label: "Closed", value: "Closed" },
            { label: "Demolished", value: "Demolished" }
          ],
          defaultValue: "Open"
        }),
        established: fields.text({ label: "Year Established" }),
        cityCountry: fields.text({ label: "City, Country" }),
        priceIndicator: fields.select({
          label: "Price Level",
          options: [
            { label: "$ Budget", value: "$" },
            { label: "$$ Mid-range", value: "$$" },
            { label: "$$$ Luxury", value: "$$$" }
          ],
          defaultValue: "$$"
        }),
        hollywoodRating: fields.integer({
          label: "Old Hollywood Rating (1-5)",
          description: "5 = Central to Hollywood history, 1 = Minor connection",
          validation: { min: 1, max: 5 }
        }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/venues",
          publicPath: "/src/assets/venues/"
        }),
        heroImageAlt: fields.text({ label: "Hero Image Alt Text" }),
        excerpt: fields.text({ label: "Excerpt / Meta Description", multiline: true }),
        pullQuote: fields.text({
          label: "Pull Quote (optional)",
          multiline: true
        }),
        pullQuoteAttribution: fields.text({ label: "Quote Attribution" }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Image",
              directory: "src/assets/venues",
              publicPath: "/src/assets/venues/"
            }),
            caption: fields.text({ label: "Caption" }),
            credit: fields.text({ label: "Credit" })
          }),
          {
            label: "Image Gallery",
            itemLabel: (props) => props.fields.caption.value
          }
        ),
        whoCameHere: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            starGuideSlug: fields.text({
              label: "Star Guide Slug (optional)",
              description: "If this star has a guide, enter the slug for linking."
            })
          }),
          {
            label: "Famous Guests",
            itemLabel: (props) => props.fields.name.value
          }
        ),
        asSeenIn: fields.array(
          fields.object({
            title: fields.text({ label: "Film/Show Title" }),
            year: fields.text({ label: "Year" }),
            filmLocationsSlug: fields.text({ label: "Film Locations Page Slug (optional)" })
          }),
          {
            label: "As Seen In",
            itemLabel: (props) => props.fields.title.value
          }
        ),
        signatureExperiences: fields.array(
          fields.object({
            name: fields.text({ label: "Experience Name" }),
            description: fields.text({ label: "Description", multiline: true }),
            price: fields.text({ label: "Price (optional)" }),
            availability: fields.text({ label: "Availability Note (optional)" }),
            image: fields.image({
              label: "Image (optional)",
              directory: "src/assets/venues",
              publicPath: "/src/assets/venues/"
            })
          }),
          {
            label: "Signature Experiences",
            itemLabel: (props) => props.fields.name.value
          }
        ),
        website: fields.url({ label: "Website URL" }),
        phone: fields.text({ label: "Phone Number" }),
        openingHours: fields.text({ label: "Opening Hours", multiline: true }),
        priceRange: fields.text({ label: "Price Range Detail" }),
        howToBook: fields.text({ label: "How to Book" }),
        nearestAirport: fields.text({ label: "Nearest Airport" }),
        transportNotes: fields.text({ label: "Transport Notes", multiline: true }),
        dressCode: fields.text({ label: "Dress Code" }),
        bestTimeToVisit: fields.text({ label: "Best Time to Visit" }),
        accessibilityNotes: fields.text({ label: "Accessibility Notes" }),
        tips: fields.text({ label: "Tips", multiline: true }),
        bookingUrl: fields.url({ label: "Booking/Affiliate URL" }),
        bookingCtaText: fields.text({ label: "Booking CTA Text" }),
        whatsThereNow: fields.text({ label: "What's There Now (for closed venues)", multiline: true }),
        visitInsteadName: fields.text({ label: "Visit Instead: Venue Name" }),
        visitInsteadSlug: fields.text({ label: "Visit Instead: Venue Slug" }),
        visitInsteadDescription: fields.text({ label: "Visit Instead: Description" }),
        nearbyVenues: fields.array(
          fields.object({
            name: fields.text({ label: "Venue Name" }),
            venueSlug: fields.text({ label: "Venue Slug (for linking)" }),
            venueType: fields.text({ label: "Venue Type" }),
            distance: fields.text({ label: "Distance/Travel Time" }),
            image: fields.image({
              label: "Thumbnail Image",
              directory: "src/assets/venues",
              publicPath: "/src/assets/venues/"
            })
          }),
          {
            label: "Nearby Venues",
            itemLabel: (props) => props.fields.name.value
          }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: "Related Article", collection: "articles" }),
          { label: "Related Articles" }
        ),
        story: fields.markdoc({
          label: "The Story",
          options: {
            image: {
              directory: "src/assets/venues",
              publicPath: "/src/assets/venues/"
            }
          }
        })
      }
    }),
    filmLocations: collection({
      label: "Film Location Guides",
      slugField: "filmTitle",
      path: "src/content/film-locations/*",
      format: { contentField: "introduction" },
      schema: {
        filmTitle: fields.slug({ name: { label: "Film Title" } }),
        subtitle: fields.text({ label: "Subtitle" }),
        year: fields.text({ label: "Year" }),
        director: fields.text({ label: "Director" }),
        stars: fields.text({ label: "Stars (comma separated)" }),
        primaryLocations: fields.text({ label: "Primary Filming Locations (comma separated)" }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/film-locations",
          publicPath: "/src/assets/film-locations/"
        }),
        heroImageAlt: fields.text({ label: "Hero Image Alt Text" }),
        excerpt: fields.text({ label: "Excerpt / Meta Description", multiline: true }),
        publishDate: fields.date({ label: "Publish Date" }),
        updatedDate: fields.date({ label: "Last Updated" }),
        locations: fields.array(
          fields.object({
            name: fields.text({ label: "Location Name" }),
            locationType: fields.select({
              label: "Location Type",
              options: [
                { label: "Hotel", value: "Hotel" },
                { label: "Restaurant", value: "Restaurant" },
                { label: "Beach", value: "Beach" },
                { label: "Village", value: "Village" },
                { label: "Landmark", value: "Landmark" },
                { label: "Villa", value: "Villa" },
                { label: "Street/Square", value: "Street" },
                { label: "Harbour", value: "Harbour" },
                { label: "Viewpoint", value: "Viewpoint" },
                { label: "Church", value: "Church" },
                { label: "Market", value: "Market" },
                { label: "Other", value: "Other" }
              ],
              defaultValue: "Landmark"
            }),
            filmContext: fields.text({ label: "Film Context", multiline: true }),
            image: fields.image({
              label: "Location Photo",
              directory: "src/assets/film-locations",
              publicPath: "/src/assets/film-locations/"
            }),
            imageCaption: fields.text({ label: "Image Caption" }),
            visitStatus: fields.text({ label: "Status (open/private/demolished)" }),
            address: fields.text({ label: "Address" }),
            openingHours: fields.text({ label: "Opening Hours (if applicable)" }),
            cost: fields.text({ label: "Cost (if applicable)" }),
            tips: fields.text({ label: "Tips", multiline: true }),
            venueSlug: fields.text({ label: "Venue Page Slug (optional)" })
          }),
          {
            label: "Filming Locations",
            itemLabel: (props) => props.fields.name.value
          }
        ),
        itinerary: fields.object(
          {
            routeDescription: fields.text({ label: "Route Description", multiline: true }),
            travelMode: fields.select({
              label: "Travel Mode",
              options: [
                { label: "Walking", value: "walking" },
                { label: "Driving", value: "driving" },
                { label: "Public Transport", value: "transit" },
                { label: "Mixed", value: "mixed" }
              ],
              defaultValue: "driving"
            })
          },
          { label: "Suggested Itinerary (optional)" }
        ),
        whereToStay: fields.array(
          fields.object({
            name: fields.text({ label: "Hotel Name" }),
            description: fields.text({ label: "One-line Description" }),
            price: fields.text({ label: "Price Indication" }),
            hollywoodConnection: fields.text({ label: "Old Hollywood Connection (optional)" }),
            venueSlug: fields.text({ label: "Venue Page Slug (optional)" }),
            image: fields.image({
              label: "Image",
              directory: "src/assets/film-locations",
              publicPath: "/src/assets/film-locations/"
            })
          }),
          {
            label: "Where to Stay",
            itemLabel: (props) => props.fields.name.value
          }
        ),
        relatedStars: fields.array(
          fields.relationship({ label: "Related Star", collection: "starGuides" }),
          { label: "Related Star Guides" }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: "Related Article", collection: "articles" }),
          { label: "Related Articles" }
        ),
        introduction: fields.markdoc({
          label: "Introduction",
          options: {
            image: {
              directory: "src/assets/film-locations",
              publicPath: "/src/assets/film-locations/"
            }
          }
        })
      }
    }),
    destinations: collection({
      label: "Destination Guides",
      slugField: "title",
      path: "src/content/destinations/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        country: fields.text({ label: "Country" }),
        region: fields.text({ label: "Region / Subheading" }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/destinations",
          publicPath: "/src/assets/destinations/"
        }),
        heroImageAlt: fields.text({ label: "Hero Image Alt Text" }),
        excerpt: fields.text({ label: "Excerpt / Meta Description", multiline: true }),
        publishDate: fields.date({ label: "Publish Date" }),
        updatedDate: fields.date({ label: "Last Updated" }),
        passportStamps: fields.array(
          fields.object({
            city: fields.text({ label: "City Name" }),
            detail: fields.text({ label: "Detail Line" }),
            date: fields.text({ label: "Date" })
          }),
          {
            label: "Passport Stamps (decorative)",
            itemLabel: (props) => props.fields.city.value
          }
        ),
        featuredVenues: fields.array(
          fields.relationship({ label: "Featured Venue", collection: "venues" }),
          { label: "Featured Venues" }
        ),
        relatedStars: fields.array(
          fields.relationship({ label: "Related Star", collection: "starGuides" }),
          { label: "Related Star Guides" }
        ),
        relatedFilmLocations: fields.array(
          fields.relationship({ label: "Related Film Locations", collection: "filmLocations" }),
          { label: "Related Film Location Guides" }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: "Related Article", collection: "articles" }),
          { label: "Related Articles" }
        ),
        body: fields.markdoc({
          label: "Guide Body",
          options: {
            image: {
              directory: "src/assets/destinations",
              publicPath: "/src/assets/destinations/"
            }
          }
        })
      }
    })
  },
  singletons: {
    homepage: singleton({
      label: "Homepage",
      path: "src/content/homepage",
      schema: {
        headline: fields.text({ label: "Main Headline" }),
        subheadline: fields.text({ label: "Subheadline" }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets",
          publicPath: "/src/assets/"
        }),
        featuredDestinations: fields.array(
          fields.object({
            titleTop: fields.text({ label: "Title Top Line" }),
            titleBottom: fields.text({ label: "Title Bottom Line" }),
            image: fields.image({
              label: "Destination Image",
              directory: "src/assets",
              publicPath: "/src/assets/"
            }),
            text: fields.text({ label: "Description" }),
            linkUrl: fields.text({ label: "Link URL" })
          }),
          {
            label: "Featured Destinations",
            itemLabel: (props) => props.fields.titleBottom.value
          }
        )
      }
    }),
    siteSettings: singleton({
      label: "Site Settings",
      path: "src/content/site-settings",
      schema: {
        siteTitle: fields.text({ label: "Site Title" }),
        siteDescription: fields.text({ label: "Site Description (meta)", multiline: true }),
        socialLinks: fields.object({
          instagram: fields.url({ label: "Instagram URL" }),
          twitter: fields.url({ label: "Twitter/X URL" }),
          pinterest: fields.url({ label: "Pinterest URL" }),
          email: fields.text({ label: "Contact Email" })
        }),
        footerText: fields.text({ label: "Footer Copyright Text" })
      }
    })
  }
});

const all = makeHandler({ config });
const ALL = all;

const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  all,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
