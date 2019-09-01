
export default function(fastify: any, _opts: any, done: any) {
  fastify

  function requestVerify (request, options, next) {

    let token;
    if (request.headers && request.headers.authorization) {
      const parts = request.headers.authorization.split(" ");
      if (parts.length === 2) {
        const scheme = parts[0];
        token = parts[1];

        if (!/^Bearer$/i.test(scheme)) {
          return ;
        }
      } else {
        return ;
      }
    } else {
      return ;
    }

  }
  done();
}
