/**
 * Callback function called on Object values, determining whether the inputted value is searched for or not.
 * @callback findInObjCb
 * @param {*} val Value stored in object
 * @param {...any} [args] Additional arguments
 * @returns {Boolean}
 */

/**
 * Calls `cb` on each value of the Object. If `cb` returns `true`, the key of the value will be returned. If options.single is set to `false`, all keys, for which `cb` returns true, will be returned.
 * @param {Object} obj
 * @param {Object} [options] Optional options. Can be left out.
 * @param {Boolean} [options.single=true] Indicates whether the first key, for which `cb()` returned true, should be returned. Defaults to true
 * @param {findInObjCb} cb
 * @param  {...any} args Additional arguments to feed into `cb`.
 * @returns {?String | String[]} If options.single is set to true, the function will either return the first found key or `null`. Otherwise, an array containing all found keys will be returned (if none were found, an empty array is returned).
 */
function findInObj(obj, options, cb, ...args) {
	const DEFAULT_OPTIONS = { single: true };

	// if options arg is left out
	if (typeof options === 'function') {
		args.unshift(cb);
		cb = options;
	} else if (options) options = { ...DEFAULT_OPTIONS, ...options };
	else options = DEFAULT_OPTIONS;

	// if cb is not a function
	if (typeof cb !== 'function') cb = (val) => val === cb;

	const keys = Object.keys(obj);
	const found = [];
	for (let i = 0; i < keys.length; i++) {
		const result = cb(obj[keys[i]], ...args);
		if (result && options.single) return keys[i];
		else if (result) found.push(keys[i]);
	}
	return options.single ? null : found;
}
module.exports.findInObj = findInObj;
