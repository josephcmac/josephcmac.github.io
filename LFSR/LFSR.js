function main() {
    //message
    const msg = document.getElementById('messageid').value.split("").map( x => x=='0'?0:1);
    //key
    const key = document.getElementById('keyid').value.split("").map( x => x=='0'?0:1);
    //initial vector
    const iv = document.getElementById('ivid').value.split("").map( x => x=='0'?0:1);

    //the key and the initial vector have the same length
    if (key.length == iv.length) {
        //enlargement of the key
        const bitkey = [];
        bitkey.push(...iv);
        let sum = 0;
        for (i = 0; i < msg.length; i++) {
            sum = 0;
            for (j = 0; j < iv.length; j++) {
                sum += key[j]*bitkey[ i + (iv.length - 1 - j) ];
            }
            bitkey.push( sum%2 );
        }

        //one-time pad with the enlarged key
        const s = [];
        for (i = 0; i < msg.length; i++) {
            s.push( msg[i]==bitkey[i+iv.length] ? '0' : '1' );
        }
        document.getElementById('outputid').innerHTML = "output: " + s.join('');
        console.log(key);
        console.log(iv);
        console.log(bitkey);
    } else {
        document.getElementById('outputid').innerHTML = "The length of the key and the initial vector are different. They must be the same."
    }

}
