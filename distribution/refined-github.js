/*! For license information please see refined-github.js.LICENSE.txt */
(() => {
  var __webpack_modules__ = {
    664: (__unused_webpack_module, exports) => {
      "use strict";
      exports._ = void 0;
      const t = {
        "@hourly": "0 * * * *",
        "@daily": "0 0 * * *",
        "@weekly": "0 0 * * 0",
        "@monthly": "0 0 1 * *",
        "@yearly": "0 0 1 1 *",
        "@annually": "0 0 1 1 *"
      };
      function e(r) {
        const n = r.trim().split(/\s+/);
        if (1 == n.length) return n[0] in t ? e(t[n[0]]) : void 0;
        if (5 == n.length) {
          let t;
          try {
            t = {
              minutes: s(n[0], 0, 59),
              hours: s(n[1], 0, 23),
              days: s(n[2], 1, 31),
              months: s(n[3], 1, 12, [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]),
              weekDays: s(n[4], 0, 6, [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ])
            };
          } catch (t) {
            return;
          }
          return t;
        }
      }
      exports._ = e;
      const r = "(\\d{1,2}|[a-z]{3})", n = new RegExp(`^${r}(?:-${r})?$`, "i");
      function s(t, e, r, s = []) {
        const o = Array.from(new Set(t.split(",").flatMap((t => {
          const [o, u = "1"] = t.split("/", 2), a = parseInt(u, 10);
          if (Number.isNaN(a)) throw Error();
          if ("*" == o) return i(e, r, a);
          const c = o.match(n);
          if (!c) throw Error();
          const [l, f = (t.includes("/") ? r : void 0)] = c.slice(1).map((t => {
            if (s.includes(t)) return s.indexOf(t);
            const n = parseInt(t, 10);
            return !Number.isNaN(n) && e <= n && n <= r ? n : void 0;
          }));
          if (void 0 === l || void 0 !== f && f < l) throw Error();
          return null == f ? [ l ] : i(l, f, a);
        }))));
        return o.sort(((t, e) => t - e)), o;
      }
      function o(t) {
        return new Date(Date.UTC(t.years, t.months - 1, t.days, t.hours, t.minutes));
      }
      function i(t, e, r) {
        return Array.from({
          length: Math.floor((e - t) / r) + 1
        }).map(((e, n) => t + n * r));
      }
      e.nextDate = function(t, r = new Date) {
        const n = "string" == typeof t ? e(t) : t;
        if (void 0 === n) return;
        const s = {
          years: r.getUTCFullYear(),
          months: r.getUTCMonth() + 1,
          days: r.getUTCDate(),
          hours: r.getUTCHours(),
          minutes: r.getUTCMinutes() + 1
        }, i = Object.keys(s);
        for (let t = 1; t < i.length; t++) {
          const e = i[t];
          if (!n[e].includes(s[e])) {
            i.filter(((e, r) => r > t)).forEach((t => s[t] = n[t][0]));
            const r = n[e].find((t => t >= s[e]));
            void 0 !== r ? s[e] = r : (s[e] = n[e][0], s[i[t - 1]]++, t = "months" != e ? t - 2 : t);
          }
          "days" != e || n.weekDays.includes(o(s).getUTCDay()) || (s.days++, s.hours = n.hours[0], 
          s.minutes = n.minutes[0], t = 1);
        }
        return o(s);
      };
    },
    927: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      const stringifyAttributes = __webpack_require__(14), htmlTags = __webpack_require__(316), escapeGoat = __webpack_require__(37), voidHtmlTags = new Set(htmlTags);
      module.exports = options => {
        if ((options = Object.assign({
          name: "div",
          attributes: {},
          html: ""
        }, options)).html && options.text) throw new Error("The `html` and `text` options are mutually exclusive");
        const content = options.text ? escapeGoat.escape(options.text) : options.html;
        let result = `<${options.name}${stringifyAttributes(options.attributes)}>`;
        return voidHtmlTags.has(options.name) || (result += `${content}</${options.name}>`), 
        result;
      };
    },
    792: module => {
      "use strict";
      const createAbortError = () => {
        const error = new Error("Delay aborted");
        return error.name = "AbortError", error;
      }, createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
        if (signal && signal.aborted) return Promise.reject(createAbortError());
        let timeoutId, settle, rejectFn;
        const clear = defaultClear || clearTimeout, signalListener = () => {
          clear(timeoutId), rejectFn(createAbortError());
        }, delayPromise = new Promise(((resolve, reject) => {
          settle = () => {
            signal && signal.removeEventListener("abort", signalListener), willResolve ? resolve(value) : reject(value);
          }, rejectFn = reject, timeoutId = (set || setTimeout)(settle, ms);
        }));
        return signal && signal.addEventListener("abort", signalListener, {
          once: !0
        }), delayPromise.clear = () => {
          clear(timeoutId), timeoutId = null, settle();
        }, delayPromise;
      }, createWithTimers = clearAndSet => {
        const delay = createDelay({
          ...clearAndSet,
          willResolve: !0
        });
        return delay.reject = createDelay({
          ...clearAndSet,
          willResolve: !1
        }), delay.range = (minimum, maximum, options) => delay(((minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1) + minimum))(minimum, maximum), options), 
        delay;
      }, delay = createWithTimers();
      delay.createWithTimers = createWithTimers, module.exports = delay, module.exports.default = delay;
    },
    37: (__unused_webpack_module, exports) => {
      "use strict";
      exports.escape = input => input.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
      exports.unescape = input => input.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&"), 
      exports.escapeTag = function(input) {
        let output = input[0];
        for (let i = 1; i < arguments.length; i++) output = output + exports.escape(arguments[i]) + input[i];
        return output;
      }, exports.unescapeTag = function(input) {
        let output = input[0];
        for (let i = 1; i < arguments.length; i++) output = output + exports.unescape(arguments[i]) + input[i];
        return output;
      };
    },
    316: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      module.exports = __webpack_require__(555);
    },
    324: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      function __export(m) {
        for (var p in m) exports.hasOwnProperty(p) || (exports[p] = m[p]);
      }
      Object.defineProperty(exports, "__esModule", {
        value: !0
      }), __export(__webpack_require__(633)), __export(__webpack_require__(210));
    },
    633: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: !0
      });
      var defaultOptions = {
        padding: !0,
        symbols: __webpack_require__(393).defaultSymbols
      };
      exports.abbreviateNumber = function(num, digit, options) {
        void 0 === digit && (digit = 1), Array.isArray(options) && (options = {
          symbols: options
        });
        var _a = Object.assign({}, defaultOptions, options), symbols = _a.symbols, padding = _a.padding, sign = Math.sign(num) >= 0;
        num = Math.abs(num);
        var tier = Math.log10(num) / 3 | 0;
        if (0 == tier) return (sign ? "" : "-") + num.toString();
        var suffix = symbols[tier];
        if (!suffix) throw new RangeError;
        var rounded = (num / Math.pow(10, 3 * tier)).toFixed(digit);
        return padding || (rounded = String(Number(rounded))), (sign ? "" : "-") + rounded + suffix;
      };
    },
    393: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: !0
      }), exports.defaultSymbols = [ "", "k", "M", "G", "T", "P", "E" ];
    },
    210: (__unused_webpack_module, exports, __webpack_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: !0
      });
      var const_1 = __webpack_require__(393), utils_1 = __webpack_require__(784);
      exports.unabbreviateNumber = function(num, symbols) {
        void 0 === symbols && (symbols = const_1.defaultSymbols);
        var pattern = "^([+-]?([0-9]*[.])?[0-9]+)(" + ("" + symbols.join("|")) + ")$", regex = new RegExp(pattern), match = num.match(pattern) || [];
        if (regex.test(num) && match.length > 3) {
          var symbol = match[3], symbolValue = utils_1.symbolPow(symbols.indexOf(symbol));
          return Number(match[1]) * symbolValue;
        }
        throw Error("This is not a valid input");
      };
    },
    784: (__unused_webpack_module, exports) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: !0
      }), exports.symbolPow = function(index) {
        return void 0 === index && (index = 0), Math.pow(10, 3 * index);
      };
    },
    93: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      const createHtmlElement = __webpack_require__(927);
      let groupedIssueRegex;
      try {
        groupedIssueRegex = new RegExp("((?:(?<![\\/\\w-.])\\w[\\w-.]+\\/\\w[\\w-.]+|\\B)#[1-9]\\d*\\b)", "g");
      } catch (error) {
        groupedIssueRegex = new RegExp("((?:\\w[\\w-.]+\\/\\w[\\w-.]+|\\B)#[1-9]\\d*\\b)", "g");
      }
      const linkify = (match, options) => {
        const fullReference = match.replace(/^#/, `${options.user}/${options.repository}#`), [userRepository, issue] = fullReference.split("#"), href = `${options.baseUrl}/${userRepository}/issues/${issue}`;
        return createHtmlElement({
          name: "a",
          attributes: {
            href: "",
            ...options.attributes,
            href
          },
          text: match
        });
      }, getAsDocumentFragment = (string, options) => string.split(groupedIssueRegex).reduce(((fragment, text, index) => {
        var html;
        return index % 2 ? fragment.append((html = linkify(text, options), document.createRange().createContextualFragment(html))) : text.length > 0 && fragment.append(document.createTextNode(text)), 
        fragment;
      }), document.createDocumentFragment());
      module.exports = (string, options) => {
        if (!(options = {
          attributes: {},
          baseUrl: "https://github.com",
          type: "string",
          ...options
        }).user || !options.repository) throw new Error("Missing required `user` and `repository` options");
        if ("string" === options.type) return ((string, options) => string.replace(groupedIssueRegex, (match => linkify(match, options))))(string, options);
        if ("dom" === options.type) return getAsDocumentFragment(string, options);
        throw new Error("The `type` option must be either `dom` or `string`");
      };
    },
    295: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      const createHtmlElement = __webpack_require__(927), urlRegex = () => {
        try {
          return new RegExp("((?<!\\+)(?:https?(?::\\/\\/))(?:www\\.)?(?:[a-zA-Z\\d-_.]+(?:(?:\\.|@)[a-zA-Z\\d]{2,})|localhost)(?:(?:[-a-zA-Z\\d:%_+.~#!?&\\/\\/=@]*)(?:[,](?![\\s]))*)*)", "g");
        } catch {
          return new RegExp("((?:https?(?::\\/\\/))(?:www\\.)?(?:[a-zA-Z\\d-_.]+(?:(?:\\.|@)[a-zA-Z\\d]{2,})|localhost)(?:(?:[-a-zA-Z\\d:%_+.~#!?&//=@]*)(?:[,](?![\\s]))*)*)", "g");
        }
      }, linkify = (href, options) => createHtmlElement({
        name: "a",
        attributes: {
          href: "",
          ...options.attributes,
          href
        },
        text: void 0 === options.value ? href : void 0,
        html: void 0 === options.value ? void 0 : "function" == typeof options.value ? options.value(href) : options.value
      }), getAsDocumentFragment = (string, options) => string.split(urlRegex()).reduce(((fragment, text, index) => {
        var html;
        return index % 2 ? fragment.append((html = linkify(text, options), document.createRange().createContextualFragment(html))) : text.length > 0 && fragment.append(document.createTextNode(text)), 
        fragment;
      }), document.createDocumentFragment());
      module.exports = (string, options) => {
        if ("string" === (options = {
          attributes: {},
          type: "string",
          ...options
        }).type) return ((string, options) => string.replace(urlRegex(), (match => linkify(match, options))))(string, options);
        if ("dom" === options.type) return getAsDocumentFragment(string, options);
        throw new Error("The type option must be either `dom` or `string`");
      };
    },
    774: module => {
      "use strict";
      const nullKey = Symbol("null");
      let keyCounter = 0;
      module.exports = class extends Map {
        constructor() {
          super(), this._objectHashes = new WeakMap, this._symbolHashes = new Map, this._publicKeys = new Map;
          const [pairs] = arguments;
          if (null != pairs) {
            if ("function" != typeof pairs[Symbol.iterator]) throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
            for (const [keys, value] of pairs) this.set(keys, value);
          }
        }
        _getPublicKeys(keys, create = !1) {
          if (!Array.isArray(keys)) throw new TypeError("The keys parameter must be an array");
          const privateKey = this._getPrivateKey(keys, create);
          let publicKey;
          return privateKey && this._publicKeys.has(privateKey) ? publicKey = this._publicKeys.get(privateKey) : create && (publicKey = [ ...keys ], 
          this._publicKeys.set(privateKey, publicKey)), {
            privateKey,
            publicKey
          };
        }
        _getPrivateKey(keys, create = !1) {
          const privateKeys = [];
          for (let key of keys) {
            null === key && (key = nullKey);
            const hashes = "object" == typeof key || "function" == typeof key ? "_objectHashes" : "symbol" == typeof key && "_symbolHashes";
            if (hashes) if (this[hashes].has(key)) privateKeys.push(this[hashes].get(key)); else {
              if (!create) return !1;
              {
                const privateKey = `@@mkm-ref-${keyCounter++}@@`;
                this[hashes].set(key, privateKey), privateKeys.push(privateKey);
              }
            } else privateKeys.push(key);
          }
          return JSON.stringify(privateKeys);
        }
        set(keys, value) {
          const {publicKey} = this._getPublicKeys(keys, !0);
          return super.set(publicKey, value);
        }
        get(keys) {
          const {publicKey} = this._getPublicKeys(keys);
          return super.get(publicKey);
        }
        has(keys) {
          const {publicKey} = this._getPublicKeys(keys);
          return super.has(publicKey);
        }
        delete(keys) {
          const {publicKey, privateKey} = this._getPublicKeys(keys);
          return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
        }
        clear() {
          super.clear(), this._symbolHashes.clear(), this._publicKeys.clear();
        }
        get [Symbol.toStringTag]() {
          return "ManyKeysMap";
        }
        get size() {
          return super.size;
        }
      };
    },
    494: function(module, exports, __webpack_require__) {
      "use strict";
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : new P((function(resolve) {
              resolve(result.value);
            })).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
      }, __importDefault = this && this.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : {
          default: mod
        };
      };
      Object.defineProperty(exports, "__esModule", {
        value: !0
      });
      const p_defer_1 = __importDefault(__webpack_require__(850));
      function mapAgeCleaner(map, property = "maxAge") {
        let processingKey, processingTimer, processingDeferred;
        const cleanup = () => __awaiter(this, void 0, void 0, (function*() {
          if (void 0 !== processingKey) return;
          const setupTimer = item => __awaiter(this, void 0, void 0, (function*() {
            processingDeferred = p_defer_1.default();
            const delay = item[1][property] - Date.now();
            return delay <= 0 ? (map.delete(item[0]), void processingDeferred.resolve()) : (processingKey = item[0], 
            processingTimer = setTimeout((() => {
              map.delete(item[0]), processingDeferred && processingDeferred.resolve();
            }), delay), "function" == typeof processingTimer.unref && processingTimer.unref(), 
            processingDeferred.promise);
          }));
          try {
            for (const entry of map) yield setupTimer(entry);
          } catch (_a) {}
          processingKey = void 0;
        })), originalSet = map.set.bind(map);
        return map.set = (key, value) => {
          map.has(key) && map.delete(key);
          const result = originalSet(key, value);
          return processingKey && processingKey === key && (processingKey = void 0, void 0 !== processingTimer && (clearTimeout(processingTimer), 
          processingTimer = void 0), void 0 !== processingDeferred && (processingDeferred.reject(void 0), 
          processingDeferred = void 0)), cleanup(), result;
        }, cleanup(), map;
      }
      exports.default = mapAgeCleaner, module.exports = mapAgeCleaner, module.exports.default = mapAgeCleaner;
    },
    850: module => {
      "use strict";
      module.exports = () => {
        const ret = {};
        return ret.promise = new Promise(((resolve, reject) => {
          ret.resolve = resolve, ret.reject = reject;
        })), ret;
      };
    },
    710: function(module) {
      module.exports = function() {
        "use strict";
        var DEFAULT_OPTIONS_KEYS = {
          isEqual: !0,
          isMatchingKey: !0,
          isPromise: !0,
          maxSize: !0,
          onCacheAdd: !0,
          onCacheChange: !0,
          onCacheHit: !0,
          transformKey: !0
        }, slice = Array.prototype.slice;
        function cloneArray(arrayLike) {
          var length = arrayLike.length;
          return length ? 1 === length ? [ arrayLike[0] ] : 2 === length ? [ arrayLike[0], arrayLike[1] ] : 3 === length ? [ arrayLike[0], arrayLike[1], arrayLike[2] ] : slice.call(arrayLike, 0) : [];
        }
        function getCustomOptions(options) {
          var customOptions = {};
          for (var key in options) DEFAULT_OPTIONS_KEYS[key] || (customOptions[key] = options[key]);
          return customOptions;
        }
        function isMemoized(fn) {
          return "function" == typeof fn && fn.isMemoized;
        }
        function isSameValueZero(object1, object2) {
          return object1 === object2 || object1 != object1 && object2 != object2;
        }
        function mergeOptions(existingOptions, newOptions) {
          var target = {};
          for (var key in existingOptions) target[key] = existingOptions[key];
          for (var key in newOptions) target[key] = newOptions[key];
          return target;
        }
        var Cache = function() {
          function Cache(options) {
            this.keys = [], this.values = [], this.options = options;
            var isMatchingKeyFunction = "function" == typeof options.isMatchingKey;
            isMatchingKeyFunction ? this.getKeyIndex = this._getKeyIndexFromMatchingKey : options.maxSize > 1 ? this.getKeyIndex = this._getKeyIndexForMany : this.getKeyIndex = this._getKeyIndexForSingle, 
            this.canTransformKey = "function" == typeof options.transformKey, this.shouldCloneArguments = this.canTransformKey || isMatchingKeyFunction, 
            this.shouldUpdateOnAdd = "function" == typeof options.onCacheAdd, this.shouldUpdateOnChange = "function" == typeof options.onCacheChange, 
            this.shouldUpdateOnHit = "function" == typeof options.onCacheHit;
          }
          return Object.defineProperty(Cache.prototype, "size", {
            get: function() {
              return this.keys.length;
            },
            enumerable: !1,
            configurable: !0
          }), Object.defineProperty(Cache.prototype, "snapshot", {
            get: function() {
              return {
                keys: cloneArray(this.keys),
                size: this.size,
                values: cloneArray(this.values)
              };
            },
            enumerable: !1,
            configurable: !0
          }), Cache.prototype._getKeyIndexFromMatchingKey = function(keyToMatch) {
            var _a = this.options, isMatchingKey = _a.isMatchingKey, maxSize = _a.maxSize, keys = this.keys, keysLength = keys.length;
            if (!keysLength) return -1;
            if (isMatchingKey(keys[0], keyToMatch)) return 0;
            if (maxSize > 1) for (var index = 1; index < keysLength; index++) if (isMatchingKey(keys[index], keyToMatch)) return index;
            return -1;
          }, Cache.prototype._getKeyIndexForMany = function(keyToMatch) {
            var isEqual = this.options.isEqual, keys = this.keys, keysLength = keys.length;
            if (!keysLength) return -1;
            if (1 === keysLength) return this._getKeyIndexForSingle(keyToMatch);
            var existingKey, argIndex, keyLength = keyToMatch.length;
            if (keyLength > 1) {
              for (var index = 0; index < keysLength; index++) if ((existingKey = keys[index]).length === keyLength) {
                for (argIndex = 0; argIndex < keyLength && isEqual(existingKey[argIndex], keyToMatch[argIndex]); argIndex++) ;
                if (argIndex === keyLength) return index;
              }
            } else for (index = 0; index < keysLength; index++) if ((existingKey = keys[index]).length === keyLength && isEqual(existingKey[0], keyToMatch[0])) return index;
            return -1;
          }, Cache.prototype._getKeyIndexForSingle = function(keyToMatch) {
            var keys = this.keys;
            if (!keys.length) return -1;
            var existingKey = keys[0], length = existingKey.length;
            if (keyToMatch.length !== length) return -1;
            var isEqual = this.options.isEqual;
            if (length > 1) {
              for (var index = 0; index < length; index++) if (!isEqual(existingKey[index], keyToMatch[index])) return -1;
              return 0;
            }
            return isEqual(existingKey[0], keyToMatch[0]) ? 0 : -1;
          }, Cache.prototype.orderByLru = function(key, value, startingIndex) {
            for (var keys = this.keys, values = this.values, currentLength = keys.length, index = startingIndex; index--; ) keys[index + 1] = keys[index], 
            values[index + 1] = values[index];
            keys[0] = key, values[0] = value;
            var maxSize = this.options.maxSize;
            currentLength === maxSize && startingIndex === currentLength ? (keys.pop(), values.pop()) : startingIndex >= maxSize && (keys.length = values.length = maxSize);
          }, Cache.prototype.updateAsyncCache = function(memoized) {
            var _this = this, _a = this.options, onCacheChange = _a.onCacheChange, onCacheHit = _a.onCacheHit, firstKey = this.keys[0], firstValue = this.values[0];
            this.values[0] = firstValue.then((function(value) {
              return _this.shouldUpdateOnHit && onCacheHit(_this, _this.options, memoized), _this.shouldUpdateOnChange && onCacheChange(_this, _this.options, memoized), 
              value;
            }), (function(error) {
              var keyIndex = _this.getKeyIndex(firstKey);
              throw -1 !== keyIndex && (_this.keys.splice(keyIndex, 1), _this.values.splice(keyIndex, 1)), 
              error;
            }));
          }, Cache;
        }();
        function createMemoizedFunction(fn, options) {
          if (void 0 === options && (options = {}), isMemoized(fn)) return createMemoizedFunction(fn.fn, mergeOptions(fn.options, options));
          if ("function" != typeof fn) throw new TypeError("You must pass a function to `memoize`.");
          var _a = options.isEqual, isEqual = void 0 === _a ? isSameValueZero : _a, isMatchingKey = options.isMatchingKey, _b = options.isPromise, isPromise = void 0 !== _b && _b, _c = options.maxSize, maxSize = void 0 === _c ? 1 : _c, onCacheAdd = options.onCacheAdd, onCacheChange = options.onCacheChange, onCacheHit = options.onCacheHit, transformKey = options.transformKey, normalizedOptions = mergeOptions({
            isEqual,
            isMatchingKey,
            isPromise,
            maxSize,
            onCacheAdd,
            onCacheChange,
            onCacheHit,
            transformKey
          }, getCustomOptions(options)), cache = new Cache(normalizedOptions), keys = cache.keys, values = cache.values, canTransformKey = cache.canTransformKey, shouldCloneArguments = cache.shouldCloneArguments, shouldUpdateOnAdd = cache.shouldUpdateOnAdd, shouldUpdateOnChange = cache.shouldUpdateOnChange, shouldUpdateOnHit = cache.shouldUpdateOnHit, memoized = function memoized() {
            var key = shouldCloneArguments ? cloneArray(arguments) : arguments;
            canTransformKey && (key = transformKey(key));
            var keyIndex = keys.length ? cache.getKeyIndex(key) : -1;
            if (-1 !== keyIndex) shouldUpdateOnHit && onCacheHit(cache, normalizedOptions, memoized), 
            keyIndex && (cache.orderByLru(keys[keyIndex], values[keyIndex], keyIndex), shouldUpdateOnChange && onCacheChange(cache, normalizedOptions, memoized)); else {
              var newValue = fn.apply(this, arguments), newKey = shouldCloneArguments ? key : cloneArray(arguments);
              cache.orderByLru(newKey, newValue, keys.length), isPromise && cache.updateAsyncCache(memoized), 
              shouldUpdateOnAdd && onCacheAdd(cache, normalizedOptions, memoized), shouldUpdateOnChange && onCacheChange(cache, normalizedOptions, memoized);
            }
            return values[0];
          };
          return memoized.cache = cache, memoized.fn = fn, memoized.isMemoized = !0, memoized.options = normalizedOptions, 
          memoized;
        }
        return createMemoizedFunction;
      }();
    },
    772: module => {
      "use strict";
      module.exports = string => {
        const match = string.match(/^[ \t]*(?=\S)/gm);
        return match ? match.reduce(((r, a) => Math.min(r, a.length)), 1 / 0) : 0;
      };
    },
    22: (module, __unused_webpack_exports, __webpack_require__) => {
      module.exports = __webpack_require__(813);
    },
    813: (__unused_webpack_module, exports, __webpack_require__) => {
      var RetryOperation = __webpack_require__(579);
      exports.operation = function(options) {
        var timeouts = exports.timeouts(options);
        return new RetryOperation(timeouts, {
          forever: options && (options.forever || options.retries === 1 / 0),
          unref: options && options.unref,
          maxRetryTime: options && options.maxRetryTime
        });
      }, exports.timeouts = function(options) {
        if (options instanceof Array) return [].concat(options);
        var opts = {
          retries: 10,
          factor: 2,
          minTimeout: 1e3,
          maxTimeout: 1 / 0,
          randomize: !1
        };
        for (var key in options) opts[key] = options[key];
        if (opts.minTimeout > opts.maxTimeout) throw new Error("minTimeout is greater than maxTimeout");
        for (var timeouts = [], i = 0; i < opts.retries; i++) timeouts.push(this.createTimeout(i, opts));
        return options && options.forever && !timeouts.length && timeouts.push(this.createTimeout(i, opts)), 
        timeouts.sort((function(a, b) {
          return a - b;
        })), timeouts;
      }, exports.createTimeout = function(attempt, opts) {
        var random = opts.randomize ? Math.random() + 1 : 1, timeout = Math.round(random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt));
        return timeout = Math.min(timeout, opts.maxTimeout);
      }, exports.wrap = function(obj, options, methods) {
        if (options instanceof Array && (methods = options, options = null), !methods) for (var key in methods = [], 
        obj) "function" == typeof obj[key] && methods.push(key);
        for (var i = 0; i < methods.length; i++) {
          var method = methods[i], original = obj[method];
          obj[method] = function(original) {
            var op = exports.operation(options), args = Array.prototype.slice.call(arguments, 1), callback = args.pop();
            args.push((function(err) {
              op.retry(err) || (err && (arguments[0] = op.mainError()), callback.apply(this, arguments));
            })), op.attempt((function() {
              original.apply(obj, args);
            }));
          }.bind(obj, original), obj[method].options = options;
        }
      };
    },
    579: module => {
      function RetryOperation(timeouts, options) {
        "boolean" == typeof options && (options = {
          forever: options
        }), this._originalTimeouts = JSON.parse(JSON.stringify(timeouts)), this._timeouts = timeouts, 
        this._options = options || {}, this._maxRetryTime = options && options.maxRetryTime || 1 / 0, 
        this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, 
        this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, 
        this._timer = null, this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0));
      }
      module.exports = RetryOperation, RetryOperation.prototype.reset = function() {
        this._attempts = 1, this._timeouts = this._originalTimeouts.slice(0);
      }, RetryOperation.prototype.stop = function() {
        this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), 
        this._timeouts = [], this._cachedTimeouts = null;
      }, RetryOperation.prototype.retry = function(err) {
        if (this._timeout && clearTimeout(this._timeout), !err) return !1;
        var currentTime = (new Date).getTime();
        if (err && currentTime - this._operationStart >= this._maxRetryTime) return this._errors.push(err), 
        this._errors.unshift(new Error("RetryOperation timeout occurred")), !1;
        this._errors.push(err);
        var timeout = this._timeouts.shift();
        if (void 0 === timeout) {
          if (!this._cachedTimeouts) return !1;
          this._errors.splice(0, this._errors.length - 1), timeout = this._cachedTimeouts.slice(-1);
        }
        var self = this;
        return this._timer = setTimeout((function() {
          self._attempts++, self._operationTimeoutCb && (self._timeout = setTimeout((function() {
            self._operationTimeoutCb(self._attempts);
          }), self._operationTimeout), self._options.unref && self._timeout.unref()), self._fn(self._attempts);
        }), timeout), this._options.unref && this._timer.unref(), !0;
      }, RetryOperation.prototype.attempt = function(fn, timeoutOps) {
        this._fn = fn, timeoutOps && (timeoutOps.timeout && (this._operationTimeout = timeoutOps.timeout), 
        timeoutOps.cb && (this._operationTimeoutCb = timeoutOps.cb));
        var self = this;
        this._operationTimeoutCb && (this._timeout = setTimeout((function() {
          self._operationTimeoutCb();
        }), self._operationTimeout)), this._operationStart = (new Date).getTime(), this._fn(this._attempts);
      }, RetryOperation.prototype.try = function(fn) {
        console.log("Using RetryOperation.try() is deprecated"), this.attempt(fn);
      }, RetryOperation.prototype.start = function(fn) {
        console.log("Using RetryOperation.start() is deprecated"), this.attempt(fn);
      }, RetryOperation.prototype.start = RetryOperation.prototype.try, RetryOperation.prototype.errors = function() {
        return this._errors;
      }, RetryOperation.prototype.attempts = function() {
        return this._attempts;
      }, RetryOperation.prototype.mainError = function() {
        if (0 === this._errors.length) return null;
        for (var counts = {}, mainError = null, mainErrorCount = 0, i = 0; i < this._errors.length; i++) {
          var error = this._errors[i], message = error.message, count = (counts[message] || 0) + 1;
          counts[message] = count, count >= mainErrorCount && (mainError = error, mainErrorCount = count);
        }
        return mainError;
      };
    },
    794: (module, __unused_webpack_exports, __webpack_require__) => {
      const reservedPaths = __webpack_require__(464), patchDiffRegex = /[.](patch|diff)$/, releaseRegex = /^releases[/]tag[/]([^/]+)/, labelRegex = /^labels[/]([^/]+)/, compareRegex = /^compare[/]([^/]+)/, pullRegex = /^pull[/](\d+)(?:[/]([^/]+))?(?:[/]([\da-f]{40})[.][.]([\da-f]{40}))?$/, issueRegex = /^issues[/](\d+)$/, commitRegex = /^commit[/]([\da-f]{40})$/, releaseArchiveRegex = /^archive[/](.+)([.]zip|[.]tar[.]gz)/, releaseDownloadRegex = /^releases[/]download[/]([^/]+)[/](.+)/, dependentsRegex = /^network[/]dependents[/]?$/, dependenciesRegex = /^network[/]dependencies[/]?$/;
      function commentIndicator(hash) {
        return hash.startsWith("#issue-") || hash.startsWith("#commitcomment-") ? " (comment)" : hash.startsWith("#pullrequestreview-") || hash.startsWith("#discussion_r") ? " (review)" : "";
      }
      function joinValues(array, delimiter = "/") {
        return array.filter(Boolean).join(delimiter);
      }
      function shortenURL(href, currentUrl = "https://github.com") {
        if (!href) return;
        const currentRepo = (currentUrl = new URL(currentUrl)).pathname.slice(1).split("/", 2).join("/"), url = new URL(href), {origin, pathname, search, searchParams, hash} = url, pathnameParts = pathname.slice(1).split("/"), repoPath = pathnameParts.slice(2).join("/"), isRaw = [ "https://raw.githubusercontent.com", "https://cdn.rawgit.com", "https://rawgit.com" ].includes(origin), isRedirection = [ "https://togithub.com", "https://github-redirect.dependabot.com" ].includes(origin);
        let [user, repo, type, revision, ...filePath] = pathnameParts;
        isRaw && ([user, repo, revision, ...filePath] = pathnameParts, type = "raw"), revision = function(revision) {
          if (revision) return revision = revision.replace(patchDiffRegex, ""), /^[0-9a-f]{40}$/.test(revision) && (revision = revision.slice(0, 7)), 
          `<code>${revision}</code>`;
        }(revision), filePath = filePath.join("/");
        const isLocal = origin === currentUrl.origin, isThisRepo = (isLocal || isRaw || isRedirection) && currentRepo === `${user}/${repo}`, isReserved = reservedPaths.includes(user), isDependents = dependentsRegex.test(repoPath), isDependencies = dependenciesRegex.test(repoPath), [, diffOrPatch] = repoPath.match(patchDiffRegex) || [], [, release] = repoPath.match(releaseRegex) || [], [, releaseTag, releaseTagExt] = repoPath.match(releaseArchiveRegex) || [], [, downloadTag, downloadFilename] = repoPath.match(releaseDownloadRegex) || [], [, label] = repoPath.match(labelRegex) || [], [, compare] = repoPath.match(compareRegex) || [], [, pull, pullPage, pullPartialStart, pullPartialEnd] = repoPath.match(pullRegex) || [], [, issue] = isRedirection && repoPath.match(issueRegex) || [], [, commit] = isRedirection && repoPath.match(commitRegex) || [], isFileOrDir = revision && [ "raw", "tree", "blob", "blame", "commits" ].includes(type), repoUrl = isThisRepo ? "" : `${user}/${repo}`;
        if (isReserved || "/" === pathname || !isLocal && !isRaw && !isRedirection) return href.replace(/^https:[/][/]/, "").replace(/^www[.]/, "").replace(/[/]$/, "");
        if (user && !repo) return `@${user}${search}${hash}`;
        if (isFileOrDir) {
          const partial = `${joinValues([ joinValues([ repoUrl, revision ], "@"), filePath ], "/")}${search}${hash}`;
          return "blob" !== type && "tree" !== type ? `${partial} (${type})` : partial;
        }
        if (diffOrPatch) {
          return `${joinValues([ repoUrl, revision ], "@")}.${diffOrPatch}${search}${hash}`;
        }
        if (release) {
          return `${joinValues([ repoUrl, `<code>${release}</code>` ], "@")}${search}${hash} (release)`;
        }
        if (releaseTagExt) {
          return `${joinValues([ repoUrl, `<code>${releaseTag}</code>` ], "@")}${releaseTagExt}${search}${hash}`;
        }
        if (downloadFilename) {
          return `${joinValues([ repoUrl, `<code>${downloadTag}</code>` ], "@")} ${downloadFilename}${search}${hash} (download)`;
        }
        if (label) return joinValues([ repoUrl, decodeURIComponent(label) ]) + `${search}${hash} (label)`;
        if (isDependents) return `${user}/${repo} (dependents)`;
        if (isDependencies) return `${user}/${repo} (dependencies)`;
        if (pull) {
          if ("files" === pullPage && pullPartialStart && pullPartialEnd) return `<code>${pullPartialStart.slice(0, 8)}..${pullPartialEnd.slice(0, 8)}</code> (#${pull})`;
          if (pullPage) return `${repoUrl}#${pull} (${pullPage})`;
        }
        if (compare) {
          return `${joinValues([ repoUrl, revision ], "@")}${search}${hash} (compare)`;
        }
        if (isRedirection) {
          if (issue) return `${repoUrl}#${issue}${commentIndicator(hash)}`;
          if (pull) return `${repoUrl}#${pull}${commentIndicator(hash)}`;
          if (commit) return joinValues([ repoUrl, `<code>${commit.slice(0, 7)}</code>` ], "@") + commentIndicator(hash);
        }
        let query = searchParams.get("q") ?? "";
        return query && (searchParams.delete("q"), pathname.endsWith("/issues") ? query = query.replace("is:issue", "") : pathname.endsWith("/pulls") && (query = query.replace("is:pr", "")), 
        query = ` (${query.replace(/\s+/g, " ").trim()})`), pathname.replace(/^[/]|[/]$/g, "") + url.search + hash + query;
      }
      module.exports = shortenURL, module.exports.applyToLink = function(a, currentUrl) {
        const url = a.dataset.originalHref ?? a.href;
        if ((url === a.textContent.trim() || url === `${a.textContent}/`) && !a.firstElementChild) {
          const shortened = shortenURL(url, currentUrl);
          return a.innerHTML = shortened, !0;
        }
        return !1;
      };
    },
    14: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      const escapeGoat = __webpack_require__(37);
      module.exports = input => {
        const attributes = [];
        for (const key of Object.keys(input)) {
          let value = input[key];
          if (!1 === value) continue;
          Array.isArray(value) && (value = value.join(" "));
          let attribute = escapeGoat.escape(key);
          !0 !== value && (attribute += `="${escapeGoat.escape(String(value))}"`), attributes.push(attribute);
        }
        return attributes.length > 0 ? " " + attributes.join(" ") : "";
      };
    },
    412: function(module, exports) {
      var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
      "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self && self, 
      __WEBPACK_AMD_DEFINE_ARRAY__ = [ module ], __WEBPACK_AMD_DEFINE_FACTORY__ = function(module) {
        "use strict";
        if (!globalThis.chrome?.runtime?.id) throw new Error("This script should only be loaded in a browser extension.");
        if (void 0 === globalThis.browser || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.", wrapAPIs = extensionAPIs => {
            const apiMetadata = {
              alarms: {
                clear: {
                  minArgs: 0,
                  maxArgs: 1
                },
                clearAll: {
                  minArgs: 0,
                  maxArgs: 0
                },
                get: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getAll: {
                  minArgs: 0,
                  maxArgs: 0
                }
              },
              bookmarks: {
                create: {
                  minArgs: 1,
                  maxArgs: 1
                },
                get: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getChildren: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getRecent: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getSubTree: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getTree: {
                  minArgs: 0,
                  maxArgs: 0
                },
                move: {
                  minArgs: 2,
                  maxArgs: 2
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeTree: {
                  minArgs: 1,
                  maxArgs: 1
                },
                search: {
                  minArgs: 1,
                  maxArgs: 1
                },
                update: {
                  minArgs: 2,
                  maxArgs: 2
                }
              },
              browserAction: {
                disable: {
                  minArgs: 0,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                enable: {
                  minArgs: 0,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                getBadgeBackgroundColor: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getBadgeText: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getPopup: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getTitle: {
                  minArgs: 1,
                  maxArgs: 1
                },
                openPopup: {
                  minArgs: 0,
                  maxArgs: 0
                },
                setBadgeBackgroundColor: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                setBadgeText: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                setIcon: {
                  minArgs: 1,
                  maxArgs: 1
                },
                setPopup: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                setTitle: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                }
              },
              browsingData: {
                remove: {
                  minArgs: 2,
                  maxArgs: 2
                },
                removeCache: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeCookies: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeDownloads: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeFormData: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeHistory: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeLocalStorage: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removePasswords: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removePluginData: {
                  minArgs: 1,
                  maxArgs: 1
                },
                settings: {
                  minArgs: 0,
                  maxArgs: 0
                }
              },
              commands: {
                getAll: {
                  minArgs: 0,
                  maxArgs: 0
                }
              },
              contextMenus: {
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeAll: {
                  minArgs: 0,
                  maxArgs: 0
                },
                update: {
                  minArgs: 2,
                  maxArgs: 2
                }
              },
              cookies: {
                get: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getAll: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getAllCookieStores: {
                  minArgs: 0,
                  maxArgs: 0
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                set: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              devtools: {
                inspectedWindow: {
                  eval: {
                    minArgs: 1,
                    maxArgs: 2,
                    singleCallbackArg: !1
                  }
                },
                panels: {
                  create: {
                    minArgs: 3,
                    maxArgs: 3,
                    singleCallbackArg: !0
                  },
                  elements: {
                    createSidebarPane: {
                      minArgs: 1,
                      maxArgs: 1
                    }
                  }
                }
              },
              downloads: {
                cancel: {
                  minArgs: 1,
                  maxArgs: 1
                },
                download: {
                  minArgs: 1,
                  maxArgs: 1
                },
                erase: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getFileIcon: {
                  minArgs: 1,
                  maxArgs: 2
                },
                open: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                pause: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeFile: {
                  minArgs: 1,
                  maxArgs: 1
                },
                resume: {
                  minArgs: 1,
                  maxArgs: 1
                },
                search: {
                  minArgs: 1,
                  maxArgs: 1
                },
                show: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                }
              },
              extension: {
                isAllowedFileSchemeAccess: {
                  minArgs: 0,
                  maxArgs: 0
                },
                isAllowedIncognitoAccess: {
                  minArgs: 0,
                  maxArgs: 0
                }
              },
              history: {
                addUrl: {
                  minArgs: 1,
                  maxArgs: 1
                },
                deleteAll: {
                  minArgs: 0,
                  maxArgs: 0
                },
                deleteRange: {
                  minArgs: 1,
                  maxArgs: 1
                },
                deleteUrl: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getVisits: {
                  minArgs: 1,
                  maxArgs: 1
                },
                search: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              i18n: {
                detectLanguage: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getAcceptLanguages: {
                  minArgs: 0,
                  maxArgs: 0
                }
              },
              identity: {
                launchWebAuthFlow: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              idle: {
                queryState: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              management: {
                get: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getAll: {
                  minArgs: 0,
                  maxArgs: 0
                },
                getSelf: {
                  minArgs: 0,
                  maxArgs: 0
                },
                setEnabled: {
                  minArgs: 2,
                  maxArgs: 2
                },
                uninstallSelf: {
                  minArgs: 0,
                  maxArgs: 1
                }
              },
              notifications: {
                clear: {
                  minArgs: 1,
                  maxArgs: 1
                },
                create: {
                  minArgs: 1,
                  maxArgs: 2
                },
                getAll: {
                  minArgs: 0,
                  maxArgs: 0
                },
                getPermissionLevel: {
                  minArgs: 0,
                  maxArgs: 0
                },
                update: {
                  minArgs: 2,
                  maxArgs: 2
                }
              },
              pageAction: {
                getPopup: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getTitle: {
                  minArgs: 1,
                  maxArgs: 1
                },
                hide: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                setIcon: {
                  minArgs: 1,
                  maxArgs: 1
                },
                setPopup: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                setTitle: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                },
                show: {
                  minArgs: 1,
                  maxArgs: 1,
                  fallbackToNoCallback: !0
                }
              },
              permissions: {
                contains: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getAll: {
                  minArgs: 0,
                  maxArgs: 0
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                request: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              runtime: {
                getBackgroundPage: {
                  minArgs: 0,
                  maxArgs: 0
                },
                getPlatformInfo: {
                  minArgs: 0,
                  maxArgs: 0
                },
                openOptionsPage: {
                  minArgs: 0,
                  maxArgs: 0
                },
                requestUpdateCheck: {
                  minArgs: 0,
                  maxArgs: 0
                },
                sendMessage: {
                  minArgs: 1,
                  maxArgs: 3
                },
                sendNativeMessage: {
                  minArgs: 2,
                  maxArgs: 2
                },
                setUninstallURL: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              sessions: {
                getDevices: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getRecentlyClosed: {
                  minArgs: 0,
                  maxArgs: 1
                },
                restore: {
                  minArgs: 0,
                  maxArgs: 1
                }
              },
              storage: {
                local: {
                  clear: {
                    minArgs: 0,
                    maxArgs: 0
                  },
                  get: {
                    minArgs: 0,
                    maxArgs: 1
                  },
                  getBytesInUse: {
                    minArgs: 0,
                    maxArgs: 1
                  },
                  remove: {
                    minArgs: 1,
                    maxArgs: 1
                  },
                  set: {
                    minArgs: 1,
                    maxArgs: 1
                  }
                },
                managed: {
                  get: {
                    minArgs: 0,
                    maxArgs: 1
                  },
                  getBytesInUse: {
                    minArgs: 0,
                    maxArgs: 1
                  }
                },
                sync: {
                  clear: {
                    minArgs: 0,
                    maxArgs: 0
                  },
                  get: {
                    minArgs: 0,
                    maxArgs: 1
                  },
                  getBytesInUse: {
                    minArgs: 0,
                    maxArgs: 1
                  },
                  remove: {
                    minArgs: 1,
                    maxArgs: 1
                  },
                  set: {
                    minArgs: 1,
                    maxArgs: 1
                  }
                }
              },
              tabs: {
                captureVisibleTab: {
                  minArgs: 0,
                  maxArgs: 2
                },
                create: {
                  minArgs: 1,
                  maxArgs: 1
                },
                detectLanguage: {
                  minArgs: 0,
                  maxArgs: 1
                },
                discard: {
                  minArgs: 0,
                  maxArgs: 1
                },
                duplicate: {
                  minArgs: 1,
                  maxArgs: 1
                },
                executeScript: {
                  minArgs: 1,
                  maxArgs: 2
                },
                get: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getCurrent: {
                  minArgs: 0,
                  maxArgs: 0
                },
                getZoom: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getZoomSettings: {
                  minArgs: 0,
                  maxArgs: 1
                },
                goBack: {
                  minArgs: 0,
                  maxArgs: 1
                },
                goForward: {
                  minArgs: 0,
                  maxArgs: 1
                },
                highlight: {
                  minArgs: 1,
                  maxArgs: 1
                },
                insertCSS: {
                  minArgs: 1,
                  maxArgs: 2
                },
                move: {
                  minArgs: 2,
                  maxArgs: 2
                },
                query: {
                  minArgs: 1,
                  maxArgs: 1
                },
                reload: {
                  minArgs: 0,
                  maxArgs: 2
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                removeCSS: {
                  minArgs: 1,
                  maxArgs: 2
                },
                sendMessage: {
                  minArgs: 2,
                  maxArgs: 3
                },
                setZoom: {
                  minArgs: 1,
                  maxArgs: 2
                },
                setZoomSettings: {
                  minArgs: 1,
                  maxArgs: 2
                },
                update: {
                  minArgs: 1,
                  maxArgs: 2
                }
              },
              topSites: {
                get: {
                  minArgs: 0,
                  maxArgs: 0
                }
              },
              webNavigation: {
                getAllFrames: {
                  minArgs: 1,
                  maxArgs: 1
                },
                getFrame: {
                  minArgs: 1,
                  maxArgs: 1
                }
              },
              webRequest: {
                handlerBehaviorChanged: {
                  minArgs: 0,
                  maxArgs: 0
                }
              },
              windows: {
                create: {
                  minArgs: 0,
                  maxArgs: 1
                },
                get: {
                  minArgs: 1,
                  maxArgs: 2
                },
                getAll: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getCurrent: {
                  minArgs: 0,
                  maxArgs: 1
                },
                getLastFocused: {
                  minArgs: 0,
                  maxArgs: 1
                },
                remove: {
                  minArgs: 1,
                  maxArgs: 1
                },
                update: {
                  minArgs: 2,
                  maxArgs: 2
                }
              }
            };
            if (0 === Object.keys(apiMetadata).length) throw new Error("api-metadata.json has not been included in browser-polyfill");
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items) {
                super(items), this.createItem = createItem;
              }
              get(key) {
                return this.has(key) || this.set(key, this.createItem(key)), super.get(key);
              }
            }
            const isThenable = value => value && "object" == typeof value && "function" == typeof value.then, makeCallback = (promise, metadata) => (...callbackArgs) => {
              extensionAPIs.runtime.lastError ? promise.reject(new Error(extensionAPIs.runtime.lastError.message)) : metadata.singleCallbackArg || callbackArgs.length <= 1 && !1 !== metadata.singleCallbackArg ? promise.resolve(callbackArgs[0]) : promise.resolve(callbackArgs);
            }, pluralizeArguments = numArgs => 1 == numArgs ? "argument" : "arguments", wrapAsyncFunction = (name, metadata) => function(target, ...args) {
              if (args.length < metadata.minArgs) throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              if (args.length > metadata.maxArgs) throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              return new Promise(((resolve, reject) => {
                if (metadata.fallbackToNoCallback) try {
                  target[name](...args, makeCallback({
                    resolve,
                    reject
                  }, metadata));
                } catch (cbError) {
                  console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError), 
                  target[name](...args), metadata.fallbackToNoCallback = !1, metadata.noCallback = !0, 
                  resolve();
                } else metadata.noCallback ? (target[name](...args), resolve()) : target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              }));
            }, wrapMethod = (target, method, wrapper) => new Proxy(method, {
              apply: (targetMethod, thisObj, args) => wrapper.call(thisObj, target, ...args)
            });
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = Object.create(null), handlers = {
                has: (proxyTarget, prop) => prop in target || prop in cache,
                get(proxyTarget, prop, receiver) {
                  if (prop in cache) return cache[prop];
                  if (!(prop in target)) return;
                  let value = target[prop];
                  if ("function" == typeof value) if ("function" == typeof wrappers[prop]) value = wrapMethod(target, target[prop], wrappers[prop]); else if (hasOwnProperty(metadata, prop)) {
                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                    value = wrapMethod(target, target[prop], wrapper);
                  } else value = value.bind(target); else if ("object" == typeof value && null !== value && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) value = wrapObject(value, wrappers[prop], metadata[prop]); else {
                    if (!hasOwnProperty(metadata, "*")) return Object.defineProperty(cache, prop, {
                      configurable: !0,
                      enumerable: !0,
                      get: () => target[prop],
                      set(value) {
                        target[prop] = value;
                      }
                    }), value;
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  }
                  return cache[prop] = value, value;
                },
                set: (proxyTarget, prop, value, receiver) => (prop in cache ? cache[prop] = value : target[prop] = value, 
                !0),
                defineProperty: (proxyTarget, prop, desc) => Reflect.defineProperty(cache, prop, desc),
                deleteProperty: (proxyTarget, prop) => Reflect.deleteProperty(cache, prop)
              }, proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            }, wrapEvent = wrapperMap => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener: (target, listener) => target.hasListener(wrapperMap.get(listener)),
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            }), onRequestFinishedWrappers = new DefaultWeakMap((listener => "function" != typeof listener ? listener : function(req) {
              const wrappedReq = wrapObject(req, {}, {
                getContent: {
                  minArgs: 0,
                  maxArgs: 0
                }
              });
              listener(wrappedReq);
            })), onMessageWrappers = new DefaultWeakMap((listener => "function" != typeof listener ? listener : function(message, sender, sendResponse) {
              let wrappedSendResponse, result, didCallSendResponse = !1, sendResponsePromise = new Promise((resolve => {
                wrappedSendResponse = function(response) {
                  didCallSendResponse = !0, resolve(response);
                };
              }));
              try {
                result = listener(message, sender, wrappedSendResponse);
              } catch (err) {
                result = Promise.reject(err);
              }
              const isResultThenable = !0 !== result && isThenable(result);
              if (!0 !== result && !isResultThenable && !didCallSendResponse) return !1;
              const sendPromisedResult = promise => {
                promise.then((msg => {
                  sendResponse(msg);
                }), (error => {
                  let message;
                  message = error && (error instanceof Error || "string" == typeof error.message) ? error.message : "An unexpected error occurred", 
                  sendResponse({
                    __mozWebExtensionPolyfillReject__: !0,
                    message
                  });
                })).catch((err => {
                  console.error("Failed to send onMessage rejected reply", err);
                }));
              };
              return sendPromisedResult(isResultThenable ? result : sendResponsePromise), !0;
            })), wrappedSendMessageCallback = ({reject, resolve}, reply) => {
              extensionAPIs.runtime.lastError ? extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE ? resolve() : reject(new Error(extensionAPIs.runtime.lastError.message)) : reply && reply.__mozWebExtensionPolyfillReject__ ? reject(new Error(reply.message)) : resolve(reply);
            }, wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              if (args.length > metadata.maxArgs) throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              return new Promise(((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb), apiNamespaceObj.sendMessage(...args);
              }));
            }, staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            }, settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            return apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            }, wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module.exports = wrapAPIs(chrome);
        } else module.exports = globalThis.browser;
      }, void 0 === (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) || (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    },
    768: module => {
      "use strict";
      function getIndex(container, target) {
        let index = 0;
        do {
          for (;target.previousSibling; ) index += target.previousSibling.textContent.length, 
          target = target.previousSibling;
          target = target.parentElement;
        } while (target && target !== container);
        return index;
      }
      function getNodeAtIndex(container, index) {
        let relativeIndex = index, cursor = container;
        for (;cursor && cursor.firstChild; ) for (cursor = cursor.firstChild; cursor && cursor.textContent.length < relativeIndex; ) relativeIndex -= cursor.textContent.length, 
        cursor.nextSibling && (cursor = cursor.nextSibling);
        return [ cursor, relativeIndex ];
      }
      function getSmartIndexRange(node, start, end) {
        const range = document.createRange();
        return range.setStart(...getNodeAtIndex(node, start)), range.setEnd(...getNodeAtIndex(node, end)), 
        range;
      }
      module.exports = function(target, source) {
        if (target.textContent !== source.textContent) throw new Error("`target` and `source` must have matching `textContent`");
        for (const child of source.querySelectorAll("*")) {
          const textIndex = getIndex(source, child), newEl = child.cloneNode(), contentsRange = getSmartIndexRange(target, textIndex, textIndex + child.textContent.length);
          newEl.append(contentsRange.extractContents()), contentsRange.insertNode(newEl);
        }
      };
    },
    464: module => {
      "use strict";
      module.exports = JSON.parse('["400","401","402","403","404","405","406","407","408","409","410","411","412","413","414","415","416","417","418","419","420","421","422","423","424","425","426","427","428","429","430","431","500","501","502","503","504","505","506","507","508","509","510","511","about","access","account","admin","advisories","anonymous","any","api","apps","attributes","auth","billing","blob","blog","bounty","branches","business","businesses","c","cache","case-studies","categories","central","certification","changelog","cla","cloud","codereview","collection","collections","comments","commit","commits","community","companies","compare","contact","contributing","cookbook","coupons","customer-stories","customer","customers","dashboard","dashboards","design","develop","developer","diff","discover","discussions","docs","downloads","downtime","editor","editors","edu","enterprise","events","explore","featured","features","files","fixtures","forked","garage","ghost","gist","gists","graphs","guide","guides","help","help-wanted","home","hooks","hosting","hovercards","identity","images","inbox","individual","info","integration","interfaces","introduction","invalid-email-address","investors","issues","jobs","join","journal","journals","lab","labs","languages","launch","layouts","learn","legal","library","linux","listings","lists","login","logos","logout","mac","maintenance","malware","man","marketplace","mention","mentioned","mentioning","mentions","migrating","milestones","mine","mirrors","mobile","navigation","network","new","news","none","nonprofit","nonprofits","notices","notifications","oauth","offer","open-source","organisations","organizations","orgs","pages","partners","payments","personal","plans","plugins","popular","popularity","posts","press","pricing","professional","projects","pulls","raw","readme","recommendations","redeem","releases","render","reply","repositories","resources","restore","revert","save-net-neutrality","saved","scraping","search","security","services","sessions","settings","shareholders","shop","showcases","signin","signup","site","spam","sponsors","ssh","staff","starred","stars","static","status","statuses","storage","store","stories","styleguide","subscriptions","suggest","suggestion","suggestions","support","suspended","talks","teach","teacher","teachers","teaching","team","teams","ten","terms","timeline","topic","topics","tos","tour","train","training","translations","tree","trending","updates","username","users","visualization","w","watching","wiki","windows","works-with","www0","www1","www2","www3","www4","www5","www6","www7","www8","www9"]');
    },
    555: module => {
      "use strict";
      module.exports = JSON.parse('["area","base","br","col","embed","hr","img","input","link","menuitem","meta","param","source","track","wbr"]');
    }
  }, __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
    module.exports;
  }
  __webpack_require__.n = module => {
    var getter = module && module.__esModule ? () => module.default : () => module;
    return __webpack_require__.d(getter, {
      a: getter
    }), getter;
  }, __webpack_require__.d = (exports, definition) => {
    for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
      enumerable: !0,
      get: definition[key]
    });
  }, __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
  (() => {
    "use strict";
    const reservedNames = [ "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "418", "419", "420", "421", "422", "423", "424", "425", "426", "427", "428", "429", "430", "431", "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "510", "511", "about", "access", "account", "admin", "advisories", "anonymous", "any", "api", "apps", "attributes", "auth", "billing", "blob", "blog", "bounty", "branches", "business", "businesses", "c", "cache", "case-studies", "categories", "central", "certification", "changelog", "cla", "cloud", "codereview", "collection", "collections", "comments", "commit", "commits", "community", "companies", "compare", "contact", "contributing", "cookbook", "coupons", "customer-stories", "customer", "customers", "dashboard", "dashboards", "design", "develop", "developer", "diff", "discover", "discussions", "docs", "downloads", "downtime", "editor", "editors", "edu", "enterprise", "events", "explore", "featured", "features", "files", "fixtures", "forked", "garage", "ghost", "gist", "gists", "graphs", "guide", "guides", "help", "help-wanted", "home", "hooks", "hosting", "hovercards", "identity", "images", "inbox", "individual", "info", "integration", "interfaces", "introduction", "invalid-email-address", "investors", "issues", "jobs", "join", "journal", "journals", "lab", "labs", "languages", "launch", "layouts", "learn", "legal", "library", "linux", "listings", "lists", "login", "logos", "logout", "mac", "maintenance", "malware", "man", "marketplace", "mention", "mentioned", "mentioning", "mentions", "migrating", "milestones", "mine", "mirrors", "mobile", "navigation", "network", "new", "news", "none", "nonprofit", "nonprofits", "notices", "notifications", "oauth", "offer", "open-source", "organisations", "organizations", "orgs", "pages", "partners", "payments", "personal", "plans", "plugins", "popular", "popularity", "posts", "press", "pricing", "professional", "projects", "pulls", "raw", "readme", "recommendations", "redeem", "releases", "render", "reply", "repositories", "resources", "restore", "revert", "save-net-neutrality", "saved", "scraping", "search", "security", "services", "sessions", "settings", "shareholders", "shop", "showcases", "signin", "signup", "site", "spam", "sponsors", "ssh", "staff", "starred", "stars", "static", "status", "statuses", "storage", "store", "stories", "styleguide", "subscriptions", "suggest", "suggestion", "suggestions", "support", "suspended", "talks", "teach", "teacher", "teachers", "teaching", "team", "teams", "ten", "terms", "timeline", "topic", "topics", "tos", "tour", "train", "training", "translations", "tree", "trending", "updates", "username", "users", "visualization", "w", "watching", "wiki", "windows", "works-with", "www0", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "www8", "www9" ], $ = selector => document.querySelector(selector), exists = selector => Boolean($(selector)), is404 = () => document.title.startsWith("Page not found · GitHub"), isBlame = (url = location) => Boolean(getRepo(url)?.path.startsWith("blame/")), isCommit = (url = location) => isSingleCommit(url) || isPRCommit(url), isCommitList = (url = location) => isRepoCommitList(url) || isPRCommitList(url), isRepoCommitList = (url = location) => Boolean(getRepo(url)?.path.startsWith("commits")), isCompare = (url = location) => Boolean(getRepo(url)?.path.startsWith("compare")), isDashboard = (url = location) => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(\/|$)/.test(getCleanPathname(url)), isEnterprise = (url = location) => "github.com" !== url.hostname && "gist.github.com" !== url.hostname, isGist = (url = location) => "string" == typeof getCleanGistPathname(url), isGlobalIssueOrPRList = (url = location) => [ "issues", "pulls" ].includes(url.pathname.split("/", 2)[1]), isGlobalSearchResults = (url = location) => "/search" === url.pathname && null !== new URLSearchParams(url.search).get("q"), isIssue = (url = location) => /^issues\/\d+/.test(getRepo(url)?.path) && "GitHub · Where software is built" !== document.title, isIssueOrPRList = (url = location) => isGlobalIssueOrPRList(url) || isRepoIssueOrPRList(url) || isMilestone(url), isConversation = (url = location) => isIssue(url) || isPRConversation(url), isMilestone = (url = location) => /^milestone\/\d+/.test(getRepo(url)?.path), isNewFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("new")), isNewIssue = (url = location) => "issues/new" === getRepo(url)?.path, isNewRelease = (url = location) => "releases/new" === getRepo(url)?.path, isNotifications = (url = location) => "notifications" === getCleanPathname(url), isOrganizationProfile = () => exists('meta[name="hovercard-subject-tag"][content^="organization"]'), isOwnUserProfile = () => getCleanPathname() === getUsername(), isProjects = (url = location) => "projects" === getRepo(url)?.path, isDiscussion = (url = location) => /^discussions\/\d+/.test(getRepo(url)?.path), isPR = (url = location) => /^pull\/\d+/.test(getRepo(url)?.path) && !isPRConflicts(url), isPRConflicts = (url = location) => /^pull\/\d+\/conflicts/.test(getRepo(url)?.path), isPRList = (url = location) => "/pulls" === url.pathname || "pulls" === getRepo(url)?.path, isPRCommit = (url = location) => /^pull\/\d+\/commits\/[\da-f]{5,40}$/.test(getRepo(url)?.path), isPRCommit404 = () => isPRCommit() && document.title.startsWith("Commit range not found · Pull Request"), isPRFile404 = () => isPRFiles() && document.title.startsWith("Commit range not found · Pull Request"), isPRConversation = (url = location) => /^pull\/\d+$/.test(getRepo(url)?.path), isPRCommitList = (url = location) => /^pull\/\d+\/commits$/.test(getRepo(url)?.path), isPRFiles = (url = location) => /^pull\/\d+\/files/.test(getRepo(url)?.path), isQuickPR = (url = location) => isCompare(url) && /[?&]quick_pull=1(&|$)/.test(url.search), isDraftPR = () => exists("#partial-discussion-header .octicon-git-pull-request-draft"), isOpenPR = () => exists("#partial-discussion-header :is(.octicon-git-pull-request, .octicon-git-pull-request-draft)"), isClosedPR = () => exists("#partial-discussion-header :is(.octicon-git-pull-request-closed, .octicon-git-merge)"), isReleases = (url = location) => "releases" === getRepo(url)?.path, isTags = (url = location) => "tags" === getRepo(url)?.path, isSingleTag = (url = location) => /^(releases\/tag)/.test(getRepo(url)?.path), isReleasesOrTags = (url = location) => isReleases(url) || isTags(url) || isSingleTag(url), isDeletingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("delete")), isEditingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("edit")), isEditingRelease = (url = location) => Boolean(getRepo(url)?.path.startsWith("releases/edit")), isRepo = (url = location) => /^[^/]+\/[^/]+/.test(getCleanPathname(url)) && !reservedNames.includes(url.pathname.split("/", 2)[1]) && !isDashboard(url) && !isGist(url) && !isNewRepoTemplate(url), hasRepoHeader = (url = location) => isRepo(url) && !isRepoSearch(url), isEmptyRepoRoot = () => isRepoHome() && !exists('link[rel="canonical"]'), isEmptyRepo = () => exists('[aria-label="Cannot fork because repository is empty."]'), isArchivedRepo = () => Boolean(isRepo() && $("#repository-container-header .Label").textContent.endsWith("archive")), isBlank = () => exists("main .blankslate"), isRepoTaxonomyIssueOrPRList = (url = location) => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepo(url)?.path), isRepoIssueOrPRList = (url = location) => isRepoPRList(url) || isRepoIssueList(url) || isRepoTaxonomyIssueOrPRList(url), isRepoPRList = (url = location) => Boolean(getRepo(url)?.path.startsWith("pulls")), isRepoIssueList = (url = location) => /^labels\/|^issues(?!\/(\d+|new|templates)($|\/))/.test(getRepo(url)?.path), isRepoHome = (url = location) => "" === getRepo(url)?.path, isRepoRoot = url => {
      const repository = getRepo(url ?? location);
      return !!repository && (!repository.path || (url ? /^tree\/[^/]+$/.test(repository.path) : repository.path.startsWith("tree/") && document.title.startsWith(repository.nameWithOwner) && !document.title.endsWith(repository.nameWithOwner)));
    }, isRepoSearch = (url = location) => "search" === getRepo(url)?.path, isRepoTree = (url = location) => isRepoRoot(url) || Boolean(getRepo(url)?.path.startsWith("tree/")), isRepoWiki = (url = location) => Boolean(getRepo(url)?.path.startsWith("wiki")), isSingleCommit = (url = location) => /^commit\/[\da-f]{5,40}$/.test(getRepo(url)?.path), isSingleFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("blob/")), isFileFinder = (url = location) => Boolean(getRepo(url)?.path.startsWith("find/")), isForkedRepo = () => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]'), isSingleGist = (url = location) => /^[^/]+\/[\da-f]{20,32}(\/[\da-f]{40})?$/.test(getCleanGistPathname(url)), doesLookLikeAProfile = string => "string" == typeof string && string.length > 0 && !string.includes("/") && !string.includes(".") && !reservedNames.includes(string), isProfile = (url = location) => !isGist(url) && doesLookLikeAProfile(getCleanPathname(url)), isUserProfile = () => isProfile() && !isOrganizationProfile(), isPrivateUserProfile = () => isUserProfile() && !exists('.UnderlineNav-item[href$="tab=stars"]'), isUserProfileRepoTab = (url = location) => isProfile(url) && "repositories" === new URLSearchParams(url.search).get("tab"), hasComments = (url = location) => isPR(url) || isIssue(url) || isCommit(url) || ((url = location) => /^orgs\/[^/]+\/teams\/[^/]+($|\/discussions)/.test(getCleanPathname(url)))(url) || isSingleGist(url), hasRichTextEditor = (url = location) => hasComments(url) || isNewIssue(url) || isCompare(url) || ((url = location) => url.pathname.startsWith("/settings/replies"))(url) || ((url = location) => isEditingRelease(url) || isNewRelease(url))(url) || isDiscussion(url), hasCode = (url = location) => hasComments(url) || isRepoTree(url) || isRepoSearch(url) || isGlobalSearchResults(url) || isSingleFile(url) || isGist(url) || isCompare(url) || ((url = location) => isRepoWiki(url) && getCleanPathname(url).split("/").slice(3, 5).includes("_compare"))(url) || isBlame(url), hasFiles = (url = location) => isCommit(url) || isCompare(url) || isPRFiles(url), canUserEditRepo = () => isRepo() && exists('.reponav-item[href$="/settings"], [data-tab-item$="settings-tab"]'), isNewRepoTemplate = (url = location) => Boolean("generate" === url.pathname.split("/")[3]), getUsername = () => document.querySelector('meta[name="user-login"]')?.getAttribute("content"), getCleanPathname = (url = location) => url.pathname.replace(/\/+/g, "/").slice(1, url.pathname.endsWith("/") ? -1 : void 0), getCleanGistPathname = (url = location) => {
      const pathname = getCleanPathname(url);
      if (url.hostname.startsWith("gist.")) return pathname;
      const [gist, ...parts] = pathname.split("/");
      return "gist" === gist ? parts.join("/") : void 0;
    }, getRepo = url => {
      if (!url) {
        const canonical = document.querySelector('[property="og:url"]');
        if (canonical) {
          const canonicalUrl = new URL(canonical.content, location.origin);
          getCleanPathname(canonicalUrl).toLowerCase() === getCleanPathname(location).toLowerCase() && (url = canonicalUrl);
        }
      }
      if ("string" == typeof url && (url = new URL(url, location.origin)), !isRepo(url)) return;
      const [owner, name, ...path] = getCleanPathname(url).split("/");
      return {
        owner,
        name,
        nameWithOwner: owner + "/" + name,
        path: path.join("/")
      };
    }, utils = {
      getUsername,
      getCleanPathname,
      getCleanGistPathname,
      getRepositoryInfo: getRepo
    }, svgTags = new Set([ "a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "animation", "audio", "canvas", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "handler", "hkern", "iframe", "image", "line", "linearGradient", "listener", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "prefetch", "radialGradient", "rect", "script", "set", "solidColor", "stop", "style", "svg", "switch", "symbol", "tbreak", "text", "textArea", "textPath", "title", "tref", "tspan", "unknown", "use", "video", "view", "vkern" ]);
    svgTags.delete("a"), svgTags.delete("audio"), svgTags.delete("canvas"), svgTags.delete("iframe"), 
    svgTags.delete("script"), svgTags.delete("video");
    const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, setCSSProps = (element, style) => {
      for (const [name, value] of Object.entries(style)) name.startsWith("-") ? element.style.setProperty(name, value) : "number" != typeof value || IS_NON_DIMENSIONAL.test(name) ? element.style[name] = value : element.style[name] = `${value}px`;
    }, create = type => "string" == typeof type ? svgTags.has(type) ? document.createElementNS("http://www.w3.org/2000/svg", type) : document.createElement(type) : (type => type === DocumentFragment)(type) ? document.createDocumentFragment() : type(type.defaultProps), setAttribute = (element, name, value) => {
      null != value && (/^xlink[AHRST]/.test(name) ? element.setAttributeNS("http://www.w3.org/1999/xlink", name.replace("xlink", "xlink:").toLowerCase(), value) : element.setAttribute(name, value));
    }, addChildren = (parent, children) => {
      for (const child of children) child instanceof Node ? parent.appendChild(child) : Array.isArray(child) ? addChildren(parent, child) : "boolean" != typeof child && null != child && parent.appendChild(document.createTextNode(child));
    }, booleanishAttributes = new Set([ "contentEditable", "draggable", "spellCheck", "value", "autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha" ]), dom_chef = {
      createElement: (type, attributes, ...children) => {
        var _a;
        const element = create(type);
        if (addChildren(element, children), element instanceof DocumentFragment || !attributes) return element;
        for (let [name, value] of Object.entries(attributes)) if ("htmlFor" === name && (name = "for"), 
        "class" === name || "className" === name) {
          const existingClassname = null !== (_a = element.getAttribute("class")) && void 0 !== _a ? _a : "";
          setAttribute(element, "class", (existingClassname + " " + String(value)).trim());
        } else if ("style" === name) setCSSProps(element, value); else if (name.startsWith("on")) {
          const eventName = name.slice(2).toLowerCase().replace(/^-/, "");
          element.addEventListener(eventName, value);
        } else "dangerouslySetInnerHTML" === name && "__html" in value ? element.innerHTML = value.__html : "key" === name || !booleanishAttributes.has(name) && !1 === value || setAttribute(element, name, !0 === value ? "" : value);
        return element;
      },
      Fragment: "function" == typeof DocumentFragment ? DocumentFragment : () => {}
    };
    function isQueryable(object) {
      return "function" == typeof object.querySelectorAll;
    }
    function select_dom_select(selectors, baseElement) {
      var _a;
      if (2 !== arguments.length || baseElement) return null !== (_a = (null != baseElement ? baseElement : document).querySelector(String(selectors))) && void 0 !== _a ? _a : void 0;
    }
    select_dom_select.last = function(selectors, baseElement) {
      if (2 === arguments.length && !baseElement) return;
      const all = (null != baseElement ? baseElement : document).querySelectorAll(String(selectors));
      return all[all.length - 1];
    }, select_dom_select.exists = function(selectors, baseElement) {
      return !(2 === arguments.length && !baseElement) && Boolean((null != baseElement ? baseElement : document).querySelector(String(selectors)));
    }, select_dom_select.all = function(selectors, baseElements) {
      if (2 === arguments.length && !baseElements) return [];
      if (!baseElements || isQueryable(baseElements)) {
        return [ ...(null != baseElements ? baseElements : document).querySelectorAll(String(selectors)) ];
      }
      const queried = new Set;
      for (const baseElement of baseElements) for (const element of baseElement.querySelectorAll(String(selectors))) queried.add(element);
      return [ ...queried ];
    };
    const select_dom = select_dom_select, hasLoaded = () => "interactive" === document.readyState || "complete" === document.readyState, domLoaded = new Promise((resolve => {
      hasLoaded() ? resolve() : document.addEventListener("DOMContentLoaded", (() => {
        resolve();
      }), {
        capture: !0,
        once: !0,
        passive: !0
      });
    })), dom_loaded = domLoaded;
    Object.defineProperty(domLoaded, "hasLoaded", {
      get: () => hasLoaded()
    });
    var min_indent = __webpack_require__(772);
    var delay = __webpack_require__(792), delay_default = __webpack_require__.n(delay);
    function onAbort(abort, ...callbacks) {
      (abort instanceof AbortController ? abort.signal : abort).addEventListener("abort", (() => {
        for (const callback of callbacks) "disconnect" in (handle = callback) ? handle.disconnect() : "abort" in handle ? handle.abort() : "function" == typeof handle && handle();
        var handle;
      }));
    }
    class ArrayMap extends Map {
      append(key, ...values) {
        this.has(key) || this.set(key, []), this.get(key).push(...values);
      }
    }
    const chromeP = globalThis.chrome && new function NestedProxy(target) {
      return new Proxy(target, {
        get: (target, prop) => "function" != typeof target[prop] ? new NestedProxy(target[prop]) : (...arguments_) => new Promise(((resolve, reject) => {
          target[prop](...arguments_, (result => {
            chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(result);
          }));
        }))
      });
    }(globalThis.chrome), webext_polyfill_kinda = chromeP;
    var micro_memoize = __webpack_require__(710);
    let cache = !0;
    function isCurrentPathname(path) {
      if (!path) return !1;
      try {
        const {pathname} = new URL(path, location.origin);
        return pathname === location.pathname;
      } catch {
        return !1;
      }
    }
    function getManifest(_version) {
      return globalThis.chrome?.runtime?.getManifest?.();
    }
    function once(function_) {
      let result;
      return () => (cache && void 0 !== result || (result = function_()), result);
    }
    const isWebPage = once((() => globalThis.location?.protocol.startsWith("http"))), isExtensionContext = once((() => "object" == typeof globalThis.chrome?.extension)), isContentScript = once((() => isExtensionContext() && isWebPage())), isBackground = () => isBackgroundPage() || isBackgroundWorker(), isBackgroundPage = once((() => {
      const manifest = getManifest();
      return !(!manifest || !isCurrentPathname(manifest.background_page || manifest.background?.page)) || Boolean(manifest?.background?.scripts && isCurrentPathname("/_generated_background_page.html"));
    })), isBackgroundWorker = once((() => isCurrentPathname(getManifest()?.background?.service_worker))), isChrome = (once((() => {
      if (!isExtensionContext() || !chrome.runtime.getManifest) return !1;
      const {options_ui: optionsUi} = chrome.runtime.getManifest();
      if ("string" != typeof optionsUi?.page) return !1;
      return new URL(optionsUi.page, location.origin).pathname === location.pathname;
    })), once((() => {
      if (!isExtensionContext() || !chrome.devtools) return !1;
      const {devtools_page: devtoolsPage} = chrome.runtime.getManifest();
      if ("string" != typeof devtoolsPage) return !1;
      return new URL(devtoolsPage, location.origin).pathname === location.pathname;
    })), () => globalThis.navigator?.userAgent.includes("Chrome")), isSafari = () => !isChrome() && globalThis.navigator?.userAgent.includes("Safari");
    const converters = {
      days: value => 864e5 * value,
      hours: value => 36e5 * value,
      minutes: value => 6e4 * value,
      seconds: value => 1e3 * value,
      milliseconds: value => value,
      microseconds: value => value / 1e3,
      nanoseconds: value => value / 1e6
    };
    function toMilliseconds(timeDescriptor) {
      let totalMilliseconds = 0;
      for (const [key, value] of Object.entries(timeDescriptor)) {
        if ("number" != typeof value) throw new TypeError(`Expected a \`number\` for key \`${key}\`, got \`${value}\` (${typeof value})`);
        const converter = converters[key];
        if (!converter) throw new Error(`Unsupported time key: ${key}`);
        totalMilliseconds += converter(value);
      }
      return totalMilliseconds;
    }
    const cacheDefault = {
      days: 30
    };
    function timeInTheFuture(time) {
      return Date.now() + toMilliseconds(time);
    }
    async function _get(key, remove) {
      const internalKey = `cache:${key}`, cachedItem = (await webext_polyfill_kinda.storage.local.get(internalKey))[internalKey];
      if (void 0 !== cachedItem) {
        if (!(Date.now() > cachedItem.maxAge)) return cachedItem;
        remove && await webext_polyfill_kinda.storage.local.remove(internalKey);
      }
    }
    async function set(key, value, maxAge = cacheDefault) {
      if (arguments.length < 2) throw new TypeError("Expected a value as the second argument");
      if (void 0 === value) await delete_(key); else {
        const internalKey = `cache:${key}`;
        await webext_polyfill_kinda.storage.local.set({
          [internalKey]: {
            data: value,
            maxAge: timeInTheFuture(maxAge)
          }
        });
      }
      return value;
    }
    async function delete_(key) {
      const internalKey = `cache:${key}`;
      return webext_polyfill_kinda.storage.local.remove(internalKey);
    }
    async function deleteWithLogic(logic) {
      var _a;
      const wholeCache = await webext_polyfill_kinda.storage.local.get(), removableItems = [];
      for (const [key, value] of Object.entries(wholeCache)) key.startsWith("cache:") && (null === (_a = null == logic ? void 0 : logic(value)) || void 0 === _a || _a) && removableItems.push(key);
      removableItems.length > 0 && await webext_polyfill_kinda.storage.local.remove(removableItems);
    }
    async function deleteExpired() {
      await deleteWithLogic((cachedItem => Date.now() > cachedItem.maxAge));
    }
    const webext_storage_cache_cache = {
      has: async function(key) {
        return void 0 !== await _get(key, !1);
      },
      get: async function(key) {
        const cacheItem = await _get(key, !0);
        return null == cacheItem ? void 0 : cacheItem.data;
      },
      set,
      clear: async function() {
        await deleteWithLogic();
      },
      function: function(getter, {cacheKey, maxAge = {
        days: 30
      }, staleWhileRevalidate = {
        days: 0
      }, shouldRevalidate} = {}) {
        const getSet = async (key, args) => {
          const freshValue = await getter(...args);
          if (void 0 === freshValue) return void await delete_(key);
          return set(key, freshValue, {
            milliseconds: toMilliseconds(maxAge) + toMilliseconds(staleWhileRevalidate)
          });
        };
        return Object.assign(micro_memoize((async (...args) => {
          const userKey = cacheKey ? cacheKey(args) : args[0], cachedItem = await _get(userKey, !1);
          return void 0 === cachedItem || (null == shouldRevalidate ? void 0 : shouldRevalidate(cachedItem.data)) ? getSet(userKey, args) : (timeInTheFuture(staleWhileRevalidate) > cachedItem.maxAge && setTimeout(getSet, 0, userKey, args), 
          cachedItem.data);
        })), {
          fresh: async (...args) => {
            const userKey = cacheKey ? cacheKey(args) : args[0];
            return getSet(userKey, args);
          }
        });
      },
      delete: delete_
    };
    !function() {
      if (isExtensionContext() && (globalThis.webextStorageCache = webext_storage_cache_cache), 
      isBackgroundPage()) if (chrome.alarms) {
        chrome.alarms.create("webext-storage-cache", {
          delayInMinutes: 1,
          periodInMinutes: 1440
        });
        let lastRun = 0;
        chrome.alarms.onAlarm.addListener((alarm => {
          "webext-storage-cache" === alarm.name && lastRun < Date.now() - 1e3 && (lastRun = Date.now(), 
          deleteExpired());
        }));
      } else setTimeout(deleteExpired, 6e4), setInterval(deleteExpired, 864e5);
    }();
    const webext_storage_cache = webext_storage_cache_cache;
    var many_keys_map = __webpack_require__(774);
    class yocto_queue_Queue {
      #head;
      #tail;
      #size;
      constructor() {
        this.clear();
      }
      enqueue(value) {
        const node = new yocto_queue_Node(value);
        this.#head ? (this.#tail.next = node, this.#tail = node) : (this.#head = node, this.#tail = node), 
        this.#size++;
      }
      dequeue() {
        const current = this.#head;
        if (current) return this.#head = this.#head.next, this.#size--, current.value;
      }
      clear() {
        this.#head = void 0, this.#tail = void 0, this.#size = 0;
      }
      get size() {
        return this.#size;
      }
      * [Symbol.iterator]() {
        let current = this.#head;
        for (;current; ) yield current.value, current = current.next;
      }
    }
    const element_ready_cache = new many_keys_map, isDomReady = target => [ "interactive", "complete" ].includes((target.ownerDocument || target).readyState);
    function elementReady(selector, {target = document, stopOnDomReady = !0, waitForChildren = !0, timeout = Number.POSITIVE_INFINITY, predicate} = {}) {
      const cacheKeys = [ selector, stopOnDomReady, timeout, waitForChildren, target ], cachedPromise = element_ready_cache.get(cacheKeys);
      if (cachedPromise) return cachedPromise;
      let rafId;
      const deferred = function() {
        const deferred = {};
        return deferred.promise = new Promise(((resolve, reject) => {
          deferred.resolve = resolve, deferred.reject = reject;
        })), deferred;
      }(), {promise} = deferred;
      element_ready_cache.set(cacheKeys, promise);
      const stop = element => {
        cancelAnimationFrame(rafId), element_ready_cache.delete(cacheKeys, promise), deferred.resolve(element);
      };
      return timeout !== Number.POSITIVE_INFINITY && setTimeout(stop, timeout), function check() {
        const element = function({target, selector, predicate} = {}) {
          if (predicate) {
            return [ ...target.querySelectorAll(selector) ].find((element => predicate(element)));
          }
          return target.querySelector(selector);
        }({
          target,
          selector,
          predicate
        });
        if (isDomReady(target) && (stopOnDomReady || element)) return void stop(element || void 0);
        let current = element;
        for (;current; ) {
          if (!waitForChildren || current.nextSibling) return void stop(element);
          current = current.parentElement;
        }
        rafId = requestAnimationFrame(check);
      }(), Object.assign(promise, {
        stop: () => stop()
      });
    }
    function pluralize(count, single, plural = function(single) {
      return single + "s";
    }(single), zero) {
      return 0 === count && zero ? zero.replace("$$", "0") : 1 === count ? single.replace("$$", "1") : plural.replace("$$", String(count));
    }
    function featureLink(id) {
      return `https://github.com/refined-github/refined-github/blob/main/source/features/${id}.tsx`;
    }
    const importedFeatures = [ "action-used-by-link", "align-issue-labels", "avoid-accidental-submissions", "batch-mark-files-as-viewed", "bugs-tab", "bypass-checks", "ci-link", "clean-conversation-filters", "clean-conversation-headers", "clean-conversation-sidebar", "clean-header-search-field", "clean-pinned-issues", "clean-repo-filelist-actions", "clean-repo-sidebar", "clean-repo-tabs", "clean-rich-text-editor", "clear-pr-merge-commit-message", "close-out-of-view-modals", "closing-remarks", "collapsible-content-button", "command-palette-navigation-shortcuts", "comment-fields-keyboard-shortcuts", "comment-on-draft-pr-indicator", "comments-time-machine-links", "conflict-marker", "conversation-activity-filter", "conversation-links-on-repo-lists", "convert-pr-to-draft-improvements", "convert-release-to-draft", "copy-file", "copy-on-y", "create-release-shortcut", "cross-deleted-pr-branches", "deep-reblame", "default-branch-button", "dim-bots", "download-folder-button", "easy-toggle-commit-messages", "easy-toggle-files", "edit-readme", "embed-gist-inline", "embed-gist-via-iframe", "enable-file-links-in-compare-view", "esc-to-cancel", "esc-to-deselect-line", "expand-all-hidden-comments", "extend-conversation-status-filters", "extend-diff-expander", "file-finder-buffer", "fit-textareas", "fork-source-link-same-view", "git-checkout-pr", "global-conversation-list-filters", "global-search-filters", "hidden-review-comments-indicator", "hide-diff-signs", "hide-disabled-milestone-sorter", "hide-inactive-deployments", "hide-issue-list-autocomplete", "hide-low-quality-comments", "hide-navigation-hover-highlight", "hide-newsfeed-noise", "hide-own-stars", "highest-rated-comment", "highlight-collaborators-and-own-conversations", "highlight-deleted-and-added-files-in-diffs", "highlight-non-default-base-branch", "html-preview-link", "improve-shortcut-help", "infinite-scroll", "jump-to-change-requested-comment", "jump-to-conversation-close-event", "keyboard-navigation", "last-notification-page-button", "latest-tag-button", "link-to-changelog-file", "link-to-compare-diff", "link-to-github-io", "link-to-prior-blame-line", "linkify-branch-references", "linkify-code", "linkify-commit-sha", "linkify-labels-on-dashboard", "linkify-notification-repository-header", "linkify-symbolic-links", "linkify-user-edit-history-popup", "linkify-user-labels", "linkify-user-location", "list-prs-for-branch", "list-prs-for-file", "mark-merge-commits-in-list", "mark-private-orgs", "minimize-upload-bar", "more-conversation-filters", "more-dropdown-links", "more-file-links", "new-repo-disable-projects-and-wikis", "no-duplicate-list-update-time", "no-unnecessary-split-diff-view", "one-click-diff-options", "one-click-pr-or-gist", "one-click-review-submission", "one-key-formatting", "open-all-conversations", "open-all-notifications", "open-ci-details-in-new-tab", "open-issue-to-latest-comment", "pagination-hotkey", "parse-backticks", "patch-diff-links", "pinned-issues-update-time", "pr-branch-auto-delete", "pr-commit-lines-changed", "pr-filters", "pr-jump-to-first-non-viewed-file", "prevent-duplicate-pr-submission", "prevent-link-loss", "prevent-pr-merge-panel-opening", "preview-hidden-comments", "previous-next-commit-buttons", "profile-gists-link", "profile-hotkey", "pull-request-hotkeys", "quick-comment-edit", "quick-comment-hiding", "quick-file-edit", "quick-label-removal", "quick-mention", "quick-repo-deletion", "quick-review", "quick-review-comment-deletion", "reactions-avatars", "release-download-count", "releases-tab", "reload-failed-proxied-images", "repo-age", "repo-avatars", "repo-wide-file-finder", "resolve-conflicts", "restore-file", "rgh-feature-descriptions", "rgh-improve-new-issue-form", "rgh-linkify-features", "rgh-sponsor-button", "rgh-welcome-issue", "same-branch-author-commits", "same-page-definition-jump", "scheduled-and-manual-workflow-indicators", "select-all-notifications-shortcut", "select-notifications", "selection-in-new-tab", "set-default-repositories-type-to-sources", "shorten-links", "show-associated-branch-prs-on-fork", "show-names", "show-open-prs-of-forks", "show-user-top-repositories", "show-whitespace", "sort-conversations-by-update-time", "sticky-sidebar", "stop-pjax-loading-with-esc", "stop-redirecting-in-notification-bar", "submission-via-ctrl-enter-everywhere", "suggest-commit-title-limit", "swap-branches-on-compare", "sync-pr-commit-title", "tab-to-indent", "table-input", "tag-changes-link", "tags-dropdown", "tags-on-commits-list", "toggle-everything-with-alt", "toggle-files-button", "unfinished-comments", "unwrap-unnecessary-dropdowns", "update-pr-from-base-branch", "use-first-commit-message-for-new-prs", "useful-forks", "useful-not-found-page", "user-local-time", "user-profile-follower-badge", "vertical-front-matter", "view-last-pr-deployment", "wait-for-attachments", "wait-for-checks", "warn-pr-from-master", "warning-for-disallow-edits" ], featuresMeta = [ {
      id: "action-used-by-link",
      description: "<p>Lets you see how others are using the current Action in the Marketplace.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/8360597/80250140-86d9c080-8673-11ea-9d28-f62faf9fd3d4.png"
    }, {
      id: "align-issue-labels",
      description: "<p>In conversation lists, aligns the labels to the left, below each title.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/37769974/85866472-11aa7900-b7e5-11ea-80aa-d84e3aee2551.png"
    }, {
      id: "align-repository-header",
      description: "<p>Aligns the repository header to the repository content on wide screens.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/86574587-587f3800-bf76-11ea-9961-5c25cdb6e357.gif"
    }, {
      id: "avoid-accidental-submissions",
      description: "<p>Disables the <kbd>enter</kbd>-to-submit shortcut in some commit/PR/issue title fields to avoid accidental submissions. Use <kbd>ctrl</kbd> <kbd>enter</kbd> instead.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/723651/125863341-6cf0bce0-f120-4cec-ac1f-1ce35920e7a7.gif"
    }, {
      id: "batch-mark-files-as-viewed",
      description: "<p>Mark/unmark multiple files as “Viewed” in the PR Files tab. Click on the first checkbox you want to mark/unmark and then <code>shift</code>-click another one; all the files between the two checkboxes will be marked/unmarked as “Viewed”.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/79343285-854f2080-7f2e-11ea-8d4c-a9dc163be9be.gif"
    }, {
      id: "bugs-tab",
      description: "<p>Adds a &quot;Bugs&quot; tab to repos, if there are any open issues with the &quot;bug&quot; label.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/156766081-f2ea100b-a9f3-472b-bddc-a984a88ddcd3.png"
    }, {
      id: "bypass-checks",
      description: "<p>Bypasses the &quot;Checks&quot; interstitial when clicking the &quot;Details&quot; links on a PR Checks added by third-party services like Travis.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/2103975/49071220-c6596e80-f22d-11e8-8a1e-bdcd62aa6ece.png"
    }, {
      id: "ci-link",
      description: "<p>Adds a build/CI status icon next to the repo’s name.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/32562120-d65166e4-c4e8-11e7-90fb-cbaf36e2709f.png"
    }, {
      id: "clean-conversation-filters",
      description: "<p>Hides <code>Projects</code> and <code>Milestones</code> filters in conversation lists if they are empty.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/37769974/59083449-0ef88f80-8915-11e9-8296-68af1ddcf191.png"
    }, {
      id: "clean-conversation-headers",
      description: "<p>Removes duplicate information in the header of issues and PRs (&quot;User wants to merge X commits from Y into Z&quot;)</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/112314137-a34b0680-8ce3-11eb-9e0e-8afd6c8235c2.png"
    }, {
      id: "clean-conversation-sidebar",
      description: "<p>Hides empty sections (or just their &quot;empty&quot; label) in the conversation sidebar.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/57199809-20691780-6fb6-11e9-9672-1ad3f9e1b827.png"
    }, {
      id: "clean-header-search-field",
      description: "<p>Clears duplicate queries in the header search field.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/114177338-7c890300-9966-11eb-83a3-a711a76fae99.png"
    }, {
      id: "clean-pinned-issues",
      description: "<p>Changes the layout of pinned issues from side-by-side to a standard list.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/84509958-c82a3c00-acc4-11ea-8399-eaf06a59e9e4.png"
    }, {
      id: "clean-repo-filelist-actions",
      description: "<p>Makes some buttons on repository lists more compact to make room for other features.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/108955170-52d48080-7633-11eb-8979-67e0d3a53f16.png"
    }, {
      id: "clean-repo-sidebar",
      description: "<p>Removes unnecessary or redundant information from the repository sidebar.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/107955448-18694480-6f9e-11eb-8bc6-80cc90d910bc.png"
    }, {
      id: "clean-repo-tabs",
      description: "<p>Moves the &quot;Security&quot; and &quot;Insights&quot; to the repository navigation dropdown. Also moves the &quot;Projects&quot;, &quot;Actions&quot; and &quot;Wiki&quot; tabs if they're empty/unused.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/124681343-4a6c3c00-de96-11eb-9055-a8fc551e6eb8.png"
    }, {
      id: "clean-rich-text-editor",
      description: "<p>Hides unnecessary comment field tooltips and toolbar items (each one has a keyboard shortcut.)</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/158201651-7364aba7-f9d0-4a51-89c4-2ced0cc34e48.png"
    }, {
      id: "clear-pr-merge-commit-message",
      description: "<p>Clears the PR merge commit message of clutter, leaving only deduplicated co-authors.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/79257078-62b6fc00-7e89-11ea-8798-c06f33baa94b.png"
    }, {
      id: "close-out-of-view-modals",
      description: "<p>Automatically closes dropdown menus when they’re no longer visible.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/37022353-531c676e-2155-11e8-96cc-80d934bb22e0.gif"
    }, {
      id: "closing-remarks",
      description: "<p>Shows the first Git tag a merged PR was included in or suggests creating a release if not yet released.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/169497171-85d4a97f-413a-41b4-84ba-885dca2b51cf.png"
    }, {
      id: "collapsible-content-button",
      description: "<p>Adds a button to insert collapsible content (via <code>&lt;details&gt;</code>).</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/53678019-0c721280-3cf4-11e9-9c24-4d11a697f67c.png"
    }, {
      id: "command-palette-navigation-shortcuts",
      description: "<p>Adds keyboard shortcuts to select items in command palette using <kbd>ctrl</kbd> <kbd>n</kbd> and <kbd>ctrl</kbd> <kbd>p</kbd> (macOS only).</p>\n"
    }, {
      id: "comment-fields-keyboard-shortcuts",
      description: "<p>Adds a shortcut to edit your last comment: <kbd>↑</kbd>. (Only works in the following comment field, if it’s empty.)</p>\n"
    }, {
      id: "comment-on-draft-pr-indicator",
      description: "<p>Reminds you you’re commenting on a draft PR by changing the submit button’s label.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/34235681/152473140-22b6eb86-3ef4-4104-af10-4a659d878f91.png"
    }, {
      id: "comments-time-machine-links",
      description: "<p>Adds links to browse the repository and linked files at the time of each comment.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/56450896-68076680-635b-11e9-8b24-ebd11cc4e655.png"
    }, {
      id: "conflict-marker",
      description: "<p>Shows which PRs have conflicts in PR lists.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/9092510/62777551-2affe500-baae-11e9-8ba4-67f078347913.png"
    }, {
      id: "conversation-activity-filter",
      description: "<p>Lets you hide every event except comments or unresolved comments in issues and PRs.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/109592127-5f922200-7ad4-11eb-8dfa-1d80fb28e70e.png"
    }, {
      id: "conversation-links-on-repo-lists",
      description: "<p>Adds a link to the issues and pulls on the user profile repository tab and global search.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/78712349-82c54900-78e6-11ea-8328-3c2d39a78862.png"
    }, {
      id: "convert-pr-to-draft-improvements",
      description: "<p>Moves the &quot;Convert PR to Draft&quot; button to the mergeability box and adds visual feedback to its confirm button.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/95644892-885f3f80-0a7f-11eb-8428-8e0fb0c8dfa5.gif"
    }, {
      id: "convert-release-to-draft",
      description: "<p>Adds a button to convert a release to draft.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/139236979-44533bfd-5c17-457d-bdc1-f9ec395f6a3a.png"
    }, {
      id: "copy-file",
      description: "<p>Adds a button to copy a file’s content.</p>\n",
      screenshot: "https://cloud.githubusercontent.com/assets/170270/14453865/8abeaefe-00c1-11e6-8718-9406cee1dc0d.png"
    }, {
      id: "copy-on-y",
      description: "<p>Enhances the <kbd>y</kbd> hotkey to also copy the permalink.</p>\n"
    }, {
      id: "create-release-shortcut",
      description: "<p>Adds a keyboard shortcut to create a new release while on the Releases page: <kbd>c</kbd>.</p>\n"
    }, {
      id: "cross-deleted-pr-branches",
      description: "<p>Adds a line-through to the deleted branches in PRs.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/75619638-9bef1300-5b4c-11ea-850e-3a8f95c86d83.png"
    }, {
      id: "deep-reblame",
      description: "<p>When exploring blames, <code>Alt</code>-clicking the “Reblame” buttons will extract the associated PR’s commits first, instead of treating the commit a single change.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/77248541-8e3f2180-6c10-11ea-91d4-221ccc0ecebb.png"
    }, {
      id: "default-branch-button",
      description: "<p>Adds a link to the default branch on directory listings and files.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/71886648-2891dc00-316f-11ea-98d8-c5bf6c24d85c.png"
    }, {
      id: "dim-bots",
      description: "<p>Dims commits and PRs by bots to reduce noise.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/65263190-44c52b00-db36-11e9-9b33-d275d3c8479d.gif"
    }, {
      id: "download-folder-button",
      description: '<p>Adds a button to download entire folders, via <a href="https://download-directory.github.io">https://download-directory.github.io</a>.</p>\n',
      screenshot: "https://user-images.githubusercontent.com/46634000/158347358-49234bb8-b9e6-41be-92ed-c0c0233cbad2.png"
    }, {
      id: "easy-toggle-commit-messages",
      description: "<p>Enables toggling commit messages by clicking on the commit box.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/152121837-ca13bf8a-9b7f-4517-8e8d-b58bb135523b.gif"
    }, {
      id: "easy-toggle-files",
      description: "<p>Enables toggling file diffs by clicking on their header bar.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/47531779/99855419-be173e00-2b7e-11eb-9a55-0f6251aeb0ef.gif"
    }, {
      id: "edit-readme",
      description: "<p>Ensures that the “Edit readme” button always appears (even when you have to make a fork) and works (GitHub’s link doesn’t work on git tags).</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/62073307-a8378880-b26a-11e9-9e31-be6525d989d2.png"
    }, {
      id: "embed-gist-inline",
      description: "<p>Embeds short gists when linked in comments on their own lines.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/152117903-80d784d5-4f43-4786-bc4c-d4993aec5c79.png"
    }, {
      id: "embed-gist-via-iframe",
      description: "<p>Adds a menu item to embed a gist via <code>&lt;iframe&gt;</code>.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/63633382-6a1b6200-c67a-11e9-9038-aedd62e4f6a8.png"
    }, {
      id: "enable-file-links-in-compare-view",
      description: "<p>Points the &quot;View file&quot; on compare view pages to the branch instead of the commit, so the Edit/Delete buttons will be enabled on the &quot;View file&quot; page, if needed.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/69044026-c5b17d80-0a26-11ea-86ae-c95f89d3669a.png"
    }, {
      id: "esc-to-cancel",
      description: "<p>Adds a shortcut to cancel editing a conversation title: <kbd>esc</kbd>.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/35100156/98303086-d81d2200-1fbd-11eb-8529-70d48d889bcf.gif"
    }, {
      id: "esc-to-deselect-line",
      description: "<p>Adds a keyboard shortcut to deselect the current line: <kbd>esc</kbd>.</p>\n"
    }, {
      id: "expand-all-hidden-comments",
      description: "<p>On long conversations where GitHub hides comments under a &quot;Load more...&quot;, alt-clicking it will load up to 200 comments at once instead of 60.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/73838332-0c548e00-4846-11ea-935f-28d728b30ae9.png"
    }, {
      id: "extend-conversation-status-filters",
      description: "<p>Lets you toggle between is:open/is:closed/is:merged filters in searches.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/73605061-2125ed00-45cc-11ea-8cbd-41a53ae00cd3.gif"
    }, {
      id: "extend-diff-expander",
      description: "<p>Widens the <code>Expand diff</code> button to be clickable across the screen.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/152118201-f25034c7-6fae-4be0-bb3f-c217647e32b7.gif"
    }, {
      id: "file-finder-buffer",
      description: "<p>Lets you start typing your search immediately after invoking the File Finder (<kbd>t</kbd>), instead of having you wait for it to load first.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/75542106-1c811700-5a5a-11ea-8aa5-bea0472c59e2.gif"
    }, {
      id: "fit-textareas",
      description: "<p>Auto-resizes comment fields to fit their content and no longer show scroll bars.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/54336211-66fd5e00-4666-11e9-9c5e-111fccab004d.gif"
    }, {
      id: "fork-source-link-same-view",
      description: "<p>Points the “Forked from user/repository” link to current folder or file in the upstream repository.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/84795784-3722d000-aff8-11ea-9b34-97c01acf4fd4.png"
    }, {
      id: "git-checkout-pr",
      description: "<p>Adds copy-pastable git commands to checkout a PR.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/96938908-8e024f80-1499-11eb-8976-0caf95175dd6.png"
    }, {
      id: "global-conversation-list-filters",
      description: "<p>Adds filters for conversations <em>in your repos</em> and <em>commented on by you</em> in the global conversation search.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/8295888/36827126-8bfc79c4-1d37-11e8-8754-992968b082be.png"
    }, {
      id: "global-search-filters",
      description: "<p>Adds search filters in global search page: forks, private repos, own repos, authored commits.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/112261285-88a66c80-8ca6-11eb-82cb-933b72c57abd.png"
    }, {
      id: "hidden-review-comments-indicator",
      description: "<p>Adds comment indicators when comments are hidden in PR review.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/63112671-011d5580-bfbb-11e9-9e19-53e11641990e.gif"
    }, {
      id: "hide-diff-signs",
      description: "<p>Hides diff signs since diffs are color coded already.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/54807718-149cec80-4cb9-11e9-869c-e265863211e3.png"
    }, {
      id: "hide-disabled-milestone-sorter",
      description: "<p>Hides the milestone sorter UI if you don’t have permission to use it.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/7753001/56913933-738a2880-6ae5-11e9-9d13-1973cbbf5df0.png"
    }, {
      id: "hide-inactive-deployments",
      description: "<p>Hides inactive deployments in PRs.</p>\n"
    }, {
      id: "hide-issue-list-autocomplete",
      description: "<p>Removes the autocomplete on search fields.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/42991841-1f057e4e-8c07-11e8-909c-b051db7a2a03.png"
    }, {
      id: "hide-low-quality-comments",
      description: "<p>Hides reaction comments (&quot;+1&quot;, &quot;👍&quot;, …) (except the maintainers’) but they can still be shown.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/45543717-d45f3c00-b847-11e8-84a5-8c439d0ad1a5.png"
    }, {
      id: "hide-navigation-hover-highlight",
      description: "<p>Removes the file hover effect in the repo file browser.</p>\n"
    }, {
      id: "hide-newsfeed-noise",
      description: "<p>Hides other inutile newsfeed events (commits, forks, new followers).</p>\n"
    }, {
      id: "hide-own-stars",
      description: "<p>Hides &quot;starred&quot; events for your own repos on the newsfeed.</p>\n"
    }, {
      id: "hide-watch-and-fork-count",
      description: "<p>Hides watcher counter and on smaller screens the fork counter too.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/53681077-f3328b80-3d1e-11e9-9e29-2cb017141769.png"
    }, {
      id: "highest-rated-comment",
      description: "<p>Highlights the most useful comment in conversations.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/99895146-16b50c80-2c4d-11eb-8038-210e6fd5e798.png"
    }, {
      id: "highlight-collaborators-and-own-conversations",
      description: "<p>Highlights conversations opened by you or the current repo’s collaborators.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/65013882-03225d80-d947-11e9-8eb8-5507bc1fc14b.png"
    }, {
      id: "highlight-deleted-and-added-files-in-diffs",
      description: "<p>Indicates with an icon whether files in commits and pull requests being added or removed.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/90332474-23262b00-dfb5-11ea-9a03-8fd676ea0fdd.png"
    }, {
      id: "highlight-non-default-base-branch",
      description: "<p>Shows the base branch in PR lists if it’s not the default branch.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/88480306-39f4d700-cf4d-11ea-9e40-2b36d92d41aa.png"
    }, {
      id: "html-preview-link",
      description: "<p>Adds a link to preview HTML files.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/67634792-48995980-f8fb-11e9-8b6a-7b57d5b12a2f.png"
    }, {
      id: "improve-shortcut-help",
      description: "<p>Shows all of Refined GitHub’s new keyboard shortcuts in the help modal (<kbd>?</kbd> hotkey).</p>\n",
      screenshot: "https://user-images.githubusercontent.com/29176678/36999174-9f07d33e-20bf-11e8-83e3-b3a9908a4b5f.png"
    }, {
      id: "infinite-scroll",
      description: "<p>Automagically expands the newsfeed when you scroll down.</p>\n"
    }, {
      id: "jump-to-change-requested-comment",
      description: "<p>Adds a link to jump to the latest changed requested comment.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/19198931/98718312-418b9f00-23c9-11eb-8da2-dfb616e95eb6.gif"
    }, {
      id: "jump-to-conversation-close-event",
      description: "<p>Adds a link to jump to the latest close event of a conversation.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/177792713-64219754-f8df-4629-a9ec-33259307cfe7.gif"
    }, {
      id: "keyboard-navigation",
      description: "<p>Adds shortcuts to conversations and PR file lists: <kbd>j</kbd> focuses the comment/file below; <kbd>k</kbd> focuses the comment/file above.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/86573176-48665900-bf74-11ea-8996-a5c46cb7bdfd.gif"
    }, {
      id: "last-notification-page-button",
      description: "<p>Adds a link to the last page of notifications.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/199828181-3ff2cef3-8740-4efa-8122-8f2f222bd657.png"
    }, {
      id: "latest-tag-button",
      description: "<p>Adds a link to the latest version tag on directory listings and files.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/155496122-6267c45d-21d4-45c9-adf7-94c9e41cc652.png"
    }, {
      id: "link-to-changelog-file",
      description: "<p>Adds a button to view the changelog file from the releases page.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/139236982-a1bce2a2-f3aa-40a9-bca4-8756bc941210.png"
    }, {
      id: "link-to-compare-diff",
      description: "<p>Linkifies the &quot;X files changed&quot; text on compare pages to allow jumping to the diff.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/157072587-0335357a-18c7-44c4-ae6e-237080fb36b4.png"
    }, {
      id: "link-to-github-io",
      description: "<p>Adds a link to visit the user’s github.io website from its repo.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/34235681/152473104-c4723999-9239-48fd-baee-273b01c4eb87.png"
    }, {
      id: "link-to-prior-blame-line",
      description: "<p>Preserves the current line on “View blame prior to this change” links.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/60064482-26b47e00-9733-11e9-803c-c113ea612fbe.png"
    }, {
      id: "linkify-branch-references",
      description: "<p>Linkifies branch references in &quot;Quick PR&quot; pages.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/30208043-fa1ceaec-94bb-11e7-9c32-feabcf7db296.png"
    }, {
      id: "linkify-code",
      description: "<p>Linkifies issue/PR references and URLs in code and conversation titles.</p>\n",
      screenshot: "https://cloud.githubusercontent.com/assets/170270/25370217/61718820-29b3-11e7-89c5-2959eaf8cac8.png"
    }, {
      id: "linkify-commit-sha",
      description: "<p>Adds a link to the non-PR commit when visiting a PR commit.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/101152/42968387-606b23f2-8ba3-11e8-8a4b-667bddc8d33c.png"
    }, {
      id: "linkify-labels-on-dashboard",
      description: "<p>Makes labels clickable on the dashboard.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/136909258-88031d07-6efa-4339-b436-5636e8075964.png"
    }, {
      id: "linkify-notification-repository-header",
      description: "<p>Linkifies the header of each notification group (when grouped by repository).</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/80849887-81531c00-8c19-11ea-8777-7294ce318630.png"
    }, {
      id: "linkify-symbolic-links",
      description: "<p>Linkifies symbolic links files.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/62036664-6d0e6880-b21c-11e9-9270-4ae30cc10de2.png"
    }, {
      id: "linkify-user-edit-history-popup",
      description: "<p>Linkifies the username in the edit history popup.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/88917988-9ebb7480-d260-11ea-8690-0a3440f1ebbc.png"
    }, {
      id: "linkify-user-labels",
      description: "<p>Links the &quot;Contributor&quot; and &quot;Member&quot; labels on comments to the author’s commits on the repo.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/177033344-4d4eea63-e075-4096-b2d4-f4b879f1df31.png"
    }, {
      id: "linkify-user-location",
      description: "<p>Linkifies the user location in their hovercard and profile page.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/69076885-00d3a100-0a67-11ea-952a-690acec0826f.png"
    }, {
      id: "list-prs-for-branch",
      description: "<p>On branch commit lists, shows the PR that touches the current branch.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/119760295-b8751a80-be77-11eb-87da-91d0c403bb49.png"
    }, {
      id: "list-prs-for-file",
      description: "<p>Shows PRs that touch the current file.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/55841/60622834-879e1f00-9de1-11e9-9a9e-bae5ec0b3728.png"
    }, {
      id: "mark-merge-commits-in-list",
      description: "<p>Marks merge commits in commit lists.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/75561016-457eb900-5a14-11ea-95e1-a89e81ee7390.png"
    }, {
      id: "mark-private-orgs",
      description: "<p>Marks private organizations on your own profile.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/6775216/44633467-d5dcc900-a959-11e8-9116-e6b0ffef66af.png"
    }, {
      id: "minimize-upload-bar",
      description: "<p>Reduces the upload bar to a small button.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/17612510/99140148-205dd380-2693-11eb-9a61-9c228f8f9e36.png"
    }, {
      id: "more-conversation-filters",
      description: "<p>Adds <code>Everything you’re involved in</code> and <code>Everything you subscribed to</code> filters in the search box dropdown.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/202916/84156153-72a62300-aa69-11ea-8592-3094292fde3c.png"
    }, {
      id: "more-dropdown-links",
      description: "<p>Adds useful links to the repository navigation dropdown</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/124681432-856e6f80-de96-11eb-89c9-6d78e8ae4329.png"
    }, {
      id: "more-file-links",
      description: "<p>Adds links to view the raw version, the blame and the history of files in PRs and commits.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/145016304-aec5a8b8-4cdb-48e6-936f-b214a3fb4b49.png"
    }, {
      id: "new-repo-disable-projects-and-wikis",
      description: "<p>Automatically disables projects and wikis when creating a repository.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/177040449-73fde2a5-98e2-4583-8f32-905d1c4bfd20.png"
    }, {
      id: "no-duplicate-list-update-time",
      description: "<p>Hides the update time of conversations in lists when it matches the open/closed/merged time.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/111357166-ac3a3900-864e-11eb-884a-d6d6da88f7e2.png"
    }, {
      id: "no-unnecessary-split-diff-view",
      description: "<p>Always uses unified diffs on files where split diffs aren’t useful.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/121495005-89af8600-c9d9-11eb-822d-77e0b987e3b1.png"
    }, {
      id: "one-click-diff-options",
      description: "<p>Adds one-click buttons to change diff style and to ignore the whitespace and a keyboard shortcut to ignore the whitespace: <kbd>d</kbd> <kbd>w</kbd>.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/156766044-18c9ff50-aead-4c40-ba16-7428b3742b6c.png"
    }, {
      id: "one-click-pr-or-gist",
      description: "<p>Lets you create draft pull requests and public gists in one click.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/34235681/152473201-868ad7c1-e06f-4826-b808-d90bca7f08b3.png"
    }, {
      id: "one-click-review-submission",
      description: "<p>Simplifies the PR review form: Approve or reject reviews faster with one-click review-type buttons.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/34326942-529cb7c0-e8f3-11e7-9bee-98b667e18a90.png"
    }, {
      id: "one-key-formatting",
      description: "<p>Wraps selected text when pressing one of Markdown symbols instead of replacing it: <code>[</code> <code>`</code> <code>'</code> <code>&quot;</code> <code>*</code> <code>~</code> <code>_</code></p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/65020298-1f2dfb00-d957-11e9-9a2a-1c0ceab8d9e0.gif"
    }, {
      id: "open-all-conversations",
      description: "<p>Lets you open all visible conversations at once.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/110980658-5face000-8366-11eb-88f9-0cc94f75ce57.gif"
    }, {
      id: "open-all-notifications",
      description: "<p>Adds a button to open all your unread notifications at once.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/80861295-fbad8b80-8c6d-11ea-87a4-8025fbc3a3f4.png"
    }, {
      id: "open-ci-details-in-new-tab",
      description: "<p>Opens the Checks &quot;details&quot; link in a new tab.</p>\n"
    }, {
      id: "open-issue-to-latest-comment",
      description: "<p>Makes the &quot;comment&quot; icon in issue lists link to the latest comment of the issue.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/14323370/57962709-7019de00-78e8-11e9-8398-7e617ba7a96f.png"
    }, {
      id: "pagination-hotkey",
      description: "<p>Adds shortcuts to navigate through pages with pagination: <kbd>←</kbd> and <kbd>→</kbd>.</p>\n"
    }, {
      id: "parse-backticks",
      description: "<p>Renders <code>`text in backticks`</code> in issue titles, commit titles and more places.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/170270/55060505-31179b00-50a4-11e9-99a9-c3691ba38d66.png"
    }, {
      id: "patch-diff-links",
      description: "<p>Adds links to <code>.patch</code> and <code>.diff</code> files in commits.</p>\n",
      screenshot: "https://cloud.githubusercontent.com/assets/737065/13605562/22faa79e-e516-11e5-80db-2da6aa7965ac.png"
    }, {
      id: "pinned-issues-update-time",
      description: "<p>Adds the updated time to pinned issues.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/75525936-bb524700-5a4b-11ea-9225-466bda58b7de.png"
    }, {
      id: "pr-approvals-count",
      description: "<p>Shows color-coded review counts in PR lists.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/33474535-a814ee78-d6ad-11e7-8f08-a8b72799e376.png"
    }, {
      id: "pr-branch-auto-delete",
      description: "<p>Automatically deletes the branch right after merging a PR, if possible.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/177067141-eabc7494-38a2-45b5-aef9-ac33cc0da370.png"
    }, {
      id: "pr-commit-lines-changed",
      description: "<p>Adds diff stats on PR commits.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/76107253-48deeb00-5fa6-11ea-9931-721cde553bdf.png"
    }, {
      id: "pr-filters",
      description: "<p>Adds Checks and Draft PR dropdown filters in PR lists.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/202916/74453250-6d9de200-4e82-11ea-8fd4-7c0de57e001a.png"
    }, {
      id: "pr-jump-to-first-non-viewed-file",
      description: "<p>Jumps to first non-viewed file in a pull request when clicking on the progress bar.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/85226580-3bf3d500-b3a6-11ea-8494-3d9b6280d033.gif"
    }, {
      id: "prevent-duplicate-pr-submission",
      description: "<p>Avoids creating duplicate PRs when mistakenly clicking &quot;Create pull request&quot; more than once.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/89589967-e029c200-d814-11ea-962b-3ff1f6236781.gif"
    }, {
      id: "prevent-link-loss",
      description: "<p>Suggests fixing links that are wrongly shortened by GitHub.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/82131169-93fd5180-97d2-11ea-9695-97051c55091f.gif"
    }, {
      id: "prevent-pr-merge-panel-opening",
      description: "<p>Prevents the merge panel from automatically opening on every page load after it’s been opened once.</p>\n"
    }, {
      id: "preview-hidden-comments",
      description: "<p>Previews hidden comments inline.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/52545036-6e271700-2def-11e9-8c0c-b5e0fa6f37dd.png"
    }, {
      id: "previous-next-commit-buttons",
      description: "<p>Adds duplicate commit navigation buttons at the bottom of the <code>Commits</code> tab page.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/24777/41755271-741773de-75a4-11e8-9181-fcc1c73df633.png"
    }, {
      id: "profile-gists-link",
      description: "<p>Adds a link to the user’s public gists on their profile.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/87950518-f7a94100-cad9-11ea-8393-609fad70635c.png"
    }, {
      id: "profile-hotkey",
      description: "<p>Adds a keyboard shortcut to visit your own profile: <kbd>g</kbd> <kbd>m</kbd>.</p>\n"
    }, {
      id: "pull-request-hotkeys",
      description: "<p>Adds keyboard shortcuts to cycle through PR tabs: <kbd>g</kbd> <kbd>←</kbd> and <kbd>g</kbd> <kbd>→</kbd>, or <kbd>g</kbd> <kbd>1</kbd>, <kbd>g</kbd> <kbd>2</kbd>, <kbd>g</kbd> <kbd>3</kbd> and <kbd>g</kbd> <kbd>4</kbd>.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/94634958-7e7b5680-029f-11eb-82ea-1f96cd11e4cd.png"
    }, {
      id: "quick-comment-edit",
      description: "<p>Lets you edit any comment with one click instead of having to open a dropdown.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/162252055-54750c89-0ddc-487a-b4ad-cec6009d9870.png"
    }, {
      id: "quick-comment-hiding",
      description: "<p>Simplifies the UI to hide comments.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/43039221-1ddc91f6-8d29-11e8-9ed4-93459191a510.gif"
    }, {
      id: "quick-file-edit",
      description: "<p>Adds a button to edit files from the repo file list.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/56370462-d51cde00-622d-11e9-8cd3-8a173bd3dc08.png"
    }, {
      id: "quick-label-removal",
      description: "<p>Adds one-click buttons to remove labels in conversations.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/36174850/89980178-0bc80480-dc7a-11ea-8ded-9e25f5f13d1a.gif"
    }, {
      id: "quick-mention",
      description: "<p>Adds a button to <code>@mention</code> a user in conversations.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/70406615-f445d580-1a73-11ea-9ab1-bf6bd9aa70a3.gif"
    }, {
      id: "quick-repo-deletion",
      description: "<p>Lets you delete your repos in a click, if they have no stars, issues, or PRs.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/99716945-54a80a00-2a6e-11eb-9107-f3517a6ab1bc.gif"
    }, {
      id: "quick-review",
      description: "<p>Adds a review button to the PR sidebar, automatically focuses the review textarea and adds a keyboard shortcut to open the review popup: <kbd>v</kbd>.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/202916/83269671-bb3b2200-a1c7-11ea-90b3-b9457a454162.png"
    }, {
      id: "quick-review-comment-deletion",
      description: "<p>Adds a button to delete review comments in one click when editing them.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/115445792-9fdd6900-a216-11eb-9ba3-6dab4d2f9d32.png"
    }, {
      id: "reactions-avatars",
      description: "<p>Adds reaction avatars showing <i>who</i> reacted to a comment.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/130341871-6a0d69f4-8d0c-4882-a5ed-aac9b7613b0a.png"
    }, {
      id: "refined-github.css",
      description: "<p>Reduces tabs’ size to 4 spaces instead of 8.</p>\n",
      screenshot: "https://cloud.githubusercontent.com/assets/170270/14170088/d3be931e-f755-11e5-8edf-c5f864336382.png"
    }, {
      id: "release-download-count",
      description: "<p>Adds a download count next to release assets.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/197958719-1577bc1b-1f4d-44a8-98c2-2645b7b14d31.png"
    }, {
      id: "releases-tab",
      description: "<p>Adds a <code>Releases</code> tab and a keyboard shortcut: <kbd>g</kbd> <kbd>r</kbd>.</p>\n",
      screenshot: "https://cloud.githubusercontent.com/assets/170270/13136797/16d3f0ea-d64f-11e5-8a45-d771c903038f.png"
    }, {
      id: "reload-failed-proxied-images",
      description: "<p>Retries downloading images that failed downloading due to GitHub limited proxying.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/14858959/64068746-21991100-cc45-11e9-844e-827f5ac9b51e.png"
    }, {
      id: "repo-age",
      description: "<p>Displays the age of the repository in the sidebar.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/3848317/69494069-7d2b1180-0eb7-11ea-9aa1-d4194e566340.png"
    }, {
      id: "repo-avatars",
      description: "<p>Adds the profile picture to the header of public repositories.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/177211845-c9b0fa37-c157-4449-890e-af2602c312e3.png"
    }, {
      id: "repo-wide-file-finder",
      description: "<p>Enables the File Finder keyboard shortcut (<kbd>t</kbd>) on entire repository.</p>\n"
    }, {
      id: "resolve-conflicts",
      description: "<p>Adds one-click merge conflict fixers.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/54978791-45906080-4fdc-11e9-8fe1-45374f8ff636.png"
    }, {
      id: "restore-file",
      description: "<p>Adds a button to revert all the changes to a file in a PR.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/130660479-083e91e6-0778-446a-9aaf-b9b3e7214281.gif"
    }, {
      id: "same-branch-author-commits",
      description: "<p>Preserves current branch and path when viewing all commits by an author.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/148764372-ee443213-e61a-4227-9219-0ee54ed832e8.png"
    }, {
      id: "same-page-definition-jump",
      description: "<p>Avoids re-loading the page when jumping to function definition in the current file.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/90833649-7a5e2f80-e316-11ea-827d-a4e3ac8ced69.png"
    }, {
      id: "scheduled-and-manual-workflow-indicators",
      description: "<p>In the workflows sidebar, shows an indicator that a workflow can be triggered manually, and its next scheduled time if relevant.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/139128320-78eb66c7-d485-46c0-bde2-50e00ba989f3.png"
    }, {
      id: "scrollable-code-and-blockquote",
      description: "<p>Limits the height of tall code blocks and quotes.</p>\n"
    }, {
      id: "select-all-notifications-shortcut",
      description: "<p>Adds a shortcut to select all visible notifications: <kbd>a</kbd>.</p>\n"
    }, {
      id: "select-notifications",
      description: "<p>Select notifications by type and status.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/152119039-4ea8333f-a744-4106-b56f-cf09f50678be.gif"
    }, {
      id: "selection-in-new-tab",
      description: "<p>Adds a keyboard shortcut to open selection in new tab when navigating via <kbd>j</kbd> and <kbd>k</kbd>: <kbd>shift</kbd> <kbd>o</kbd>.</p>\n"
    }, {
      id: "set-default-repositories-type-to-sources",
      description: "<p>Hides forks and archived repos from profiles (but they can still be shown).</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/45133648-fe21be80-b1c8-11e8-9052-e38cb443efa9.png"
    }, {
      id: "shorten-links",
      description: "<p>Shortens URLs and repo URLs to readable references like &quot;_user/repo/.file@<code>d71718d</code>&quot;.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/27252232-8fdf8ed0-538b-11e7-8f19-12d317c9cd32.png"
    }, {
      id: "show-associated-branch-prs-on-fork",
      description: "<p>Shows the associated pull requests on branches for forked repositories.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/81504659-7e5ec800-92b8-11ea-9ee6-924110e8cca1.png"
    }, {
      id: "show-names",
      description: "<p>Adds the real name of users by their usernames.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/62075835-5f82ce00-b270-11e9-91eb-4680b70cb3cb.png"
    }, {
      id: "show-open-prs-of-forks",
      description: "<p>In your forked repos, shows number of your open PRs to the original repo.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1922624/76398271-e0648500-637c-11ea-8210-53dda1be9d51.png"
    }, {
      id: "show-user-top-repositories",
      description: "<p>Adds a link to the user’s most starred repositories.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/48474026-43e3ae80-e82c-11e8-93de-159ad4c6f283.png"
    }, {
      id: "show-whitespace",
      description: "<p>Makes whitespace characters visible.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/61187598-f9118380-a6a5-11e9-985a-990a7f798805.png"
    }, {
      id: "sort-conversations-by-update-time",
      description: "<p>Changes the default sort order of conversations to <code>Recently updated</code>.</p>\n"
    }, {
      id: "sticky-conversation-list-toolbar",
      description: "<p>Makes the conversation list’s filters toolbar sticky.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/380914/39878141-7632e61a-542c-11e8-9c66-74fcd3a134aa.gif"
    }, {
      id: "sticky-sidebar",
      description: "<p>Makes conversation sidebars and repository sidebars sticky, if they fit the viewport.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/10238474/62276723-5a2eaa80-b44d-11e9-810b-ff598d1c5c6a.gif"
    }, {
      id: "stop-pjax-loading-with-esc",
      description: "<p>After you click on an ajaxed link, this lets you stop loading a page by pressing the <kbd>esc</kbd> key, like the browser does for regular page loads.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/36174850/90323385-3c08ef00-df69-11ea-8c0e-c85241888a7b.gif"
    }, {
      id: "stop-redirecting-in-notification-bar",
      description: "<p>Stops redirecting to notification inbox from notification bar actions while holding <kbd>Alt</kbd>.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/202916/80318782-c38cef80-880c-11ea-9226-72c585f42a51.png"
    }, {
      id: "submission-via-ctrl-enter-everywhere",
      description: "<p>Enables submission via <kbd>ctrl</kbd> <kbd>enter</kbd> on every page possible.</p>\n"
    }, {
      id: "suggest-commit-title-limit",
      description: "<p>Suggests limiting commit titles to 72 characters.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/37769974/60379478-106b3280-9a51-11e9-88b9-0e3607f214cd.gif"
    }, {
      id: "swap-branches-on-compare",
      description: "<p>Adds a link to swap branches in the branch compare view.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/857700/42854438-821096f2-8a01-11e8-8752-76f7563b5e18.png"
    }, {
      id: "sync-pr-commit-title",
      description: "<p>Uses the PR’s title as the default squash commit title and updates the PR’s title to match the commit title, if changed.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/51669708-9a712400-1ff7-11e9-913a-ac1ea1050975.png"
    }, {
      id: "tab-to-indent",
      description: "<p>Enables <kbd>tab</kbd> and <kbd>shift</kbd> <kbd>tab</kbd> for indentation in comment fields.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/33802977-beb8497c-ddbf-11e7-899c-698d89298de4.gif"
    }, {
      id: "table-input",
      description: "<p>Adds a button in the text editor to quickly insert a simplified HTML table.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/94559114-09892c00-0261-11eb-8fb0-c5a85ea76b6f.gif"
    }, {
      id: "tag-changes-link",
      description: "<p>Adds a link to changes since last tag/release for each tag/release.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/57081611-ad4a7180-6d27-11e9-9cb6-c54ec1ac18bb.png"
    }, {
      id: "tags-dropdown",
      description: "<p>Adds a tags dropdown/search on tag/release pages.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/22439276/56373231-27ee9980-621e-11e9-9b21-601919d3dddf.png"
    }, {
      id: "tags-on-commits-list",
      description: "<p>Displays the corresponding tags next to commits.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/14323370/66400400-64ba7280-e9af-11e9-8d6c-07b35afde91f.png"
    }, {
      id: "toggle-everything-with-alt",
      description: "<p>Adds a shortcut to toggle all similar items (minimized comments, deferred diffs, etc) at once: <kbd>alt</kbd> <kbd>click</kbd> on each button or checkbox.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/37769974/62208543-dcb75b80-b3b4-11e9-984f-ddb479ea149d.gif"
    }, {
      id: "toggle-files-button",
      description: "<p>Adds a button to toggle the repo file list.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/35480123-68b9af1a-043a-11e8-8934-3ead3cff8328.gif"
    }, {
      id: "unfinished-comments",
      description: "<p>Notifies the user of unfinished comments in hidden tabs.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/97792086-423d5d80-1b9f-11eb-9a3a-daf716d10b0e.gif"
    }, {
      id: "unhide-reactions-on-mobile",
      description: "<p>Unhides reactions button on mobile.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/38327267/205493629-14563105-eaa1-4885-9f07-8b3ee9214c86.png"
    }, {
      id: "unwrap-unnecessary-dropdowns",
      description: "<p>Makes some dropdowns 1-click instead of unnecessarily 2-click.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/80859624-9bfdb300-8c62-11ea-837f-7b7a28e6fdfc.png"
    }, {
      id: "update-pr-from-base-branch",
      description: "<p>Adds a button to update a PR from the base branch to ensure it builds correctly before merging the PR itself. GitHub only adds it when the base branch is &quot;protected&quot;.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/106494023-816d9a00-647f-11eb-8cb1-7c97aa8a5546.png"
    }, {
      id: "use-first-commit-message-for-new-prs",
      description: "<p>Uses the first commit for a new PR’s title and description.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/87246205-ccf42400-c419-11ea-86d5-0e6570d99e6e.gif"
    }, {
      id: "useful-forks",
      description: '<p>Helps you find the most active forks, via <a href="https://useful-forks.github.io">https://useful-forks.github.io</a>.</p>\n',
      screenshot: "https://user-images.githubusercontent.com/38117856/107463541-542e8500-6b2c-11eb-8b25-082f344c1587.png"
    }, {
      id: "useful-not-found-page",
      description: "<p>Adds possible related pages and alternatives on 404 pages.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/46402857-7bdada80-c733-11e8-91a1-856573078ff5.png"
    }, {
      id: "user-local-time",
      description: "<p>Shows the user local time in their hovercard (based on their last commit).</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/69863648-ef449180-12cf-11ea-8f36-7c92fc487f31.gif"
    }, {
      id: "user-profile-follower-badge",
      description: "<p>On profiles, it shows whether the user follows you.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/3723666/45190460-03ecc380-b20c-11e8-832b-839959ee2c99.gif"
    }, {
      id: "vertical-front-matter",
      description: "<p>Shows Markdown front matter as vertical table.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/44045911/87251695-26069b00-c4a0-11ea-9077-53ce366490ed.png"
    }, {
      id: "view-last-pr-deployment",
      description: "<p>Adds a link to open the last deployment from the header of a PR.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/16872793/111904355-ef185a00-8a1c-11eb-97dd-aa0272547e73.png"
    }, {
      id: "wait-for-attachments",
      description: "<p>Wait for the attachments to finish uploading before allowing to post a comment.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/46634000/104294547-9b8b0c80-54bf-11eb-93e5-65ae158353b3.gif"
    }, {
      id: "wait-for-checks",
      description: "<p>Adds the option to wait for checks when merging a PR.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/35192861-3f4a1bf6-fecc-11e7-8b9f-35ee019c6cdf.gif"
    }, {
      id: "warn-pr-from-master",
      description: "<p>Warns you when creating a pull request from the default branch, as it’s an anti-pattern.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/52543516-3ca94e00-2de5-11e9-9f80-ff8f9fe8bdc4.png"
    }, {
      id: "warning-for-disallow-edits",
      description: "<p>Warns you when unchecking <code>Allow edits from maintainers</code>, as it’s maintainer-hostile.</p>\n",
      screenshot: "https://user-images.githubusercontent.com/1402241/53151888-24101380-35ef-11e9-8d30-d6315ad97325.gif"
    } ], getMiddleStep = list => Math.floor(list.length / 2);
    async function onChoiceButtonClick({currentTarget: button}) {
      const answer = button.value, bisectedFeatures = await webext_storage_cache.get("bisect");
      if (bisectedFeatures.length > 1) return await webext_storage_cache.set("bisect", "yes" === answer ? bisectedFeatures.slice(0, getMiddleStep(bisectedFeatures)) : bisectedFeatures.slice(getMiddleStep(bisectedFeatures))), 
      button.parentElement.replaceWith(dom_chef.createElement("div", {
        className: "btn",
        "aria-disabled": "true"
      }, "Reloading…")), void location.reload();
      if ("yes" === answer) createMessageBox("No features were enabled on this page. Try disabling Refined GitHub to see if it belongs to it at all."); else {
        const feature = dom_chef.createElement("a", {
          href: featureLink(bisectedFeatures[0])
        }, dom_chef.createElement("code", null, bisectedFeatures[0]));
        createMessageBox(dom_chef.createElement(dom_chef.Fragment, null, "The change or issue is caused by ", feature, "."));
      }
      await webext_storage_cache.delete("bisect"), window.removeEventListener("visibilitychange", hideMessage);
    }
    async function onEndButtonClick() {
      await webext_storage_cache.delete("bisect"), location.reload();
    }
    function createMessageBox(message, extraButtons) {
      select_dom("#rgh-bisect-dialog")?.remove(), document.body.append(dom_chef.createElement("div", {
        id: "rgh-bisect-dialog",
        className: "Box p-3"
      }, dom_chef.createElement("p", null, message), dom_chef.createElement("div", {
        className: "d-flex flex-justify-between"
      }, dom_chef.createElement("button", {
        type: "button",
        className: "btn",
        onClick: onEndButtonClick
      }, "Exit"), extraButtons)));
    }
    async function hideMessage() {
      await webext_storage_cache.get("bisect") || createMessageBox("Process completed in another tab");
    }
    async function bisectFeatures() {
      const bisectedFeatures = await webext_storage_cache.get("bisect");
      if (!bisectedFeatures) return;
      console.log(`Bisecting ${bisectedFeatures.length} features:\n${bisectedFeatures.join("\n")}`);
      const steps = Math.ceil(Math.log2(Math.max(bisectedFeatures.length))) + 1;
      await elementReady("body"), createMessageBox(`Do you see the change or issue? (${pluralize(steps, "last step", "$$ steps remaining")})`, dom_chef.createElement("div", null, dom_chef.createElement("button", {
        type: "button",
        className: "btn btn-danger mr-2",
        value: "no",
        "aria-disabled": "true",
        onClick: onChoiceButtonClick
      }, "No"), dom_chef.createElement("button", {
        type: "button",
        className: "btn btn-primary",
        value: "yes",
        "aria-disabled": "true",
        onClick: onChoiceButtonClick
      }, "Yes"))), window.addEventListener("load", (() => {
        for (const button of select_dom.all("#rgh-bisect-dialog [aria-disabled]")) button.removeAttribute("aria-disabled");
      })), window.addEventListener("visibilitychange", hideMessage);
      const half = getMiddleStep(bisectedFeatures), temporaryOptions = {};
      for (const feature of importedFeatures) {
        const index = bisectedFeatures.indexOf(feature);
        temporaryOptions[`feature:${feature}`] = index > -1 && index < half;
      }
      return console.log(temporaryOptions), temporaryOptions;
    }
    const copyProperty = (to, from, property, ignoreNonConfigurable) => {
      if ("length" === property || "prototype" === property) return;
      if ("arguments" === property || "caller" === property) return;
      const toDescriptor = Object.getOwnPropertyDescriptor(to, property), fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
      !canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable || Object.defineProperty(to, property, fromDescriptor);
    }, canCopyProperty = function(toDescriptor, fromDescriptor) {
      return void 0 === toDescriptor || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
    }, wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`, toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
    function mimicFunction(to, from, {ignoreNonConfigurable = !1} = {}) {
      const {name} = to;
      for (const property of Reflect.ownKeys(from)) copyProperty(to, from, property, ignoreNonConfigurable);
      return ((to, from) => {
        const fromPrototype = Object.getPrototypeOf(from);
        fromPrototype !== Object.getPrototypeOf(to) && Object.setPrototypeOf(to, fromPrototype);
      })(to, from), ((to, from, name) => {
        const withName = "" === name ? "" : `with ${name.trim()}() `, newToString = wrappedToString.bind(null, withName, from.toString());
        Object.defineProperty(newToString, "name", toStringName), Object.defineProperty(to, "toString", {
          ...toStringDescriptor,
          value: newToString
        });
      })(to, from, name), to;
    }
    const calledFunctions = new WeakMap, onetime = (function_, options = {}) => {
      if ("function" != typeof function_) throw new TypeError("Expected a function");
      let returnValue, callCount = 0;
      const functionName = function_.displayName || function_.name || "<anonymous>", onetime = function(...arguments_) {
        if (calledFunctions.set(onetime, ++callCount), 1 === callCount) returnValue = function_.apply(this, arguments_), 
        function_ = null; else if (!0 === options.throw) throw new Error(`Function \`${functionName}\` can only be called once`);
        return returnValue;
      };
      return mimicFunction(onetime, function_), calledFunctions.set(onetime, callCount), 
      onetime;
    };
    onetime.callCount = function_ => {
      if (!calledFunctions.has(function_)) throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
      return calledFunctions.get(function_);
    };
    const node_modules_onetime = onetime, splitDev = v => String(v).split("-"), splitSub = v => String(v).replace(/^[vr]/, "").replace(/([a-z]+)/gi, ".$1.").replace(/\.+/g, ".").split("."), offset = part => isNaN(part) ? part : 5 + Number(part), parseSub = part => {
      if (void 0 === part) return 0;
      switch (part.toLowerCase()) {
       case "dev":
        return -5;

       case "alpha":
       case "a":
        return -4;

       case "beta":
       case "b":
        return -3;

       case "rc":
       case "c":
        return -2;

       case "pre":
        return -1;
      }
      return part;
    };
    function compareSubs(a, b) {
      for (let i = 0; i < a.length || i < b.length; i++) {
        const ai = offset(parseSub(a[i])), bi = offset(parseSub(b[i])), sort = String(ai).localeCompare(bi, "en", {
          numeric: !0
        });
        if (0 !== sort) return sort;
      }
      return 0;
    }
    function compareVersions(a, b) {
      if (a === b) return 0;
      const [aMain, aDev] = splitDev(a).map(splitSub), [bMain, bDev] = splitDev(b).map(splitSub), mainSort = compareSubs(aMain, bMain);
      return 0 !== mainSort ? mainSort : aDev && !bDev ? -1 : !aDev && bDev ? 1 : aDev && bDev ? compareSubs(aDev, bDev) : 0;
    }
    const github_helpers_getUsername = node_modules_onetime(utils.getUsername), {getRepositoryInfo: github_helpers_getRepo, getCleanPathname: github_helpers_getCleanPathname} = utils, getConversationNumber = () => {
      if (isPR() || isIssue()) return location.pathname.split("/")[4];
    };
    function getCurrentBranchFromFeed() {
      if ("commits" !== github_helpers_getRepo().path) return;
      const feedLink = select_dom('link[type="application/atom+xml"]');
      return new URL(feedLink.href).pathname.split("/").slice(4).join("/").replace(/\.atom$/, "");
    }
    const typesWithCommittish = new Set([ "tree", "blob", "blame", "edit", "commit", "commits", "compare" ]), titleWithCommittish = / at (?<branch>[.\w-/]+)( · [\w-]+\/[\w-]+)?$/i, getCurrentCommittish = (pathname = location.pathname, title = document.title) => {
      if (!pathname.startsWith("/")) throw new TypeError(`Expected pathname starting with /, got "${pathname}"`);
      const [type, unslashedCommittish] = pathname.split("/").slice(3);
      if (!type || !typesWithCommittish.has(type)) return;
      if ("commits" === type) {
        if (!unslashedCommittish) return getCurrentBranchFromFeed();
        const branchAndFilepath = pathname.split("/").slice(4).join("/");
        if (title.startsWith("Commits · ")) return branchAndFilepath;
        const filepath = /^History for ([^ ]+) - /.exec(title)[1];
        return branchAndFilepath.slice(0, branchAndFilepath.lastIndexOf("/" + filepath));
      }
      const parsedTitle = titleWithCommittish.exec(title);
      return parsedTitle ? parsedTitle.groups.branch : unslashedCommittish;
    }, isMac = navigator.userAgent.includes("Macintosh"), buildRepoURL = (...pathParts) => {
      for (const part of pathParts) if ("string" == typeof part && /^\/|\/$/.test(part)) throw new TypeError("The path parts shouldn’t start or end with a slash: " + part);
      return [ location.origin, github_helpers_getRepo()?.nameWithOwner, ...pathParts ].join("/");
    };
    function getForkedRepo() {
      return select_dom('meta[name="octolytics-dimension-repository_parent_nwo"]')?.content;
    }
    const parseTag = tag => {
      const [, namespace = "", version = ""] = /(?:(.*)@)?([^@]+)/.exec(tag) ?? [];
      return {
        namespace,
        version
      };
    };
    function compareNames(username, realname) {
      return username.replace(/-/g, "").toLowerCase() === realname.normalize("NFD").replace(/[\u0300-\u036F\W.]/g, "").toLowerCase();
    }
    const validVersion = /^[vr]?\d+(?:\.\d+)+/, isPrerelease = /^[vr]?\d+(?:\.\d+)+(-\d)/;
    function upperCaseFirst(input) {
      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    async function isPermalink() {
      return !!/^[\da-f]{40}$/.test(getCurrentCommittish()) || (await elementReady('[data-hotkey="w"]'), 
      /Tag|Tree/.test(select_dom('[data-hotkey="w"] i')?.textContent ?? "") || select_dom.exists('[data-hotkey="w"] .octicon-tag'));
    }
    function isRefinedGitHubRepo() {
      return location.pathname.startsWith("/refined-github/refined-github");
    }
    function dispatchTurboEvent(event) {
      document.removeEventListener("turbo:visit", disconnectPolyfill);
      const turboEvent = "pjax:start" === event.type ? "turbo:visit" : "turbo:render";
      document.dispatchEvent(new CustomEvent(turboEvent));
    }
    function disconnectPolyfill() {
      document.removeEventListener("pjax:start", dispatchTurboEvent), document.removeEventListener("pjax:end", dispatchTurboEvent);
    }
    var dist = __webpack_require__(494);
    const cacheStore = new WeakMap;
    function mem(fn, {cacheKey, cache = new Map, maxAge} = {}) {
      "number" == typeof maxAge && dist(cache);
      const memoized = function(...arguments_) {
        const key = cacheKey ? cacheKey(arguments_) : arguments_[0], cacheItem = cache.get(key);
        if (cacheItem) return cacheItem.data;
        const result = fn.apply(this, arguments_);
        return cache.set(key, {
          data: result,
          maxAge: maxAge ? Date.now() + maxAge : Number.POSITIVE_INFINITY
        }), result;
      };
      return mimicFunction(memoized, fn, {
        ignoreNonConfigurable: !0
      }), cacheStore.set(memoized, cache), memoized;
    }
    const patternValidationRegex = /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/, webext_patterns_isFirefox = "object" == typeof navigator && navigator.userAgent.includes("Firefox/"), allStarsRegex = webext_patterns_isFirefox ? /^(https?|wss?):[/][/][^/]+([/].*)?$/ : /^https?:[/][/][^/]+([/].*)?$/, allUrlsRegex = /^(https?|file|ftp):[/]+/;
    function webext_patterns_patternToRegex(...matchPatterns) {
      return 0 === matchPatterns.length ? /$./ : matchPatterns.includes("<all_urls>") ? allUrlsRegex : matchPatterns.includes("*://*/*") ? allStarsRegex : new RegExp(matchPatterns.map((x => function(matchPattern) {
        if (!patternValidationRegex.test(matchPattern)) throw new Error(matchPattern + " is an invalid pattern, it must match " + String(patternValidationRegex));
        let [, protocol, host, pathname] = matchPattern.split(/(^[^:]+:[/][/])([^/]+)?/);
        return protocol = protocol.replace("*", webext_patterns_isFirefox ? "(https?|wss?)" : "https?").replace(/[/]/g, "[/]"), 
        host = (null != host ? host : "").replace(/^[*][.]/, "([^/]+.)*").replace(/^[*]$/, "[^/]+").replace(/[.]/g, "[.]").replace(/[*]$/g, "[^.]+"), 
        pathname = pathname.replace(/[/]/g, "[/]").replace(/[.]/g, "[.]").replace(/[*]/g, ".*"), 
        "^" + protocol + host + "(" + pathname + ")?$";
      }(x))).join("|"));
    }
    function throttle(delay, noTrailing, callback, debounceMode) {
      var timeoutID, cancelled = !1, lastExec = 0;
      function clearExistingTimeout() {
        timeoutID && clearTimeout(timeoutID);
      }
      function wrapper() {
        for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) arguments_[_key] = arguments[_key];
        var self = this, elapsed = Date.now() - lastExec;
        function exec() {
          lastExec = Date.now(), callback.apply(self, arguments_);
        }
        function clear() {
          timeoutID = void 0;
        }
        cancelled || (debounceMode && !timeoutID && exec(), clearExistingTimeout(), void 0 === debounceMode && elapsed > delay ? exec() : !0 !== noTrailing && (timeoutID = setTimeout(debounceMode ? clear : exec, void 0 === debounceMode ? delay - elapsed : delay)));
      }
      return "boolean" != typeof noTrailing && (debounceMode = callback, callback = noTrailing, 
      noTrailing = void 0), wrapper.cancel = function() {
        clearExistingTimeout(), cancelled = !0;
      }, wrapper;
    }
    class TypeRegistry {
      constructor(initial = {}) {
        this.registeredTypes = initial;
      }
      get(type) {
        return void 0 !== this.registeredTypes[type] ? this.registeredTypes[type] : this.registeredTypes.default;
      }
      register(type, item) {
        void 0 === this.registeredTypes[type] && (this.registeredTypes[type] = item);
      }
      registerDefault(item) {
        this.register("default", item);
      }
    }
    class KeyExtractors extends TypeRegistry {
      constructor(options) {
        super(options), this.registerDefault((el => el.getAttribute("name") || ""));
      }
    }
    class InputReaders extends TypeRegistry {
      constructor(options) {
        super(options), this.registerDefault((el => el.value)), this.register("checkbox", (el => null !== el.getAttribute("value") ? el.checked ? el.getAttribute("value") : null : el.checked)), 
        this.register("select", (el => function(elem) {
          var value, option, i, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type, values = one ? null : [], max = one ? index + 1 : options.length;
          for (i = index < 0 ? max : one ? index : 0; i < max; i++) if (((option = options[i]).selected || i === index) && !option.disabled && (!option.parentNode.disabled || "optgroup" !== option.parentNode.tagName.toLowerCase())) {
            if (value = option.value, one) return value;
            values.push(value);
          }
          return values;
        }(el)));
      }
    }
    class KeyAssignmentValidators extends TypeRegistry {
      constructor(options) {
        super(options), this.registerDefault((() => !0)), this.register("radio", (el => el.checked));
      }
    }
    function keySplitter(key) {
      let lastKey, matches = key.match(/[^[\]]+/g);
      return key.length > 1 && key.indexOf("[]") === key.length - 2 && (lastKey = matches.pop(), 
      matches.push([ lastKey ])), matches;
    }
    function getElementType(el) {
      let typeAttr, tagName = el.tagName, type = tagName;
      return "input" === tagName.toLowerCase() && (typeAttr = el.getAttribute("type"), 
      type = typeAttr || "text"), type.toLowerCase();
    }
    function getInputElements(element, options) {
      return Array.prototype.filter.call(element.querySelectorAll("input,select,textarea"), (el => {
        if ("input" === el.tagName.toLowerCase() && ("submit" === el.type || "reset" === el.type)) return !1;
        let myType = getElementType(el), identifier = options.keyExtractors.get(myType)(el), foundInInclude = -1 !== (options.include || []).indexOf(identifier), foundInExclude = -1 !== (options.exclude || []).indexOf(identifier), foundInIgnored = !1, reject = !1;
        if (options.ignoredTypes) for (let selector of options.ignoredTypes) el.matches(selector) && (foundInIgnored = !0);
        return reject = !foundInInclude && (!!options.include || foundInExclude || foundInIgnored), 
        !reject;
      }));
    }
    function assignKeyValue(obj, keychain, value) {
      if (!keychain) return obj;
      var key = keychain.shift();
      return obj[key] || (obj[key] = Array.isArray(key) ? [] : {}), 0 === keychain.length && (Array.isArray(obj[key]) ? null !== value && obj[key].push(value) : obj[key] = value), 
      keychain.length > 0 && assignKeyValue(obj[key], keychain, value), obj;
    }
    function serialize(element, options = {}) {
      let data = {};
      return options.keySplitter = options.keySplitter || keySplitter, options.keyExtractors = new KeyExtractors(options.keyExtractors || {}), 
      options.inputReaders = new InputReaders(options.inputReaders || {}), options.keyAssignmentValidators = new KeyAssignmentValidators(options.keyAssignmentValidators || {}), 
      Array.prototype.forEach.call(getInputElements(element, options), (el => {
        let type = getElementType(el), key = options.keyExtractors.get(type)(el), value = options.inputReaders.get(type)(el);
        if (options.keyAssignmentValidators.get(type)(el, key, value)) {
          let keychain = options.keySplitter(key);
          data = assignKeyValue(data, keychain, value);
        }
      })), data;
    }
    class InputWriters extends TypeRegistry {
      constructor(options) {
        super(options), this.registerDefault(((el, value) => {
          el.value = value;
        })), this.register("checkbox", ((el, value) => {
          null === value ? el.indeterminate = !0 : el.checked = Array.isArray(value) ? -1 !== value.indexOf(el.value) : value;
        })), this.register("radio", (function(el, value) {
          void 0 !== value && (el.checked = el.value === value.toString());
        })), this.register("select", setSelectValue);
      }
    }
    function setSelectValue(elem, value) {
      for (var optionSet, option, arr, ret, options = elem.options, values = (ret = [], 
      null !== (arr = value) && (Array.isArray(arr) ? ret.push.apply(ret, arr) : ret.push(arr)), 
      ret), i = options.length; i--; ) option = options[i], values.indexOf(option.value) > -1 && (option.setAttribute("selected", !0), 
      optionSet = !0);
      optionSet || (elem.selectedIndex = -1);
    }
    function keyJoiner(parentKey, childKey) {
      return parentKey + "[" + childKey + "]";
    }
    function flattenData(data, parentKey, options = {}) {
      let flatData = {}, keyJoiner$1 = options.keyJoiner || keyJoiner;
      for (let keyName in data) {
        if (!data.hasOwnProperty(keyName)) continue;
        let value = data[keyName], hash = {};
        parentKey && (keyName = keyJoiner$1(parentKey, keyName)), Array.isArray(value) ? (hash[keyName + "[]"] = value, 
        hash[keyName] = value) : "object" == typeof value ? hash = flattenData(value, keyName, options) : hash[keyName] = value, 
        Object.assign(flatData, hash);
      }
      return flatData;
    }
    function deserialize(form, data, options = {}) {
      let flattenedData = flattenData(data, null, options);
      options.keyExtractors = new KeyExtractors(options.keyExtractors || {}), options.inputWriters = new InputWriters(options.inputWriters || {}), 
      Array.prototype.forEach.call(getInputElements(form, options), (el => {
        let type = getElementType(el), key = options.keyExtractors.get(type)(el);
        options.inputWriters.get(type)(el, flattenedData[key]);
      }));
    }
    var webext_options_sync_module, LZString, lzString = {
      exports: {}
    };
    webext_options_sync_module = lzString, LZString = function() {
      var f = String.fromCharCode, keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", baseReverseDic = {};
      function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
          baseReverseDic[alphabet] = {};
          for (var i = 0; i < alphabet.length; i++) baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
        return baseReverseDic[alphabet][character];
      }
      var LZString = {
        compressToBase64: function(input) {
          if (null == input) return "";
          var res = LZString._compress(input, 6, (function(a) {
            return keyStrBase64.charAt(a);
          }));
          switch (res.length % 4) {
           default:
           case 0:
            return res;

           case 1:
            return res + "===";

           case 2:
            return res + "==";

           case 3:
            return res + "=";
          }
        },
        decompressFromBase64: function(input) {
          return null == input ? "" : "" == input ? null : LZString._decompress(input.length, 32, (function(index) {
            return getBaseValue(keyStrBase64, input.charAt(index));
          }));
        },
        compressToUTF16: function(input) {
          return null == input ? "" : LZString._compress(input, 15, (function(a) {
            return f(a + 32);
          })) + " ";
        },
        decompressFromUTF16: function(compressed) {
          return null == compressed ? "" : "" == compressed ? null : LZString._decompress(compressed.length, 16384, (function(index) {
            return compressed.charCodeAt(index) - 32;
          }));
        },
        compressToUint8Array: function(uncompressed) {
          for (var compressed = LZString.compress(uncompressed), buf = new Uint8Array(2 * compressed.length), i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
            var current_value = compressed.charCodeAt(i);
            buf[2 * i] = current_value >>> 8, buf[2 * i + 1] = current_value % 256;
          }
          return buf;
        },
        decompressFromUint8Array: function(compressed) {
          if (null == compressed) return LZString.decompress(compressed);
          for (var buf = new Array(compressed.length / 2), i = 0, TotalLen = buf.length; i < TotalLen; i++) buf[i] = 256 * compressed[2 * i] + compressed[2 * i + 1];
          var result = [];
          return buf.forEach((function(c) {
            result.push(f(c));
          })), LZString.decompress(result.join(""));
        },
        compressToEncodedURIComponent: function(input) {
          return null == input ? "" : LZString._compress(input, 6, (function(a) {
            return keyStrUriSafe.charAt(a);
          }));
        },
        decompressFromEncodedURIComponent: function(input) {
          return null == input ? "" : "" == input ? null : (input = input.replace(/ /g, "+"), 
          LZString._decompress(input.length, 32, (function(index) {
            return getBaseValue(keyStrUriSafe, input.charAt(index));
          })));
        },
        compress: function(uncompressed) {
          return LZString._compress(uncompressed, 16, (function(a) {
            return f(a);
          }));
        },
        _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
          if (null == uncompressed) return "";
          var i, value, ii, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0;
          for (ii = 0; ii < uncompressed.length; ii += 1) if (context_c = uncompressed.charAt(ii), 
          Object.prototype.hasOwnProperty.call(context_dictionary, context_c) || (context_dictionary[context_c] = context_dictSize++, 
          context_dictionaryToCreate[context_c] = !0), context_wc = context_w + context_c, 
          Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) context_w = context_wc; else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) context_data_val <<= 1, context_data_position == bitsPerChar - 1 ? (context_data_position = 0, 
                context_data.push(getCharFromInt(context_data_val)), context_data_val = 0) : context_data_position++;
                for (value = context_w.charCodeAt(0), i = 0; i < 8; i++) context_data_val = context_data_val << 1 | 1 & value, 
                context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
                context_data_val = 0) : context_data_position++, value >>= 1;
              } else {
                for (value = 1, i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | value, 
                context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
                context_data_val = 0) : context_data_position++, value = 0;
                for (value = context_w.charCodeAt(0), i = 0; i < 16; i++) context_data_val = context_data_val << 1 | 1 & value, 
                context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
                context_data_val = 0) : context_data_position++, value >>= 1;
              }
              0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++), 
              delete context_dictionaryToCreate[context_w];
            } else for (value = context_dictionary[context_w], i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | 1 & value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value >>= 1;
            0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++), 
            context_dictionary[context_wc] = context_dictSize++, context_w = String(context_c);
          }
          if ("" !== context_w) {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) context_data_val <<= 1, context_data_position == bitsPerChar - 1 ? (context_data_position = 0, 
                context_data.push(getCharFromInt(context_data_val)), context_data_val = 0) : context_data_position++;
                for (value = context_w.charCodeAt(0), i = 0; i < 8; i++) context_data_val = context_data_val << 1 | 1 & value, 
                context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
                context_data_val = 0) : context_data_position++, value >>= 1;
              } else {
                for (value = 1, i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | value, 
                context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
                context_data_val = 0) : context_data_position++, value = 0;
                for (value = context_w.charCodeAt(0), i = 0; i < 16; i++) context_data_val = context_data_val << 1 | 1 & value, 
                context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
                context_data_val = 0) : context_data_position++, value >>= 1;
              }
              0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++), 
              delete context_dictionaryToCreate[context_w];
            } else for (value = context_dictionary[context_w], i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | 1 & value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value >>= 1;
            0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++);
          }
          for (value = 2, i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | 1 & value, 
          context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
          context_data_val = 0) : context_data_position++, value >>= 1;
          for (;;) {
            if (context_data_val <<= 1, context_data_position == bitsPerChar - 1) {
              context_data.push(getCharFromInt(context_data_val));
              break;
            }
            context_data_position++;
          }
          return context_data.join("");
        },
        decompress: function(compressed) {
          return null == compressed ? "" : "" == compressed ? null : LZString._decompress(compressed.length, 32768, (function(index) {
            return compressed.charCodeAt(index);
          }));
        },
        _decompress: function(length, resetValue, getNextValue) {
          var i, w, bits, resb, maxpower, power, c, dictionary = [], enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], data = {
            val: getNextValue(0),
            position: resetValue,
            index: 1
          };
          for (i = 0; i < 3; i += 1) dictionary[i] = i;
          for (bits = 0, maxpower = Math.pow(2, 2), power = 1; power != maxpower; ) resb = data.val & data.position, 
          data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
          bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
          switch (bits) {
           case 0:
            for (bits = 0, maxpower = Math.pow(2, 8), power = 1; power != maxpower; ) resb = data.val & data.position, 
            data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
            bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
            c = f(bits);
            break;

           case 1:
            for (bits = 0, maxpower = Math.pow(2, 16), power = 1; power != maxpower; ) resb = data.val & data.position, 
            data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
            bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
            c = f(bits);
            break;

           case 2:
            return "";
          }
          for (dictionary[3] = c, w = c, result.push(c); ;) {
            if (data.index > length) return "";
            for (bits = 0, maxpower = Math.pow(2, numBits), power = 1; power != maxpower; ) resb = data.val & data.position, 
            data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
            bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
            switch (c = bits) {
             case 0:
              for (bits = 0, maxpower = Math.pow(2, 8), power = 1; power != maxpower; ) resb = data.val & data.position, 
              data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
              bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
              dictionary[dictSize++] = f(bits), c = dictSize - 1, enlargeIn--;
              break;

             case 1:
              for (bits = 0, maxpower = Math.pow(2, 16), power = 1; power != maxpower; ) resb = data.val & data.position, 
              data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
              bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
              dictionary[dictSize++] = f(bits), c = dictSize - 1, enlargeIn--;
              break;

             case 2:
              return result.join("");
            }
            if (0 == enlargeIn && (enlargeIn = Math.pow(2, numBits), numBits++), dictionary[c]) entry = dictionary[c]; else {
              if (c !== dictSize) return null;
              entry = w + w.charAt(0);
            }
            result.push(entry), dictionary[dictSize++] = w + entry.charAt(0), w = entry, 0 == --enlargeIn && (enlargeIn = Math.pow(2, numBits), 
            numBits++);
          }
        }
      };
      return LZString;
    }(), null != webext_options_sync_module && (webext_options_sync_module.exports = LZString);
    class OptionsSync {
      constructor({defaults = {}, storageName = "options", migrations = [], logging = !0, storageType = "sync"} = {}) {
        Object.defineProperty(this, "storageName", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(this, "storageType", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(this, "defaults", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(this, "_form", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(this, "_migrations", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), this.storageName = storageName, this.defaults = defaults, this.storageType = storageType, 
        this._handleFormInput = (300, throttle(300, this._handleFormInput.bind(this), !1)), 
        this._handleStorageChangeOnForm = this._handleStorageChangeOnForm.bind(this), logging || (this._log = () => {}), 
        this._migrations = this._runMigrations(migrations);
      }
      get storage() {
        return chrome.storage[this.storageType];
      }
      async getAll() {
        return await this._migrations, this._getAll();
      }
      async setAll(newOptions) {
        return await this._migrations, this._setAll(newOptions);
      }
      async set(newOptions) {
        return this.setAll({
          ...await this.getAll(),
          ...newOptions
        });
      }
      async syncForm(form) {
        this._form = form instanceof HTMLFormElement ? form : document.querySelector(form), 
        this._form.addEventListener("input", this._handleFormInput), this._form.addEventListener("submit", this._handleFormSubmit), 
        chrome.storage.onChanged.addListener(this._handleStorageChangeOnForm), this._updateForm(this._form, await this.getAll());
      }
      async stopSyncForm() {
        this._form && (this._form.removeEventListener("input", this._handleFormInput), this._form.removeEventListener("submit", this._handleFormSubmit), 
        chrome.storage.onChanged.removeListener(this._handleStorageChangeOnForm), delete this._form);
      }
      _log(method, ...args) {
        console[method](...args);
      }
      async _getAll() {
        return new Promise(((resolve, reject) => {
          this.storage.get(this.storageName, (result => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(this._decode(result[this.storageName]));
          }));
        }));
      }
      async _setAll(newOptions) {
        return this._log("log", "Saving options", newOptions), new Promise(((resolve, reject) => {
          this.storage.set({
            [this.storageName]: this._encode(newOptions)
          }, (() => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
          }));
        }));
      }
      _encode(options) {
        const thinnedOptions = {
          ...options
        };
        for (const [key, value] of Object.entries(thinnedOptions)) this.defaults[key] === value && delete thinnedOptions[key];
        return this._log("log", "Without the default values", thinnedOptions), lzString.exports.compressToEncodedURIComponent(JSON.stringify(thinnedOptions));
      }
      _decode(options) {
        let decompressed = options;
        return "string" == typeof options && (decompressed = JSON.parse(lzString.exports.decompressFromEncodedURIComponent(options))), 
        {
          ...this.defaults,
          ...decompressed
        };
      }
      async _runMigrations(migrations) {
        if (0 === migrations.length || !isBackground() || !await async function() {
          return new Promise((resolve => {
            const callback = installType => {
              "development" !== installType ? (chrome.runtime.onInstalled.addListener((() => {
                resolve(!0);
              })), setTimeout(resolve, 500, !1)) : resolve(!0);
            };
            chrome.management?.getSelf ? chrome.management.getSelf((({installType}) => {
              callback(installType);
            })) : callback("unknown");
          }));
        }()) return;
        const options = await this._getAll(), initial = JSON.stringify(options);
        this._log("log", "Found these stored options", {
          ...options
        }), this._log("info", "Will run", migrations.length, 1 === migrations.length ? "migration" : " migrations");
        for (const migrate of migrations) migrate(options, this.defaults);
        initial !== JSON.stringify(options) && await this._setAll(options);
      }
      async _handleFormInput({target}) {
        const field = target;
        field.name && (await this.set(this._parseForm(field.form)), field.form.dispatchEvent(new CustomEvent("options-sync:form-synced", {
          bubbles: !0
        })));
      }
      _handleFormSubmit(event) {
        event.preventDefault();
      }
      _updateForm(form, options) {
        const currentFormState = this._parseForm(form);
        for (const [key, value] of Object.entries(options)) currentFormState[key] === value && delete options[key];
        const include = Object.keys(options);
        include.length > 0 && deserialize(form, options, {
          include
        });
      }
      _parseForm(form) {
        const include = [];
        for (const field of form.querySelectorAll("[name]")) field.validity.valid && !field.disabled && include.push(field.name.replace(/\[.*]/, ""));
        return serialize(form, {
          include
        });
      }
      _handleStorageChangeOnForm(changes, areaName) {
        areaName !== this.storageType || !changes[this.storageName] || document.hasFocus() && this._form.contains(document.activeElement) || this._updateForm(this._form, this._decode(changes[this.storageName].newValue));
      }
    }
    function getManifestPermissionsSync() {
      return _getManifestPermissionsSync(chrome.runtime.getManifest());
    }
    function _getManifestPermissionsSync(manifest) {
      var _a, _b, _c;
      const manifestPermissions = {
        origins: [],
        permissions: []
      }, list = new Set([ ...null !== (_a = manifest.permissions) && void 0 !== _a ? _a : [], ...(null !== (_b = manifest.content_scripts) && void 0 !== _b ? _b : []).flatMap((config => {
        var _a;
        return null !== (_a = config.matches) && void 0 !== _a ? _a : [];
      })) ]);
      manifest.devtools_page && !(null === (_c = manifest.optional_permissions) || void 0 === _c ? void 0 : _c.includes("devtools")) && list.add("devtools");
      for (const permission of list) permission.includes("://") ? manifestPermissions.origins.push(permission) : manifestPermissions.permissions.push(permission);
      return manifestPermissions;
    }
    Object.defineProperty(OptionsSync, "migrations", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {
        removeUnused(options, defaults) {
          for (const key of Object.keys(options)) key in defaults || delete options[key];
        }
      }
    });
    const hostRegex = /:[/][/][*.]*([^/]+)/;
    function parseDomain(origin) {
      return origin.split(hostRegex)[1];
    }
    function _getAdditionalPermissions(manifestPermissions, currentPermissions, {strictOrigins = !0} = {}) {
      var _a, _b;
      const additionalPermissions = {
        origins: [],
        permissions: []
      };
      for (const origin of null !== (_a = currentPermissions.origins) && void 0 !== _a ? _a : []) if (!manifestPermissions.origins.includes(origin)) {
        if (!strictOrigins) {
          const domain = parseDomain(origin);
          if (manifestPermissions.origins.some((manifestOrigin => parseDomain(manifestOrigin) === domain))) continue;
        }
        additionalPermissions.origins.push(origin);
      }
      for (const permission of null !== (_b = currentPermissions.permissions) && void 0 !== _b ? _b : []) manifestPermissions.permissions.includes(permission) || additionalPermissions.permissions.push(permission);
      return additionalPermissions;
    }
    var _OptionsSyncPerDomain_defaultOptions, __decorate = function(decorators, target, key, desc) {
      var d, c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }, __classPrivateFieldSet = function(receiver, state, value, kind, f) {
      if ("m" === kind) throw new TypeError("Private method is not writable");
      if ("a" === kind && !f) throw new TypeError("Private accessor was defined without a setter");
      if ("function" == typeof state ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return "a" === kind ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), 
      value;
    }, __classPrivateFieldGet = function(receiver, state, kind, f) {
      if ("a" === kind && !f) throw new TypeError("Private accessor was defined without a getter");
      if ("function" == typeof state ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return "m" === kind ? f : "a" === kind ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    const defaultOrigins = mem((() => webext_patterns_patternToRegex(...getManifestPermissionsSync().origins)));
    function memoizeMethod(target, propertyKey, descriptor) {
      descriptor.value = mem(target[propertyKey]);
    }
    function parseHost(origin) {
      return origin.includes("//") ? origin.split("/")[2].replace("*.", "") : origin;
    }
    class OptionsSyncPerDomain {
      constructor(options) {
        _OptionsSyncPerDomain_defaultOptions.set(this, void 0), __classPrivateFieldSet(this, _OptionsSyncPerDomain_defaultOptions, {
          ...options,
          storageName: options.storageName ?? "options"
        }, "f"), isBackgroundPage() && (options.migrations?.length > 0 && this.getAllOrigins(), 
        chrome.permissions.onRemoved.addListener((({origins}) => {
          const storageKeysToRemove = (origins ?? []).filter((key => !defaultOrigins().test(key))).map((key => this.getStorageNameForOrigin(key)));
          chrome.storage.sync.remove(storageKeysToRemove);
        })));
      }
      getOptionsForOrigin(origin = location.origin) {
        return !origin.startsWith("http") || defaultOrigins().test(origin) ? new OptionsSync(__classPrivateFieldGet(this, _OptionsSyncPerDomain_defaultOptions, "f")) : new OptionsSync({
          ...__classPrivateFieldGet(this, _OptionsSyncPerDomain_defaultOptions, "f"),
          storageName: this.getStorageNameForOrigin(origin)
        });
      }
      async getAllOrigins() {
        if (isContentScript()) throw new Error("This function only works on extension pages");
        const instances = new Map;
        instances.set("default", this.getOptionsForOrigin());
        const {origins} = await async function(options) {
          return new Promise((resolve => {
            chrome.permissions.getAll((currentPermissions => {
              const manifestPermissions = getManifestPermissionsSync();
              resolve(_getAdditionalPermissions(manifestPermissions, currentPermissions, options));
            }));
          }));
        }({
          strictOrigins: !1
        });
        for (const origin of origins) instances.set(parseHost(origin), this.getOptionsForOrigin(origin));
        return instances;
      }
      async syncForm(form) {
        if (isContentScript()) throw new Error("This function only works on extension pages");
        "string" == typeof form && (form = document.querySelector(form)), await this.getOptionsForOrigin().syncForm(form);
        const optionsByOrigin = await this.getAllOrigins();
        if (1 === optionsByOrigin.size) return;
        const dropdown = document.createElement("select");
        dropdown.addEventListener("change", this._domainChangeHandler.bind(this));
        for (const domain of optionsByOrigin.keys()) {
          const option = document.createElement("option");
          option.value = domain, option.textContent = domain, dropdown.append(option);
        }
        const wrapper = document.createElement("p");
        wrapper.append("Domain selector: ", dropdown), wrapper.classList.add("OptionsSyncPerDomain-picker"), 
        form.prepend(wrapper, document.createElement("hr"));
      }
      getStorageNameForOrigin(origin) {
        return __classPrivateFieldGet(this, _OptionsSyncPerDomain_defaultOptions, "f").storageName + "-" + parseHost(origin);
      }
      async _domainChangeHandler(event) {
        const dropdown = event.currentTarget;
        for (const [domain, options] of await this.getAllOrigins()) dropdown.value === domain ? options.syncForm(dropdown.form) : options.stopSyncForm();
      }
    }
    _OptionsSyncPerDomain_defaultOptions = new WeakMap, Object.defineProperty(OptionsSyncPerDomain, "migrations", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: OptionsSync.migrations
    }), __decorate([ memoizeMethod ], OptionsSyncPerDomain.prototype, "getOptionsForOrigin", null), 
    __decorate([ memoizeMethod ], OptionsSyncPerDomain.prototype, "getAllOrigins", null);
    const defaults = Object.assign({
      actionUrl: "",
      customCSS: "",
      personalToken: "",
      logging: !1,
      logHTTP: !1
    }, Object.fromEntries(importedFeatures.map((id => [ `feature:${id}`, !0 ])))), renamedFeatures = new Map([ [ "separate-draft-pr-button", "one-click-pr-or-gist" ], [ "prevent-pr-commit-link-loss", "prevent-link-loss" ], [ "remove-projects-tab", "remove-unused-repo-tabs" ], [ "remove-unused-repo-tabs", "clean-repo-tabs" ], [ "more-dropdown", "clean-repo-tabs" ], [ "remove-diff-signs", "hide-diff-signs" ], [ "remove-label-faster", "quick-label-hiding" ], [ "edit-files-faster", "quick-file-edit" ], [ "edit-comments-faster", "quick-comment-edit" ], [ "delete-review-comments-faster", "quick-review-comment-deletion" ], [ "hide-comments-faster", "quick-comment-hiding" ], [ "faster-reviews", "quick-review" ], [ "faster-pr-diff-options", "quick-pr-diff-options" ], [ "hide-useless-comments", "hide-low-quality-comments" ], [ "hide-useless-newsfeed-events", "hide-newsfeed-noise" ], [ "hide-noisy-newsfeed-events", "hide-newsfeed-noise" ], [ "no-useless-split-diff-view", "no-unnecessary-split-diff-view" ], [ "unwrap-useless-dropdowns", "unwrap-unnecessary-dropdowns" ], [ "tag-changelog-link", "tag-changes-link" ], [ "navigate-pages-with-arrow-keys", "pagination-hotkey" ], [ "list-pr-for-branch", "list-prs-for-branch" ], [ "quick-label-hiding", "quick-label-removal" ], [ "next-scheduled-github-action", "scheduled-and-manual-workflow-indicators" ], [ "raw-file-link", "more-file-links" ], [ "conversation-filters", "more-conversation-filters" ], [ "quick-pr-diff-options", "one-click-diff-options" ], [ "quick-review-buttons", "one-click-review-submission" ], [ "wait-for-build", "wait-for-checks" ], [ "pull-request-hotkey", "pull-request-hotkeys" ], [ "first-published-tag-for-merged-pr", "closing-remarks" ] ]);
    function getNewFeatureName(possibleFeatureName) {
      let newFeatureName = possibleFeatureName;
      for (;renamedFeatures.has(newFeatureName); ) newFeatureName = renamedFeatures.get(newFeatureName);
      return importedFeatures.includes(newFeatureName) ? newFeatureName : void 0;
    }
    const options_storage = new OptionsSyncPerDomain({
      defaults,
      migrations: [ function(options) {
        for (const [from, to] of renamedFeatures) "boolean" == typeof options[`feature:${from}`] && (options[`feature:${to}`] = options[`feature:${from}`]);
      }, OptionsSyncPerDomain.migrations.removeUnused ]
    }).getOptionsForOrigin();
    var any = function(raw) {
      return String.raw.apply(String, [ {
        raw
      } ].concat([].slice.call(arguments, 1)));
    }, browser = __webpack_require__(412);
    const {version} = browser.runtime.getManifest();
    function isDevelopmentVersion() {
      return "0.0.0" === version;
    }
    async function fetchHotfix(path) {
      const request = await fetch(`https://api.github.com/repos/refined-github/yolo/contents/${path}`), {content} = await request.json();
      return content ? atob(content).trim() : "";
    }
    const updateHotfixes = webext_storage_cache.function((async version => {
      const content = await fetchHotfix("broken-features.csv");
      if (!content) return [];
      const storage = [];
      for (const [featureID, relatedIssue, unaffectedVersion] of function(content) {
        const lines = [], [_header, ...rawLines] = content.trim().split("\n");
        for (const line of rawLines) line.trim() && lines.push(line.split(",").map((cell => cell.trim())));
        return lines;
      }(content)) featureID && relatedIssue && (!unaffectedVersion || compareVersions(unaffectedVersion, version) > 0) && storage.push([ featureID, relatedIssue ]);
      return storage;
    }), {
      maxAge: {
        hours: 6
      },
      staleWhileRevalidate: {
        days: 30
      },
      cacheKey: () => "hotfixes"
    }), getStyleHotfix = webext_storage_cache.function((async version => fetchHotfix(`style/${version}.css`)), {
      maxAge: {
        hours: 6
      },
      staleWhileRevalidate: {
        days: 300
      },
      cacheKey: () => "style-hotfixes"
    });
    async function getLocalHotfixesAsOptions() {
      const options = {};
      for (const [feature] of await async function() {
        return isDevelopmentVersion() ? [] : await webext_storage_cache.get("hotfixes") ?? [];
      }()) options[`feature:${feature}`] = !1;
      return options;
    }
    let localStrings = {};
    function _(...arguments_) {
      const original = any(...arguments_);
      return localStrings[original] ?? original;
    }
    async function getLocalStrings() {
      isDevelopmentVersion() || isEnterprise() || (localStrings = await webext_storage_cache.get("strings-hotfixes") ?? {});
    }
    const updateLocalStrings = webext_storage_cache.function((async () => {
      const json = await fetchHotfix("strings.json");
      return json ? JSON.parse(json) : {};
    }), {
      maxAge: {
        hours: 6
      },
      staleWhileRevalidate: {
        days: 30
      },
      cacheKey: () => "strings-hotfixes"
    });
    var feature_manager_browser = __webpack_require__(412);
    const {version: feature_manager_version} = feature_manager_browser.runtime.getManifest(), currentFeatureControllers = new ArrayMap, log = {
      info: console.log,
      http: console.log,
      error: (url, error) => {
        const id = getFeatureID(url), message = error instanceof Error ? error.message : String(error);
        if (message.includes("token")) return void console.log("ℹ️", id, "→", message);
        const searchIssueUrl = new URL("https://github.com/refined-github/refined-github/issues");
        searchIssueUrl.searchParams.set("q", `is:issue is:open sort:updated-desc ${message}`);
        const newIssueUrl = new URL("https://github.com/refined-github/refined-github/issues/new");
        newIssueUrl.searchParams.set("labels", "bug"), newIssueUrl.searchParams.set("template", "1_bug_report.yml"), 
        newIssueUrl.searchParams.set("title", `\`${id}\`: ${message}`), newIssueUrl.searchParams.set("example_urls", location.href), 
        newIssueUrl.searchParams.set("description", [ "```", String(error instanceof Error ? error.stack : error).trim(), "```" ].join("\n")), 
        console.group(`❌ ${id}`), console.log(`📕 ${feature_manager_version} ${isEnterprise() ? "GHE →" : "→"}`, error), 
        console.log("🔍 Search issue", searchIssueUrl.href), console.log("🚨 Report issue", newIssueUrl.href), 
        console.groupEnd();
      }
    }, globalReady = new Promise((async resolve => {
      const [options, localHotfixes, styleHotfix, bisectedFeatures] = await Promise.all([ options_storage.getAll(), getLocalHotfixesAsOptions(), getStyleHotfix(feature_manager_version), bisectFeatures(), getLocalStrings() ]);
      await async function(condition) {
        for (;!condition(); ) await delay_default()(10);
      }((() => document.body)), "Server Error · GitHub" !== document.title && "Unicorn! · GitHub" !== document.title && "504 Gateway Time-out" !== document.title && "Confirm password" !== document.title && "Confirm access" !== document.title && (select_dom.exists("html.refined-github") ? console.warn(function(string) {
        const indent = min_indent(string);
        if (0 === indent) return string;
        const regex = new RegExp(`^[ \\t]{${indent}}`, "gm");
        return string.replace(regex, "");
      }("\n\t\t\tRefined GitHub has been loaded twice. This may be because:\n\n\t\t\t• You loaded the developer version, or\n\t\t\t• The extension just updated\n\n\t\t\tIf you see this at every load, please open an issue mentioning the browser you're using and the URL where this appears.\n\t\t")) : (document.documentElement.classList.add("refined-github"), 
      async function(style) {
        isDevelopmentVersion() || isEnterprise() || !style || document.body.prepend(dom_chef.createElement("style", null, style));
      }(styleHotfix), options.customCSS.trim().length > 0 && document.head.append(dom_chef.createElement("style", null, options.customCSS)), 
      updateLocalStrings(), bisectedFeatures ? Object.assign(options, bisectedFeatures) : (updateHotfixes(feature_manager_version), 
      Object.assign(options, localHotfixes)), log.info = options.logging ? console.log : () => {}, 
      log.http = options.logHTTP ? console.log : () => {}, select_dom.exists("body.logged-out") && (console.warn("Refined GitHub is only expected to work when you’re logged in to GitHub. Errors will not be shown."), 
      features.log.error = () => {}), document.addEventListener("pjax:start", dispatchTurboEvent), 
      document.addEventListener("pjax:end", dispatchTurboEvent), document.addEventListener("turbo:visit", disconnectPolyfill, {
        once: !0
      }), resolve(options)));
    }));
    function castArray(value) {
      return Array.isArray(value) ? value : [ value ];
    }
    const setupPageLoad = async (id, config) => {
      const {asLongAs, include, exclude, init, additionalListeners, onlyAdditionalListeners} = config;
      if (!function({asLongAs = [ () => !0 ], include = [ () => !0 ], exclude = [ () => !1 ]}) {
        return asLongAs.every((c => c())) && include.some((c => c())) && exclude.every((c => !c()));
      }({
        asLongAs,
        include,
        exclude
      })) return;
      const featureController = new AbortController;
      currentFeatureControllers.append(id, featureController);
      const runFeature = async () => {
        let result;
        try {
          result = await init(featureController.signal), !1 === result || id?.startsWith("rgh") || log.info("✅", id);
        } catch (error) {
          log.error(id, error);
        }
        result && onAbort(featureController, ...castArray(result));
      };
      onlyAdditionalListeners || await runFeature(), await dom_loaded;
      for (const listener of additionalListeners) {
        const deinit = listener(runFeature, featureController.signal);
        !deinit || deinit instanceof Promise || onAbort(featureController, ...castArray(deinit));
      }
    }, shortcutMap = new Map, getFeatureID = url => url.split("/").pop().split(".")[0], add = async (url, ...loaders) => {
      const id = getFeatureID(url);
      if ((await globalReady)[`feature:${id}`] || id.startsWith("rgh")) for (const loader of loaders) {
        const {shortcuts = {}, asLongAs, include, exclude, init, awaitDomReady = !0, deduplicate = !1, onlyAdditionalListeners = !1, additionalListeners = []} = loader;
        if (0 === include?.length) throw new Error(`${id}: \`include\` cannot be an empty array, it means "run nowhere"`);
        for (const [hotkey, description] of Object.entries(shortcuts)) shortcutMap.set(hotkey, description);
        if (is404() && !include?.includes(is404) && !asLongAs?.includes(is404)) continue;
        const details = {
          asLongAs,
          include,
          exclude,
          init,
          additionalListeners,
          onlyAdditionalListeners
        };
        awaitDomReady ? (async () => {
          await dom_loaded, await setupPageLoad(id, details);
        })() : setupPageLoad(id, details), document.addEventListener("turbo:render", (() => {
          deduplicate && select_dom.exists(deduplicate) || setupPageLoad(id, details);
        }));
      } else log.info("↩️", "Skipping", id);
    };
    document.addEventListener("turbo:visit", (() => {
      for (const feature of currentFeatureControllers.values()) for (const controller of feature) controller.abort();
      currentFeatureControllers.clear();
    })), add("rgh-deduplicator", {
      async init() {
        await Promise.resolve(), select_dom(_`#js-repo-pjax-container, #js-pjax-container`)?.append(dom_chef.createElement("has-rgh", null)), 
        select_dom(_`turbo-frame`)?.append(dom_chef.createElement("has-rgh-inner", null));
      }
    });
    const features = {
      add,
      unload: featureUrl => {
        const id = getFeatureID(featureUrl);
        for (const controller of currentFeatureControllers.get(id) ?? []) controller.abort();
      },
      addCssFeature: async (url, include) => {
        const id = getFeatureID(url);
        add(id, {
          include,
          awaitDomReady: !1,
          init() {
            document.documentElement.classList.add("rgh-" + id);
          }
        });
      },
      log,
      shortcutMap,
      getFeatureID,
      getIdentifiers: url => {
        const id = getFeatureID(url);
        return {
          id,
          class: "rgh-" + id,
          selector: ".rgh-" + id
        };
      }
    }, feature_manager = features;
    feature_manager.addCssFeature("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/align-issue-labels.tsx", [ isIssueOrPRList ]), 
    feature_manager.addCssFeature("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-pinned-issues.tsx", [ isRepoIssueList ]), 
    feature_manager.addCssFeature("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-newsfeed-noise.tsx", [ isDashboard ]), 
    feature_manager.addCssFeature("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/minimize-upload-bar.tsx", [ hasRichTextEditor ]), 
    feature_manager.addCssFeature("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-diff-signs.tsx", [ hasCode, isEditingFile ]), 
    feature_manager.addCssFeature("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-rich-text-editor.tsx", [ hasRichTextEditor ]);
    const escapeKey = (...keys) => "_" + String(keys).replace(/[^a-z\d]/gi, "_");
    class RefinedGitHubAPIError extends Error {
      constructor(...messages) {
        super(messages.join("\n")), this.response = {};
      }
    }
    const settings = options_storage.getAll();
    async function expectToken() {
      const {personalToken} = await settings;
      if (!personalToken) throw new Error("Personal token required for this feature");
      return personalToken;
    }
    async function expectTokenScope(scope) {
      const {headers} = await v3("/"), tokenScopes = headers.get("X-OAuth-Scopes");
      if (!tokenScopes.split(", ").includes(scope)) throw new Error("The token you provided does not have " + (tokenScopes ? `the \`${scope}\` scope. It only includes \`${tokenScopes}\`.` : "any scope."));
    }
    const api3 = isEnterprise() ? `${location.origin}/api/v3/` : "https://api.github.com/", api4 = isEnterprise() ? `${location.origin}/api/graphql` : "https://api.github.com/graphql", v3defaults = {
      ignoreHTTPStatus: !1,
      method: "GET",
      body: void 0,
      json: !0
    }, v4defaults = {
      allowErrors: !1
    }, v3 = mem((async (query, options = v3defaults) => {
      const {ignoreHTTPStatus, method, body, headers, json} = {
        ...v3defaults,
        ...options
      }, {personalToken} = await settings;
      query.startsWith("https") || (query = query.startsWith("/") ? query.slice(1) : [ "repos", github_helpers_getRepo().nameWithOwner, query ].filter(Boolean).join("/"));
      const url = new URL(query, api3);
      feature_manager.log.http(url);
      const response = await fetch(url.href, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          "User-Agent": "Refined GitHub",
          Accept: "application/vnd.github.v3+json",
          ...headers,
          ...personalToken && {
            Authorization: `token ${personalToken}`
          }
        }
      }), textContent = await response.text(), apiResponse = json ? JSON.parse(textContent) : {
        textContent
      };
      if (response.ok || ignoreHTTPStatus) return Object.assign(apiResponse, {
        httpStatus: response.status,
        headers: response.headers,
        ok: response.ok
      });
      throw await getError(apiResponse);
    }), {
      cacheKey: JSON.stringify
    }), v4 = mem((async (query, options = v4defaults) => {
      const personalToken = await expectToken();
      if (/^(query )?{/.test(query.trimStart())) throw new TypeError("`query` should only be what’s inside 'query {...}', like 'user(login: \"foo\") { name }', but is \n" + query);
      query = query.replace("repository() {", (() => `repository(owner: "${github_helpers_getRepo().owner}", name: "${github_helpers_getRepo().name}") {`)), 
      feature_manager.log.http(`{\n\t\t${query}\n\t}`);
      const response = await fetch(api4, {
        headers: {
          "User-Agent": "Refined GitHub",
          Authorization: `bearer ${personalToken}`,
          Accept: "application/vnd.github.merge-info-preview+json"
        },
        method: "POST",
        body: JSON.stringify({
          query: query.trimStart().startsWith("mutation") ? query : `{${query}}`
        })
      }), apiResponse = await response.json(), {data = {}, errors = []} = apiResponse;
      if (errors.length > 0 && !options.allowErrors) throw new RefinedGitHubAPIError("GraphQL:", ...errors.map((error => error.message)));
      if (response.ok) return data;
      throw await getError(apiResponse);
    }), {
      cacheKey([query, options]) {
        const key = [ query, options ];
        return query.includes("repository() {") && key.push(github_helpers_getRepo()?.nameWithOwner), 
        JSON.stringify(key);
      }
    });
    async function getError(apiResponse) {
      const {personalToken} = await settings;
      if (apiResponse.message?.includes("API rate limit exceeded")) return new RefinedGitHubAPIError("Rate limit exceeded.", personalToken ? "It may be time for a walk! 🍃 🌞" : "Set your token in the options or take a walk! 🍃 🌞");
      if ("Bad credentials" === apiResponse.message) return new RefinedGitHubAPIError("The token seems to be incorrect or expired. Update it in the options.");
      const error = new RefinedGitHubAPIError("Unable to fetch.", personalToken ? "Ensure that your token has access to this repo." : "Maybe adding a token in the options will fix this issue.", JSON.stringify(apiResponse, null, "\t"));
      return error.response = apiResponse, error;
    }
    class GitHubURL {
      constructor(url) {
        this.internalUrl = new URL(url), this.pathname = this.internalUrl.pathname;
      }
      toString() {
        return this.href;
      }
      assign(...replacements) {
        return Object.assign(this, ...replacements), this;
      }
      disambiguateReference(ambiguousReference) {
        const branch = ambiguousReference[0], filePathFromSearch = this.searchParams.getAll("path[]").join("/");
        if (filePathFromSearch) return this.searchParams.delete("path[]"), {
          branch,
          filePath: filePathFromSearch
        };
        const filePath = ambiguousReference.slice(1).join("/"), currentBranch = getCurrentCommittish(), currentBranchSections = currentBranch?.split("/");
        if (!currentBranch || !currentBranchSections || 1 === ambiguousReference.length || 1 === currentBranchSections.length) return {
          branch,
          filePath
        };
        for (const [i, section] of currentBranchSections.entries()) if (ambiguousReference[i] !== section) return console.warn(`The supplied path (${ambiguousReference.join("/")}) is ambiguous (current reference is \`${currentBranch}\`)`), 
        {
          branch,
          filePath
        };
        return {
          branch: currentBranch,
          filePath: ambiguousReference.slice(currentBranchSections.length).join("/")
        };
      }
      get pathname() {
        return `/${this.user}/${this.repository}/${this.route}/${this.branch}/${this.filePath}`.replace(/((undefined)?\/)+$/g, "");
      }
      set pathname(pathname) {
        const [user, repository, route, ...ambiguousReference] = pathname.replace(/^\/|\/$/g, "").split("/");
        if (2 === ambiguousReference.length && ambiguousReference[1].includes("%2F")) {
          const branch2 = ambiguousReference.join("/").replace(/%2F/g, "/");
          return void this.assign({
            user,
            repository,
            route,
            branch: branch2,
            filePath: ""
          });
        }
        const {branch, filePath} = this.disambiguateReference(ambiguousReference);
        this.assign({
          user,
          repository,
          route,
          branch,
          filePath
        });
      }
      get href() {
        return this.internalUrl.pathname = this.pathname, this.internalUrl.href;
      }
      set href(href) {
        this.internalUrl.href = href;
      }
      get hash() {
        return this.internalUrl.hash;
      }
      set hash(hash) {
        this.internalUrl.hash = hash;
      }
      get search() {
        return this.internalUrl.search;
      }
      set search(search) {
        this.internalUrl.search = search;
      }
      get searchParams() {
        return this.internalUrl.searchParams;
      }
    }
    const branchInfoRegex = /([^ ]+)\.$/, _getDefaultBranch = webext_storage_cache.function((async function(repository) {
      if (0 === arguments.length || JSON.stringify(repository) === JSON.stringify(github_helpers_getRepo())) {
        if (isRepoHome()) {
          const branchSelector = await elementReady('[data-hotkey="w"]');
          if (branchSelector) return "Switch branches or tags" === branchSelector.title ? branchSelector.textContent.trim() : branchSelector.title;
        }
        const defaultBranch = getCurrentBranchFromFeed();
        if (defaultBranch) return defaultBranch;
        if (!isForkedRepo()) {
          const branchInfo = select_dom(".branch-infobar")?.textContent.trim(), defaultBranch2 = branchInfoRegex.exec(branchInfo)?.[1];
          if (defaultBranch2) return defaultBranch2;
        }
      }
      const response = await v4(`\n\t\trepository(owner: "${repository.owner}", name: "${repository.name}") {\n\t\t\tdefaultBranchRef {\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t`);
      return response.repository.defaultBranchRef.name;
    }), {
      maxAge: {
        hours: 1
      },
      staleWhileRevalidate: {
        days: 20
      },
      cacheKey: ([repository]) => "default-branch:" + repository.nameWithOwner
    });
    async function getDefaultBranch(repository = github_helpers_getRepo()) {
      if (!repository) throw new Error("getDefaultBranch was called on a non-repository page");
      return _getDefaultBranch(repository);
    }
    function getType() {
      return location.pathname.split("/").pop().includes(".") ? "file" : "object";
    }
    async function useful_not_found_page_is404(url) {
      const {status} = await fetch(url, {
        method: "head"
      });
      return 404 === status;
    }
    function getStrikeThrough(text) {
      return dom_chef.createElement("del", {
        className: "color-fg-subtle"
      }, text);
    }
    function parseCurrentURL() {
      const parts = github_helpers_getCleanPathname().split("/");
      return "blob" === parts[2] && (parts[2] = "tree"), parts;
    }
    async function showDefaultBranchLink() {
      const urlToFileOnDefaultBranch = await async function() {
        const parsedUrl = new GitHubURL(location.href);
        if (!parsedUrl.branch) return;
        parsedUrl.assign({
          branch: await getDefaultBranch()
        });
        const urlOnDefault = parsedUrl.href;
        return urlOnDefault === location.href || await useful_not_found_page_is404(urlOnDefault) ? void 0 : urlOnDefault;
      }();
      urlToFileOnDefaultBranch && select_dom("main > .container-lg").before(dom_chef.createElement("p", {
        className: "container mt-4 text-center"
      }, dom_chef.createElement("a", {
        href: urlToFileOnDefaultBranch
      }, "This ", getType()), " exists on the default branch."));
    }
    async function showAlternateLink() {
      const url = new GitHubURL(location.href);
      if (!url.branch || !url.filePath) return;
      const commitSha = await async function(branch, filePath) {
        const {repository} = await v4(`\n\t\trepository() {\n\t\t\tobject(expression: "${branch}") {\n\t\t\t\t... on Commit {\n\t\t\t\t\thistory(first: 1, path: "${filePath}") {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\toid\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`), commit = repository.object?.history.nodes[0];
        return commit?.oid;
      }(url.branch, url.filePath);
      if (!commitSha) return;
      const fileChanges = await async function(sha, filePath) {
        const commit = await v3(`commits/${sha}`);
        for (const fileInfo of commit.files) if ([ fileInfo.filename, fileInfo.previous_filename ].includes(filePath)) return {
          commit: {
            parentSha: commit.parents[0].sha,
            date: commit.commit.committer.date,
            url: commit.html_url
          },
          file: fileInfo
        };
      }(commitSha, url.filePath);
      if (!fileChanges) return;
      url.assign({
        route: "commits"
      });
      const commitHistory = dom_chef.createElement("a", {
        href: url.href
      }, "Commit history");
      url.assign({
        route: "blob",
        branch: fileChanges.commit.parentSha,
        filePath: url.filePath
      });
      const lastVersionUrl = "removed" === fileChanges.file.status ? fileChanges.file.blob_url : url.href, lastVersion = dom_chef.createElement("a", {
        href: lastVersionUrl
      }, "This ", getType()), permalink = dom_chef.createElement("a", {
        href: fileChanges.commit.url
      }, dom_chef.createElement("relative-time", {
        datetime: fileChanges.commit.date
      })), verb = "removed" === fileChanges.file.status ? "deleted" : dom_chef.createElement("a", {
        href: fileChanges.file.blob_url
      }, "moved");
      select_dom("main > .container-lg").before(dom_chef.createElement("p", {
        className: "container mt-4 text-center"
      }, lastVersion, " was ", verb, " (", permalink, ") - ", commitHistory, "."));
    }
    function createDropdownItem(label, url, attributes) {
      return dom_chef.createElement("li", {
        ...attributes
      }, dom_chef.createElement("a", {
        role: "menuitem",
        className: "dropdown-item",
        href: url
      }, label));
    }
    async function unhideOverflowDropdown() {
      const repoNavigationBar = await elementReady(".UnderlineNav-body");
      return !!select_dom.exists(".js-responsive-underlinenav") && (repoNavigationBar.parentElement.classList.add("rgh-has-more-dropdown"), 
      !0);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/useful-not-found-page.tsx", {
      asLongAs: [ is404, () => parseCurrentURL().length > 1 ],
      init: node_modules_onetime((async function() {
        const pathParts = parseCurrentURL(), breadcrumbs = [ ...pathParts.entries() ].reverse().map((([i, part]) => {
          if (0 === i && "orgs" === part || 2 === i && [ "tree", "blob", "edit" ].includes(part) || i === pathParts.length - 1) return getStrikeThrough(part);
          const pathname = "/" + pathParts.slice(0, i + 1).join("/"), link = dom_chef.createElement("a", {
            href: pathname
          }, part);
          return async function(anchor) {
            anchor instanceof HTMLAnchorElement && await useful_not_found_page_is404(anchor.href) && anchor.replaceWith(getStrikeThrough(anchor.textContent));
          }(link), link;
        })).reverse().flatMap(((link, i) => [ i > 0 && " / ", link ]));
        select_dom("main > :first-child, #parallax_illustration").after(dom_chef.createElement("h2", {
          className: "container mt-4 text-center"
        }, breadcrumbs));
      }))
    }, {
      asLongAs: [ is404 ],
      include: [ isSingleFile, isRepoTree, isEditingFile ],
      init: node_modules_onetime((function() {
        showDefaultBranchLink(), showAlternateLink();
      }))
    }, {
      include: [ isPRCommit404 ],
      awaitDomReady: !1,
      init: node_modules_onetime((async function() {
        const commitUrl = location.href.replace(/pull\/\d+\/commits/, "commit");
        if (await useful_not_found_page_is404(commitUrl)) return !1;
        (await elementReady(".blankslate p", {
          waitForChildren: !1
        })).after(dom_chef.createElement("p", null, "You can also try to ", dom_chef.createElement("a", {
          href: commitUrl
        }, "view the detached standalone commit"), "."));
      }))
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/more-dropdown-links.tsx", {
      include: [ isRepo ],
      exclude: [ isEmptyRepo, () => !select_dom.exists(".js-responsive-underlinenav") ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const reference = getCurrentCommittish() ?? await getDefaultBranch(), compareUrl = buildRepoURL("compare", reference), commitsUrl = buildRepoURL("commits", reference), branchesUrl = buildRepoURL("branches"), dependenciesUrl = buildRepoURL("network/dependencies");
        await unhideOverflowDropdown(), (await elementReady(".UnderlineNav-actions ul")).append(dom_chef.createElement("li", {
          className: "dropdown-divider",
          role: "separator"
        }), createDropdownItem("Compare", compareUrl), isEnterprise() ? "" : createDropdownItem("Dependencies", dependenciesUrl), createDropdownItem("Commits", commitsUrl), createDropdownItem("Branches", branchesUrl));
      }
    });
    var sizeMap = {
      small: 16,
      medium: 32,
      large: 64
    };
    function getSvgProps(_ref) {
      var ariaLabel = _ref["aria-label"], className = _ref.className, _ref$fill = _ref.fill, fill = void 0 === _ref$fill ? "currentColor" : _ref$fill, size = _ref.size, verticalAlign = _ref.verticalAlign, svgDataByHeight = _ref.svgDataByHeight, height = sizeMap[size] || size, naturalHeight = function(naturalHeights, height) {
        return naturalHeights.map((function(naturalHeight) {
          return parseInt(naturalHeight, 10);
        })).reduce((function(acc, naturalHeight) {
          return naturalHeight <= height ? naturalHeight : acc;
        }), naturalHeights[0]);
      }(Object.keys(svgDataByHeight), height), naturalWidth = svgDataByHeight[naturalHeight].width;
      return {
        "aria-hidden": ariaLabel ? "false" : "true",
        "aria-label": ariaLabel,
        role: "img",
        className,
        viewBox: "0 0 " + naturalWidth + " " + naturalHeight,
        width: height * (naturalWidth / naturalHeight),
        height,
        fill,
        style: {
          display: "inline-block",
          userSelect: "none",
          verticalAlign,
          overflow: "visible"
        },
        dangerouslySetInnerHTML: {
          __html: svgDataByHeight[naturalHeight].path
        }
      };
    }
    var _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
      }
      return target;
    };
    function AlertIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M13 17.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-8.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z"></path><path fill-rule="evenodd" d="M9.836 3.244c.963-1.665 3.365-1.665 4.328 0l8.967 15.504c.963 1.667-.24 3.752-2.165 3.752H3.034c-1.926 0-3.128-2.085-2.165-3.752L9.836 3.244zm3.03.751a1 1 0 00-1.732 0L2.168 19.499A1 1 0 003.034 21h17.932a1 1 0 00.866-1.5L12.866 3.994z"></path>'
          }
        }
      })));
    }
    function ArrowDownIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M13.03 8.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.47 9.28a.75.75 0 011.06-1.06l2.97 2.97V3.75a.75.75 0 011.5 0v7.44l2.97-2.97a.75.75 0 011.06 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M4.97 13.22a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 10-1.06-1.06l-4.97 4.97V3.75a.75.75 0 00-1.5 0v14.44l-4.97-4.97a.75.75 0 00-1.06 0z"></path>'
          }
        }
      })));
    }
    function ArrowLeftIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M10.78 19.03a.75.75 0 01-1.06 0l-6.25-6.25a.75.75 0 010-1.06l6.25-6.25a.75.75 0 111.06 1.06L5.81 11.5h14.44a.75.75 0 010 1.5H5.81l4.97 4.97a.75.75 0 010 1.06z"></path>'
          }
        }
      })));
    }
    function ArrowUpIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M3.47 7.78a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L9 4.81v7.44a.75.75 0 01-1.5 0V4.81L4.53 7.78a.75.75 0 01-1.06 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M18.655 10.405a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 00-1.06 0l-6.25 6.25a.75.75 0 101.06 1.06l4.97-4.97v14.44a.75.75 0 001.5 0V5.435l4.97 4.97a.75.75 0 001.06 0z"></path>'
          }
        }
      })));
    }
    function BookIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M0 3.75A.75.75 0 01.75 3h7.497c1.566 0 2.945.8 3.751 2.014A4.496 4.496 0 0115.75 3h7.5a.75.75 0 01.75.75v15.063a.75.75 0 01-.755.75l-7.682-.052a3 3 0 00-2.142.878l-.89.891a.75.75 0 01-1.061 0l-.902-.901a3 3 0 00-2.121-.879H.75a.75.75 0 01-.75-.75v-15zm11.247 3.747a3 3 0 00-3-2.997H1.5V18h6.947a4.5 4.5 0 012.803.98l-.003-11.483zm1.503 11.485V7.5a3 3 0 013-3h6.75v13.558l-6.927-.047a4.5 4.5 0 00-2.823.971z"></path>'
          }
        }
      })));
    }
    function BugIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M4.72.22a.75.75 0 011.06 0l1 .999a3.492 3.492 0 012.441 0l.999-1a.75.75 0 111.06 1.061l-.775.776c.616.63.995 1.493.995 2.444v.327c0 .1-.009.197-.025.292.408.14.764.392 1.029.722l1.968-.787a.75.75 0 01.556 1.392L13 7.258V9h2.25a.75.75 0 010 1.5H13v.5c0 .409-.049.806-.141 1.186l2.17.868a.75.75 0 01-.557 1.392l-2.184-.873A4.997 4.997 0 018 16a4.997 4.997 0 01-4.288-2.427l-2.183.873a.75.75 0 01-.558-1.392l2.17-.868A5.013 5.013 0 013 11v-.5H.75a.75.75 0 010-1.5H3V7.258L.971 6.446a.75.75 0 01.558-1.392l1.967.787c.265-.33.62-.583 1.03-.722a1.684 1.684 0 01-.026-.292V4.5c0-.951.38-1.814.995-2.444L4.72 1.28a.75.75 0 010-1.06zM6.173 5h3.654A.173.173 0 0010 4.827V4.5a2 2 0 10-4 0v.327c0 .096.077.173.173.173zM5.25 6.5a.75.75 0 00-.75.75V11a3.5 3.5 0 107 0V7.25a.75.75 0 00-.75-.75h-5.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M7.72.22a.75.75 0 011.06 0l1.204 1.203A4.983 4.983 0 0112 1c.717 0 1.4.151 2.016.423L15.22.22a.75.75 0 011.06 1.06l-.971.972A4.988 4.988 0 0117 6v1.104a2.755 2.755 0 011.917 1.974l1.998-.999a.75.75 0 01.67 1.342L19 10.714V13.5l3.25.003a.75.75 0 110 1.5L19 15.001V16a7.02 7.02 0 01-.204 1.686.833.833 0 01.04.018l2.75 1.375a.75.75 0 11-.671 1.342l-2.638-1.319A7 7 0 0112 23a7 7 0 01-6.197-3.742l-2.758 1.181a.75.75 0 11-.59-1.378l2.795-1.199A7.007 7.007 0 015 16v-.996H1.75a.75.75 0 010-1.5H5v-2.79L2.415 9.42a.75.75 0 01.67-1.342l1.998.999A2.755 2.755 0 017 7.104V6a4.99 4.99 0 011.69-3.748l-.97-.972a.75.75 0 010-1.06zM8.5 7h7V6a3.5 3.5 0 10-7 0v1zm-2 3.266V9.75c0-.69.56-1.25 1.25-1.25h8.5c.69 0 1.25.56 1.25 1.25V16a5.5 5.5 0 01-11 0v-5.734z"></path>'
          }
        }
      })));
    }
    function CheckIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M21.03 5.72a.75.75 0 010 1.06l-11.5 11.5a.75.75 0 01-1.072-.012l-5.5-5.75a.75.75 0 111.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 011.06 0z"></path>'
          }
        }
      })));
    }
    function CheckCircleIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM0 8a8 8 0 1116 0A8 8 0 010 8zm11.78-1.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M17.28 9.28a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path>'
          }
        }
      })));
    }
    function CheckCircleFillIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          12: {
            width: 12,
            path: '<path fill-rule="evenodd" d="M6 0a6 6 0 100 12A6 6 0 006 0zm-.705 8.737L9.63 4.403 8.392 3.166 5.295 6.263l-1.7-1.702L2.356 5.8l2.938 2.938z"></path>'
          },
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm16.28-2.72a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z"></path>'
          }
        }
      })));
    }
    function ChevronLeftIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M15.28 5.22a.75.75 0 00-1.06 0l-6.25 6.25a.75.75 0 000 1.06l6.25 6.25a.75.75 0 101.06-1.06L9.56 12l5.72-5.72a.75.75 0 000-1.06z"></path>'
          }
        }
      })));
    }
    function ClockIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M12.5 7.25a.75.75 0 00-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 00.744-1.302L12.5 12.315V7.25z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path>'
          }
        }
      })));
    }
    function CodeIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M8.78 4.97a.75.75 0 010 1.06L2.81 12l5.97 5.97a.75.75 0 11-1.06 1.06l-6.5-6.5a.75.75 0 010-1.06l6.5-6.5a.75.75 0 011.06 0zm6.44 0a.75.75 0 000 1.06L21.19 12l-5.97 5.97a.75.75 0 101.06 1.06l6.5-6.5a.75.75 0 000-1.06l-6.5-6.5a.75.75 0 00-1.06 0z"></path>'
          }
        }
      })));
    }
    function CodeSquareIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M1.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm9.22 3.72a.75.75 0 000 1.06L10.69 8 9.22 9.47a.75.75 0 101.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0zM6.78 6.53a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 101.06-1.06L5.31 8l1.47-1.47z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M10.3 8.24a.75.75 0 01-.04 1.06L7.352 12l2.908 2.7a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 011.06.04zm3.44 1.06a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.908-2.7-2.908-2.7z"></path><path fill-rule="evenodd" d="M2 3.75C2 2.784 2.784 2 3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0120.25 22H3.75A1.75 1.75 0 012 20.25V3.75zm1.75-.25a.25.25 0 00-.25.25v16.5c0 .138.112.25.25.25h16.5a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H3.75z"></path>'
          }
        }
      })));
    }
    function CommentIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.72-3.72a.75.75 0 01.53-.22h10a.25.25 0 00.25-.25V4.25a.25.25 0 00-.25-.25H3.25zm-1.75.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 01-1.75 1.75h-9.69l-3.573 3.573A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25z"></path>'
          }
        }
      })));
    }
    function CopyIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 01-1.75 1.75H8.774a1.75 1.75 0 01-1.75-1.75V3.75zm1.75-.25a.25.25 0 00-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H8.774z"></path><path d="M1.995 10.749a1.75 1.75 0 011.75-1.751H5.25a.75.75 0 110 1.5H3.745a.25.25 0 00-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 00.25-.25v-1.51a.75.75 0 111.5 0v1.51A1.75 1.75 0 0113.25 22h-9.5A1.75 1.75 0 012 20.25l-.005-9.501z"></path>'
          }
        }
      })));
    }
    function DiffIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M8.75 1.75a.75.75 0 00-1.5 0V5H4a.75.75 0 000 1.5h3.25v3.25a.75.75 0 001.5 0V6.5H12A.75.75 0 0012 5H8.75V1.75zM4 13a.75.75 0 000 1.5h8a.75.75 0 100-1.5H4z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M12.25 3.5a.75.75 0 01.75.75V8.5h4.25a.75.75 0 010 1.5H13v4.25a.75.75 0 01-1.5 0V10H7.25a.75.75 0 010-1.5h4.25V4.25a.75.75 0 01.75-.75zM6.562 19.25a.75.75 0 01.75-.75h9.938a.75.75 0 010 1.5H7.312a.75.75 0 01-.75-.75z"></path>'
          }
        }
      })));
    }
    function DiffModifiedIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zM8 10a2 2 0 100-4 2 2 0 000 4z"></path>'
          }
        }
      })));
    }
    function DotIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM4 8a4 4 0 118 0 4 4 0 01-8 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 1.5a6 6 0 100-12 6 6 0 000 12z"></path>'
          }
        }
      })));
    }
    function DotFillIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path>'
          }
        }
      })));
    }
    function DownloadIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"></path>'
          }
        }
      })));
    }
    function EyeIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"></path><path fill-rule="evenodd" d="M12 3.5c-3.432 0-6.125 1.534-8.054 3.24C2.02 8.445.814 10.352.33 11.202a1.6 1.6 0 000 1.598c.484.85 1.69 2.758 3.616 4.46C5.876 18.966 8.568 20.5 12 20.5c3.432 0 6.125-1.534 8.054-3.24 1.926-1.704 3.132-3.611 3.616-4.461a1.6 1.6 0 000-1.598c-.484-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5zM1.633 11.945c.441-.774 1.551-2.528 3.307-4.08C6.69 6.314 9.045 5 12 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.111.111 0 01.017.056.111.111 0 01-.017.056c-.441.774-1.551 2.527-3.307 4.08C17.31 17.685 14.955 19 12 19c-2.955 0-5.309-1.315-7.06-2.864-1.756-1.553-2.866-3.306-3.307-4.08A.11.11 0 011.616 12a.11.11 0 01.017-.055z"></path>'
          }
        }
      })));
    }
    function EyeClosedIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M.143 2.31a.75.75 0 011.047-.167l14.5 10.5a.75.75 0 11-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.618 1.618 0 010-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 01.143 2.31zm3.386 3.378a14.21 14.21 0 00-1.85 2.244.12.12 0 00-.022.068c0 .021.006.045.022.068.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 016.058 7.52l-2.53-1.832zM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 11-.473-1.423A6.23 6.23 0 018 2c1.981 0 3.67.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.619 1.619 0 010 1.798c-.11.166-.248.365-.41.587a.75.75 0 11-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 000-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M8.052 5.837A9.715 9.715 0 0112 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.11.11 0 01.016.055.122.122 0 01-.017.06 16.766 16.766 0 01-1.53 2.218.75.75 0 101.163.946 18.253 18.253 0 001.67-2.42 1.607 1.607 0 00.001-1.602c-.485-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5c-1.695 0-3.215.374-4.552.963a.75.75 0 00.604 1.373z"></path><path fill-rule="evenodd" d="M19.166 17.987C17.328 19.38 14.933 20.5 12 20.5c-3.432 0-6.125-1.534-8.054-3.24C2.02 15.556.814 13.648.33 12.798a1.606 1.606 0 01.001-1.6A18.305 18.305 0 013.648 7.01L1.317 5.362a.75.75 0 11.866-1.224l20.5 14.5a.75.75 0 11-.866 1.224l-2.651-1.875zM4.902 7.898c-1.73 1.541-2.828 3.273-3.268 4.044a.118.118 0 00-.017.059c0 .015.003.034.016.055.441.774 1.551 2.527 3.307 4.08C6.69 17.685 9.045 19 12 19c2.334 0 4.29-.82 5.874-1.927l-3.516-2.487a3.5 3.5 0 01-5.583-3.949L4.902 7.899z"></path>'
          }
        }
      })));
    }
    function FileDiffIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M2.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177l-2.914-2.914a.25.25 0 00-.177-.073H2.75zM1 1.75C1 .784 1.784 0 2.75 0h7.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V1.75zm7 1.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0V7h-1.5a.75.75 0 010-1.5h1.5V4A.75.75 0 018 3.25zm-3 8a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M12.5 6.75a.75.75 0 00-1.5 0V9H8.75a.75.75 0 000 1.5H11v2.25a.75.75 0 001.5 0V10.5h2.25a.75.75 0 000-1.5H12.5V6.75zM8.75 16a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"></path><path fill-rule="evenodd" d="M5 1a2 2 0 00-2 2v18a2 2 0 002 2h14a2 2 0 002-2V7.018a2 2 0 00-.586-1.414l-4.018-4.018A2 2 0 0014.982 1H5zm-.5 2a.5.5 0 01.5-.5h9.982a.5.5 0 01.354.146l4.018 4.018a.5.5 0 01.146.354V21a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V3z"></path>'
          }
        }
      })));
    }
    function FoldIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path d="M10.896 2H8.75V.75a.75.75 0 00-1.5 0V2H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0l2.896-2.896A.25.25 0 0010.896 2zM8.75 15.25a.75.75 0 01-1.5 0V14H5.104a.25.25 0 01-.177-.427l2.896-2.896a.25.25 0 01.354 0l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25zm-6.5-6.5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M12 15a.75.75 0 01.53.22l3.25 3.25a.75.75 0 11-1.06 1.06L12 16.81l-2.72 2.72a.75.75 0 01-1.06-1.06l3.25-3.25A.75.75 0 0112 15z"></path><path fill-rule="evenodd" d="M12 15.75a.75.75 0 01.75.75v5.75a.75.75 0 01-1.5 0V16.5a.75.75 0 01.75-.75zm.53-6.97a.75.75 0 01-1.06 0L8.22 5.53a.75.75 0 011.06-1.06L12 7.19l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25z"></path><path fill-rule="evenodd" d="M12 8.5a.75.75 0 01-.75-.75v-6a.75.75 0 011.5 0v6a.75.75 0 01-.75.75zM10.75 12a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75z"></path>'
          }
        }
      })));
    }
    function FoldDownIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path d="M8.177 14.323l2.896-2.896a.25.25 0 00-.177-.427H8.75V7.764a.75.75 0 10-1.5 0V11H5.104a.25.25 0 00-.177.427l2.896 2.896a.25.25 0 00.354 0zM2.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zM8.25 5a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 4.25a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M12 19a.75.75 0 01-.53-.22l-3.25-3.25a.75.75 0 111.06-1.06L12 17.19l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25A.75.75 0 0112 19z"></path><path fill-rule="evenodd" d="M12 18a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5A.75.75 0 0112 18zM10.75 6a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 012.75 6zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 016.75 6zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75z"></path>'
          }
        }
      })));
    }
    function GitBranchIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M5.75 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 19.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM5.75 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"></path><path fill-rule="evenodd" d="M5.75 16.75A.75.75 0 006.5 16V8A.75.75 0 005 8v8c0 .414.336.75.75.75z"></path><path fill-rule="evenodd" d="M17.5 8.75v-1H19v1a3.75 3.75 0 01-3.75 3.75h-7a1.75 1.75 0 00-1.75 1.75H5A3.25 3.25 0 018.25 11h7a2.25 2.25 0 002.25-2.25z"></path>'
          }
        }
      })));
    }
    function GitCompareIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M9.573.677L7.177 3.073a.25.25 0 000 .354l2.396 2.396A.25.25 0 0010 5.646V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5h-1V.854a.25.25 0 00-.427-.177zM6 12v-1.646a.25.25 0 01.427-.177l2.396 2.396a.25.25 0 010 .354l-2.396 2.396A.25.25 0 016 15.146V13.5H5A2.5 2.5 0 012.5 11V5.372a2.25 2.25 0 111.5 0V11a1 1 0 001 1h1zm6.75 0a.75.75 0 100 1.5.75.75 0 000-1.5zM4 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M19.75 17.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm-3.25 1.75a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z"></path><path fill-rule="evenodd" d="M13.905 1.72a.75.75 0 010 1.06L12.685 4h4.065a3.75 3.75 0 013.75 3.75v8.75a.75.75 0 01-1.5 0V7.75a2.25 2.25 0 00-2.25-2.25h-4.064l1.22 1.22a.75.75 0 01-1.061 1.06l-2.5-2.5a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 0zM4.25 6.5a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5zM7.5 4.75a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0z"></path><path fill-rule="evenodd" d="M10.095 22.28a.75.75 0 010-1.06l1.22-1.22H7.25a3.75 3.75 0 01-3.75-3.75V7.5a.75.75 0 011.5 0v8.75a2.25 2.25 0 002.25 2.25h4.064l-1.22-1.22a.75.75 0 111.061-1.06l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 01-1.06 0z"></path>'
          }
        }
      })));
    }
    function GitMergeIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M5.75 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 19.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM5.75 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 15a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 13.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"></path><path fill-rule="evenodd" d="M6.5 7.25c0 2.9 2.35 5.25 5.25 5.25h4.5V14h-4.5A6.75 6.75 0 015 7.25h1.5z"></path><path fill-rule="evenodd" d="M5.75 16.75A.75.75 0 006.5 16V8A.75.75 0 005 8v8c0 .414.336.75.75.75z"></path>'
          }
        }
      })));
    }
    function GitPullRequestIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M4.75 3a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 4.75a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM4.75 17.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zm17.75-1.75a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM16 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z"></path><path fill-rule="evenodd" d="M4.75 7.25A.75.75 0 015.5 8v8A.75.75 0 014 16V8a.75.75 0 01.75-.75zm8.655-5.53a.75.75 0 010 1.06L12.185 4h4.065A3.75 3.75 0 0120 7.75v8.75a.75.75 0 01-1.5 0V7.75a2.25 2.25 0 00-2.25-2.25h-4.064l1.22 1.22a.75.75 0 01-1.061 1.06l-2.5-2.5a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 0z"></path>'
          }
        }
      })));
    }
    function GitPullRequestClosedIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M10.72 1.227a.75.75 0 011.06 0l.97.97.97-.97a.75.75 0 111.06 1.061l-.97.97.97.97a.75.75 0 01-1.06 1.06l-.97-.97-.97.97a.75.75 0 11-1.06-1.06l.97-.97-.97-.97a.75.75 0 010-1.06zM12.75 6.5a.75.75 0 00-.75.75v3.378a2.251 2.251 0 101.5 0V7.25a.75.75 0 00-.75-.75zm0 5.5a.75.75 0 100 1.5.75.75 0 000-1.5zM2.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.25 1a2.25 2.25 0 00-.75 4.372v5.256a2.251 2.251 0 101.5 0V5.372A2.25 2.25 0 003.25 1zm0 11a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M22.266 2.711a.75.75 0 10-1.061-1.06l-1.983 1.983-1.984-1.983a.75.75 0 10-1.06 1.06l1.983 1.983-1.983 1.984a.75.75 0 001.06 1.06l1.984-1.983 1.983 1.983a.75.75 0 001.06-1.06l-1.983-1.984 1.984-1.983z"></path><path fill-rule="evenodd" d="M4.75 1.5a3.25 3.25 0 00-.745 6.414A.758.758 0 004 8v8a.81.81 0 00.005.086A3.251 3.251 0 004.75 22.5a3.25 3.25 0 00.745-6.414A.758.758 0 005.5 16V8a.758.758 0 00-.005-.086A3.251 3.251 0 004.75 1.5zM3 4.75a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zm0 14.5a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zm13 0a3.251 3.251 0 012.5-3.163V9.625a.75.75 0 011.5 0v6.462a3.251 3.251 0 01-.75 6.413A3.25 3.25 0 0116 19.25zm3.25-1.75a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5z"></path>'
          }
        }
      })));
    }
    function GitPullRequestDraftIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M2.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.25 1a2.25 2.25 0 00-.75 4.372v5.256a2.251 2.251 0 101.5 0V5.372A2.25 2.25 0 003.25 1zm0 11a.75.75 0 100 1.5.75.75 0 000-1.5zm9.5 3a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0-3a.75.75 0 100 1.5.75.75 0 000-1.5z"></path><path d="M14 7.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm0-4.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M4.75 1.5a3.25 3.25 0 00-.745 6.414A.758.758 0 004 8v8a.81.81 0 00.005.086A3.251 3.251 0 004.75 22.5a3.25 3.25 0 00.745-6.414A.757.757 0 005.5 16V8a.758.758 0 00-.005-.086A3.251 3.251 0 004.75 1.5zM3 4.75a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zm0 14.5a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zm13 0a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zm3.25-1.75a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5z"></path><path d="M19.25 6a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5zM21 11.25a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z"></path>'
          }
        }
      })));
    }
    function InfoIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M13 7.5a1 1 0 11-2 0 1 1 0 012 0zm-3 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.25h.75a.75.75 0 010 1.5h-3a.75.75 0 010-1.5h.75V12h-.75a.75.75 0 01-.75-.75z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path>'
          }
        }
      })));
    }
    function IssueOpenedIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0zM12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 13a2 2 0 100-4 2 2 0 000 4z"></path>'
          }
        }
      })));
    }
    function LinkIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M14.78 3.653a3.936 3.936 0 115.567 5.567l-3.627 3.627a3.936 3.936 0 01-5.88-.353.75.75 0 00-1.18.928 5.436 5.436 0 008.12.486l3.628-3.628a5.436 5.436 0 10-7.688-7.688l-3 3a.75.75 0 001.06 1.061l3-3z"></path><path d="M7.28 11.153a3.936 3.936 0 015.88.353.75.75 0 001.18-.928 5.436 5.436 0 00-8.12-.486L2.592 13.72a5.436 5.436 0 107.688 7.688l3-3a.75.75 0 10-1.06-1.06l-3 3a3.936 3.936 0 01-5.567-5.568l3.627-3.627z"></path>'
          }
        }
      })));
    }
    function LinkExternalIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M15.5 2.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.06l-6.22 6.22a.75.75 0 11-1.06-1.06L19.94 3h-3.69a.75.75 0 01-.75-.75z"></path><path d="M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 010 1.5h-8.5a.25.25 0 00-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 00.25-.25v-8.5a.75.75 0 011.5 0v8.5a1.75 1.75 0 01-1.75 1.75H4.25a1.75 1.75 0 01-1.75-1.75V4.25z"></path>'
          }
        }
      })));
    }
    function PencilIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M17.263 2.177a1.75 1.75 0 012.474 0l2.586 2.586a1.75 1.75 0 010 2.474L19.53 10.03l-.012.013L8.69 20.378a1.75 1.75 0 01-.699.409l-5.523 1.68a.75.75 0 01-.935-.935l1.673-5.5a1.75 1.75 0 01.466-.756L14.476 4.963l2.787-2.786zm-2.275 4.371l-10.28 9.813a.25.25 0 00-.067.108l-1.264 4.154 4.177-1.271a.25.25 0 00.1-.059l10.273-9.806-2.94-2.939zM19 8.44l2.263-2.262a.25.25 0 000-.354l-2.586-2.586a.25.25 0 00-.354 0L16.061 5.5 19 8.44z"></path>'
          }
        }
      })));
    }
    function PlayIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M9.5 15.584V8.416a.5.5 0 01.77-.42l5.576 3.583a.5.5 0 010 .842l-5.576 3.584a.5.5 0 01-.77-.42z"></path><path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path>'
          }
        }
      })));
    }
    function PlusIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z"></path>'
          }
        }
      })));
    }
    function ReplyIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M6.78 1.97a.75.75 0 010 1.06L3.81 6h6.44A4.75 4.75 0 0115 10.75v2.5a.75.75 0 01-1.5 0v-2.5a3.25 3.25 0 00-3.25-3.25H3.81l2.97 2.97a.75.75 0 11-1.06 1.06L1.47 7.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M10.53 5.03a.75.75 0 10-1.06-1.06l-6.25 6.25a.75.75 0 000 1.06l6.25 6.25a.75.75 0 101.06-1.06L5.56 11.5H17a3.248 3.248 0 013.25 3.248v4.502a.75.75 0 001.5 0v-4.502A4.748 4.748 0 0017 10H5.56l4.97-4.97z"></path>'
          }
        }
      })));
    }
    function RepoIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M3 2.75A2.75 2.75 0 015.75 0h14.5a.75.75 0 01.75.75v20.5a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h5.25v-4H6A1.5 1.5 0 004.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 01-.6 1.374A3.25 3.25 0 013 18.75v-16zM19.5 1.5V15H6c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H19.5z"></path><path d="M7 18.25a.25.25 0 01.25-.25h5a.25.25 0 01.25.25v5.01a.25.25 0 01-.397.201l-2.206-1.604a.25.25 0 00-.294 0L7.397 23.46a.25.25 0 01-.397-.2v-5.01z"></path>'
          }
        }
      })));
    }
    function RepoForkedIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M12 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm-3.25-1.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zm-3-12.75a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"></path><path fill-rule="evenodd" d="M6.5 7.75v1A2.25 2.25 0 008.75 11h6.5a2.25 2.25 0 002.25-2.25v-1H19v1a3.75 3.75 0 01-3.75 3.75h-6.5A3.75 3.75 0 015 8.75v-1h1.5z"></path><path fill-rule="evenodd" d="M11.25 16.25v-5h1.5v5h-1.5z"></path>'
          }
        }
      })));
    }
    function SearchIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M10.25 2a8.25 8.25 0 105.28 14.59l5.69 5.69a.75.75 0 101.06-1.06l-5.69-5.69A8.25 8.25 0 0010.25 2zM3.5 10.25a6.75 6.75 0 1113.5 0 6.75 6.75 0 01-13.5 0z"></path>'
          }
        }
      })));
    }
    function StopIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm0 10a1 1 0 100-2 1 1 0 000 2z"></path><path fill-rule="evenodd" d="M7.328 1.47a.75.75 0 01.53-.22h8.284a.75.75 0 01.53.22l5.858 5.858c.141.14.22.33.22.53v8.284a.75.75 0 01-.22.53l-5.858 5.858a.75.75 0 01-.53.22H7.858a.75.75 0 01-.53-.22L1.47 16.672a.75.75 0 01-.22-.53V7.858a.75.75 0 01.22-.53L7.328 1.47zm.84 1.28L2.75 8.169v7.662l5.419 5.419h7.662l5.419-5.418V8.168L15.832 2.75H8.168z"></path>'
          }
        }
      })));
    }
    function TableIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zM1.5 6.5v7.75c0 .138.112.25.25.25H5v-8H1.5zM5 5H1.5V1.75a.25.25 0 01.25-.25H5V5zm1.5 1.5v8h7.75a.25.25 0 00.25-.25V6.5h-8zm8-1.5h-8V1.5h7.75a.25.25 0 01.25.25V5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M2 3.75C2 2.784 2.784 2 3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0120.25 22H3.75A1.75 1.75 0 012 20.25V3.75zM3.5 9v11.25c0 .138.112.25.25.25H7.5V9h-4zm4-1.5h-4V3.75a.25.25 0 01.25-.25H7.5v4zM9 9v11.5h11.25a.25.25 0 00.25-.25V9H9zm11.5-1.5H9v-4h11.25a.25.25 0 01.25.25V7.5z"></path>'
          }
        }
      })));
    }
    function TagIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M7.75 6.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"></path><path fill-rule="evenodd" d="M2.5 1A1.5 1.5 0 001 2.5v8.44c0 .397.158.779.44 1.06l10.25 10.25a1.5 1.5 0 002.12 0l8.44-8.44a1.5 1.5 0 000-2.12L12 1.44A1.5 1.5 0 0010.94 1H2.5zm0 1.5h8.44l10.25 10.25-8.44 8.44L2.5 10.94V2.5z"></path>'
          }
        }
      })));
    }
    function TerminalIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25V2.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H1.75zM7.25 8a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L5.44 8 3.72 6.28a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm1.5 1.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M9.25 12a.75.75 0 01-.22.53l-2.75 2.75a.75.75 0 01-1.06-1.06L7.44 12 5.22 9.78a.75.75 0 111.06-1.06l2.75 2.75c.141.14.22.331.22.53zm2 2a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5z"></path><path fill-rule="evenodd" d="M0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75zm1.75-.25a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H1.75z"></path>'
          }
        }
      })));
    }
    function TrashIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0a.25.25 0 01.25-.25h4.5a.25.25 0 01.25.25V3h-5V1.75z"></path><path d="M4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z"></path><path d="M9.206 7.501a.75.75 0 01.793.705l.5 8.5A.75.75 0 119 16.794l-.5-8.5a.75.75 0 01.705-.793zm6.293.793A.75.75 0 1014 8.206l-.5 8.5a.75.75 0 001.498.088l.5-8.5z"></path>'
          }
        }
      })));
    }
    function UnfoldIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path d="M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M12 23a.75.75 0 01-.53-.22l-3.25-3.25a.75.75 0 111.06-1.06L12 21.19l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25A.75.75 0 0112 23z"></path><path fill-rule="evenodd" d="M12 22.25a.75.75 0 01-.75-.75v-5.75a.75.75 0 011.5 0v5.75a.75.75 0 01-.75.75zM10.75 12a.75.75 0 01.75-.75h1a.75.75 0 110 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm-8 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zm12 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM11.47 1.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 01-1.06 1.06L12 2.81 9.28 5.53a.75.75 0 01-1.06-1.06l3.25-3.25z"></path><path fill-rule="evenodd" d="M12 1.5a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6A.75.75 0 0112 1.5z"></path>'
          }
        }
      })));
    }
    function VersionsIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M7.75 14A1.75 1.75 0 016 12.25v-8.5C6 2.784 6.784 2 7.75 2h6.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14h-6.5zm-.25-1.75c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25h-6.5a.25.25 0 00-.25.25v8.5zM4.9 3.508a.75.75 0 01-.274 1.025.25.25 0 00-.126.217v6.5a.25.25 0 00.126.217.75.75 0 01-.752 1.298A1.75 1.75 0 013 11.25v-6.5c0-.649.353-1.214.874-1.516a.75.75 0 011.025.274zM1.625 5.533a.75.75 0 10-.752-1.299A1.75 1.75 0 000 5.75v4.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217v-4.5a.25.25 0 01.126-.217z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M10 22a2 2 0 01-2-2V4a2 2 0 012-2h11a2 2 0 012 2v16a2 2 0 01-2 2H10zm-.5-2a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V4a.5.5 0 00-.5-.5H10a.5.5 0 00-.5.5v16zM6.17 4.165a.75.75 0 01-.335 1.006c-.228.114-.295.177-.315.201a.037.037 0 00-.008.016.387.387 0 00-.012.112v13c0 .07.008.102.012.112a.03.03 0 00.008.016c.02.024.087.087.315.201a.75.75 0 11-.67 1.342c-.272-.136-.58-.315-.81-.598C4.1 19.259 4 18.893 4 18.5v-13c0-.393.1-.759.355-1.073.23-.283.538-.462.81-.598a.75.75 0 011.006.336zM2.15 5.624a.75.75 0 01-.274 1.025c-.15.087-.257.17-.32.245C1.5 6.96 1.5 6.99 1.5 7v10c0 .01 0 .04.056.106.063.074.17.158.32.245a.75.75 0 11-.752 1.298C.73 18.421 0 17.907 0 17V7c0-.907.73-1.42 1.124-1.65a.75.75 0 011.025.274z"></path>'
          }
        }
      })));
    }
    function XIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>'
          },
          24: {
            width: 24,
            path: '<path fill-rule="evenodd" d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"></path>'
          }
        }
      })));
    }
    function XCircleIcon(props) {
      return dom_chef.createElement("svg", getSvgProps(_extends({}, props, {
        svgDataByHeight: {
          16: {
            width: 16,
            path: '<path fill-rule="evenodd" d="M3.404 12.596a6.5 6.5 0 119.192-9.192 6.5 6.5 0 01-9.192 9.192zM2.344 2.343a8 8 0 1011.313 11.314A8 8 0 002.343 2.343zM6.03 4.97a.75.75 0 00-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 101.06 1.06L8 9.06l1.97 1.97a.75.75 0 101.06-1.06L9.06 8l1.97-1.97a.75.75 0 10-1.06-1.06L8 6.94 6.03 4.97z"></path>'
          },
          24: {
            width: 24,
            path: '<path d="M9.036 7.976a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path>'
          }
        }
      })));
    }
    AlertIcon.defaultProps = {
      className: "octicon octicon-alert",
      size: 16,
      verticalAlign: "text-bottom"
    }, ArrowDownIcon.defaultProps = {
      className: "octicon octicon-arrow-down",
      size: 16,
      verticalAlign: "text-bottom"
    }, ArrowLeftIcon.defaultProps = {
      className: "octicon octicon-arrow-left",
      size: 16,
      verticalAlign: "text-bottom"
    }, ArrowUpIcon.defaultProps = {
      className: "octicon octicon-arrow-up",
      size: 16,
      verticalAlign: "text-bottom"
    }, BookIcon.defaultProps = {
      className: "octicon octicon-book",
      size: 16,
      verticalAlign: "text-bottom"
    }, BugIcon.defaultProps = {
      className: "octicon octicon-bug",
      size: 16,
      verticalAlign: "text-bottom"
    }, CheckIcon.defaultProps = {
      className: "octicon octicon-check",
      size: 16,
      verticalAlign: "text-bottom"
    }, CheckCircleIcon.defaultProps = {
      className: "octicon octicon-check-circle",
      size: 16,
      verticalAlign: "text-bottom"
    }, CheckCircleFillIcon.defaultProps = {
      className: "octicon octicon-check-circle-fill",
      size: 16,
      verticalAlign: "text-bottom"
    }, ChevronLeftIcon.defaultProps = {
      className: "octicon octicon-chevron-left",
      size: 16,
      verticalAlign: "text-bottom"
    }, ClockIcon.defaultProps = {
      className: "octicon octicon-clock",
      size: 16,
      verticalAlign: "text-bottom"
    }, CodeIcon.defaultProps = {
      className: "octicon octicon-code",
      size: 16,
      verticalAlign: "text-bottom"
    }, CodeSquareIcon.defaultProps = {
      className: "octicon octicon-code-square",
      size: 16,
      verticalAlign: "text-bottom"
    }, CommentIcon.defaultProps = {
      className: "octicon octicon-comment",
      size: 16,
      verticalAlign: "text-bottom"
    }, CopyIcon.defaultProps = {
      className: "octicon octicon-copy",
      size: 16,
      verticalAlign: "text-bottom"
    }, DiffIcon.defaultProps = {
      className: "octicon octicon-diff",
      size: 16,
      verticalAlign: "text-bottom"
    }, DiffModifiedIcon.defaultProps = {
      className: "octicon octicon-diff-modified",
      size: 16,
      verticalAlign: "text-bottom"
    }, DotIcon.defaultProps = {
      className: "octicon octicon-dot",
      size: 16,
      verticalAlign: "text-bottom"
    }, DotFillIcon.defaultProps = {
      className: "octicon octicon-dot-fill",
      size: 16,
      verticalAlign: "text-bottom"
    }, DownloadIcon.defaultProps = {
      className: "octicon octicon-download",
      size: 16,
      verticalAlign: "text-bottom"
    }, EyeIcon.defaultProps = {
      className: "octicon octicon-eye",
      size: 16,
      verticalAlign: "text-bottom"
    }, EyeClosedIcon.defaultProps = {
      className: "octicon octicon-eye-closed",
      size: 16,
      verticalAlign: "text-bottom"
    }, FileDiffIcon.defaultProps = {
      className: "octicon octicon-file-diff",
      size: 16,
      verticalAlign: "text-bottom"
    }, FoldIcon.defaultProps = {
      className: "octicon octicon-fold",
      size: 16,
      verticalAlign: "text-bottom"
    }, FoldDownIcon.defaultProps = {
      className: "octicon octicon-fold-down",
      size: 16,
      verticalAlign: "text-bottom"
    }, GitBranchIcon.defaultProps = {
      className: "octicon octicon-git-branch",
      size: 16,
      verticalAlign: "text-bottom"
    }, GitCompareIcon.defaultProps = {
      className: "octicon octicon-git-compare",
      size: 16,
      verticalAlign: "text-bottom"
    }, GitMergeIcon.defaultProps = {
      className: "octicon octicon-git-merge",
      size: 16,
      verticalAlign: "text-bottom"
    }, GitPullRequestIcon.defaultProps = {
      className: "octicon octicon-git-pull-request",
      size: 16,
      verticalAlign: "text-bottom"
    }, GitPullRequestClosedIcon.defaultProps = {
      className: "octicon octicon-git-pull-request-closed",
      size: 16,
      verticalAlign: "text-bottom"
    }, GitPullRequestDraftIcon.defaultProps = {
      className: "octicon octicon-git-pull-request-draft",
      size: 16,
      verticalAlign: "text-bottom"
    }, InfoIcon.defaultProps = {
      className: "octicon octicon-info",
      size: 16,
      verticalAlign: "text-bottom"
    }, IssueOpenedIcon.defaultProps = {
      className: "octicon octicon-issue-opened",
      size: 16,
      verticalAlign: "text-bottom"
    }, LinkIcon.defaultProps = {
      className: "octicon octicon-link",
      size: 16,
      verticalAlign: "text-bottom"
    }, LinkExternalIcon.defaultProps = {
      className: "octicon octicon-link-external",
      size: 16,
      verticalAlign: "text-bottom"
    }, PencilIcon.defaultProps = {
      className: "octicon octicon-pencil",
      size: 16,
      verticalAlign: "text-bottom"
    }, PlayIcon.defaultProps = {
      className: "octicon octicon-play",
      size: 16,
      verticalAlign: "text-bottom"
    }, PlusIcon.defaultProps = {
      className: "octicon octicon-plus",
      size: 16,
      verticalAlign: "text-bottom"
    }, ReplyIcon.defaultProps = {
      className: "octicon octicon-reply",
      size: 16,
      verticalAlign: "text-bottom"
    }, RepoIcon.defaultProps = {
      className: "octicon octicon-repo",
      size: 16,
      verticalAlign: "text-bottom"
    }, RepoForkedIcon.defaultProps = {
      className: "octicon octicon-repo-forked",
      size: 16,
      verticalAlign: "text-bottom"
    }, SearchIcon.defaultProps = {
      className: "octicon octicon-search",
      size: 16,
      verticalAlign: "text-bottom"
    }, StopIcon.defaultProps = {
      className: "octicon octicon-stop",
      size: 16,
      verticalAlign: "text-bottom"
    }, TableIcon.defaultProps = {
      className: "octicon octicon-table",
      size: 16,
      verticalAlign: "text-bottom"
    }, TagIcon.defaultProps = {
      className: "octicon octicon-tag",
      size: 16,
      verticalAlign: "text-bottom"
    }, TerminalIcon.defaultProps = {
      className: "octicon octicon-terminal",
      size: 16,
      verticalAlign: "text-bottom"
    }, TrashIcon.defaultProps = {
      className: "octicon octicon-trash",
      size: 16,
      verticalAlign: "text-bottom"
    }, UnfoldIcon.defaultProps = {
      className: "octicon octicon-unfold",
      size: 16,
      verticalAlign: "text-bottom"
    }, VersionsIcon.defaultProps = {
      className: "octicon octicon-versions",
      size: 16,
      verticalAlign: "text-bottom"
    }, XIcon.defaultProps = {
      className: "octicon octicon-x",
      size: 16,
      verticalAlign: "text-bottom"
    }, XCircleIcon.defaultProps = {
      className: "octicon octicon-x-circle",
      size: 16,
      verticalAlign: "text-bottom"
    };
    function getCallerID(ancestor = 1) {
      return function(string) {
        let hash = 0;
        for (const character of string) hash = (hash << 5) - hash + character.codePointAt(0);
        return String(Math.trunc(hash));
      }((stack = new Error("Get stack").stack, line = ancestor + 1, stack.replace("Error: Get stack\n", "").split("\n").at(line) ?? function(stack, line) {
        return console.warn("The stack doesn’t have the line", {
          line,
          stack
        }), Math.random().toString(16);
      }(stack, line)));
      var stack, line;
    }
    const registerAnimation = node_modules_onetime((() => {
      document.head.append(dom_chef.createElement("style", null, "@keyframes rgh-selector-observer {}"));
    }));
    function observe(selectors, listener, {signal} = {}) {
      if (signal?.aborted) return;
      const selector = String(selectors), seenMark = "rgh-seen-" + getCallerID();
      registerAnimation();
      const rule = document.createElement("style");
      isDevelopmentVersion() && rule.setAttribute("s", selector), rule.textContent = any`
		:where(${String(selector)}):not(.${seenMark}) {
			animation: 1ms ${"rgh-selector-observer"};
		}
	`, document.body.prepend(rule), signal?.addEventListener("abort", (() => {
        rule.remove();
      })), window.addEventListener("animationstart", ((seenMark, selector, callback) => function(event) {
        const target = event.target;
        !target.classList.contains(seenMark) && target.matches(selector) && (target.classList.add(seenMark), 
        callback(target));
      })(seenMark, selector, listener), {
        signal
      });
    }
    function looseParseInt(text) {
      return text ? ("string" != typeof text && (text = text.textContent), Number(text.replace(/\D+/g, ""))) : 0;
    }
    var js_abbreviation_number_dist = __webpack_require__(324);
    function abbreviateNumber(number, digits = 1) {
      return (0, js_abbreviation_number_dist.abbreviateNumber)(number, digits, {
        padding: !1
      }).toLowerCase();
    }
    async function cleanReleases() {
      const sidebarReleases = await elementReady('.Layout-sidebar .BorderGrid-cell h2 a[href$="/releases"]', {
        waitForChildren: !1
      });
      if (!sidebarReleases) return;
      const releasesSection = sidebarReleases.closest(".BorderGrid-cell");
      select_dom.exists(".octicon-tag", releasesSection) ? (releasesSection.classList.add("border-0", "pt-md-0"), 
      sidebarReleases.closest(".BorderGrid-row").previousElementSibling.firstElementChild.classList.add("border-0", "pb-0")) : releasesSection.hidden = !0;
    }
    async function hideEmptyPackages() {
      const packagesCounter = await elementReady('.Layout-sidebar .BorderGrid-cell a[href*="/packages?"] .Counter', {
        waitForChildren: !1
      });
      packagesCounter && "0" === packagesCounter.textContent && (packagesCounter.closest(".BorderGrid-row").hidden = !0);
    }
    async function hideLanguageHeader() {
      await dom_loaded;
      const lastSidebarHeader = select_dom(".Layout-sidebar .BorderGrid-row:last-of-type h2");
      "Languages" === lastSidebarHeader?.textContent && (lastSidebarHeader.hidden = !0);
    }
    async function hideEmptyMeta() {
      await dom_loaded, canUserEditRepo() || select_dom(".Layout-sidebar .BorderGrid-cell > .text-italic")?.remove();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-repo-sidebar.tsx", {
      include: [ isRepoRoot ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        document.documentElement.classList.add("rgh-clean-repo-sidebar"), await Promise.all([ cleanReleases(), hideEmptyPackages(), hideLanguageHeader(), hideEmptyMeta() ]);
      }
    });
    let localFetch = globalThis.fetch;
    window.content?.fetch && function(fetch) {
      localFetch = fetch;
    }(window.content.fetch);
    const appendBefore = (parent, before, child) => {
      "string" == typeof parent && (parent = select_dom(parent));
      const beforeElement = select_dom(`:scope > :is(${before})`, parent);
      beforeElement ? beforeElement.before(child) : parent.append(child);
    }, wrap = (target, wrapper) => {
      target.before(wrapper), wrapper.append(target);
    }, wrapAll = (targets, wrapper) => {
      targets[0].before(wrapper), wrapper.append(...targets);
    }, isEditable = node => node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement || node instanceof HTMLElement && node.isContentEditable, highlightTab = tabElement => {
      tabElement.classList.add("selected"), tabElement.setAttribute("aria-current", "page");
    }, unhighlightTab = tabElement => {
      tabElement.classList.remove("selected"), tabElement.removeAttribute("aria-current");
    }, escapeMatcher = matcher => "string" == typeof matcher ? `"${matcher}"` : String(matcher), assertNodeContent = (node, expectation) => {
      if (!(node && node instanceof Text)) throw console.warn("TypeError", node), new TypeError(`Expected Text node, received ${String(node?.nodeName)}`);
      const content = node.textContent.trim();
      if (string = content, !("string" == typeof (matcher = expectation) ? matcher === string : matcher.test(string))) throw console.warn("Error", node.parentElement), 
      new Error(`Expected node matching ${escapeMatcher(expectation)}, found ${escapeMatcher(content)}`);
      var matcher, string;
      return node;
    }, removeTextNodeContaining = (node, expectation) => {
      assertNodeContent(node, expectation), node.remove();
    }, getCacheKey = () => `releases-count:${github_helpers_getRepo().nameWithOwner}`;
    const getReleaseCount = webext_storage_cache.function((async () => isRepoRoot() ? async function() {
      const moreReleasesCountElement = await elementReady('.Layout-sidebar .BorderGrid-cell h2 a[href$="/releases"] .Counter');
      return moreReleasesCountElement ? looseParseInt(moreReleasesCountElement) : 0;
    }() : async function() {
      const {repository} = await v4("\n\t\trepository() {\n\t\t\treleases {\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t");
      return repository.releases.totalCount;
    }()), {
      maxAge: {
        hours: 1
      },
      staleWhileRevalidate: {
        days: 3
      },
      cacheKey: getCacheKey
    });
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/releases-tab.tsx", {
      shortcuts: {
        "g r": "Go to Releases"
      },
      include: [ isRepo ],
      awaitDomReady: !1,
      init: async function(signal) {
        select_dom.exists(".rgh-releases-tab") || await async function() {
          isRepoRoot() && await webext_storage_cache.delete(getCacheKey());
          const count = await getReleaseCount();
          if (0 === count) return !1;
          const repoNavigationBar = await elementReady(".UnderlineNav-body"), releasesTab = dom_chef.createElement("li", {
            className: "d-flex"
          }, dom_chef.createElement("a", {
            href: buildRepoURL("releases"),
            className: "js-selected-navigation-item UnderlineNav-item hx_underlinenav-item no-wrap js-responsive-underlinenav-item rgh-releases-tab",
            "data-hotkey": "g r",
            "data-selected-links": "repo_releases",
            "data-tab-item": "rgh-releases-item"
          }, dom_chef.createElement(TagIcon, {
            className: "UnderlineNav-octicon d-none d-sm-inline"
          }), dom_chef.createElement("span", {
            "data-content": "Releases"
          }, "Releases"), count && dom_chef.createElement("span", {
            className: "Counter",
            title: count > 999 ? String(count) : ""
          }, abbreviateNumber(count))));
          repoNavigationBar.append(releasesTab), repoNavigationBar.replaceWith(repoNavigationBar), 
          window.dispatchEvent(new Event("resize")), appendBefore(select_dom(".js-responsive-underlinenav .dropdown-menu ul"), ".dropdown-divider", createDropdownItem("Releases", buildRepoURL("releases"), {
            "data-menu-item": "rgh-releases-item"
          }));
        }(), isReleasesOrTags() && function(signal) {
          observe(".UnderlineNav-item.selected:not(.rgh-releases-tab)", unhighlightTab, {
            signal
          }), highlightTab(select_dom(".rgh-releases-tab"));
        }(signal);
      }
    });
    const filter_altered_clicks_es_modules = function(callback, onlyPhysical) {
      return function(e) {
        if (!((e = e.originalEvent || e).which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey || !onlyPhysical && e.defaultPrevented)) return callback.call(this, e);
      };
    }, ledger = new WeakMap;
    function editLedger(wanted, baseElement, callback, setup) {
      if (!wanted && !ledger.has(baseElement)) return !1;
      const elementMap = ledger.get(baseElement) ?? new WeakMap;
      if (ledger.set(baseElement, elementMap), !wanted && !ledger.has(baseElement)) return !1;
      const setups = elementMap.get(callback) ?? new Set;
      elementMap.set(callback, setups);
      const existed = setups.has(setup);
      return wanted ? setups.add(setup) : setups.delete(setup), existed && wanted;
    }
    const delegate_it = function delegate(base, selector, type, callback, options) {
      const listenerOptions = "object" == typeof options ? options : {
        capture: options
      };
      delete listenerOptions.once;
      const {signal} = listenerOptions;
      if (signal?.aborted) return;
      if ("string" == typeof base && (base = document.querySelectorAll(base)), "function" != typeof base.addEventListener) {
        for (const element of base) delegate(element, selector, type, callback, listenerOptions);
        return;
      }
      const baseElement = base instanceof Document ? base.documentElement : base, capture = Boolean("object" == typeof options ? options.capture : options), listenerFn = event => {
        const delegateTarget = function(event, selector) {
          let target = event.target;
          if (target instanceof Text && (target = target.parentElement), target instanceof Element && event.currentTarget instanceof Element) {
            const closest = target.closest(selector);
            if (closest && event.currentTarget.contains(closest)) return closest;
          }
        }(event, selector);
        if (delegateTarget) {
          const delegateEvent = Object.assign(event, {
            delegateTarget
          });
          callback.call(baseElement, delegateEvent);
        }
      }, setup = JSON.stringify({
        selector,
        type,
        capture
      });
      editLedger(!0, baseElement, callback, setup) || baseElement.addEventListener(type, listenerFn, listenerOptions), 
      signal?.addEventListener("abort", (() => {
        editLedger(!1, baseElement, callback, setup);
      }));
    };
    function onFieldKeydown(selector, callback, signal) {
      delegate_it(document, selector, "keydown", (event => {
        const field = event.delegateTarget;
        select_dom.exists(".suggester", field.form) || event.isComposing || callback(event);
      }), {
        capture: !0,
        signal
      });
    }
    function onCommentFieldKeydown(callback, signal) {
      onFieldKeydown(".js-comment-field, #commit-description-textarea, #merge_message_field", callback, signal);
    }
    function onConversationTitleFieldKeydown(callback, signal) {
      onFieldKeydown("#issue_title, #pull_request_title", callback, signal);
    }
    const eventHandler = filter_altered_clicks_es_modules((event => {
      const field = event.delegateTarget;
      "Escape" === event.key ? function(event, targetField) {
        const cancelButton = select_dom("\n\t\tbutton.js-hide-inline-comment-form,\n\t\tbutton.js-comment-cancel-button\n\t", targetField.form);
        cancelButton ? cancelButton.click() : targetField.blur(), event.stopImmediatePropagation(), 
        event.preventDefault();
      }(event, field) : "ArrowUp" === event.key && "" === field.value && function(targetField) {
        const currentConversationContainer = targetField.closest([ ".js-inline-comments-container", "#discussion_bucket", "#all_commit_comments" ].join(",")), lastOwnComment = select_dom.all(".js-comment.current-user", currentConversationContainer).reverse().find((comment => {
          const collapsible = comment.closest("details");
          return !collapsible || collapsible.open;
        }));
        if (!lastOwnComment) return;
        const editButton = dom_chef.createElement("button", {
          hidden: !0,
          type: "button",
          className: "js-comment-edit-button"
        });
        lastOwnComment.append(editButton), editButton.click(), editButton.remove(), targetField.closest("form").querySelector("button.js-hide-inline-comment-form")?.click(), 
        requestAnimationFrame((() => {
          select_dom("textarea.js-comment-field", lastOwnComment).selectionStart = Number.MAX_SAFE_INTEGER;
        }));
      }(field);
    }));
    function safeTextInsert(text) {
      return "" === text ? document.execCommand("delete") : document.execCommand("insertText", !1, text);
    }
    function insert(field, text) {
      var document = field.ownerDocument, initialFocus = document.activeElement;
      initialFocus !== field && field.focus(), safeTextInsert(text) || function(field, text) {
        field.setRangeText(text, field.selectionStart || 0, field.selectionEnd || 0, "end"), 
        field.dispatchEvent(new InputEvent("input", {
          data: text,
          inputType: "insertText"
        }));
      }(field, text), initialFocus === document.body ? field.blur() : initialFocus instanceof HTMLElement && initialFocus !== field && initialFocus.focus();
    }
    function text_field_edit_set(field, text) {
      field.select(), insert(field, text);
    }
    function replace(field, searchValue, replacer) {
      var drift = 0;
      field.value.replace(searchValue, (function() {
        for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        var matchStart = drift + args[args.length - 2], matchLength = args[0].length;
        field.selectionStart = matchStart, field.selectionEnd = matchStart + matchLength;
        var replacement = "string" == typeof replacer ? replacer : replacer.apply(void 0, args);
        return insert(field, replacement), field.selectionStart = matchStart, drift += replacement.length - matchLength, 
        replacement;
      }));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/comment-fields-keyboard-shortcuts.tsx", {
      shortcuts: {
        "↑": "Edit your last comment",
        esc: "Unfocuses comment field"
      },
      include: [ hasRichTextEditor ],
      awaitDomReady: !1,
      init: function(signal) {
        onCommentFieldKeydown(eventHandler, signal);
      }
    });
    const formattingCharacters = [ "`", "'", '"', "[", "(", "{", "*", "_", "~", "“", "‘" ], matchingCharacters = [ "`", "'", '"', "]", ")", "}", "*", "_", "~", "”", "’" ], quoteCharacters = new Set([ "`", "'", '"' ]);
    function one_key_formatting_eventHandler(event) {
      const field = event.delegateTarget, formattingChar = event.key;
      if (!formattingCharacters.includes(formattingChar)) return;
      const [start, end] = [ field.selectionStart, field.selectionEnd ];
      if (start === end) return;
      if (quoteCharacters.has(formattingChar) && end - start == 1 && quoteCharacters.has(field.value.at(start))) return;
      event.preventDefault();
      !function(field, wrap, wrapEnd) {
        var selectionStart = field.selectionStart, selectionEnd = field.selectionEnd, selection = function(field) {
          return field.value.slice(field.selectionStart, field.selectionEnd);
        }(field);
        insert(field, wrap + selection + (null != wrapEnd ? wrapEnd : wrap)), field.selectionStart = selectionStart + wrap.length, 
        field.selectionEnd = selectionEnd + wrap.length;
      }(field, formattingChar, matchingCharacters[formattingCharacters.indexOf(formattingChar)]);
    }
    function indent_textarea_eventHandler(event) {
      if (event.defaultPrevented) return;
      const textarea = event.target;
      "Tab" !== event.key || event.metaKey || event.altKey || event.ctrlKey || (event.shiftKey ? function(element) {
        const {selectionStart, selectionEnd, value} = element, firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1, minimumSelectionEnd = function(value, currentEnd) {
          const lastLineStart = value.lastIndexOf("\n", currentEnd - 1) + 1;
          return "\t" !== value.charAt(lastLineStart) ? currentEnd : lastLineStart + 1;
        }(value, selectionEnd), newSelection = element.value.slice(firstLineStart, minimumSelectionEnd), indentedText = newSelection.replace(/(^|\n)(\t| {1,2})/g, "$1"), replacementsCount = newSelection.length - indentedText.length;
        element.setSelectionRange(firstLineStart, minimumSelectionEnd), insert(element, indentedText);
        const firstLineIndentation = /\t| {1,2}/.exec(value.slice(firstLineStart, selectionStart)), difference = firstLineIndentation ? firstLineIndentation[0].length : 0, newSelectionStart = selectionStart - difference;
        element.setSelectionRange(selectionStart - difference, Math.max(newSelectionStart, selectionEnd - replacementsCount));
      }(textarea) : function(element) {
        var _a;
        const {selectionStart, selectionEnd, value} = element, selectedText = value.slice(selectionStart, selectionEnd);
        if ((null === (_a = /\n/g.exec(selectedText)) || void 0 === _a ? void 0 : _a.length) > 0) {
          const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1, newSelection = element.value.slice(firstLineStart, selectionEnd - 1), indentedText = newSelection.replace(/^|\n/g, "$&\t"), replacementsCount = indentedText.length - newSelection.length;
          element.setSelectionRange(firstLineStart, selectionEnd - 1), insert(element, indentedText), 
          element.setSelectionRange(selectionStart + 1, selectionEnd + replacementsCount);
        } else insert(element, "\t");
      }(textarea), event.preventDefault(), event.stopImmediatePropagation());
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/one-key-formatting.tsx", {
      include: [ hasRichTextEditor, isGist, isNewFile, isEditingFile, isDeletingFile ],
      awaitDomReady: !1,
      init: function(signal) {
        onCommentFieldKeydown(one_key_formatting_eventHandler, signal), onConversationTitleFieldKeydown(one_key_formatting_eventHandler, signal), 
        function(callback, signal) {
          onFieldKeydown("#commit-summary-input", callback, signal);
        }(one_key_formatting_eventHandler, signal), delegate_it(document, 'input[name="commit_title"], input[name="gist[description]"], #saved-reply-title-field', "keydown", one_key_formatting_eventHandler, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/tab-to-indent.tsx", {
      include: [ hasRichTextEditor ],
      awaitDomReady: !1,
      init: function(signal) {
        onCommentFieldKeydown(indent_textarea_eventHandler, signal);
      }
    });
    function registerHotkey(hotkey, action) {
      const element = "string" == typeof action ? dom_chef.createElement("a", {
        hidden: !0,
        href: action,
        "data-hotkey": hotkey
      }) : dom_chef.createElement("button", {
        hidden: !0,
        type: "button",
        "data-hotkey": hotkey,
        onClick: action
      });
      return document.body.append(element), () => {
        element.remove();
      };
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-navigation-hover-highlight.tsx", {
      awaitDomReady: !1,
      init: node_modules_onetime((function() {
        document.documentElement.classList.add("rgh-no-navigation-highlight"), document.documentElement.addEventListener("navigation:keydown", (() => {
          document.documentElement.classList.remove("rgh-no-navigation-highlight");
        }), {
          once: !0
        });
      }))
    });
    const addHotkey = (button, hotkey) => {
      if (button) {
        const hotkeys = new Set(button.dataset.hotkey?.split(","));
        hotkeys.add(hotkey), button.dataset.hotkey = [ ...hotkeys ].join(",");
      }
    };
    var selection_in_new_tab_browser = __webpack_require__(412);
    function openInNewTab() {
      const selected = select_dom(".navigation-focus a.js-navigation-open[href]");
      selected && (selection_in_new_tab_browser.runtime.sendMessage({
        openUrls: [ selected.href ]
      }), selected.closest(".unread")?.classList.replace("unread", "read"));
    }
    function toggleSubMenu(hideButton, show) {
      const dropdown = hideButton.closest("details");
      select_dom("details-menu", dropdown).classList.toggle("v-hidden", show), select_dom("form.js-comment-minimize", dropdown).classList.toggle("v-hidden", !show);
    }
    function resetDropdowns(event) {
      toggleSubMenu(event.delegateTarget, !1);
    }
    function showSubmenu(event) {
      !function(hideButton) {
        if (hideButton.closest(".rgh-quick-comment-hiding-details")) return;
        const detailsElement = hideButton.closest("details");
        detailsElement.classList.add("rgh-quick-comment-hiding-details");
        const comment = hideButton.closest(".unminimized-comment"), hideCommentForm = select_dom(".js-comment-minimize", comment);
        hideCommentForm.classList.remove("d-flex");
        for (const reason of select_dom.all('[name="classifier"] option:not([value=""])', comment)) hideCommentForm.append(dom_chef.createElement("button", {
          type: "submit",
          name: "classifier",
          value: reason.value,
          className: "dropdown-item btn-link",
          role: "menuitem"
        }, reason.textContent));
        select_dom(".btn", hideCommentForm).remove(), select_dom('[name="classifier"]', hideCommentForm).remove(), 
        hideCommentForm.addEventListener("click", (() => {
          detailsElement.removeAttribute("open");
        })), hideCommentForm.classList.add("dropdown-menu", "dropdown-menu-sw", "color-fg-default", "show-more-popover", "anim-scale-in"), 
        detailsElement.append(hideCommentForm);
      }(event.delegateTarget), toggleSubMenu(event.delegateTarget, !0), event.stopImmediatePropagation(), 
      event.preventDefault();
    }
    function addQuickEditButton(commentForm) {
      const commentBody = commentForm.closest(".js-comment");
      select_dom.exists(".rgh-quick-comment-edit-button", commentBody) || commentBody.querySelector(".timeline-comment-actions details.position-relative").before(dom_chef.createElement("button", {
        type: "button",
        role: "menuitem",
        className: "timeline-comment-action btn-link js-comment-edit-button rgh-quick-comment-edit-button" + (isDiscussion() ? " js-discussions-comment-edit-button" : ""),
        "aria-label": "Edit comment"
      }, dom_chef.createElement(PencilIcon, null)));
    }
    function canEditEveryComment() {
      return select_dom.exists([ ".lock-toggle-link > .octicon-lock", '[aria-label^="You have been invited to collaborate"]', '[aria-label^="You are the owner"]', '[title^="You are a maintainer"]', '[title^="You are a collaborator"]' ]) || canUserEditRepo();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/selection-in-new-tab.tsx", {
      include: [ () => select_dom.exists(".js-navigation-open") ],
      shortcuts: {
        "shift o": "Open selection in new tab"
      },
      init: node_modules_onetime((function() {
        registerHotkey("O", openInNewTab);
      }))
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-comment-hiding.tsx", {
      include: [ hasComments ],
      init: function(signal) {
        delegate_it(document, ".js-comment-hide-button", "click", showSubmenu, {
          capture: !0,
          signal
        }), delegate_it(document, ".rgh-quick-comment-hiding-details", "toggle", resetDropdowns, {
          capture: !0,
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-comment-edit.tsx", {
      include: [ hasComments, isDiscussion ],
      exclude: [ isArchivedRepo ],
      init: function(signal) {
        observe((canEditEveryComment() ? "" : ".current-user") + ".js-comment.unminimized-comment .js-comment-update", addQuickEditButton, {
          signal
        });
      }
    });
    var open_tabs_browser = __webpack_require__(412);
    async function openTabs(urls) {
      return !(urls.length >= 10 && !confirm(`This will open ${urls.length} new tabs. Continue?`)) && (await open_tabs_browser.runtime.sendMessage({
        openUrls: urls
      }), !0);
    }
    const {toString: assert_error_toString} = Object.prototype;
    function assertError(value) {
      if (!(value instanceof Error || "[object Error]" === assert_error_toString.call(value))) throw new TypeError(`Expected an \`Error\`, got \`${JSON.stringify(value)}\` (${typeof value})`);
    }
    function ToastSpinner() {
      return dom_chef.createElement("svg", {
        className: "Toast--spinner",
        viewBox: "0 0 32 32",
        width: "18",
        height: "18"
      }, dom_chef.createElement("path", {
        fill: "#959da5",
        d: "M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"
      }), dom_chef.createElement("path", {
        fill: "#ffffff",
        d: "M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z"
      }));
    }
    async function showToast(task, {message = "Bulk actions currently being processed.", doneMessage = "Bulk action processing complete."} = {}) {
      const iconWrapper = dom_chef.createElement("span", {
        className: "Toast-icon"
      }, dom_chef.createElement(ToastSpinner, null)), messageWrapper = dom_chef.createElement("span", {
        className: "Toast-content"
      }, message), toast = dom_chef.createElement("div", {
        role: "log",
        style: {
          zIndex: 101
        },
        className: "rgh-toast position-fixed bottom-0 right-0 ml-5 mb-5 anim-fade-in fast Toast Toast--loading"
      }, iconWrapper, messageWrapper), updateToast = message2 => {
        messageWrapper.textContent = message2;
      };
      document.body.append(toast), await delay_default()(30);
      try {
        if (task instanceof Error) throw task;
        "function" == typeof task ? await task(updateToast) : await task, toast.classList.replace("Toast--loading", "Toast--success"), 
        updateToast(doneMessage), iconWrapper.firstChild.replaceWith(dom_chef.createElement(CheckIcon, null));
      } catch (error) {
        throw assertError(error), toast.classList.replace("Toast--loading", "Toast--error"), 
        updateToast(error.message), iconWrapper.firstChild.replaceWith(dom_chef.createElement(StopIcon, null)), 
        error;
      } finally {
        requestAnimationFrame((() => {
          setTimeout((() => {
            toast.remove();
          }), 3e3);
        }));
      }
    }
    const openUnread = feature_manager.getIdentifiers("open-notifications-button"), openSelected = feature_manager.getIdentifiers("open-selected-button");
    function getUnreadNotifications(container = document) {
      return select_dom.all(".notification-unread", container);
    }
    async function openNotifications(notifications, markAsDone = !1) {
      const urls = [];
      for (const notification of notifications) urls.push(notification.querySelector("a").href);
      const openingTabs = openTabs(urls);
      if (await showToast(openingTabs, {
        message: "Opening tabs…",
        doneMessage: pluralize(urls.length, "$$ tab") + " opened"
      }), await openingTabs) for (const notification of notifications) markAsDone ? notification.querySelector('[title="Done"]').click() : notification.classList.replace("notification-unread", "notification-read");
    }
    async function openUnreadNotifications({delegateTarget, altKey}) {
      const container = delegateTarget.closest(".js-notifications-group") ?? document;
      await openNotifications(getUnreadNotifications(container), altKey), removeOpenUnreadButtons(container);
    }
    async function openSelectedNotifications() {
      const selectedNotifications = select_dom.all(".notifications-list-item :checked").map((checkbox => checkbox.closest(".notifications-list-item")));
      await openNotifications(selectedNotifications), select_dom.exists(".notification-unread") || removeOpenUnreadButtons();
    }
    function removeOpenUnreadButtons(container = document) {
      for (const button of select_dom.all(openUnread.selector, container)) button.remove();
    }
    function addSelectedButton(selectedActionsGroup) {
      const button = dom_chef.createElement("button", {
        className: "btn btn-sm " + openSelected.class,
        type: "button"
      }, dom_chef.createElement(LinkExternalIcon, {
        className: "mr-1"
      }), "Open");
      appendBefore(selectedActionsGroup, "details", button);
    }
    function addToRepoGroup(markReadButton) {
      0 !== getUnreadNotifications(markReadButton.closest(".js-notifications-group")).length && markReadButton.before(dom_chef.createElement("button", {
        type: "button",
        className: "btn btn-sm mr-2 tooltipped tooltipped-w " + openUnread.class,
        "aria-label": "Open all unread notifications from this repo"
      }, dom_chef.createElement(LinkExternalIcon, {
        width: 16
      }), " Open unread"));
    }
    function addToMainHeader(notificationHeader) {
      0 !== getUnreadNotifications().length && notificationHeader.append(dom_chef.createElement("button", {
        className: "btn btn-sm ml-auto d-none " + openUnread.class,
        type: "button"
      }, dom_chef.createElement(LinkExternalIcon, {
        className: "mr-1"
      }), "Open all unread"));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/open-all-notifications.tsx", {
      include: [ isNotifications ],
      exclude: [ isBlank ],
      init: function(signal) {
        delegate_it(document, openSelected.selector, "click", openSelectedNotifications, {
          signal
        }), delegate_it(document, openUnread.selector, "click", openUnreadNotifications, {
          signal
        }), observe(".js-check-all-container .js-bulk-action-toasts ~ div .Box-header .js-notifications-mark-selected-actions", addSelectedButton, {
          signal
        }), observe(".js-check-all-container .js-bulk-action-toasts ~ div .Box-header", addToMainHeader, {
          signal
        }), observe(".js-grouped-notifications-mark-all-read-button", addToRepoGroup, {
          signal
        });
      }
    });
    const handler = ({key, target}) => {
      if ("y" === key && !isEditable(target)) {
        const permalink = select_dom("a.js-permalink-shortcut").href;
        navigator.clipboard.writeText(permalink + location.hash);
      }
    };
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/copy-on-y.tsx", {
      include: [ isBlame, isCompare, isRepoTree, isRepoCommitList, isSingleCommit, isSingleFile ],
      awaitDomReady: !1,
      init: function(signal) {
        window.addEventListener("keyup", handler, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/profile-hotkey.tsx", {
      shortcuts: {
        "g m": "Go to Profile"
      },
      awaitDomReady: !1,
      init: node_modules_onetime((function() {
        const profileLink = (isEnterprise() ? location.origin : "https://github.com") + "/" + github_helpers_getUsername();
        document.body.append(dom_chef.createElement("a", {
          hidden: !0,
          "data-hotkey": "g m",
          href: profileLink
        }));
      }))
    });
    const visible = new Set, observer = new IntersectionObserver((entries => {
      let lastModal;
      for (const {intersectionRatio, target: modal} of entries) intersectionRatio > 0 ? visible.add(modal) : visible.delete(modal), 
      lastModal = modal;
      0 === visible.size && (observer.disconnect(), lastModal.closest("details").open = !1);
    }));
    let lastOpen;
    const safetySwitch = new AbortController;
    function menuActivatedHandler(event) {
      const details = event.target;
      if (!details.open && lastOpen > Date.now() - 500) return safetySwitch.abort(), void console.warn(`The modal was closed too quickly. Disabling ${feature_manager.getFeatureID("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/close-out-of-view-modals.tsx")} for this session.`);
      lastOpen = Date.now();
      const modals = select_dom.all([ ":scope > details-menu", ":scope > details-dialog", ":scope > div > .dropdown-menu" ], details);
      for (const modal of modals) observer.observe(modal);
    }
    function improveShortcutHelp(dialog) {
      select_dom(".Box-body .col-5 .Box:first-child", dialog).after(dom_chef.createElement("div", {
        className: "Box Box--condensed m-4"
      }, dom_chef.createElement("div", {
        className: "Box-header"
      }, dom_chef.createElement("h2", {
        className: "Box-title"
      }, "Refined GitHub")), dom_chef.createElement("ul", null, [ ...feature_manager.shortcutMap ].map((([hotkey, description]) => dom_chef.createElement("li", {
        className: "Box-row d-flex flex-row"
      }, dom_chef.createElement("div", {
        className: "flex-auto"
      }, description), dom_chef.createElement("div", {
        className: "ml-2 no-wrap"
      }, hotkey.split(" ").map((key => dom_chef.createElement(dom_chef.Fragment, null, " ", dom_chef.createElement("kbd", null, key)))))))))));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/close-out-of-view-modals.tsx", {
      awaitDomReady: !1,
      init: node_modules_onetime((function() {
        delegate_it(document, ".details-overlay", "toggle", menuActivatedHandler, {
          capture: !0,
          signal: safetySwitch.signal
        });
      }))
    });
    const improve_shortcut_help_observer = new MutationObserver((([{target}]) => {
      target instanceof Element && !select_dom.exists(".js-details-dialog-spinner", target) && (improveShortcutHelp(target), 
      improve_shortcut_help_observer.disconnect());
    }));
    function observeShortcutModal({key, target}) {
      if ("?" !== key || isEditable(target)) return;
      const modal = select_dom("body > details:not(.js-command-palette-dialog) > details-dialog");
      modal && improve_shortcut_help_observer.observe(modal, {
        childList: !0
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/improve-shortcut-help.tsx", {
      awaitDomReady: !1,
      init: node_modules_onetime((function() {
        document.body.addEventListener("keypress", observeShortcutModal);
      }))
    });
    const groupButtons = buttons => {
      for (let button of buttons) button.matches(".btn") || (button.classList.add("BtnGroup-parent"), 
      button = button.querySelector(".btn")), button.classList.add("BtnGroup-item");
      let group = buttons[0].closest(".BtnGroup");
      return group || (group = dom_chef.createElement("div", {
        className: "BtnGroup"
      }), wrapAll(buttons, group)), group;
    };
    function isDefined(value) {
      return void 0 !== value;
    }
    function attachElement(anchor, {className = "rgh-" + getCallerID(), append, prepend, before, after, forEach, allowMissingAnchor = !1}) {
      const anchorElement = "string" == typeof anchor ? select_dom(anchor) : anchor;
      if (!anchorElement) {
        if (allowMissingAnchor) return [];
        throw new Error("Element not found");
      }
      if (select_dom.exists("." + className, anchorElement.parentElement ?? anchorElement)) return [];
      const call = (position, create) => {
        const element = create(anchorElement);
        return element.classList.add(className), "forEach" !== position && anchorElement[position](element), 
        element;
      };
      return [ append && call("append", append), prepend && call("prepend", prepend), before && call("before", before), after && call("after", after), forEach && call("forEach", forEach) ].filter(isDefined);
    }
    function attachElements(anchors, {className = "rgh-" + getCallerID(), ...options}) {
      return select_dom.all(`:is(${String(anchors)}):not(.${className})`).flatMap((anchor => attachElement(anchor, {
        ...options,
        className
      })));
    }
    function handleClick({delegateTarget: button}) {
      const file = button.closest(".Box, .js-gist-file-update-container"), content = select_dom.all(".blob-code-inner", file).map((({innerText: line}) => "\n" === line ? "" : line)).join("\n");
      button.setAttribute("value", content);
    }
    function hide(item) {
      item.hidden = !0;
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/copy-file.tsx", {
      asLongAs: [ () => select_dom.exists("table.highlight"), () => !select_dom.exists("remote-clipboard-copy") ],
      include: [ isSingleFile, isGist ],
      init: function(signal) {
        attachElements([ '.file-actions .btn[href*="/raw/"]', '[data-hotkey="b"]' ], {
          forEach(button) {
            const copyButton = dom_chef.createElement("clipboard-copy", {
              className: "btn btn-sm js-clipboard-copy tooltipped tooltipped-n BtnGroup-item rgh-copy-file",
              "aria-label": "Copy file to clipboard",
              "data-tooltip-direction": "n",
              role: "button",
              "data-copy-feedback": "Copied!"
            }, "Copy"), group = button.closest(".BtnGroup");
            return group ? group.prepend(copyButton) : groupButtons([ button, copyButton ]), 
            copyButton;
          }
        }), delegate_it(document, ".rgh-copy-file:not([value])", "click", handleClick, {
          capture: !0,
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-own-stars.tsx", {
      include: [ isDashboard ],
      awaitDomReady: !1,
      init: function(signal) {
        const own = `:has(a[href^="/${github_helpers_getUsername()}"])`;
        observe([ `#dashboard :is(.watch_started, .fork)${own}`, `#dashboard .body:has(.watch_started, .fork)${own}` ], hide, {
          signal
        });
      }
    });
    const debounce_fn = (inputFunction, options = {}) => {
      if ("function" != typeof inputFunction) throw new TypeError(`Expected the first argument to be a function, got \`${typeof inputFunction}\``);
      const {wait = 0, maxWait = Number.POSITIVE_INFINITY, before = !1, after = !0} = options;
      if (!before && !after) throw new Error("Both `before` and `after` are false, function wouldn't be called.");
      let timeout, maxTimeout, result;
      const debouncedFunction = function(...arguments_) {
        const context = this, maxLater = () => {
          maxTimeout = void 0, timeout && (clearTimeout(timeout), timeout = void 0), after && (result = inputFunction.apply(context, arguments_));
        }, shouldCallNow = before && !timeout;
        return clearTimeout(timeout), timeout = setTimeout((() => {
          timeout = void 0, maxTimeout && (clearTimeout(maxTimeout), maxTimeout = void 0), 
          after && (result = inputFunction.apply(context, arguments_));
        }), wait), maxWait > 0 && maxWait !== Number.POSITIVE_INFINITY && !maxTimeout && (maxTimeout = setTimeout(maxLater, maxWait)), 
        shouldCallNow && (result = inputFunction.apply(context, arguments_)), result;
      };
      return mimicFunction(debouncedFunction, inputFunction), debouncedFunction.cancel = () => {
        timeout && (clearTimeout(timeout), timeout = void 0), maxTimeout && (clearTimeout(maxTimeout), 
        maxTimeout = void 0);
      }, debouncedFunction;
    }, loadMore = debounce_fn((() => {
      const button = select_dom('[role="tabpanel"]:not([hidden]) button.ajax-pagination-btn');
      button.click(), button.textContent = "Loading…", button.disabled || loadMore();
    }), {
      wait: 200
    }), inView = new IntersectionObserver((([{isIntersecting}]) => {
      isIntersecting && loadMore();
    }), {
      rootMargin: "500px"
    });
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/infinite-scroll.tsx", {
      include: [ isDashboard ],
      deduplicate: "has-rgh",
      init: function(signal) {
        onAbort(signal, inView), observe(".ajax-pagination-btn", (button => {
          inView.observe(button);
        }), {
          signal
        });
        const footer = select_dom(".footer > .d-flex").cloneNode(!0);
        for (const child of footer.children) child.classList.remove("pl-lg-4", "col-xl-3");
        select_dom('[aria-label="Explore"]').append(dom_chef.createElement("div", {
          className: "footer"
        }, footer));
      }
    });
    var zip_text_nodes = __webpack_require__(768), zip_text_nodes_default = __webpack_require__.n(zip_text_nodes), shorten_repo_url = __webpack_require__(794), linkify_urls = __webpack_require__(295), linkify_urls_default = __webpack_require__.n(linkify_urls), linkify_issues = __webpack_require__(93), linkify_issues_default = __webpack_require__.n(linkify_issues);
    function getTextNodes(element) {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT), nodes = [];
      let node;
      do {
        node = walker.nextNode(), node && nodes.push(node);
      } while (node);
      return nodes;
    }
    const splittingRegex = /`` (.*?) ``|`([^`\n]+)`/g;
    function parseBackticks(description) {
      const fragment = new DocumentFragment;
      for (const [index, text] of (string = description, string.split(splittingRegex).filter((part => void 0 !== part))).entries()) index % 2 && text.length > 0 ? fragment.append(dom_chef.createElement("span", {
        className: "sr-only"
      }, "`"), dom_chef.createElement("code", {
        className: "rgh-parse-backticks"
      }, text.trim()), dom_chef.createElement("span", {
        className: "sr-only"
      }, "`")) : text.length > 0 && fragment.append(text);
      var string;
      return fragment;
    }
    const codeElementsSelector = [ ".blob-code-inner", ":not(.notranslate) > .notranslate" ].join(",");
    function shortenLink(link) {
      link.closest(`${codeElementsSelector}, .comment-body`)?.classList.contains("comment-body") && (0, 
      shorten_repo_url.applyToLink)(link, location.href);
    }
    function linkifyIssues(currentRepo, element, options = {}) {
      const linkified = linkify_issues_default()(element.textContent, {
        user: currentRepo.owner ?? "/",
        repository: currentRepo.name ?? "/",
        type: "dom",
        baseUrl: "",
        ...options,
        attributes: {
          class: "rgh-linkified-code",
          ...options.attributes
        }
      });
      if (0 !== linkified.children.length) {
        for (const link of linkified.children) {
          const issue = link.href.split("/").pop();
          link.setAttribute("class", "issue-link js-issue-link"), link.dataset.errorText = "Failed to load title", 
          link.dataset.permissionText = "Title is private", link.dataset.url = link.href, 
          link.dataset.id = `rgh-issue-${issue}`, link.dataset.hovercardType = "issue", link.dataset.hovercardUrl = `${link.pathname}/hovercard`;
        }
        zip_text_nodes_default()(element, linkified);
      }
    }
    function dom_formatters_parseBackticks(element) {
      for (const node of getTextNodes(element)) {
        const fragment = parseBackticks(node.textContent);
        fragment.children.length > 0 && node.replaceWith(fragment);
      }
    }
    function linkifyContent(wrapper) {
      const errors = function(element) {
        if (element.textContent.length < 15) return;
        if (select_dom.exists(".rgh-linkified-code", element)) return select_dom.all(".rgh-linkified-code", element);
        const linkified = linkify_urls_default()(element.textContent, {
          type: "dom",
          attributes: {
            rel: "noreferrer noopener",
            class: "rgh-linkified-code"
          }
        });
        0 !== linkified.children.length && zip_text_nodes_default()(element, linkified);
      }(wrapper);
      errors && (feature_manager.log.error("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-code.tsx", "Links already exist"), 
      console.log(errors));
      const currentRepo = github_helpers_getRepo() ?? {};
      for (const element of select_dom.all(".pl-c", wrapper)) linkifyIssues(currentRepo, element);
      wrapper.classList.add("rgh-linkified-code");
    }
    function getDropdownItem(downloadUrl) {
      return dom_chef.createElement("a", {
        className: "dropdown-item rgh-download-folder",
        href: downloadUrl.href
      }, "Download directory");
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/shorten-links.tsx", {
      init: node_modules_onetime((function() {
        observe(".comment-body a[href]:not(.rgh-linkified-code)", shortenLink);
      }))
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-code.tsx", {
      include: [ hasCode ],
      exclude: [ isGist ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(codeElementsSelector, linkifyContent, {
          signal
        });
      }
    }, {
      include: [ isPR, isIssue, isDiscussion ],
      awaitDomReady: !1,
      init: function(signal) {
        const currentRepo = github_helpers_getRepo() ?? {};
        observe(".js-issue-title", (title => {
          select_dom.exists("a", title) || linkifyIssues(currentRepo, title);
        }), {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/download-folder-button.tsx", {
      include: [ isRepoTree ],
      exclude: [ isRepoRoot ],
      deduplicate: ".rgh-download-folder",
      init: function() {
        const downloadUrl = new URL("https://download-directory.github.io/");
        downloadUrl.searchParams.set("url", location.href);
        const deleteButtons = select_dom.all(`form[action^="/${github_helpers_getRepo().nameWithOwner}/tree/delete"]`);
        if (deleteButtons.length > 0) for (const deleteButton of deleteButtons) deleteButton.before(getDropdownItem(downloadUrl)); else select_dom('a.dropdown-item[data-hotkey="t"]').after(getDropdownItem(downloadUrl)), 
        select_dom('a.btn[data-hotkey="t"]').after(dom_chef.createElement("a", {
          className: "btn d-none d-md-block tooltipped tooltipped-ne rgh-download-folder",
          "aria-label": "Download directory",
          href: downloadUrl.href
        }, dom_chef.createElement(DownloadIcon, null)));
      }
    });
    const hovercardObserver = new MutationObserver((([mutation]) => {
      const hovercard = mutation.target.querySelector('[data-hydro-view*="pull-request-hovercard-hover"] ~ .d-flex.mt-2');
      if (!hovercard) return;
      const {href} = hovercard.querySelector("a.Link--primary");
      for (const reference of hovercard.querySelectorAll(".commit-ref")) {
        const url = new GitHubURL(href).assign({
          route: "tree",
          branch: reference.title
        }), user = reference.querySelector(".user");
        user && (url.user = user.textContent), reference.replaceChildren(dom_chef.createElement("a", {
          className: "no-underline",
          href: url.href,
          "data-turbo-frame": "repo-content-turbo-frame"
        }, [ ...reference.childNodes ]));
      }
    }));
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-branch-references.tsx", {
      include: [ isQuickPR, isEditingFile, isDeletingFile ],
      deduplicate: "has-rgh",
      init: async function() {
        const element = await elementReady(isQuickPR() ? ".branch-name" : ".commit-form .branch-name");
        if (!element) return !1;
        const branchUrl = buildRepoURL("tree", element.textContent);
        element.replaceWith(dom_chef.createElement("span", {
          className: "commit-ref"
        }, dom_chef.createElement("a", {
          className: "no-underline",
          href: branchUrl,
          "data-turbo-frame": "repo-content-turbo-frame"
        }, element.textContent)));
      }
    }, {
      deduplicate: "has-rgh",
      init: function() {
        const hovercardContainer = select_dom(".js-hovercard-content > .Popover-message");
        if (hovercardContainer) return hovercardObserver.observe(hovercardContainer, {
          childList: !0
        }), hovercardObserver;
      }
    });
    const issueListSelector = isGlobalIssueOrPRList() ? "#js-issues-toolbar div" : 'div[aria-label="Issues"][role="group"]';
    function onButtonClick(event) {
      const onlySelected = event.delegateTarget.closest(".table-list-triage");
      openTabs(select_dom.all(`${issueListSelector} .js-issue-row`).filter((issue => !onlySelected || select_dom.exists(":checked", issue))).map((issue => function(issue) {
        return issue.closest(".js-issue-row").querySelector("a.js-navigation-open").href;
      }(issue))));
    }
    async function open_all_conversations_init(signal) {
      if (!await elementReady(".js-issue-row + .js-issue-row", {
        waitForChildren: !1
      })) return !1;
      attachElements(".table-list-header-toggle:not(.states)", {
        prepend: anchor => dom_chef.createElement("button", {
          type: "button",
          className: "btn-link rgh-open-all-conversations px-2"
        }, anchor.closest(".table-list-triage") ? "Open selected" : "Open all")
      }), delegate_it(document, "button.rgh-open-all-conversations", "click", onButtonClick, {
        signal
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/open-all-conversations.tsx", {
      include: [ isIssueOrPRList ],
      exclude: [ isGlobalIssueOrPRList ],
      awaitDomReady: !1,
      init: open_all_conversations_init
    }, {
      include: [ isGlobalIssueOrPRList ],
      awaitDomReady: !1,
      init: open_all_conversations_init
    });
    const previous = [ 'a[rel="prev"]', ".paginate-container a.BtnGroup-item:first-child", ".prh-commit a.BtnGroup-item:first-child" ], next = previous.join(",").replaceAll('"prev"', '"next"').replaceAll(":first", ":last");
    function addConversationLinks(repositoryLink) {
      const repository = repositoryLink.closest("li");
      select_dom('[href*="issues?q=label%3A%22help+wanted"]', repository)?.remove(), assertNodeContent(select_dom("relative-time", repository).previousSibling, "Updated").before(dom_chef.createElement("a", {
        className: "Link--muted mr-3",
        href: repositoryLink.href + "/issues"
      }, dom_chef.createElement(IssueOpenedIcon, null)), dom_chef.createElement("a", {
        className: "Link--muted mr-3",
        href: repositoryLink.href + "/pulls"
      }, dom_chef.createElement(GitPullRequestIcon, null)));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pagination-hotkey.tsx", {
      shortcuts: {
        "→": "Go to the next page",
        "←": "Go to the previous page"
      },
      include: [ isIssueOrPRList, isGlobalSearchResults, (url = location) => "labels" === getRepo(url)?.path, isNotifications, isRepoCommitList, isPRCommit, (url = location) => "discussions" === getRepo(url)?.path, isReleases, isUserProfileRepoTab ],
      init: function(signal) {
        observe(previous, (button => {
          addHotkey(button, "ArrowLeft");
        }), {
          signal
        }), observe(next, (button => {
          addHotkey(button, "ArrowRight");
        }), {
          signal
        });
      }
    });
    const selectors = [ 'a[itemprop="name codeRepository"]', ".repo-list-item .f4 a" ];
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/conversation-links-on-repo-lists.tsx", {
      include: [ isUserProfileRepoTab, () => isGlobalSearchResults() && "repositories" === new URLSearchParams(location.search).get("type") ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(selectors, addConversationLinks, {
          signal
        });
      }
    });
    const queryPartsRegExp = /(?:[^\s"]+|"[^"]*")+/g, labelLinkRegex = /^(?:\/[^/]+){2}\/labels\/([^/]+)\/?$/;
    function splitQueryString(query) {
      return query.match(queryPartsRegExp) ?? [];
    }
    class SearchQuery {
      static escapeValue(value) {
        return value.includes(" ") ? `"${value}"` : value;
      }
      static from(source) {
        if (source instanceof Location || source instanceof HTMLAnchorElement) return new SearchQuery(source.href);
        const url = new URL("https://github.com");
        for (const [name, value] of Object.entries(source)) url.searchParams.set(name, value);
        return new SearchQuery(url);
      }
      constructor(url, base) {
        this.url = new URL(url, base), this.queryParts = [];
        const currentQuery = this.url.searchParams.get("q");
        if ("string" == typeof currentQuery) return void (this.queryParts = splitQueryString(currentQuery));
        const labelName = labelLinkRegex.exec(this.url.pathname)?.[1];
        labelName ? this.queryParts = [ "is:open", "label:" + SearchQuery.escapeValue(decodeURIComponent(labelName)) ] : (this.queryParts.push(/\/pulls\/?$/.test(this.url.pathname) ? "is:pr" : "is:issue", "is:open"), 
        "/issues" !== this.url.pathname && "/pulls" !== this.url.pathname || (this.url.searchParams.has("user") ? this.queryParts.push("user:" + this.url.searchParams.get("user")) : this.queryParts.push("author:@me"), 
        this.queryParts.push("archived:false")));
      }
      getQueryParts() {
        return function(array, ...keywords) {
          const deduplicated = [];
          let wasKeywordFound = !1;
          for (const current of [ ...array ].reverse()) {
            const isKeyword = keywords.includes(current);
            isKeyword && wasKeywordFound || (deduplicated.unshift(current), wasKeywordFound = wasKeywordFound || isKeyword);
          }
          return deduplicated;
        }(this.queryParts, "is:issue", "is:pr");
      }
      get() {
        return this.getQueryParts().join(" ");
      }
      set(query) {
        return this.queryParts = splitQueryString(query), this;
      }
      get searchParams() {
        return this.url.searchParams;
      }
      get href() {
        return this.url.searchParams.set("q", this.get()), labelLinkRegex.test(this.url.pathname) && (this.url.pathname = this.url.pathname.replace(/\/labels\/.+$/, "/issues")), 
        this.url.href;
      }
      edit(callback) {
        return this.queryParts = callback(this.getQueryParts()), this;
      }
      replace(searchValue, replaceValue) {
        return this.set(this.get().replace(searchValue, replaceValue)), this;
      }
      remove(...queryPartsToRemove) {
        return this.queryParts = this.getQueryParts().filter((queryPart => !queryPartsToRemove.includes(queryPart))), 
        this;
      }
      add(...queryPartsToAdd) {
        return this.queryParts.push(...queryPartsToAdd), this;
      }
      includes(...searchStrings) {
        return this.getQueryParts().some((queryPart => searchStrings.includes(queryPart)));
      }
    }
    function addLinks(container) {
      const isIssues = location.pathname.startsWith("/issues"), typeQuery = isIssues ? "is:issue" : "is:pr", typeName = isIssues ? "Issues" : "Pull Requests", links = [ [ "Involved", `${typeName} you’re involved in`, "involves:@me" ], [ "Yours", `${typeName} on your repos`, "user:@me" ] ];
      for (const [label, title, query] of links) {
        const url = new URL(isIssues ? "/issues" : "/pulls", location.origin);
        url.searchParams.set("q", `${typeQuery} is:open archived:false ${query}`);
        const link = dom_chef.createElement("a", {
          href: url.href,
          title,
          className: "subnav-item"
        }, label);
        if (SearchQuery.from(location).includes(query) && !select_dom.exists(".subnav-links .selected")) {
          link.classList.add("selected");
          for (const otherLink of select_dom.all(".subnav-links a")) otherLink.href = SearchQuery.from(otherLink).remove(query).href;
        }
        container.append(link);
      }
    }
    function saveOriginalHref(link) {
      link.dataset.originalHref || (link.dataset.originalHref = link.href);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/global-conversation-list-filters.tsx", {
      include: [ isGlobalIssueOrPRList ],
      init: function(signal) {
        observe(".subnav-links", addLinks, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/more-conversation-filters.tsx", {
      include: [ isRepoIssueOrPRList ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const sourceItem = select_dom("#filters-select-menu a:nth-last-child(2)"), commentsLink = sourceItem.cloneNode(!0);
        commentsLink.lastChild.textContent = "Everything you’re involved in", commentsLink.removeAttribute("target"), 
        commentsLink.href = SearchQuery.from(commentsLink).set("is:open involves:@me").href, 
        commentsLink.setAttribute("aria-checked", String(commentsLink.href === location.href)), 
        sourceItem.after(commentsLink);
        const subscriptionsLink = commentsLink.cloneNode(!0);
        subscriptionsLink.lastChild.textContent = "Everything you subscribed to", subscriptionsLink.setAttribute("aria-checked", "false");
        const subscriptionsUrl = new URL("https://github.com/notifications/subscriptions"), repositoryId = select_dom('input[name="repository_id"]').value;
        subscriptionsUrl.searchParams.set("repository", btoa(`010:Repository${repositoryId}`)), 
        subscriptionsLink.href = subscriptionsUrl.href, commentsLink.after(subscriptionsLink);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/sort-conversations-by-update-time.tsx", {
      deduplicate: "has-rgh-inner",
      init: function() {
        const issueLinks = select_dom.all('a:is([href*="/issues"], [href*="/pulls"], [href*="/projects"], [href*="/labels/"]):not([href*="sort%3A"], .issues-reset-query)');
        for (const link of issueLinks) if (link.host === location.host && !link.closest(".pagination, .table-list-header-toggle")) {
          if (isIssueOrPRList(link)) {
            saveOriginalHref(link);
            const newUrl = SearchQuery.from(link).add("sort:updated-desc").href, isRelativeAttribute = link.getAttribute("href").startsWith("/");
            link.href = isRelativeAttribute ? newUrl.replace(location.origin, "") : newUrl;
          }
          if (isProjects()) {
            saveOriginalHref(link);
            const search = new URLSearchParams(link.search), query = search.get("query") ?? "is:open";
            search.set("query", `${query} sort:updated-desc`), link.search = search.toString();
          }
        }
      }
    }, {
      include: [ isRepoIssueOrPRList ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const currentSearchURL = location.href.replace("/pulls?", "/issues?"), currentFilter = select_dom(`#filters-select-menu a.SelectMenu-item[href="${currentSearchURL}"]`);
        currentFilter && (select_dom('#filters-select-menu [aria-checked="true"]')?.setAttribute("aria-checked", "false"), 
        currentFilter.setAttribute("aria-checked", "true"));
      }
    });
    const getLastUpdated = webext_storage_cache.function((async issueNumbers => {
      const {repository} = await v4(`\n\t\trepository() {\n\t\t\t${issueNumbers.map((number => `\n\t\t\t\t${escapeKey(number)}: issue(number: ${number}) {\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t`)).join("\n")}\n\t\t}\n\t`);
      return repository;
    }), {
      maxAge: {
        minutes: 30
      },
      cacheKey: ([issues]) => `pinned-issues:${github_helpers_getRepo().nameWithOwner}:${String(issues)}`
    });
    function getPinnedIssueNumber(pinnedIssue) {
      return looseParseInt(select_dom(".opened-by", pinnedIssue).firstChild);
    }
    async function addAfterBranchSelector(button) {
      button.classList.add("ml-2");
      const branchSelector = await elementReady("#branch-select-menu", {
        waitForChildren: !1
      }), branchSelectorWrapper = branchSelector.closest(".position-relative"), breadcrumb = select_dom(".breadcrumb");
      breadcrumb ? (branchSelectorWrapper.append(button), branchSelector.classList.contains("rgh-wrapper-added") || (breadcrumb.classList.add("flex-shrink-0"), 
      breadcrumb.classList.remove("mt-3"), branchSelector.classList.add("rgh-wrapper-added"), 
      branchSelectorWrapper.classList.add("d-flex", "flex-shrink-0"), wrapAll([ branchSelectorWrapper, breadcrumb ], dom_chef.createElement("div", {
        className: "d-flex flex-wrap flex-1 mr-2",
        style: {
          rowGap: "16px"
        }
      })))) : branchSelectorWrapper.after(button);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pinned-issues-update-time.tsx", {
      include: [ isRepoIssueList ],
      deduplicate: "has-rgh-inner",
      init: async function() {
        const pinnedIssues = select_dom.all(".pinned-issue-item");
        if (0 === pinnedIssues.length) return !1;
        const lastUpdated = await getLastUpdated(pinnedIssues.map((issue => getPinnedIssueNumber(issue))));
        for (const pinnedIssue of pinnedIssues) {
          const issueNumber = getPinnedIssueNumber(pinnedIssue), {updatedAt} = lastUpdated[escapeKey(issueNumber)];
          select_dom(".pinned-item-desc", pinnedIssue).append(" • ", dom_chef.createElement("span", {
            className: "color-fg-muted d-inline-block"
          }, "updated ", dom_chef.createElement("relative-time", {
            datetime: updatedAt
          })));
        }
      }
    });
    const undeterminableAheadBy = Number.MAX_SAFE_INTEGER, getRepoPublishState = webext_storage_cache.function((async () => {
      const {repository} = await v4('\n\t\trepository() {\n\t\t\trefs(first: 20, refPrefix: "refs/tags/", orderBy: {\n\t\t\t\tfield: TAG_COMMIT_DATE,\n\t\t\t\tdirection: DESC\n\t\t\t}) {\n\t\t\t\tnodes {\n\t\t\t\t\tname\n\t\t\t\t\ttag: target {\n\t\t\t\t\t\toid\n\t\t\t\t\t\t... on Tag {\n\t\t\t\t\t\t\tcommit: target {\n\t\t\t\t\t\t\t\toid\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tdefaultBranchRef {\n\t\t\t\ttarget {\n\t\t\t\t\t... on Commit {\n\t\t\t\t\t\thistory(first: 20) {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\toid\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t');
      if (0 === repository.refs.nodes.length) return {
        latestTag: !1,
        aheadBy: 0
      };
      const tags = new Map;
      for (const node of repository.refs.nodes) tags.set(node.name, node.tag.commit?.oid ?? node.tag.oid);
      const latestTag = function(tags) {
        if (!tags.every((tag => validVersion.test(tag)))) return tags[0];
        let releases = tags.filter((tag => !isPrerelease.test(tag)));
        0 === releases.length && (releases = tags);
        let latestVersion = releases[0];
        for (const release of releases) compareVersions(latestVersion, release) < 0 && (latestVersion = release);
        return latestVersion;
      }([ ...tags.keys() ]), latestTagOid = tags.get(latestTag), aheadBy = repository.defaultBranchRef.target.history.nodes.findIndex((node => node.oid === latestTagOid));
      return {
        latestTag,
        aheadBy: -1 === aheadBy ? undeterminableAheadBy : aheadBy
      };
    }), {
      maxAge: {
        hours: 1
      },
      staleWhileRevalidate: {
        days: 2
      },
      cacheKey: () => "tag-ahead-by:" + github_helpers_getRepo().nameWithOwner
    });
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/latest-tag-button.tsx", {
      include: [ isRepoTree, isSingleFile ],
      awaitDomReady: !1,
      deduplicate: ".rgh-latest-tag-button",
      init: async function() {
        const {latestTag, aheadBy} = await getRepoPublishState();
        if (!latestTag) return !1;
        const url = new GitHubURL(location.href);
        url.assign({
          route: url.route || "tree",
          branch: latestTag
        });
        const link = dom_chef.createElement("a", {
          className: "btn btn-sm ml-0 flex-self-center css-truncate rgh-latest-tag-button",
          "data-turbo-frame": "repo-content-turbo-frame",
          href: url.href
        }, dom_chef.createElement(TagIcon, {
          className: "v-align-middle"
        }));
        await addAfterBranchSelector(link);
        const currentBranch = getCurrentCommittish();
        currentBranch !== latestTag && link.append(" ", dom_chef.createElement("span", {
          className: "css-truncate-target v-align-middle"
        }, latestTag));
        const defaultBranch = await getDefaultBranch(), onDefaultBranch = !currentBranch || currentBranch === defaultBranch, isAhead = aheadBy > 0;
        if (currentBranch === latestTag || onDefaultBranch && !isAhead) return link.setAttribute("aria-label", "You’re on the latest version"), 
        void link.classList.add("disabled", "tooltipped", "tooltipped-ne");
        if (isRepoHome() || onDefaultBranch) {
          if (aheadBy !== undeterminableAheadBy && link.append(dom_chef.createElement("sup", null, " +", aheadBy)), 
          link.setAttribute("aria-label", isAhead ? `${defaultBranch} is ${aheadBy === undeterminableAheadBy ? "more than 20 commits" : pluralize(aheadBy, "1 commit", "$$ commits")} ahead of the latest version` : `The HEAD of ${defaultBranch} isn’t tagged`), 
          isRepoRoot()) {
            const compareLink = dom_chef.createElement("a", {
              className: "btn btn-sm tooltipped tooltipped-ne",
              href: buildRepoURL(`compare/${latestTag}...${defaultBranch}`),
              "data-turbo-frame": "repo-content-turbo-frame",
              "aria-label": `Compare ${latestTag}...${defaultBranch}`
            }, dom_chef.createElement(GitCompareIcon, {
              className: "v-align-middle"
            }));
            groupButtons([ link, compareLink ]).classList.add("d-flex");
          }
        } else link.setAttribute("aria-label", "Visit the latest version");
        link.classList.add("tooltipped", "tooltipped-ne");
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/default-branch-button.tsx", {
      include: [ isRepoTree, isSingleFile, isRepoCommitList ],
      exclude: [ isRepoHome ],
      awaitDomReady: !1,
      deduplicate: ".rgh-default-branch-button",
      init: async function() {
        const defaultBranch = await getDefaultBranch(), branchSelector = await elementReady('[data-hotkey="w"]');
        if (!branchSelector) return !1;
        if (defaultBranch === getCurrentCommittish()) return !1;
        const url = new GitHubURL(location.href);
        isRepoRoot() ? (url.route = "", url.branch = "") : url.branch = defaultBranch;
        const defaultLink = dom_chef.createElement("a", {
          className: "btn tooltipped tooltipped-ne rgh-default-branch-button",
          href: url.href,
          "data-turbo-frame": "repo-content-turbo-frame",
          "aria-label": "See this view on the default branch"
        }, dom_chef.createElement(ChevronLeftIcon, null));
        branchSelector.parentElement.before(defaultLink), branchSelector.parentElement.style.zIndex = "auto", 
        groupButtons([ defaultLink, branchSelector.parentElement ]).classList.add("d-flex");
      }
    });
    const diffSwitchButtons = feature_manager.getIdentifiers("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/one-click-diff-options.tsx");
    function alternateDiffNatively(event) {
      const type = new URLSearchParams(event.delegateTarget.search).get("diff"), formField = select_dom(`input#diff_${type}`);
      formField && (formField.checked = !0, formField.form.submit(), event.preventDefault());
    }
    function makeLink(type, icon, selected) {
      const url = new URL(location.href);
      url.searchParams.set("diff", type);
      const classes = isPR() ? "ml-2 color-fg-muted" : "btn btn-sm BtnGroup-item " + (selected ? "selected" : "");
      return dom_chef.createElement("a", {
        className: `tooltipped tooltipped-s ${classes} ${diffSwitchButtons.class}`,
        "aria-label": `Switch to the ${type} diff view`,
        href: url.href
      }, icon);
    }
    function isHidingWhitespace() {
      return "1" === new URL(location.href).searchParams.get("w") || select_dom.exists('button[name="w"][value="0"]:not([hidden])');
    }
    function createWhitespaceButton() {
      const url = new URL(location.href);
      isHidingWhitespace() ? url.searchParams.delete("w") : url.searchParams.set("w", "1");
      const classes = isPR() ? "tooltipped tooltipped-s color-fg-muted" : "tooltipped tooltipped-s btn btn-sm tooltipped " + (isHidingWhitespace() ? "color-fg-subtle" : "");
      return dom_chef.createElement("a", {
        href: url.href,
        "data-hotkey": "d w",
        className: classes,
        "aria-label": (isHidingWhitespace() ? "Show" : "Hide") + " whitespace changes"
      }, isPR() ? dom_chef.createElement(DiffModifiedIcon, {
        className: "v-align-middle"
      }) : dom_chef.createElement(dom_chef.Fragment, null, isHidingWhitespace() && dom_chef.createElement(CheckIcon, null), " No Whitespace"));
    }
    function attachPRButtons(diffSettings) {
      const originalToggle = diffSettings.closest("details").parentElement, classes = "diffbar-item d-flex hide-sm hide-md";
      isHidingWhitespace() || originalToggle.after(dom_chef.createElement("div", {
        className: classes
      }, createWhitespaceButton())), originalToggle.after(dom_chef.createElement("div", {
        className: classes
      }, function() {
        const isUnified = select_dom.exists([ '[value="unified"][checked]', '.table-of-contents .selected[href*="diff=unified"]' ]);
        return isPR() ? isUnified ? makeLink("split", dom_chef.createElement(BookIcon, {
          className: "v-align-middle"
        }), !1) : makeLink("unified", dom_chef.createElement(DiffIcon, {
          className: "v-align-middle"
        }), !1) : dom_chef.createElement(dom_chef.Fragment, null, makeLink("unified", dom_chef.createElement(DiffIcon, null), isUnified), makeLink("split", dom_chef.createElement(BookIcon, null), !isUnified));
      }())), originalToggle.remove();
      const prTitle = select_dom(".pr-toolbar .js-issue-title");
      prTitle && select_dom.exists(".pr-toolbar progress-bar") && (prTitle.style.maxWidth = "24em", 
      prTitle.title = prTitle.textContent), removeTextNodeContaining(select_dom('[data-hotkey="c"] strong').previousSibling, "Changes from"), 
      select_dom(".subset-files-tab")?.classList.replace("px-sm-3", "ml-sm-2");
    }
    function attachButtons(nativeDiffButtons) {
      const anchor = nativeDiffButtons.parentElement, usesFloats = anchor?.classList.contains("float-right");
      attachElement(anchor, usesFloats ? {
        after: () => dom_chef.createElement("div", {
          className: "float-right mr-3"
        }, createWhitespaceButton())
      } : {
        before: createWhitespaceButton
      });
    }
    const shortcuts = {
      "d w": "Show/hide whitespaces in diffs"
    };
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/one-click-diff-options.tsx", {
      shortcuts,
      include: [ isPRFiles, isPRCommit ],
      exclude: [ isPRFile404, isEnterprise ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('.hide-sm.hide-md [aria-label="Diff settings"]', attachPRButtons, {
          signal
        }), delegate_it(document, diffSwitchButtons.selector, "click", alternateDiffNatively, {
          signal
        });
      }
    }, {
      shortcuts,
      include: [ isSingleCommit, isCompare ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('[action="/users/diffview"]', attachButtons, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/ci-link.tsx", {
      include: [ isRepo ],
      exclude: [ isEmptyRepo ],
      awaitDomReady: !1,
      init: async function() {
        const head = await async function() {
          const {repository} = await v4("\n\t\trepository() {\n\t\t\tdefaultBranchRef {\n\t\t\t\ttarget {\n\t\t\t\t\toid\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t");
          return repository.defaultBranchRef.target.oid;
        }();
        attachElement((await elementReady('[itemprop="name"]')).parentElement, {
          append: () => function(commit) {
            const endpoint = buildRepoURL("commits/checks-statuses-rollups");
            return dom_chef.createElement("span", {
              className: "rgh-ci-link"
            }, dom_chef.createElement("batch-deferred-content", {
              hidden: !0,
              "data-url": endpoint
            }, dom_chef.createElement("input", {
              name: "oid",
              value: commit,
              "data-targets": "batch-deferred-content.inputs"
            })));
          }(head)
        });
      }
    });
    const isHasSelectorSupported = globalThis.CSS?.supports("selector(:has(a))"), hasSelectorRegex = /:has\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/;
    function selectHas(selectors, baseElement = document) {
      const count = [ ...String(selectors).matchAll(/has\(/g) ].length;
      if (1 !== count) throw new Error(`Only one \`:has()\` required/allowed, found ${count}`);
      const parts = String(selectors).split(hasSelectorRegex), [baseSelector, hasSelector, finalSelector] = parts;
      if ([ "", "*" ].includes(baseSelector.trim())) throw new Error("* is super inefficient in :has()");
      if (/\s$/.test(baseSelector)) throw new Error("No spaces before :has() supported");
      if (/^[+~]/.test(hasSelector.trim())) throw new Error("This polyfill only supports looking into the children of the base element");
      for (const base of baseElement.querySelectorAll(baseSelector)) if (base.querySelector(":scope " + hasSelector)) {
        if (!finalSelector.trim()) return base;
        const finalElement = base.querySelector(finalSelector);
        if (finalElement) return finalElement;
      }
    }
    const noticeClass = "rgh-files-hidden-notice", noticeStyle = {
      paddingRight: "19px"
    };
    function toggle(toggle2) {
      return document.body.classList.toggle("rgh-files-hidden", toggle2);
    }
    async function toggleHandler() {
      select_dom(`.${noticeClass}`)?.remove();
      const isHidden = toggle();
      await webext_storage_cache.set("files-hidden", isHidden);
    }
    async function updateView(anchor) {
      const filesBox = anchor.parentElement;
      !function(filesBox) {
        attachElement(selectHas("ul:has(.octicon-history)", filesBox), {
          allowMissingAnchor: !0,
          className: "rgh-toggle-files",
          append: () => dom_chef.createElement("button", {
            type: "button",
            className: "btn-octicon",
            "aria-label": "Toggle files section"
          }, dom_chef.createElement(FoldIcon, null), dom_chef.createElement(UnfoldIcon, null))
        });
      }(filesBox), await webext_storage_cache.get("files-hidden") && (toggle(!0), attachElement(filesBox, {
        className: noticeClass,
        after: () => dom_chef.createElement("div", {
          className: "mb-3 mt-n3 py-1 text-right text-small color-fg-subtle",
          style: noticeStyle
        }, "The file list was collapsed via Refined GitHub ", dom_chef.createElement(ArrowUpIcon, {
          className: "v-align-middle"
        }))
      }));
    }
    function escape_string_regexp_escapeStringRegexp(string) {
      if ("string" != typeof string) throw new TypeError("Expected a string");
      return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/toggle-files-button.tsx", {
      include: [ isRepoTree ],
      awaitDomReady: !1,
      init: async function(signal) {
        observe(".Box h2#files", updateView, {
          signal
        }), delegate_it(document, `.rgh-toggle-files, .${noticeClass}`, "click", toggleHandler, {
          signal
        });
      }
    });
    const delegateHandler = mem((callback => event => {
      event.delegateTarget.matches(".open") && callback(event);
    }));
    function onPrMergePanelOpen(callback, signal) {
      delegate_it(document, ".js-merge-pr:not(.is-rebasing)", "details:toggled", delegateHandler(callback), {
        signal
      });
    }
    const fieldSelector = [ "#commit-summary-input", "#merge_title_field" ].join(", ");
    function onCommitTitleUpdate(callback, signal) {
      delegate_it(document, fieldSelector, "change", callback, {
        signal
      }), delegate_it(document, fieldSelector, "input", callback, {
        signal
      });
    }
    const prTitleFieldSelector = '.js-issue-update input[name="issue[title]"]';
    function getCommitTitleField() {
      return select_dom(".is-squashing form:not([hidden]) input#merge_title_field");
    }
    function createCommitTitle() {
      return `${select_dom(prTitleFieldSelector).value.trim()} (#${getConversationNumber()})`;
    }
    function needsSubmission() {
      const inputField = getCommitTitleField();
      return !(!inputField || "" === inputField.value) && (select_dom.exists(prTitleFieldSelector + ',.js-issue-update button[type="submit"]') ? createCommitTitle() !== inputField.value : (feature_manager.log.error("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/sync-pr-commit-title.tsx", "Can’t update the PR title"), 
      !1));
    }
    function getUI() {
      return select_dom(".is-squashing form:not([hidden]) .rgh-sync-pr-commit-title-note") ?? dom_chef.createElement("p", {
        className: "note rgh-sync-pr-commit-title-note"
      }, "The title of this PR will be updated to match this title. ", dom_chef.createElement("button", {
        type: "button",
        className: "btn-link Link--muted text-underline rgh-sync-pr-commit-title"
      }, "Cancel"));
    }
    function updateUI() {
      needsSubmission() ? getCommitTitleField().after(getUI()) : getUI().remove();
    }
    function updatePRTitle() {
      if (!needsSubmission()) return;
      const prTitle = getCommitTitleField().value.replace(function(...expressions) {
        const flags = [], source = [];
        for (const part of expressions) part instanceof RegExp ? (source.push(part.source), 
        flags.push(...part.flags)) : source.push(escape_string_regexp_escapeStringRegexp(part));
        return new RegExp(source.join(""), [ ...new Set(flags) ].join(""));
      }(/\s*\(/, "#" + getConversationNumber(), /\)$/), "");
      select_dom(prTitleFieldSelector).value = prTitle, select_dom('.js-issue-update button[type="submit"]').click();
    }
    async function updateCommitTitle() {
      const field = getCommitTitleField();
      field && text_field_edit_set(field, createCommitTitle());
    }
    function disableSubmission() {
      feature_manager.unload("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/sync-pr-commit-title.tsx"), 
      getUI().remove();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/sync-pr-commit-title.tsx", {
      include: [ isPRConversation ],
      awaitDomReady: !1,
      init: function(signal) {
        onPrMergePanelOpen(updateCommitTitle, signal), onCommitTitleUpdate(updateUI, signal), 
        delegate_it(document, "form.js-merge-pull-request", "submit", updatePRTitle, {
          signal
        }), delegate_it(document, ".rgh-sync-pr-commit-title", "click", disableSubmission, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/open-ci-details-in-new-tab.tsx", {
      include: [ isPR ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const CIDetailsLinks = select_dom.all("a.status-actions");
        for (const link of CIDetailsLinks) link.setAttribute("target", "_blank"), link.setAttribute("rel", "noopener");
      }
    });
    var retry = __webpack_require__(22);
    const networkErrorMsgs = new Set([ "Failed to fetch", "NetworkError when attempting to fetch resource.", "The Internet connection appears to be offline.", "Network request failed" ]);
    class AbortError extends Error {
      constructor(message) {
        super(), message instanceof Error ? (this.originalError = message, ({message} = message)) : (this.originalError = new Error(message), 
        this.originalError.stack = this.stack), this.name = "AbortError", this.message = message;
      }
    }
    const getDOMException = errorMessage => void 0 === globalThis.DOMException ? new Error(errorMessage) : new DOMException(errorMessage);
    async function pRetry(input, options) {
      return new Promise(((resolve, reject) => {
        options = {
          onFailedAttempt() {},
          retries: 10,
          ...options
        };
        const operation = retry.operation(options);
        operation.attempt((async attemptNumber => {
          try {
            resolve(await input(attemptNumber));
          } catch (error) {
            if (!(error instanceof Error)) return void reject(new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`));
            if (error instanceof AbortError) operation.stop(), reject(error.originalError); else if (error instanceof TypeError && (errorMessage = error.message, 
            !networkErrorMsgs.has(errorMessage))) operation.stop(), reject(error); else {
              ((error, attemptNumber, options) => {
                const retriesLeft = options.retries - (attemptNumber - 1);
                error.attemptNumber = attemptNumber, error.retriesLeft = retriesLeft;
              })(error, attemptNumber, options);
              try {
                await options.onFailedAttempt(error);
              } catch (error) {
                return void reject(error);
              }
              operation.retry(error) || reject(operation.mainError());
            }
          }
          var errorMessage;
        })), options.signal && !options.signal.aborted && options.signal.addEventListener("abort", (() => {
          operation.stop();
          const reason = void 0 === options.signal.reason ? getDOMException("The operation was aborted.") : options.signal.reason;
          reject(reason instanceof Error ? reason : getDOMException(reason));
        }), {
          once: !0
        });
      }));
    }
    const SUCCESS = Symbol("Success"), FAILURE = Symbol("Failure"), PENDING = Symbol("Pending"), commitSelector = '[data-test-selector="pr-timeline-commits-list"] .TimelineItem';
    function getLastCommitReference() {
      return select_dom.last(`${commitSelector} code`).textContent ?? void 0;
    }
    const getDeduplicatedHandler = mem((callback => event => {
      event.delegateTarget.addEventListener("load", callback);
    }));
    function createFragmentLoadListener(fragmentSelector, callback, signal) {
      delegate_it(document, fragmentSelector, "loadstart", getDeduplicatedHandler(callback), {
        capture: !0,
        signal
      });
    }
    [ "include-fragment.diff-progressive-loader", "include-fragment.js-diff-entry-loader", "#files_bucket:not(.pull-request-tab-content) include-fragment" ].join(",");
    const generateCheckbox = node_modules_onetime((() => dom_chef.createElement("label", {
      className: "v-align-text-top"
    }, dom_chef.createElement("input", {
      checked: !0,
      type: "checkbox",
      name: "rgh-pr-check-waiter"
    }), " Wait for successful checks ", dom_chef.createElement("a", {
      className: "tooltipped tooltipped-n ml-1",
      target: "_blank",
      rel: "noopener noreferrer",
      href: "https://github.com/refined-github/refined-github/pull/975",
      "aria-label": "This only works if you keep this tab open in the background while waiting."
    }, dom_chef.createElement(InfoIcon, null)))));
    function getCheckbox() {
      return select_dom('input[name="rgh-pr-check-waiter"]');
    }
    function showCheckboxIfNecessary() {
      const checkbox = getCheckbox(), lastCommitStatus = function() {
        const lastCommitStatusIcon = select_dom.last(commitSelector).querySelector("details.commit-build-statuses summary .octicon");
        if (lastCommitStatusIcon) {
          if (lastCommitStatusIcon.classList.contains("octicon-check")) return SUCCESS;
          if (lastCommitStatusIcon.classList.contains("octicon-x")) return FAILURE;
          if (lastCommitStatusIcon.classList.contains("octicon-dot-fill")) return PENDING;
        }
        return !1;
      }(), isNecessary = lastCommitStatus === PENDING || !1 === lastCommitStatus && select_dom.exists("details.commit-build-statuses summary .octicon");
      !checkbox && isNecessary ? select_dom(".js-merge-form .select-menu")?.append(generateCheckbox()) : checkbox && !isNecessary && checkbox.parentElement.remove();
    }
    let waiting, commitObserver;
    function disableForm(disabled = !0) {
      for (const field of select_dom.all('\n\t\ttextarea[name="commit_message"],\n\t\tinput[name="commit_title"],\n\t\tinput[name="rgh-pr-check-waiter"],\n\t\tbutton.js-merge-commit-button\n\t')) field.disabled = disabled;
      disabled || (waiting = void 0);
    }
    async function handleMergeConfirmation(event) {
      if (!getCheckbox()?.checked) return;
      const lastCommitSha = getLastCommitReference()?.trim();
      if (!lastCommitSha) return;
      event.preventDefault(), disableForm();
      const currentConfirmation = Symbol("");
      let result;
      waiting = currentConfirmation;
      try {
        result = await pRetry((async () => {
          const status = await async function(commitSha) {
            const {repository} = await v4(`\n\t\trepository() {\n\t\t\tobject(expression: "${commitSha}") {\n\t\t\t\t... on Commit {\n\t\t\t\t\tcheckSuites(first: 100) {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\tcheckRuns { totalCount }\n\t\t\t\t\t\t\tstatus\n\t\t\t\t\t\t\tconclusion\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t# Cache buster: ${Date.now()}\n\t`);
            if (0 === repository.object.checkSuites.nodes) return !1;
            for (const {checkRuns, status, conclusion} of repository.object.checkSuites.nodes) if (0 !== checkRuns.totalCount) {
              if ("COMPLETED" !== status) return PENDING;
              if ("SUCCESS" !== conclusion && "NEUTRAL" !== conclusion && "SKIPPED" !== conclusion) return FAILURE;
            }
            return SUCCESS;
          }(lastCommitSha);
          if (waiting !== currentConfirmation) throw new AbortError("The merge was cancelled or a new commit was pushed");
          if (status === PENDING) throw new Error("CI is not done yet");
          return status;
        }), {
          forever: !0,
          minTimeout: 5e3,
          maxTimeout: 1e4
        });
      } catch {
        return;
      } finally {
        disableForm(!1);
      }
      result === SUCCESS && (event.delegateTarget.classList.add("rgh-merging"), event.delegateTarget.click());
    }
    function watchForNewCommits() {
      if (commitObserver) return;
      let previousCommit = getLastCommitReference();
      commitObserver = function(element, listener, options = {
        childList: !0
      }) {
        "string" == typeof element && (element = document.querySelector(element));
        const observer = new MutationObserver(listener);
        return observer.observe(element, options), listener.call(observer, [], observer), 
        observer;
      }(".js-discussion", (() => {
        const newCommit = getLastCommitReference();
        newCommit !== previousCommit && (previousCommit = newCommit, disableForm(!1), showCheckboxIfNecessary());
      }), {
        childList: !0,
        subtree: !0
      });
    }
    function onPrMergePanelHandler() {
      select_dom.exists('input.js-admin-merge-override[type="checkbox"]') || (showCheckboxIfNecessary(), 
      watchForNewCommits());
    }
    function onBeforeunload(event) {
      waiting && (event.returnValue = "");
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/wait-for-checks.tsx", {
      asLongAs: [ isOpenPR, () => select_dom.exists("#actions-tab"), () => select_dom.exists(".discussion-sidebar-item .octicon-lock") ],
      include: [ isPRConversation ],
      exclude: [ isDraftPR ],
      init: function(signal) {
        window.addEventListener("beforeunload", onBeforeunload, {
          signal
        }), function(callback, signal) {
          createFragmentLoadListener('.discussion-timeline-actions include-fragment[src$="/merging"]', callback, signal);
        }(onPrMergePanelHandler, signal), onPrMergePanelOpen(onPrMergePanelHandler, signal), 
        delegate_it(document, ".js-merge-commit-button:not(.rgh-merging)", "click", handleMergeConfirmation, {
          signal
        }), delegate_it(document, ".commit-form-actions button:not(.js-merge-commit-button)", "click", (() => {
          disableForm(!1);
        }), {
          signal
        }), commitObserver && onAbort(signal, commitObserver);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-inactive-deployments.tsx", {
      include: [ isPRConversation ],
      init: function() {
        const deployments = select_dom.all('.js-socket-channel[data-url*="/partials/deployed_event/"]');
        deployments.pop();
        for (const deployment of deployments) select_dom.exists('[title="Deployment Status Label: Inactive"]', deployment) && deployment.remove();
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pull-request-hotkeys.tsx", {
      shortcuts: {
        "g 1": "Go to Conversation",
        "g 2": "Go to Commits",
        "g 3": "Go to Checks",
        "g 4": "Go to Files changed",
        "g →": "Go to next PR tab",
        "g ←": "Go to previous PR tab"
      },
      include: [ isPR ],
      init: function() {
        const tabs = select_dom.all("#partial-discussion-header + .tabnav a.tabnav-tab"), lastTab = tabs.length - 1, selectedIndex = tabs.findIndex((tab => tab.classList.contains("selected")));
        for (const [index, tab] of tabs.entries()) addHotkey(tab, `g ${index + 1}`), index === selectedIndex - 1 || 0 === selectedIndex && index === lastTab ? addHotkey(tab, "g ArrowLeft") : (index === selectedIndex + 1 || selectedIndex === lastTab && 0 === index) && addHotkey(tab, "g ArrowRight");
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/one-click-review-submission.tsx", {
      include: [ isPR ],
      init: function(signal) {
        delegate_it(document, '[action$="/reviews"]', "submit", (event => {
          setTimeout((() => {
            for (const control of select_dom.all("button, textarea", event.delegateTarget)) control.disabled = !0;
          }));
        }), {
          signal
        }), delegate_it(document, '[action$="/reviews"] button', "click", (({delegateTarget: {value, form}}) => {
          const submissionRequiresComment = 0 === looseParseInt(select_dom(".js-reviews-toggle .js-pending-review-comment-count")) && ("reject" === value || "comment" === value);
          select_dom("#pull_request_review_body", form).toggleAttribute("required", submissionRequiresComment);
        }), {
          signal
        });
        const radios = select_dom.all('input[type="radio"][name="pull_request_review[event]"]');
        if (0 === radios.length) return !1;
        !function(radios) {
          const form = radios[0].form, container = select_dom(".form-actions", form);
          radios.length > 1 && container.append(dom_chef.createElement("input", {
            type: "hidden",
            name: "pull_request_review[event]",
            value: "comment"
          })), radios.length > 1 && radios.push(radios.shift());
          for (const radio of radios) {
            const tooltip = radio.parentElement.getAttribute("aria-label"), classes = [ "btn btn-sm" ];
            "comment" === radio.value && classes.push("btn-primary"), tooltip && classes.push("tooltipped tooltipped-nw tooltipped-no-delay");
            const button = dom_chef.createElement("button", {
              type: "submit",
              name: "pull_request_review[event]",
              value: radio.value,
              className: classes.join(" "),
              "aria-label": tooltip,
              disabled: radio.disabled
            }, radio.nextSibling);
            radio.disabled || "approve" !== radio.value ? radio.disabled || "reject" !== radio.value || button.prepend(dom_chef.createElement(FileDiffIcon, {
              className: "color-fg-danger"
            })) : button.prepend(dom_chef.createElement(CheckIcon, {
              className: "color-fg-success"
            })), container.append(button);
          }
          for (const radio of radios) radio.closest(".form-checkbox").remove();
          select_dom('[type="submit"]:not([name])', form).remove();
        }(radios);
      }
    });
    const doma = html => {
      if (null == html) return new DocumentFragment;
      const template = document.createElement("template");
      return template.innerHTML = html, template.content;
    };
    doma.one = html => {
      var _a;
      return null !== (_a = doma(html).firstElementChild) && void 0 !== _a ? _a : void 0;
    };
    const node_modules_doma = doma;
    var embed_gist_inline_browser = __webpack_require__(412);
    const fetchGist = mem((async url => embed_gist_inline_browser.runtime.sendMessage({
      fetchJSON: `${url}.json`
    })));
    function embed_gist_inline_isGist(link) {
      return 1 === function(link) {
        return "gist.github.com" === link.host ? github_helpers_getCleanPathname(link) : link.host === location.host && link.pathname.startsWith("gist/") ? link.pathname.replace("/gist", "").replace(/\/$/, "") : void 0;
      }(link)?.replace(/[^/]/g, "").length;
    }
    async function addNotice(message, {type = "notice", action = dom_chef.createElement("button", {
      className: "flash-close js-flash-close",
      type: "button",
      "aria-label": "Dismiss this message"
    }, dom_chef.createElement(XIcon, null))} = {}) {
      (await elementReady("#js-flash-container")).append(dom_chef.createElement("div", {
        className: `flash flash-full flash-${type} px-4`
      }, action, dom_chef.createElement("div", null, message)));
    }
    function listener({key, target}) {
      "Escape" === key && /^#L|^#diff-[\da-f]+R\d+/.test(location.hash) && !isEditable(target) && (location.hash = "#no-line", 
      history.replaceState(void 0, document.title, location.pathname));
    }
    function addQuickSubmit() {
      select_dom([ "input#commit-summary-input", 'textarea[aria-label="Describe this release"]' ]).classList.add("js-quick-submit");
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/embed-gist-inline.tsx", {
      include: [ hasComments ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(".js-comment-body p a:only-child", (link => {
          embed_gist_inline_isGist(link) && (link => link.textContent.trim() === link.parentNode.textContent.trim())(link) && async function(link) {
            const info = dom_chef.createElement("em", null, " (loading)");
            link.after(info);
            try {
              const gistData = await fetchGist(link.href);
              if (gistData.div.length > 1e4) return void (info.textContent = " (too large to embed)");
              const fileCount = gistData.files.length;
              if (fileCount > 1) info.textContent = ` (${fileCount} files)`; else {
                const container = dom_chef.createElement("div", null);
                container.attachShadow({
                  mode: "open"
                }).append(dom_chef.createElement("style", null, "\n\t\t\t\t\t.gist .gist-data {\n\t\t\t\t\t\tmax-height: 16em;\n\t\t\t\t\t\toverflow-y: auto;\n\t\t\t\t\t}\n\t\t\t\t"), dom_chef.createElement("link", {
                  rel: "stylesheet",
                  href: gistData.stylesheet
                }), node_modules_doma.one(gistData.div)), link.parentElement.after(container), info.remove();
              }
            } catch {
              info.remove();
            }
          }(link);
        }), {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/comments-time-machine-links.tsx", {
      include: [ hasComments ],
      exclude: [ isGist ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(".timeline-comment-actions > details:last-child", (menu => {
          if (menu.closest(".js-pending-review-comment")) return;
          const timestamp = menu.closest('.js-comment:not([id^="pullrequestreview-"]), .js-timeline-item').querySelector("relative-time").attributes.datetime.value;
          !function(menu, timestamp) {
            const comment = menu.closest(".js-comment"), links = select_dom.all(`\n\t\ta[href^="${location.origin}"][href*="/blob/"]:not(.rgh-linkified-code),\n\t\ta[href^="${location.origin}"][href*="/tree/"]:not(.rgh-linkified-code)\n\t`, comment);
            for (const link of links) {
              const linkParts = link.pathname.split("/");
              if (/^[\da-f]{40}$/.test(linkParts[4])) continue;
              saveOriginalHref(link);
              const searchParameters = new URLSearchParams(link.search);
              searchParameters.set("rgh-link-date", timestamp), link.search = String(searchParameters);
            }
          }(menu, timestamp), function(menu, timestamp) {
            select_dom(".show-more-popover", menu.parentElement).append(dom_chef.createElement("div", {
              className: "dropdown-divider"
            }), dom_chef.createElement("a", {
              href: buildRepoURL(`tree/HEAD@{${timestamp}}`),
              className: "dropdown-item btn-link rgh-linkified-code",
              role: "menuitem",
              title: "Browse repository like it appeared on this day"
            }, "View repo at this time"));
          }(menu, timestamp);
        }), {
          signal
        });
      }
    }, {
      asLongAs: [ () => new URLSearchParams(location.search).has("rgh-link-date") ],
      include: [ is404, isSingleFile, isRepoTree ],
      awaitDomReady: !1,
      init: async function() {
        const url = new URL(location.href), date = url.searchParams.get("rgh-link-date");
        if (url.searchParams.delete("rgh-link-date"), history.replaceState(history.state, document.title, url.href), 
        is404()) {
          const pathnameParts = url.pathname.split("/");
          pathnameParts[4] = `HEAD@{${date}}`, url.pathname = pathnameParts.join("/");
        } else {
          if (await isPermalink()) return !1;
          const lastCommitDate = await elementReady(".Box-header relative-time", {
            waitForChildren: !1
          });
          if (lastCommitDate && date > lastCommitDate.getAttribute("datetime")) return !1;
          const parsedUrl = new GitHubURL(location.href);
          !async function(url, date) {
            const {repository} = await v4(`\n\t\trepository() {\n\t\t\tref(qualifiedName: "${url.branch}") {\n\t\t\t\ttarget {\n\t\t\t\t\t... on Commit {\n\t\t\t\t\t\thistory(first: 1, until: "${date}") {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\toid\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`), [{oid}] = repository.ref.target.history.nodes;
            select_dom("a.rgh-link-date").pathname = url.assign({
              branch: oid
            }).pathname;
          }(parsedUrl, date), parsedUrl.branch = `${parsedUrl.branch}@{${date}}`, url.pathname = parsedUrl.pathname;
        }
        const link = dom_chef.createElement("a", {
          className: "rgh-link-date",
          href: url.href,
          "data-turbo-frame": "repo-content-turbo-frame"
        }, "view this object as it appeared at the time of the comment");
        await addNotice(dom_chef.createElement(dom_chef.Fragment, null, "You can also ", link, " (", dom_chef.createElement("relative-time", {
          datetime: date
        }), ")"));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-issue-list-autocomplete.tsx", {
      include: [ isIssueOrPRList ],
      exclude: [ isMilestone ],
      deduplicate: "has-rgh-inner",
      init: function() {
        select_dom(".subnav-search").setAttribute("autocomplete", "off");
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/esc-to-deselect-line.tsx", {
      include: [ hasCode ],
      awaitDomReady: !1,
      init: function(signal) {
        document.body.addEventListener("keyup", listener, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/submission-via-ctrl-enter-everywhere.tsx", {
      include: [ isNewFile, isEditingFile, isNewRelease, isEditingRelease ],
      exclude: [ isBlank ],
      init: addQuickSubmit
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/create-release-shortcut.tsx", {
      shortcuts: {
        c: "Create a new release",
        "ctrl enter": "Publish a release"
      },
      include: [ isReleasesOrTags ],
      init: function() {
        addHotkey(select_dom('a[href$="/releases/new"]'), "c");
      }
    }, {
      include: [ isNewRelease, isEditingRelease ],
      init: addQuickSubmit
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/patch-diff-links.tsx", {
      include: [ isCommit ],
      exclude: [ isPRCommit404 ],
      deduplicate: "has-rgh-inner",
      init: function() {
        let commitUrl = "/" + github_helpers_getCleanPathname();
        isPRCommit() && (commitUrl = commitUrl.replace(/\/pull\/\d+\/commits/, "/commit"));
        const commitMeta = select_dom(".commit-meta");
        commitMeta.classList.remove("no-wrap"), commitMeta.lastElementChild.append(dom_chef.createElement("span", {
          className: "sha-block",
          "data-turbo": "false"
        }, dom_chef.createElement("a", {
          href: `${commitUrl}.patch`,
          className: "sha"
        }, "patch"), " ", dom_chef.createElement("a", {
          href: `${commitUrl}.diff`,
          className: "sha"
        }, "diff")));
      }
    });
    const parse_backticks_selectors = [ ".BorderGrid--spacious .f4.my-3", ".js-commits-list-item pre", ".js-commit-group .pr-1 code", ".js-commit-group pre", ".release-header", ".Box-row .mb-1 a", "#pull-requests a.Link--primary", '[id^="check_suite"] a.Link--primary', '.js-socket-channel[data-url*="/header_partial"] h3', ".js-wiki-sidebar-toggle-display a", "#wiki-wrapper .gh-header-title", ".issues_labeled .color-fg-default > a", '#user-repositories-list [itemprop="description"]', ".js-hovercard-content > .Popover-message .Link--primary", ".js-discussions-title-container h1 > .js-issue-title", 'a[data-hovercard-type="discussion"]' ];
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/parse-backticks.tsx", {
      awaitDomReady: !1,
      init: function() {
        observe(parse_backticks_selectors, dom_formatters_parseBackticks);
      }
    });
    const objectEntries = Object.entries;
    function getCommitHash(commit) {
      return select_dom("a.markdown-title", commit).pathname.split("/").pop();
    }
    function getUserAvatar(username, size) {
      const cleanName = username.replace("[bot]", ""), existingAvatar = select_dom(`img[alt="@${cleanName}"]`);
      if (existingAvatar) return existingAvatar.src;
      if (cleanName === username) {
        return (isEnterprise() ? `/${username}.png` : `https://avatars.githubusercontent.com/${username}`) + "?size=" + 2 * size;
      }
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/mark-merge-commits-in-list.tsx", {
      include: [ isCommitList, isPRConversation, isCompare ],
      deduplicate: "has-rgh-inner",
      init: async function() {
        const pageCommits = select_dom.all([ ".js-commits-list-item", '[data-test-selector="pr-timeline-commits-list"] .TimelineItem' ].join(",")), mergeCommits = await (async commits => {
          const {repository} = await v4(`\n\t\trepository() {\n\t\t\t${commits.map((commit => `\n\t\t\t\t${escapeKey(commit)}: object(expression: "${commit}") {\n\t\t\t\t... on Commit {\n\t\t\t\t\t\tparents {\n\t\t\t\t\t\t\ttotalCount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t`)).join("\n")}\n\t\t}\n\t`), mergeCommits = [];
          for (const [key, commit] of objectEntries(repository)) commit.parents.totalCount >= 2 && mergeCommits.push(key.slice(1));
          return mergeCommits;
        })(pageCommits.map((commit => getCommitHash(commit))));
        for (const commit of pageCommits) mergeCommits.includes(getCommitHash(commit)) && (commit.classList.add("rgh-merge-commit"), 
        select_dom("a.markdown-title", commit).before(dom_chef.createElement(GitMergeIcon, {
          className: "mr-1"
        })));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/swap-branches-on-compare.tsx", {
      include: [ isCompare ],
      exclude: [ () => 2 === /\.\.+/.exec(location.pathname)?.[0].length ],
      deduplicate: "has-rgh",
      init: function() {
        const references = github_helpers_getRepo().path.replace("compare/", "").split("...").reverse();
        1 === references.length && references.unshift(select_dom(".branch span").textContent);
        const icon = select_dom(".range-editor .octicon-arrow-left");
        icon.parentElement.attributes["aria-label"].value += ".\nClick to swap.", wrap(icon, dom_chef.createElement("a", {
          href: buildRepoURL("compare/" + references.join("...")),
          "data-turbo-frame": "repo-content-turbo-frame"
        }));
      }
    });
    const viewportObserver = new IntersectionObserver((changes => {
      for (const change of changes) change.isIntersecting && (showAvatarsOn(change.target), 
      viewportObserver.unobserve(change.target));
    }), {
      rootMargin: "500px"
    });
    function showAvatarsOn(commentReactions) {
      const avatarLimit = 36 - 3 * commentReactions.children.length, flatParticipants = function(table, limit = 1 / 0) {
        if (limit <= 0) return [];
        const maxColumns = Math.max(...table.map((row => row.length))), zipped = [];
        for (let col = 0; col < maxColumns; col++) for (const row of table) if (row.length > col && (zipped.push(row[col]), 
        zipped.length === limit)) return zipped;
        return zipped;
      }(select_dom.all(":scope > button.social-reaction-summary-item", commentReactions).map((button => function(button) {
        const users = button.nextElementSibling.textContent.replace(/ reacted with.*/, "").replace(/,? and /, ", ").replace(/, \d+ more/, "").split(", "), currentUser = github_helpers_getUsername(), participants = [];
        for (const username of users) {
          if (username === currentUser) continue;
          const imageUrl = getUserAvatar(username, 16);
          imageUrl && participants.push({
            button,
            username,
            imageUrl
          });
        }
        return participants;
      }(button))), avatarLimit);
      for (const {button, username, imageUrl} of flatParticipants) button.append(dom_chef.createElement("span", {
        className: "avatar-user avatar rgh-reactions-avatar p-0 flex-self-center"
      }, dom_chef.createElement("img", {
        src: imageUrl,
        className: "d-block",
        width: 16,
        height: 16,
        alt: `@${username}`
      })));
    }
    const reactionsSelector = ".has-reactions :is(.js-comment-reactions-options, .comment-reactions-options):not(.rgh-reactions)";
    function observeCommentReactions(commentReactions) {
      commentReactions.classList.add("rgh-reactions"), viewportObserver.observe(commentReactions);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/reactions-avatars.tsx", {
      include: [ hasComments, isReleasesOrTags ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(reactionsSelector, observeCommentReactions, {
          signal
        }), onAbort(signal, viewportObserver);
      }
    }, {
      include: [ isDiscussion ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(reactionsSelector, observeCommentReactions, {
          signal
        }), onAbort(signal, viewportObserver);
      }
    });
    const batchUpdateLinks = function(function_) {
      let queue = [];
      return value => {
        queue.push(value), 1 === queue.length && setTimeout((() => {
          function_(queue), queue = [];
        }), 100);
      };
    }((async batchedUsernameElements => {
      const usernames = new Set, myUsername = github_helpers_getUsername();
      for (const element of new Set(batchedUsernameElements)) {
        const username = element.textContent;
        username && username !== myUsername && "ghost" !== username && usernames.add(element.textContent);
        const commentedNode = element.parentNode.nextSibling;
        element.closest(".timeline-comment-header") && commentedNode && removeTextNodeContaining(commentedNode, /commented|left a comment/);
      }
      if (0 === usernames.size) return;
      const names = await v4([ ...usernames ].map((user => escapeKey(user) + `: user(login: "${user}") {name}`)).join(","));
      for (const usernameElement of batchedUsernameElements) {
        const username = usernameElement.textContent, userKey = escapeKey(username), {name} = names[userKey] ?? {};
        if (!name) continue;
        if (compareNames(username, name)) {
          usernameElement.textContent = name;
          continue;
        }
        const {parentElement} = usernameElement;
        ("STRONG" === parentElement.tagName ? parentElement : usernameElement).after(" ", dom_chef.createElement("span", {
          className: "color-fg-muted css-truncate d-inline-block"
        }, "(", dom_chef.createElement("bdo", {
          className: "css-truncate-target",
          style: {
            maxWidth: "200px"
          }
        }, name), ")"), " ");
      }
    })), usernameLinksSelector = [ ':is(.js-discussion, .inline-comments) a.author:not([href*="/apps/"], [href*="/marketplace/"], [data-hovercard-type="organization"])', '#dashboard a.text-bold[data-hovercard-type="user"]' ];
    function expandDiff(event) {
      event.target.closest(".js-expand") || select_dom(".js-expand", event.delegateTarget).click();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/show-names.tsx", {
      include: [ isDashboard, hasComments ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(usernameLinksSelector, batchUpdateLinks, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/previous-next-commit-buttons.tsx", {
      include: [ isPRFiles, isPRCommit ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const originalPreviousNext = select_dom(".commit .BtnGroup.float-right");
        if (!originalPreviousNext) return !1;
        select_dom("#files").after(dom_chef.createElement("div", {
          className: "d-flex flex-justify-end mb-3"
        }, originalPreviousNext.cloneNode(!0)));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/extend-diff-expander.tsx", {
      include: [ hasFiles ],
      init: function(signal) {
        delegate_it(document, ".diff-view .js-expandable-line", "click", expandDiff, {
          signal
        });
      }
    });
    const getGistCount = webext_storage_cache.function((async username => {
      const {user} = await v4(`\n\t\tuser(login: "${username}") {\n\t\t\tgists(first: 0) {\n\t\t\t\ttotalCount\n\t\t\t}\n\t\t}\n\t`);
      return user.gists.totalCount;
    }), {
      maxAge: {
        days: 1
      },
      staleWhileRevalidate: {
        days: 3
      },
      cacheKey: ([username]) => "gist-count:" + username
    });
    async function appendTab(navigationBar) {
      const user = function() {
        const name = github_helpers_getCleanPathname();
        return {
          url: isEnterprise() ? `/gist/${name}` : `https://gist.github.com/${name}`,
          name
        };
      }(), link = dom_chef.createElement("a", {
        href: user.url,
        className: "UnderlineNav-item js-responsive-underlinenav-item",
        role: "tab",
        "aria-selected": "false",
        "data-tab-item": "rgh-gists-item"
      }, dom_chef.createElement(CodeSquareIcon, {
        className: "UnderlineNav-octicon hide-sm"
      }), " Gists ");
      navigationBar.append(link), navigationBar.replaceWith(navigationBar), select_dom(".js-responsive-underlinenav .dropdown-menu ul").append(createDropdownItem("Gists", user.url));
      const count = await getGistCount(user.name);
      count > 0 && link.append(dom_chef.createElement("span", {
        className: "Counter"
      }, count));
    }
    function addLink(showCaseTitle) {
      const url = new URL(location.pathname, location.href);
      url.search = new URLSearchParams({
        tab: "repositories",
        sort: "stargazers"
      }).toString(), showCaseTitle.firstChild.after(" / ", dom_chef.createElement("a", {
        href: url.href
      }, "Top repositories"));
    }
    function addSourceTypeToLink(link) {
      const search = new URLSearchParams(link.search);
      search.set("type", "source"), link.search = String(search);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/profile-gists-link.tsx", {
      include: [ isUserProfile ],
      init: async function(signal) {
        observe(".Layout-main .UnderlineNav-body", appendTab, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/show-user-top-repositories.tsx", {
      include: [ () => isUserProfile() && !new URLSearchParams(location.search).has("tab") ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(".js-pinned-items-reorder-container h2", addLink, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/set-default-repositories-type-to-sources.tsx", {
      awaitDomReady: !1,
      init: function() {
        observe([ '.header-nav-current-user ~ a[href$="tab=repositories"]', '[aria-label="User profile"] a[href$="tab=repositories"]', '[aria-label="Organization"] [data-tab-item="org-header-repositories-tab"] a', 'a[data-hovercard-type="organization"]' ], addSourceTypeToLink);
      }
    });
    const doesUserFollow = webext_storage_cache.function((async (userA, userB) => {
      const {httpStatus} = await v3(`/users/${userA}/following/${userB}`, {
        json: !1,
        ignoreHTTPStatus: !0
      });
      return 204 === httpStatus;
    }), {
      cacheKey: ([userA, userB]) => `user-follows:${userA}:${userB}`
    });
    function isClosed(prLink) {
      return Boolean(prLink.closest(".js-issue-row").querySelector(".octicon.merged, .octicon.closed"));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/user-profile-follower-badge.tsx", {
      include: [ isUserProfile ],
      exclude: [ isOwnUserProfile, isPrivateUserProfile ],
      init: async function() {
        await doesUserFollow(github_helpers_getCleanPathname(), github_helpers_getUsername()) && attachElement('.js-profile-editable-area [href$="?tab=following"]', {
          after: () => dom_chef.createElement("span", {
            className: "color-fg-muted"
          }, " · Follows you")
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/highlight-non-default-base-branch.tsx", {
      include: [ isRepoIssueOrPRList ],
      deduplicate: "has-rgh-inner",
      init: async function() {
        const prLinks = select_dom.all('.js-issue-row .js-navigation-open[data-hovercard-type="pull_request"]');
        if (0 === prLinks.length) return !1;
        const query = `\n\t\trepository() {\n\t\t\t${prLinks.map((pr => pr.id)).map((id => `\n\t\t\t\t${id}: pullRequest(number: ${id.replace(/\D/g, "")}) {\n\t\t\t\t\tbaseRef {id}\n\t\t\t\t\tbaseRefName\n\t\t\t\t}\n\t\t\t`)).join("\n")}\n\t\t}\n\t`, [data, defaultBranch] = await Promise.all([ v4(query), getDefaultBranch() ]);
        for (const prLink of prLinks) {
          const pr = data.repository[prLink.id];
          if (pr.baseRefName === defaultBranch) continue;
          if ("master" === pr.baseRefName && isClosed(prLink)) continue;
          const branch = pr.baseRef && buildRepoURL(`tree/${pr.baseRefName}`);
          prLink.parentElement.querySelector(".text-small.color-fg-muted .d-none.d-md-inline-flex").append(dom_chef.createElement("span", {
            className: "issue-meta-section ml-2"
          }, dom_chef.createElement(GitPullRequestIcon, null), " To ", dom_chef.createElement("span", {
            className: "commit-ref css-truncate user-select-contain mb-n1",
            style: branch ? {} : {
              textDecoration: "line-through"
            }
          }, dom_chef.createElement("a", {
            title: branch ? pr.baseRefName : "Deleted",
            href: branch
          }, pr.baseRefName))));
        }
      }
    });
    const getPublicOrganizationsNames = webext_storage_cache.function((async username => (await v3(`/users/${username}/orgs`)).map((organization => organization.login))), {
      maxAge: {
        hours: 6
      },
      staleWhileRevalidate: {
        days: 10
      },
      cacheKey: ([username]) => "public-organizations:" + username
    });
    async function bypass(detailsLink) {
      const runId = ((url = location) => Boolean(getRepo(url)?.path.startsWith("runs/")))(detailsLink) ? detailsLink.pathname.split("/").pop() : new URLSearchParams(detailsLink.search).get("check_run_id");
      if (!runId) return;
      const {details_url: detailsUrl} = await v3(`check-runs/${runId}`);
      if (!detailsUrl) return;
      const {pathname, search: queryString} = new URL(detailsUrl);
      detailsUrl.startsWith("https://github.com/") || "/" === pathname && "" === queryString || (detailsLink.href = detailsUrl);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/mark-private-orgs.tsx", {
      include: [ isOwnUserProfile ],
      deduplicate: "has-rgh",
      init: async function() {
        const orgs = select_dom.all('a.avatar-group-item[data-hovercard-type="organization"][itemprop="follows"]');
        if (0 === orgs.length) return !1;
        const publicOrganizationsNames = await getPublicOrganizationsNames(github_helpers_getUsername());
        for (const org of orgs) publicOrganizationsNames.includes(org.pathname.replace(/^\/(organizations\/)?/, "")) || (org.classList.add("rgh-private-org"), 
        org.append(dom_chef.createElement(EyeClosedIcon, null)));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-commit-sha.tsx", {
      include: [ isPRCommit ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const element = select_dom(".sha.user-select-contain");
        element && wrap(element, dom_chef.createElement("a", {
          href: location.pathname.replace(/pull\/\d+\/commits/, "commit")
        }));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/bypass-checks.tsx", {
      include: [ isRepo ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(`\n\t\ta:not([href="/apps/github-actions"]) ~ div a.status-actions:is(\n\t\t\t[href^="${location.origin}"],\n\t\t\t[href^="/"]\n\t\t)`, bypass, {
          signal
        });
      }
    });
    const getWarning = node_modules_onetime((() => dom_chef.createElement("div", {
      className: "flash flash-error mt-3 rgh-warning-for-disallow-edits"
    }, dom_chef.createElement("strong", null, "Note:"), " Maintainers may require changes. It’s easier and faster to allow them to make direct changes before merging.")));
    function update(checkbox) {
      checkbox.checked ? getWarning().remove() : attachElement(checkbox.closest("\n\t\t\t\t.timeline-comment,\n\t\t\t\t.discussion-sidebar-item > .d-inline-flex\n\t\t\t"), {
        after: getWarning
      });
    }
    function warning_for_disallow_edits_toggleHandler(event) {
      update(event.delegateTarget);
    }
    function preview(hiddenCommentHeader) {
      const details = hiddenCommentHeader.closest("details");
      details.classList.add("rgh-preview-hidden-comments");
      const commentText = select_dom(".comment-body", details).textContent.trim();
      if (0 === commentText.length) return;
      const commentHeader = hiddenCommentHeader.textContent;
      if (/disruptive|spam/.test(commentHeader)) return;
      const reason = /duplicate|outdated|off-topic|hidden/.exec(commentHeader)?.[0];
      hiddenCommentHeader.classList.add("css-truncate", "css-truncate-overflow", "mr-2"), 
      hiddenCommentHeader.append(dom_chef.createElement("span", {
        className: "Details-content--open"
      }, hiddenCommentHeader.firstChild), dom_chef.createElement("span", {
        className: "Details-content--closed"
      }, reason && dom_chef.createElement("span", {
        className: "Label mr-2"
      }, upperCaseFirst(reason)), commentText.slice(0, 100)));
    }
    function fitTextarea(textarea) {
      const positions = new Map;
      let element = textarea;
      for (;null == element ? void 0 : element.parentElement; ) element = element.parentElement, 
      positions.set(element, element.scrollTop);
      textarea.style.height = "auto";
      const style = getComputedStyle(textarea);
      textarea.style.height = String(textarea.scrollHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)) + "px";
      for (const [element, position] of positions) position && element.scrollTop !== position && (element.scrollTop = position);
    }
    function fit_textarea_listener(event) {
      fitTextarea(event.target);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/warning-for-disallow-edits.tsx", {
      include: [ isCompare, isPRConversation ],
      init: function(signal) {
        const checkbox = select_dom('input[name="collab_privs"]');
        if (!checkbox) return !1;
        update(checkbox), delegate_it(document, 'input[name="collab_privs"]', "change", warning_for_disallow_edits_toggleHandler, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/warn-pr-from-master.tsx", {
      include: [ isCompare ],
      exclude: [ isBlank ],
      deduplicate: "has-rgh",
      init: async function() {
        let defaultBranch;
        if (select_dom.exists(".is-cross-repo")) {
          const forkedRepository = github_helpers_getRepo(select_dom('[title^="head: "]').textContent);
          defaultBranch = await getDefaultBranch(forkedRepository);
        } else defaultBranch = await getDefaultBranch();
        if (!location.pathname.endsWith(":" + defaultBranch)) return !1;
        select_dom(".js-compare-pr").before(dom_chef.createElement("div", {
          className: "flash flash-error my-3"
        }, dom_chef.createElement("strong", null, "Note:"), " Creating a PR from the default branch is an ", dom_chef.createElement("a", {
          href: "https://blog.jasonmeridth.com/posts/do-not-issue-pull-requests-from-your-master-branch/",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "anti-pattern"), "."));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/preview-hidden-comments.tsx", {
      include: [ hasComments ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(".timeline-comment-group .minimized-comment .timeline-comment-header-text", preview, {
          signal
        });
      }
    }), fitTextarea.watch = function(elements) {
      "string" == typeof elements ? elements = document.querySelectorAll(elements) : elements instanceof HTMLTextAreaElement && (elements = [ elements ]);
      for (const element of elements) element.addEventListener("input", fit_textarea_listener), 
      element.form && element.form.addEventListener("reset", fit_textarea_listener), fitTextarea(element);
    };
    const fit_textarea = fitTextarea;
    function inputListener({target}) {
      fit_textarea(target);
    }
    function watchTextarea(textarea) {
      textarea.addEventListener("input", inputListener), textarea.addEventListener("change", inputListener), 
      fit_textarea(textarea), textarea.classList.replace("js-size-to-fit", "rgh-fit-textareas");
    }
    function focusListener({delegateTarget: textarea}) {
      watchTextarea(textarea);
    }
    function smartBlockWrap(content, field) {
      const before = field.value.slice(0, field.selectionStart), after = field.value.slice(field.selectionEnd), [whitespaceAtStart] = /\n*$/.exec(before), [whitespaceAtEnd] = /^\n*/.exec(after);
      let newlinesToAppend = "", newlinesToPrepend = "";
      return /\S/.test(before) && whitespaceAtStart.length < 2 && (newlinesToPrepend = "\n".repeat(2 - whitespaceAtStart.length)), 
      /\S/.test(after) && whitespaceAtEnd.length < 2 && (newlinesToAppend = "\n".repeat(2 - whitespaceAtEnd.length)), 
      newlinesToPrepend + content + newlinesToAppend;
    }
    function addContentToDetails({delegateTarget}) {
      const field = delegateTarget.form.querySelector("textarea.js-comment-field"), newContent = `\n\t\t<details>\n\t\t<summary>Details</summary>\n\n\t\t${field.value.slice(field.selectionStart, field.selectionEnd)}\n\n\t\t</details>\n\t`.replace(/(\n|\b)\t+/g, "$1").trim();
      field.focus(), insert(field, smartBlockWrap(newContent, field)), field.setSelectionRange(field.value.lastIndexOf("</summary>", field.selectionStart) + "</summary>".length + 2, field.value.lastIndexOf("</details>", field.selectionStart) - 2);
    }
    function collapsible_content_button_addButtons(referenceButton) {
      referenceButton.after(dom_chef.createElement("button", {
        type: "button",
        className: "toolbar-item btn-octicon p-2 p-md-1 tooltipped tooltipped-sw rgh-collapsible-content-btn",
        "aria-label": "Add collapsible content"
      }, dom_chef.createElement(FoldDownIcon, null)));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/fit-textareas.tsx", {
      include: [ hasRichTextEditor ],
      exclude: [ isSafari ],
      init: function(signal) {
        delegate_it(document, "textarea:not(#pull_request_review_body)", "focusin", focusListener, {
          signal
        });
        for (const textArea of select_dom.all("textarea")) watchTextarea(textArea);
      }
    }, {
      include: [ isPRConversation ],
      exclude: [ isSafari ],
      additionalListeners: [ onPrMergePanelOpen ],
      onlyAdditionalListeners: !0,
      init: function() {
        watchTextarea(select_dom('textarea[name="commit_message"]'));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/collapsible-content-button.tsx", {
      include: [ hasRichTextEditor ],
      init: function(signal) {
        observe("md-ref", collapsible_content_button_addButtons, {
          signal
        }), delegate_it(document, ".rgh-collapsible-content-btn", "click", addContentToDetails, {
          signal
        });
      }
    });
    var resolve_conflicts_browser = __webpack_require__(412);
    function handlePRMenuOpening({delegateTarget: dropdown}) {
      dropdown.classList.add("rgh-actionable-link");
      const [nameWithOwner, headBranch] = select_dom(".head-ref").title.split(":"), filePath = dropdown.closest("[data-path]").getAttribute("data-path");
      select_dom('a[data-ga-click^="View file"]', dropdown).pathname = [ nameWithOwner, "blob", headBranch, filePath ].join("/");
    }
    function handleCompareMenuOpening({delegateTarget: dropdown}) {
      dropdown.classList.add("rgh-actionable-link");
      const viewFile = select_dom('a[data-ga-click^="View file"]', dropdown), branch = select_dom('[title^="compare"]').textContent;
      viewFile.before(dom_chef.createElement("div", {
        className: "dropdown-header pl-5"
      }, dom_chef.createElement(GitBranchIcon, {
        className: "ml-n3 pr-1",
        height: 13
      }), branch));
      const url = new GitHubURL(viewFile.href);
      viewFile.href = url.assign({
        branch
      }).href;
      const editFile = viewFile.cloneNode(!0);
      editFile.textContent = "Edit file", editFile.removeAttribute("data-ga-click"), editFile.href = url.assign({
        route: "edit"
      }).href, select_dom('[aria-label$="to make changes."]', dropdown).replaceWith(editFile);
      const deleteFile = editFile.cloneNode(!0);
      deleteFile.textContent = "Delete file", deleteFile.classList.add("menu-item-danger"), 
      deleteFile.href = url.assign({
        route: "delete"
      }).href, select_dom('[aria-label$="delete this file."]', dropdown).replaceWith(deleteFile);
    }
    function enable_file_links_in_compare_view_init(signal) {
      const handleMenuOpening = isCompare() ? handleCompareMenuOpening : handlePRMenuOpening;
      delegate_it(document, '.file-header:not([data-file-deleted="true"]) .js-file-header-dropdown:not(.rgh-actionable-link)', "toggle", handleMenuOpening, {
        capture: !0,
        signal
      });
    }
    function handleMenuOpening({delegateTarget: dropdown}) {
      dropdown.classList.add("rgh-more-file-links");
      const viewFile = select_dom('a[data-ga-click^="View file"]', dropdown), getDropdownLink = (name, route) => {
        const {href} = new GitHubURL(viewFile.href).assign({
          route
        });
        return dom_chef.createElement("a", {
          href,
          "data-turbo": String("raw" !== route),
          className: "pl-5 dropdown-item btn-link",
          role: "menuitem"
        }, "View ", name);
      };
      viewFile.after(getDropdownLink("raw", "raw"), getDropdownLink("blame", "blame"), getDropdownLink("history", "commits"), dom_chef.createElement("div", {
        className: "dropdown-divider",
        role: "none"
      }));
    }
    function changeTabToTags() {
      select_dom(".rgh-tags-dropdown button.SelectMenu-tab:last-child").click();
    }
    function updateLinksToTag() {
      for (const anchorElement of select_dom.all('.rgh-tags-dropdown #tags-menu a.SelectMenu-item[href*="/tree/"]')) {
        const pathnameParts = anchorElement.pathname.split("/");
        pathnameParts[3] = "releases/tag", anchorElement.pathname = pathnameParts.join("/");
      }
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/resolve-conflicts.tsx", {
      include: [ isPRConflicts ],
      deduplicate: "has-rgh",
      init: async function() {
        await elementReady(".CodeMirror", {
          stopOnDomReady: !1
        }), document.head.append(dom_chef.createElement("script", {
          src: resolve_conflicts_browser.runtime.getURL("resolve-conflicts.js")
        }));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/enable-file-links-in-compare-view.tsx", {
      include: [ isPRFiles, isPRCommit ],
      exclude: [ isClosedPR, () => "This repository has been deleted" === select_dom(".head-ref").title, () => select_dom.exists(".js-commits-filtered") && !select_dom.exists('[aria-label="You are viewing the latest commit"]') ],
      init: enable_file_links_in_compare_view_init
    }, {
      asLongAs: [ () => select_dom.exists('.existing-pull-button, [data-ga-click*="text:Create pull request"]') ],
      include: [ isCompare ],
      init: enable_file_links_in_compare_view_init
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/more-file-links.tsx", {
      include: [ hasFiles ],
      init: function(signal) {
        delegate_it(document, ".file-header .js-file-header-dropdown:not(.rgh-more-file-links)", "toggle", handleMenuOpening, {
          capture: !0,
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/tags-dropdown.tsx", {
      include: [ isReleasesOrTags ],
      exclude: [ isEmptyRepoRoot, isSingleTag ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const tagsDropdown = dom_chef.createElement("div", {
          className: "rgh-tags-dropdown float-right d-flex flex-shrink-0 flex-items-center"
        }, dom_chef.createElement("details", {
          className: "details-reset details-overlay select-menu branch-select-menu position-relative"
        }, dom_chef.createElement("summary", {
          className: "btn select-menu-button css-truncate",
          "data-hotkey": "w",
          title: "Find tags",
          "aria-haspopup": "menu"
        }, "Select tag "), dom_chef.createElement("details-menu", {
          preload: !0,
          className: "select-menu-modal position-absolute dropdown-menu-sw",
          src: buildRepoURL("ref-list/master?source_action=disambiguate&source_controller=files"),
          role: "menu",
          style: {
            zIndex: 99
          }
        }, dom_chef.createElement("include-fragment", {
          className: "select-menu-loading-overlay anim-pulse",
          onLoad: changeTabToTags
        }, dom_chef.createElement(ToastSpinner, null)))));
        if (isEnterprise() || isTags()) select_dom(".subnav").append(tagsDropdown); else {
          const searchBarWrapper = select_dom('input[aria-label="Find a release"]').closest("div");
          searchBarWrapper.prepend(dom_chef.createElement("div", {
            className: "mr-2 mr-md-0 ml-md-2"
          }, tagsDropdown)), searchBarWrapper.classList.add("d-flex");
        }
        select_dom(".rgh-tags-dropdown").addEventListener("remote-input-success", updateLinksToTag);
      }
    });
    function addDropdownItem(dropdown, title, filterCategory, filterValue) {
      const filterQuery = `${filterCategory}:${filterValue}`, currentQuerySegments = new URLSearchParams(location.search).get("q")?.split(/\s+/) ?? [], isSelected = currentQuerySegments.some((segment => segment.toLowerCase() === filterQuery)), query = currentQuerySegments.filter((segment => !segment.startsWith(`${filterCategory}:`))).join(" "), search = new URLSearchParams({
        q: query + (isSelected ? "" : ` ${filterQuery}`)
      });
      dropdown.append(dom_chef.createElement("a", {
        href: `?${String(search)}`,
        className: "SelectMenu-item",
        "aria-checked": isSelected ? "true" : "false",
        role: "menuitemradio"
      }, dom_chef.createElement(CheckIcon, {
        className: "SelectMenu-icon SelectMenu-icon--check"
      }), dom_chef.createElement("span", null, title)));
    }
    function addDraftFilter(dropdown) {
      dropdown.append(dom_chef.createElement("div", {
        className: "SelectMenu-divider"
      }, "Filter by draft pull requests")), addDropdownItem(dropdown, "Ready for review", "draft", "false"), 
      addDropdownItem(dropdown, "Not ready for review (Draft PR)", "draft", "true");
    }
    const hasChecks = webext_storage_cache.function((async () => {
      const {repository} = await v4('\n\t\trepository() {\n\t\t\thead: object(expression: "HEAD") {\n\t\t\t\t... on Commit {\n\t\t\t\t\thistory(first: 10) {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\tstatusCheckRollup {\n\t\t\t\t\t\t\t\tstate\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t');
      return repository.head.history.nodes.some((commit => commit.statusCheckRollup));
    }), {
      maxAge: {
        days: 3
      },
      cacheKey: () => "has-checks:" + github_helpers_getRepo().nameWithOwner
    });
    async function addChecksFilter(reviewsFilter) {
      if (!await hasChecks()) return;
      const checksFilter = reviewsFilter.cloneNode(!0);
      checksFilter.id = "", select_dom("summary", checksFilter).firstChild.textContent = "Checks ", 
      select_dom(".SelectMenu-title", checksFilter).textContent = "Filter by checks status";
      const dropdown = select_dom(".SelectMenu-list", checksFilter);
      dropdown.textContent = "";
      for (const status of [ "Success", "Failure", "Pending" ]) addDropdownItem(dropdown, status, "status", status.toLowerCase());
      reviewsFilter.after(checksFilter);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pr-filters.tsx", {
      include: [ isPRList ],
      awaitDomReady: !1,
      init: async function(signal) {
        observe("#reviews-select-menu", addChecksFilter, {
          signal
        }), observe("#reviews-select-menu .SelectMenu-list", addDraftFilter, {
          signal
        });
      }
    });
    const cachePerPage = {
      cacheKey: () => location.pathname
    }, cachedIsPermalink = mem(isPermalink, cachePerPage), cachedGetDefaultBranch = mem(getDefaultBranch, cachePerPage);
    async function linkifyIcon(fileIcon) {
      const isPermalink_ = await cachedIsPermalink(), fileLink = fileIcon.closest(".js-navigation-item, .react-directory-filename-column").querySelector("a.js-navigation-open, a.Link--primary"), url = new GitHubURL(fileLink.href).assign({
        route: "edit"
      });
      isPermalink_ && (url.branch = await cachedGetDefaultBranch()), wrap(fileIcon, dom_chef.createElement("a", {
        href: url.href,
        className: "rgh-quick-file-edit"
      })), fileIcon.after(dom_chef.createElement(PencilIcon, null));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-file-edit.tsx", {
      include: [ isRepoTree ],
      exclude: [ isArchivedRepo ],
      init: function(signal) {
        observe([ ".react-directory-filename-column svg.color-fg-muted", ".js-navigation-container .octicon-file" ], linkifyIcon, {
          signal
        });
      }
    });
    function getBranches() {
      return {
        base: select_dom(".base-ref").textContent.trim(),
        head: select_dom(".head-ref").textContent.trim()
      };
    }
    async function update_pr_from_base_branch_handler({delegateTarget}) {
      const {base, head} = getBranches();
      if (!confirm(`Merge the ${base} branch into ${head}?`)) return;
      const statusMeta = delegateTarget.parentElement;
      statusMeta.textContent = "Updating branch…", feature_manager.unload("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/update-pr-from-base-branch.tsx");
      const response = await async function() {
        return v3(`pulls/${getConversationNumber()}/update-branch`, {
          method: "PUT",
          ignoreHTTPStatus: !0
        });
      }();
      if (!response.ok) throw statusMeta.textContent = response.message ?? "Error", statusMeta.prepend(dom_chef.createElement(AlertIcon, null), " "), 
      new RefinedGitHubAPIError("update-pr-from-base-branch: " + JSON.stringify(response));
      statusMeta.remove();
    }
    async function update_pr_from_base_branch_addButton(position) {
      const {base, head} = getBranches(), prInfo = await async function(base, head, number = getConversationNumber()) {
        if (isEnterprise()) {
          const {repository: repository2} = await v4(`\n\t\t\trepository() {\n\t\t\t\tpullRequest(number: ${number}) {\n\t\t\t\t\tmergeable\n\t\t\t\t\tviewerCanEditFiles\n\t\t\t\t}\n\t\t\t}\n\t\t`);
          if ("diverged" !== (await v3(`compare/${base}...${head}?page=10000`)).status) return;
          return repository2.pullRequest;
        }
        const {repository} = await v4(`\n\t\trepository() {\n\t\t\tpullRequest(number: ${number}) {\n\t\t\t\tbaseRefOid\n\t\t\t\tmergeable\n\t\t\t\tviewerCanEditFiles\n\t\t\t\theadRef {\n\t\t\t\t\tcompare(headRef: "${base}") {\n\t\t\t\t\t\tstatus\n\t\t\t\t\t\tbehindBy\n\t\t\t\t\t\taheadBy\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`);
        if ("DIVERGED" === repository.pullRequest.headRef.compare.status) return repository.pullRequest;
      }(base, head);
      prInfo && prInfo.viewerCanEditFiles && "CONFLICTING" !== prInfo.mergeable && position.append(" ", dom_chef.createElement("span", {
        className: "status-meta d-inline-block rgh-update-pr-from-base-branch"
      }, "You can ", dom_chef.createElement("button", {
        type: "button",
        className: "btn-link"
      }, "update the base branch"), "."));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/update-pr-from-base-branch.tsx", {
      include: [ isPRConversation ],
      exclude: [ isClosedPR, () => "This repository has been deleted" === select_dom(".head-ref").title, () => select_dom.exists(".js-update-branch-form") ],
      init: async function(signal) {
        await expectToken(), delegate_it(document, ".rgh-update-pr-from-base-branch", "click", update_pr_from_base_branch_handler, {
          signal
        }), observe(".merge-pr > .color-fg-muted:first-child", update_pr_from_base_branch_addButton, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-disabled-milestone-sorter.tsx", {
      include: [ isMilestone ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('[aria-label="You do not have permission to edit this milestone."]', (icon => {
          icon.parentElement.remove();
        }), {
          signal
        });
      }
    });
    const fetch_dom = mem((async function(url, selector) {
      feature_manager.log.http(url);
      const absoluteURL = new URL(url, location.origin).href, response = await fetch(absoluteURL), dom = node_modules_doma(await response.text());
      return selector ? dom.querySelector(selector) ?? void 0 : dom;
    }));
    async function getNextPage() {
      const nextPageLink = select_dom(".pagination a:last-child");
      if (nextPageLink) return fetch_dom(nextPageLink.href);
      if (isSingleTag()) {
        const [, tag = ""] = github_helpers_getRepo().path.split("releases/tag/", 2);
        return fetch_dom(buildRepoURL(`tags?after=${tag}`));
      }
      return new DocumentFragment;
    }
    const getPreviousTag = (current, allTags) => {
      let unmatchedNamespaceTag;
      for (let next = current + 1; next < allTags.length; next++) if (allTags[next].commit !== allTags[current].commit && !(compareVersions(allTags[current].version, allTags[next].version) < 1)) {
        if (allTags[current].namespace === allTags[next].namespace) return allTags[next].tag;
        unmatchedNamespaceTag || (unmatchedNamespaceTag = allTags[next].tag);
      }
      return unmatchedNamespaceTag;
    };
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/tag-changes-link.tsx", {
      include: [ isReleasesOrTags ],
      exclude: [ isEmptyRepoRoot ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        document.documentElement.classList.add("rgh-tag-changes-link");
        const pages = [ document, await getNextPage() ];
        await dom_loaded;
        const allTags = select_dom.all([ ".repository-content .col-md-2", ".Box-row .commit", ".Box-body .border-md-bottom" ], pages).map((tag => function(element) {
          const {pathname: tagUrl} = new URL(select_dom('a[href*="/tree/"]', element).href), tag = /\/(?:releases\/tag|tree)\/(.*)/.exec(tagUrl)[1];
          return {
            element,
            tag,
            commit: select_dom('[href*="/commit/"]', element).textContent.trim(),
            ...parseTag(decodeURIComponent(tag))
          };
        }(tag)));
        for (const [index, container] of allTags.entries()) {
          const previousTag = getPreviousTag(index, allTags);
          if (!previousTag) continue;
          const lastLinks = select_dom.all([ '.Link--muted[data-hovercard-type="commit"]', ".list-style-none > .d-inline-block:last-child" ], container.element);
          for (const lastLink of lastLinks) {
            const currentTag = allTags[index].tag, compareLink = dom_chef.createElement("a", {
              className: "Link--muted tooltipped tooltipped-n",
              "aria-label": `See commits between ${decodeURIComponent(previousTag)} and ${currentTag}`,
              href: buildRepoURL(`compare/${previousTag}...${currentTag}`)
            }, dom_chef.createElement(DiffIcon, null), " ", isEnterprise() ? "Commits" : dom_chef.createElement("span", {
              className: "ml-1 wb-break-all"
            }, "Commits"));
            isEnterprise() || isTags() || isSingleTag() && select_dom.exists(".release") ? (lastLink.after(dom_chef.createElement("li", {
              className: lastLink.className + " rgh-changelog-link"
            }, compareLink)), lastLink.classList.remove("flex-auto")) : (lastLink.parentElement.after(dom_chef.createElement("div", {
              className: "rgh-changelog-link " + (isReleases() ? "mb-md-2 mr-3 mr-md-0" : "mr-4 mb-2")
            }, compareLink)), isReleases() && (lastLink.classList.remove("mb-2"), lastLink.parentElement.classList.remove("mb-md-2")));
          }
        }
      }
    });
    const onElementRemoval = mem((async (element, signal) => {
      if (!signal?.aborted) return new Promise((resolve => {
        const observer = new ResizeObserver((([{target}], observer2) => {
          target.isConnected || (observer2.disconnect(), resolve());
        }));
        signal && signal.addEventListener("abort", (() => {
          observer.disconnect(), resolve();
        }), {
          once: !0
        }), observer.observe(element);
      }));
    })), on_element_removal = onElementRemoval, canEditSidebar = node_modules_onetime((() => select_dom.exists('.discussion-sidebar-item [data-hotkey="l"]')));
    function cleanSection(selector) {
      const container = select_dom(`:is(form, .discussion-sidebar-item):has(${selector})`);
      if (!container) return !1;
      const heading = select_dom([ "details:has(> .discussion-sidebar-heading)", ".discussion-sidebar-heading" ], container);
      if (heading.closest("form, .discussion-sidebar-item").querySelector([ ".IssueLabel", '[aria-label="Select milestones"] .Progress-item', '[aria-label="Link issues"] [data-hovercard-type]', '[aria-label="Select projects"] .Link--primary' ].join(","))) return !1;
      const section = container.closest(".discussion-sidebar-item");
      return canEditSidebar() ? (function(node) {
        const range = new Range;
        return range.selectNodeContents(node.parentElement), range.setStartAfter(node), 
        range;
      }(heading).deleteContents(), section.classList.add("rgh-clean-sidebar")) : section.remove(), 
      !0;
    }
    async function cleanSidebar() {
      select_dom("#partial-discussion-sidebar").classList.add("rgh-clean-sidebar");
      const assignees = select_dom(".js-issue-assignees");
      if (0 === assignees.children.length) assignees.closest(".discussion-sidebar-item").remove(); else {
        const assignYourself = select_dom(".js-issue-assign-self");
        assignYourself && (removeTextNodeContaining(assignYourself.previousSibling, "No one—"), 
        select_dom('[aria-label="Select assignees"] summary').append(dom_chef.createElement("span", {
          style: {
            fontWeight: "normal"
          }
        }, " – ", assignYourself)), assignees.closest(".discussion-sidebar-item").classList.add("rgh-clean-sidebar"));
      }
      if (isPR()) {
        const possibleReviewers = select_dom('[src$="/suggested-reviewers"]');
        possibleReviewers && await on_element_removal(possibleReviewers);
        const content = select_dom('[aria-label="Select reviewers"] > .css-truncate');
        content.firstElementChild || content.remove();
      }
      cleanSection(".js-issue-labels") || canEditSidebar() || select_dom(".discussion-sidebar-item:has(.js-issue-labels) .discussion-sidebar-heading").remove(), 
      select_dom('[aria-label="Link issues"] p')?.remove();
      const createBranchLink = select_dom('button[data-action="click:create-issue-branch#openDialog"]');
      createBranchLink && (createBranchLink.classList.add("Link--muted"), select_dom('[aria-label="Link issues"] summary').append(dom_chef.createElement("span", {
        style: {
          fontWeight: "normal"
        }
      }, " – ", createBranchLink))), cleanSection('[aria-label="Link issues"]'), cleanSection('[aria-label="Select projects"]'), 
      cleanSection('[aria-label="Select milestones"]');
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-conversation-sidebar.tsx", {
      include: [ isConversation ],
      init: function(signal) {
        observe("#partial-discussion-sidebar", cleanSidebar, {
          signal
        });
      }
    });
    let sidebar;
    const onResize = debounce_fn((function() {
      if (!sidebar) return;
      const offset = (string = getComputedStyle(sidebar).getPropertyValue("--rgh-sticky-sidebar-offset"), 
      string.split("+").map((part => looseParseInt(part))).reduce(((a, b) => a + b)));
      var string;
      sidebar.classList.toggle("rgh-sticky-sidebar", window.innerWidth >= 768 && sidebar.offsetHeight + offset < window.innerHeight);
    }), {
      wait: 100
    }), sidebarObserver = new ResizeObserver(onResize);
    function toggleHoverState(event) {
      "mouseenter" === event.type ? sidebarObserver.disconnect() : sidebarObserver.observe(sidebar);
    }
    function trackSidebar(signal, foundSidebar) {
      sidebar = foundSidebar, sidebarObserver.observe(sidebar), onAbort(signal, sidebarObserver, (() => {
        sidebar = void 0;
      })), sidebar.addEventListener("mouseenter", toggleHoverState, {
        signal
      }), sidebar.addEventListener("mouseleave", toggleHoverState, {
        signal
      });
    }
    function createHeatIndexFunction(numbers) {
      const min = Math.min(...numbers), max = Math.max(...numbers);
      return value => {
        const interp = Math.max(0, Math.min(1, function(min, max, value) {
          return min === max ? 0 : (value - min) / (max - min);
        }(min, max, value))), floored = Math.floor(10 * interp);
        return Math.max(1, 10 - floored);
      };
    }
    async function addCounts(assetsList) {
      const releaseName = assetsList.closest('[data-test-selector="release-card"]').parentElement.querySelector(".octicon-tag ~ span").textContent.trim(), assets = await async function(tags) {
        const {repository} = await v4(`\n\t\trepository() {\n\t\t\t${tags.map((tag => `\n\t\t\t\t${escapeKey(tag)}: release(tagName:"${tag}") {\n\t\t\t\t\treleaseAssets(first: 100) {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tdownloadCount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t`)).join(",")}\n\t\t}\n\t`), assets = {};
        for (const [tag, release] of Object.entries(repository)) assets[tag] = release.releaseAssets.nodes;
        return assets;
      }([ releaseName ]), releases = [ [ releaseName, assetsList ] ];
      for (const [name, release] of releases) {
        const downloadCounts = new Map(assets[escapeKey(name)].map((asset => [ asset.name, asset.downloadCount ]))), calculateHeatIndex = createHeatIndexFunction([ ...downloadCounts.values() ]);
        for (const assetName of select_dom.all(".octicon-package ~ a .text-bold", release)) {
          const downloadCount = downloadCounts.get(assetName.textContent);
          if (!downloadCount) continue;
          const assetSize = assetName.closest(".Box-row").querySelector(":scope > .flex-justify-end > :first-child");
          assetSize.parentElement.classList.add("rgh-release-download-count");
          const classes = new Set(assetSize.classList);
          classes.delete("text-sm-left"), classes.add("text-right"), classes.add("no-wrap"), 
          classes.add("ml-auto"), classes.add("mr-sm-2"), assetSize.before(dom_chef.createElement("small", {
            className: [ ...classes ].join(" "),
            title: `${downloadCount} downloads`,
            "data-rgh-heat": calculateHeatIndex(downloadCount)
          }, (0, js_abbreviation_number_dist.abbreviateNumber)(downloadCount), " ", dom_chef.createElement(DownloadIcon, null)));
        }
      }
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/sticky-sidebar.tsx", {
      include: [ isRepoRoot, isConversation ],
      exclude: [ () => screen.availWidth < 768 ],
      awaitDomReady: !1,
      init: function(signal) {
        document.documentElement.classList.add("rgh-sticky-sidebar-enabled"), observe(".Layout-sidebar :is(.BorderGrid, #partial-discussion-sidebar)", trackSidebar.bind(void 0, signal), {
          signal
        }), window.addEventListener("resize", onResize, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/release-download-count.tsx", {
      include: [ isReleasesOrTags ],
      deduplicate: "has-rgh-inner",
      init: function(signal) {
        observe('[data-test-selector="release-card"] details .Box ul', addCounts, {
          signal
        });
      }
    });
    function preserveScroll(anchor = document.elementFromPoint(innerWidth / 2, innerHeight / 2)) {
      const originalPosition = anchor.getBoundingClientRect().top;
      return () => {
        requestAnimationFrame((() => {
          const newPosition = anchor.getBoundingClientRect().top;
          window.scrollBy(0, newPosition - originalPosition);
        }));
      };
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/open-issue-to-latest-comment.tsx", {
      include: [ isIssueOrPRList ],
      deduplicate: "has-rgh-inner",
      init: function() {
        for (const link of select_dom.all('\n\t:is(.js-issue-row, .js-pinned-issue-list-item)\n\t.Link--muted:is([aria-label$="comment"], [aria-label$="comments"])\n')) link.hash = "#partial-timeline";
      }
    });
    const click_all = mem((selector => event => {
      if (event.altKey && event.isTrusted) {
        const clickedItem = event.delegateTarget, resetScroll = preserveScroll(clickedItem.parentElement);
        !function(elementsToClick, except) {
          for (const item of select_dom.all(elementsToClick)) item !== except && item.click();
        }("string" == typeof selector ? selector : selector(clickedItem), clickedItem), 
        resetScroll();
      }
    }));
    function minimizedCommentsSelector(clickedItem) {
      return `.minimized-comment > details${clickedItem.parentElement.open ? "[open]" : ":not([open])"} > summary`;
    }
    function resolvedCommentsSelector(clickedItem) {
      return `.js-resolvable-thread-toggler[aria-expanded="${clickedItem.getAttribute("aria-expanded")}"]:not(.d-none)`;
    }
    function markdownCommentSelector(clickedItem) {
      const {id} = clickedItem.closest(".TimelineItem-body[id]");
      return `#${id} .markdown-body details > summary`;
    }
    function validateInput({delegateTarget: field}) {
      field.classList.toggle("rgh-title-over-limit", field.value.length > 72);
    }
    function isLowQualityComment(text) {
      return "" === text.replace(/[\s,.!?👍👎👌🙏]+|[\u{1F3FB}-\u{1F3FF}]|[+-]\d+|⬆️|ditt?o|me|too|t?here|on|same|this|issues?|please|pl[sz]|any|updates?|bump|question|solution|following/giu, "");
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/toggle-everything-with-alt.tsx", {
      include: [ isConversation, hasFiles, isCommitList ],
      init: function(signal) {
        delegate_it(document, ".minimized-comment details summary", "click", click_all(minimizedCommentsSelector), {
          signal
        }), delegate_it(document, ".js-file .js-diff-load", "click", click_all(".js-file .js-diff-load"), {
          signal
        }), delegate_it(document, ".js-file .js-resolvable-thread-toggler", "click", click_all(resolvedCommentsSelector), {
          signal
        }), delegate_it(document, ".js-file .js-expand-full", "click", click_all(".js-file .js-expand-full"), {
          signal
        }), delegate_it(document, ".js-file .js-collapse-diff", "click", click_all(".js-file .js-collapse-diff"), {
          signal
        }), delegate_it(document, ".TimelineItem .ellipsis-expander", "click", click_all(".TimelineItem .ellipsis-expander"), {
          signal
        }), delegate_it(document, ".TimelineItem-body[id] .markdown-body details > summary", "click", click_all(markdownCommentSelector), {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/suggest-commit-title-limit.tsx", {
      include: [ isEditingFile, isPRConversation ],
      awaitDomReady: !1,
      init: function(signal) {
        document.body.classList.add("rgh-suggest-commit-title-limit"), onCommitTitleUpdate(validateInput, signal);
      }
    });
    async function unhide(event) {
      for (const comment of select_dom.all(".rgh-hidden-comment")) comment.hidden = !1;
      await delay_default()(10);
      for (const similarCommentsExpandButton of select_dom.all(".rgh-hidden-comment > summary")) similarCommentsExpandButton.click();
      select_dom(".rgh-hidden-comment").scrollIntoView(), event.delegateTarget.parentElement.remove();
    }
    function hideComment(comment) {
      comment.hidden = !0, comment.classList.add("rgh-hidden-comment");
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hide-low-quality-comments.tsx", {
      include: [ isIssue ],
      init: function() {
        if (select_dom.exists(".rgh-low-quality-comments-note")) return !1;
        for (const similarCommentsBox of select_dom.all(".js-discussion .Details-element:not([data-body-version])")) hideComment(similarCommentsBox);
        const linkedComment = location.hash.startsWith("#issuecomment-") ? select_dom(`${location.hash} .comment-body > p:only-child`) : void 0;
        for (const commentText of select_dom.all(".comment-body > p:only-child")) {
          if (commentText === linkedComment) continue;
          if (!isLowQualityComment(commentText.textContent)) continue;
          if (select_dom.exists("a", commentText)) continue;
          const comment = commentText.closest(".js-timeline-item");
          if (select_dom.exists(".timeline-comment-label", comment)) continue;
          const author = select_dom(".author", comment).getAttribute("href");
          select_dom(`.js-timeline-item:not([hidden]) .unminimized-comment .author[href="${author}"]`)?.closest(".js-timeline-item") === comment && hideComment(comment);
        }
        const lowQualityCount = select_dom.all(".rgh-hidden-comment").length;
        lowQualityCount > 0 && (select_dom(".discussion-timeline-actions").prepend(dom_chef.createElement("p", {
          className: "rgh-low-quality-comments-note"
        }, `${lowQualityCount} unhelpful comment${lowQualityCount > 1 ? "s were" : " was"} automatically hidden. `, dom_chef.createElement("button", {
          className: "btn-link text-emphasized rgh-unhide-low-quality-comments",
          type: "button"
        }, "Show"))), delegate_it(document, ".rgh-unhide-low-quality-comments", "click", unhide));
      }
    });
    const positiveReactionsSelector = '\n\t.js-timeline-item [aria-label="react with thumbs up"],\n\t.js-timeline-item [aria-label="react with hooray"],\n\t.js-timeline-item [aria-label="react with heart"]\n', getPositiveReactions = mem((comment => {
      const count = selectSum(positiveReactionsSelector, comment);
      if (count >= 10 && selectSum('\n\t.js-timeline-item [aria-label="react with thumbs down"]\n', comment) < count / 2) return count;
    }));
    function selectSum(selector, container) {
      return select_dom.all(selector, container).reduce(((sum, element) => sum + looseParseInt(element)), 0);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/highest-rated-comment.tsx", {
      include: [ isIssue ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const bestComment = function() {
          let highest;
          for (const reaction of select_dom.all(positiveReactionsSelector)) {
            const comment = reaction.closest(".js-timeline-item"), positiveReactions = getPositiveReactions(comment);
            positiveReactions && (!highest || positiveReactions > highest.count) && (highest = {
              comment,
              count: positiveReactions
            });
          }
          return highest?.comment;
        }();
        if (!bestComment) return !1;
        const commentText = select_dom(".comment-body > p:only-child", bestComment)?.textContent;
        if (commentText && isLowQualityComment(commentText)) return !1;
        !function(bestComment) {
          if (select_dom.all(".js-timeline-item").indexOf(bestComment) < 3) return;
          const text = select_dom(".comment-body", bestComment).textContent.slice(0, 100), {hash} = select_dom("a.js-timestamp", bestComment), avatar = select_dom("img.avatar", bestComment).cloneNode();
          bestComment.parentElement.firstElementChild.after(dom_chef.createElement("a", {
            href: hash,
            className: "no-underline rounded-1 rgh-highest-rated-comment timeline-comment color-bg-subtle px-2 d-flex flex-items-center"
          }, avatar, dom_chef.createElement("h3", {
            className: "timeline-comment-header-text f5 color-fg-muted text-normal text-italic css-truncate css-truncate-overflow mr-2"
          }, dom_chef.createElement("span", {
            className: "Label mr-2"
          }, "Highest-rated"), text), dom_chef.createElement("div", {
            className: "color-fg-muted f6 no-wrap"
          }, dom_chef.createElement(ArrowDownIcon, {
            className: "mr-1"
          }), "Jump to comment")));
        }(bestComment), function(bestComment) {
          select_dom(".unminimized-comment", bestComment).classList.add("rgh-highest-rated-comment"), 
          select_dom(".unminimized-comment .timeline-comment-header > h3", bestComment).before(dom_chef.createElement("span", {
            className: "color-fg-success tooltipped tooltipped-s",
            "aria-label": "This comment has the most positive reactions on this issue."
          }, dom_chef.createElement(CheckCircleFillIcon, null)));
        }(bestComment);
      }
    });
    const hasAnyProjects = webext_storage_cache.function((async () => {
      const {repository, organization} = await v4(`\n\t\trepository() {\n\t\t\tprojects { totalCount }\n\t\t}\n\t\torganization(login: "${github_helpers_getRepo().owner}") {\n\t\t\tprojects { totalCount }\n\t\t}\n\t`, {
        allowErrors: !0
      });
      return Boolean(repository.projects.totalCount) && Boolean(organization?.projects?.totalCount);
    }), {
      maxAge: {
        days: 1
      },
      staleWhileRevalidate: {
        days: 20
      },
      cacheKey: () => "has-projects:" + github_helpers_getRepo().nameWithOwner
    });
    function getCount(element) {
      return Number(element.textContent.trim());
    }
    async function hideMilestones() {
      0 === getCount(select_dom('[data-selected-links^="repo_milestones"] .Counter')) && (await elementReady('[data-hotkey="m"]')).parentElement.remove();
    }
    async function hideProjects() {
      if (!await async function() {
        const activeProjectsCounter = select_dom('[data-hotkey="g b"] .Counter');
        if (activeProjectsCounter && getCount(activeProjectsCounter) > 0) return !0;
        const isOrganization = select_dom.exists('[rel=author][data-hovercard-type="organization"]');
        return !(!activeProjectsCounter && !isOrganization) && hasAnyProjects();
      }()) {
        (await elementReady('[data-hotkey="p"]'))?.parentElement.remove();
      }
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-conversation-filters.tsx", {
      include: [ isRepoIssueOrPRList ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        if (!await elementReady("#js-issues-toolbar", {
          waitForChildren: !1
        })) return !1;
        await Promise.all([ hideMilestones(), hideProjects() ]);
      }
    });
    const array_union = (...arguments_) => [ ...new Set(arguments_.flat()) ];
    function mergeTags(oldTags, newTags) {
      const result = {
        ...oldTags
      };
      for (const commit in newTags) result[commit] ? result[commit] = array_union(result[commit], newTags[commit]) : result[commit] = newTags[commit];
      return result;
    }
    async function getTags(lastCommit, after) {
      const {repository} = await v4(`\n\t\trepository() {\n\t\t\trefs(\n\t\t\t\tfirst: 100,\n\t\t\t\trefPrefix: "refs/tags/",\n\t\t\t\torderBy: {\n\t\t\t\t\tfield: TAG_COMMIT_DATE,\n\t\t\t\t\tdirection: DESC\n\t\t\t\t}\n\t\t\t\t${after ? `, after: "${after}"` : ""}\n\t\t\t) {\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t\tendCursor\n\t\t\t\t}\n\t\t\t\tnodes {\n\t\t\t\t\tname\n\t\t\t\t\ttarget {\n\t\t\t\t\t\tcommitResourcePath\n\t\t\t\t\t\t... on Tag {\n\t\t\t\t\t\t\ttagger {\n\t\t\t\t\t\t\t\tdate\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on Commit {\n\t\t\t\t\t\t\tcommittedDate\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tobject(expression: "${lastCommit}") {\n\t\t\t\t... on Commit {\n\t\t\t\t\tcommittedDate\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t`), nodes = repository.refs.nodes;
      if (0 === nodes.length) return {};
      let tags = {};
      for (const node of nodes) {
        const commit = node.target.commitResourcePath.split("/")[4];
        tags[commit] || (tags[commit] = []), tags[commit].push(node.name);
      }
      const lastTag = nodes[nodes.length - 1].target;
      return new Date(repository.object.committedDate) < new Date("tagger" in lastTag ? lastTag.tagger.date : lastTag.committedDate) && repository.refs.pageInfo.hasNextPage && (tags = mergeTags(tags, await getTags(lastCommit, repository.refs.pageInfo.endCursor))), 
      tags;
    }
    function getPRUrl(prNumber) {
      return buildRepoURL("pull", prNumber, "files");
    }
    function getHovercardUrl(prNumber) {
      return buildRepoURL("pull", prNumber, "hovercard");
    }
    function getSingleButton(prNumber) {
      return dom_chef.createElement("a", {
        href: getPRUrl(prNumber),
        className: "btn btn-sm flex-self-center",
        "data-hovercard-url": getHovercardUrl(prNumber)
      }, dom_chef.createElement(GitPullRequestIcon, {
        className: "v-align-middle"
      }), dom_chef.createElement("span", {
        className: "v-align-middle"
      }, " #", prNumber));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/tags-on-commits-list.tsx", {
      include: [ isRepoCommitList ],
      deduplicate: "has-rgh-inner",
      init: async function() {
        const cacheKey = `tags:${github_helpers_getRepo().nameWithOwner}`, commitsOnPage = select_dom.all(".js-commits-list-item"), lastCommitOnPage = getCommitHash(commitsOnPage[commitsOnPage.length - 1]);
        let cached = await webext_storage_cache.get(cacheKey) ?? {};
        const commitsWithNoTags = [];
        for (const commit of commitsOnPage) {
          const targetCommit = getCommitHash(commit);
          let targetTags = cached[targetCommit];
          targetTags || (cached = mergeTags(cached, await getTags(lastCommitOnPage)), targetTags = cached[targetCommit]), 
          targetTags ? targetTags.length > 0 && (select_dom(".flex-auto .d-flex.mt-1", commit).append(dom_chef.createElement("span", null, dom_chef.createElement(TagIcon, {
            className: "ml-1"
          }), ...targetTags.map((tag => dom_chef.createElement(dom_chef.Fragment, null, " ", dom_chef.createElement("a", {
            className: "Link--muted",
            href: buildRepoURL("releases/tag", tag)
          }, dom_chef.createElement("code", null, tag))))))), commit.classList.add("rgh-tagged")) : commitsWithNoTags.push(targetCommit);
        }
        if (commitsWithNoTags.length > 0) for (const commit of commitsWithNoTags) cached[commit] = [];
        await webext_storage_cache.set(cacheKey, cached, {
          days: 1
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/edit-readme.tsx", {
      include: [ isRepoTree ],
      exclude: [ isArchivedRepo ],
      deduplicate: ".rgh-edit-readme",
      init: async function() {
        const readmeHeader = select_dom("#readme :is(.Box-header, .js-sticky)");
        if (!readmeHeader || select_dom.exists('[aria-label="Edit this file"]', readmeHeader)) return !1;
        const isPermalink_ = await isPermalink(), filename = select_dom('[href="#readme"]').textContent.trim(), fileLink = select_dom(`a.js-navigation-open[title="${filename}"]`), url = new GitHubURL(fileLink.href).assign({
          route: "edit"
        });
        isPermalink_ && (url.branch = await getDefaultBranch()), readmeHeader.append(dom_chef.createElement("a", {
          href: url.href,
          className: (readmeHeader.matches(".js-sticky") ? "p-2" : "Box-btn-octicon") + " btn-octicon rgh-edit-readme",
          "aria-label": "Edit this file"
        }, dom_chef.createElement(PencilIcon, null)));
      }
    });
    const getPrsByFile = webext_storage_cache.function((async () => {
      const {repository} = await v4(`\n\t\trepository() {\n\t\t\tpullRequests(\n\t\t\t\tfirst: 25,\n\t\t\t\tstates: OPEN,\n\t\t\t\tbaseRefName: "${await getDefaultBranch()}",\n\t\t\t\torderBy: {\n\t\t\t\t\tfield: UPDATED_AT,\n\t\t\t\t\tdirection: DESC\n\t\t\t\t}\n\t\t\t) {\n\t\t\t\tnodes {\n\t\t\t\t\tnumber\n\t\t\t\t\tfiles(first: 100) {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\tpath\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`), files = {};
      for (const pr of repository.pullRequests.nodes) for (const {path} of pr.files.nodes) files[path] = files[path] ?? [], 
      files[path].length < 10 && files[path].push(pr.number);
      return files;
    }), {
      maxAge: {
        hours: 2
      },
      staleWhileRevalidate: {
        days: 9
      },
      cacheKey: () => "files-with-prs:" + github_helpers_getRepo().nameWithOwner
    });
    async function getCurrentPath() {
      return (await elementReady('[aria-label="Copy path"], #blob-edit-path')).getAttribute("value");
    }
    function onPrMerge(callback, signal) {
      const controller = new AbortController;
      onAbort(signal, controller), delegate_it(document, ".js-merge-commit-button", "click", (() => {
        controller.abort(), observe(".TimelineItem-badge .octicon-git-merge", callback, {
          signal
        });
      }), {
        signal
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/list-prs-for-file.tsx", {
      include: [ isSingleFile ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        const [path, prsByFile] = await Promise.all([ getCurrentPath(), getPrsByFile() ]), prs = prsByFile[path];
        if (!prs) return;
        const [prNumber] = prs, button = 1 === prs.length ? getSingleButton(prNumber) : function(prs) {
          return dom_chef.createElement("details", {
            className: "dropdown details-reset details-overlay flex-self-center"
          }, dom_chef.createElement("summary", {
            className: "btn btn-sm"
          }, dom_chef.createElement(GitPullRequestIcon, {
            className: "v-align-middle"
          }), dom_chef.createElement("span", {
            className: "v-align-middle"
          }, " ", prs.length, " "), dom_chef.createElement("div", {
            className: "dropdown-caret"
          })), dom_chef.createElement("details-menu", {
            className: "dropdown-menu dropdown-menu-sw"
          }, dom_chef.createElement("div", {
            className: "dropdown-header"
          }, "File touched by PRs"), prs.map((prNumber => dom_chef.createElement("a", {
            className: "dropdown-item",
            href: getPRUrl(prNumber),
            "data-hovercard-url": getHovercardUrl(prNumber)
          }, "#", prNumber)))));
        }(prs);
        await addAfterBranchSelector(button);
      }
    }, {
      include: [ isEditingFile ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const [path, prsByFile] = await Promise.all([ getCurrentPath(), getPrsByFile() ]);
        let prs = prsByFile[path];
        if (!prs) return;
        const editingPRNumber = new URLSearchParams(location.search).get("pr")?.split("/").slice(-1);
        if (editingPRNumber && (prs = prs.filter((pr => pr !== Number(editingPRNumber))), 
        0 === prs.length)) return;
        const [prNumber] = prs, file = await elementReady(".file");
        if (!file && isBlank()) return !1;
        file.after(dom_chef.createElement("div", {
          className: "form-warning p-3 mb-3 mx-lg-3"
        }, 1 === prs.length ? dom_chef.createElement(dom_chef.Fragment, null, "Careful, PR ", dom_chef.createElement("a", {
          href: getPRUrl(prNumber)
        }, "#", prNumber), " is already touching this file") : dom_chef.createElement(dom_chef.Fragment, null, "Careful, ", prs.length, " open PRs are already touching this file", dom_chef.createElement("span", {
          className: "ml-2 BtnGroup"
        }, prs.map((pr => {
          const button = getSingleButton(pr);
          return button.classList.add("BtnGroup-item"), isChrome() && (button.hash = `:~:text=${path}`), 
          button;
        }))))));
      }
    });
    const canCreateRelease = canEditEveryComment;
    function showWhiteSpacesOnLine(line, shouldAvoidSurroundingSpaces = !1) {
      const textNodesOnThisLine = getTextNodes(line);
      for (const [nodeIndex, textNode] of textNodesOnThisLine.entries()) {
        let text = textNode.textContent;
        if (text.length > 1e3) continue;
        const isLeading = 0 === nodeIndex, isTrailing = nodeIndex === textNodesOnThisLine.length - 1, startingCharacterIndex = shouldAvoidSurroundingSpaces && isLeading ? 1 : 0, skipLastCharacter = shouldAvoidSurroundingSpaces && isTrailing;
        for (let i = text.length - 1 - Number(skipLastCharacter); i >= startingCharacterIndex; i--) {
          const thisCharacter = text[i], endingIndex = i;
          if (" " === thisCharacter || "\t" === thisCharacter) {
            for (;text[i - 1] === thisCharacter && i !== startingCharacterIndex; ) i--;
            (isLeading || isTrailing || i !== endingIndex || " " !== thisCharacter) && (endingIndex < text.length - 1 && textNode.splitText(endingIndex + 1), 
            textNode.splitText(i), text = textNode.textContent, textNode.after(dom_chef.createElement("span", {
              "data-rgh-whitespace": "\t" === thisCharacter ? "tab" : "space"
            }, textNode.nextSibling)));
          }
        }
      }
      return line;
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pr-branch-auto-delete.tsx", {
      asLongAs: [ isPRConversation, isOpenPR, canCreateRelease ],
      additionalListeners: [ onPrMerge ],
      onlyAdditionalListeners: !0,
      init: async function() {
        const deleteButton = select_dom('[action$="/cleanup"] [type="submit"]');
        if (!deleteButton) return;
        deleteButton.dataset.disableWith = "Auto-deleting…", deleteButton.click(), attachElement((await elementReady('[data-test-selector="head-ref-deleted-event-ref-name"]', {
          stopOnDomReady: !1
        })).closest(".TimelineItem-body"), {
          append() {
            const url = featureLink(feature_manager.getFeatureID("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pr-branch-auto-delete.tsx"));
            return dom_chef.createElement("a", {
              className: "d-inline-block",
              href: url
            }, "via Refined GitHub ", dom_chef.createElement(InfoIcon, null));
          }
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-symbolic-links.tsx", {
      include: [ isSingleFile ],
      deduplicate: "has-rgh",
      init: function() {
        if ("symbolic link" === select_dom(".file-mode")?.textContent) {
          const line = select_dom(".js-file-line");
          wrap(line.firstChild, dom_chef.createElement("a", {
            href: line.textContent,
            "data-turbo-frame": "repo-content-turbo-frame"
          }));
        }
      }
    });
    const show_whitespace_viewportObserver = new IntersectionObserver((changes => {
      for (const {target: line, isIntersecting} of changes) if (isIntersecting) {
        const shouldAvoidSurroundingSpaces = Boolean(line.closest(".blob-wrapper-embedded"));
        showWhiteSpacesOnLine(line, shouldAvoidSurroundingSpaces), show_whitespace_viewportObserver.unobserve(line);
      }
    }));
    function showWhitespaceWhenInViewport(line) {
      show_whitespace_viewportObserver.observe(line);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/show-whitespace.tsx", {
      include: [ hasCode ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(`:is(${codeElementsSelector}):not(.blob-code-hunk)`, showWhitespaceWhenInViewport, {
          signal
        }), onAbort(signal, show_whitespace_viewportObserver);
      }
    });
    const getBaseReference = node_modules_onetime((async () => {
      const {repository} = await v4(`\n\t\trepository() {\n\t\t\tpullRequest(number: ${getConversationNumber()}) {\n\t\t\t\tbaseRefOid\n\t\t\t}\n\t\t}\n\t`);
      return repository.pullRequest.baseRefOid;
    }));
    async function restoreFile(progress, menuItem, filePath) {
      const file = await async function(filePath) {
        const {repository} = await v4(`\n\t\trepository() {\n\t\t\tfile: object(expression: "${await getBaseReference()}:${filePath}") {\n\t\t\t\t... on Blob {\n\t\t\t\t\tisTruncated\n\t\t\t\t\ttext\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`);
        return repository.file;
      }(filePath);
      if (!file) throw new Error("Nothing to restore. Delete file instead");
      if (file.isTruncated) throw new Error("Restore failed: File too big");
      const [nameWithOwner, prBranch] = select_dom(".head-ref").title.split(":");
      progress(menuItem.closest('[data-file-deleted="true"]') ? "Undeleting…" : "Committing…");
      const content = file.text;
      await v4(`mutation {\n\t\tcreateCommitOnBranch(input: {\n\t\t\tbranch: {\n\t\t\t\trepositoryNameWithOwner: "${nameWithOwner}",\n\t\t\t\tbranchName: "${prBranch}"\n\t\t\t},\n\t\t\texpectedHeadOid: "${await (async () => {
        const {repository} = await v4(`\n\t\trepository() { # Cache buster ${Math.random()}\n\t\t\tpullRequest(number: ${getConversationNumber()}) {\n\t\t\t\theadRefOid\n\t\t\t}\n\t\t}\n\t`);
        return repository.pullRequest.headRefOid;
      })()}",\n\t\t\tfileChanges: {\n\t\t\t\tadditions: [\n\t\t\t\t\t{\n\t\t\t\t\t\tpath: "${filePath}",\n\t\t\t\t\t\tcontents: "${btoa(unescape(encodeURIComponent(content)))}"\n\t\t\t\t\t}\n\t\t\t\t]\n\t\t\t},\n\t\t\tmessage: {\n\t\t\t\theadline: "Restore ${filePath}"\n\t\t\t}\n\t\t}) {\n\t\t\tcommit {\n\t\t\t\toid\n\t\t\t}\n\t\t}\n\t}`);
    }
    async function handleRestoreFileClick(event) {
      const menuItem = event.delegateTarget;
      try {
        const filePath = menuItem.closest("[data-path]").dataset.path;
        await showToast((async progress => restoreFile(progress, menuItem, filePath)), {
          message: "Restoring…",
          doneMessage: "Restored!"
        }), menuItem.closest(".file").remove();
      } catch (error) {
        feature_manager.log.error("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/restore-file.tsx", error);
      }
    }
    function restore_file_handleMenuOpening({delegateTarget: dropdown}) {
      const editFile = select_dom('a[aria-label^="Change this"]', dropdown);
      editFile && !select_dom.exists(".rgh-restore-file", dropdown) && (editFile.closest(".file-header").querySelector('[aria-label="File added"]') || editFile.after(dom_chef.createElement("button", {
        className: "pl-5 dropdown-item btn-link rgh-restore-file",
        style: {
          whiteSpace: "pre-wrap"
        },
        role: "menuitem",
        type: "button"
      }, "Restore file")));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/restore-file.tsx", {
      include: [ isPRFiles, isPRCommit ],
      init: function(signal) {
        delegate_it(document, ".file-header .js-file-header-dropdown", "toggle", restore_file_handleMenuOpening, {
          capture: !0,
          signal
        }), delegate_it(document, ".rgh-restore-file", "click", handleRestoreFileClick, {
          capture: !0,
          signal
        });
      }
    });
    const handleIndicatorClick = ({delegateTarget}) => {
      const resetScroll = preserveScroll(delegateTarget.closest("tr").previousElementSibling);
      delegateTarget.closest(".file.js-file").querySelector("input.js-toggle-file-notes").click(), 
      resetScroll();
    }, addIndicator = mem((commentThread => {
      const commentCount = commentThread.querySelectorAll(".review-comment.js-comment").length;
      commentThread.before(dom_chef.createElement("tr", null, dom_chef.createElement("td", {
        className: "rgh-comments-indicator blob-num",
        colSpan: 2
      }, dom_chef.createElement("button", {
        type: "button",
        className: "btn-link"
      }, dom_chef.createElement(CommentIcon, null), dom_chef.createElement("span", null, commentCount)))));
    })), indicatorToggleObserver = new MutationObserver((mutations => {
      for (const mutation of mutations) {
        const file = mutation.target, wasVisible = mutation.oldValue.includes("show-inline-notes"), isHidden = !file.classList.contains("show-inline-notes");
        if (wasVisible && isHidden) for (const thread of select_dom.all("tr.inline-comments", file)) addIndicator(thread);
      }
    }));
    function loadSingleImage(image) {
      var promise = new Promise((function(resolve, reject) {
        function fulfill() {
          image.naturalWidth ? resolve(image) : reject(image), image.removeEventListener("load", fulfill), 
          image.removeEventListener("error", fulfill);
        }
        image.naturalWidth ? resolve(image) : image.complete ? reject(image) : (image.addEventListener("load", fulfill), 
        image.addEventListener("error", fulfill));
      }));
      return Object.assign(promise, {
        image
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/hidden-review-comments-indicator.tsx", {
      include: [ isPRFiles, isPRCommit ],
      init: function(signal) {
        observe(".file.js-file", (element => {
          indicatorToggleObserver.observe(element, {
            attributes: !0,
            attributeOldValue: !0,
            attributeFilter: [ "class" ]
          });
        })), delegate_it(document, ".rgh-comments-indicator", "click", handleIndicatorClick, {
          signal
        }), onAbort(signal, indicatorToggleObserver);
      }
    });
    const image_promise = function loadImages(input, attributes) {
      if (void 0 === attributes && (attributes = {}), input instanceof HTMLImageElement) return loadSingleImage(input);
      if ("string" == typeof input) {
        var src = input, image_1 = new Image;
        return Object.keys(attributes).forEach((function(name) {
          return image_1.setAttribute(name, attributes[name]);
        })), image_1.src = src, loadSingleImage(image_1);
      }
      if (function(input) {
        return void 0 !== input.length;
      }(input)) {
        var reflected = [].map.call(input, (function(img) {
          return loadImages(img, attributes).catch((function(error) {
            return error;
          }));
        }));
        return Promise.all(reflected).then((function(results) {
          var loaded = results.filter((function(x) {
            return x.naturalWidth;
          }));
          return loaded.length === results.length ? loaded : Promise.reject({
            loaded,
            errored: results.filter((function(x) {
              return !x.naturalWidth;
            }))
          });
        }));
      }
      return Promise.reject(new TypeError("input is not an image, a URL string, or an array of them."));
    };
    async function handleErroredImage({delegateTarget}) {
      await delay_default()(5e3);
      try {
        delegateTarget.replaceWith(await image_promise(delegateTarget.cloneNode()));
      } catch {}
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/reload-failed-proxied-images.tsx", {
      init: node_modules_onetime((function() {
        delegate_it(document, 'img[src^="https://camo.githubusercontent.com/"]', "error", handleErroredImage, {
          capture: !0
        });
      }))
    });
    const getCollaborators = webext_storage_cache.function((async () => {
      const dom = await fetch_dom(buildRepoURL("issues/show_menu_content?partial=issues/filters/authors_content"));
      return select_dom.all(".SelectMenu-item img[alt]", dom).map((avatar => avatar.alt.slice(1)));
    }), {
      maxAge: {
        days: 1
      },
      staleWhileRevalidate: {
        days: 20
      },
      cacheKey: () => "repo-collaborators:" + github_helpers_getRepo().nameWithOwner
    });
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/highlight-collaborators-and-own-conversations.tsx", {
      include: [ isRepoIssueOrPRList ],
      exclude: [ () => select_dom.exists(".blankslate") ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        const collaborators = await getCollaborators();
        await dom_loaded;
        for (const author of select_dom.all('.js-issue-row [data-hovercard-type="user"]')) collaborators.includes(author.textContent.trim()) && author.classList.add("rgh-collaborator");
      }
    }, {
      include: [ isIssueOrPRList ],
      deduplicate: "has-rgh-inner",
      init: function() {
        for (const author of select_dom.all(`.opened-by a[title$="ed by ${CSS.escape(github_helpers_getUsername())}"]`)) author.classList.add("rgh-collaborator"), 
        author.style.fontStyle = "italic";
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/embed-gist-via-iframe.tsx", {
      include: [ isSingleGist ],
      init: node_modules_onetime((function() {
        const embedViaScript = select_dom('.file-navigation-option button[value^="<script"]'), embedViaIframe = embedViaScript.cloneNode(!0);
        delete embedViaIframe.dataset.hydroClick, delete embedViaIframe.dataset.hydroClickHmac, 
        embedViaIframe.setAttribute("aria-checked", "false"), embedViaIframe.value = `<iframe src="${location.origin}${location.pathname}.pibb"></iframe>`, 
        select_dom(".select-menu-item-heading", embedViaIframe).textContent = "Embed via <iframe>", 
        select_dom(".description", embedViaIframe).textContent = "Embed this gist in your website via <iframe>.", 
        select_dom(".select-menu-item-heading", embedViaScript).textContent = "Embed via <script>", 
        select_dom(".description", embedViaScript).textContent = "Embed this gist in your website via <script>.", 
        embedViaScript.after(embedViaIframe);
      }))
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/one-click-pr-or-gist.tsx", {
      include: [ isCompare, isGist ],
      deduplicate: "has-rgh",
      init: function() {
        const initialGroupedButtons = selectHas('.BtnGroup:has([name="draft"], [name="gist[public]"])');
        if (!initialGroupedButtons) return !1;
        for (const dropdownItem of select_dom.all(".select-menu-item", initialGroupedButtons)) {
          let title = select_dom(".select-menu-item-heading", dropdownItem).textContent.trim();
          const description = select_dom(".description", dropdownItem).textContent.trim(), radioButton = select_dom("input[type=radio]", dropdownItem), classList = [ "btn", "ml-2", "tooltipped", "tooltipped-s" ];
          /\bdraft\b/i.test(title) ? title = "Create draft PR" : classList.push("btn-primary"), 
          initialGroupedButtons.after(dom_chef.createElement("button", {
            "data-disable-invalid": !0,
            className: classList.join(" "),
            "aria-label": description,
            type: "submit",
            name: radioButton.name,
            value: radioButton.value
          }, title));
        }
        initialGroupedButtons.remove();
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/link-to-prior-blame-line.tsx", {
      include: [ isBlame ],
      deduplicate: "has-rgh",
      init: function() {
        for (const link of select_dom.all("a.reblame-link")) {
          const lineNumber = link.closest(".blame-hunk").querySelector(".js-line-number[id]").id;
          link.hash = `#${lineNumber}`;
        }
      }
    });
    const botNames = [ "actions-user", "bors", "ImgBotApp", "Octomerger", "renovate-bot", "rust-highfive", "scala-steward", "snyk-bot", "web-flow", "weblate" ], commitSelectors = botNames.map((bot => `.commit-author[href$="?author=${bot}"]`));
    commitSelectors.push('.commit-author[href$="%5Bbot%5D"]');
    const dim_bots_commitSelector = commitSelectors.join(","), prSelector = [ ...botNames.flatMap((bot => [ `.opened-by [title*="pull requests created by ${bot}"]`, `.opened-by [title*="pull requests opened by ${bot}"]` ])), '.opened-by [href*="author%3Aapp%2F"]', '.labels [href$="label%3Abot"]' ].join(",");
    async function oneMutation(element, options = {}) {
      return new Promise((resolve => {
        const {filter} = options;
        new MutationObserver(((changes, observer) => {
          filter && !filter(changes) || (observer.disconnect(), resolve(changes));
        })).observe(element, options);
      }));
    }
    async function conflict_marker_init() {
      isMilestone() && await oneMutation(select_dom(".js-milestone-issues-container"), {
        childList: !0
      });
      const openPrIcons = select_dom.all(".js-issue-row .octicon-git-pull-request.open");
      if (0 === openPrIcons.length) return !1;
      const prs = openPrIcons.map((icon => function(prIcon) {
        const link = prIcon.closest(".js-navigation-item").querySelector("a.js-navigation-open"), [, user, repo, , number] = link.pathname.split("/");
        return {
          user,
          repo,
          number,
          link,
          key: escapeKey(user, repo, number)
        };
      }(icon))), data = await v4(function(prs) {
        return prs.map((pr => function(pr) {
          return `\n\t\t${pr.key}: repository(owner: "${pr.user}", name: "${pr.repo}") {\n\t\t\tpullRequest(number: ${pr.number}) {\n\t\t\t\tmergeable\n\t\t\t}\n\t\t}\n\t`;
        }(pr))).join("\n");
      }(prs));
      for (const pr of prs) "CONFLICTING" === data[pr.key].pullRequest.mergeable && pr.link.after(dom_chef.createElement("a", {
        className: "rgh-conflict-marker tooltipped tooltipped-e color-fg-muted ml-2",
        "aria-label": "This PR has conflicts that must be resolved",
        href: `${pr.link.pathname}#partial-pull-merging`
      }, dom_chef.createElement(AlertIcon, {
        className: "v-align-middle"
      })));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/dim-bots.tsx", {
      include: [ isCommitList, isIssueOrPRList ],
      exclude: [ isBlank ],
      deduplicate: "has-rgh-inner",
      init: function() {
        for (const bot of select_dom.all(dim_bots_commitSelector)) select_dom.all("a", bot.parentElement).every((link => link.matches(dim_bots_commitSelector))) && bot.closest(".commit, .Box-row").classList.add("rgh-dim-bot");
        for (const bot of select_dom.all(prSelector)) bot.closest(".commit, .Box-row").classList.add("rgh-dim-bot");
        requestAnimationFrame((() => {
          select_dom("#repo-content-turbo-frame .js-navigation-container").classList.add("rgh-dim-bots--after-hover");
        }));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/conflict-marker.tsx", {
      include: [ isIssueOrPRList ],
      exclude: [ isGlobalIssueOrPRList, isBlank ],
      deduplicate: "has-rgh-inner",
      init: conflict_marker_init
    }, {
      include: [ isGlobalIssueOrPRList ],
      exclude: [ isBlank ],
      deduplicate: "has-rgh",
      init: conflict_marker_init
    });
    function linkifyLabel(label) {
      const activity = label.closest("div:not([class])"), isPR = select_dom.exists(".octicon-git-pull-request", activity), repository = select_dom('a[data-hovercard-type="repository"]', activity), url = new URL(`${repository.href}/${isPR ? "pulls" : "issues"}`), labelName = label.textContent.trim();
      url.searchParams.set("q", `is:${isPR ? "pr" : "issue"} is:open sort:updated-desc label:"${labelName}"`), 
      wrap(label, dom_chef.createElement("a", {
        href: url.href
      }));
    }
    function linkify(location) {
      const locationName = location.textContent.trim(), googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
      location.before(" ");
      const link = dom_chef.createElement("a", {
        className: "Link--primary",
        href: googleMapsLink
      });
      return location.parentElement.closest(".Popover") && link.classList.add("text-underline"), 
      wrap(location, link), link;
    }
    function addLocation({nextElementSibling, nextSibling}) {
      attachElement(nextElementSibling ?? nextSibling, {
        forEach: linkify
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/html-preview-link.tsx", {
      asLongAs: [ () => Boolean(isRepo() && $("#repository-container-header .Label").textContent.startsWith("Public")) ],
      include: [ () => isSingleFile() && /\.html?$/.test(location.pathname) ],
      exclude: [ isEnterprise ],
      deduplicate: ".rgh-html-preview-link",
      init: function() {
        const rawButton = select_dom("a#raw-url");
        rawButton.parentElement.prepend(dom_chef.createElement("a", {
          className: "btn btn-sm BtnGroup-item rgh-html-preview-link",
          href: `https://refined-github-html-preview.kidonng.workers.dev${rawButton.pathname}`
        }, "Preview"));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-labels-on-dashboard.tsx", {
      include: [ isDashboard ],
      init: function(signal) {
        observe(".news :not(a) > .IssueLabel", linkifyLabel, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-user-location.tsx", {
      awaitDomReady: !1,
      init: function() {
        observe([ '[itemprop="homeLocation"] svg.octicon-location', '[aria-label="user location"] svg.octicon-location' ], addLocation);
      }
    });
    var r = function(r, a) {
      return a >= r ? Math.floor(a / r) : 0;
    };
    const fresh = [ "Freshly baked", "Freshly brewed", "Newly minted", "Hot off the presses", "Straight out of the oven", "Still hot", "Smells fresh", "Just a baby", "It’s my birthday", "Brand spanking new", "It’s a new world ✨", "Certified Fresh Repo™", "So it begins, the great battle of our time" ], dateFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }), getFirstCommit = webext_storage_cache.function((async () => {
      const {repository} = await v4("\n\t\trepository() {\n\t\t\tdefaultBranchRef {\n\t\t\t\ttarget {\n\t\t\t\t\t... on Commit {\n\t\t\t\t\t\toid\n\t\t\t\t\t\tcommittedDate\n\t\t\t\t\t\tresourcePath\n\t\t\t\t\t\thistory {\n\t\t\t\t\t\t\ttotalCount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"), {oid: commitSha, history, committedDate, resourcePath} = repository.defaultBranchRef.target, commitsCount = history.totalCount;
      return 1 === commitsCount ? [ committedDate, resourcePath ] : (async (commitSha, commitsCount) => {
        const {repository} = await v4(`\n\t\trepository() {\n\t\t\tdefaultBranchRef {\n\t\t\t\ttarget {\n\t\t\t\t\t... on Commit {\n\t\t\t\t\t\thistory(first: 5, after: "${commitSha} ${commitsCount - Math.min(6, commitsCount)}") {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tcommittedDate\n\t\t\t\t\t\t\t\tresourcePath\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`), {committedDate, resourcePath} = repository.defaultBranchRef.target.history.nodes.reverse().find((commit => new Date(commit.committedDate).getFullYear() > 1970));
        return [ committedDate, resourcePath ];
      })(commitSha, commitsCount);
    }), {
      cacheKey: () => "first-commit:" + github_helpers_getRepo().nameWithOwner
    });
    async function loadCommitPatch(commitUrl) {
      const {textContent} = await v3(commitUrl, {
        json: !1,
        headers: {
          Accept: "application/vnd.github.v3.patch"
        }
      });
      return textContent;
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/repo-age.tsx", {
      include: [ isRepoRoot ],
      exclude: [ isEmptyRepoRoot ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        const [firstCommitDate, firstCommitHref] = await getFirstCommit(), birthday = new Date(firstCommitDate), [value, unit] = function(a, e) {
          e || (e = Date.now());
          var n = (e - a) / 1e3, o = r(60, n), t = r(60, o), u = r(24, t), f = r(7, u), h = r(30, u), i = r(12, h), c = i, d = "year";
          if (n <= 1) return "just now";
          i > 0 ? (c = i, d = "year") : h > 0 ? (c = h, d = "month") : f > 0 ? (c = f, d = "week") : u > 0 ? (c = u, 
          d = "day") : t > 0 ? (c = t, d = "hour") : o > 0 ? (c = o, d = "minute") : n > 0 && (c = n, 
          d = "second");
          var l = Math.floor(c);
          return (1 === l ? c === t ? "an" : "a" : l) + " " + d + (l > 1 ? "s" : "") + " ago";
        }(birthday.getTime()).replace("just now", "1 second").replace(/^an?/, "1").split(" "), age = Date.now() - birthday.getTime() < 1e8 ? fresh[Math.floor(Math.random() * fresh.length)] : dom_chef.createElement(dom_chef.Fragment, null, dom_chef.createElement("strong", null, value), " ", unit, " old");
        (await elementReady(".BorderGrid .octicon-repo-forked")).closest(".mt-2").append(dom_chef.createElement("h3", {
          className: "sr-only"
        }, "Repository age"), dom_chef.createElement("div", {
          className: "mt-2"
        }, dom_chef.createElement("a", {
          href: firstCommitHref,
          className: "Link--muted",
          title: `First commit dated ${dateFormatter.format(birthday)}`
        }, dom_chef.createElement(RepoIcon, {
          className: "mr-2"
        }), " ", age)));
      }
    });
    const getLastCommitDate = webext_storage_cache.function((async login => {
      for await (const page of async function*(query, options) {
        for (;;) {
          const response = await v3(query, options);
          yield response;
          const match = /<([^>]+)>; rel="next"/.exec(response.headers.get("link"));
          if (!match) return;
          query = match[1];
        }
      }(`/users/${login}/events`)) for (const event of page) if ("PushEvent" === event.type) for (const commit of event.payload.commits.reverse()) {
        const response = await v3(commit.url, {
          ignoreHTTPStatus: !0
        });
        if (404 === response.httpStatus) break;
        if (!response.ok) throw await getError(response);
        if (response.author?.id !== event.actor.id) continue;
        const patch = await loadCommitPatch(commit.url);
        if (patch.startsWith(`From ${commit.sha} `)) return /^Date: (.*)$/m.exec(patch)?.[1] ?? !1;
      }
      return !1;
    }), {
      maxAge: {
        days: 10
      },
      staleWhileRevalidate: {
        days: 20
      },
      cacheKey: ([login]) => "last-commit:" + login
    });
    async function display({datePromise, placeholder, container}) {
      const date = await datePromise;
      if (!date) return placeholder.textContent = "Timezone unknown", void (container.title = "Timezone couldn’t be determined from their last commits");
      const userTime = new Date;
      userTime.setMinutes(function(date) {
        const [, hourString, minuteString] = /([-+]\d\d)(\d\d)$/.exec(date) ?? [], hours = Number.parseInt(hourString, 10), minutes = Number.parseInt(minuteString, 10);
        return 60 * hours + (hours < 0 ? -minutes : minutes);
      }(date) + userTime.getTimezoneOffset() + userTime.getMinutes());
      const timeFormatter = new Intl.DateTimeFormat(void 0, {
        hour: "numeric",
        minute: "numeric",
        weekday: userTime.getDay() === (new Date).getDay() ? void 0 : "long"
      });
      placeholder.textContent = timeFormatter.format(userTime), container.title = `Timezone guessed from their last commit: ${date}`;
    }
    async function insertUserLocalTime(hovercardContainer) {
      const hovercard = hovercardContainer.closest("div.Popover-message");
      if (!select_dom.exists('[data-hydro-view*="user-hovercard-hover"]', hovercard)) return;
      if (select_dom.exists("profile-timezone", hovercard)) return;
      const login = select_dom("a.Link--primary", hovercard)?.pathname.slice(1);
      if (!login || login === github_helpers_getUsername()) return;
      const datePromise = getLastCommitDate(login);
      if (!1 === await Promise.race([ delay_default()(300), datePromise ])) return;
      const placeholder = dom_chef.createElement("span", {
        className: "ml-1"
      }, "Guessing local time…"), container = dom_chef.createElement("section", {
        "aria-label": "user local time",
        className: "mt-1 color-fg-muted text-small d-flex flex-items-center"
      }, dom_chef.createElement(ClockIcon, null), " ", placeholder), hovercardHeight = hovercard.offsetHeight;
      if (hovercardContainer.classList.add("rgh-user-local-time-added"), hovercardContainer.append(container), 
      hovercard.matches(".Popover-message--bottom-right, .Popover-message--bottom-left")) {
        const diff = hovercard.offsetHeight - hovercardHeight;
        if (diff > 0) {
          const parent = hovercard.parentElement, top = Number.parseInt(parent.style.top, 10);
          parent.style.top = top - diff + "px";
        }
      }
      display({
        datePromise,
        placeholder,
        container
      });
    }
    const user_local_time_selector = [ ".js-hovercard-content .Popover-message div.d-flex.mt-3.overflow-hidden > div.d-flex", ".js-hovercard-content .Popover-message div.d-flex.mt-3 > div.overflow-hidden.ml-3" ].join(",");
    function prefixUserMention(userMention) {
      return "@" + userMention.replace("@", "");
    }
    function mentionUser({delegateTarget: button}) {
      const userMention = button.parentElement.querySelector("img").alt, newComment = select_dom("textarea#new_comment_field");
      newComment.focus(), newComment.selectionStart = newComment.selectionEnd;
      const precedingCharacter = newComment.value.slice(newComment.selectionStart - 1, newComment.selectionStart);
      insert(newComment, `${/\s|^$/.test(precedingCharacter) ? "" : " "}${prefixUserMention(userMention)} `);
    }
    async function extend_conversation_status_filters_init() {
      await elementReady(".table-list-filters"), function() {
        if (isPRList()) for (const lastLink of select_dom.all(".table-list-header-toggle.states a:last-child")) {
          const lastLinkQuery = SearchQuery.from(lastLink);
          if (lastLinkQuery.includes("is:merged")) {
            lastLink.lastChild.textContent = lastLink.lastChild.textContent.replace("Total", "Merged");
            continue;
          }
          if (lastLinkQuery.includes("is:unmerged")) {
            lastLink.lastChild.textContent = lastLink.lastChild.textContent.replace("Total", "Unmerged");
            continue;
          }
          const mergeLink = lastLink.cloneNode(!0);
          mergeLink.textContent = "Merged", mergeLink.classList.toggle("selected", SearchQuery.from(location).includes("is:merged")), 
          mergeLink.href = SearchQuery.from(mergeLink).replace("is:closed", "is:merged").href, 
          lastLink.after(" ", mergeLink);
        }
      }(), function() {
        for (const link of select_dom.all(".table-list-header-toggle.states a")) select_dom(".octicon", link)?.remove(), 
        link.classList.contains("selected") && (link.prepend(dom_chef.createElement(CheckIcon, null)), 
        link.href = SearchQuery.from(link).remove("is:open", "is:closed", "is:merged", "is:unmerged").href);
      }();
    }
    async function oneEvent(target, type, options = {}) {
      if ("boolean" == typeof options) {
        options = {
          capture: options
        };
      }
      return options.once = !0, new Promise((resolve => {
        target.addEventListener(type, resolve, options);
      }));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/user-local-time.tsx", {
      awaitDomReady: !1,
      init: function(signal) {
        observe(user_local_time_selector, insertUserLocalTime, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-mention.tsx", {
      include: [ isConversation ],
      exclude: [ isArchivedRepo ],
      init: function(signal) {
        delegate_it(document, "button.rgh-quick-mention", "click", mentionUser, {
          signal
        }), observe(`\n\t\t:is(\n\t\t\tdiv.TimelineItem-avatar > [data-hovercard-type="user"]:first-child,\n\t\t\ta.TimelineItem-avatar\n\t\t):not([href="/${github_helpers_getUsername()}"])\n\t`, (avatar => {
          const timelineItem = avatar.closest(".TimelineItem");
          if (select_dom.exists(".minimized-comment", timelineItem) || !select_dom.exists(".timeline-comment", timelineItem)) return;
          avatar.classList.contains("TimelineItem-avatar") && (avatar.classList.remove("TimelineItem-avatar"), 
          wrap(avatar, dom_chef.createElement("div", {
            className: "avatar-parent-child TimelineItem-avatar d-none d-md-block"
          })));
          const userMention = select_dom("img", avatar).alt;
          avatar.classList.add("rgh-quick-mention"), avatar.after(dom_chef.createElement("button", {
            type: "button",
            className: "rgh-quick-mention tooltipped tooltipped-e btn-link",
            "aria-label": `Mention ${prefixUserMention(userMention)} in a new comment`
          }, dom_chef.createElement(ReplyIcon, null)));
        }), {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/extend-conversation-status-filters.tsx", {
      include: [ isRepoIssueOrPRList ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: extend_conversation_status_filters_init
    }, {
      include: [ isGlobalIssueOrPRList ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: extend_conversation_status_filters_init
    });
    async function handleAltClick({altKey, delegateTarget}) {
      if (!altKey) return;
      let paginationButton = delegateTarget, wrapper = paginationButton.form.parentElement;
      const isExpandingMainThread = "js-progressive-timeline-item-container" === wrapper.id;
      for (;paginationButton; ) await oneEvent(paginationButton.form, "page:loaded"), 
      isExpandingMainThread && (wrapper = wrapper.lastElementChild), paginationButton = select_dom(':scope > .ajax-pagination-form button[type="submit"]', wrapper), 
      paginationButton?.click();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/expand-all-hidden-comments.tsx", {
      include: [ isConversation ],
      init: function(signal) {
        delegate_it(document, '.ajax-pagination-form button[type="submit"]', "click", handleAltClick, {
          signal
        });
      }
    });
    const supportedLabels = /^(bug|bug-?fix|confirmed-bug|type[:/]bug|kind[:/]bug|(:[\w-]+:|\p{Emoji})bug)$/iu, getBugLabelCacheKey = () => "bugs-label:" + github_helpers_getRepo().nameWithOwner, getBugLabel = async () => webext_storage_cache.get(getBugLabelCacheKey());
    async function countBugsWithUnknownLabel() {
      const {repository} = await v4('\n\t\trepository() {\n\t\t\tlabels(query: "bug", first: 10) {\n\t\t\t\tnodes {\n\t\t\t\t\tname\n\t\t\t\t\tissues(states: OPEN) {\n\t\t\t\t\t\ttotalCount\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t'), label = repository.labels.nodes.find((label2 => (label => supportedLabels.test(label.replace(/\s/g, "")))(label2.name)));
      return label ? (webext_storage_cache.set(getBugLabelCacheKey(), label.name ?? !1), 
      label.issues.totalCount ?? 0) : 0;
    }
    const countBugs = webext_storage_cache.function((async () => {
      const bugLabel = await getBugLabel();
      return bugLabel ? async function(label) {
        const {repository} = await v4(`\n\t\trepository() {\n\t\t\tlabel(name: "${label}") {\n\t\t\t\tissues(states: OPEN) {\n\t\t\t\t\ttotalCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`);
        return repository.label?.issues.totalCount ?? 0;
      }(bugLabel) : countBugsWithUnknownLabel();
    }), {
      maxAge: {
        minutes: 30
      },
      staleWhileRevalidate: {
        days: 4
      },
      cacheKey: () => "bugs:" + github_helpers_getRepo().nameWithOwner
    });
    async function getSearchQueryBugLabel() {
      return "label:" + SearchQuery.escapeValue(await getBugLabel() ?? "bug");
    }
    async function isBugsListing() {
      return SearchQuery.from(location).includes(await getSearchQueryBugLabel());
    }
    function highlightBugsTab() {
      unhighlightTab(select_dom('.UnderlineNav-item[data-hotkey="g i"]')), highlightTab(select_dom(".rgh-bugs-tab"));
    }
    async function updateBugsTagHighlighting() {
      if (0 === await countBugs()) return !1;
      const bugLabel = await getBugLabel() ?? "bug";
      return isRepoTaxonomyIssueOrPRList() && location.href.endsWith("/labels/" + encodeURIComponent(bugLabel)) || isRepoIssueList() && await isBugsListing() ? (async function() {
        (await elementReady(".js-pinned-issues-reorder-container", {
          waitForChildren: !1
        }))?.remove();
      }(), void highlightBugsTab()) : !(!isIssue() || !await elementReady(`#partial-discussion-sidebar .IssueLabel[data-name="${bugLabel}"]`)) && void highlightBugsTab();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/bugs-tab.tsx", {
      include: [ isRepo ],
      awaitDomReady: !1,
      init: async function() {
        select_dom.exists(".rgh-bugs-tab") || await async function() {
          const countPromise = countBugs();
          if (!await isBugsListing() && 0 === await countPromise) return !1;
          const issuesTab = await elementReady('a.UnderlineNav-item[data-hotkey="g i"]', {
            waitForChildren: !1
          });
          if (!issuesTab) return !1;
          const bugsTab = issuesTab.cloneNode(!0);
          bugsTab.classList.add("rgh-bugs-tab"), unhighlightTab(bugsTab), delete bugsTab.dataset.hotkey, 
          delete bugsTab.dataset.selectedLinks, bugsTab.removeAttribute("id");
          const bugsTabTitle = select_dom("[data-content]", bugsTab);
          bugsTabTitle.dataset.content = "Bugs", bugsTabTitle.textContent = "Bugs", select_dom(".octicon", bugsTab).replaceWith(dom_chef.createElement(BugIcon, {
            className: "UnderlineNav-octicon d-none d-sm-inline"
          }));
          const bugsCounter = select_dom(".Counter", bugsTab);
          bugsCounter.textContent = "0", bugsCounter.title = "", bugsTab.href = SearchQuery.from(bugsTab).add(await getSearchQueryBugLabel()).href, 
          issuesTab.parentElement instanceof HTMLLIElement ? issuesTab.parentElement.after(dom_chef.createElement("li", {
            className: "d-flex"
          }, bugsTab)) : issuesTab.after(bugsTab), window.dispatchEvent(new Event("resize"));
          try {
            const bugCount = await countPromise;
            bugsCounter.textContent = abbreviateNumber(bugCount), bugsCounter.title = bugCount > 999 ? String(bugCount) : "";
          } catch (error) {
            throw bugsCounter.remove(), error;
          }
        }(), await updateBugsTagHighlighting();
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/cross-deleted-pr-branches.tsx", {
      include: [ isPRConversation ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const lastBranchAction = select_dom.last(".TimelineItem-body .user-select-contain.commit-ref"), headReferenceLink = select_dom(".head-ref a");
        if (!headReferenceLink && !lastBranchAction) return;
        if (!lastBranchAction?.closest(".TimelineItem-body").textContent.includes(" deleted ")) return !1;
        const deletedBranchName = lastBranchAction.textContent.trim(), repoRootUrl = headReferenceLink?.href.split("/", 5).join("/");
        for (const element of select_dom.all(".commit-ref")) {
          if (element.textContent.trim() === deletedBranchName) {
            if (element.title = "This branch has been deleted", !headReferenceLink) continue;
            element.classList.contains("head-ref") ? select_dom("a", element).href = repoRootUrl : wrap(element, dom_chef.createElement("a", {
              href: repoRootUrl
            }));
          }
        }
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/repo-wide-file-finder.tsx", {
      include: [ isRepo ],
      exclude: [ () => select_dom.exists('[data-hotkey="t"]'), isEmptyRepo, isPRFiles, isFileFinder ],
      deduplicate: "has-rgh",
      init: async function() {
        document.body.append(dom_chef.createElement("a", {
          hidden: !0,
          "data-hotkey": "t",
          "data-turbo-frame": "repo-content-turbo-frame",
          href: buildRepoURL("find", getCurrentCommittish() ?? await getDefaultBranch())
        }));
      }
    });
    const getBufferField = node_modules_onetime((() => dom_chef.createElement("input", {
      type: "text",
      className: "p-0 border-0",
      style: {
        backgroundColor: "transparent",
        outline: 0,
        color: "var(--color-fg-default)"
      },
      placeholder: "Search file…"
    })));
    function pjaxStartHandler(event) {
      const destinationURL = event.detail?.url;
      if (!destinationURL || !isFileFinder(new URL(destinationURL))) return;
      const bufferField = getBufferField();
      bufferField.value = "", select_dom('.pagehead h1 strong, [itemprop="name"]').after(dom_chef.createElement("span", {
        className: "mr-1 ml-n1 flex-self-stretch color-fg-muted"
      }, "/"), dom_chef.createElement("span", {
        className: "flex-self-stretch mr-2"
      }, bufferField)), bufferField.focus(), document.documentElement.classList.add("rgh-file-finder-buffer");
    }
    function pjaxCompleteHandler() {
      const bufferField = getBufferField(), fileFinderInput = select_dom("input#tree-finder-field");
      fileFinderInput && (fileFinderInput.value = bufferField.value, fileFinderInput.selectionStart = bufferField.selectionStart, 
      fileFinderInput.selectionEnd = bufferField.selectionEnd, fileFinderInput.dispatchEvent(new Event("input"))), 
      document.documentElement.classList.contains("rgh-file-finder-buffer") && (bufferField.parentElement.previousElementSibling.remove(), 
      bufferField.parentElement.remove(), document.documentElement.classList.remove("rgh-file-finder-buffer"));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/file-finder-buffer.tsx", {
      include: [ isRepo ],
      exclude: [ isSafari ],
      awaitDomReady: !1,
      init: function(signal) {
        window.addEventListener("turbo:visit", pjaxStartHandler, {
          signal
        }), window.addEventListener("turbo:render", pjaxCompleteHandler, {
          signal
        });
      }
    });
    const getCommitChanges = webext_storage_cache.function((async commit => {
      const {repository} = await v4(`\n\t\trepository() {\n\t\t\tobject(expression: "${commit}") {\n\t\t\t\t... on Commit {\n\t\t\t\t\tadditions\n\t\t\t\t\tdeletions\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`);
      return [ repository.object.additions, repository.object.deletions ];
    }), {
      cacheKey: ([commit]) => "commit-changes:" + commit
    });
    function getLinkCopy(count) {
      return pluralize(count, "one open pull request", "at least $$ open pull requests");
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pr-commit-lines-changed.tsx", {
      include: [ isPRCommit ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        const commitSha = location.pathname.split("/").pop(), [additions, deletions] = await getCommitChanges(commitSha), tooltip = pluralize(additions + deletions, "1 line changed", "$$ lines changed");
        (await elementReady(".diffstat", {
          waitForChildren: !1
        })).replaceWith(dom_chef.createElement("span", {
          className: "ml-2 diffstat tooltipped tooltipped-s",
          "aria-label": tooltip
        }, dom_chef.createElement("span", {
          className: "color-fg-success"
        }, "+", additions), " ", dom_chef.createElement("span", {
          className: "color-fg-danger"
        }, "−", deletions), " ", dom_chef.createElement("span", {
          className: "diffstat-block-neutral"
        }), dom_chef.createElement("span", {
          className: "diffstat-block-neutral"
        }), dom_chef.createElement("span", {
          className: "diffstat-block-neutral"
        }), dom_chef.createElement("span", {
          className: "diffstat-block-neutral"
        }), dom_chef.createElement("span", {
          className: "diffstat-block-neutral"
        })));
      }
    });
    const countPRs = webext_storage_cache.function((async forkedRepo => {
      const {search} = await v4(`\n\t\tsearch(\n\t\t\tfirst: 100,\n\t\t\ttype: ISSUE,\n\t\t\tquery: "is:pr is:open archived:false repo:${forkedRepo} author:${github_helpers_getUsername()}"\n\t\t) {\n\t\t\tnodes {\n\t\t\t\t... on PullRequest {\n\t\t\t\t\tnumber\n\t\t\t\t\theadRepository {\n\t\t\t\t\t\tnameWithOwner\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`), prs = search.nodes.filter((pr => pr.headRepository.nameWithOwner === github_helpers_getRepo().nameWithOwner));
      return 1 === prs.length ? [ 1, prs[0].number ] : [ prs.length ];
    }), {
      maxAge: {
        hours: 1
      },
      staleWhileRevalidate: {
        days: 2
      },
      cacheKey: ([forkedRepo]) => `prs-on-forked-repo:${forkedRepo}:${github_helpers_getRepo().nameWithOwner}`
    });
    async function getPRs() {
      if (await elementReady(".UnderlineNav-body"), !canUserEditRepo()) return [];
      const forkedRepo = getForkedRepo(), [count, firstPr] = await countPRs(forkedRepo);
      if (1 === count) return [ count, `/${forkedRepo}/pull/${firstPr}` ];
      const url = new URL(`/${forkedRepo}/pulls`, location.origin);
      return url.searchParams.set("q", "is:pr is:open sort:updated-desc author:@me"), 
      [ count, url.href ];
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/show-open-prs-of-forks.tsx", {
      asLongAs: [ isForkedRepo ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const [count, url] = await getPRs();
        if (!count) return !1;
        select_dom(`[data-hovercard-type="repository"][href="/${getForkedRepo()}"]`).after(dom_chef.createElement(dom_chef.Fragment, null, " with ", dom_chef.createElement("a", {
          href: url,
          className: "rgh-open-prs-of-forks"
        }, getLinkCopy(count))));
      }
    }, {
      asLongAs: [ isForkedRepo ],
      include: [ (url = location) => "settings" === getRepo(url)?.path ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const [count, url] = await getPRs();
        if (!count) return !1;
        select_dom('details-dialog[aria-label*="Delete"] .Box-body p:first-child').after(dom_chef.createElement("p", {
          className: "flash flash-warn"
        }, "It will also abandon ", dom_chef.createElement("a", {
          href: url
        }, "your ", getLinkCopy(count)), " in ", dom_chef.createElement("strong", null, getForkedRepo()), " and you’ll no longer be able to edit ", 1 === count ? "it" : "them", "."));
      }
    });
    const getPullRequestBlameCommit = mem((async (commit, prNumbers, currentFilename) => {
      const {repository} = await v4(`\n\t\trepository() {\n\t\t\tfile: object(expression: "${commit}:${currentFilename}") {\n\t\t\t\tid\n\t\t\t}\n\t\t\tobject(expression: "${commit}") {\n\t\t\t\t... on Commit {\n\t\t\t\t\tassociatedPullRequests(last: 1) {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\tnumber\n\t\t\t\t\t\t\tmergeCommit {\n\t\t\t\t\t\t\t\toid\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tcommits(last: 1) {\n\t\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\t\tcommit {\n\t\t\t\t\t\t\t\t\t\toid\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`), associatedPR = repository.object.associatedPullRequests.nodes[0];
      if (!associatedPR || !prNumbers.includes(associatedPR.number) || associatedPR.mergeCommit.oid !== commit) throw new Error("The PR linked in the title didn’t create this commit");
      if (!repository.file) throw new Error("The file was renamed and Refined GitHub can’t find it");
      return associatedPR.commits.nodes[0].commit.oid;
    }));
    async function redirectToBlameCommit(event) {
      const blameElement = event.delegateTarget;
      if (blameElement instanceof HTMLAnchorElement && !event.altKey) return;
      event.preventDefault(), blameElement.blur();
      const blameHunk = blameElement.closest(".blame-hunk"), prNumbers = select_dom.all(".issue-link", blameHunk).map((pr => looseParseInt(pr))), prCommit = select_dom("a.message", blameHunk).pathname.split("/").pop(), blameUrl = new GitHubURL(location.href);
      await showToast((async () => {
        blameUrl.branch = await getPullRequestBlameCommit(prCommit, prNumbers, blameUrl.filePath), 
        blameUrl.hash = "L" + select_dom(".js-line-number", blameHunk).textContent, location.href = blameUrl.href;
      }), {
        message: "Fetching pull request",
        doneMessage: "Redirecting"
      });
    }
    let previousFile;
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/deep-reblame.tsx", {
      include: [ isBlame ],
      init: function(signal) {
        delegate_it(document, ".rgh-deep-reblame", "click", redirectToBlameCommit, {
          signal
        }), observe('[data-hovercard-type="pull_request"]', (pullRequest => {
          const hunk = pullRequest.closest(".blame-hunk"), reblameLink = select_dom(".reblame-link", hunk);
          reblameLink ? (reblameLink.setAttribute("aria-label", "View blame prior to this change. Hold `Alt` to extract commits from this PR first"), 
          reblameLink.classList.add("rgh-deep-reblame")) : select_dom(".blob-reblame", hunk).append(dom_chef.createElement("button", {
            type: "button",
            "aria-label": "View blame prior to this change (extracts commits from this PR first)",
            className: "reblame-link btn-link no-underline tooltipped tooltipped-e d-inline-block pr-1 rgh-deep-reblame"
          }, dom_chef.createElement(VersionsIcon, null)));
        }), {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clear-pr-merge-commit-message.tsx", {
      include: [ isPRConversation ],
      exclude: [ () => 1 === select_dom.all(".TimelineItem.js-commit").length ],
      additionalListeners: [ onPrMergePanelOpen ],
      onlyAdditionalListeners: !0,
      awaitDomReady: !1,
      init: async function() {
        const messageField = select_dom("textarea#merge_message_field"), originalMessage = messageField.value, preservedContent = new Set;
        for (const [, author] of originalMessage.matchAll(/co-authored-by: ([^\n]+)/gi)) preservedContent.add("Co-authored-by: " + author);
        if (getBranches().base !== await getDefaultBranch()) for (const keyword of select_dom.all('.comment-body .issue-keyword[aria-label^="This pull request closes"]')) {
          const closingKeyword = keyword.textContent.trim(), issueLink = keyword.nextElementSibling;
          preservedContent.add(closingKeyword + " " + issueLink.href);
        }
        const cleanedMessage = [ ...preservedContent ].join("\n");
        if (cleanedMessage === originalMessage.trim()) return !1;
        messageField.value = cleanedMessage, messageField.after(dom_chef.createElement("p", {
          className: "note"
        }, "The description field was cleared by ", dom_chef.createElement("a", {
          target: "_blank",
          href: "https://github.com/refined-github/refined-github/wiki/Extended-feature-descriptions#clear-pr-merge-commit-message",
          rel: "noreferrer"
        }, "Refined GitHub"), "."), dom_chef.createElement("hr", null));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/action-used-by-link.tsx", {
      include: [ (url = location) => url.pathname.startsWith("/marketplace/actions/") ],
      deduplicate: "has-rgh",
      init: function() {
        const actionRepo = selectHas("aside a:has(.octicon-repo)").pathname.slice(1), actionURL = new URL("search", location.origin);
        actionURL.search = new URLSearchParams({
          q: `${actionRepo} path:.github/workflows/ language:YAML`,
          type: "Code",
          s: "indexed",
          o: "desc"
        }).toString(), select_dom('.d-block.mb-2[href^="/contact"]').after(dom_chef.createElement("a", {
          href: actionURL.href,
          className: "d-block mb-2"
        }, dom_chef.createElement(SearchIcon, {
          width: 14,
          className: "color-fg-default mr-2"
        }), "Usage examples"));
      }
    });
    let runningBatch = !1;
    function remember(event) {
      runningBatch || (previousFile = event.delegateTarget.closest(".js-file"));
    }
    function isChecked(file) {
      return file.querySelector("input.js-reviewed-checkbox").checked;
    }
    function batchToggle(event) {
      if (!event.shiftKey) return;
      event.preventDefault(), event.stopImmediatePropagation();
      const files = select_dom.all(".js-file"), thisFile = event.delegateTarget.closest(".js-file"), isThisBeingFileChecked = !isChecked(thisFile);
      runningBatch = !0;
      const selectedFiles = function(items, previous, current) {
        const start = previous ? items.indexOf(previous) : 0, end = items.indexOf(current);
        return items.slice(Math.min(start, end), Math.max(start, end) + 1);
      }(files, previousFile, thisFile);
      for (const file of selectedFiles) file !== thisFile && isChecked(file) !== isThisBeingFileChecked && select_dom(".js-reviewed-checkbox", file).click();
      runningBatch = !1;
    }
    const markAsViewed = click_all((function(target) {
      return ".js-reviewed-checkbox" + (isChecked(target) ? "[checked]" : ":not([checked])");
    }));
    function onAltClick(event) {
      event.altKey && event.isTrusted && showToast((async () => {
        markAsViewed(event);
      }), {
        message: isChecked(event.delegateTarget) ? "Marking visible files as unviewed" : "Marking visible files as viewed",
        doneMessage: "Marking files completed"
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/batch-mark-files-as-viewed.tsx", {
      awaitDomReady: !1,
      include: [ isPRFiles ],
      init: function(signal) {
        delegate_it(document, ".js-reviewed-toggle", "click", onAltClick, {
          signal
        }), delegate_it(document, ".js-reviewed-toggle", "mousedown", batchToggle, {
          signal
        }), delegate_it(document, ".js-toggle-user-reviewed-file-form", "submit", remember, {
          signal
        }), onAbort(signal, (() => {
          previousFile = void 0;
        }));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/unwrap-unnecessary-dropdowns.tsx", {
      include: [ isNotifications ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        await elementReady(".js-check-all-container > :first-child");
        const forms = select_dom.all('[action="/notifications/beta/update_view_preference"]');
        if (0 === forms.length) return !1;
        if (forms.length > 2) throw new Error("GitHub added new view types. This feature is obsolete.");
        const dropdown = forms[0].closest("details"), desiredForm = "Date" === select_dom("summary i", dropdown).nextSibling.textContent.trim() ? forms[0] : forms[1];
        !function(dropdown, form) {
          dropdown.replaceWith(form), form.classList.add(...dropdown.classList), form.classList.remove("dropdown", "details-reset", "details-overlay");
        }(dropdown, desiredForm);
        const button = select_dom('[type="submit"]', desiredForm);
        button.className = "btn", button.textContent = `Group by ${button.textContent.toLowerCase()}`;
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-notification-repository-header.tsx", {
      include: [ isNotifications ],
      exclude: [ isBlank ],
      deduplicate: "has-rgh",
      init: function() {
        for (const header of select_dom.all(".js-notifications-group h6")) header.append(dom_chef.createElement("a", {
          className: "color-fg-inherit",
          href: "/" + header.textContent.trim()
        }, header.firstChild));
      }
    });
    function stop_redirecting_in_notification_bar_handleClick(event) {
      const redirectDisabled = event.altKey || "true" === sessionStorage.rghIsNewTab;
      event.delegateTarget.form.toggleAttribute("data-redirect-to-inbox-on-submit", !redirectDisabled);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/stop-redirecting-in-notification-bar.tsx", {
      include: [ () => location.search.startsWith("?notification_referrer_id=") || JSON.parse(sessionStorage.getItem("notification_shelf") ?? "{}").pathname === location.pathname ],
      awaitDomReady: !1,
      init: function(signal) {
        sessionStorage.rghIsNewTab = 1 === history.length, delegate_it(document, ".notification-shelf .js-notification-action button", "click", stop_redirecting_in_notification_bar_handleClick, {
          signal
        });
      }
    });
    const currentRepo = github_helpers_getRepo() ?? {
      nameWithOwner: "refined-github/refined-github"
    };
    function getRepoReference(repoNameWithOwner, delemiter = "") {
      return repoNameWithOwner === currentRepo.nameWithOwner ? "" : repoNameWithOwner + delemiter;
    }
    const escapeRegex = string => string.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"), prCommitUrlRegex = new RegExp("\\b" + escapeRegex(location.origin) + /[/]([^/]+[/][^/]+)[/]pull[/](\d+)[/]commits[/]([\da-f]{7})[\da-f]{33}(?:#[\w-]+)?\b/.source, "gi"), prCompareUrlRegex = new RegExp("\\b" + escapeRegex(location.origin) + /[/]([^/]+[/][^/]+)[/]compare[/](.+)(#diff-[\da-fR-]+)/.source, "gi"), discussionUrlRegex = new RegExp("\\b" + escapeRegex(location.origin) + /[/]([^/]+[/][^/]+)[/]discussions[/](\d+)[?][^#\s]+(#[\w-]+)?\b/.source, "gi");
    function preventPrCommitLinkLoss(url, repoNameWithOwner, pr, commit, index, fullText) {
      return ")" === fullText[index + url.length] ? url : `[${getRepoReference(repoNameWithOwner, "@")}\`${commit}\` (#${pr})](${url})`;
    }
    function preventPrCompareLinkLoss(url, repoNameWithOwner, compare, hash, index, fullText) {
      return ")" === fullText[index + url.length] ? url : `[${getRepoReference(repoNameWithOwner, "@")}\`${compare}\`${hash.slice(0, 16)}](${url})`;
    }
    function preventDiscussionLinkLoss(url, repoNameWithOwner, discussion, comment, index, fullText) {
      return ")" === fullText[index + url.length] ? url : `[${getRepoReference(repoNameWithOwner)}#${discussion}${comment ? " (comment)" : ""}](${url})`;
    }
    function handleButtonClick({delegateTarget: fixButton}) {
      const field = fixButton.form.querySelector("textarea.js-comment-field");
      replace(field, prCommitUrlRegex, preventPrCommitLinkLoss), replace(field, prCompareUrlRegex, preventPrCompareLinkLoss), 
      replace(field, discussionUrlRegex, preventDiscussionLinkLoss), fixButton.parentElement.remove();
    }
    function prevent_link_loss_getUI(field) {
      return select_dom(".rgh-prevent-link-loss-container", field.form) ?? dom_chef.createElement("div", {
        className: "flash flash-warn rgh-prevent-link-loss-container"
      }, dom_chef.createElement(AlertIcon, null), " Your link may be ", dom_chef.createElement("a", {
        href: "https://github.com/refined-github/refined-github/wiki/GitHub-markdown-linkifier-bug",
        target: "_blank",
        rel: "noopener noreferrer",
        "data-hovercard-type": "issue"
      }, "misinterpreted"), " by GitHub.", dom_chef.createElement("button", {
        type: "button",
        className: "btn btn-sm primary flash-action rgh-prevent-link-loss"
      }, "Fix link"));
    }
    const prevent_link_loss_updateUI = debounce_fn((({delegateTarget: field}) => {
      var value;
      (value = field.value) === value.replace(prCommitUrlRegex, preventPrCommitLinkLoss) && value === value.replace(prCompareUrlRegex, preventPrCompareLinkLoss) && value === value.replace(discussionUrlRegex, preventDiscussionLinkLoss) ? prevent_link_loss_getUI(field).remove() : isNewIssue() || isNewRelease() || isCompare() ? select_dom("file-attachment", field.form).append(dom_chef.createElement("div", {
        className: "mt-2"
      }, prevent_link_loss_getUI(field))) : select_dom(".form-actions", field.form).before(dom_chef.createElement("div", {
        className: "mx-2 mb-2"
      }, prevent_link_loss_getUI(field)));
    }), {
      wait: 300
    });
    function createBanner(props) {
      return dom_chef.createElement("div", {
        className: [ "flash", ...props.classes ?? "" ].join(" ")
      }, dom_chef.createElement("div", {
        className: "d-sm-flex"
      }, dom_chef.createElement("div", {
        className: "flex-auto"
      }, props.text), props.url && dom_chef.createElement("a", {
        href: props.url,
        className: "flex-shrink-0 btn btn-sm ml-sm-3 mt-2 mt-sm-n2 mb-sm-n2 mr-sm-n1 flex-self-center"
      }, props.buttonLabel)));
    }
    function TimelineItem() {
      return dom_chef.createElement("div", {
        className: "ml-0 pl-0 ml-md-6 pl-md-3 mt-3"
      });
    }
    function onConversationHeaderUpdate(callback) {
      const conversationHeader = select_dom("#partial-discussion-header");
      if (!conversationHeader) return;
      const observer = new MutationObserver(callback);
      return observer.observe(conversationHeader.parentElement, {
        childList: !0
      }), observer;
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/prevent-link-loss.tsx", {
      include: [ hasRichTextEditor ],
      init: function(signal) {
        delegate_it(document, "form:is(#new_issue, #new_release) textarea, form.js-new-comment-form textarea, textarea.comment-form-textarea", "input", prevent_link_loss_updateUI, {
          signal
        }), delegate_it(document, ".rgh-prevent-link-loss", "click", handleButtonClick, {
          signal
        });
      }
    });
    const closing_remarks_canCreateRelease = canEditEveryComment, getFirstTag = webext_storage_cache.function((async commit => (await fetch_dom(buildRepoURL("branch_commits", commit), "ul.branches-tag-list li:last-child a"))?.textContent ?? void 0), {
      cacheKey: ([commit]) => `first-tag:${github_helpers_getRepo().nameWithOwner}:${commit}`
    });
    async function addReleaseBanner(text = "Now you can release this change") {
      if (0 === await getReleaseCount()) return;
      const url = closing_remarks_canCreateRelease() ? isRefinedGitHubRepo() ? "https://github.com/refined-github/refined-github/actions/workflows/release.yml" : buildRepoURL("releases/new") : void 0;
      attachElement("#issue-comment-box", {
        before: () => dom_chef.createElement(TimelineItem, null, createBanner({
          text,
          url,
          buttonLabel: dom_chef.createElement(dom_chef.Fragment, null, dom_chef.createElement(TagIcon, null), " Draft a new release")
        }))
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/closing-remarks.tsx", {
      asLongAs: [ isPRConversation, () => exists("#partial-discussion-header .octicon-git-merge") ],
      additionalListeners: [ onConversationHeaderUpdate ],
      deduplicate: "has-rgh-inner",
      init: async function() {
        const mergeCommit = select_dom(`.TimelineItem.js-details-container.Details a[href^="/${github_helpers_getRepo().nameWithOwner}/commit/" i] > code`).textContent, tagName = await getFirstTag(mergeCommit);
        tagName ? function(tagName) {
          const tagUrl = buildRepoURL("releases/tag", tagName);
          for (const discussionHeader of select_dom.all("#partial-discussion-header relative-time:not(.rgh-first-tag)")) discussionHeader.classList.add("rgh-first-tag"), 
          discussionHeader.parentElement.append(dom_chef.createElement("span", null, dom_chef.createElement(TagIcon, {
            className: "ml-2 mr-1 color-fg-muted"
          }), dom_chef.createElement("a", {
            href: tagUrl,
            className: "commit-ref",
            title: `${tagName} was the first Git tag to include this pull request`
          }, tagName)));
          attachElement("#issue-comment-box", {
            before: () => dom_chef.createElement(TimelineItem, null, createBanner({
              text: dom_chef.createElement(dom_chef.Fragment, null, "The pull request first appeared in ", dom_chef.createElement("span", {
                className: "text-mono text-small"
              }, tagName)),
              classes: [ "flash-success" ],
              url: tagUrl,
              buttonLabel: dom_chef.createElement(dom_chef.Fragment, null, dom_chef.createElement(TagIcon, null), " See release")
            }))
          });
        }(tagName) : addReleaseBanner("The merge commit doesn’t appear in any tags");
      }
    }, {
      asLongAs: [ isPRConversation, isOpenPR, closing_remarks_canCreateRelease ],
      additionalListeners: [ onPrMerge ],
      onlyAdditionalListeners: !0,
      init() {
        addReleaseBanner();
      }
    });
    const getPullRequestsAssociatedWithBranch = webext_storage_cache.function((async () => {
      const {repository} = await v4('\n\t\trepository() {\n\t\t\trefs(refPrefix: "refs/heads/", last: 100) {\n\t\t\t\tnodes {\n\t\t\t\t\tname\n\t\t\t\t\tassociatedPullRequests(last: 1, orderBy: {field: CREATED_AT, direction: DESC}) {\n\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\tnumber\n\t\t\t\t\t\t\tstate\n\t\t\t\t\t\t\tisDraft\n\t\t\t\t\t\t\turl\n\t\t\t\t\t\t\ttimelineItems(last: 1, itemTypes: [HEAD_REF_DELETED_EVENT, HEAD_REF_RESTORED_EVENT]) {\n\t\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\t\t__typename\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t'), pullRequests = {};
      for (const {name, associatedPullRequests} of repository.refs.nodes) {
        const [prInfo] = associatedPullRequests.nodes, headRefWasDeleted = "HeadRefDeletedEvent" === prInfo?.timelineItems.nodes[0]?.__typename;
        prInfo && !headRefWasDeleted && (prInfo.state = prInfo.isDraft && "OPEN" === prInfo.state ? "DRAFT" : prInfo.state, 
        pullRequests[name] = prInfo);
      }
      return pullRequests;
    }), {
      maxAge: {
        hours: 1
      },
      staleWhileRevalidate: {
        days: 4
      },
      cacheKey: () => "associatedBranchPullRequests:" + github_helpers_getRepo().nameWithOwner
    }), stateIcon = {
      OPEN: GitPullRequestIcon,
      CLOSED: GitPullRequestClosedIcon,
      MERGED: GitMergeIcon,
      DRAFT: GitPullRequestDraftIcon
    };
    async function show_associated_branch_prs_on_fork_addLink(branchCompareLink) {
      const prInfo = (await getPullRequestsAssociatedWithBranch())[branchCompareLink.closest("[branch]").getAttribute("branch")];
      prInfo && function(branchCompareLink, prInfo) {
        const StateIcon = stateIcon[prInfo.state], state = upperCaseFirst(prInfo.state);
        branchCompareLink.replaceWith(dom_chef.createElement("div", {
          className: "d-inline-block text-right ml-3"
        }, dom_chef.createElement("a", {
          "data-issue-and-pr-hovercards-enabled": !0,
          href: prInfo.url,
          "data-hovercard-type": "pull_request",
          "data-hovercard-url": prInfo.url + "/hovercard"
        }, "#", prInfo.number), " ", dom_chef.createElement("span", {
          className: `State State--${prInfo.state.toLowerCase()} State--small ml-1`
        }, dom_chef.createElement(StateIcon, {
          width: 14,
          height: 14
        }), " ", state)));
      }(branchCompareLink, prInfo);
    }
    function createReviewLink() {
      const reviewFormUrl = new URL(location.href);
      return reviewFormUrl.pathname += "/files", reviewFormUrl.hash = "review-changes-modal", 
      dom_chef.createElement("span", {
        className: "text-normal"
      }, "– ", dom_chef.createElement("a", {
        href: reviewFormUrl.href,
        className: "btn-link Link--muted",
        "data-hotkey": "v",
        "data-turbo-frame": "repo-content-turbo-frame"
      }, "review now"));
    }
    function addSidebarReviewButton(reviewersSection) {
      attachElement(reviewersSection, {
        append: createReviewLink
      });
    }
    function focusReviewTextarea({delegateTarget}) {
      delegateTarget.open && select_dom("textarea", delegateTarget).focus();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/show-associated-branch-prs-on-fork.tsx", {
      asLongAs: [ isForkedRepo ],
      include: [ (url = location) => Boolean(getRepo(url)?.path.startsWith("branches")) ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(".test-compare-link", show_associated_branch_prs_on_fork_addLink, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-review.tsx", {
      include: [ isPRConversation ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('[aria-label="Select reviewers"] .discussion-sidebar-heading', addSidebarReviewButton, {
          signal
        });
      }
    }, {
      shortcuts: {
        v: "Open PR review popup"
      },
      include: [ isPRFiles ],
      awaitDomReady: !1,
      init: async function(signal) {
        delegate_it(document, ".js-reviews-container > details", "toggle", focusReviewTextarea, {
          capture: !0,
          signal
        });
        const reviewDropdownButton = await elementReady(".js-reviews-toggle");
        reviewDropdownButton && (reviewDropdownButton.dataset.hotkey = "v");
      }
    });
    const isFilePath = () => isSingleFile() || isRepoTree() || ((url = location) => isEditingFile(url) || isNewFile(url) || isDeletingFile(url))();
    async function getEquivalentURL() {
      const forkedRepository = github_helpers_getRepo(getForkedRepo()), defaultUrl = "/" + forkedRepository.nameWithOwner;
      if (isIssue() || isPR() || isRepoRoot() || isSingleTag()) return defaultUrl;
      const sameViewUrl = new GitHubURL(location.href).assign({
        user: forkedRepository.owner,
        repository: forkedRepository.name
      });
      return isFilePath() && (sameViewUrl.branch = await getDefaultBranch(forkedRepository), 
      !await async function(url) {
        const {repository} = await v4(`\n\t\trepository(owner: "${url.user}", name: "${url.repository}") {\n\t\t\tfile: object(expression: "${url.branch}:${url.filePath}") {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t`);
        return Boolean(repository.file);
      }(sameViewUrl)) ? defaultUrl : sameViewUrl.href;
    }
    function jumpToFirstNonViewed() {
      const firstNonViewedFile = select_dom(".file:not([data-file-user-viewed])");
      firstNonViewedFile ? location.replace("#" + firstNonViewedFile.id) : window.scrollTo(window.scrollX, document.body.scrollHeight);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/fork-source-link-same-view.tsx", {
      include: [ isForkedRepo ],
      init: async function() {
        select_dom(`a[data-hovercard-url="/${getForkedRepo()}/hovercard"]`).href = await getEquivalentURL();
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/pr-jump-to-first-non-viewed-file.tsx", {
      include: [ isPRFiles ],
      exclude: [ isPRFile404 ],
      init: function(signal) {
        select_dom(".diffbar-item progress-bar").style.cursor = "pointer", delegate_it(document, ".diffbar-item progress-bar", "click", jumpToFirstNonViewed, {
          signal
        });
      }
    });
    function runShortcuts(event) {
      if ("j" !== event.key && "k" !== event.key || isEditable(event.target)) return;
      event.preventDefault();
      const focusedComment = select_dom(":target"), items = select_dom.all([ '.js-targetable-element[id^="diff-"]', ".js-minimizable-comment-group" ]).filter((element => {
        return !element.classList.contains("js-minimizable-comment-group") || (comment = element, 
        !(select_dom.exists(".minimized-comment:not(.d-none)", comment) || Boolean(comment.closest([ ".js-resolvable-thread-contents.d-none", "details.js-resolvable-timeline-thread-container:not([open])" ].join(",")))));
        var comment;
      })), direction = "j" === event.key ? 1 : -1, currentIndex = items.indexOf(focusedComment), chosenCommentIndex = Math.min(Math.max(0, currentIndex + direction), items.length - 1);
      currentIndex !== chosenCommentIndex && location.replace("#" + items[chosenCommentIndex].id);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/keyboard-navigation.tsx", {
      shortcuts: {
        j: "Focus the comment/file below",
        k: "Focus the comment/file above"
      },
      include: [ hasComments ],
      init: function(signal) {
        document.body.addEventListener("keypress", runShortcuts, {
          signal
        });
      }
    });
    function use_first_commit_message_for_new_prs_getFirstCommit() {
      const titleParts = select_dom(".js-commits-list-item:first-child p").childNodes, body = select_dom(".js-commits-list-item:first-child .Details-content--hidden pre")?.textContent.trim() ?? void 0;
      return {
        title: [ ...titleParts ].map((node => function(node) {
          switch (node instanceof Element && node.tagName) {
           case !1:
           case "A":
            return node.textContent;

           case "CODE":
            return "`" + node.textContent + "`";
          }
        }(node))).join("").trim(),
        body
      };
    }
    function linkify_user_edit_history_popup_linkify(avatar) {
      const userName = avatar.alt.slice(1);
      wrap(avatar.nextElementSibling, dom_chef.createElement("a", {
        className: "Link--primary",
        href: `/${userName}`
      })), wrap(avatar, dom_chef.createElement("a", {
        href: `/${userName}`
      }));
    }
    function addTooltipToSummary(childElement, tooltip) {
      wrap(childElement.closest("details"), dom_chef.createElement("div", {
        className: "tooltipped tooltipped-ne",
        "aria-label": tooltip
      }));
    }
    function cleanFilelistActions(searchButton) {
      searchButton.classList.add("tooltipped", "tooltipped-ne"), searchButton.setAttribute("aria-label", "Go to file"), 
      searchButton.firstChild.replaceWith(dom_chef.createElement(SearchIcon, null));
      const addFileDropdown = searchButton.nextElementSibling.querySelector(".dropdown-caret");
      addFileDropdown && (addFileDropdown.parentElement.classList.replace("d-md-flex", "d-md-block"), 
      assertNodeContent(addFileDropdown.previousSibling, "Add file").replaceWith(dom_chef.createElement(PlusIcon, null)), 
      addTooltipToSummary(addFileDropdown, "Add file"));
      const codeDropdownButton = select_dom("get-repo summary");
      if (codeDropdownButton) {
        addTooltipToSummary(codeDropdownButton, "Clone, open or download");
        const codeIcon = select_dom(".octicon-code", codeDropdownButton);
        codeIcon ? removeTextNodeContaining(codeIcon.nextSibling, "Code") : (removeTextNodeContaining(codeDropdownButton.firstChild, "Code"), 
        codeDropdownButton.prepend(dom_chef.createElement(CodeIcon, null)));
      }
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/vertical-front-matter.tsx", {
      include: [ () => isSingleFile() && /\.(mdx?|mkdn?|mdwn|mdown|markdown|litcoffee)$/.test(location.pathname) ],
      deduplicate: "has-rgh",
      init: function() {
        const table = select_dom(".markdown-body > table:first-child");
        if (!table) return !1;
        const headers = select_dom.all(":scope > thead th", table);
        if (headers.length <= 4) return !1;
        const rows = select_dom.all(":scope > tbody > tr", table);
        if (1 !== rows.length || headers.length !== rows[0].childElementCount) return !1;
        const values = [ ...rows[0].children ];
        table.replaceWith(dom_chef.createElement("table", {
          className: "rgh-vertical-front-matter-table"
        }, dom_chef.createElement("tbody", null, headers.map(((cell, index) => dom_chef.createElement("tr", null, cell, values[index]))))));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/use-first-commit-message-for-new-prs.tsx", {
      include: [ isCompare ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const requestedContent = new URL(location.href).searchParams, commitCount = (await elementReady("div.Box.mb-3 .octicon-git-commit"))?.nextElementSibling;
        if (!commitCount || looseParseInt(commitCount) < 2 || !select_dom.exists("#new_pull_request")) return !1;
        const firstCommit = use_first_commit_message_for_new_prs_getFirstCommit();
        requestedContent.has("pull_request[title]") || text_field_edit_set(select_dom(".discussion-topic-header input"), firstCommit.title), 
        firstCommit.body && !requestedContent.has("pull_request[body]") && insert(select_dom('#new_pull_request textarea[aria-label="Comment body"]'), firstCommit.body);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-user-edit-history-popup.tsx", {
      include: [ isConversation ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('details-dialog .Box-header .mr-3 > img:not([alt*="[bot]"])', linkify_user_edit_history_popup_linkify, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-repo-filelist-actions.tsx", {
      include: [ isRepoTree, isSingleFile ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('.btn[data-hotkey="t"]', cleanFilelistActions, {
          signal
        });
      }
    });
    let previousSubmission = 0;
    function preventSubmit(event) {
      Date.now() - previousSubmission < 1e3 && event.preventDefault(), previousSubmission = Date.now();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/prevent-duplicate-pr-submission.tsx", {
      include: [ isCompare ],
      init: function(signal) {
        delegate_it(document, "#new_pull_request", "submit", preventSubmit, {
          signal
        });
      }
    });
    const canNotEditLabels = node_modules_onetime((() => !select_dom.exists(".label-select-menu .octicon-gear")));
    async function removeLabelButtonClickHandler(event) {
      event.preventDefault();
      const removeLabelButton = event.delegateTarget, label = removeLabelButton.closest("a");
      label.hidden = !0;
      try {
        await v3(`issues/${getConversationNumber()}/labels/${removeLabelButton.dataset.name}`, {
          method: "DELETE"
        });
      } catch (error) {
        return assertError(error), showToast(error), removeLabelButton.blur(), void (label.hidden = !1);
      }
      label.remove();
    }
    function addRemoveLabelButton(label) {
      label.classList.add("d-inline-flex"), label.append(dom_chef.createElement("button", {
        type: "button",
        "aria-label": "Remove this label",
        className: "btn-link tooltipped tooltipped-nw rgh-quick-label-removal",
        "data-name": label.dataset.name
      }, dom_chef.createElement(XIcon, null)));
    }
    async function cleanIssueHeader() {
      const byline = await elementReady(".gh-header-meta .flex-auto:not(.rgh-clean-conversation-headers)");
      if (!byline) return !1;
      byline.classList.add("rgh-clean-conversation-headers", "rgh-clean-conversation-headers-hide-author");
      const commentCount = select_dom("relative-time", byline).nextSibling;
      commentCount.replaceWith(dom_chef.createElement("span", null, commentCount.textContent.replace("·", "")));
    }
    async function cleanPrHeader() {
      const byline = await elementReady(".gh-header-meta > .flex-auto:not(.rgh-clean-conversation-headers)");
      if (!byline) return !1;
      byline.classList.add("rgh-clean-conversation-headers");
      isPRConversation() && select_dom(".author", byline).textContent === (await elementReady(".TimelineItem .author")).textContent && byline.classList.add("rgh-clean-conversation-headers-hide-author");
      const base = select_dom(".commit-ref", byline), baseBranchDropdown = select_dom(".commit-ref-dropdown", byline), arrowIcon = dom_chef.createElement(ArrowLeftIcon, {
        className: "v-align-middle mx-1"
      });
      baseBranchDropdown ? baseBranchDropdown.after(dom_chef.createElement("span", null, arrowIcon)) : base.nextElementSibling.replaceChildren(arrowIcon);
      const baseBranch = base.title.split(":")[1], wasDefaultBranch = isClosedPR() && "master" === baseBranch;
      baseBranch === await getDefaultBranch() || wasDefaultBranch || base.classList.add("rgh-clean-conversation-headers-non-default-branch");
    }
    let progressLoader;
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-label-removal.tsx", {
      include: [ isConversation ],
      exclude: [ canNotEditLabels, isArchivedRepo ],
      init: async function(signal) {
        await expectToken(), delegate_it(document, ".rgh-quick-label-removal:not([disabled])", "click", removeLabelButtonClickHandler, {
          signal
        }), observe(".js-issue-labels .IssueLabel", addRemoveLabelButton, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-conversation-headers.tsx", {
      include: [ isIssue, isPR ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        const cleanConversationHeader = isIssue() ? cleanIssueHeader : cleanPrHeader;
        if (!1 !== await cleanConversationHeader()) return onConversationHeaderUpdate(cleanConversationHeader);
      }
    });
    function keydownHandler(event) {
      if ("Escape" === event.key && progressLoader.classList.contains("is-loading")) {
        if (history.state && "_id" in history.state) {
          const pjaxContainer = select_dom("#js-repo-pjax-container, #js-pjax-container, #gist-pjax-container");
          pjaxContainer ? history.replaceState({
            url: location.href,
            title: "",
            container: `#${pjaxContainer.id}`,
            ...history.state
          }, "", location.href) : feature_manager.log.error("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/stop-pjax-loading-with-esc.tsx", "Pjax container not found.");
        }
        window.addEventListener("pjax:error", pjaxErrorHandler, {
          once: !0
        }), history.back(), progressLoader.classList.remove("is-loading");
      }
    }
    function pjaxErrorHandler(event) {
      event.cancelable && event.preventDefault();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/stop-pjax-loading-with-esc.tsx", {
      init: function() {
        progressLoader = select_dom(".progress-pjax-loader"), window.addEventListener("keydown", keydownHandler);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/highlight-deleted-and-added-files-in-diffs.tsx", {
      include: [ isPRFiles, isCommit ],
      exclude: [ isPRFile404, isPRCommit404 ],
      awaitDomReady: !1,
      init: async function(signal) {
        const fileList = await elementReady([ '.toc-select details-menu[src*="/show_toc?"]', ".toc-diff-stats + .content" ].join(","));
        isPR() && await async function(jumpList) {
          const retrier = setInterval((() => {
            jumpList.parentElement.dispatchEvent(new MouseEvent("mouseover"));
          }), 100);
          await oneMutation(jumpList, {
            childList: !0,
            subtree: !0
          }), clearInterval(retrier);
        }(fileList), observe(".file-info a.Link--primary", (filename => {
          !function(filename, sourceIcon) {
            const icon = sourceIcon.cloneNode(!0), action = icon.getAttribute("title");
            if ("added" === action) icon.classList.add("color-fg-success"); else {
              if ("removed" !== action) return;
              icon.classList.add("color-fg-danger");
            }
            icon.classList.remove("select-menu-item-icon"), filename.parentElement.append(dom_chef.createElement("span", {
              className: "tooltipped tooltipped-s ml-1",
              "aria-label": "File " + action
            }, icon));
          }(filename, isPR() ? select_dom(`[href="${filename.hash}"] svg`, fileList) : select_dom(`svg + [href="${filename.hash}"]`, fileList)?.previousElementSibling);
        }), {
          signal
        });
      }
    });
    const getReleaseEditLinkSelector = () => `a[href^="/${github_helpers_getRepo().nameWithOwner}/releases/edit"]`;
    const confirmMessage = "The release will be effectively deleted and a new draft will be created.";
    async function onConvertClick() {
      const message = select_dom.exists(".js-reaction-group-button") ? [ confirmMessage, "Existing user reactions will be lost.", "Continue?" ] : [ confirmMessage, "Continue?" ];
      if (confirm(message.join(" "))) try {
        await showToast(async function() {
          const tagName = location.pathname.split("/").pop(), release = await v3(`releases/tags/${tagName}`);
          await v3(release.url, {
            method: "PATCH",
            body: {
              draft: !0
            }
          }), select_dom(getReleaseEditLinkSelector()).click();
        }(), {
          message: "Converting…",
          doneMessage: "Redirecting…"
        });
      } catch (error) {
        feature_manager.log.error("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/convert-release-to-draft.tsx", error);
      }
    }
    function attachButton(editButton) {
      select_dom.exists('[title="Draft"]') || editButton.before(dom_chef.createElement("button", {
        type: "button",
        className: "btn btn-sm ml-3 mr-1 rgh-convert-draft"
      }, "Convert to draft"));
    }
    function followLocalLink(event) {
      new GitHubURL(event.delegateTarget.href).filePath === new GitHubURL(location.href).filePath && (location.hash = event.delegateTarget.hash, 
      event.preventDefault());
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/convert-release-to-draft.tsx", {
      include: [ isSingleTag ],
      awaitDomReady: !1,
      init: async function(signal) {
        await expectToken(), observe(getReleaseEditLinkSelector(), attachButton, {
          signal
        }), delegate_it(document, ".rgh-convert-draft", "click", onConvertClick, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/same-page-definition-jump.tsx", {
      include: [ isSingleFile ],
      init: function(signal) {
        delegate_it(document, ".TagsearchPopover-item", "click", followLocalLink, {
          signal
        });
      }
    });
    function setStorage() {
      select_dom("input#rgh-disable-project").checked && (sessionStorage.rghNewRepo = !0);
    }
    function addTable({delegateTarget: square}) {
      const field = square.form.querySelector("textarea.js-comment-field"), cursorPosition = field.selectionStart;
      field.focus();
      insert(field, smartBlockWrap("<table>\n" + ("<tr>\n" + "\t<td>\n".repeat(Number(square.dataset.x))).repeat(Number(square.dataset.y)) + "</table>", field)), 
      field.selectionEnd = field.value.indexOf("<td>", cursorPosition) + "<td>".length;
    }
    function highlightSquares({delegateTarget: hover}) {
      for (const cell of hover.parentElement.children) cell.classList.toggle("selected", cell.dataset.x <= hover.dataset.x && cell.dataset.y <= hover.dataset.y);
    }
    function getLinkToGitHubIo(repoTitle, className) {
      return dom_chef.createElement("a", {
        href: `https://${repoTitle.textContent.trim()}`,
        className
      }, dom_chef.createElement(LinkIcon, {
        className: "v-align-middle"
      }));
    }
    function addRepoListLink(repoTitle) {
      repoTitle.after(" ", getLinkToGitHubIo(repoTitle));
    }
    function addRepoHeaderLink(repoTitle) {
      repoTitle.after(getLinkToGitHubIo(repoTitle, "mr-2"));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/new-repo-disable-projects-and-wikis.tsx", {
      include: [ (url = location) => "/new" === url.pathname || /^organizations\/[^/]+\/repositories\/new$/.test(getCleanPathname(url)), isNewRepoTemplate ],
      init: async function(signal) {
        await expectToken(), attachElement(select_dom.last([ ".js-repo-init-setting-container", ".form-checkbox" ]), {
          after: () => dom_chef.createElement("div", {
            className: "flash flash-warn py-0"
          }, dom_chef.createElement("div", {
            className: "form-checkbox checked"
          }, dom_chef.createElement("label", null, dom_chef.createElement("input", {
            checked: !0,
            type: "checkbox",
            id: "rgh-disable-project"
          }), " Disable Projects and Wikis"), dom_chef.createElement("span", {
            className: "note mb-2"
          }, "After creating the repository disable the projects and wiki. ", dom_chef.createElement("a", {
            href: "https://github.com/refined-github/refined-github/wiki/Extended-feature-descriptions#new-repo-disable-projects-and-wikis",
            target: "_blank",
            rel: "noreferrer"
          }, "Suggestion by Refined GitHub."))))
        }), delegate_it(document, "#new_repository, #new_new_repository", "submit", setStorage, {
          signal
        });
      }
    }, {
      include: [ () => Boolean(sessionStorage.rghNewRepo) ],
      awaitDomReady: !1,
      init: node_modules_onetime((async function() {
        delete sessionStorage.rghNewRepo, await v3("", {
          method: "PATCH",
          body: {
            has_projects: !1,
            has_wiki: !1
          }
        }), await dom_loaded, select_dom('[data-menu-item$="wiki-tab"]')?.remove(), select_dom('[data-menu-item$="projects-tab"]')?.remove(), 
        selectHas('li:has([data-content="Wiki"]')?.remove(), selectHas('li:has([data-content="Projects"])')?.remove();
      }))
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/table-input.tsx", {
      include: [ hasRichTextEditor ],
      init: function(signal) {
        !function(signal) {
          observe("md-task-list", (anchor => {
            anchor.after(dom_chef.createElement("details", {
              className: "details-reset details-overlay flex-auto toolbar-item btn-octicon mx-1 select-menu select-menu-modal-right hx_rsm"
            }, dom_chef.createElement("summary", {
              className: "text-center menu-target p-2 p-md-1 hx_rsm-trigger",
              role: "button",
              "aria-label": "Add a table",
              "aria-haspopup": "menu"
            }, dom_chef.createElement("div", {
              className: "tooltipped tooltipped-sw",
              "aria-label": "Add a table"
            }, dom_chef.createElement(TableIcon, null))), dom_chef.createElement("details-menu", {
              className: "select-menu-modal position-absolute left-0 hx_rsm-modal rgh-table-input",
              role: "menu"
            }, Array.from({
              length: 25
            }).map(((_, index) => dom_chef.createElement("button", {
              type: "button",
              role: "menuitem",
              className: "rgh-tic btn-link",
              "data-x": index % 5 + 1,
              "data-y": Math.floor(index / 5) + 1
            }, dom_chef.createElement("div", null)))))));
          }), {
            signal
          });
        }(signal), delegate_it(document, ".rgh-tic", "click", addTable, {
          signal
        }), isHasSelectorSupported || delegate_it(document, ".rgh-tic", "mouseenter", highlightSquares, {
          capture: !0,
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/link-to-github-io.tsx", {
      include: [ hasRepoHeader ],
      asLongAs: [ () => Boolean(github_helpers_getRepo()?.name.endsWith(".github.io")) ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('[itemprop="name"]', addRepoHeaderLink, {
          signal
        });
      }
    }, {
      include: [ isUserProfileRepoTab, isOrganizationProfile ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('a[href$=".github.io"][itemprop="name codeRepository"]', addRepoListLink, {
          signal
        });
      }
    });
    var index_min = __webpack_require__(664);
    function addTooltip(element, tooltip) {
      const existingTooltip = element.getAttribute("aria-label");
      existingTooltip ? element.setAttribute("aria-label", existingTooltip + ".\n" + tooltip) : (element.classList.add("tooltipped", "tooltipped-s"), 
      element.setAttribute("aria-label", tooltip));
    }
    const getWorkflowsDetails = webext_storage_cache.function((async () => {
      const {repository: {workflowFiles}} = await v4('\n\t\trepository() {\n\t\t\tworkflowFiles: object(expression: "HEAD:.github/workflows") {\n\t\t\t\t... on Tree {\n\t\t\t\t\tentries {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tobject {\n\t\t\t\t\t\t\t... on Blob {\n\t\t\t\t\t\t\t\ttext\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t'), workflows = workflowFiles?.entries ?? [];
      if (0 === workflows.length) return !1;
      const details = {};
      for (const workflow of workflows) {
        const workflowYaml = workflow.object.text, cron = /schedule[:\s-]+cron[:\s'"]+([^'"\n]+)/m.exec(workflowYaml);
        details[workflow.name] = {
          schedule: cron?.[1],
          manuallyDispatchable: workflowYaml.includes("workflow_dispatch:")
        };
      }
      return details;
    }), {
      maxAge: {
        days: 1
      },
      staleWhileRevalidate: {
        days: 10
      },
      cacheKey: () => "workflows:" + github_helpers_getRepo().nameWithOwner
    });
    async function addIndicators(workflowListItem) {
      const workflows = await getWorkflowsDetails();
      if (!workflows) return;
      if (select_dom.exists(".octicon-stop", workflowListItem)) return;
      const workflow = workflows[workflowListItem.href.split("/").pop()];
      if (!workflow) return;
      if (workflow.manuallyDispatchable && (workflowListItem.append(dom_chef.createElement(PlayIcon, {
        className: "ActionListItem-visual--trailing m-auto"
      })), addTooltip(workflowListItem, "This workflow can be triggered manually")), !workflow.schedule) return;
      const nextTime = index_min._.nextDate(workflow.schedule);
      if (!nextTime) return;
      const relativeTime = dom_chef.createElement("relative-time", {
        datetime: String(nextTime)
      });
      select_dom(".ActionList-item-label", workflowListItem).append(dom_chef.createElement("em", null, "(next ", relativeTime, ")")), 
      setTimeout((() => {
        addTooltip(workflowListItem, "Next run in " + relativeTime.textContent);
      }), 500);
    }
    function LoadingIcon() {
      return dom_chef.createElement("img", {
        className: "rgh-loading-icon",
        src: "https://github.githubassets.com/images/spinners/octocat-spinner-128.gif",
        width: "18"
      });
    }
    function closeModal({delegateTarget: button}) {
      button.append(" ", dom_chef.createElement(LoadingIcon, {
        className: "v-align-middle"
      })), button.disabled = !0;
    }
    function addConvertToDraftButton(alternativeActions) {
      const existingButton = select_dom('[data-url$="/convert_to_draft"]');
      if (!existingButton || select_dom.exists('[action$="/ready_for_review"]')) return;
      const convertToDraft = existingButton.closest("details").cloneNode(!0);
      select_dom(".Link--muted", convertToDraft).classList.remove("Link--muted"), alternativeActions.prepend(convertToDraft);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/scheduled-and-manual-workflow-indicators.tsx", {
      include: [ (url = location) => /^actions(\/workflows\/.+\.ya?ml)?$/.test(getRepo(url)?.path) ],
      awaitDomReady: !1,
      init: async function(signal) {
        if (!await getWorkflowsDetails()) return !1;
        observe("a.ActionList-content", addIndicators, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/convert-pr-to-draft-improvements.tsx", {
      include: [ isPRConversation ],
      awaitDomReady: !1,
      init: function(signal) {
        delegate_it(document, ".js-convert-to-draft", "click", closeModal, {
          signal
        }), observe(".alt-merge-options", addConvertToDraftButton, {
          signal
        });
      }
    });
    const connectionType = {
      HTTPS: location.origin + "/",
      SSH: `git@${location.hostname}:`
    };
    function checkoutOption(remote, remoteType) {
      const [nameWithOwner, headBranch] = select_dom(".head-ref").title.split(":"), [owner] = nameWithOwner.split("/");
      return dom_chef.createElement("div", {
        hidden: remoteType && "HTTPS" !== remoteType,
        className: "markdown-body",
        role: "tabpanel"
      }, dom_chef.createElement("div", {
        className: "snippet-clipboard-content position-relative"
      }, dom_chef.createElement("div", {
        className: "zeroclipboard-container position-absolute right-0 top-0"
      }, dom_chef.createElement("clipboard-copy", {
        className: "ClipboardButton btn js-clipboard-copy m-2 p-0 tooltipped-no-delay",
        role: "button",
        for: `rgh-checkout-pr-${remoteType}`,
        "aria-label": "Copy",
        "data-copy-feedback": "Copied!",
        "data-tooltip-direction": "w",
        tabindex: "0"
      }, dom_chef.createElement(CopyIcon, {
        className: "js-clipboard-copy-icon m-2"
      }), dom_chef.createElement(CheckIcon, {
        className: "js-clipboard-check-icon color-fg-success d-none m-2"
      }))), dom_chef.createElement("pre", {
        id: `rgh-checkout-pr-${remoteType}`,
        className: "mb-2 rgh-linkified-code"
      }, dom_chef.createElement("code", null, remote && `git remote add ${remote} ${connectionType[remoteType]}${nameWithOwner}.git\n`, "git fetch ", remote ?? "origin", " ", headBranch, "\n", "git switch ", remote && `--track ${owner}/`, headBranch))));
    }
    function getTabList(tabs, selected = tabs[0]) {
      return dom_chef.createElement("div", {
        className: "UnderlineNav my-2 box-shadow-none"
      }, dom_chef.createElement("div", {
        className: "UnderlineNav-body",
        role: "tablist"
      }, tabs.map((tab => dom_chef.createElement("button", {
        type: "button",
        role: "tab",
        className: "UnderlineNav-item lh-default f6 py-0 px-0 mr-2 position-relative",
        "aria-selected": tab === selected ? "true" : "false",
        tabIndex: tab === selected ? 0 : -1
      }, tab)))));
    }
    async function git_checkout_pr_handleMenuOpening({delegateTarget: dropdown}) {
      dropdown.classList.add("rgh-git-checkout"), select_dom.exists(".SelectMenu-loading", dropdown) && await oneMutation(dropdown, {
        childList: !0,
        subtree: !0
      });
      const remoteName = function() {
        const [author] = select_dom(".head-ref").title.split("/");
        if (author !== github_helpers_getUsername()) {
          if (author !== github_helpers_getRepo().owner) return author;
          if (!select_dom('[aria-label="Edit Pull Request title"]')) return "upstream";
        }
      }();
      select_dom(".octicon-terminal", dropdown).closest("li.Box-row").after(dom_chef.createElement("li", {
        className: "Box-row p-3 mt-0"
      }, dom_chef.createElement("span", {
        className: "d-flex flex-items-center color-fg-default text-bold no-underline"
      }, dom_chef.createElement(TerminalIcon, {
        className: "mr-2"
      }), "Checkout with Git"), dom_chef.createElement("div", {
        className: "mt-2 pl-5"
      }, dom_chef.createElement("tab-container", null, remoteName ? [ getTabList([ "HTTPS", "SSH" ]), checkoutOption(remoteName, "HTTPS"), checkoutOption(remoteName, "SSH") ] : checkoutOption()), dom_chef.createElement("p", {
        className: "mb-0 f6 color-fg-muted"
      }, "Run in your project repository", remoteName && ", pick either one", "."))));
    }
    let documentTitle, submitting;
    function disableOnSubmit() {
      clearTimeout(submitting), submitting = window.setTimeout((() => {
        submitting = void 0;
      }), 2e3);
    }
    function updateDocumentTitle() {
      submitting || ("hidden" === document.visibilityState && select_dom.all('textarea:not([disabled], [id^="convert-to-issue-body"])').some((textarea => textarea.value !== textarea.textContent)) ? (documentTitle = document.title, 
      document.title = "✏️ Draft - " + document.title) : documentTitle && (document.title = documentTitle, 
      documentTitle = void 0));
    }
    function jump_to_change_requested_comment_linkify(textLine) {
      const url = select_dom('a.dropdown-item[href^="#pullrequestreview-"]', textLine.parentElement);
      wrap(textLine.lastChild, dom_chef.createElement("a", {
        href: url.hash
      }));
    }
    function handleEscPress(event) {
      "Escape" === event.key && (select_dom(".js-cancel-issue-edit").click(), event.stopImmediatePropagation(), 
      event.preventDefault());
    }
    function toggleFile(event) {
      const elementClicked = event.target, headerBar = event.delegateTarget;
      elementClicked !== headerBar && elementClicked.parentElement !== headerBar || select_dom('[aria-label="Toggle diff contents"]', headerBar).dispatchEvent(new MouseEvent("click", {
        bubbles: !0,
        altKey: event.altKey
      }));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/git-checkout-pr.tsx", {
      include: [ isPR ],
      exclude: [ isClosedPR ],
      init: function(signal) {
        delegate_it(document, ".gh-header-actions Details:not(.rgh-git-checkout)", "toggle", git_checkout_pr_handleMenuOpening, {
          capture: !0,
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/unfinished-comments.tsx", {
      include: [ hasRichTextEditor ],
      init: function(signal) {
        delegate_it(document, "form", "submit", disableOnSubmit, {
          capture: !0,
          signal
        }), document.addEventListener("visibilitychange", updateDocumentTitle, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/jump-to-change-requested-comment.tsx", {
      include: [ isPRConversation ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('.merge-status-item.review-item [title*="requested changes"]', jump_to_change_requested_comment_linkify, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/esc-to-cancel.tsx", {
      shortcuts: {
        esc: "Cancel editing a conversation title"
      },
      include: [ isIssue, isPR ],
      awaitDomReady: !1,
      init: function(signal) {
        onConversationTitleFieldKeydown(handleEscPress, signal);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/easy-toggle-files.tsx", {
      include: [ hasFiles, (url = location) => /^[^/]+\/[\da-f]{20,32}\/revisions$/.test(getCleanGistPathname(url)) ],
      awaitDomReady: !1,
      init: function(signal) {
        delegate_it(document, ".file-header", "click", toggleFile, {
          signal
        });
      }
    });
    var quick_repo_deletion_browser = __webpack_require__(412);
    function handleToggle(event) {
      (!select_dom.exists([ '[data-hotkey="g i"] .Counter:not([hidden])', '[data-hotkey="g p"] .Counter:not([hidden])', ".rgh-open-prs-of-forks" ]) || confirm("This repo has open issues/PRs, are you sure you want to delete everything?")) && (isForkedRepo() || confirm("⚠️ This action cannot be undone. This will permanently delete the repository, wiki, issues, comments, packages, secrets, workflow runs, and remove all collaborator associations.")) ? setTimeout(start, 1, event.delegateTarget) : event.delegateTarget.open = !1;
    }
    async function buttonTimeout(buttonContainer) {
      const abortController = new AbortController;
      document.addEventListener("click", (event => {
        event.preventDefault(), abortController.abort(), buttonContainer.open = !1;
      }), {
        once: !0
      }), async function(abortController) {
        try {
          await expectTokenScope("delete_repo");
        } catch (error) {
          assertError(error), abortController.abort(), await addNotice([ "Could not delete the repository. ", parseBackticks(error.message) ], {
            type: "error",
            action: dom_chef.createElement("a", {
              className: "btn btn-sm primary flash-action",
              href: "https://github.com/settings/tokens"
            }, "Update token…")
          });
        }
      }(abortController);
      let secondsLeft = 5;
      const button = select_dom(".btn", buttonContainer);
      try {
        do {
          button.style.transform = `scale(${1.2 - (secondsLeft - 5) / 3})`, button.textContent = `Deleting repo in ${pluralize(secondsLeft, "$$ second")}. Cancel?`, 
          await delay_default()(1e3, {
            signal: abortController.signal
          });
        } while (--secondsLeft);
      } catch {
        button.textContent = "Delete fork", button.style.transform = "";
      }
      return !abortController.signal.aborted;
    }
    async function start(buttonContainer) {
      if (!await buttonTimeout(buttonContainer)) return;
      select_dom(".btn", buttonContainer).textContent = "Deleting repo…";
      const {nameWithOwner, owner} = github_helpers_getRepo();
      try {
        await v3("/repos/" + nameWithOwner, {
          method: "DELETE",
          json: !1
        });
      } catch (error) {
        throw assertError(error), buttonContainer.closest("li").remove(), await addNotice([ "Could not delete the repository. ", error.response?.message ?? error.message ], {
          type: "error"
        }), error;
      }
      const forkSource = "/" + getForkedRepo(), restoreURL = Boolean(document.querySelector("[data-owner-scoped-search-url]")?.dataset.ownerScopedSearchUrl.startsWith("/org")) ? `/organizations/${owner}/settings/deleted_repositories` : "/settings/deleted_repositories", otherForksURL = `/${owner}?tab=repositories&type=fork`;
      await addNotice(dom_chef.createElement(dom_chef.Fragment, null, dom_chef.createElement(TrashIcon, null), " ", dom_chef.createElement("span", null, "Repository ", dom_chef.createElement("strong", null, nameWithOwner), " deleted. ", dom_chef.createElement("a", {
        href: restoreURL
      }, "Restore it"), ", ", dom_chef.createElement("a", {
        href: forkSource
      }, "visit the source repo"), ", or see ", dom_chef.createElement("a", {
        href: otherForksURL
      }, "your other forks."))), {
        action: !1
      }), select_dom(".application-main").remove(), document.hidden && quick_repo_deletion_browser.runtime.sendMessage({
        closeTab: !0
      });
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-repo-deletion.tsx", {
      include: [ isForkedRepo ],
      awaitDomReady: !1,
      init: async function(signal) {
        if (!await elementReady('nav [data-content="Settings"]') || looseParseInt(select_dom(".starring-container .Counter")) > 0) return !1;
        await expectToken(), attachElement(".pagehead-actions", {
          prepend: () => dom_chef.createElement("li", null, dom_chef.createElement("details", {
            className: "details-reset details-overlay select-menu rgh-quick-repo-deletion"
          }, dom_chef.createElement("summary", {
            "aria-haspopup": "menu",
            role: "button"
          }, dom_chef.createElement("span", {
            className: "btn btn-sm btn-danger"
          }, "Delete fork"))))
        }), delegate_it(document, ".rgh-quick-repo-deletion[open]", "toggle", handleToggle, {
          capture: !0,
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/rgh-feature-descriptions.tsx", {
      asLongAs: [ isRefinedGitHubRepo ],
      include: [ isSingleFile ],
      awaitDomReady: !1,
      deduplicate: ".rgh-feature-description",
      init: async function() {
        const [, currentFeature] = /source\/features\/([^.]+)/.exec(location.pathname) ?? [], currentFeatureName = getNewFeatureName(currentFeature), feature = featuresMeta.find((feature2 => feature2.id === currentFeatureName));
        if (!feature) return !1;
        const conversationsUrl = new URL("https://github.com/refined-github/refined-github/issues");
        conversationsUrl.searchParams.set("q", `sort:updated-desc "${feature.id}"`);
        const commitInfoBox = (await elementReady([ ".Box-header.Details", "include-fragment.commit-loader" ].join(","))).parentElement;
        commitInfoBox.classList.add("width-fit", "min-width-0", "flex-auto", "mb-lg-0", "mr-lg-3"), 
        commitInfoBox.classList.remove("flex-shrink-0");
        const featureInfoBox = dom_chef.createElement("div", {
          className: "Box rgh-feature-description",
          style: {
            flex: "0 1 544px"
          }
        }, dom_chef.createElement("div", {
          className: "Box-row d-flex height-full"
        }, feature.screenshot && dom_chef.createElement("a", {
          href: feature.screenshot,
          className: "flex-self-center"
        }, dom_chef.createElement("img", {
          src: feature.screenshot,
          className: "d-block border",
          style: {
            maxHeight: 100,
            maxWidth: 150
          }
        })), dom_chef.createElement("div", {
          className: "flex-auto" + (feature.screenshot ? " ml-3" : "")
        }, dom_chef.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: feature.description
          },
          className: "text-bold"
        }), dom_chef.createElement("div", {
          className: "no-wrap",
          "data-turbo-frame": "repo-content-turbo-frame"
        }, dom_chef.createElement("a", {
          href: conversationsUrl.href
        }, "Related issues"), location.pathname.endsWith("css") ? dom_chef.createElement(dom_chef.Fragment, null, " • ", dom_chef.createElement("a", {
          href: location.pathname.replace(".css", ".tsx")
        }, "See JavaScript")) : void 0))));
        wrapAll([ commitInfoBox, featureInfoBox ], dom_chef.createElement("div", {
          className: "d-lg-flex"
        }));
      }
    });
    const attribute = "data-required-trimmed", attributeBackup = "data-rgh-required-trimmed";
    function toggleSubmitButtons({target, type}) {
      const fileAttachment = target;
      for (const button of select_dom.all('.btn-primary[type="submit"]:not([data-disable-invalid])', fileAttachment.closest("form"))) button.dataset.disableInvalid = "";
      const textarea = select_dom(`[${attribute}], [${attributeBackup}]`, fileAttachment);
      textarea && ("upload:setup" === type ? (textarea.setAttribute(attributeBackup, textarea.getAttribute(attribute)), 
      textarea.removeAttribute(attribute)) : (textarea.setAttribute(attribute, textarea.getAttribute(attributeBackup)), 
      textarea.removeAttribute(attributeBackup)));
    }
    function getUrl() {
      const url = new URL("https://useful-forks.github.io");
      return url.searchParams.set("repo", github_helpers_getRepo().nameWithOwner), url.href;
    }
    function addLinkToBanner(label) {
      if ("Public archive" !== label.textContent.trim()) return;
      const banner = select_dom("#js-repo-pjax-container > .flash-warn:first-child");
      assertNodeContent(banner.lastChild, /repository has been archived/).after(" You can use ", dom_chef.createElement("a", {
        href: getUrl()
      }, "useful-forks.github.io"));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/wait-for-attachments.tsx", {
      include: [ hasRichTextEditor ],
      exclude: [ isNewIssue ],
      init: function(signal) {
        document.addEventListener("upload:setup", toggleSubmitButtons, {
          signal,
          capture: !0
        }), document.addEventListener("upload:complete", toggleSubmitButtons, {
          signal
        }), document.addEventListener("upload:error", toggleSubmitButtons, {
          signal
        }), document.addEventListener("upload:invalid", toggleSubmitButtons, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/useful-forks.tsx", {
      include: [ (url = location) => "network/members" === getRepo(url)?.path, (url = location) => "network" === getRepo(url)?.path ],
      exclude: [ isEnterprise ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        if (0 === looseParseInt(await elementReady("#repo-network-counter"))) return !1;
        const selector = [ "#network", ".Subhead-heading" ].join(", ");
        (await elementReady(selector, {
          waitForChildren: !1
        })).prepend(dom_chef.createElement("a", {
          className: "btn mb-2 float-right",
          href: getUrl()
        }, dom_chef.createElement(RepoForkedIcon, {
          className: "mr-2"
        }), "Find useful forks"));
      }
    }, {
      include: [ hasRepoHeader ],
      awaitDomReady: !1,
      init: function(signal) {
        observe('[itemprop="name"] ~ .Label--attention', addLinkToBanner, {
          signal
        });
      }
    });
    const link_to_changelog_file_getCacheKey = () => `changelog:${github_helpers_getRepo().nameWithOwner}`, changelogFiles = /^(changelog|news|changes|history|release|whatsnew)(\.(mdx?|mkdn?|mdwn|mdown|markdown|litcoffee|txt|rst))?$/i;
    function findChangelogName(files) {
      return files.find((name => changelogFiles.test(name))) ?? !1;
    }
    const getChangelogName = webext_storage_cache.function((async () => {
      const {repository} = await v4('\n\t\trepository() {\n\t\t\tobject(expression: "HEAD:") {\n\t\t\t\t...on Tree {\n\t\t\t\t\tentries {\n\t\t\t\t\t\tname\n\t\t\t\t\t\ttype\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t'), files = [];
      for (const entry of repository.object.entries) "blob" === entry.type && files.push(entry.name);
      return findChangelogName(files);
    }), {
      cacheKey: link_to_changelog_file_getCacheKey
    });
    async function wiggleWiggleWiggle() {
      await webext_storage_cache.set("did-it-wiggle", "yup", {
        days: 7
      }), select_dom("#sponsor-button-repo")?.animate({
        transform: [ "none", "rotate(-2deg) scale(1.05)", "rotate(2deg) scale(1.1)", "rotate(-2deg) scale(1.1)", "rotate(2deg) scale(1.1)", "rotate(-2deg) scale(1.1)", "rotate(2deg) scale(1.05)", "none" ]
      }, 600);
    }
    async function suchLove({delegateTarget}) {
      const heart = select_dom(".octicon-heart", delegateTarget);
      if (!heart || delegateTarget.closest("details[open]")) return;
      const rect = heart.getBoundingClientRect(), love = heart.cloneNode(!0);
      Object.assign(love.style, {
        position: "fixed",
        zIndex: "9999999999",
        left: `${rect.x}px`,
        top: `${rect.y}px`
      }), document.body.append(love), await love.animate({
        transform: [ "translateZ(0)", "translateZ(0) scale(80)" ],
        opacity: [ 1, 0 ]
      }, {
        duration: 600,
        easing: "ease-out"
      }).finished, love.remove();
    }
    function linkifyFeature(possibleFeature) {
      const id = getNewFeatureName(possibleFeature.textContent);
      if (!id) return;
      const href = featureLink(id), possibleLink = possibleFeature.firstElementChild ?? possibleFeature;
      possibleLink instanceof HTMLAnchorElement ? (possibleLink.href = href, possibleLink.classList.add("color-fg-accent")) : possibleFeature.closest("a") || wrap(possibleFeature, dom_chef.createElement("a", {
        className: "color-fg-accent",
        "data-turbo-frame": "repo-content-turbo-frame",
        href
      }));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/link-to-changelog-file.tsx", {
      include: [ isReleasesOrTags ],
      exclude: [ isSingleTag ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        const changelog = await getChangelogName();
        if (!changelog) return !1;
        const changelogButton = dom_chef.createElement("a", {
          className: "tooltipped tooltipped-n btn ml-3" + (isEnterprise() ? "" : " flex-self-start"),
          "aria-label": `View the ${changelog} file`,
          href: buildRepoURL("blob", "HEAD", changelog),
          style: isEnterprise() ? {
            padding: "6px 16px"
          } : {},
          role: "button"
        }, dom_chef.createElement(BookIcon, {
          className: "color-fg-accent mr-2"
        }), dom_chef.createElement("span", null, "Changelog")), releasesOrTagsNavbarSelector = [ 'nav[aria-label^="Releases and Tags"]', ".subnav-links" ].join(","), navbar = await elementReady(releasesOrTagsNavbarSelector, {
          waitForChildren: !1
        });
        navbar.classList.remove("flex-1"), wrapAll([ navbar, changelogButton ], dom_chef.createElement("div", {
          className: "d-flex flex-justify-start flex-1"
        }));
      }
    }, {
      include: [ isRepoHome ],
      deduplicate: "has-rgh",
      init: function() {
        const files = select_dom.all('[aria-labelledby="files"] .js-navigation-open[href*="/blob/"').map((file => file.title));
        return webext_storage_cache.set(link_to_changelog_file_getCacheKey(), findChangelogName(files)), 
        !1;
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/rgh-sponsor-button.tsx", {
      include: [ isIssue, isRepoIssueList ],
      init: async function(signal) {
        return github_helpers_getRepo().owner === github_helpers_getUsername() || await webext_storage_cache.get("did-it-wiggle") || select_dom([ '.btn-primary[href$="/issues/new/choose"]', '.btn-primary[href$="/issues/new"]' ])?.addEventListener("mouseenter", wiggleWiggleWiggle, {
          once: !0,
          signal
        }), !1;
      }
    }, {
      include: [ isRepo, isUserProfile, isOrganizationProfile ],
      exclude: [ isOwnUserProfile, isPrivateUserProfile ],
      init: function(signal) {
        delegate_it(document, '#sponsor-button-repo, #sponsor-profile-button, [aria-label^="Sponsor @"]', "click", suchLove, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/rgh-linkify-features.tsx", {
      asLongAs: [ function() {
        return /^\/refined-github\/.+/.test(location.pathname);
      } ],
      include: [ hasComments, isReleasesOrTags, isCommitList, isSingleCommit, isRepoWiki, isPR, isIssue ],
      awaitDomReady: !1,
      init: function(signal) {
        observe([ ".js-issue-title code", ".js-comment-body code", ".markdown-body code", ".markdown-title:not(li) code", "code .markdown-title" ], linkifyFeature, {
          signal
        });
      }
    });
    const states = {
      default: "",
      hideEvents: "Hide events",
      hideEventsAndCollapsedComments: "Hide events and collapsed comments"
    }, dropdownClass = "rgh-conversation-activity-filter-dropdown", collapsedClassName = "rgh-conversation-activity-collapsed";
    function processItem(item) {
      location.hash.startsWith("#issuecomment-") && select_dom.exists(location.hash, item) || (select_dom.exists(".js-comment[id^=pullrequestreview]", item) ? function(review) {
        const hasMainComment = select_dom.exists(".js-comment[id^=pullrequestreview] .timeline-comment", review), unresolvedThreads = select_dom.all('.js-resolvable-timeline-thread-container[data-resolved="false"]', review), unresolvedThreadComments = select_dom.all(".timeline-comment-group:not(.minimized-comment)", review);
        if (hasMainComment || 0 !== unresolvedThreads.length && 0 !== unresolvedThreadComments.length) for (const thread of unresolvedThreads) unresolvedThreadComments.some((comment => thread.contains(comment))) || thread.classList.add(collapsedClassName); else review.classList.add(collapsedClassName);
      }(item) : select_dom.exists(".TimelineItem-badge .octicon-x", item) ? function(item) {
        item.classList.add("rgh-conversation-activity-filtered");
        for (const {hash: staleReviewId} of select_dom.all('.TimelineItem-body > [href^="#pullrequestreview-"]', item)) select_dom(staleReviewId).closest(".js-timeline-item").classList.add(collapsedClassName);
      }(item) : select_dom.exists(".comment-body", item) ? function(item) {
        select_dom.exists(".minimized-comment > details", item) && item.classList.add(collapsedClassName);
      }(item) : function(item) {
        isPR() && select_dom.exists(".TimelineItem-badge .octicon-git-commit", item) || item.classList.add("rgh-conversation-activity-filtered");
      }(item));
    }
    async function handleSelection({target}) {
      await delay_default()(1);
      applyState(select_dom('[aria-checked="true"]', target).dataset.value);
    }
    function applyState(state) {
      const container = select_dom(".js-issues-results");
      container.classList.toggle("rgh-conversation-activity-is-filtered", "default" !== state), 
      container.classList.toggle("rgh-conversation-activity-is-collapsed-filtered", "hideEventsAndCollapsedComments" === state);
      for (const dropdownItem of select_dom.all(`.${dropdownClass} [aria-checked="false"][data-value="${state}"]`)) dropdownItem.setAttribute("aria-checked", "true");
      for (const dropdownItem of select_dom.all(`.${dropdownClass} [aria-checked="true"]:not([data-value="${state}"])`)) dropdownItem.setAttribute("aria-checked", "false");
    }
    async function addWidget(header, state) {
      const position = (await elementReady(header)).closest("div");
      if (position.classList.contains("rgh-conversation-activity-filter")) return;
      const availableSpaceToTheLeftOfTheDropdown = position.lastElementChild.getBoundingClientRect().right - position.parentElement.getBoundingClientRect().left, alignment = 0 === availableSpaceToTheLeftOfTheDropdown || availableSpaceToTheLeftOfTheDropdown > 270 ? "right-0" : "left-0";
      var current;
      wrap(position, dom_chef.createElement("div", {
        className: "rgh-conversation-activity-filter-wrapper"
      })), position.classList.add("rgh-conversation-activity-filter"), position.after(dom_chef.createElement("details", {
        className: `details-reset details-overlay d-inline-block ml-2 position-relative ${dropdownClass}`,
        id: "rgh-conversation-activity-filter-select-menu"
      }, dom_chef.createElement("summary", null, dom_chef.createElement(EyeIcon, {
        className: "color-fg-muted"
      }), dom_chef.createElement(EyeClosedIcon, {
        className: "color-fg-danger"
      }), dom_chef.createElement("div", {
        className: "dropdown-caret ml-1"
      })), dom_chef.createElement("details-menu", {
        className: `SelectMenu ${alignment}`,
        "on-details-menu-select": handleSelection
      }, dom_chef.createElement("div", {
        className: "SelectMenu-modal"
      }, dom_chef.createElement("div", {
        className: "SelectMenu-header"
      }, dom_chef.createElement("h3", {
        className: "SelectMenu-title color-fg-default"
      }, "Filter conversation activities"), dom_chef.createElement("button", {
        className: "SelectMenu-closeButton",
        type: "button",
        "data-toggle-for": "rgh-conversation-activity-filter-select-menu"
      }, dom_chef.createElement(XIcon, null))), dom_chef.createElement("div", {
        className: "SelectMenu-list"
      }, (current = state, Object.entries(states).map((([state, label]) => dom_chef.createElement("div", {
        className: "SelectMenu-item",
        role: "menuitemradio",
        "aria-checked": state === current ? "true" : "false",
        "data-value": state
      }, dom_chef.createElement(CheckIcon, {
        className: "SelectMenu-icon SelectMenu-icon--check"
      }), label || "Show all")))))))));
    }
    const minorFixesIssuePages = [ "https://github.com/refined-github/refined-github/issues/5222", "https://github.com/refined-github/refined-github/issues/4008", "https://github.com/refined-github/refined-github/issues/3686", "https://github.com/refined-github/refined-github/issues/6000" ];
    function uncollapseTargetedComment() {
      location.hash.startsWith("#issuecomment-") && select_dom(`.${collapsedClassName} ${location.hash}`)?.closest(".js-timeline-item")?.classList.remove(collapsedClassName);
    }
    function switchToNextFilter() {
      switch (select_dom(`.${dropdownClass} [aria-checked="true"]`).dataset.value) {
       case "default":
        applyState("hideEvents");
        break;

       case "hideEvents":
        applyState("hideEventsAndCollapsedComments");
        break;

       case "hideEventsAndCollapsedComments":
        applyState("default");
      }
    }
    function selectAllNotifications() {
      select_dom(".js-notifications-mark-all-prompt").click();
    }
    function parseTime(element) {
      return new Date(element.getAttribute("datetime")).getTime();
    }
    function view_last_pr_deployment_addLink(header) {
      const lastDeployment = select_dom.last('.js-timeline-item a[title="Deployment has completed"]');
      lastDeployment && header.prepend(dom_chef.createElement("a", {
        className: "rgh-last-deployment btn btn-sm d-none d-md-block mr-1",
        target: "_blank",
        rel: "noopener noreferrer",
        href: lastDeployment.href
      }, dom_chef.createElement(LinkExternalIcon, {
        className: "mr-1 v-align-text-top"
      }), "Last deployment"));
    }
    function onKeyDown(event) {
      const field = event.delegateTarget, form = field.form;
      if ("Enter" !== event.key || event.ctrlKey || event.metaKey || event.isComposing || select_dom.exists([ ".suggester", ".rgh-avoid-accidental-submissions" ], form)) return;
      if (select_dom.exists('.btn-primary[type="submit"]:disabled', form)) return;
      const spacingClasses = isNewFile() || isEditingFile() ? "my-1" : "mt-2 mb-n1", message = dom_chef.createElement("p", {
        className: "rgh-avoid-accidental-submissions " + spacingClasses
      }, "A submission via ", dom_chef.createElement("kbd", null, "enter"), " has been prevented. You can press ", dom_chef.createElement("kbd", null, "enter"), " again or use ", dom_chef.createElement("kbd", null, isMac ? "cmd" : "ctrl"), dom_chef.createElement("kbd", null, "enter"), ".");
      isNewFile() || isEditingFile() || isPRConversation() ? field.after(message) : field.parentElement.append(message), 
      event.preventDefault();
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/conversation-activity-filter.tsx", {
      include: [ isConversation ],
      additionalListeners: [ onConversationHeaderUpdate ],
      shortcuts: {
        h: "Cycle through conversation activity filters"
      },
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function(signal) {
        const state = minorFixesIssuePages.some((url => location.href.startsWith(url))) ? "hideEventsAndCollapsedComments" : "default";
        return await addWidget("#partial-discussion-header .gh-header-meta :is(clipboard-copy, .flex-auto)", state), 
        await addWidget("#partial-discussion-header .gh-header-sticky :is(clipboard-copy, relative-time)", state), 
        "default" !== state && applyState(state), window.addEventListener("hashchange", uncollapseTargetedComment, {
          signal
        }), observe(".js-timeline-item", processItem, {
          signal
        }), registerHotkey("h", switchToNextFilter);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/select-all-notifications-shortcut.tsx", {
      shortcuts: {
        a: "Select all notifications"
      },
      include: [ isNotifications ],
      exclude: [ isBlank ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: function() {
        return registerHotkey("a", selectAllNotifications);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/no-duplicate-list-update-time.tsx", {
      asLongAs: [ () => location.search.includes("sort%3Aupdated-") ],
      include: [ isIssueOrPRList ],
      deduplicate: "has-rgh-inner",
      init: function() {
        for (const issue of select_dom.all('.js-navigation-item[id^="issue_"]')) {
          const [stateChangeTime, updateTime] = select_dom.all("relative-time", issue);
          parseTime(updateTime) - parseTime(stateChangeTime) < 1e4 && updateTime.parentElement.remove();
        }
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/view-last-pr-deployment.tsx", {
      include: [ isPRConversation ],
      init: function(signal) {
        observe(".gh-header-actions", view_last_pr_deployment_addLink, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/global-search-filters.tsx", {
      include: [ isGlobalSearchResults ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const filters = [ [ "Forks", "fork:true" ], [ "Private", "is:private" ], [ "Yours", "user:" + github_helpers_getUsername() ], [ "Authored", "author:@me" ] ], items = [];
        for (const [name, filter] of filters) {
          const item = dom_chef.createElement("a", {
            className: "filter-item",
            href: location.href
          }, name), query = SearchQuery.from(item);
          query.includes(filter) ? (query.remove(filter), item.classList.add("selected"), 
          item.prepend(dom_chef.createElement(XIcon, {
            className: "float-right"
          }))) : query.add(filter), item.href = query.href, items.push(dom_chef.createElement("li", null, item));
        }
        (await elementReady("#js-pjax-container .menu ~ .mt-3")).before(dom_chef.createElement("div", {
          className: "border rounded-1 p-3 mb-3 d-none d-md-block"
        }, dom_chef.createElement("h2", {
          className: "d-inline-block f5 mb-2"
        }, "Filters"), dom_chef.createElement("ul", {
          className: "filter-list small"
        }, items)));
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-header-search-field.tsx", {
      include: [ isIssueOrPRList, isGlobalIssueOrPRList, isRepoSearch ],
      awaitDomReady: !1,
      init: async function() {
        (await elementReady("input.header-search-input")).value = "";
      }
    });
    const inputElements = [ "form.new_issue input#issue_title", "input#pull_request_title", "input#commit-summary-input", "#merge_title_field" ];
    function quick_review_comment_deletion_onButtonClick({delegateTarget: button}) {
      try {
        button.closest(".js-comment").querySelector(".show-more-psopover .js-comment-delete > button").click();
      } catch (error) {
        showToast(new Error("Feature broken. Please open an issue with the link found in the console")), 
        feature_manager.log.error("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-review-comment-deletion.tsx", error.message);
      }
    }
    async function preloadDropdown({delegateTarget: button}) {
      const comment = button.closest(".js-comment");
      await async function(detailsMenu) {
        const fragment = select_dom(".js-comment-header-actions-deferred-include-fragment", detailsMenu);
        fragment && (detailsMenu.parentElement.dispatchEvent(new Event("mouseover")), await oneEvent(fragment, "load"));
      }(select_dom("details-menu.show-more-popover", comment));
    }
    function addDeleteButton(cancelButton) {
      cancelButton.after(dom_chef.createElement("button", {
        className: "btn btn-danger float-left rgh-review-comment-delete-button",
        type: "button"
      }, dom_chef.createElement(TrashIcon, null)));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/avoid-accidental-submissions.tsx", {
      include: [ isNewIssue, isCompare, isNewFile, isEditingFile, isPRConversation ],
      exclude: [ isBlank ],
      init: function(signal) {
        delegate_it(document, inputElements.join(","), "keydown", onKeyDown, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/quick-review-comment-deletion.tsx", {
      include: [ isPRConversation, isPRFiles ],
      awaitDomReady: !1,
      init: function(signal) {
        delegate_it(document, ".rgh-review-comment-delete-button", "click", quick_review_comment_deletion_onButtonClick, {
          signal
        }), delegate_it(document, ".rgh-quick-comment-edit-button", "click", preloadDropdown, {
          signal
        }), observe(".review-comment .js-comment-cancel-button", addDeleteButton, {
          signal
        });
      }
    }), feature_manager.addCssFeature("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/no-unnecessary-split-diff-view.tsx", [ hasFiles ]);
    const stateColorMap = {
      OPEN: "color-fg-success",
      CLOSED: "color-fg-danger",
      MERGED: "color-fg-done",
      DRAFT: ""
    };
    function comment_on_draft_pr_indicator_addIndicator(button) {
      const preposition = button.textContent.includes("Add") ? " to " : " on ";
      button.textContent += preposition + "draft PR";
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/list-prs-for-branch.tsx", {
      include: [ isRepoCommitList ],
      awaitDomReady: !1,
      deduplicate: "has-rgh-inner",
      init: async function() {
        const currentBranch = getCurrentCommittish();
        if (!currentBranch || /^[\da-f]{40}$/.test(currentBranch) || await getDefaultBranch() === currentBranch) return !1;
        const prInfo = (await getPullRequestsAssociatedWithBranch())[currentBranch];
        if (!prInfo) return;
        const StateIcon = stateIcon[prInfo.state], link = dom_chef.createElement("a", {
          "data-issue-and-pr-hovercards-enabled": !0,
          href: prInfo.url,
          className: "btn flex-self-center rgh-list-prs-for-branch",
          "data-hovercard-type": "pull_request",
          "data-hovercard-url": prInfo.url + "/hovercard"
        }, dom_chef.createElement(StateIcon, {
          className: stateColorMap[prInfo.state]
        }), dom_chef.createElement("span", null, " #", prInfo.number));
        await addAfterBranchSelector(link);
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/comment-on-draft-pr-indicator.tsx", {
      asLongAs: [ isDraftPR ],
      include: [ isPRConversation, isPRFiles ],
      awaitDomReady: !1,
      init: function(signal) {
        observe([ ".review-simple-reply-button", ".add-comment-label", ".start-review-label" ], comment_on_draft_pr_indicator_addIndicator, {
          signal
        });
      }
    });
    const filters = {
      "Pull requests": ":is(.octicon-git-pull-request, .octicon-git-pull-request-closed, .octicon-git-pull-request-draft, .octicon-git-merge)",
      Issues: ":is(.octicon-issue-opened, .octicon-issue-closed)",
      Open: ":is(.octicon-issue-opened, .octicon-git-pull-request)",
      Closed: ":is(.octicon-issue-closed, .octicon-git-pull-request-closed)",
      Draft: ".octicon-git-pull-request-draft",
      Merged: ".octicon-git-merge",
      Read: ".notification-read",
      Unread: ".notification-unread"
    };
    function resetFilters({target}) {
      select_dom("form#rgh-select-notifications-form").reset();
      for (const label of select_dom.all("label", target)) label.setAttribute("aria-checked", "false");
    }
    function getFiltersSelector(formData, category) {
      return formData.getAll(category).map((value => filters[value])).join(",");
    }
    function select_notifications_handleSelection({target}) {
      const selectAllCheckbox = select_dom('input[type="checkbox"].js-notifications-mark-all-prompt');
      if (selectAllCheckbox.checked && selectAllCheckbox.click(), select_dom.exists(":checked", target)) {
        const formData = new FormData(select_dom("form#rgh-select-notifications-form")), types = getFiltersSelector(formData, "Type"), statuses = getFiltersSelector(formData, "Status"), readStatus = getFiltersSelector(formData, "Read");
        for (const notification of select_dom.all(".notifications-list-item")) (types && !select_dom.exists(types, notification) || statuses && !select_dom.exists(statuses, notification) || readStatus && !notification.matches(readStatus)) && select_dom(".js-notification-bulk-action-check-item", notification).removeAttribute("data-check-all-item");
        select_dom.exists(".js-notification-bulk-action-check-item[data-check-all-item]") && selectAllCheckbox.click();
      }
      for (const disabledNotificationCheckbox of select_dom.all(".js-notification-bulk-action-check-item:not([data-check-all-item])")) disabledNotificationCheckbox.setAttribute("data-check-all-item", "");
    }
    function createDropdownList(category, filters2) {
      const icons = {
        "Pull requests": dom_chef.createElement(GitPullRequestIcon, {
          className: "color-fg-muted"
        }),
        Issues: dom_chef.createElement(IssueOpenedIcon, {
          className: "color-fg-muted"
        }),
        Open: dom_chef.createElement(CheckCircleIcon, {
          className: "color-fg-success"
        }),
        Closed: dom_chef.createElement(XCircleIcon, {
          className: "color-fg-danger"
        }),
        Draft: dom_chef.createElement(GitPullRequestDraftIcon, {
          className: "color-fg-subtle"
        }),
        Merged: dom_chef.createElement(GitMergeIcon, {
          className: "color-fg-done"
        }),
        Read: dom_chef.createElement(DotIcon, {
          className: "color-fg-accent"
        }),
        Unread: dom_chef.createElement(DotFillIcon, {
          className: "color-fg-accent"
        })
      };
      return dom_chef.createElement("div", {
        className: "SelectMenu-list"
      }, dom_chef.createElement("header", {
        className: "SelectMenu-header"
      }, dom_chef.createElement("span", {
        className: "SelectMenu-title"
      }, category)), filters2.map((filter => dom_chef.createElement("label", {
        className: "SelectMenu-item text-normal",
        role: "menuitemcheckbox",
        "aria-checked": "false",
        tabIndex: 0
      }, dom_chef.createElement(CheckIcon, {
        className: "octicon octicon-check SelectMenu-icon SelectMenu-icon--check mr-2",
        "aria-hidden": "true"
      }), dom_chef.createElement("div", {
        className: "SelectMenu-item-text"
      }, dom_chef.createElement("input", {
        hidden: !0,
        type: "checkbox",
        name: category,
        value: filter
      }), icons[filter], dom_chef.createElement("span", {
        className: "ml-2"
      }, filter))))));
    }
    const createDropdown = node_modules_onetime((() => dom_chef.createElement("details", {
      className: "details-reset details-overlay position-relative rgh-select-notifications mx-2",
      onToggle: resetFilters
    }, dom_chef.createElement("summary", {
      className: "h6",
      "data-hotkey": "S",
      "aria-haspopup": "menu",
      role: "button"
    }, "Select by ", dom_chef.createElement("span", {
      className: "dropdown-caret ml-1"
    })), dom_chef.createElement("details-menu", {
      className: "SelectMenu left-0",
      "aria-label": "Select by",
      role: "menu",
      "on-details-menu-selected": select_notifications_handleSelection
    }, dom_chef.createElement("div", {
      className: "SelectMenu-modal"
    }, dom_chef.createElement("form", {
      id: "rgh-select-notifications-form"
    }, createDropdownList("Type", [ "Pull requests", "Issues" ]), createDropdownList("Status", [ "Open", "Closed", "Merged", "Draft" ]), createDropdownList("Read", [ "Read", "Unread" ])))))));
    function closeDropdown() {
      select_dom(".rgh-select-notifications")?.removeAttribute("open");
    }
    function addDropdown(markAllPrompt) {
      markAllPrompt.closest("label").after(createDropdown());
    }
    function mustKeepTab(tab) {
      return !tab || tab.matches(".selected") || canUserEditRepo();
    }
    function onlyShowInDropdown(id) {
      const tabItem = select_dom(`[data-tab-item$="${id}"]`);
      if (!tabItem && isEnterprise()) return;
      (tabItem.closest("li") ?? tabItem.closest(".UnderlineNav-item")).classList.add("d-none");
      const menuItem = select_dom(`[data-menu-item$="${id}"]`);
      menuItem.removeAttribute("data-menu-item"), menuItem.hidden = !1, select_dom(".UnderlineNav-actions ul").append(menuItem);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/select-notifications.tsx", {
      shortcuts: {
        S: 'Open the "Select by" dropdown'
      },
      include: [ isNotifications ],
      exclude: [ isBlank ],
      init: function(signal) {
        observe(".js-notifications-mark-all-prompt", addDropdown, {
          signal
        }), delegate_it(document, ".js-notifications-mark-selected-actions > *, .rgh-open-selected-button", "click", closeDropdown, {
          signal
        });
      }
    });
    const getWikiPageCount = webext_storage_cache.function((async () => {
      const dom = await fetch_dom(buildRepoURL("wiki")), counter = dom.querySelector("#wiki-pages-box .Counter");
      return counter ? looseParseInt(counter) : dom.querySelectorAll("#wiki-content > .Box .Box-row").length;
    }), {
      maxAge: {
        hours: 1
      },
      staleWhileRevalidate: {
        days: 5
      },
      cacheKey: () => "wiki-page-count:" + github_helpers_getRepo().nameWithOwner
    }), getWorkflowsCount = webext_storage_cache.function((async () => {
      const {repository: {workflowFiles}} = await v4('\n\t\trepository() {\n\t\t\tworkflowFiles: object(expression: "HEAD:.github/workflows") {\n\t\t\t\t... on Tree { entries { oid } }\n\t\t\t}\n\t\t}\n\t');
      return workflowFiles?.entries.length ?? 0;
    }), {
      maxAge: {
        days: 1
      },
      staleWhileRevalidate: {
        days: 10
      },
      cacheKey: () => "workflows-count:" + github_helpers_getRepo().nameWithOwner
    });
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/clean-repo-tabs.tsx", {
      include: [ isRepo ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        if (!await unhideOverflowDropdown()) return !1;
        await elementReady(".UnderlineNav-actions ul"), onlyShowInDropdown("security-tab"), 
        onlyShowInDropdown("insights-tab");
      }
    }, {
      include: [ isRepo, isOrganizationProfile ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const projectsTab = await elementReady('[data-hotkey="g b"]');
        if (await async function(tab) {
          const counter = select_dom(".Counter, .num", tab);
          return counter ? (counter.firstChild || await oneMutation(tab, {
            childList: !0,
            subtree: !0
          }), Number(counter.textContent)) : 0;
        }(projectsTab) > 0 || mustKeepTab(projectsTab)) return !1;
        isRepo() ? onlyShowInDropdown("projects-tab") : await async function() {
          return Boolean(await elementReady('.btn-primary[href$="repositories/new"]'));
        }() || projectsTab.remove();
      }
    }, {
      include: [ isRepo ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const actionsTab = await elementReady('[data-hotkey="g a"]');
        if (!actionsTab) return !1;
        if (await getWorkflowsCount() > 0 || mustKeepTab(actionsTab)) return !1;
        onlyShowInDropdown("actions-tab");
      }
    }, {
      include: [ isRepo ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const wikiTab = await elementReady('[data-hotkey="g w"]');
        if (!wikiTab) return !1;
        const wikiPageCount = await getWikiPageCount();
        wikiPageCount > 0 || mustKeepTab(wikiTab) ? function(tab, count) {
          const tabCounter = select_dom(".Counter", tab);
          tabCounter.textContent = abbreviateNumber(count), tabCounter.title = count > 999 ? String(count) : "";
        }(wikiTab, wikiPageCount) : onlyShowInDropdown("wiki-tab");
      }
    });
    var open_options_browser = __webpack_require__(412);
    function openOptions(event) {
      event.preventDefault(), open_options_browser.runtime.sendMessage({
        openOptionsPage: !0
      });
    }
    async function sessionResumeHandler() {
      await Promise.resolve();
      const cancelMergeButton = select_dom(".merge-branch-form .js-details-target");
      cancelMergeButton && (cancelMergeButton.click(), document.removeEventListener("session:resume", sessionResumeHandler));
    }
    async function clearCacheHandler(event) {
      await webext_storage_cache.clear();
      const button = event.target, initialText = button.textContent;
      button.textContent = "Cache cleared!", button.disabled = !0, setTimeout((() => {
        button.textContent = initialText, button.disabled = !1;
      }), 2e3);
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/rgh-welcome-issue.tsx", {
      include: [ () => location.href.startsWith("https://github.com/refined-github/refined-github/issues/3543") ],
      init: function(signal) {
        if (delegate_it(document, 'a[href="#rgh-linkify-welcome-issue"]', "click", openOptions, {
          signal
        }), select_dom.exists(".rgh-linkify-welcome-issue")) return;
        const [opening, closing] = select_dom.all('a[href="#rgh-linkify-welcome-issue"]');
        closing.remove(), opening.append(opening.nextSibling), opening.classList.add("rgh-linkify-welcome-issue");
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/same-branch-author-commits.tsx", {
      include: [ isRepoCommitList ],
      init: function() {
        for (const author of select_dom.all(".js-navigation-container a.commit-author")) author.pathname = location.pathname;
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/prevent-pr-merge-panel-opening.tsx", {
      include: [ isPRConversation ],
      awaitDomReady: !1,
      init: function(signal) {
        document.addEventListener("session:resume", sessionResumeHandler, {
          signal
        });
      }
    });
    var rgh_improve_new_issue_form_browser = __webpack_require__(412);
    function toggleCommitMessage(event) {
      event.target.closest("a, button, clipboard-copy, details") || select_dom(".ellipsis-expander", event.delegateTarget)?.dispatchEvent(new MouseEvent("click", {
        bubbles: !0,
        altKey: event.altKey
      }));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/rgh-improve-new-issue-form.tsx", {
      asLongAs: [ isRefinedGitHubRepo, isNewIssue, () => "1_bug_report.yml" === new URL(location.href).searchParams.get("template") ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const {version} = rgh_improve_new_issue_form_browser.runtime.getManifest();
        select_dom("input#issue_form_extension_version").value = version, select_dom('[href="#clear-cache"]').replaceWith(dom_chef.createElement("button", {
          className: "btn",
          type: "button",
          onClick: clearCacheHandler
        }, "Clear cache")), expectTokenScope("repo").catch((() => {
          select_dom("#issue_body_template_name").before(dom_chef.createElement("div", {
            className: "flash flash-warn m-2"
          }, "Your Personal Access Token is either missing, incorrect or expired. Some Refined GitHub features will not work without it.", dom_chef.createElement("br", null), "You can update it ", dom_chef.createElement("a", {
            href: "#",
            onClick: openOptions
          }, "in the options"), "."));
        }));
      }
    });
    const commitMessagesSelector = [ ".js-commits-list-item", ":is(.file-navigation, .js-permalink-shortcut) ~ .Box .Box-header" ].join(",");
    function commandPaletteKeydown(event) {
      const {key, ctrlKey, delegateTarget} = event;
      if (!ctrlKey || "n" !== key && "p" !== key) return;
      event.preventDefault();
      const targetKey = "n" === key ? "ArrowDown" : "ArrowUp";
      delegateTarget.dispatchEvent(new KeyboardEvent("keydown", {
        bubbles: !0,
        key: targetKey,
        code: targetKey
      }));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/easy-toggle-commit-messages.tsx", {
      include: [ isCommitList, isCompare, isRepoTree, isSingleFile ],
      awaitDomReady: !1,
      init: function(signal) {
        delegate_it(document, commitMessagesSelector, "click", toggleCommitMessage, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/command-palette-navigation-shortcuts.tsx", {
      asLongAs: [ () => isMac ],
      shortcuts: {
        "ctrl n": "Select next item in command palette",
        "ctrl p": "Select previous item in command palette"
      },
      awaitDomReady: !1,
      init: node_modules_onetime((function() {
        delegate_it(document, "command-palette", "keydown", commandPaletteKeydown);
      }))
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/link-to-compare-diff.tsx", {
      include: [ isCompare ],
      exclude: [ () => select_dom.exists(".tabnav") ],
      deduplicate: "has-rgh-inner",
      init: function() {
        const changedFilesSummary = selectHas(".Box li:has(.octicon-file-diff)");
        wrapAll([ ...changedFilesSummary.children ], dom_chef.createElement("a", {
          className: "no-underline rgh-link-to-compare-diff",
          href: "#files_bucket"
        }));
      }
    });
    const linkify_user_labels_selectors = [ '.Label[aria-label*="a member of the"]', '.Label[aria-label^="This user has previously committed"]' ];
    function linkify_user_labels_linkify(label) {
      if (label.closest("a")) return void feature_manager.log.error("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-user-labels.tsx", "Already linkified, feature needs to be updated");
      const url = new URL(buildRepoURL("commits"));
      url.searchParams.set("author", function(anyElementInsideComment) {
        const avatar = anyElementInsideComment.closest(".TimelineItem, .review-comment").querySelector(".TimelineItem-avatar img, img.avatar"), name = avatar.alt.replace(/^@/, "");
        return !name.endsWith("[bot]") && avatar.closest('[href^="https://github.com/apps/"]') ? name + "[bot]" : name;
      }(label)), wrap(label, dom_chef.createElement("a", {
        className: "Link--secondary",
        href: url.href
      }));
    }
    function addToConversation(discussionHeader) {
      discussionHeader.style.pointerEvents = "none";
      const lastCloseEvent = select_dom.last("\n\t\t.TimelineItem-badge :is(\n\t\t\t.octicon-issue-closed,\n\t\t\t.octicon-git-merge,\n\t\t\t.octicon-git-pull-request-closed,\n\t\t\t.octicon-skip\n\t\t)\n\t").closest(".TimelineItem");
      wrap(discussionHeader, dom_chef.createElement("a", {
        "aria-label": "Scroll to most recent close event",
        className: "tooltipped tooltipped-s",
        href: "#" + lastCloseEvent.id
      }));
    }
    function last_notification_page_button_linkify(nextButton) {
      const lastNotificationPageNode = select_dom(".js-notifications-list-paginator-counts").lastChild;
      assertNodeContent(lastNotificationPageNode, /^of \d+$/);
      const lastNotificationPageNumber = looseParseInt(lastNotificationPageNode), lastCursor = 50 * Math.floor(lastNotificationPageNumber / 50), nextButtonSearch = new URLSearchParams(nextButton.search);
      nextButtonSearch.set("after", btoa(`cursor:${lastCursor}`)), lastNotificationPageNode.replaceWith(" of ", dom_chef.createElement("a", {
        href: "?" + String(nextButtonSearch)
      }, lastNotificationPageNumber));
    }
    feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/linkify-user-labels.tsx", {
      include: [ hasComments ],
      asLongAs: [ isRepo ],
      awaitDomReady: !1,
      init: function(signal) {
        observe(linkify_user_labels_selectors, linkify_user_labels_linkify, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/repo-avatars.tsx", {
      include: [ isRepo ],
      awaitDomReady: !1,
      deduplicate: "has-rgh",
      init: async function() {
        const icon = await elementReady("#repository-container-header .octicon-repo");
        if (!icon) return;
        const link = select_dom('#repository-container-header a[rel="author"]').cloneNode(), username = github_helpers_getRepo().owner, src = getUserAvatar(username, 24), avatar = dom_chef.createElement("img", {
          className: "avatar mr-2 d-block",
          src,
          width: 24,
          height: 24,
          alt: `@${username}`
        });
        link.append(avatar), icon.replaceWith(link), "organization" !== link.dataset.hovercardType && avatar.classList.add("avatar-user");
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/jump-to-conversation-close-event.tsx", {
      asLongAs: [ isConversation ],
      include: [ () => exists("#partial-discussion-header :is(.octicon-issue-closed, .octicon-skip)"), isClosedPR ],
      init: function(signal) {
        observe(any`
			#partial-discussion-header :is(
				[title^="Status: Closed"],
				[title^="Status: Merged"]
			)
		`, addToConversation, {
          signal
        });
      }
    }), feature_manager.add("file:///home/dhochman/go/src/github.com/danielhochman/refined-github/source/features/last-notification-page-button.tsx", {
      include: [ isNotifications ],
      init: function(signal) {
        observe('a[aria-label="Next"]', last_notification_page_button_linkify, {
          signal
        });
      }
    });
  })();
})();