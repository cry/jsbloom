#jsbloom

A fast counting bloom filter implementation in JavaScript using the djb2 and sdbm algorithms. 

From _Less Hashing, Same Performance: Building a Better Bloom Filter_ by Adam Kirsch et al, it is possible to build _k_ hash values from only _2_ unique values. Hence, it is sufficient to have two unique hashes generated.

### Settings

    BUFFER_LEN: amount of bits within the buffer
    HASH_ROUNDS: amount of hashes to use (i.e. k)

### API reference

    bloom.addEntry(str): adds str to bloom filter
    bloom.addEntries(arr): iterates over arr and adds every entry within
    bloom.deleteEntry(str): removes str from bloom filter
    bloom.deleteEntries(arr): iterates over arr and deletes every entry within
    bloom.checkEntry(str): checks if str in filter, returns false if definitely not, true if maybe
    bloom.loadPrevious(base64): loads a base 64 LZW compressed Uint8Array
    bloom.export(callback): returns the base 64 encoded Uint8Array LZW compressed
