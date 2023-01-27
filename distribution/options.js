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
    const svgTags = new Set([ "a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "animation", "audio", "canvas", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "handler", "hkern", "iframe", "image", "line", "linearGradient", "listener", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "prefetch", "radialGradient", "rect", "script", "set", "solidColor", "stop", "style", "svg", "switch", "symbol", "tbreak", "text", "textArea", "textPath", "title", "tref", "tspan", "unknown", "use", "video", "view", "vkern" ]);
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
    let webext_detect_page_cache = !0;
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
      return () => (webext_detect_page_cache && void 0 !== result || (result = function_()), 
      result);
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
    })), () => globalThis.navigator?.userAgent.includes("Chrome"));
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
    const webext_storage_cache = webext_storage_cache_cache, doma = html => {
      if (null == html) return new DocumentFragment;
      const template = document.createElement("template");
      return template.innerHTML = html, template.content;
    };
    doma.one = html => {
      var _a;
      return null !== (_a = doma(html).firstElementChild) && void 0 !== _a ? _a : void 0;
    };
    const node_modules_doma = doma;
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
    const select_dom = select_dom_select;
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
    function listener(event) {
      fitTextarea(event.target);
    }
    fitTextarea.watch = function(elements) {
      "string" == typeof elements ? elements = document.querySelectorAll(elements) : elements instanceof HTMLTextAreaElement && (elements = [ elements ]);
      for (const element of elements) element.addEventListener("input", listener), element.form && element.form.addEventListener("reset", listener), 
      fitTextarea(element);
    };
    const fit_textarea = fitTextarea, {toString: assert_error_toString} = Object.prototype;
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
    function eventHandler(event) {
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
    const ledger = new WeakMap;
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
    function featureLink(id) {
      return `https://github.com/refined-github/refined-github/blob/main/source/features/${id}.tsx`;
    }
    async function clearCacheHandler(event) {
      await webext_storage_cache.clear();
      const button = event.target, initialText = button.textContent;
      button.textContent = "Cache cleared!", button.disabled = !0, setTimeout((() => {
        button.textContent = initialText, button.disabled = !1;
      }), 2e3);
    }
    const splitDev = v => String(v).split("-"), splitSub = v => String(v).replace(/^[vr]/, "").replace(/([a-z]+)/gi, ".$1.").replace(/\.+/g, ".").split("."), offset = part => isNaN(part) ? part : 5 + Number(part), parseSub = part => {
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
    var browser = __webpack_require__(412);
    const {version} = browser.runtime.getManifest();
    async function fetchHotfix(path) {
      const request = await fetch(`https://api.github.com/repos/refined-github/yolo/contents/${path}`), {content} = await request.json();
      return content ? atob(content).trim() : "";
    }
    webext_storage_cache.function((async version => {
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
    }), webext_storage_cache.function((async version => fetchHotfix(`style/${version}.css`)), {
      maxAge: {
        hours: 6
      },
      staleWhileRevalidate: {
        days: 300
      },
      cacheKey: () => "style-hotfixes"
    });
    async function getLocalHotfixes() {
      return "0.0.0" === version ? [] : await webext_storage_cache.get("hotfixes") ?? [];
    }
    webext_storage_cache.function((async () => {
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
    function createRghIssueLink(issueNumber) {
      const issueUrl = function(issueNumber) {
        return `https://github.com/refined-github/refined-github/issues/${issueNumber}`;
      }(issueNumber);
      return dom_chef.createElement("a", {
        target: "_blank",
        rel: "noopener noreferrer",
        "data-hovercard-type": "issue",
        "data-hovercard-url": issueUrl + "/hovercard",
        href: issueUrl
      }, "#", issueNumber);
    }
    const readme_importedFeatures = [ "action-used-by-link", "align-issue-labels", "avoid-accidental-submissions", "batch-mark-files-as-viewed", "bugs-tab", "bypass-checks", "ci-link", "clean-conversation-filters", "clean-conversation-headers", "clean-conversation-sidebar", "clean-header-search-field", "clean-pinned-issues", "clean-repo-filelist-actions", "clean-repo-sidebar", "clean-repo-tabs", "clean-rich-text-editor", "clear-pr-merge-commit-message", "close-out-of-view-modals", "closing-remarks", "collapsible-content-button", "command-palette-navigation-shortcuts", "comment-fields-keyboard-shortcuts", "comment-on-draft-pr-indicator", "comments-time-machine-links", "conflict-marker", "conversation-activity-filter", "conversation-links-on-repo-lists", "convert-pr-to-draft-improvements", "convert-release-to-draft", "copy-file", "copy-on-y", "create-release-shortcut", "cross-deleted-pr-branches", "deep-reblame", "default-branch-button", "dim-bots", "download-folder-button", "easy-toggle-commit-messages", "easy-toggle-files", "edit-readme", "embed-gist-inline", "embed-gist-via-iframe", "enable-file-links-in-compare-view", "esc-to-cancel", "esc-to-deselect-line", "expand-all-hidden-comments", "extend-conversation-status-filters", "extend-diff-expander", "file-finder-buffer", "fit-textareas", "fork-source-link-same-view", "git-checkout-pr", "global-conversation-list-filters", "global-search-filters", "hidden-review-comments-indicator", "hide-diff-signs", "hide-disabled-milestone-sorter", "hide-inactive-deployments", "hide-issue-list-autocomplete", "hide-low-quality-comments", "hide-navigation-hover-highlight", "hide-newsfeed-noise", "hide-own-stars", "highest-rated-comment", "highlight-collaborators-and-own-conversations", "highlight-deleted-and-added-files-in-diffs", "highlight-non-default-base-branch", "html-preview-link", "improve-shortcut-help", "infinite-scroll", "jump-to-change-requested-comment", "jump-to-conversation-close-event", "keyboard-navigation", "last-notification-page-button", "latest-tag-button", "link-to-changelog-file", "link-to-compare-diff", "link-to-github-io", "link-to-prior-blame-line", "linkify-branch-references", "linkify-code", "linkify-commit-sha", "linkify-labels-on-dashboard", "linkify-notification-repository-header", "linkify-symbolic-links", "linkify-user-edit-history-popup", "linkify-user-labels", "linkify-user-location", "list-prs-for-branch", "list-prs-for-file", "mark-merge-commits-in-list", "mark-private-orgs", "minimize-upload-bar", "more-conversation-filters", "more-dropdown-links", "more-file-links", "new-repo-disable-projects-and-wikis", "no-duplicate-list-update-time", "no-unnecessary-split-diff-view", "one-click-diff-options", "one-click-pr-or-gist", "one-click-review-submission", "one-key-formatting", "open-all-conversations", "open-all-notifications", "open-ci-details-in-new-tab", "open-issue-to-latest-comment", "pagination-hotkey", "parse-backticks", "patch-diff-links", "pinned-issues-update-time", "pr-branch-auto-delete", "pr-commit-lines-changed", "pr-filters", "pr-jump-to-first-non-viewed-file", "prevent-duplicate-pr-submission", "prevent-link-loss", "prevent-pr-merge-panel-opening", "preview-hidden-comments", "previous-next-commit-buttons", "profile-gists-link", "profile-hotkey", "pull-request-hotkeys", "quick-comment-edit", "quick-comment-hiding", "quick-file-edit", "quick-label-removal", "quick-mention", "quick-repo-deletion", "quick-review", "quick-review-comment-deletion", "reactions-avatars", "release-download-count", "releases-tab", "reload-failed-proxied-images", "repo-age", "repo-avatars", "repo-wide-file-finder", "resolve-conflicts", "restore-file", "rgh-feature-descriptions", "rgh-improve-new-issue-form", "rgh-linkify-features", "rgh-sponsor-button", "rgh-welcome-issue", "same-branch-author-commits", "same-page-definition-jump", "scheduled-and-manual-workflow-indicators", "select-all-notifications-shortcut", "select-notifications", "selection-in-new-tab", "set-default-repositories-type-to-sources", "shorten-links", "show-associated-branch-prs-on-fork", "show-names", "show-open-prs-of-forks", "show-user-top-repositories", "show-whitespace", "sort-conversations-by-update-time", "sticky-sidebar", "stop-pjax-loading-with-esc", "stop-redirecting-in-notification-bar", "submission-via-ctrl-enter-everywhere", "suggest-commit-title-limit", "swap-branches-on-compare", "sync-pr-commit-title", "tab-to-indent", "table-input", "tag-changes-link", "tags-dropdown", "tags-on-commits-list", "toggle-everything-with-alt", "toggle-files-button", "unfinished-comments", "unwrap-unnecessary-dropdowns", "update-pr-from-base-branch", "use-first-commit-message-for-new-prs", "useful-forks", "useful-not-found-page", "user-local-time", "user-profile-follower-badge", "vertical-front-matter", "view-last-pr-deployment", "wait-for-attachments", "wait-for-checks", "warn-pr-from-master", "warning-for-disallow-edits" ], featuresMeta = [ {
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
    } ], copyProperty = (to, from, property, ignoreNonConfigurable) => {
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
    }, Object.fromEntries(readme_importedFeatures.map((id => [ `feature:${id}`, !0 ])))), renamedFeatures = new Map([ [ "separate-draft-pr-button", "one-click-pr-or-gist" ], [ "prevent-pr-commit-link-loss", "prevent-link-loss" ], [ "remove-projects-tab", "remove-unused-repo-tabs" ], [ "remove-unused-repo-tabs", "clean-repo-tabs" ], [ "more-dropdown", "clean-repo-tabs" ], [ "remove-diff-signs", "hide-diff-signs" ], [ "remove-label-faster", "quick-label-hiding" ], [ "edit-files-faster", "quick-file-edit" ], [ "edit-comments-faster", "quick-comment-edit" ], [ "delete-review-comments-faster", "quick-review-comment-deletion" ], [ "hide-comments-faster", "quick-comment-hiding" ], [ "faster-reviews", "quick-review" ], [ "faster-pr-diff-options", "quick-pr-diff-options" ], [ "hide-useless-comments", "hide-low-quality-comments" ], [ "hide-useless-newsfeed-events", "hide-newsfeed-noise" ], [ "hide-noisy-newsfeed-events", "hide-newsfeed-noise" ], [ "no-useless-split-diff-view", "no-unnecessary-split-diff-view" ], [ "unwrap-useless-dropdowns", "unwrap-unnecessary-dropdowns" ], [ "tag-changelog-link", "tag-changes-link" ], [ "navigate-pages-with-arrow-keys", "pagination-hotkey" ], [ "list-pr-for-branch", "list-prs-for-branch" ], [ "quick-label-hiding", "quick-label-removal" ], [ "next-scheduled-github-action", "scheduled-and-manual-workflow-indicators" ], [ "raw-file-link", "more-file-links" ], [ "conversation-filters", "more-conversation-filters" ], [ "quick-pr-diff-options", "one-click-diff-options" ], [ "quick-review-buttons", "one-click-review-submission" ], [ "wait-for-build", "wait-for-checks" ], [ "pull-request-hotkey", "pull-request-hotkeys" ], [ "first-published-tag-for-merged-pr", "closing-remarks" ] ]);
    const perDomainOptions = new OptionsSyncPerDomain({
      defaults,
      migrations: [ function(options) {
        for (const [from, to] of renamedFeatures) "boolean" == typeof options[`feature:${from}`] && (options[`feature:${to}`] = options[`feature:${from}`]);
      }, OptionsSyncPerDomain.migrations.removeUnused ]
    });
    perDomainOptions.getOptionsForOrigin();
    var options_browser = __webpack_require__(412);
    function reportStatus({error, text, scopes}) {
      const tokenStatus = select_dom("#validation");
      tokenStatus.textContent = text ?? "", error ? tokenStatus.dataset.validation = "invalid" : delete tokenStatus.dataset.validation;
      for (const scope of select_dom.all("[data-scope]")) scope.dataset.validation = scopes ? scopes.includes(scope.dataset.scope) ? "valid" : "invalid" : "";
    }
    async function getTokenScopes(personalToken) {
      const tokenLink = select_dom("a#personal-token-link"), url = "github.com" === tokenLink.host ? "https://api.github.com/" : `${tokenLink.origin}/api/v3/`, response = await fetch(url, {
        cache: "no-store",
        headers: {
          "User-Agent": "Refined GitHub",
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${personalToken}`
        }
      });
      if (!response.ok) {
        const details = await response.json();
        throw new Error(details.message);
      }
      const scopes = response.headers.get("X-OAuth-Scopes").split(", ");
      return scopes.push("valid_token"), scopes.includes("repo") && scopes.push("public_repo"), 
      scopes;
    }
    async function validateToken() {
      reportStatus({});
      const tokenField = select_dom('input[name="personalToken"]');
      if (tokenField.validity.valid && 0 !== tokenField.value.length) {
        reportStatus({
          text: "Validating…"
        });
        try {
          reportStatus({
            scopes: await getTokenScopes(tokenField.value)
          });
        } catch (error) {
          throw function(value) {
            if (!(value instanceof Error || "[object Error]" === assert_error_toString.call(value))) throw new TypeError(`Expected an \`Error\`, got \`${JSON.stringify(value)}\` (${typeof value})`);
          }(error), reportStatus({
            error: !0,
            text: error.message
          }), error;
        }
      }
    }
    async function findFeatureHandler(event) {
      const options = await perDomainOptions.getOptionsForOrigin().getAll(), enabledFeatures = readme_importedFeatures.filter((featureId => options["feature:" + featureId]));
      await webext_storage_cache.set("bisect", enabledFeatures, {
        minutes: 5
      });
      const button = event.target;
      button.disabled = !0, setTimeout((() => {
        button.disabled = !1;
      }), 1e4), select_dom("#find-feature-message").hidden = !1;
    }
    function summaryHandler(event) {
      if (!(event.ctrlKey || event.metaKey || event.shiftKey)) if (event.preventDefault(), 
      event.altKey) for (const screenshotLink of select_dom.all(".screenshot-link")) toggleScreenshot(screenshotLink.parentElement); else {
        toggleScreenshot(event.delegateTarget.parentElement);
      }
    }
    function toggleScreenshot(feature) {
      const toggle = feature.querySelector("input.screenshot-toggle");
      toggle.checked = !toggle.checked;
      const screenshot = feature.querySelector("img.screenshot");
      screenshot.src = screenshot.dataset.src;
    }
    function featuresFilterHandler(event) {
      const keywords = event.currentTarget.value.toLowerCase().replace(/\W/g, " ").split(/\s+/).filter(Boolean);
      for (const feature of select_dom.all(".feature")) feature.hidden = !keywords.every((word => feature.dataset.text.includes(word)));
    }
    function updateRateLink() {
      isChrome() || (select_dom("a#rate-link").href = globalThis.navigator?.userAgent.includes("Firefox") ? "https://addons.mozilla.org/en-US/firefox/addon/refined-github-" : "https://apps.apple.com/app/id1519867270?action=write-review");
    }
    async function generateDom() {
      select_dom(".js-features").append(...featuresMeta.filter((feature => readme_importedFeatures.includes(feature.id))).map((feature => function({id, description, screenshot}) {
        const descriptionElement = node_modules_doma.one(description);
        return descriptionElement.className = "description", dom_chef.createElement("div", {
          className: "feature",
          "data-text": `${id} ${description}`.toLowerCase()
        }, dom_chef.createElement("input", {
          type: "checkbox",
          name: `feature:${id}`,
          id,
          className: "feature-checkbox"
        }), dom_chef.createElement("div", {
          className: "info"
        }, dom_chef.createElement("label", {
          className: "feature-name",
          htmlFor: id
        }, id), " ", dom_chef.createElement("a", {
          href: featureLink(id),
          className: "feature-link"
        }, "source"), dom_chef.createElement("input", {
          hidden: !0,
          type: "checkbox",
          className: "screenshot-toggle"
        }), screenshot && dom_chef.createElement("a", {
          href: screenshot,
          className: "screenshot-link"
        }, "screenshot"), descriptionElement, screenshot && dom_chef.createElement("img", {
          hidden: !0,
          "data-src": screenshot,
          className: "screenshot"
        })));
      }(feature)))), select_dom(".js-features").before(await async function() {
        const disabledFeatures = dom_chef.createElement("div", {
          className: "js-hotfixes"
        });
        for (const [feature, relatedIssue] of await getLocalHotfixes()) if (readme_importedFeatures.includes(feature)) {
          disabledFeatures.append(dom_chef.createElement("p", null, dom_chef.createElement("code", null, feature), " has been temporarily disabled due to ", createRghIssueLink(relatedIssue), "."));
          const input = select_dom("#" + feature);
          input.disabled = !0, input.removeAttribute("name"), select_dom(`.feature-name[for="${feature}"]`).after(dom_chef.createElement("span", {
            className: "hotfix-notice"
          }, " (Disabled due to ", createRghIssueLink(relatedIssue), ")"));
        }
        return disabledFeatures;
      }()), await perDomainOptions.syncForm("form"), await async function() {
        const {featuresAlreadySeen} = await options_browser.storage.local.get({
          featuresAlreadySeen: {}
        });
        for (const [from, to] of renamedFeatures) featuresAlreadySeen[to] = featuresAlreadySeen[from];
        const isFirstVisit = 0 === Object.keys(featuresAlreadySeen).length, tenDaysAgo = Date.now() - 864e6;
        for (const feature of select_dom.all(".feature-checkbox")) feature.id in featuresAlreadySeen || (featuresAlreadySeen[feature.id] = isFirstVisit ? tenDaysAgo : Date.now()), 
        featuresAlreadySeen[feature.id] > tenDaysAgo && feature.parentElement.classList.add("feature-new");
        options_browser.storage.local.set({
          featuresAlreadySeen
        });
      }(), function() {
        const container = select_dom(".js-features");
        for (const unchecked of select_dom.all(".feature-checkbox:not(:checked)", container).reverse()) container.prepend(unchecked.closest(".feature"));
        for (const newFeature of select_dom.all(".feature-new", container).reverse()) container.prepend(newFeature);
      }(), validateToken(), select_dom(".features-header").append(` (${featuresMeta.length + 25})`), 
      updateRateLink();
    }
    function addEventListeners() {
      select_dom(".OptionsSyncPerDomain-picker select")?.addEventListener("change", (({currentTarget: dropdown}) => {
        const host = dropdown.value;
        select_dom("a#personal-token-link").host = "default" === host ? "github.com" : host, 
        setTimeout(validateToken, 100);
      })), options_browser.permissions.onRemoved.addListener((() => {
        location.reload();
      })), options_browser.permissions.onAdded.addListener((() => {
        location.reload();
      })), fit_textarea.watch("textarea"), function(elements) {
        "string" == typeof elements ? elements = document.querySelectorAll(elements) : elements instanceof HTMLTextAreaElement && (elements = [ elements ]);
        for (const element of elements) element.addEventListener("keydown", eventHandler);
      }("textarea"), delegate_it(document, ".screenshot-link", "click", summaryHandler), 
      select_dom("#filter-features").addEventListener("input", featuresFilterHandler), 
      select_dom("#clear-cache").addEventListener("click", clearCacheHandler), select_dom("#find-feature").addEventListener("click", findFeatureHandler), 
      select_dom('[name="personalToken"]').addEventListener("input", validateToken), delegate_it(document, 'a[href^="http"]', "click", (event => {
        event.defaultPrevented || (event.preventDefault(), window.open(event.delegateTarget.href));
      })), select_dom("#show-debugging button").addEventListener("click", (function() {
        this.parentElement.remove();
      }));
    }
    !async function() {
      await generateDom(), addEventListeners(), !isChrome() && globalThis.navigator?.userAgent.includes("Safari") && webext_storage_cache.clear();
    }();
  })();
})();