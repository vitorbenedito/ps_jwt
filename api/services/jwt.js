var crypto = require('crypto');

exports.encode = function(payload,secret){
    
    algorithm = 'HS256';
    
    var header = {
        typ: 'JWT',
        alg: algorithm
    };
    
    var jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));
    return jwt + '.' + sign(jwt,secret);
    
}

exports.decode = function(token,secret){

	var segements = token.split('.');

	if(segements.length != 3){
		throw new Error("Token structure incorrect!");
	}

	var header = JSON.parse(base64Decode(segements[0]));
	var payload = JSON.parse(base64Decode(segements[1]));

	var rawSignature = segements[0] + '.' + segements[1];

	if(!verify(rawSignature,secret,segements[2])){
		throw new Error("Verification failed!");
	}

	return payload;

}

function verify(raw,secret,signature){
	return signature === sign(raw,secret);
}

function sign(str,key){
    return crypto.createHmac('sha256',key).update(str).digest('base64');
}

function base64Encode(str){
    return new Buffer(str).toString('base64');
}

function base64Decode(str){
	return new Buffer(str,'base64').toString();
}