(() => {
  var __webpack_modules__ = {
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
  (() => {
    "use strict";
    const webext_polyfill_kinda_chromeP = globalThis.chrome && new function NestedProxy(target) {
      return new Proxy(target, {
        get: (target, prop) => "function" != typeof target[prop] ? new NestedProxy(target[prop]) : (...arguments_) => new Promise(((resolve, reject) => {
          target[prop](...arguments_, (result => {
            chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(result);
          }));
        }))
      });
    }(globalThis.chrome), webext_polyfill_kinda = webext_polyfill_kinda_chromeP, gotScripting = "object" == typeof chrome && "scripting" in chrome;
    function castTarget(target) {
      return "object" == typeof target ? target : {
        tabId: target,
        frameId: 0
      };
    }
    function arrayOrUndefined(value) {
      return void 0 === value ? void 0 : [ value ];
    }
    async function insertCSS({tabId, frameId, files, allFrames, matchAboutBlank, runAt}) {
      await Promise.all(files.map((async content => ("string" == typeof content && (content = {
        file: content
      }), gotScripting ? chrome.scripting.insertCSS({
        target: {
          tabId,
          frameIds: arrayOrUndefined(frameId),
          allFrames
        },
        files: "file" in content ? [ content.file ] : void 0,
        css: "code" in content ? content.code : void 0
      }) : webext_polyfill_kinda.tabs.insertCSS(tabId, {
        ...content,
        matchAboutBlank,
        allFrames,
        frameId,
        runAt: runAt ?? "document_start"
      })))));
    }
    async function executeScript({tabId, frameId, files, allFrames, matchAboutBlank, runAt}) {
      let lastInjection;
      for (let content of files) if ("string" == typeof content && (content = {
        file: content
      }), gotScripting) {
        if ("code" in content) throw new Error("chrome.scripting does not support injecting strings of `code`");
        chrome.scripting.executeScript({
          target: {
            tabId,
            frameIds: arrayOrUndefined(frameId),
            allFrames
          },
          files: [ content.file ]
        });
      } else "code" in content && await lastInjection, lastInjection = webext_polyfill_kinda.tabs.executeScript(tabId, {
        ...content,
        matchAboutBlank,
        allFrames,
        frameId,
        runAt
      });
    }
    const patternValidationRegex = /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/, isFirefox = "object" == typeof navigator && navigator.userAgent.includes("Firefox/"), allStarsRegex = isFirefox ? /^(https?|wss?):[/][/][^/]+([/].*)?$/ : /^https?:[/][/][^/]+([/].*)?$/, allUrlsRegex = /^(https?|file|ftp):[/]+/;
    function webext_patterns_patternToRegex(...matchPatterns) {
      return 0 === matchPatterns.length ? /$./ : matchPatterns.includes("<all_urls>") ? allUrlsRegex : matchPatterns.includes("*://*/*") ? allStarsRegex : new RegExp(matchPatterns.map((x => function(matchPattern) {
        if (!patternValidationRegex.test(matchPattern)) throw new Error(matchPattern + " is an invalid pattern, it must match " + String(patternValidationRegex));
        let [, protocol, host, pathname] = matchPattern.split(/(^[^:]+:[/][/])([^/]+)?/);
        return protocol = protocol.replace("*", isFirefox ? "(https?|wss?)" : "https?").replace(/[/]/g, "[/]"), 
        host = (null != host ? host : "").replace(/^[*][.]/, "([^/]+.)*").replace(/^[*]$/, "[^/]+").replace(/[.]/g, "[.]").replace(/[*]$/g, "[^.]+"), 
        pathname = pathname.replace(/[/]/g, "[/]").replace(/[.]/g, "[.]").replace(/[*]/g, ".*"), 
        "^" + protocol + host + "(" + pathname + ")?$";
      }(x))).join("|"));
    }
    const gotNavigation = "object" == typeof chrome && "webNavigation" in chrome;
    async function wasPreviouslyLoaded(target, assets) {
      return async function(target, function_, ...args) {
        const {frameId, tabId} = castTarget(target);
        if (gotScripting) {
          const [injection] = await chrome.scripting.executeScript({
            target: {
              tabId,
              frameIds: [ frameId ]
            },
            func: function_,
            args
          });
          return injection?.result;
        }
        const [result] = await webext_polyfill_kinda.tabs.executeScript(tabId, {
          code: `(${function_.toString()})(...${JSON.stringify(args)})`,
          frameId
        });
        return result;
      }(target, (key => {
        const wasLoaded = document[key];
        return document[key] = !0, wasLoaded;
      }), JSON.stringify(assets));
    }
    async function registerContentScript(contentScriptOptions, callback) {
      const {js = [], css = [], matchAboutBlank, matches, excludeMatches, runAt} = contentScriptOptions;
      let {allFrames} = contentScriptOptions;
      gotNavigation ? allFrames = !1 : allFrames && console.warn("`allFrames: true` requires the `webNavigation` permission to work correctly: https://github.com/fregante/content-scripts-register-polyfill#permissions");
      const matchesRegex = webext_patterns_patternToRegex(...matches), excludeMatchesRegex = webext_patterns_patternToRegex(...null != excludeMatches ? excludeMatches : []), inject = async (url, tabId, frameId = 0) => {
        matchesRegex.test(url) && !excludeMatchesRegex.test(url) && await async function(url) {
          return webext_polyfill_kinda.permissions.contains({
            origins: [ new URL(url).origin + "/*" ]
          });
        }(url) && !await wasPreviouslyLoaded({
          tabId,
          frameId
        }, {
          js,
          css
        }) && (insertCSS({
          tabId,
          frameId,
          files: css,
          matchAboutBlank,
          runAt
        }), await executeScript({
          tabId,
          frameId,
          files: js,
          matchAboutBlank,
          runAt
        }));
      }, tabListener = async (tabId, {status}, {url}) => {
        status && url && inject(url, tabId);
      }, navListener = async ({tabId, frameId, url}) => {
        inject(url, tabId, frameId);
      };
      gotNavigation ? chrome.webNavigation.onCommitted.addListener(navListener) : chrome.tabs.onUpdated.addListener(tabListener);
      const registeredContentScript = {
        async unregister() {
          gotNavigation ? chrome.webNavigation.onCommitted.removeListener(navListener) : chrome.tabs.onUpdated.removeListener(tabListener);
        }
      };
      return "function" == typeof callback && callback(registeredContentScript), registeredContentScript;
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
    const hostRegex = /:[/][/][*.]*([^/]+)/;
    function parseDomain(origin) {
      return origin.split(hostRegex)[1];
    }
    async function getAdditionalPermissions(options) {
      return new Promise((resolve => {
        chrome.permissions.getAll((currentPermissions => {
          const manifestPermissions = getManifestPermissionsSync();
          resolve(_getAdditionalPermissions(manifestPermissions, currentPermissions, options));
        }));
      }));
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
    const node_modules_webext_polyfill_kinda_chromeP = globalThis.chrome && new function webext_polyfill_kinda_NestedProxy(target) {
      return new Proxy(target, {
        get: (target, prop) => "function" != typeof target[prop] ? new webext_polyfill_kinda_NestedProxy(target[prop]) : (...arguments_) => new Promise(((resolve, reject) => {
          target[prop](...arguments_, (result => {
            chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(result);
          }));
        }))
      });
    }(globalThis.chrome), node_modules_webext_polyfill_kinda = node_modules_webext_polyfill_kinda_chromeP, webext_content_scripts_gotScripting = "object" == typeof chrome && "scripting" in chrome;
    function webext_content_scripts_castTarget(target) {
      return "object" == typeof target ? target : {
        tabId: target,
        frameId: 0
      };
    }
    function webext_content_scripts_arrayOrUndefined(value) {
      return void 0 === value ? void 0 : [ value ];
    }
    async function webext_content_scripts_insertCSS({tabId, frameId, files, allFrames, matchAboutBlank, runAt}) {
      await Promise.all(files.map((async content => ("string" == typeof content && (content = {
        file: content
      }), webext_content_scripts_gotScripting ? chrome.scripting.insertCSS({
        target: {
          tabId,
          frameIds: webext_content_scripts_arrayOrUndefined(frameId),
          allFrames
        },
        files: "file" in content ? [ content.file ] : void 0,
        css: "code" in content ? content.code : void 0
      }) : node_modules_webext_polyfill_kinda.tabs.insertCSS(tabId, {
        ...content,
        matchAboutBlank,
        allFrames,
        frameId,
        runAt: runAt ?? "document_start"
      })))));
    }
    async function webext_content_scripts_executeScript({tabId, frameId, files, allFrames, matchAboutBlank, runAt}) {
      let lastInjection;
      for (let content of files) if ("string" == typeof content && (content = {
        file: content
      }), webext_content_scripts_gotScripting) {
        if ("code" in content) throw new Error("chrome.scripting does not support injecting strings of `code`");
        chrome.scripting.executeScript({
          target: {
            tabId,
            frameIds: webext_content_scripts_arrayOrUndefined(frameId),
            allFrames
          },
          files: [ content.file ]
        });
      } else "code" in content && await lastInjection, lastInjection = node_modules_webext_polyfill_kinda.tabs.executeScript(tabId, {
        ...content,
        matchAboutBlank,
        allFrames,
        frameId,
        runAt
      });
    }
    async function webext_content_scripts_injectContentScript(target, scripts) {
      const {frameId, tabId} = webext_content_scripts_castTarget(target), injections = (possibleArray = scripts, 
      Array.isArray(possibleArray) ? possibleArray : [ possibleArray ]).flatMap((script => [ webext_content_scripts_insertCSS({
        tabId,
        frameId,
        files: script.css ?? [],
        matchAboutBlank: script.matchAboutBlank ?? script.match_about_blank,
        runAt: script.runAt ?? script.run_at
      }), webext_content_scripts_executeScript({
        tabId,
        frameId,
        files: script.js ?? [],
        matchAboutBlank: script.matchAboutBlank ?? script.match_about_blank,
        runAt: script.runAt ?? script.run_at
      }) ]));
      var possibleArray;
      await Promise.all(injections);
    }
    var _a, _b, _c, _d;
    const registeredScripts = new Map, chromeRegister = null === (_b = null === (_a = null === globalThis || void 0 === globalThis ? void 0 : globalThis.chrome) || void 0 === _a ? void 0 : _a.scripting) || void 0 === _b ? void 0 : _b.registerContentScripts, firefoxRegister = null === (_d = null === (_c = null === globalThis || void 0 === globalThis ? void 0 : globalThis.browser) || void 0 === _c ? void 0 : _c.contentScripts) || void 0 === _d ? void 0 : _d.register;
    async function webext_dynamic_content_scripts_registerContentScript(contentScript) {
      var _a, _b;
      if (chromeRegister) {
        const id = "webext-dynamic-content-script-" + JSON.stringify(contentScript);
        try {
          await chromeRegister([ {
            id,
            ...contentScript
          } ]);
        } catch (error) {
          if (!(null == error ? void 0 : error.message.startsWith("Duplicate script ID"))) throw error;
        }
        return {
          unregister: async () => chrome.scripting.unregisterContentScripts([ id ])
        };
      }
      const firefoxContentScript = {
        ...contentScript,
        js: null === (_a = contentScript.js) || void 0 === _a ? void 0 : _a.map((file => ({
          file
        }))),
        css: null === (_b = contentScript.css) || void 0 === _b ? void 0 : _b.map((file => ({
          file
        })))
      };
      return firefoxRegister ? firefoxRegister(firefoxContentScript) : registerContentScript(firefoxContentScript);
    }
    function makePathRelative(file) {
      return new URL(file, location.origin).pathname;
    }
    async function registerOnOrigins({origins: newOrigins}) {
      var _a, _b;
      const manifest = chrome.runtime.getManifest().content_scripts;
      if (!manifest) throw new Error("webext-dynamic-content-scripts tried to register scripts on the new host permissions, but no content scripts were found in the manifest.");
      for (const origin of newOrigins || []) for (const config of manifest) {
        const registeredScript = webext_dynamic_content_scripts_registerContentScript({
          js: null === (_a = config.js) || void 0 === _a ? void 0 : _a.map((file => makePathRelative(file))),
          css: null === (_b = config.css) || void 0 === _b ? void 0 : _b.map((file => makePathRelative(file))),
          allFrames: config.all_frames,
          matches: [ origin ],
          excludeMatches: config.matches,
          runAt: config.run_at
        });
        registeredScripts.set(origin, registeredScript);
      }
      var origins, scripts;
      scripts = manifest, 0 !== (origins = newOrigins || []).length && chrome.tabs.query({
        url: origins
      }, (tabs => {
        for (const tab of tabs) tab.id && webext_content_scripts_injectContentScript(tab.id, scripts);
      }));
    }
    (async () => {
      registerOnOrigins(await getAdditionalPermissions({
        strictOrigins: !1
      }));
    })(), chrome.permissions.onAdded.addListener((permissions => {
      permissions.origins && permissions.origins.length > 0 && registerOnOrigins(permissions);
    })), chrome.permissions.onRemoved.addListener((async ({origins}) => {
      if (origins && 0 !== origins.length) for (const [origin, scriptPromise] of registeredScripts) if (origins.includes(origin)) {
        (await scriptPromise).unregister();
      }
    }));
    const webext_storage_cache_node_modules_webext_polyfill_kinda_chromeP = globalThis.chrome && new function node_modules_webext_polyfill_kinda_NestedProxy(target) {
      return new Proxy(target, {
        get: (target, prop) => "function" != typeof target[prop] ? new node_modules_webext_polyfill_kinda_NestedProxy(target[prop]) : (...arguments_) => new Promise(((resolve, reject) => {
          target[prop](...arguments_, (result => {
            chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(result);
          }));
        }))
      });
    }(globalThis.chrome), webext_storage_cache_node_modules_webext_polyfill_kinda = webext_storage_cache_node_modules_webext_polyfill_kinda_chromeP;
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
    })), isBackgroundWorker = once((() => isCurrentPathname(getManifest()?.background?.service_worker))), isSafari = (once((() => {
      if (!isExtensionContext() || !chrome.runtime.getManifest) return !1;
      const {options_ui: optionsUi} = chrome.runtime.getManifest();
      if ("string" != typeof optionsUi?.page) return !1;
      return new URL(optionsUi.page, location.origin).pathname === location.pathname;
    })), once((() => {
      if (!isExtensionContext() || !chrome.devtools) return !1;
      const {devtools_page: devtoolsPage} = chrome.runtime.getManifest();
      if ("string" != typeof devtoolsPage) return !1;
      return new URL(devtoolsPage, location.origin).pathname === location.pathname;
    })), () => !globalThis.navigator?.userAgent.includes("Chrome") && globalThis.navigator?.userAgent.includes("Safari"));
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
      const internalKey = `cache:${key}`, cachedItem = (await webext_storage_cache_node_modules_webext_polyfill_kinda.storage.local.get(internalKey))[internalKey];
      if (void 0 !== cachedItem) {
        if (!(Date.now() > cachedItem.maxAge)) return cachedItem;
        remove && await webext_storage_cache_node_modules_webext_polyfill_kinda.storage.local.remove(internalKey);
      }
    }
    async function set(key, value, maxAge = cacheDefault) {
      if (arguments.length < 2) throw new TypeError("Expected a value as the second argument");
      if (void 0 === value) await delete_(key); else {
        const internalKey = `cache:${key}`;
        await webext_storage_cache_node_modules_webext_polyfill_kinda.storage.local.set({
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
      return webext_storage_cache_node_modules_webext_polyfill_kinda.storage.local.remove(internalKey);
    }
    async function deleteWithLogic(logic) {
      var _a;
      const wholeCache = await webext_storage_cache_node_modules_webext_polyfill_kinda.storage.local.get(), removableItems = [];
      for (const [key, value] of Object.entries(wholeCache)) key.startsWith("cache:") && (null === (_a = null == logic ? void 0 : logic(value)) || void 0 === _a || _a) && removableItems.push(key);
      removableItems.length > 0 && await webext_storage_cache_node_modules_webext_polyfill_kinda.storage.local.remove(removableItems);
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
    const webext_storage_cache = webext_storage_cache_cache, objectKeys = Object.keys;
    const node_modules_webext_polyfill_kinda_chromeP_0 = globalThis.chrome && new function node_modules_webext_polyfill_kinda_NestedProxy_0(target) {
      return new Proxy(target, {
        get: (target, prop) => "function" != typeof target[prop] ? new node_modules_webext_polyfill_kinda_NestedProxy_0(target[prop]) : (...arguments_) => new Promise(((resolve, reject) => {
          target[prop](...arguments_, (result => {
            chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(result);
          }));
        }))
      });
    }(globalThis.chrome), node_modules_webext_polyfill_kinda_0 = node_modules_webext_polyfill_kinda_chromeP_0;
    let webext_detect_page_cache = !0;
    function webext_detect_page_once(function_) {
      let result;
      return () => (webext_detect_page_cache && void 0 !== result || (result = function_()), 
      result);
    }
    const webext_detect_page_isWebPage = webext_detect_page_once((() => globalThis.location?.protocol.startsWith("http"))), webext_detect_page_isExtensionContext = webext_detect_page_once((() => "object" == typeof globalThis.chrome?.extension)), webext_detect_page_isBackgroundPage = (webext_detect_page_once((() => webext_detect_page_isExtensionContext() && webext_detect_page_isWebPage())), 
    webext_detect_page_once((() => webext_detect_page_isExtensionContext() && ("/_generated_background_page.html" === location.pathname || chrome.extension?.getBackgroundPage?.() === globalThis.window))));
    webext_detect_page_once((() => {
      if (!webext_detect_page_isExtensionContext() || !chrome.runtime.getManifest) return !1;
      const {options_ui: optionsUi} = chrome.runtime.getManifest();
      if ("string" != typeof optionsUi?.page) return !1;
      return new URL(optionsUi.page, location.origin).pathname === location.pathname;
    })), webext_detect_page_once((() => {
      if (!webext_detect_page_isExtensionContext() || !chrome.devtools) return !1;
      const {devtools_page: devtoolsPage} = chrome.runtime.getManifest();
      if ("string" != typeof devtoolsPage) return !1;
      return new URL(devtoolsPage, location.origin).pathname === location.pathname;
    }));
    async function node_modules_webext_content_scripts_executeFunction(target, function_, ...args) {
      const {frameId, tabId} = "object" == typeof target ? target : {
        tabId: target,
        frameId: 0
      }, [result] = await node_modules_webext_polyfill_kinda_0.tabs.executeScript(tabId, {
        code: `(${function_.toString()})(...${JSON.stringify(args)})`,
        frameId
      });
      return result;
    }
    async function getTabUrl(target) {
      const {frameId, tabId} = "object" == typeof target ? target : {
        tabId: target,
        frameId: 0
      };
      try {
        if (0 === frameId) {
          const tab = await node_modules_webext_polyfill_kinda_0.tabs.get(tabId);
          if (tab.url) return tab.url;
        }
        return await node_modules_webext_content_scripts_executeFunction(target, (() => location.href));
      } catch {}
    }
    const contextMenuId = "webext-domain-permission-toggle:add-permission";
    let globalOptions;
    async function updateItem(url) {
      const settings = {
        checked: !1,
        enabled: !0
      };
      if (url) {
        const origin = new URL(url).origin, isDefault = webext_patterns_patternToRegex(...getManifestPermissionsSync().origins).test(origin);
        settings.enabled = !isDefault, settings.checked = isDefault || await async function(origin) {
          return node_modules_webext_polyfill_kinda_0.permissions.contains({
            origins: [ origin + "/*" ]
          });
        }(origin);
      }
      chrome.contextMenus.update(contextMenuId, settings);
    }
    async function handleTabActivated({tabId}) {
      var _a;
      updateItem(null !== (_a = await getTabUrl(tabId)) && void 0 !== _a ? _a : "");
    }
    async function handleClick({checked, menuItemId}, tab) {
      if (menuItemId === contextMenuId) try {
        await async function(tab, toggle) {
          const safariError = "The browser didn't supply any information about the active tab.";
          if (!tab.url && toggle) throw new Error(`Please try again. ${safariError}`);
          if (!tab.url && !toggle) throw new Error(`Couldn't disable the extension on the current tab. ${safariError}`);
          const permissionData = {
            origins: [ new URL(tab.url).origin + "/*" ]
          };
          if (!toggle) return void node_modules_webext_polyfill_kinda_0.permissions.remove(permissionData);
          await node_modules_webext_polyfill_kinda_0.permissions.request(permissionData) ? globalOptions.reloadOnSuccess && node_modules_webext_content_scripts_executeFunction(tab.id, (message => {
            confirm(message) && location.reload();
          }), globalOptions.reloadOnSuccess) : chrome.contextMenus.update(contextMenuId, {
            checked: !1
          });
        }(tab, checked);
      } catch (error) {
        if (null == tab ? void 0 : tab.id) {
          try {
            await node_modules_webext_content_scripts_executeFunction(tab.id, "alert", String(error instanceof Error ? error : new Error(error.message)));
          } catch {
            alert(error);
          }
          updateItem();
        }
        throw error;
      }
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
        const {origins} = await getAdditionalPermissions({
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
    }, Object.fromEntries([ "action-used-by-link", "align-issue-labels", "avoid-accidental-submissions", "batch-mark-files-as-viewed", "bugs-tab", "bypass-checks", "ci-link", "clean-conversation-filters", "clean-conversation-headers", "clean-conversation-sidebar", "clean-header-search-field", "clean-pinned-issues", "clean-repo-filelist-actions", "clean-repo-sidebar", "clean-repo-tabs", "clean-rich-text-editor", "clear-pr-merge-commit-message", "close-out-of-view-modals", "closing-remarks", "collapsible-content-button", "command-palette-navigation-shortcuts", "comment-fields-keyboard-shortcuts", "comment-on-draft-pr-indicator", "comments-time-machine-links", "conflict-marker", "conversation-activity-filter", "conversation-links-on-repo-lists", "convert-pr-to-draft-improvements", "convert-release-to-draft", "copy-file", "copy-on-y", "create-release-shortcut", "cross-deleted-pr-branches", "deep-reblame", "default-branch-button", "dim-bots", "download-folder-button", "easy-toggle-commit-messages", "easy-toggle-files", "edit-readme", "embed-gist-inline", "embed-gist-via-iframe", "enable-file-links-in-compare-view", "esc-to-cancel", "esc-to-deselect-line", "expand-all-hidden-comments", "extend-conversation-status-filters", "extend-diff-expander", "file-finder-buffer", "fit-textareas", "fork-source-link-same-view", "git-checkout-pr", "global-conversation-list-filters", "global-search-filters", "hidden-review-comments-indicator", "hide-diff-signs", "hide-disabled-milestone-sorter", "hide-inactive-deployments", "hide-issue-list-autocomplete", "hide-low-quality-comments", "hide-navigation-hover-highlight", "hide-newsfeed-noise", "hide-own-stars", "highest-rated-comment", "highlight-collaborators-and-own-conversations", "highlight-deleted-and-added-files-in-diffs", "highlight-non-default-base-branch", "html-preview-link", "improve-shortcut-help", "infinite-scroll", "jump-to-change-requested-comment", "jump-to-conversation-close-event", "keyboard-navigation", "last-notification-page-button", "latest-tag-button", "link-to-changelog-file", "link-to-compare-diff", "link-to-github-io", "link-to-prior-blame-line", "linkify-branch-references", "linkify-code", "linkify-commit-sha", "linkify-labels-on-dashboard", "linkify-notification-repository-header", "linkify-symbolic-links", "linkify-user-edit-history-popup", "linkify-user-labels", "linkify-user-location", "list-prs-for-branch", "list-prs-for-file", "mark-merge-commits-in-list", "mark-private-orgs", "minimize-upload-bar", "more-conversation-filters", "more-dropdown-links", "more-file-links", "new-repo-disable-projects-and-wikis", "no-duplicate-list-update-time", "no-unnecessary-split-diff-view", "one-click-diff-options", "one-click-pr-or-gist", "one-click-review-submission", "one-key-formatting", "open-all-conversations", "open-all-notifications", "open-ci-details-in-new-tab", "open-issue-to-latest-comment", "pagination-hotkey", "parse-backticks", "patch-diff-links", "pinned-issues-update-time", "pr-branch-auto-delete", "pr-commit-lines-changed", "pr-filters", "pr-jump-to-first-non-viewed-file", "prevent-duplicate-pr-submission", "prevent-link-loss", "prevent-pr-merge-panel-opening", "preview-hidden-comments", "previous-next-commit-buttons", "profile-gists-link", "profile-hotkey", "pull-request-hotkeys", "quick-comment-edit", "quick-comment-hiding", "quick-file-edit", "quick-label-removal", "quick-mention", "quick-repo-deletion", "quick-review", "quick-review-comment-deletion", "reactions-avatars", "release-download-count", "releases-tab", "reload-failed-proxied-images", "repo-age", "repo-avatars", "repo-wide-file-finder", "resolve-conflicts", "restore-file", "rgh-feature-descriptions", "rgh-improve-new-issue-form", "rgh-linkify-features", "rgh-sponsor-button", "rgh-welcome-issue", "same-branch-author-commits", "same-page-definition-jump", "scheduled-and-manual-workflow-indicators", "select-all-notifications-shortcut", "select-notifications", "selection-in-new-tab", "set-default-repositories-type-to-sources", "shorten-links", "show-associated-branch-prs-on-fork", "show-names", "show-open-prs-of-forks", "show-user-top-repositories", "show-whitespace", "sort-conversations-by-update-time", "sticky-sidebar", "stop-pjax-loading-with-esc", "stop-redirecting-in-notification-bar", "submission-via-ctrl-enter-everywhere", "suggest-commit-title-limit", "swap-branches-on-compare", "sync-pr-commit-title", "tab-to-indent", "table-input", "tag-changes-link", "tags-dropdown", "tags-on-commits-list", "toggle-everything-with-alt", "toggle-files-button", "unfinished-comments", "unwrap-unnecessary-dropdowns", "update-pr-from-base-branch", "use-first-commit-message-for-new-prs", "useful-forks", "useful-not-found-page", "user-local-time", "user-profile-follower-badge", "vertical-front-matter", "view-last-pr-deployment", "wait-for-attachments", "wait-for-checks", "warn-pr-from-master", "warning-for-disallow-edits" ].map((id => [ `feature:${id}`, !0 ])))), renamedFeatures = new Map([ [ "separate-draft-pr-button", "one-click-pr-or-gist" ], [ "prevent-pr-commit-link-loss", "prevent-link-loss" ], [ "remove-projects-tab", "remove-unused-repo-tabs" ], [ "remove-unused-repo-tabs", "clean-repo-tabs" ], [ "more-dropdown", "clean-repo-tabs" ], [ "remove-diff-signs", "hide-diff-signs" ], [ "remove-label-faster", "quick-label-hiding" ], [ "edit-files-faster", "quick-file-edit" ], [ "edit-comments-faster", "quick-comment-edit" ], [ "delete-review-comments-faster", "quick-review-comment-deletion" ], [ "hide-comments-faster", "quick-comment-hiding" ], [ "faster-reviews", "quick-review" ], [ "faster-pr-diff-options", "quick-pr-diff-options" ], [ "hide-useless-comments", "hide-low-quality-comments" ], [ "hide-useless-newsfeed-events", "hide-newsfeed-noise" ], [ "hide-noisy-newsfeed-events", "hide-newsfeed-noise" ], [ "no-useless-split-diff-view", "no-unnecessary-split-diff-view" ], [ "unwrap-useless-dropdowns", "unwrap-unnecessary-dropdowns" ], [ "tag-changelog-link", "tag-changes-link" ], [ "navigate-pages-with-arrow-keys", "pagination-hotkey" ], [ "list-pr-for-branch", "list-prs-for-branch" ], [ "quick-label-hiding", "quick-label-removal" ], [ "next-scheduled-github-action", "scheduled-and-manual-workflow-indicators" ], [ "raw-file-link", "more-file-links" ], [ "conversation-filters", "more-conversation-filters" ], [ "quick-pr-diff-options", "one-click-diff-options" ], [ "quick-review-buttons", "one-click-review-submission" ], [ "wait-for-build", "wait-for-checks" ], [ "pull-request-hotkey", "pull-request-hotkeys" ], [ "first-published-tag-for-merged-pr", "closing-remarks" ] ]);
    const options_storage = new OptionsSyncPerDomain({
      defaults,
      migrations: [ function(options) {
        for (const [from, to] of renamedFeatures) "boolean" == typeof options[`feature:${from}`] && (options[`feature:${to}`] = options[`feature:${from}`]);
      }, OptionsSyncPerDomain.migrations.removeUnused ]
    }).getOptionsForOrigin(), svgTags = new Set([ "a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "animation", "audio", "canvas", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "handler", "hkern", "iframe", "image", "line", "linearGradient", "listener", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "prefetch", "radialGradient", "rect", "script", "set", "solidColor", "stop", "style", "svg", "switch", "symbol", "tbreak", "text", "textArea", "textPath", "title", "tref", "tspan", "unknown", "use", "video", "view", "vkern" ]);
    svgTags.delete("a"), svgTags.delete("audio"), svgTags.delete("canvas"), svgTags.delete("iframe"), 
    svgTags.delete("script"), svgTags.delete("video");
    const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, setCSSProps = (element, style) => {
      for (const [name, value] of Object.entries(style)) name.startsWith("-") ? element.style.setProperty(name, value) : "number" != typeof value || IS_NON_DIMENSIONAL.test(name) ? element.style[name] = value : element.style[name] = `${value}px`;
    }, create = type => "string" == typeof type ? svgTags.has(type) ? document.createElementNS("http://www.w3.org/2000/svg", type) : document.createElement(type) : (type => type === DocumentFragment)(type) ? document.createDocumentFragment() : type(type.defaultProps), setAttribute = (element, name, value) => {
      null != value && (/^xlink[AHRST]/.test(name) ? element.setAttributeNS("http://www.w3.org/1999/xlink", name.replace("xlink", "xlink:").toLowerCase(), value) : element.setAttribute(name, value));
    }, addChildren = (parent, children) => {
      for (const child of children) child instanceof Node ? parent.appendChild(child) : Array.isArray(child) ? addChildren(parent, child) : "boolean" != typeof child && null != child && parent.appendChild(document.createTextNode(child));
    }, booleanishAttributes = new Set([ "contentEditable", "draggable", "spellCheck", "value", "autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha" ]);
    "function" == typeof DocumentFragment && DocumentFragment;
    function getRghIssueUrl(issueNumber) {
      return `https://github.com/refined-github/refined-github/issues/${issueNumber}`;
    }
    var browser = __webpack_require__(412);
    const {version} = browser.runtime.getManifest();
    var background_browser = __webpack_require__(412);
    !function(options) {
      if (!webext_detect_page_isBackgroundPage()) throw new Error("webext-domain-permission-toggle can only be called from a background page");
      if (globalOptions) throw new Error("webext-domain-permission-toggle can only be initialized once");
      const {name, optional_permissions: optionalPermissions} = chrome.runtime.getManifest();
      if (globalOptions = {
        title: `Enable ${name} on this domain`,
        reloadOnSuccess: !1,
        ...options
      }, !0 === globalOptions.reloadOnSuccess && (globalOptions.reloadOnSuccess = `Do you want to reload this page to apply ${name}?`), 
      !chrome.contextMenus) throw new Error("webext-domain-permission-toggle requires the `contextMenu` permission");
      const optionalHosts = null == optionalPermissions ? void 0 : optionalPermissions.filter((permission => /<all_urls>|\*/.test(permission)));
      if (!optionalHosts || 0 === optionalHosts.length) throw new TypeError("webext-domain-permission-toggle some wildcard hosts to be specified in `optional_permissions`");
      chrome.contextMenus.remove(contextMenuId, (() => chrome.runtime.lastError)), chrome.contextMenus.create({
        id: contextMenuId,
        type: "checkbox",
        checked: !1,
        title: globalOptions.title,
        contexts: [ "page_action", "browser_action" ],
        documentUrlPatterns: optionalHosts
      }), chrome.contextMenus.onClicked.addListener(handleClick), chrome.tabs.onActivated.addListener(handleTabActivated), 
      chrome.tabs.onUpdated.addListener((async (tabId, {status}, {url, active}) => {
        var _a;
        active && "complete" === status && updateItem(null !== (_a = null != url ? url : await getTabUrl(tabId)) && void 0 !== _a ? _a : "");
      }));
    }();
    const messageHandlers = {
      openUrls(urls, {tab}) {
        for (const [i, url] of urls.entries()) background_browser.tabs.create({
          url,
          index: tab.index + i + 1,
          active: !1
        });
      },
      closeTab(_, {tab}) {
        background_browser.tabs.remove(tab.id);
      },
      fetch: async url => (await fetch(url)).text(),
      fetchJSON: async url => (await fetch(url)).json(),
      openOptionsPage() {
        background_browser.runtime.openOptionsPage();
      }
    };
    async function isFirstInstall(suggestedReason) {
      return !("0.0.0" === version || "install" !== suggestedReason || isSafari() && await async function() {
        return await background_browser.storage.sync.getBytesInUse() > 0 || Number(await (background_browser.storage.local.getBytesInUse?.())) > 0;
      }());
    }
    background_browser.runtime.onMessage.addListener(((message, sender) => {
      for (const id of objectKeys(message)) if (id in messageHandlers) return messageHandlers[id](message[id], sender);
    })), background_browser.browserAction.onClicked.addListener((async tab => {
      const {actionUrl} = await options_storage.getAll();
      background_browser.tabs.create({
        openerTabId: tab.id,
        url: actionUrl || "https://github.com"
      });
    })), background_browser.runtime.onInstalled.addListener((async ({reason}) => {
      await isFirstInstall(reason) && await background_browser.tabs.create({
        url: getRghIssueUrl(3543)
      }), await webext_storage_cache.delete("hotfixes"), await webext_storage_cache.delete("style-hotfixes");
    }));
  })();
})();