

alert('includeed');

/*
 * Copyright 2008 Netflix, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Here's some JavaScript software for implementing OAuth.

   This isn't as useful as you might hope.  OAuth is based around
   allowing tools and websites to talk to each other.  However,
   JavaScript running in web browsers is hampered by security
   restrictions that prevent code running on one website from
   accessing data stored or served on another.

   Before you start hacking, make sure you understand the limitations
   posed by cross-domain XMLHttpRequest.

   On the bright side, some platforms use JavaScript as their
   language, but enable the programmer to access other web sites.
   Examples include Google Gadgets, and Microsoft Vista Sidebar.
   For those platforms, this library should come in handy.
*/

// The HMAC-SHA1 signature method calls b64_hmac_sha1, defined by
// http://pajhome.org.uk/crypt/md5/sha1.js

/* An OAuth message is represented as an object like this:
   {method: "GET", action: "http://server.com/path", parameters: ...}

   The parameters may be either a map {name: value, name2: value2}
   or an Array of name-value pairs [[name, value], [name2, value2]].
   The latter representation is more powerful: it supports parameters
   in a specific sequence, or several parameters with the same name;
   for example [["a", 1], ["b", 2], ["a", 3]].

   Parameter names and values are NOT percent-encoded in an object.
   They must be encoded before transmission and decoded after reception.
   For example, this message object:
   {method: "GET", action: "http://server/path", parameters: {p: "x y"}}
   ... can be transmitted as an HTTP request that begins:
   GET /path?p=x%20y HTTP/1.0
   (This isn't a valid OAuth request, since it lacks a signature etc.)
   Note that the object "x y" is transmitted as x%20y.  To encode
   parameters, you can call OAuth.addToURL, OAuth.formEncode or
   OAuth.getAuthorization.

   This message object model harmonizes with the browser object model for
   input elements of an form, whose value property isn't percent encoded.
   The browser encodes each value before transmitting it. For example,
   see consumer.setInputs in example/consumer.js.
 */

/* This script needs to know what time it is. By default, it uses the local
   clock (new Date), which is apt to be inaccurate in browsers. To do
   better, you can load this script from a URL whose query string contains
   an oauth_timestamp parameter, whose value is a current Unix timestamp.
   For example, when generating the enclosing document using PHP:

   <script src="oauth.js?oauth_timestamp=<?=time()?>" ...

   Another option is to call OAuth.correctTimestamp with a Unix timestamp.
 */

var OAuth; if (OAuth == null) OAuth = {};

OAuth.setProperties = function setProperties(into, from) {
    if (into != null && from != null) {
        for (var key in from) {
            into[key] = from[key];
        }
    }
    return into;
}

OAuth.setProperties(OAuth, // utility functions
{
    percentEncode: function percentEncode(s) {
        if (s == null) {
            return "";
        }
        if (s instanceof Array) {
            var e = "";
            for (var i = 0; i < s.length; ++s) {
                if (e != "") e += '&';
                e += OAuth.percentEncode(s[i]);
            }
            return e;
        }
        s = encodeURIComponent(s);
        // Now replace the values which encodeURIComponent doesn't do
        // encodeURIComponent ignores: - _ . ! ~ * ' ( )
        // OAuth dictates the only ones you can ignore are: - _ . ~
        // Source: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:encodeURIComponent
        s = s.replace(/\!/g, "%21");
        s = s.replace(/\*/g, "%2A");
        s = s.replace(/\'/g, "%27");
        s = s.replace(/\(/g, "%28");
        s = s.replace(/\)/g, "%29");
        return s;
    }
,
    decodePercent: function decodePercent(s) {
        if (s != null) {
            // Handle application/x-www-form-urlencoded, which is defined by
            // http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1
            s = s.replace(/\+/g, " ");
        }
        return decodeURIComponent(s);
    }
,
    /** Convert the given parameters to an Array of name-value pairs. */
    getParameterList: function getParameterList(parameters) {
        if (parameters == null) {
            return [];
        }
        if (typeof parameters != "object") {
            return OAuth.decodeForm(parameters + "");
        }
        if (parameters instanceof Array) {
            return parameters;
        }
        var list = [];
        for (var p in parameters) {
            list.push([p, parameters[p]]);
        }
        return list;
    }
,
    /** Convert the given parameters to a map from name to value. */
    getParameterMap: function getParameterMap(parameters) {
        if (parameters == null) {
            return {};
        }
        if (typeof parameters != "object") {
            return OAuth.getParameterMap(OAuth.decodeForm(parameters + ""));
        }
        if (parameters instanceof Array) {
            var map = {};
            for (var p = 0; p < parameters.length; ++p) {
                var key = parameters[p][0];
                if (map[key] === undefined) { // first value wins
                    map[key] = parameters[p][1];
                }
            }
            return map;
        }
        return parameters;
    }
,
    getParameter: function getParameter(parameters, name) {
        if (parameters instanceof Array) {
            for (var p = 0; p < parameters.length; ++p) {
                if (parameters[p][0] == name) {
                    return parameters[p][1]; // first value wins
                }
            }
        } else {
            return OAuth.getParameterMap(parameters)[name];
        }
        return null;
    }
,
    formEncode: function formEncode(parameters) {
        var form = "";
        var list = OAuth.getParameterList(parameters);
        for (var p = 0; p < list.length; ++p) {
            var value = list[p][1];
            if (value == null) value = "";
            if (form != "") form += '&';
            form += OAuth.percentEncode(list[p][0])
              +'='+ OAuth.percentEncode(value);
        }
        return form;
    }
,
    decodeForm: function decodeForm(form) {
        var list = [];
        var nvps = form.split('&');
        for (var n = 0; n < nvps.length; ++n) {
            var nvp = nvps[n];
            if (nvp == "") {
                continue;
            }
            var equals = nvp.indexOf('=');
            var name;
            var value;
            if (equals < 0) {
                name = OAuth.decodePercent(nvp);
                value = null;
            } else {
                name = OAuth.decodePercent(nvp.substring(0, equals));
                value = OAuth.decodePercent(nvp.substring(equals + 1));
            }
            list.push([name, value]);
        }
        return list;
    }
,
    setParameter: function setParameter(message, name, value) {
        var parameters = message.parameters;
        if (parameters instanceof Array) {
            for (var p = 0; p < parameters.length; ++p) {
                if (parameters[p][0] == name) {
                    if (value === undefined) {
                        parameters.splice(p, 1);
                    } else {
                        parameters[p][1] = value;
                        value = undefined;
                    }
                }
            }
            if (value !== undefined) {
                parameters.push([name, value]);
            }
        } else {
            parameters = OAuth.getParameterMap(parameters);
            parameters[name] = value;
            message.parameters = parameters;
        }
    }
,
    setParameters: function setParameters(message, parameters) {
        var list = OAuth.getParameterList(parameters);
        for (var i = 0; i < list.length; ++i) {
            OAuth.setParameter(message, list[i][0], list[i][1]);
        }
    }
,
    /** Fill in parameters to help construct a request message.
        This function doesn't fill in every parameter.
        The accessor object should be like:
        {consumerKey:'foo', consumerSecret:'bar', accessorSecret:'nurn', token:'krelm', tokenSecret:'blah'}
        The accessorSecret property is optional.
     */
    completeRequest: function completeRequest(message, accessor) {
        if (message.method == null) {
            message.method = "GET";
        }
        var map = OAuth.getParameterMap(message.parameters);
        if (map.oauth_consumer_key == null) {
            OAuth.setParameter(message, "oauth_consumer_key", accessor.consumerKey || "");
        }
        if (map.oauth_token == null && accessor.token != null) {
            OAuth.setParameter(message, "oauth_token", accessor.token);
        }
        if (map.oauth_version == null) {
            OAuth.setParameter(message, "oauth_version", "1.0");
        }
        if (map.oauth_timestamp == null) {
            OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
        }
        if (map.oauth_nonce == null) {
            OAuth.setParameter(message, "oauth_nonce", OAuth.nonce(6));
        }
        OAuth.SignatureMethod.sign(message, accessor);
    }
,
    setTimestampAndNonce: function setTimestampAndNonce(message) {
        OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
        OAuth.setParameter(message, "oauth_nonce", OAuth.nonce(6));
    }
,
    addToURL: function addToURL(url, parameters) {
        newURL = url;
        if (parameters != null) {
            var toAdd = OAuth.formEncode(parameters);
            if (toAdd.length > 0) {
                var q = url.indexOf('?');
                if (q < 0) newURL += '?';
                else       newURL += '&';
                newURL += toAdd;
            }
        }
        return newURL;
    }
,
    /** Construct the value of the Authorization header for an HTTP request. */
    getAuthorizationHeader: function getAuthorizationHeader(realm, parameters) {
        var header = 'OAuth realm="' + OAuth.percentEncode(realm) + '"';
        var list = OAuth.getParameterList(parameters);
        for (var p = 0; p < list.length; ++p) {
            var parameter = list[p];
            var name = parameter[0];
            if (name.indexOf("oauth_") == 0) {
                header += ',' + OAuth.percentEncode(name) + '="' + OAuth.percentEncode(parameter[1]) + '"';
            }
        }
        return header;
    }
,
    /** Correct the time using a parameter from the URL from which the last script was loaded. */
    correctTimestampFromSrc: function correctTimestampFromSrc(parameterName) {
        parameterName = parameterName || "oauth_timestamp";
        var scripts = document.getElementsByTagName('script');
        if (scripts == null || !scripts.length) return;
        var src = scripts[scripts.length-1].src;
        if (!src) return;
        var q = src.indexOf("?");
        if (q < 0) return;
        parameters = OAuth.getParameterMap(OAuth.decodeForm(src.substring(q+1)));
        var t = parameters[parameterName];
        if (t == null) return;
        OAuth.correctTimestamp(t);
    }
,
    /** Generate timestamps starting with the given value. */
    correctTimestamp: function correctTimestamp(timestamp) {
        OAuth.timeCorrectionMsec = (timestamp * 1000) - (new Date()).getTime();
    }
,
    /** The difference between the correct time and my clock. */
    timeCorrectionMsec: 0
,
    timestamp: function timestamp() {
        var t = (new Date()).getTime() + OAuth.timeCorrectionMsec;
        return Math.floor(t / 1000);
    }
,
    nonce: function nonce(length) {
        var chars = OAuth.nonce.CHARS;
        var result = "";
        for (var i = 0; i < length; ++i) {
            var rnum = Math.floor(Math.random() * chars.length);
            result += chars.substring(rnum, rnum+1);
        }
        return result;
    }
});

OAuth.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

/** Define a constructor function,
    without causing trouble to anyone who was using it as a namespace.
    That is, if parent[name] already existed and had properties,
    copy those properties into the new constructor.
 */
OAuth.declareClass = function declareClass(parent, name, newConstructor) {
    var previous = parent[name];
    parent[name] = newConstructor;
    if (newConstructor != null && previous != null) {
        for (var key in previous) {
            if (key != "prototype") {
                newConstructor[key] = previous[key];
            }
        }
    }
    return newConstructor;
}

/** An abstract algorithm for signing messages. */
OAuth.declareClass(OAuth, "SignatureMethod", function OAuthSignatureMethod(){});

OAuth.setProperties(OAuth.SignatureMethod.prototype, // instance members
{
    /** Add a signature to the message. */
    sign: function sign(message) {
        var baseString = OAuth.SignatureMethod.getBaseString(message);
        var signature = this.getSignature(baseString);
        OAuth.setParameter(message, "oauth_signature", signature);
        return signature; // just in case someone's interested
    }
,
    /** Set the key string for signing. */
    initialize: function initialize(name, accessor) {
        var consumerSecret;
        if (accessor.accessorSecret != null
            && name.length > 9
            && name.substring(name.length-9) == "-Accessor")
        {
            consumerSecret = accessor.accessorSecret;
        } else {
            consumerSecret = accessor.consumerSecret;
        }
        this.key = OAuth.percentEncode(consumerSecret)
             +"&"+ OAuth.percentEncode(accessor.tokenSecret);
    }
});

/* SignatureMethod expects an accessor object to be like this:
   {tokenSecret: "lakjsdflkj...", consumerSecret: "QOUEWRI..", accessorSecret: "xcmvzc..."}
   The accessorSecret property is optional.
 */
// Class members:
OAuth.setProperties(OAuth.SignatureMethod, // class members
{
    sign: function sign(message, accessor) {
        var name = OAuth.getParameterMap(message.parameters).oauth_signature_method;
        if (name == null || name == "") {
            name = "HMAC-SHA1";
            OAuth.setParameter(message, "oauth_signature_method", name);
        }
        OAuth.SignatureMethod.newMethod(name, accessor).sign(message);
    }
,
    /** Instantiate a SignatureMethod for the given method name. */
    newMethod: function newMethod(name, accessor) {
        var impl = OAuth.SignatureMethod.REGISTERED[name];
        if (impl != null) {
            var method = new impl();
            method.initialize(name, accessor);
            return method;
        }
        var err = new Error("signature_method_rejected");
        var acceptable = "";
        for (var r in OAuth.SignatureMethod.REGISTERED) {
            if (acceptable != "") acceptable += '&';
            acceptable += OAuth.percentEncode(r);
        }
        err.oauth_acceptable_signature_methods = acceptable;
        throw err;
    }
,
    /** A map from signature method name to constructor. */
    REGISTERED : {}
,
    /** Subsequently, the given constructor will be used for the named methods.
        The constructor will be called with no parameters.
        The resulting object should usually implement getSignature(baseString).
        You can easily define such a constructor by calling makeSubclass, below.
     */
    registerMethodClass: function registerMethodClass(names, classConstructor) {
        for (var n = 0; n < names.length; ++n) {
            OAuth.SignatureMethod.REGISTERED[names[n]] = classConstructor;
        }
    }
,
    /** Create a subclass of OAuth.SignatureMethod, with the given getSignature function. */
    makeSubclass: function makeSubclass(getSignatureFunction) {
        var superClass = OAuth.SignatureMethod;
        var subClass = function() {
            superClass.call(this);
        };
        subClass.prototype = new superClass();
        // Delete instance variables from prototype:
        // delete subclass.prototype... There aren't any.
        subClass.prototype.getSignature = getSignatureFunction;
        subClass.prototype.constructor = subClass;
        return subClass;
    }
,
    getBaseString: function getBaseString(message) {
        var URL = message.action;
        var q = URL.indexOf('?');
        var parameters;
        if (q < 0) {
            parameters = message.parameters;
        } else {
            // Combine the URL query string with the other parameters:
            parameters = OAuth.decodeForm(URL.substring(q + 1));
            var toAdd = OAuth.getParameterList(message.parameters);
            for (var a = 0; a < toAdd.length; ++a) {
                parameters.push(toAdd[a]);
            }
        }
        return OAuth.percentEncode(message.method.toUpperCase())
         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(URL))
         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(parameters));
    }
,
    normalizeUrl: function normalizeUrl(url) {
        var uri = OAuth.SignatureMethod.parseUri(url);
        var scheme = uri.protocol.toLowerCase();
        var authority = uri.authority.toLowerCase();
        var dropPort = (scheme == "http" && uri.port == 80)
                    || (scheme == "https" && uri.port == 443);
        if (dropPort) {
            // find the last : in the authority
            var index = authority.lastIndexOf(":");
            if (index >= 0) {
                authority = authority.substring(0, index);
            }
        }
        var path = uri.path;
        if (!path) {
            path = "/"; // conforms to RFC 2616 section 3.2.2
        }
        // we know that there is no query and no fragment here.
        return scheme + "://" + authority + path;
    }
,
    parseUri: function parseUri (str) {
        /* This function was adapted from parseUri 1.2.1
           http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
         */
        var o = {key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                 parser: {strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/ }};
        var m = o.parser.strict.exec(str);
        var uri = {};
        var i = 14;
        while (i--) uri[o.key[i]] = m[i] || "";
        return uri;
    }
,
    normalizeParameters: function normalizeParameters(parameters) {
        if (parameters == null) {
            return "";
        }
        var list = OAuth.getParameterList(parameters);
        var sortable = [];
        for (var p = 0; p < list.length; ++p) {
            var nvp = list[p];
            if (nvp[0] != "oauth_signature") {
                sortable.push([ OAuth.percentEncode(nvp[0])
                              + " " // because it comes before any character that can appear in a percentEncoded string.
                              + OAuth.percentEncode(nvp[1])
                              , nvp]);
            }
        }
        sortable.sort(function(a,b) {
                          if (a[0] < b[0]) return  -1;
                          if (a[0] > b[0]) return 1;
                          return 0;
                      });
        var sorted = [];
        for (var s = 0; s < sortable.length; ++s) {
            sorted.push(sortable[s][1]);
        }
        return OAuth.formEncode(sorted);
    }
});

OAuth.SignatureMethod.registerMethodClass(["PLAINTEXT", "PLAINTEXT-Accessor"],
    OAuth.SignatureMethod.makeSubclass(
        function getSignature(baseString) {
            return this.key;
        }
    ));

OAuth.SignatureMethod.registerMethodClass(["HMAC-SHA1", "HMAC-SHA1-Accessor"],
    OAuth.SignatureMethod.makeSubclass(
        function getSignature(baseString) {
            b64pad = '=';
            var signature = b64_hmac_sha1(this.key, baseString);
            return signature;
        }
    ));

try {
    OAuth.correctTimestampFromSrc();
} catch(e) {
}






/***************/


/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

// THE CLASS

function BirdHouse1(params) {
	alert('heresdfsd');
	// --------------------------------------------------------
	// ==================== PRIVATE ===========================
	// --------------------------------------------------------
	// VARIABLES
	
	
	
	cfg = {
		// user config
		oauth_consumer_key: "",
		consumer_secret: "",
		show_login_toolbar: false,
		// system config
		oauth_version: "1.0",
		oauth_token: "",
		oauth_signature_method: "HMAC-SHA1",
		request_token: "",
		request_token_secret: "",
		request_verifier: "",
		access_token: "",
		access_token_secret: "",
		callback_url: ""
	};
	var accessor = {
		consumerSecret: cfg.consumer_secret,
		tokenSecret   : cfg.access_token_secret
	};
	var authorized = false;

	// --------------------------------------------------------
	// var_dump
	//
	// A handy function for printing out data for debugging.
	// --------------------------------------------------------
	function var_dump(obj) {
		var out = '';
		var yes = false;

		for (var i in obj) {
			out = i+' ('+typeof(obj)+'):'+ obj[i];
			yes = true; // we has properties!
		}

		if (yes) {
			Ti.API.info('var_dump: '+out);
		} else {
			Ti.API.info('var_dump: obj '+typeof(obj)+' has no properties'+JSON.stringify(obj));
		}
	}

	// --------------------------------------------------------
	// set_message
	//
	// Creates a message to send to the Twitter service with
	// the given parameters, and adds the consumer key, 
	// signature method, timestamp, and nonce.
	//
	// In Parameters:
	//	url (String) - the url to send the message to
	//	method (String) - 'POST' or 'GET'
	//	params (String) - parameters to add to the
	//	  message in URL form, i.e. var1=2&var2=3
	//
	// Returns:
	//	message (Array) - the message parameters to send
	//	  to Twitter
	// --------------------------------------------------------
	function set_message(url, method, params) {
		var message = {
			action: url,
			method: (method=='GET') ? method : 'POST',
			parameters: (params!=null) ? OAuth.decodeForm(params) : []
		};
		message.parameters.push(['oauth_consumer_key', cfg.oauth_consumer_key]);
		message.parameters.push(['oauth_signature_method', cfg.oauth_signature_method]);
		message.parameters.push(["oauth_timestamp", OAuth.timestamp().toFixed(0)]);
		message.parameters.push(["oauth_nonce", OAuth.nonce(42)]);
		message.parameters.push(["oauth_version", "1.0"]);

		return message;
	}

	// --------------------------------------------------------
	// get_request_token
	//
	// Sets the request token and token secret.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; note that it won't
	//	  be executed until get_access_token()
	// --------------------------------------------------------
	function get_request_token(callback) {
		var url = 'https://api.twitter.com/oauth/request_token';

		var params = (cfg.callback_url!="")?'oauth_callback='+escape(cfg.callback_url):'';

		api(url,'POST',params,function(resp){
			if (resp!=false) {
				var responseParams = OAuth.getParameterMap(resp);
				cfg.request_token = responseParams['oauth_token'];
				cfg.request_token_secret = responseParams['oauth_token_secret'];
				
				Ti.App.Properties.setString('oauth_token_tw',cfg.request_token);
				Ti.App.Properties.setString('oauth_token_secret_tw',cfg.request_token_secret);

				Ti.API.debug("fn-get_request_token: response was "+resp);
				Ti.API.debug("fn-get_request_token: config is now "+JSON.stringify(cfg));
				Ti.API.debug("fn-get_request_token: callback is "+JSON.stringify(callback));

				get_request_verifier(callback);
			}
		},false,true,false);
	}

	// --------------------------------------------------------
	// get_request_verifier
	//
	// Sets the request verifier. There is no reason to call
	// this unless you have the request token and token secret.
	// In fact, it should only be called from get_request_token()
	// for that very reason.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; note that it won't
	//	  be executed until get_access_token()
	// --------------------------------------------------------
	function get_request_verifier(callback) {
		var url = "http://api.twitter.com/oauth/authorize?oauth_token="+cfg.request_token;
		Ti.App.Properties.setString('request_token',cfg.request_token);
		var closeTwtBt = Ti.UI.createButton({
			title:'Close'
		});
		var win = Ti.UI.createWindow({
			top: 0,
			modal: true,
			fullscreen: true,
			leftNavButton:closeTwtBt
			//navBarHidden:true
		});
		closeTwtBt.addEventListener('click',function(){
			win.close();
		});
		// add close button on iPhone
		if (Ti.Platform.osname=='iphone' && cfg.show_login_toolbar) {
			var webView = Ti.UI.createWebView({
				url: url,
				scalesPageToFit: true,
				touchEnabled: true,
				top:43,
				backgroundColor: '#FFF'
			});
			var toolbar = Ti.UI.createToolbar({top:0});
			var toolbarLabel = Ti.UI.createLabel({
				text:'Login with Twitter',
				font:{fontSize:16,fontWeight:'bold'},
				color:'#FFF',
				textAlign:'center'
			});
			var flexSpace = Titanium.UI.createButton({
				systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});
			var btnClose = Titanium.UI.createButton({
				title:'Cancel',
				style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
			});
			toolbar.items = [flexSpace,flexSpace,toolbarLabel,flexSpace,btnClose];
			win.add(toolbar);

			// close login window
			btnClose.addEventListener('click',function(){
				webView.stopLoading();
				win.remove(webView);
				win.close();
			});
		} else {
			var webView = Ti.UI.createWebView({
				url: url,
				scalesPageToFit: true,
				touchEnabled: true,
				top:0,
				backgroundColor: '#FFF'
			});
		}
		var request_token = "";
		var url_base = "";
		var params = "";
		var loading = false; // since the 'loading' property on webView is broke, use this
		var loads = 0; // number of times webView has loaded a URl
		var doinOurThing = false; // whether or not we are checking for oauth tokens

		// add the webview to the window and open the window
		win.add(webView);
		win.open();


		// since there is no difference between the 'success' or 'denied' page apart from content,
		// we need to wait and see if Twitter redirects to the callback to determine success
		function checkStatus() {
			Ti.API.info('====================check status');
			if (!doinOurThing) {
				// access denied or something else was clicked
				if (!loading) {
					Ti.API.info('----ACCESS DENIED!!!!----');
					webView.stopLoading();
					win.remove(webView);
					win.close();

					if(typeof(callback)=='function'){
						callback(false);
					}

					return false;
				}
			} else {
				Ti.API.info('cancel check status bc we are doin our thing');
			}
		}

		webView.addEventListener('beforeload',function(){
			loading = true;
		});
		webView.addEventListener('load',function(e){
			loads++;

			Ti.API.info('1: '+webView.evalJS("document.getElementById('content').innerHTML"));
			Ti.API.info('2: '+webView.evalJS("document.referrer"));
			Ti.API.info('3: '+webView.evalJS("document.title"));
			Ti.API.info('4: '+e.url);
			// the first time load, ignore, because it is the initial 'allow' page

			// set timeout to check for something other than 'allow', if 'allow' was clicked
			// then loads==3 will cancel this
			if (loads==2) {
				Ti.API.info('============== loads 2 ==============');
				// something else was clicked
				if (e.url!='https://api.twitter.com/oauth/authorize') {
					Ti.API.info('----WE ARE CLICKED SOMETHING ELSE!----');
					webView.stopLoading();
					win.remove(webView);
					win.close();

					if(typeof(callback)=='function'){
						callback(false);
					}

					return false;
				}
				// wait a bit to see if Twitter will redirect
				else {
					setTimeout(checkStatus,1000);
				}
			}
			// Twitter has redirected the page to our callback URL (most likely)
			else if (loads==3) {
				Ti.API.info('============== loads 3 ==============');
				doinOurThing = true; // kill the timeout b/c we are doin our thing

				Ti.API.info('listen for tokens in url');
				// success!
				params = "";
				var parts = (e.url).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
					params = params + m;

					if (key=='oauth_verifier') {
						cfg.request_verifier = value;
					}
				});

				if (cfg.request_verifier!="") {
					Ti.API.debug("fn-get_request_verifier: response was "+cfg.request_verifier);
					// my attempt at making sure the stupid webview dies
					webView.stopLoading();
					win.remove(webView);
					win.close();

					get_access_token(callback);

					return true; // we are done here
				}
			}
			loading = false;
		});

		Ti.API.debug('url is going to: '+url);
	}

	// --------------------------------------------------------
	// get_access_token
	//
	// Trades the request token, token secret, and verifier
	// for a user's access token.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; this is where
	//	  it will get executed after being authorized
	// --------------------------------------------------------
	function get_access_token(callback) {
		var url = 'https://api.twitter.com/oauth/access_token';

		api(url,'POST','oauth_token='+cfg.request_token+'&oauth_verifier='+cfg.request_verifier,function(resp){
			if (resp!=false) {
				var responseParams = OAuth.getParameterMap(resp);
				cfg.access_token = responseParams['oauth_token'];
				cfg.access_token_secret = responseParams['oauth_token_secret'];
				cfg.user_id = responseParams['user_id'];
				cfg.screen_name = responseParams['screen_name'];
				accessor.tokenSecret = cfg.access_token_secret;
				Titanium.App.Properties.setString('oauth_token',responseParams['oauth_token']);
				Titanium.App.Properties.setString('twt_user_id',responseParams['user_id']);
				Titanium.App.Properties.setString('screen_name',responseParams['screen_name']);
				Ti.API.debug("fn-get_access_token: response was "+resp);

				save_access_token();

				authorized = load_access_token();

				Ti.API.debug("fn-get_access_token: the user is authorized is "+authorized);

				Ti.API.info('Authorization is complete. The callback fn is: '+JSON.stringify(callback));

				// execute the callback function
				if(typeof(callback)=='function'){
					Ti.API.debug("fn-get_access_token: we are calling a callback function");
					callback(true);
				}
			} else {
				Ti.API.info("Failed to get access token.");
				// execute the callback function
				if(typeof(callback)=='function'){
					Ti.API.debug("fn-get_access_token: we are calling a callback function");
					callback(false);
				}
			}
		},false,true,false);
	}

	// --------------------------------------------------------
	// load_access_token
	//
	// Loads the access token and token secret from
	// 'twitter.config' to the class configuration.
	// --------------------------------------------------------
	function load_access_token() {
		// try to find file
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
		if (!file.exists()) {
			Ti.API.debug("fn-load_access_token: no file found");
			return false;
		}

		// try to read file
		var contents = file.read();
		if (contents == null) {
			Ti.API.debug("fn-load_access_token: file is empty");
			return false;
		}

		// try to parse file into json
		try {
			Ti.API.debug("fn-load_access_token: FILE FOUND\ncontents: "+contents.text);
			var config = JSON.parse(contents.text);
		} catch(e) {
			return false;
		}

		// set config
		if (config.access_token) {
			cfg.access_token = config.access_token;
		}
		if (config.access_token_secret) {
			cfg.access_token_secret = config.access_token_secret;
			accessor.tokenSecret = cfg.access_token_secret;
		}

		return true;
	}

	// --------------------------------------------------------
	// save_access_token
	//
	// Writes the access token and token secret to
	// 'twitter.config'. Saving the config in a file instead
	// of using Ti.App.Property jazz allows the config to
	// stay around even if the app has been recompiled.
	// --------------------------------------------------------
	function save_access_token() {
		// get file if it exists
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
		// create file if it doesn't exist
		if (file == null) {
			file = Ti.Filesystem.createFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
		}

		// write config
		var config = {
			access_token: cfg.access_token,
			access_token_secret: cfg.access_token_secret
		};
		file.write(JSON.stringify(config));

		Ti.API.debug('Saving access token: '+JSON.stringify(config));
	}

	// --------------------------------------------------------
	// api
	//
	// Makes a Twitter API call to the given URL by the
	// specified method with the given parameters.
	//
	// In Parameters:
	//	url (String) - the url to send the XHR to
	//	method (String) - POST or GET
	//	params (String) - the parameters to send in URL
	//	  form
	//	callback (Function) - after execution, call
	//	  this function and send the XHR data to it
	//	auth (Bool) - whether or not to force auth
	//	setUrlParams (Bool) - set the params in the URL
	//	setHeader (Bool) - set "Authorization" HTML header
	//
	// Notes:
	//	- the setUrlParams and setHeader should only need
	//	  to be set whenever getting request tokens; values
	//	  should be 'true' and 'false' respectively
	//	- take advantage of the callback function, if you
	//	  want to tweet a message and then display an alert:
	//	      BH.tweet("some text",function(){
	//	          alertDialog = Ti.UI.createAlertDialog({
	//	              message:'Tweet posted!'
	//	          });
	//	          alertDialog.show();
	//	      });
	//
	// Returns: false on failure and the responseText on
	//   success.
	// --------------------------------------------------------
	function api(url, method, params, callback, auth, setUrlParams, setHeader) {
		var finalUrl = '';

		Ti.API.debug('fn-api: callback sent is '+JSON.stringify(callback));
		Ti.API.debug('fn-api: force authorization is '+(typeof(auth)=='undefined' || auth===true));
		// authorize user if not authorized, and call this in the callback
		if (!authorized && (typeof(auth)=='undefined' || auth===true)) {
			Ti.API.info('fn-api: need to authorize b/c we are not');
			authorize(function(retval){
				if (!retval) {
					Ti.API.info('fn-api: we have returned from authorizing, but auth is false, so return false & dont execute API');
					// execute the callback function
					if (typeof(callback)=='function') {
						Ti.API.info('CALLBACK SEND: FALSE');
						callback(false);
					}

					return false;
				} else {
					Ti.API.info('fn-api: we have returned from authorizing & we are authorized!');
					api(url,method,params,callback,auth);
				}
			});
		}
		// user is authorized so execute API
		else {
			Ti.API.info('----- Initializing API Request Sequence -----');

			// VALIDATE INPUT
			if (method!="POST" && method!="GET") {
				Ti.API.debug("the method given is incorrect: "+method);
				return false;
			}
			if (params==null || typeof(params)=="undefined") {
				params = "";
			}

			// VARIABLES
			var initparams = params;

			if (params!=null) {
				params = params + "&";
			}

			Ti.API.debug("access_token is "+cfg.access_token+" typof: "+typeof(cfg.access_token));
			if (cfg.access_token!='') {
				params = params + "oauth_token="+cfg.access_token;
			}
			var message = set_message(url, method, params);
			//var message = createMessage(url, method, params);

			Ti.API.debug('fn-api: accessor is '+JSON.stringify(accessor));
			OAuth.SignatureMethod.sign(message, accessor);

			Ti.API.debug("the API request message: " + JSON.stringify(message));

			// if we are getting request tokens, all params have to be set in URL
			if (typeof(setUrlParams)!='undefined' && setUrlParams==true) {
				finalUrl = OAuth.addToURL(message.action, message.parameters);
			}
			// for all other requests only custom params need set in the URL
			else {
				finalUrl = OAuth.addToURL(message.action, initparams);
			}

			Ti.API.debug('api url: '+finalUrl);

			var XHR = Ti.Network.createHTTPClient();
			
			// on success, grab the request token
			XHR.onload = function() {
				Ti.API.debug("The API response was "+XHR.responseText);

				// execute the callback function
				if (typeof(callback)=='function') {
					Ti.API.debug("fn-api: we are calling a callback function");
					callback(XHR.responseText);
				} else {
					Ti.API.debug("fn-api: no callback set");
				}

				return XHR.responseText;
			};

			// on error, show message
			XHR.onerror = function(e) {
				// access token and token secret are wrong
				if (e.error=="Unauthorized") {
					Ti.API.debug("API request failed because the access token and token secret must be wrong. Error: "+e);

				} else {
					Ti.API.debug('The API XHR request has failed! Status='+XHR.readyState+' and var_dump of e is '+var_dump(e));
				}

				if (typeof(callback)=='function') {
					callback(false);
				}

				return false;
			}
			
			XHR.open(method, finalUrl, false);

			// if we are getting request tokens do not set the HTML header
			if (typeof(setHeader)=='undefined' || setHeader==true) {
				var init = true;
				var header = "OAuth ";
				for (var i=0; i<message.parameters.length; i++) {
					if (init) {
						init = false;
					} else {
						header = header + ",";
					}
					header = header + message.parameters[i][0] + '="' + escape(message.parameters[i][1]) + '"';
				}
				Ti.API.debug('fn-api: auth is '+header);

				XHR.setRequestHeader("Authorization", header);
			}
			
			XHR.send();
		}
	}

	// --------------------------------------------------------
	// tweet
	//
	// Opens a tweet dialog box for the user to make a tweet
	// to their page after checking if the user is authorized
	// with the app. If the user is unauthorized, the
	// authorization process will be initiated first.
	//
	// In Parameters:
	//	text (String) - the default text for the text area
	//	callback (Function) - function to use on callback
	// --------------------------------------------------------
	function tweet(text,callback) {
		// VALIDATE INPUT
		// just in case someone only wants to send a callback
		if (typeof(text)=='function' && typeof(callback)=='undefined') {
			callback = text;
			text = '';
		}
		if (typeof(text)=='undefined') {
			text = '';
		}

		Ti.API.info('----- Opening Tweet UI -----');
		var obj = this;
		obj.mytweet = text;
		Ti.API.debug("fn-tweet: authorized is: "+authorized);
		if (authorized === false) {
			Ti.API.debug('fn-tweet: we are not authorized, so initiate authorization sequence');
			authorize(function(resp){
				if (resp) {
					Ti.API.info('alright, we can tweet now: typeof '+JSON.stringify(tweet));
					obj.tweet(obj.mytweet);

					return true;
				} else {
					Ti.API.debug("fn-tweet: after asking for authorization, we didn't authorize, so we can't send the tweet.");

					// execute the callback function
					if (typeof(callback)=='function') {
						Ti.API.info('CALLBACK 0-false');
						callback(false);
					}

					return false;
				}
			});
		} else {
			Ti.API.debug('fn-tweet: we are authorized, initiate tweet sequence');
			var chars = (typeof(text)!='undefined' && text!=null)?text.length:0;

			var winBG = Titanium.UI.createWindow({
				backgroundColor:'#000',
				opacity:0.60,
				navBarHidden:true
			});

			// the UI window looks completely different on iPhone vs. Android
			// iPhone UI
			if (Ti.Platform.osname=='iphone') {
				var winTW = Titanium.UI.createWindow({
					height:((Ti.Platform.displayCaps.platformHeight*0.5)-15), // half because the keyboard takes up half
					width:(Ti.Platform.displayCaps.platformWidth-20),
					top:10,
					right:10,
					left:10,
					borderColor:'#224466',
					borderWidth:3,
					backgroundColor:'#559abb',
					borderRadius:10,
					navBarHidden:true
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:((Ti.Platform.displayCaps.platformHeight*0.5)-100),
					width:(Ti.Platform.displayCaps.platformWidth-48),
					font:{fontSize:16},
					top:14,
					left:14,
					right:14
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet!',
					width:100,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75),
					right:24
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:100,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75),
					left:24
				});
				var charcount = Ti.UI.createLabel({
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-55),
					left:(Ti.Platform.displayCaps.platformWidth-60), // 30 px from right side,
					color:'#FFF',
					text:(parseInt((140-chars))+'')
				});
				// show keyboard on load
				winTW.addEventListener('open',function(){
					tweet.focus();
				});
			}
			// Android UI
			else {
				var winTW = Titanium.UI.createWindow({
					height:264,
					top:10,
					right:10,
					left:10,
					borderColor:'#224466',
					borderWidth:3,
					backgroundColor:'#559abb',
					borderRadius:3.0
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:160,
					top:14,
					left:14,
					right:14
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet',
					width:100,
					top:182,
					right:24
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:100,
					top:182,
					left:24
				});
				var charcount = Ti.UI.createLabel({
					bottom:10,
					right:14,
					color:'#FFF',
					text:(parseInt((140-chars))+'')
				});
			}
			tweet.addEventListener('change',function(e) {
				chars = (140-e.value.length);
				if (chars<11) {
					if (charcount.color!='#D40D12') {
						charcount.color = '#D40D12';
					}
				} else if (chars<20) {
					if (charcount.color!='#5C0002') {
						charcount.color = '#5C0002';
					}
				} else {
					if (charcount.color!='#FFF') {
						charcount.color = '#FFF';
					}
				}
				charcount.text = parseInt(chars)+'';
			});
			btnTW.addEventListener('click',function() {
				send_tweet("status="+escape(tweet.value),function(retval){
					Ti.API.info('fn-tweet: retval is '+retval);
					if (retval===false) {
						// execute the callback function
						if (typeof(callback)=='function') {
							Ti.API.info('CALLBACK 1-false');
							callback(false);
						}

						return false;
					} else {
						// hide the keyboard on Android because it doesn't automatically
						if (Ti.Platform.osname=='android') {
							Titanium.UI.Android.hideSoftKeyboard();
						}

						// execute the callback function
						if (typeof(callback)=='function') {
							Ti.API.info('CALLBACK 1-true');
							callback(true);
						}

						winBG.close();
						winTW.close();

						return true;
					}
				});
			});
			btnCancel.addEventListener('click',function() {
				// hide the keyboard on Android because it doesn't automatically
				if (Ti.Platform.osname=='android') {
					Titanium.UI.Android.hideSoftKeyboard();
				}
				winBG.close();
				winTW.close();
			});
			winTW.add(charcount);
			winTW.add(tweet);
			winTW.add(btnTW);
			winTW.add(btnCancel);
			winBG.open();
			winTW.open();
		}
	}

	// --------------------------------------------------------
	// short_tweet
	//
	// Opens a tweet dialog box for the user to make a tweet
	// to their page after checking if the user is authorized
	// with the app. If the user is unauthorized, the
	// authorization process will be initiated first. Also,
	// a 'Shorten' button is provided to shorten any links
	// in the tweet before posting.
	//
	// In Parameters:
	//	text (String) - the default text for the text area
	//	callback (Function) - function to use on callback
	// --------------------------------------------------------
	function short_tweet(text,callback) {
		// VALIDATE INPUT
		// just in case someone only wants to send a callback
		if (typeof(text)=='function' && typeof(callback)=='undefined') {
			callback = text;
			text = '';
		}
		if (typeof(text)=='undefined') {
			text = '';
		}

		Ti.API.info('----- Opening Tweet UI -----');
		var obj = this;
		obj.mytweet = text;
		Ti.API.debug("fn-tweet: authorized is: "+authorized);
		if (authorized === false) {
			Ti.API.debug('fn-tweet: we are not authorized, so initiate authorization sequence');
			authorize(function(resp){
				if (resp) {
					Ti.API.info('alright, we can tweet now: typeof '+JSON.stringify(tweet));
					obj.tweet(obj.mytweet);

					return true;
				} else {
					Ti.API.debug("fn-tweet: after asking for authorization, we didn't authorize, so we can't send the tweet.");

					// execute the callback function
					if (typeof(callback)=='function') {
						Ti.API.info('CALLBACK 0-false');
						callback(false);
					}

					return false;
				}
			});
		} else {
			Ti.API.debug('fn-tweet: we are authorized, initiate tweet sequence');
			var chars = (typeof(text)!='undefined' && text!=null)?text.length:0;

			var winBG = Titanium.UI.createWindow({
				backgroundColor:'#000',
				opacity:0.60
			});

			// the UI window looks completely different on iPhone vs. Android
			// iPhone UI
			if (Ti.Platform.osname=='iphone') {
				var winTW = Titanium.UI.createWindow({
					height:((Ti.Platform.displayCaps.platformHeight*0.5)-15), // half because the keyboard takes up half
					width:(Ti.Platform.displayCaps.platformWidth-20),
					top:10,
					right:10,
					left:10,
					borderColor:'#224466',
					borderWidth:3,
					backgroundColor:'#559abb',
					borderRadius:10,
					navBarHidden:true
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:((Ti.Platform.displayCaps.platformHeight*0.5)-100),
					width:(Ti.Platform.displayCaps.platformWidth-48),
					font:{fontSize:16},
					top:14,
					left:14,
					right:14
				});
				var btnShorten = Ti.UI.createButton({
					title:'Shorten',
					width:80,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75)
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet!',
					width:80,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75),
					right:24
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:80,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75),
					left:24
				});
				var charcount = Ti.UI.createLabel({
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-55),
					left:(Ti.Platform.displayCaps.platformWidth-60), // 30 px from right side,
					color:'#FFF',
					text:(parseInt((140-chars))+'')
				});
				// show keyboard on load
				winTW.addEventListener('open',function(){
					tweet.focus();
				});
			}
			// Android UI
			else {
				var winTW = Titanium.UI.createWindow({
					height:264,
					top:10,
					right:10,
					left:10,
					borderColor:'#224466',
					borderWidth:3,
					backgroundColor:'#559abb',
					borderRadius:3.0
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:160,
					top:14,
					left:14,
					right:14
				});
				var btnShorten = Ti.UI.createButton({
					title:'Shorten',
					width:100,
					top:182
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet',
					width:100,
					top:182,
					right:24
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:100,
					top:182,
					left:24
				});
				var charcount = Ti.UI.createLabel({
					bottom:10,
					right:14,
					color:'#FFF',
					text:(parseInt((140-chars))+'')
				});
			}
			tweet.addEventListener('change',function(e) {
				chars = (140-e.value.length);
				if (chars<11) {
					if (charcount.color!='#D40D12') {
						charcount.color = '#D40D12';
					}
				} else if (chars<20) {
					if (charcount.color!='#5C0002') {
						charcount.color = '#5C0002';
					}
				} else {
					if (charcount.color!='#FFF') {
						charcount.color = '#FFF';
					}
				}
				charcount.text = parseInt(chars)+'';
			});
			btnShorten.addEventListener('click',function() {
				var actInd = Titanium.UI.createActivityIndicator({
					style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
					height:30,
					width:30,
					top:30
				});
				indWin = Titanium.UI.createWindow();
				indWin.add(actInd);
				indWin.open();
				actInd.show();

				// replace URLs in the text with shortened URLs
				var urlRegex = /(https?:\/\/[^\s]+)/gi;
				var urls = [];
				(tweet.value).replace(urlRegex, function(url) {
					Ti.API.info('push '+url);
					urls.push(url);
				});
				for (var i=0; i<urls.length; i++) {
					// get shorturl
					shorten_url(urls[i],function(shorturl,url){
						Ti.API.info('repl: '+shorturl);
						if (shorturl!=false) {
							Ti.API.info('repl '+url+' with '+shorturl);
							tweet.value = (tweet.value).replace(url, shorturl);
							indWin.close();
							actInd.hide();
							Ti.API.info('tweet is now '+tweet.value);
							return true;
						} else {
							Ti.API.info('could not shorten the url: '+url);
							indWin.close();
							actInd.hide();
							return false;
						}
					});
				}
			});
			btnTW.addEventListener('click',function() {
				send_tweet("status="+escape(tweet.value),function(retval){
					if (retval===false) {
						Ti.API.info('tweet failed to send');
						// execute the callback function
						if (typeof(callback)=='function') {
							Ti.API.info('CALLBACK 1-false');
							callback(false);
						}

						return false;
					} else {
						// hide the keyboard on Android because it doesn't automatically
						if (Ti.Platform.osname=='android') {
							Titanium.UI.Android.hideSoftKeyboard();
						}

						// execute the callback function
						if (typeof(callback)=='function') {
							Ti.API.info('CALLBACK 1-true');
							callback(true);
						}

						winBG.close();
						winTW.close();

						return true;
					}
				});
			});
			btnCancel.addEventListener('click',function() {
				// hide the keyboard on Android because it doesn't automatically
				if (Ti.Platform.osname=='android') {
					Titanium.UI.Android.hideSoftKeyboard();
				}
				winBG.close();
				winTW.close();
			});
			winTW.add(charcount);
			winTW.add(tweet);
			winTW.add(btnShorten);
			winTW.add(btnTW);
			winTW.add(btnCancel);
			winBG.open();
			winTW.open();
		}
	}

	// --------------------------------------------------------
	// send_tweet
	//
	// Makes an API call to Twitter to post a tweet.
	//
	// In Parameters:
	//	params (String) - the string of optional and
	//	  required parameters in url form
	//	callback (Function) - function to call on completion
	// --------------------------------------------------------
	function send_tweet(params,callback) {
		api('http://api.twitter.com/1/statuses/update.json','POST','status='+params,function(resp){
			
			if (resp!=false) {
				Ti.API.debug("fn-send_tweet: response was "+resp+'--------------');
				if (typeof(callback)=='function') {
					callback(true);
				}
				return true;
			} else {
				Ti.API.info("Failed to send tweet."+'------------------');
				if (typeof(callback)=='function') {
					callback(false);
				}
				return false;
			}
		});
	}
	
	

	// --------------------------------------------------------
	// shorten_url
	//
	// Shortens a URL using twe.ly.
	//
	// In Parameters:
	//	url (String) - the url to shorten
	//
	// Returns:
	//	shorturl (String) - the shortened URL, else false
	//	callback (Function) - function to call on completion
	// --------------------------------------------------------
	function shorten_url(url,callback) {
		Ti.API.info("----- Get Short URL -----");

		Ti.API.info('url: '+url);

		var XHR = Titanium.Network.createHTTPClient();
Ti.API.info('call: http://www.twe.ly/short.php?url='+url+"&json=1");
		XHR.open("GET","http://www.twe.ly/short.php?url="+url+"&json=1");
		XHR.onload = function () {
Ti.API.info('resp: '+XHR.responseText);
			try {
				shorturl = JSON.parse(XHR.responseText);
			} catch(e) {
				shorturl = false;
			}

			if (shorturl!=false && shorturl.substr(0,5)=='Sorry') {
				shorturl = false;
			}
Ti.API.info('shortlink '+shorturl);

			if (typeof(callback)=='function') {
				callback(shorturl,url);
			}

			return shorturl;
		};
		XHR.onerror = function(e) {
			Ti.API.debug('XHR error is '+ XHR.readyState +' | '+XHR.status+" "+JSON.stringify(e));

			if (typeof(callback)=='function') {
				callback(false);
			}

			return false;
		};
		XHR.send();
	}

	// --------------------------------------------------------
	// get_tweets
	//
	// Makes a TWitter API call to get tweets.
	//
	// In Parameters:
	//	params (String) - the string of optional and
	//	  required parameters in url form
	//	callback (Function) - function to use on callback
	// --------------------------------------------------------
	function get_tweets(params,callback) {
		// just in case someone only wants to send a callback
		if (typeof(params)=='function' && typeof(callback)=='undefined') {
			callback = params;
			params = '';
		}

		api("https://api.twitter.com/1/statuses/friends_timeline.json","GET",params,function(tweets){
			try {
				Ti.API.info('fn-get_tweets: WE GOT TWEETS!');
				tweets = JSON.parse(tweets);
			} catch (e) {
				Ti.API.info('fn-get_tweets: api returned a non-JSON string');
				tweets = false;
			}

			// execute the callback function
			if(typeof(callback)=='function'){
				callback(tweets);
			}

			return tweets;
		})
	}

	
	function getUserProfileInfo(params,callback) {
		// just in case someone only wants to send a callback
		if (typeof(params)=='function' && typeof(callback)=='undefined') {
			callback = params;
			params = '';
		}

		api("https://api.twitter.com/1/account/verify_credentials.json","GET",params,function(tweets){
			try {
				Ti.API.info('fn-get_tweets: WE GOT TWEETS!');
				tweets = JSON.parse(tweets);
			} catch (e) {
				Ti.API.info('fn-get_tweets: api returned a non-JSON string');
				tweets = false;
			}

			// execute the callback function
			if(typeof(callback)=='function'){
				callback(tweets);
			}

			return tweets;
		})
	}
	
	
	
	function getTwitterFollowers(screenname,params,callback) {
		// just in case someone only wants to send a callback
		if (typeof(params)=='function' && typeof(callback)=='undefined') {
			callback = params;
			params = '';
		}

		api("https://api.twitter.com/1/followers/ids.json?cursor=-1&screen_name="+screenname,"GET",params,function(tweets){
			try {
				Ti.API.info('fn-get_tweets: WE GOT TWEETS!');
				tweets = JSON.parse(tweets);
			} catch (e) {
				Ti.API.info('fn-get_tweets: api returned a non-JSON string');
				tweets = false;
			}

			// execute the callback function
			if(typeof(callback)=='function'){
				callback(tweets);
			}

			return tweets;
		})
	}
	
	//profile_image_url
	function getFollowersDetail(friendArr,params,callback) {
		// just in case someone only wants to send a callback
		//alert(friendArr);
		if (typeof(params)=='function' && typeof(callback)=='undefined') {
			callback = params;
			params = '';
		}
        
		api("https://api.twitter.com/1/users/lookup.json?user_id="+friendArr,"GET",params,function(tweets){
			try {
				Ti.API.info('getOneFollowers');
				tweets = JSON.parse(tweets);
			} catch (e) {
				Ti.API.info('getOneFollowers error');
				tweets = false;
			}

			// execute the callback function
			if(typeof(callback)=='function'){
				callback(tweets);
			}

			return tweets;
		})
	}
	
	function postNotificationToFollwer(params)
	{
	    alert('okdsf');
	  
	    var url ="https://api.twitter.com/1/statuses/update.json";
	    var message = {
			action: url,
			method: 'POST',
			parameters: []
		};
		message.parameters.push(['oauth_consumer_key', cfg.oauth_consumer_key]);
		message.parameters.push(['oauth_signature_method', cfg.oauth_signature_method]);
		message.parameters.push(["oauth_timestamp", OAuth.timestamp().toFixed(0)]);
		message.parameters.push(["oauth_nonce", OAuth.nonce(42)]);
		message.parameters.push(["oauth_version", "1.0"]);
		message.parameters.push(['oauth_token', cfg.access_token]);
        //alert(JSON.stringify(message.parameters));
        OAuth.SignatureMethod.sign(message, accessor);
		var client = Ti.Network.createHTTPClient();
        var data = {
        	status:params
        }
        console.log(cfg.access_token);
	    client.open('POST', url);
	    //client.setRequestHeader('Content-Type', 'application/json;');
        client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader(message.parameters));
	    client.send(data);
	    client.onload = function() 
	    {
	    	Ti.API.info("Received Data From postNotificationToFollwer--"+this.responseText);
	    }
	    client.onerror = function(error)
	    {
	    	console.log('error'+error);
	        alert(error);
	    }
	}
	
	/*
	function postOnTwitter(params)
	{
		alert("");
		var url ="https://api.twitter.com/1/statuses/update.json";
	    var message = {
			action: url,
			method: 'POST',
			parameters: []
		};
		message.parameters.push(['oauth_consumer_key', cfg.oauth_consumer_key]);
		message.parameters.push(['oauth_signature_method', cfg.oauth_signature_method]);
		message.parameters.push(["oauth_timestamp", OAuth.timestamp().toFixed(0)]);
		message.parameters.push(["oauth_nonce", OAuth.nonce(42)]);
		message.parameters.push(["oauth_version", "1.0"]);
		message.parameters.push(['oauth_token', cfg.access_token]);
        //alert(JSON.stringify(message.parameters));
        OAuth.SignatureMethod.sign(message, accessor);
		var client = Ti.Network.createHTTPClient();
        var data = {
        	status:params
        }
       
	    client.open('POST', url);
	    //client.setRequestHeader('Content-Type', 'application/json;');
        client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
	    client.send(data);
	    client.onload = function() 
	    {
	    	Ti.API.info("Received Data From postNotificationToFollwer--"+this.responseText);
	    }
	    client.onerror = function(error)
	    {
	        alert(error);
	    }
	}*/
	
	// --------------------------------------------------------
	// authorize
	//
	// The whole authorization sequence begins with
	// get_request_token(), which calls get_request_verifier()
	// which finally calls get_access_token() which then
	// saves the token in a file.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; note that it won't
	//	  be executed until get_access_token(), unless we
	//	  are already authorized.
	//
	// Returns: true if the user is authorized
	// --------------------------------------------------------
	function authorize(callback) {
		if (!authorized) {
			Ti.API.info('----- Initializing Authorization Sequence -----');
			Ti.API.debug("fn-authorize: use this callback function: "+JSON.stringify(callback));
			get_request_token(callback); // get_request_token or a function it calls will call callback

		} else {
			// execute the callback function
			if(typeof(callback)=='function'){
				callback(authorized);
			}
		}

		return authorized;
	}

	// --------------------------------------------------------
	// deauthorize
	//
	// Delete the stored access token file, delete the tokens
	// from the config and accessor, and set authorized to
	// load_access_token() which should return false since
	// we deleted the file, thus resulting in a deauthroized
	// state.
	//
	// In Parameters:
	//	callback (Function) - function to call after
	//	  user is deauthorized
	//
	// Returns: true if the user is deauthorized
	// --------------------------------------------------------
	function deauthorize(callback) {
		if (authorized) {
			Ti.API.info('----- Initializing Deauthorization Sequence -----');
			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
			file.deleteFile();
			Ti.API.debug("fn-deauthorize: the user is still authorized: "+authorized);
			authorized = load_access_token();
			Ti.API.debug("fn-deauthorize: the user is still authorized: "+authorized);
			accessor.tokenSecret = "";
			cfg.access_token = "";
			cfg.access_token_secret = "";
			cfg.request_verifier = "";

			// execute the callback function
			if(typeof(callback)=='function'){
				callback(!authorized);
			}
		} else {
			Ti.API.info('you are already deauthorized');
			// execute the callback function
			if(typeof(callback)=='function'){
				callback(!authorized);
			}
		}

		return !authorized;
	}

	
	var sendTwitterImage = function(postParams, pSuccessCallback, pErrorCallback) {
	    var finalUrl = '';

	    console.log('postParams= ' + JSON.stringify(postParams));
	    
	    // authorize user if not authorized, and call this in the callback
	    if(!authorized && ( typeof (auth) == 'undefined' || auth === true)) {
	        authorize(function(retval) {
	            if(!retval) {
	                // execute the callback function
	                if( typeof (callback) == 'function') {
	                    callback(false);
	                }

	                return false;
	            } else {
	                sendTwitterImage(postParams, pSuccessCallback, pErrorCallback);
	            }
	        });
	    }
	    // user is authorized so execute API
	    else 
	    {
	        var url = "http://upload.twitter.com/1/statuses/update_with_media.json";

	        // VARIABLES
	        var initparams = params;

	        if(params != null) 
	        {
	            params = params + "&";
	        }

	        var message = set_message(url, "POST");
	        message.parameters.push(['oauth_token', cfg.access_token]);

	        OAuth.SignatureMethod.sign(message, accessor);

	        var XHR = Ti.Network.createHTTPClient();
	        
	        XHR.open("POST", url);
            
	        // on success, grab the request token
	        XHR.onload = function() 
	        {
	        	alert("XHR.onload "+XHR.responseText);
	            Ti.API.debug("XHR.onload "+XHR.responseText);
	        };
	        // on error, show message
	        XHR.onerror = function(e) 
	        {
	        	alert("XHR.onerror "+e);
	        	console.log("XHR.onerror--------> "+JSON.stringify(e));
	            Ti.API.debug("XHR.onerror "+e);
	        }
	        // if we are getting request tokens do not set the HTML header
	        if( typeof (setHeader) == 'undefined' || setHeader == true) 
	        {
	            var init = true;
	            var header = "OAuth ";
	            for(var i = 0; i < message.parameters.length; i++) 
	            {
	                if(init) 
	                {
	                    init = false;
	                } 
	                else 
	                {
	                    header = header + ",";
	                }
	                header = header + message.parameters[i][0] + '="' + escape(message.parameters[i][1]) + '"';
	            }
	            header = OAuth.getAuthorizationHeader("", message.parameters);
	            XHR.setRequestHeader("Authorization", header);
	            if (Ti.Platform.osname === 'iphone') 
	            {
	                 XHR.setRequestHeader("Content-Type", "multipart/form-data");
	             }
	        }

	        XHR.send(postParams);
	    }

	};
	this.sendTwitterImage = sendTwitterImage;
	
	// --------------------------------------------------------
	// ===================== PUBLIC ===========================
	// --------------------------------------------------------
	this.authorize = authorize;
	this.deauthorize = deauthorize;
	this.api = api;
	this.authorized = function() { return authorized; }
	this.get_tweets = get_tweets;
	this.tweet = tweet;
	this.short_tweet = short_tweet;
	this.shorten_url = shorten_url;
	//below function added by jitendra
	this.getUserProfileInfo =getUserProfileInfo;
	this.getTwitterFollowers =getTwitterFollowers;
	this.getFollowersDetail =getFollowersDetail;
    this.postNotificationToFollwer =postNotificationToFollwer;
    this.send_tweet = send_tweet;
    // --------------------------------------------------------
	// =================== INITIALIZE =========================
	// --------------------------------------------------------
	if (typeof params == 'object') {
		if (params.consumer_key != undefined) {
			cfg.oauth_consumer_key = params.consumer_key;
		}
		if (params.consumer_secret != undefined) {
			cfg.consumer_secret = params.consumer_secret;
			accessor.consumerSecret = cfg.consumer_secret;
		}
		if (params.callback_url != undefined) {
			cfg.callback_url = params.callback_url;
		}
		if (params.show_login_toolbar != undefined) {
			cfg.show_login_toolbar = params.show_login_toolbar;
		}
	}
	authorized = load_access_token(); // load the token on startup to see if authorized
	Ti.API.debug("initialization: authorized is "+authorized);
};
