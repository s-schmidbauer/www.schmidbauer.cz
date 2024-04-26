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

// Set CORS to all responses
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const request = await context.request;
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Max-Age', '86400');

    // MTA-STS handling
    const url = new URL(request.url);
    const { pathname, search } = url;
    const mtaVersion = "STSv1";
    const mtaMode = "testing";
    const mtaMX1 = "mail1.schmidbauer.cz"
    const mtaMX2 = "mail2.schmidbauer.cz"
    const mtaMaxAge = 604800
    const mtasts = `version: ${mtaVersion}\nmode: ${mtaMode}\nmx: ${mtaMX1}\nmx: ${mtaMX2}\nmax_age: ${mtaMaxAge}\n`;

    if (pathname === "/.well-known/mta-sts.txt") {
      return new Response(mtasts, {
        status: 200,
        headers: {
          Allow: "GET",
        },
      });
    }

    // redirect based on country in CF object
    const countryMap = {
      DE: "https://www.schmidbauer.cz/de/",
      AT: "https://www.schmidbauer.cz/de/",
      CH: "https://www.schmidbauer.cz/de/",
      CZ: "https://www.schmidbauer.cz/cz/",
    };

    // Use the cf object to obtain the country of the request
    // more on the cf object: https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
    const country = request.cf.country;
    console.log(request.cf);

    if (country != null && country in countryMap && pathname === "/en/") {
      const url = countryMap[country];
      return Response.redirect(url);
    }

  // .. or return a response
  return response;
};
