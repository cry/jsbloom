#jsbloom

A fast bloom filter implementation in JavaScript using the djb2 and sdbm algorithms. 

From _Less Hashing, Same Performance: Building a Better Bloom Filter_ by Adam Kirsch et al, it is possible to build _k_ hash values from only _2_ unique values. Hence, it is sufficient to have two unique hashes generated.

### Settings

    BUFFER_LEN: amount of bits within the buffer
    HASH_ROUNDS: amount of hashes to use (i.e. k)

### API reference

    bloom.addEntry(str): adds str to bloom filter
    bloom.checkEntry(str): checks if str in filter, returns false if __definitely not__, true if __maybe__
    bloom.loadPrevious(base64): loads a base64 encoded Uint8Array
    bloom.export(): returns the Uint8Array in base64 encoding
