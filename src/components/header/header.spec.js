/**
 * Header
 * @file header.spec.js
 */

/*globals describe, it, browser, expect*/

describe('header', function () {
    'use strict';
    
    var name = 'header';

    it('should look the same', function (done) {
        browser
            .url('/')
            .pause(500)
            .webdrivercss('home.' + browser.desiredCapabilities.browserName, {
                name: name,
                elem: '.' + name
            }, function (err, res) {
                console.log(' - ' + res[name][0].message);
                expect(res[name][0].isWithinMisMatchTolerance).toBe(true);
            }).call(done);
    });
});