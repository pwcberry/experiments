'use strict';

let map = new Map([
	[1, "one"],
	[2, "two"],
	[3, "three"]
]);

let sum = 0;
let combined = "";

for (let pair of map) {
	sum += pair[0];
	combined += pair[1];
}

console.log("size    : %d", map.size);
console.log("sum     : %d", sum);
console.log("combined: %s", combined);


/*for (let [key, value] of map) {
	console.log(`[${key}]="${value}"`);
}*/
