#!/usr/bin/env node
/**
 * Convert a 2.x style theme sprite map into separate images.
 *
 * Usage:
 *
 * 1)  Edit the configuration below.
 * 2)  Save sprite-cutter.js somewhere.
 * 3)  `cd` into your theme directory.
 * 4)  `node sprite-cutter.js` to run the script.
 */

'use strict';

// FIXME:  sprite-size should be pulled from the image
// FIXME:  auto-detect if retina image exists and the scale factor

var config, cutter, OptionParser, parser;

cutter = require('../lib/sprite-cutter');
OptionParser = require('OptionParser').OptionParser;
parser = new OptionParser();
config = {
    'sprite-name': 'sprite.png',
    'button-height': null,
    'button-margin-left': null,
    'checkbox-height': null,
    'checkbox-width': null,
    'radio-height': null,
    'radio-width': null,
    'select-height': null,
    'select-margin-left': null,
    'upload-action-width': null,
    'upload-filename-width': null,
    'upload-height': null,
    'upload-width': null,
};

/**
 * Create generic parameters for each of the config options
 */
Object.keys(config).forEach(function (name) {
    if (name === 'sprite-name') {
        parser.addOption(null, name, 'Set image sprite name (must be a PNG file)').argument('FILENAME.PNG').action(function (value) {
            config[name] = value;
        });
    } else {
        parser.addOption(null, name, 'Set ' + name.replace(/-/g, ' ') + ' (pixels)').argument('PIXELS').action(function (px) {
            px = +px;
            config[name] = px;
        });
    }
});

parser.addOption('h', 'help', 'Display this help message').action(function () {
    parser.helpAction()();
    console.log();
    console.log('The retina image is automatically created from the non-retina image by');
    console.log('replacing "sprite" with "sprite-retina".');
});
parser.addOption('p', 'preset', 'Use a preset').argument('NAME').action(function (name) {
    switch (name) {
    case 'agent':
        config['sprite-name'] = 'sprite-agent.png';
        config['button-height'] = 32;
        config['button-margin-left'] = 13;
        config['checkbox-height'] = 23;
        config['checkbox-width'] = 23;
        config['radio-height'] = 23;
        config['radio-width'] = 23;
        config['select-height'] = 32;
        config['select-margin-left'] = 12;
        config['upload-action-width'] = 90;
        config['upload-filename-width'] = 76;
        config['upload-height'] = 32;
        config['upload-width'] = 190;
        break;

    case 'aristo':
        config['sprite-name'] = 'sprite-aristo.png';
        config['button-height'] = 32;
        config['button-margin-left'] = 13;
        config['checkbox-height'] = 23;
        config['checkbox-width'] = 23;
        config['radio-height'] = 23;
        config['radio-width'] = 23;
        config['select-height'] = 32;
        config['select-margin-left'] = 10;
        config['upload-action-width'] = 90;
        config['upload-filename-width'] = 76;
        config['upload-height'] = 32;
        config['upload-width'] = 190;
        break;

    case 'default':
        config['sprite-name'] = 'sprite.png';
        config['button-height'] = 30;
        config['button-margin-left'] = 13;
        config['checkbox-height'] = 19;
        config['checkbox-width'] = 19;
        config['radio-height'] = 18;
        config['radio-width'] = 18;
        config['select-height'] = 26;
        config['select-margin-left'] = 10;
        config['upload-action-width'] = 82;
        config['upload-filename-width'] = 85;
        config['upload-height'] = 28;
        config['upload-width'] = 190;
        break;

    case 'jeans':
        config['sprite-name'] = 'sprite-jeans.png';
        config['button-height'] = 30;
        config['button-margin-left'] = 13;
        config['checkbox-height'] = 19;
        config['checkbox-width'] = 19;
        config['radio-height'] = 18;
        config['radio-width'] = 18;
        config['select-height'] = 26;
        config['select-margin-left'] = 10;
        config['upload-action-width'] = 82;
        config['upload-filename-width'] = 85;
        config['upload-height'] = 28;
        config['upload-width'] = 190;
        break;

    default:
        console.log('Unknown theme: ' + name);
    }
});

// Parse all options
parser.parse();

// Debugging information
console.log('Current settings:');
Object.keys(config).forEach(function (name) {
    console.log('\t' + name + ': ' + config[name]);
});

// Double check that all config settings are set
Object.keys(config).forEach(function (name) {
    if (config[name] === null) {
        console.log('You must specify all config variables');
        process.exit();
    }
});

// Go cut up the image
cutter.cutSprite(config).then(function () {
    console.log('Images written successfully');
}, function (err) {
    console.log('Error encountered: ' + err.toString());
});
