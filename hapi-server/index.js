var Hapi = require('hapi')
  , Bell = require('bell')
  , Boom = require('boom')
  , AuthCookie = require('hapi-auth-cookie')
  , HapiIO = require('hapi-io')
  , LTI = require('ims-lti')
  , Inert = require('inert')
  , Path = require('path')
;

var server = new Hapi.Server({
  debug: { request: ['error'] },
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '.')
      }
    }
  }
});

server.connection({ port: 3000 });

server.register([ Bell, AuthCookie, {register:HapiIO, options:{auth: 'wasabi-cookie'}}, Inert ], function (err) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }

  const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
  server.app.cache = cache;

  var authCookieOptions = {
    password: 'wasabi-online-encryption-password-aja', //Password used for encryption
    cookie: 'wasabi-auth', // Name of cookie to set
    isSecure: false,
    validateFunc: function(request, session, callback) {
      cache.get(session.sid, (err, cached) => {
        console.log('sid', session.sid);
        if (err)
        return callback(err, false);
        if (!cached)
        return callback(null, false);
        return callback(null, true, cached);
      });
    }
  };
  server.auth.strategy('wasabi-cookie', 'cookie', authCookieOptions);

  var bellAuthOptions = {
    provider: 'bitbucket',
    password: 'bitbucket-encryption-password-aja', //Password used for encryption
    clientId: '67YThjmgjPSdgbWfbt',//'YourAppId',
    clientSecret: 'sw4eztJQLzExskKpjfJ8HR6PFKPXkkRz',//'YourAppSecret',
    isSecure: false
  };
  server.auth.strategy('bitbucket-oauth', 'bell', bellAuthOptions);

  server.auth.default('wasabi-cookie');

  server.route([
    // socket.io client for hapi-io
    {
      method: 'GET',
      path: '/socket.io.js',
      config: {
        auth: false,
      },
      handler: {
        file: './node_modules/socket.io-client/socket.io.js'
      }
    },
    {
      method: 'GET',
      path: '/login',
      config: {
      auth: 'bitbucket-oauth',
      plugins: {
        'hapi-io': 'login'
      },
      handler: function (request, reply) {
        console.log('request', request);
        if (request.auth.isAuthenticated) {
          console.log(request.auth.credentials);
          var sid = request.auth.credentials.profile.displayName;
          request.server.app.cache.set(sid, request.auth.credentials, 0, (err) => {
            if (err)
              reply(err);
            request.cookieAuth.set({sid:sid});
            return reply('Hello ' + request.auth.credentials.profile.displayName);
          });
          return;
          // request.cookieAuth.set({id:request.auth.credentials});
          // return reply('Hello ' + request.auth.credentials.profile.displayName);
        }
        reply('Not logged in...').code(401);
        }
      }
    },
    {
      method: 'GET',
      path: '/account',
      config: {
      auth: {strategy: 'wasabi-cookie', mode: 'required'},
      plugins: {
      'hapi-io': 'account'
      },
      cors: true,
      handler: function (request, reply) {
      console.log('/account', request.auth, request.state);
      // Show the account information if the have logged in already
      // otherwise, send a 491
      reply(request.auth);
      // reply(request.auth.credentials.profile);
      }
      }
    },
      {
      method: 'GET',
      path: '/',
      config: {
        auth: {
        mode: 'try'
        },
        plugins: {
          'hapi-io': {
            event: 'app',
            post: function(ctx, next) {
            console.log('socket', ctx.socket);
            ctx.socket.emit(ctx.event, {data:ctx.data, res:ctx.result});
            next();
            }
          }
        },
        handler: function (request, reply) {
          // console.log('/', request, reply);
          // If the user is authenticated reply with their user name
          // otherwise, replay back with a generic message.
          if (request.auth.isAuthenticated) {
          return reply('welcome back ' + request.auth.credentials.profile.displayName);
          }

          reply('hello stranger!');
        }
      }
    }, 
    {
      method: 'GET',
      path: '/logout',
      config: {
        cors: true,
        auth: false,
      },
      handler: function (request, reply) {

        request.cookieAuth.clear();
        reply.redirect('/');
      }
    },
    {
      method: 'POST',
      path: '/lti-login',
      config: {
        auth: false,
      },
      handler: function (request, reply) {
        var key = request.payload.oauth_consumer_key;
        var secret = 'secret';
        console.log('hapi-ims-lti payload', key, secret);
        if (!secret || !key)
        return reply();
        var provider = new LTI.Provider(key, secret);
        provider.valid_request(request, function(err, isValid) {
          if (err)
          return reply(Boom.unauthorized(err));
          if (!isValid)
          return reply(Boom.unauthorized('Not authorized'));
          var sid =  "/"+request.payload.user_id+"/"+request.payload.oauth_consumer_key;

          request.server.app.cache.set(sid, request.payload, 0, (err) => {
            if (err)
            reply(err);
            request.cookieAuth.set({sid:sid});
            return reply('Welcome ');
          });
        });
      }
    },

    // last resort: search for files
    {
      method: 'GET',
      path: '/{param*}',
      config: {
        auth: false,
      },
      handler: {
        directory: {
          path: 'public',
          listing: true,
        }
      }
    }
    // end of server.route
  ]);

  server.start(function (err) {
    if (err) {
    console.error(err);
    return process.exit(1);
    }

    console.log('Server started at %s', server.info.uri);
  });
});