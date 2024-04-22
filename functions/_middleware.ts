// Respond to OPTIONS method
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
};

// Set CORS to all /api responses
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
};

// redirect default fetch based on country
export default {
  async fetch(request) {
    /**
     * A map of the URLs to redirect to
     * @param {Object} countryMap
     */
    const countryMap = {
      DE: "https://www.schmidbauer.cz/de/",
      AT: "https://www.schmidbauer.cz/de/",
      CH: "https://www.schmidbauer.cz/de/",
      CZ: "https://www.schmidbauer.cz/cz/",
    };

    // Use the cf object to obtain the country of the request
    // more on the cf object: https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
    const country = request.cf.country;

    if (country != null && country in countryMap) {
      const url = countryMap[country];
      return Response.redirect(url);
    } else {
      return fetch(request);
    }
  },
} satisfies ExportedHandler;
