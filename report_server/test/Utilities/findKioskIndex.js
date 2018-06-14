function findKioskIndex(kiosks, kioskName) {
	for (let i=0; i<kiosks.length; i++) {
		if (kiosks[i].name === kioskName) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}

module.exports = findKioskIndex;




