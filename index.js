#!/home/pi/.nvm/versions/node/v6.4.0/bin/node
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var sockjs = require('sockjs');
var zerorpc = require('zerorpc');
var bodyParser = require('body-parser');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new(winston.transports.File)({filename: '/usr/bin/thermostat/thermostat.log'})
    ]
});

var status = 'https://api.particle.io/v1/devices/240020000b47353235303037/status?access_token=effedec05de7182739f864e78b5c630af947f93c';

var pkey = fs.readFileSync('/usr/bin/thermostat/key.pem');
var pcert = fs.readFileSync('/usr/bin/thermostat/cert.pem');

var options = {
    key: pkey,
    cert: pcert
};

client = new zerorpc.Client();
try {
    logger.info('Starting RCP connection');
    client.connect("tcp://127.0.0.1:4242");
} catch(err) {
    console.error(err);
    setTimeout(function() {
        client.connect("tcp://127.0.0.1:4242");
    }, 60000);
}

client.on('error', function(error) {
    logger.error('RPC client error: ' + error);
    console.error('RPC client error: ', error);
});

var server = express();
server.use(express.static(__dirname));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.post('/temp', function(req, res) {
    try {
        client.invoke('setPreferredTemp', req.body.temp, function(err, response, more) {
            if(err) {
                try {
                    res.status(err.status || 500);
                    res.render('error', {
                        'status': 500, 
                        'error': err, 
                        'message': err.message
                    });
                    logger.error(err);
                    console.error(err);
                } catch(error) {
                    logger.error('Unable to render resposne: ' + error)
                    console.error('Unable to render response: ', error);
                }
            } else {
                res.json({'status': 200});
            }
        });
    } catch(err) {
        res.status(500);
        res.render('error', {
            'status': 500,
            'error': 'CommunicationError',
            'message': 'Unable to make a connection to server'
        });
        logger.error(err);
        console.error(err);
    }
});

server.get('/temp', function(req, res) {
    try {
        client.invoke('getPreferredTemp', function(err, response, more) {
            if(err) {
                try {
                    res.status(err.status || 500);
                    res.render('error', {
                        'status': 500, 
                        'error': err, 
                        'message': err.message
                    });
                    logger.error(err);
                    console.error(err);
                } catch(error) {
                    logger.error('Unable to render response: ' + error);
                    console.error('Unable to render response: ', error);
                }
            } else {
                res.json({"status": 200, "temp": response});
            }
        });
    } catch(err) {
        res.status(500);
        res.render('error', {
            'status': 500,
            'error': 'CommunicationError',
            'message': 'Unable to make a connection to server'
        });
        logger.error(err);
        console.error(err);
    }
});

server.post('/mode', function(req, res) {
    try {
        client.invoke('setTempMode', req.body.mode, function(err, response, more) {
            if(err) {
                try {
                    res.status(err.status || 500);
                    res.render('error', {
                        'status': 500, 
                        'error': err, 
                        'message': err.message
                    });
                    logger.error(err);
                    console.error(err);
                } catch(error) {
                    logger.error('Unable to render response: ' + error);
                    console.error('Unable to render response: ', error);
                }
            } else {
                res.json({'status': 200});
            }
        });
    } catch(err) {
        res.status(500);
        res.render('error', {
            'status': 500,
            'error': 'CommunicationError',
            'message': 'Unable to make a connection to server'
        });
        logger.error(err);
        console.error(err);
    }
});

server.get('/mode', function(req, res) {
    try {
        client.invoke('getTempMode', function(err, response, more) {
            if(err) {
                try {
                    res.status(err.status || 500);
                    res.render('error', {
                        'status': 500, 
                        'error': err, 
                        'message': err.message
                    });
                    logger.error(err);
                    console.error(err);
                } catch(error) {
                    logger.error('Unable to render response: ' + error);
                    console.error('Unable to render response: ', error);
                }
            } else {
                res.json({"status": 200, "mode": response});
            }
        });
    } catch(err) {
        res.status(500);
        res.render('error', {
            'status': 500,
            'error': 'CommunicationError',
            'message': 'Unable to make a connection to server'
        });
        logger.error(err);
        console.error(err);
    }
});

server.get('/currentTemp', function(req, res) {
    try {
        client.invoke('getCurrTemp', function(err, response, more) {
            if(err) {
                try {
                    res.status(err.status || 500);
                    res.render('error', {
                        'status': 500,
                        'error': err,
                        'message': err.message
                    });
                    logger.error(err);
                    console.error(err);
                } catch(error) {
                    logger.error('Unable to render response: ' + error);
                    console.error('Unable to render response: ', error);
                }
            } else {
                res.json({'status': 200, 'currentTemp': response});
            }
        });
    } catch(err) {
        res.status(500);
        res.render('error', {
            'status': 500,
            'error': 'CommunicationError',
            'message': 'Unable to make a connection to server'
        });
        logger.error(err);
        console.error(err);
    }
});

server.post('/fan', function(req, res) {
    try {
        client.invoke('toggleFan', req.body.fanEnabled, function(err, response, more) {
            if(err) {
                try {
                    res.status(err.status || 500);
                    res.render('error', {
                        'status': 500,
                        'error': err,
                        'message': err.message
                    });
                    logger.error(err);
                    console.error(err);
                } catch(error) {
                    logger.error('Unable to render resposne: ' + error);
                    console.error('Unable to render response: ', error);
                }
            } else {
                res.json({'status': 200});
            }
        });
    } catch(err) {
        res.status(500);
        res.render('error', {
            'status': 500,
            'error': 'CommunicationError',
            'message': 'Unable to make a connection to server'
        });
        logger.error(err);
        console.error(err);
    }
});

server.get('/state', function(req, res) {
    try {
        https.get({
            host: 'api.particle.io',
            port: 443,
            path: '/v1/devices/240020000b47353235303037/status?access_token=effedec05de7182739f864e78b5c630af947f93c',
            method: 'GET'
        }, function(response) {
            response.on('data', function(data) {
                var dat = JSON.parse(data);
                var unitState = dat.result;
                var stat = {};
                stat.fan = parseInt(unitState % 10);
                unitState /= 10;
                stat.cool = parseInt(unitState % 10);
                unitState /= 10;
                stat.heat = parseInt(unitState);
                res.json({'status': 200, 'states': stat});
            }); 
        });
    } catch(err) {
        logger.error(err);
        console.error(err);
    }
});

var port = 8080;
var sport = 8443;
var httpServer = http.createServer(server);
var httpsServer = https.createServer(options, server);
httpServer.listen(port);
httpsServer.listen(sport);

logger.info('http listening on port: ' + port);
logger.info('https listening on port: ' + sport);
console.log('http listening on port: ' + port);
console.log('https listening on port: ' + sport);
