var type = require('@melgrove/type');
var TurndownService = require('turndown');
var turndownService = new TurndownService();
var sanitize = require('sanitize-html');

/**
 * Converts JSON into formatted markup. Creates nested ordered and unordered lists in either HTML or Markdown. Has an extremely simple API with optional HTML sanitization.
 * 
 * @param {string | object | array} objectToConvert Strings are interpreted as JSON and parsed, objects and arrays are interpreted literally 
 * @param {object} config Configuration object
 * @param {string} config.return 'html' or 'markdown'
 * @param {boolean} config.sanitize Sanitize HTML?
 * 
 * @returns {string} Formatted HTML or Markdown
 */
function json2markup(objectToConvert, config = {}) {

    // Validation
    // if json string then parse it
    if(type(objectToConvert) == 'string') {
        objectToConvert = JSON.parse(objectToConvert)
    } 
    // if not a js array or object
    else if(type(objectToConvert) != 'object' && type(objectToConvert) != 'array') {
        throw Error('The first argument must be a JSON string, javascript array, or javascript object')
    }
    // config must be an object
    if(type(config) !== 'object') {
        throw Error('The second argument must be an object')
    }

    // HTML output
    if(type(config.return) == 'undefined' || config.return == 'html') {
        return jsonToHTML(objectToConvert)
    // Markdown output
    } else if(config.return == 'markdown') {
        return turndownService.turndown(jsonToHTML(objectToConvert))
    } else {
        throw Error(`config.return must be 'html' or 'markdown'`)
    }

    // Helper to make HTML list
    function jsonToHTML(val) {
        if(type(val) == 'object') {
            return makeList(val, false)
        } else if(type(val) == 'array') {
            return makeList(val, true)
        } else {
            return (config.sanitize ? sanitize(val) : val)
        }

        function makeList(val, isArray){
            let output = '';
            if(isArray) {
                output += '<ol>'
                val.forEach(e => {
                    output += '<li>';
                    output += (type(e) == 'array' ? makeList(e, true) : (type(e) == 'object' ? makeList(e, false) : (config.sanitize ? sanitize(e) : e)));
                    output += '</li>';
                })
                output += '</ol>'
            } else {
                output += '<ul>'
                for(const [key, value] of Object.entries(val)) {
                    // sanitize?
                    output += '<li>' + (config.sanitize ? sanitize(key) : key) + ': ';
                    output += (type(value) == 'array' ? makeList(value, true) : (type(value) == 'object' ? makeList(value, false) : (config.sanitize ? sanitize(value) : value)));
                    output += '</li>';                
                }
                output += '</ul>'
            }
            return output
        }
    }
} 

module.exports = json2markup;