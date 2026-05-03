import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: process.env.NODE_ENV === 'production'
    ? { kind: 'github', repo: 'AdamVT85/TOH' }
    : { kind: 'local' },

  collections: {
    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'src/content/articles/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ label: 'Subtitle / Tagline' }),
        seriesLabel: fields.text({
          label: 'Series Label (optional)',
          description: 'e.g. "Part of: The Golden Age of Travel"',
        }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/articles',
          publicPath: '/images/articles/',
        }),
        heroImageAlt: fields.text({ label: 'Hero Image Alt Text' }),
        publishDate: fields.date({ label: 'Publish Date' }),
        updatedDate: fields.date({ label: 'Last Updated' }),
        excerpt: fields.text({
          label: 'Excerpt / Meta Description',
          multiline: true,
          description: 'Used for SEO meta description and article cards. Max 160 characters.',
        }),
        watchList: fields.array(
          fields.object({
            title: fields.text({ label: 'Film Title' }),
            year: fields.text({ label: 'Year' }),
            image: fields.image({
              label: 'Poster Image',
              directory: 'public/images/articles',
              publicPath: '/images/articles/',
            }),
          }),
          {
            label: 'Watch List (sidebar)',
            description: 'Films to watch before reading. Optional.',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            venueSlug: fields.text({
              label: 'Venue Slug (optional)',
              description: 'If this section links to a venue page, enter the slug.',
            }),
            image: fields.image({
              label: 'Section Image',
              directory: 'public/images/articles',
              publicPath: '/images/articles/',
            }),
            imageAlt: fields.text({ label: 'Image Alt Text' }),
            caption: fields.text({ label: 'Image Caption' }),
            copy: fields.text({
              label: 'Body Copy',
              multiline: true,
              description: 'Main text for this section. Separate paragraphs with blank lines.',
            }),
            callout: fields.text({
              label: 'Pull Quote / Callout (optional)',
              multiline: true,
              description: 'An optional highlighted quote or callout for this section.',
            }),
          }),
          {
            label: 'Article Sections',
            itemLabel: (props) => props.fields.heading.value || 'New Section',
          }
        ),
        destinationTags: fields.array(
          fields.text({ label: 'Destination' }),
          { label: 'Destination Tags' }
        ),
        relatedStars: fields.array(
          fields.relationship({ label: 'Related Star', collection: 'starGuides' }),
          { label: 'Related Star Guides' }
        ),
        relatedVenues: fields.array(
          fields.relationship({ label: 'Related Venue', collection: 'venues' }),
          { label: 'Related Venues' }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: 'Related Article', collection: 'articles' }),
          { label: 'Related Articles' }
        ),
      },
    }),

    starGuides: collection({
      label: 'Star Guides',
      slugField: 'name',
      path: 'src/content/star-guides/*',
      schema: {
        name: fields.slug({ name: { label: 'Star Name' } }),
        nickname: fields.text({
          label: 'Nickname / Tagline',
          description: 'e.g. "The World\'s Most Beautiful Animal"',
        }),
        birthYear: fields.integer({ label: 'Birth Year' }),
        deathYear: fields.integer({ label: 'Death Year' }),
        portraitImage: fields.image({
          label: 'Portrait Image',
          directory: 'public/images/stars',
          publicPath: '/images/stars/',
        }),
        heroImage: fields.image({
          label: 'Hero Background Image',
          directory: 'public/images/stars',
          publicPath: '/images/stars/',
        }),
        excerpt: fields.text({ label: 'Excerpt / Meta Description', multiline: true }),
        publishDate: fields.date({ label: 'Publish Date' }),
        updatedDate: fields.date({ label: 'Last Updated' }),
        keyFilms: fields.array(
          fields.object({
            title: fields.text({ label: 'Film Title' }),
            year: fields.text({ label: 'Year' }),
          }),
          {
            label: 'Key Films',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        keyDestinations: fields.array(fields.text({ label: 'Destination' }), {
          label: 'Key Destinations (for map pins)',
        }),
        relatedStars: fields.array(
          fields.relationship({ label: 'Related Star', collection: 'starGuides' }),
          { label: 'Related Star Guides' }
        ),
        relatedVenues: fields.array(
          fields.relationship({ label: 'Related Venue', collection: 'venues' }),
          { label: 'Featured Venues' }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: 'Related Article', collection: 'articles' }),
          { label: 'Related Articles' }
        ),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            image: fields.image({
              label: 'Section Image',
              directory: 'public/images/stars',
              publicPath: '/images/stars/',
            }),
            imageAlt: fields.text({ label: 'Image Alt Text' }),
            caption: fields.text({ label: 'Image Caption' }),
            copy: fields.text({
              label: 'Body Copy',
              multiline: true,
              description: 'Main text for this section. Separate paragraphs with blank lines.',
            }),
            callout: fields.text({
              label: 'Pull Quote / Callout (optional)',
              multiline: true,
            }),
          }),
          {
            label: 'Guide Sections',
            itemLabel: (props) => props.fields.heading.value || 'New Section',
          }
        ),
      },
    }),

    venues: collection({
      label: 'Venues',
      slugField: 'name',
      path: 'src/content/venues/*',
      schema: {
        name: fields.slug({ name: { label: 'Venue Name' } }),
        locationLine: fields.text({ label: 'Address Line' }),
        venueType: fields.select({
          label: 'Venue Type',
          options: [
            { label: 'Hotel', value: 'Hotel' },
            { label: 'Restaurant', value: 'Restaurant' },
            { label: 'Bar', value: 'Bar' },
            { label: 'Museum', value: 'Museum' },
            { label: 'Theatre', value: 'Theatre' },
            { label: 'Landmark', value: 'Landmark' },
            { label: 'Beach', value: 'Beach' },
            { label: 'Casino', value: 'Casino' },
            { label: 'Cemetery', value: 'Cemetery' },
            { label: 'Studio', value: 'Studio' },
            { label: 'Other', value: 'Other' },
          ],
          defaultValue: 'Hotel',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Open', value: 'Open' },
            { label: 'Seasonal', value: 'Seasonal' },
            { label: 'Members Only', value: 'Members Only' },
            { label: 'Closed', value: 'Closed' },
            { label: 'Demolished', value: 'Demolished' },
          ],
          defaultValue: 'Open',
        }),
        established: fields.text({ label: 'Year Established' }),
        cityCountry: fields.text({ label: 'City, Country' }),
        priceIndicator: fields.select({
          label: 'Price Level',
          options: [
            { label: '$ Budget', value: '$' },
            { label: '$$ Mid-range', value: '$$' },
            { label: '$$$ Luxury', value: '$$$' },
          ],
          defaultValue: '$$',
        }),
        hollywoodRating: fields.integer({
          label: 'Old Hollywood Rating (1-5)',
          description: '5 = Central to Hollywood history, 1 = Minor connection',
          validation: { min: 1, max: 5 },
        }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/venues',
          publicPath: '/images/venues/',
        }),
        heroImageAlt: fields.text({ label: 'Hero Image Alt Text' }),
        excerpt: fields.text({ label: 'Excerpt / Meta Description', multiline: true }),
        pullQuote: fields.text({
          label: 'Pull Quote (optional)',
          multiline: true,
        }),
        pullQuoteAttribution: fields.text({ label: 'Quote Attribution' }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'public/images/venues',
              publicPath: '/images/venues/',
            }),
            caption: fields.text({ label: 'Caption' }),
            credit: fields.text({ label: 'Credit' }),
          }),
          {
            label: 'Image Gallery',
            itemLabel: (props) => props.fields.caption.value,
          }
        ),
        whoCameHere: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            starGuideSlug: fields.text({
              label: 'Star Guide Slug (optional)',
              description: 'If this star has a guide, enter the slug for linking.',
            }),
          }),
          {
            label: 'Famous Guests',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
        asSeenIn: fields.array(
          fields.object({
            title: fields.text({ label: 'Film/Show Title' }),
            year: fields.text({ label: 'Year' }),
            filmLocationsSlug: fields.text({ label: 'Film Locations Page Slug (optional)' }),
          }),
          {
            label: 'As Seen In',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        signatureExperiences: fields.array(
          fields.object({
            name: fields.text({ label: 'Experience Name' }),
            description: fields.text({ label: 'Description', multiline: true }),
            price: fields.text({ label: 'Price (optional)' }),
            availability: fields.text({ label: 'Availability Note (optional)' }),
            image: fields.image({
              label: 'Image (optional)',
              directory: 'public/images/venues',
              publicPath: '/images/venues/',
            }),
          }),
          {
            label: 'Signature Experiences',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
        website: fields.url({ label: 'Website URL' }),
        phone: fields.text({ label: 'Phone Number' }),
        openingHours: fields.text({ label: 'Opening Hours', multiline: true }),
        priceRange: fields.text({ label: 'Price Range Detail' }),
        howToBook: fields.text({ label: 'How to Book' }),
        nearestAirport: fields.text({ label: 'Nearest Airport' }),
        transportNotes: fields.text({ label: 'Transport Notes', multiline: true }),
        dressCode: fields.text({ label: 'Dress Code' }),
        bestTimeToVisit: fields.text({ label: 'Best Time to Visit' }),
        accessibilityNotes: fields.text({ label: 'Accessibility Notes' }),
        tips: fields.text({ label: 'Tips', multiline: true }),
        bookingUrl: fields.url({ label: 'Booking/Affiliate URL' }),
        bookingCtaText: fields.text({ label: 'Booking CTA Text' }),
        whatsThereNow: fields.text({ label: "What's There Now (for closed venues)", multiline: true }),
        visitInsteadName: fields.text({ label: 'Visit Instead: Venue Name' }),
        visitInsteadSlug: fields.text({ label: 'Visit Instead: Venue Slug' }),
        visitInsteadDescription: fields.text({ label: 'Visit Instead: Description' }),
        nearbyVenues: fields.array(
          fields.object({
            name: fields.text({ label: 'Venue Name' }),
            venueSlug: fields.text({ label: 'Venue Slug (for linking)' }),
            venueType: fields.text({ label: 'Venue Type' }),
            distance: fields.text({ label: 'Distance/Travel Time' }),
            image: fields.image({
              label: 'Thumbnail Image',
              directory: 'public/images/venues',
              publicPath: '/images/venues/',
            }),
          }),
          {
            label: 'Nearby Venues',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: 'Related Article', collection: 'articles' }),
          { label: 'Related Articles' }
        ),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            image: fields.image({
              label: 'Section Image',
              directory: 'public/images/venues',
              publicPath: '/images/venues/',
            }),
            imageAlt: fields.text({ label: 'Image Alt Text' }),
            caption: fields.text({ label: 'Image Caption' }),
            copy: fields.text({
              label: 'Body Copy',
              multiline: true,
              description: 'Main text for this section. Separate paragraphs with blank lines.',
            }),
            callout: fields.text({
              label: 'Pull Quote / Callout (optional)',
              multiline: true,
            }),
          }),
          {
            label: 'Story Sections',
            itemLabel: (props) => props.fields.heading.value || 'New Section',
          }
        ),
      },
    }),

    filmLocations: collection({
      label: 'Film Location Guides',
      slugField: 'filmTitle',
      path: 'src/content/film-locations/*',
      format: { contentField: 'introduction' },
      schema: {
        filmTitle: fields.slug({ name: { label: 'Film Title' } }),
        subtitle: fields.text({ label: 'Subtitle' }),
        year: fields.text({ label: 'Year' }),
        director: fields.text({ label: 'Director' }),
        stars: fields.text({ label: 'Stars (comma separated)' }),
        primaryLocations: fields.text({ label: 'Primary Filming Locations (comma separated)' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/film-locations',
          publicPath: '/images/film-locations/',
        }),
        heroImageAlt: fields.text({ label: 'Hero Image Alt Text' }),
        excerpt: fields.text({ label: 'Excerpt / Meta Description', multiline: true }),
        publishDate: fields.date({ label: 'Publish Date' }),
        updatedDate: fields.date({ label: 'Last Updated' }),
        locations: fields.array(
          fields.object({
            name: fields.text({ label: 'Location Name' }),
            locationType: fields.select({
              label: 'Location Type',
              options: [
                { label: 'Hotel', value: 'Hotel' },
                { label: 'Restaurant', value: 'Restaurant' },
                { label: 'Beach', value: 'Beach' },
                { label: 'Village', value: 'Village' },
                { label: 'Landmark', value: 'Landmark' },
                { label: 'Villa', value: 'Villa' },
                { label: 'Street/Square', value: 'Street' },
                { label: 'Harbour', value: 'Harbour' },
                { label: 'Viewpoint', value: 'Viewpoint' },
                { label: 'Church', value: 'Church' },
                { label: 'Market', value: 'Market' },
                { label: 'Other', value: 'Other' },
              ],
              defaultValue: 'Landmark',
            }),
            filmContext: fields.text({ label: 'Film Context', multiline: true }),
            image: fields.image({
              label: 'Location Photo',
              directory: 'public/images/film-locations',
              publicPath: '/images/film-locations/',
            }),
            imageCaption: fields.text({ label: 'Image Caption' }),
            visitStatus: fields.text({ label: 'Status (open/private/demolished)' }),
            address: fields.text({ label: 'Address' }),
            openingHours: fields.text({ label: 'Opening Hours (if applicable)' }),
            cost: fields.text({ label: 'Cost (if applicable)' }),
            tips: fields.text({ label: 'Tips', multiline: true }),
            venueSlug: fields.text({ label: 'Venue Page Slug (optional)' }),
          }),
          {
            label: 'Filming Locations',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
        itinerary: fields.object(
          {
            routeDescription: fields.text({ label: 'Route Description', multiline: true }),
            travelMode: fields.select({
              label: 'Travel Mode',
              options: [
                { label: 'Walking', value: 'walking' },
                { label: 'Driving', value: 'driving' },
                { label: 'Public Transport', value: 'transit' },
                { label: 'Mixed', value: 'mixed' },
              ],
              defaultValue: 'driving',
            }),
          },
          { label: 'Suggested Itinerary (optional)' }
        ),
        whereToStay: fields.array(
          fields.object({
            name: fields.text({ label: 'Hotel Name' }),
            description: fields.text({ label: 'One-line Description' }),
            price: fields.text({ label: 'Price Indication' }),
            hollywoodConnection: fields.text({ label: 'Old Hollywood Connection (optional)' }),
            venueSlug: fields.text({ label: 'Venue Page Slug (optional)' }),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/film-locations',
              publicPath: '/images/film-locations/',
            }),
          }),
          {
            label: 'Where to Stay',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
        relatedStars: fields.array(
          fields.relationship({ label: 'Related Star', collection: 'starGuides' }),
          { label: 'Related Star Guides' }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: 'Related Article', collection: 'articles' }),
          { label: 'Related Articles' }
        ),
        introduction: fields.markdoc({
          label: 'Introduction',
          options: {
            image: {
              directory: 'public/images/film-locations',
              publicPath: '/images/film-locations/',
            },
          },
        }),
      },
    }),

    destinations: collection({
      label: 'Destination Guides',
      slugField: 'title',
      path: 'src/content/destinations/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        country: fields.text({ label: 'Country' }),
        region: fields.text({ label: 'Region / Subheading' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/destinations',
          publicPath: '/images/destinations/',
        }),
        heroImageAlt: fields.text({ label: 'Hero Image Alt Text' }),
        excerpt: fields.text({ label: 'Excerpt / Meta Description', multiline: true }),
        publishDate: fields.date({ label: 'Publish Date' }),
        updatedDate: fields.date({ label: 'Last Updated' }),
        passportStamps: fields.array(
          fields.object({
            city: fields.text({ label: 'City Name' }),
            detail: fields.text({ label: 'Detail Line' }),
            date: fields.text({ label: 'Date' }),
          }),
          {
            label: 'Passport Stamps (decorative)',
            itemLabel: (props) => props.fields.city.value,
          }
        ),
        featuredVenues: fields.array(
          fields.relationship({ label: 'Featured Venue', collection: 'venues' }),
          { label: 'Featured Venues' }
        ),
        relatedStars: fields.array(
          fields.relationship({ label: 'Related Star', collection: 'starGuides' }),
          { label: 'Related Star Guides' }
        ),
        relatedFilmLocations: fields.array(
          fields.relationship({ label: 'Related Film Locations', collection: 'filmLocations' }),
          { label: 'Related Film Location Guides' }
        ),
        relatedArticles: fields.array(
          fields.relationship({ label: 'Related Article', collection: 'articles' }),
          { label: 'Related Articles' }
        ),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            image: fields.image({
              label: 'Section Image',
              directory: 'public/images/destinations',
              publicPath: '/images/destinations/',
            }),
            imageAlt: fields.text({ label: 'Image Alt Text' }),
            caption: fields.text({ label: 'Image Caption' }),
            copy: fields.text({
              label: 'Body Copy',
              multiline: true,
              description: 'Main text for this section. Separate paragraphs with blank lines.',
            }),
            callout: fields.text({
              label: 'Pull Quote / Callout (optional)',
              multiline: true,
            }),
          }),
          {
            label: 'Guide Sections',
            itemLabel: (props) => props.fields.heading.value || 'New Section',
          }
        ),
      },
    }),
  },

  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/homepage',
      schema: {
        headline: fields.text({ label: 'Main Headline' }),
        subheadline: fields.text({ label: 'Subheadline' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        featuredDestinations: fields.array(
          fields.object({
            titleTop: fields.text({ label: 'Title Top Line' }),
            titleBottom: fields.text({ label: 'Title Bottom Line' }),
            image: fields.image({
              label: 'Destination Image',
              directory: 'public/images',
              publicPath: '/images/',
            }),
            text: fields.text({ label: 'Description' }),
            linkUrl: fields.text({ label: 'Link URL' }),
            ctaText: fields.text({
              label: 'CTA Button Text',
              description: "Text shown on the button. Defaults to 'BOOK NOW' if blank.",
            }),
          }),
          {
            label: 'Featured Destinations',
            itemLabel: (props) => props.fields.titleBottom.value,
          }
        ),
      },
    }),

    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/site-settings',
      schema: {
        siteTitle: fields.text({ label: 'Site Title' }),
        siteDescription: fields.text({ label: 'Site Description (meta)', multiline: true }),
        socialLinks: fields.object({
          instagram: fields.url({ label: 'Instagram URL' }),
          twitter: fields.url({ label: 'Twitter/X URL' }),
          pinterest: fields.url({ label: 'Pinterest URL' }),
          email: fields.text({ label: 'Contact Email' }),
        }),
        footerText: fields.text({ label: 'Footer Copyright Text' }),
      },
    }),
  },
});
