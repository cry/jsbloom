(function(bloom) {

    /*
     * Constants
     * 500,000 entries with 1E-10 chance of false positive
     */

    let BUFFER_LEN      = 23962646,
        HASH_ROUNDS     = 33;

    let bVector         = new Uint8Array(BUFFER_LEN);

    bloom.hashes = {
        djb2: function(str) {
            let hash = 5381;

            for (var len = str.length, count = 0; count < len; count++) {
                hash = hash * 33 ^ str.charCodeAt(count);   
            };

            return (hash >>> 0) % BUFFER_LEN;
        },
        sdbm: function(str) {
            let hash = 0;

            for (var len = str.length, count = 0; count < len; count++) {
                hash = str.charCodeAt(count) + (hash << 6) + (hash << 16) - hash;
            };

            return (hash >>> 0) % BUFFER_LEN;
        },
        get_indices: function(str) {

            /*
             *
             * Referencing http://citeseer.ist.psu.edu/viewdoc/download;jsessionid=4060353E67A356EF9528D2C57C064F5A?doi=10.1.1.152.579&rep=rep1&type=pdf
             * Only two unique hash functions are required to obtain an arbitrary amount of hash values following the eq
             * g_i(x) = h_1(x) + i*h_2(x) + i^2 % m
             *
             */

            let hashes = [];

            hashes.push(this.djb2(str));
            hashes.push(this.sdbm(str));

            for (var round = 2; round <= HASH_ROUNDS; round++) {
                var new_hash = (hashes[0] + (round * hashes[1]) + (round^2)) % BUFFER_LEN;

                hashes.push(new_hash);
            };

            return hashes;

        }
    }

    bloom.addEntry = function(str) {
        let indices = bloom.hashes.get_indices(str);

        for (var i = indices.length - 1; i >= 0; i--) {
            bVector[indices[i]] = 1;
        };
    }

    bloom.checkEntry = function(str) {
        let indices = bloom.hashes.get_indices(str);

        for (var i = indices.length - 1; i >= 0; i--) {
            if (bVector[indices[i]] == 0) {
                return false;
            };
        };

        return true;
    }

    bloom.loadPrevious = function(b) {

        try {
            var data = atob(b);
        } catch (err) {
            throw Error("Data passed to loadPrevious must be base64 encoded");
        }

        let len = data.length;

        for (var i = data.length - 1; i >= 0; i--) {
            bVector[i] = data[i];
        };

    }

    bloom.export = function() {
        return btoa(bVector);
    }


})(window.bloom = window.bloom || {});