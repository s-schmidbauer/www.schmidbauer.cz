var src_default = {
  async fetch(request, env, ctx) {
    try {
      const now = Date.now();
      const clientIP = request.headers.get('CF-Connecting-IP');

      const output = `{ "time": "${now}", "clientIP": "${clientIP}", "asn": "${request.cf.asn}", "country": "${request.cf.country}", "region": "${request.cf.region}", "city": "${request.cf.city}", "tlsCipher": "${request.cf.tlsCipher}", "tlsVersion": "${request.cf.tlsVersion}" }`;

      return new Response(output, { status: 200 });
    } catch (err) {
      console.error(`returned error: ${err}`);
      return new Response(err, { status: 500 });
    }
  }
};
export {
  src_default as default
};
