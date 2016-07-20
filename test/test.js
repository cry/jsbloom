var assert = require('chai').assert,
    JSBloom = require('../bloom.js'),
    filter = new JSBloom.bloomFilter(5000, 1E-5),
    generator = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });
    },
    test_entries = [],
    false_entries = [];

global.btoa = function (str) {return new Buffer(str).toString('base64');};

describe('JSBloom', function() {
    describe('Insertion', function() {
        it('should insert 1000 random elements individually without error', function() {
            for (var i = 1000 - 1; i >= 0; i--) {
                var rand_string = generator();

                test_entries.push(rand_string);

                assert.equal(filter.addEntry(rand_string), true);
            };
        });

        it('should insert 1000 random elements in an array without error', function() {

            var arr = [];

            for (var i = 1000 - 1; i >= 0; i--) {

                var rand_string = generator();

                arr.push(rand_string);

            };

            test_entries.join(arr);

            assert.equal(filter.addEntries(arr), true);

        });
    });

    describe('Existence', function() {
        it('should return true for 2000 added elements', function() {
            for (var i = test_entries.length - 1; i >= 0; i--) {
                assert.equal(filter.checkEntry(test_entries[i]), true);
            };
        });

        it('should return false for 2000 non-existent elements', function() {
            for (var i = 2000 - 1; i >= 0; i--) {
                assert.equal(filter.checkEntry(generator()), false);
            };
        })
    });

    describe('Deletion', function() {
        it('should return false on deleted element', function() {

            var rand_string = generator();

            filter.addEntry(rand_string);

            filter.removeEntry(rand_string);

            assert.equal(filter.checkEntry(rand_string), false);
        });

        it('should return false on 1000 deleted elements', function() {

            var arr = [];

            for (var i = 1000 - 1; i >= 0; i--) {

                var rand_string = generator();

                arr.push(rand_string);

            };

            filter.addEntries(arr);

            filter.removeEntries(arr);

            for (var i = arr.length - 1; i >= 0; i--) {
                assert.equal(filter.checkEntry(arr[i]), false);
            };

        });
    });

    describe('Import & Export', function() {
        it('should return true on predefined element in imported array', function() {
            filter.importData("AwGl7SOrZ+6IcpqXrZj2u5/vQg4o0k8syi6q2m+uxh5p1l9tzj7r3n/voIHChokeLGSJ0qbJny5ihcqWqV6tZo3atunfr2GDxo6ZPmzli9au2b9u44fOnrl+7eeP3r75/+/QIDgoNCQ8LDIiOio2Jj4uMSE5KTUlPS0zIzsrNyc/LzCguKi0pLyssqK6qramvq6xobmptaW9rbOju6u3p7+vsGB4aHRkfGxyYnpqdmZ+bnFheWl1ZX1tc2N7a3dnf29w4OZgEYj8+OLq8ub67vbh/unx5fnt9eP96/Pn++/34B/yBgJBwLBoIh4KhkJh0LhsIR8KRiJRyLRqIx6KxmJx2LxuIJ+KJhJJxLJpIp5KplJp1LptIZ9KZjJZzLZrI57K5nJ53L5vIF/KFgpFwrFool4qlkpl0rlsoV8qVvzOirVyo16q1mp12r1uoN+qNhpNxrNpot5qtlpt1rttod9qdjpdzrdro97q9qVVnr93oD/qDgZDwbDoYj4ajNF9kbj0YT8aTiZTybTqYz6azmZz2bzuYL+aLhZLxbLpYr5arlZr1brtYb9abjZbzbbrY77a7nZ73b7vYH/aHg5Hw7Ho4n8djk5n47ns4X86Xi5Xy7Xq43663m53273u4P+6Ph5Px7Pp4v56vl5v17vt4f96fj5fz7fr4/76/n5/37/v4A/8gMAkDgLA0CIPAqDJGnaC4MghD4KQxCUOQtDUIw9CsMwnDsLw3CCPwojCJI4jv1g0jKLIqiaOoujaIY+imMYljmLY1iOPYrjOJ47i+N4gT+KEwSROEsTRIk8SpMkmTpLk2SFPkpTFJU5S1NUjT1K0zSdO02kKL03SjMMkzjLM0yLPMqzLJs6y7Nshz7KcxyXOctzXI89yvM8nzvL83yAv8oLApC4KwtCiLwqiyKYuiuLYoStyDPilLErS1KMvSrLMpy7K8tygr8qKwqSuKsqROS8qqtKmrqrq2qGvqprGpa5q2tajr2q6zqeu6vreoG/qhsGkbhrG0aJvGqbJpm6a5tmhb5qWxaVuWmBKtWza1q2nbtr23aDv2o7DpO46ztOi7zquy6buuu7boe+6nsel7nre16Pver7Pp+76/t+gH/pVQGQaB0HwbByGIehqHYZh+G4cRhHkaR1GUfRtHMYx7GsdxnH8bxwmCeJonSZJ8mycpinqap2mafpunGYZ5mmdZln2bZzmOe5kwNq5/mecFgXhaF0WRfFsXJYl6WpdlmX5blxWFeVpXVZV9W1c1jXta13Wdf1vXDYNxE+aNs3jfNy2Letq3bZt+27cdh3nad12Xfdt3PY972vd9n3/b9wOA+DoPQ5D8OStNiPo7D2OY/juPE4T5Ok9TlP07Tpko8zjPc5z/O88Lgvi6L0uS/LsvK4r6uq9rmv67rxuG+bpvW5b9u287jvu/u7Ou/7nvB4H4eh9Hkfx7HyeJ+nqfZ5n+e58Xhfl6X1eV/XtfN437et93nf973w+D+Po/T5P8+z8vi/r5Wvur/vm/H4f1cgA");

            assert.equal(filter.checkEntry("5a4f3bdf-476c-45e9-bd78-ab13ccc47255"), true);
        });

        it('should return valid base64 output on export', function() {
            assert.equal(typeof btoa(filter.exportData()), "string");
        });
    });
});