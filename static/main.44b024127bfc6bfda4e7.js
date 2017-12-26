/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "44b024127bfc6bfda4e7"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _reactRouter = __webpack_require__(1);
	
	var _Bike = __webpack_require__(58);
	
	var _Bike2 = _interopRequireDefault(_Bike);
	
	var _one = __webpack_require__(61);
	
	var _one2 = _interopRequireDefault(_one);
	
	var _bosom = __webpack_require__(62);
	
	var _bosom2 = _interopRequireDefault(_bosom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(63);
	
	var MyRouter = function MyRouter() {
	  return React.createElement(
	    _reactRouter.Router,
	    { history: _reactRouter.hashHistory },
	    React.createElement(_reactRouter.Route, { path: '/', component: _Bike2.default }),
	    React.createElement(_reactRouter.Route, { path: '/bike', component: _Bike2.default }),
	    React.createElement(_reactRouter.Route, { path: '/one', component: _one2.default }),
	    React.createElement(_reactRouter.Route, { path: '/bosom', component: _bosom2.default }),
	    React.createElement(_reactRouter.Route, { path: '*', component: _Bike2.default })
	  );
	};
	
	React.render(React.createElement(MyRouter, null), document.querySelector('#react'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.createMemoryHistory = exports.hashHistory = exports.browserHistory = exports.applyRouterMiddleware = exports.formatPattern = exports.useRouterHistory = exports.match = exports.routerShape = exports.locationShape = exports.RouterContext = exports.createRoutes = exports.Route = exports.Redirect = exports.IndexRoute = exports.IndexRedirect = exports.withRouter = exports.IndexLink = exports.Link = exports.Router = undefined;
	
	var _RouteUtils = __webpack_require__(2);
	
	Object.defineProperty(exports, 'createRoutes', {
	  enumerable: true,
	  get: function get() {
	    return _RouteUtils.createRoutes;
	  }
	});
	
	var _PropTypes = __webpack_require__(4);
	
	Object.defineProperty(exports, 'locationShape', {
	  enumerable: true,
	  get: function get() {
	    return _PropTypes.locationShape;
	  }
	});
	Object.defineProperty(exports, 'routerShape', {
	  enumerable: true,
	  get: function get() {
	    return _PropTypes.routerShape;
	  }
	});
	
	var _PatternUtils = __webpack_require__(5);
	
	Object.defineProperty(exports, 'formatPattern', {
	  enumerable: true,
	  get: function get() {
	    return _PatternUtils.formatPattern;
	  }
	});
	
	var _Router2 = __webpack_require__(7);
	
	var _Router3 = _interopRequireDefault(_Router2);
	
	var _Link2 = __webpack_require__(23);
	
	var _Link3 = _interopRequireDefault(_Link2);
	
	var _IndexLink2 = __webpack_require__(24);
	
	var _IndexLink3 = _interopRequireDefault(_IndexLink2);
	
	var _withRouter2 = __webpack_require__(25);
	
	var _withRouter3 = _interopRequireDefault(_withRouter2);
	
	var _IndexRedirect2 = __webpack_require__(27);
	
	var _IndexRedirect3 = _interopRequireDefault(_IndexRedirect2);
	
	var _IndexRoute2 = __webpack_require__(29);
	
	var _IndexRoute3 = _interopRequireDefault(_IndexRoute2);
	
	var _Redirect2 = __webpack_require__(28);
	
	var _Redirect3 = _interopRequireDefault(_Redirect2);
	
	var _Route2 = __webpack_require__(30);
	
	var _Route3 = _interopRequireDefault(_Route2);
	
	var _RouterContext2 = __webpack_require__(19);
	
	var _RouterContext3 = _interopRequireDefault(_RouterContext2);
	
	var _match2 = __webpack_require__(31);
	
	var _match3 = _interopRequireDefault(_match2);
	
	var _useRouterHistory2 = __webpack_require__(45);
	
	var _useRouterHistory3 = _interopRequireDefault(_useRouterHistory2);
	
	var _applyRouterMiddleware2 = __webpack_require__(46);
	
	var _applyRouterMiddleware3 = _interopRequireDefault(_applyRouterMiddleware2);
	
	var _browserHistory2 = __webpack_require__(47);
	
	var _browserHistory3 = _interopRequireDefault(_browserHistory2);
	
	var _hashHistory2 = __webpack_require__(55);
	
	var _hashHistory3 = _interopRequireDefault(_hashHistory2);
	
	var _createMemoryHistory2 = __webpack_require__(33);
	
	var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.Router = _Router3.default; /* components */
	
	exports.Link = _Link3.default;
	exports.IndexLink = _IndexLink3.default;
	exports.withRouter = _withRouter3.default;
	
	/* components (configuration) */
	
	exports.IndexRedirect = _IndexRedirect3.default;
	exports.IndexRoute = _IndexRoute3.default;
	exports.Redirect = _Redirect3.default;
	exports.Route = _Route3.default;
	
	/* utils */
	
	exports.RouterContext = _RouterContext3.default;
	exports.match = _match3.default;
	exports.useRouterHistory = _useRouterHistory3.default;
	exports.applyRouterMiddleware = _applyRouterMiddleware3.default;
	
	/* histories */
	
	exports.browserHistory = _browserHistory3.default;
	exports.hashHistory = _hashHistory3.default;
	exports.createMemoryHistory = _createMemoryHistory3.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.isReactChildren = isReactChildren;
	exports.createRouteFromReactElement = createRouteFromReactElement;
	exports.createRoutesFromReactChildren = createRoutesFromReactChildren;
	exports.createRoutes = createRoutes;
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function isValidChild(object) {
	  return object == null || _react2.default.isValidElement(object);
	}
	
	function isReactChildren(object) {
	  return isValidChild(object) || Array.isArray(object) && object.every(isValidChild);
	}
	
	function createRoute(defaultProps, props) {
	  return _extends({}, defaultProps, props);
	}
	
	function createRouteFromReactElement(element) {
	  var type = element.type;
	  var route = createRoute(type.defaultProps, element.props);
	
	  if (route.children) {
	    var childRoutes = createRoutesFromReactChildren(route.children, route);
	
	    if (childRoutes.length) route.childRoutes = childRoutes;
	
	    delete route.children;
	  }
	
	  return route;
	}
	
	/**
	 * Creates and returns a routes object from the given ReactChildren. JSX
	 * provides a convenient way to visualize how routes in the hierarchy are
	 * nested.
	 *
	 *   import { Route, createRoutesFromReactChildren } from 'react-router'
	 *
	 *   const routes = createRoutesFromReactChildren(
	 *     <Route component={App}>
	 *       <Route path="home" component={Dashboard}/>
	 *       <Route path="news" component={NewsFeed}/>
	 *     </Route>
	 *   )
	 *
	 * Note: This method is automatically used when you provide <Route> children
	 * to a <Router> component.
	 */
	function createRoutesFromReactChildren(children, parentRoute) {
	  var routes = [];
	
	  _react2.default.Children.forEach(children, function (element) {
	    if (_react2.default.isValidElement(element)) {
	      // Component classes may have a static create* method.
	      if (element.type.createRouteFromReactElement) {
	        var route = element.type.createRouteFromReactElement(element, parentRoute);
	
	        if (route) routes.push(route);
	      } else {
	        routes.push(createRouteFromReactElement(element));
	      }
	    }
	  });
	
	  return routes;
	}
	
	/**
	 * Creates and returns an array of routes from the given object which
	 * may be a JSX route, a plain object route, or an array of either.
	 */
	function createRoutes(routes) {
	  if (isReactChildren(routes)) {
	    routes = createRoutesFromReactChildren(routes);
	  } else if (routes && !Array.isArray(routes)) {
	    routes = [routes];
	  }
	
	  return routes;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.locationShape = exports.routerShape = undefined;
	
	var _react = __webpack_require__(3);
	
	var func = _react.PropTypes.func,
	    object = _react.PropTypes.object,
	    shape = _react.PropTypes.shape,
	    string = _react.PropTypes.string;
	var routerShape = exports.routerShape = shape({
	  push: func.isRequired,
	  replace: func.isRequired,
	  go: func.isRequired,
	  goBack: func.isRequired,
	  goForward: func.isRequired,
	  setRouteLeaveHook: func.isRequired,
	  isActive: func.isRequired
	});
	
	var locationShape = exports.locationShape = shape({
	  pathname: string.isRequired,
	  search: string.isRequired,
	  state: object,
	  action: string.isRequired,
	  key: string
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.compilePattern = compilePattern;
	exports.matchPattern = matchPattern;
	exports.getParamNames = getParamNames;
	exports.getParams = getParams;
	exports.formatPattern = formatPattern;
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function escapeRegExp(string) {
	  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	
	function _compilePattern(pattern) {
	  var regexpSource = '';
	  var paramNames = [];
	  var tokens = [];
	
	  var match = void 0,
	      lastIndex = 0,
	      matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
	  while (match = matcher.exec(pattern)) {
	    if (match.index !== lastIndex) {
	      tokens.push(pattern.slice(lastIndex, match.index));
	      regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
	    }
	
	    if (match[1]) {
	      regexpSource += '([^/]+)';
	      paramNames.push(match[1]);
	    } else if (match[0] === '**') {
	      regexpSource += '(.*)';
	      paramNames.push('splat');
	    } else if (match[0] === '*') {
	      regexpSource += '(.*?)';
	      paramNames.push('splat');
	    } else if (match[0] === '(') {
	      regexpSource += '(?:';
	    } else if (match[0] === ')') {
	      regexpSource += ')?';
	    }
	
	    tokens.push(match[0]);
	
	    lastIndex = matcher.lastIndex;
	  }
	
	  if (lastIndex !== pattern.length) {
	    tokens.push(pattern.slice(lastIndex, pattern.length));
	    regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
	  }
	
	  return {
	    pattern: pattern,
	    regexpSource: regexpSource,
	    paramNames: paramNames,
	    tokens: tokens
	  };
	}
	
	var CompiledPatternsCache = Object.create(null);
	
	function compilePattern(pattern) {
	  if (!CompiledPatternsCache[pattern]) CompiledPatternsCache[pattern] = _compilePattern(pattern);
	
	  return CompiledPatternsCache[pattern];
	}
	
	/**
	 * Attempts to match a pattern on the given pathname. Patterns may use
	 * the following special characters:
	 *
	 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
	 *                  captured string is considered a "param"
	 * - ()             Wraps a segment of the URL that is optional
	 * - *              Consumes (non-greedy) all characters up to the next
	 *                  character in the pattern, or to the end of the URL if
	 *                  there is none
	 * - **             Consumes (greedy) all characters up to the next character
	 *                  in the pattern, or to the end of the URL if there is none
	 *
	 *  The function calls callback(error, matched) when finished.
	 * The return value is an object with the following properties:
	 *
	 * - remainingPathname
	 * - paramNames
	 * - paramValues
	 */
	function matchPattern(pattern, pathname) {
	  // Ensure pattern starts with leading slash for consistency with pathname.
	  if (pattern.charAt(0) !== '/') {
	    pattern = '/' + pattern;
	  }
	
	  var _compilePattern2 = compilePattern(pattern),
	      regexpSource = _compilePattern2.regexpSource,
	      paramNames = _compilePattern2.paramNames,
	      tokens = _compilePattern2.tokens;
	
	  if (pattern.charAt(pattern.length - 1) !== '/') {
	    regexpSource += '/?'; // Allow optional path separator at end.
	  }
	
	  // Special-case patterns like '*' for catch-all routes.
	  if (tokens[tokens.length - 1] === '*') {
	    regexpSource += '$';
	  }
	
	  var match = pathname.match(new RegExp('^' + regexpSource, 'i'));
	  if (match == null) {
	    return null;
	  }
	
	  var matchedPath = match[0];
	  var remainingPathname = pathname.substr(matchedPath.length);
	
	  if (remainingPathname) {
	    // Require that the match ends at a path separator, if we didn't match
	    // the full path, so any remaining pathname is a new path segment.
	    if (matchedPath.charAt(matchedPath.length - 1) !== '/') {
	      return null;
	    }
	
	    // If there is a remaining pathname, treat the path separator as part of
	    // the remaining pathname for properly continuing the match.
	    remainingPathname = '/' + remainingPathname;
	  }
	
	  return {
	    remainingPathname: remainingPathname,
	    paramNames: paramNames,
	    paramValues: match.slice(1).map(function (v) {
	      return v && decodeURIComponent(v);
	    })
	  };
	}
	
	function getParamNames(pattern) {
	  return compilePattern(pattern).paramNames;
	}
	
	function getParams(pattern, pathname) {
	  var match = matchPattern(pattern, pathname);
	  if (!match) {
	    return null;
	  }
	
	  var paramNames = match.paramNames,
	      paramValues = match.paramValues;
	
	  var params = {};
	
	  paramNames.forEach(function (paramName, index) {
	    params[paramName] = paramValues[index];
	  });
	
	  return params;
	}
	
	/**
	 * Returns a version of the given pattern with params interpolated. Throws
	 * if there is a dynamic segment of the pattern for which there is no param.
	 */
	function formatPattern(pattern, params) {
	  params = params || {};
	
	  var _compilePattern3 = compilePattern(pattern),
	      tokens = _compilePattern3.tokens;
	
	  var parenCount = 0,
	      pathname = '',
	      splatIndex = 0,
	      parenHistory = [];
	
	  var token = void 0,
	      paramName = void 0,
	      paramValue = void 0;
	  for (var i = 0, len = tokens.length; i < len; ++i) {
	    token = tokens[i];
	
	    if (token === '*' || token === '**') {
	      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;
	
	      !(paramValue != null || parenCount > 0) ?  false ? (0, _invariant2.default)(false, 'Missing splat #%s for path "%s"', splatIndex, pattern) : (0, _invariant2.default)(false) : void 0;
	
	      if (paramValue != null) pathname += encodeURI(paramValue);
	    } else if (token === '(') {
	      parenHistory[parenCount] = '';
	      parenCount += 1;
	    } else if (token === ')') {
	      var parenText = parenHistory.pop();
	      parenCount -= 1;
	
	      if (parenCount) parenHistory[parenCount - 1] += parenText;else pathname += parenText;
	    } else if (token.charAt(0) === ':') {
	      paramName = token.substring(1);
	      paramValue = params[paramName];
	
	      !(paramValue != null || parenCount > 0) ?  false ? (0, _invariant2.default)(false, 'Missing "%s" parameter for path "%s"', paramName, pattern) : (0, _invariant2.default)(false) : void 0;
	
	      if (paramValue == null) {
	        if (parenCount) {
	          parenHistory[parenCount - 1] = '';
	
	          var curTokenIdx = tokens.indexOf(token);
	          var tokensSubset = tokens.slice(curTokenIdx, tokens.length);
	          var nextParenIdx = -1;
	
	          for (var _i = 0; _i < tokensSubset.length; _i++) {
	            if (tokensSubset[_i] == ')') {
	              nextParenIdx = _i;
	              break;
	            }
	          }
	
	          !(nextParenIdx > 0) ?  false ? (0, _invariant2.default)(false, 'Path "%s" is missing end paren at segment "%s"', pattern, tokensSubset.join('')) : (0, _invariant2.default)(false) : void 0;
	
	          // jump to ending paren
	          i = curTokenIdx + nextParenIdx - 1;
	        }
	      } else if (parenCount) parenHistory[parenCount - 1] += encodeURIComponent(paramValue);else pathname += encodeURIComponent(paramValue);
	    } else {
	      if (parenCount) parenHistory[parenCount - 1] += token;else pathname += token;
	    }
	  }
	
	  !(parenCount <= 0) ?  false ? (0, _invariant2.default)(false, 'Path "%s" is missing end paren', pattern) : (0, _invariant2.default)(false) : void 0;
	
	  return pathname.replace(/\/+/g, '/');
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	'use strict';
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _createTransitionManager2 = __webpack_require__(8);
	
	var _createTransitionManager3 = _interopRequireDefault(_createTransitionManager2);
	
	var _InternalPropTypes = __webpack_require__(18);
	
	var _RouterContext = __webpack_require__(19);
	
	var _RouterContext2 = _interopRequireDefault(_RouterContext);
	
	var _RouteUtils = __webpack_require__(2);
	
	var _RouterUtils = __webpack_require__(22);
	
	var _routerWarning = __webpack_require__(9);
	
	var _routerWarning2 = _interopRequireDefault(_routerWarning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _React$PropTypes = _react2.default.PropTypes,
	    func = _React$PropTypes.func,
	    object = _React$PropTypes.object;
	
	/**
	 * A <Router> is a high-level API for automatically setting up
	 * a router that renders a <RouterContext> with all the props
	 * it needs each time the URL changes.
	 */
	
	var Router = _react2.default.createClass({
	  displayName: 'Router',
	
	
	  propTypes: {
	    history: object,
	    children: _InternalPropTypes.routes,
	    routes: _InternalPropTypes.routes, // alias for children
	    render: func,
	    createElement: func,
	    onError: func,
	    onUpdate: func,
	
	    // PRIVATE: For client-side rehydration of server match.
	    matchContext: object
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      render: function render(props) {
	        return _react2.default.createElement(_RouterContext2.default, props);
	      }
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      location: null,
	      routes: null,
	      params: null,
	      components: null
	    };
	  },
	  handleError: function handleError(error) {
	    if (this.props.onError) {
	      this.props.onError.call(this, error);
	    } else {
	      // Throw errors by default so we don't silently swallow them!
	      throw error; // This error probably occurred in getChildRoutes or getComponents.
	    }
	  },
	  createRouterObject: function createRouterObject(state) {
	    var matchContext = this.props.matchContext;
	
	    if (matchContext) {
	      return matchContext.router;
	    }
	
	    var history = this.props.history;
	
	    return (0, _RouterUtils.createRouterObject)(history, this.transitionManager, state);
	  },
	  createTransitionManager: function createTransitionManager() {
	    var matchContext = this.props.matchContext;
	
	    if (matchContext) {
	      return matchContext.transitionManager;
	    }
	
	    var history = this.props.history;
	    var _props = this.props,
	        routes = _props.routes,
	        children = _props.children;
	
	
	    !history.getCurrentLocation ?  false ? (0, _invariant2.default)(false, 'You have provided a history object created with history v2.x or ' + 'earlier. This version of React Router is only compatible with v3 ' + 'history objects. Please upgrade to history v3.x.') : (0, _invariant2.default)(false) : void 0;
	
	    return (0, _createTransitionManager3.default)(history, (0, _RouteUtils.createRoutes)(routes || children));
	  },
	  componentWillMount: function componentWillMount() {
	    var _this = this;
	
	    this.transitionManager = this.createTransitionManager();
	    this.router = this.createRouterObject(this.state);
	
	    this._unlisten = this.transitionManager.listen(function (error, state) {
	      if (error) {
	        _this.handleError(error);
	      } else {
	        // Keep the identity of this.router because of a caveat in ContextUtils:
	        // they only work if the object identity is preserved.
	        (0, _RouterUtils.assignRouterState)(_this.router, state);
	        _this.setState(state, _this.props.onUpdate);
	      }
	    });
	  },
	
	
	  /* istanbul ignore next: sanity check */
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	     false ? (0, _routerWarning2.default)(nextProps.history === this.props.history, 'You cannot change <Router history>; it will be ignored') : void 0;
	
	     false ? (0, _routerWarning2.default)((nextProps.routes || nextProps.children) === (this.props.routes || this.props.children), 'You cannot change <Router routes>; it will be ignored') : void 0;
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    if (this._unlisten) this._unlisten();
	  },
	  render: function render() {
	    var _state = this.state,
	        location = _state.location,
	        routes = _state.routes,
	        params = _state.params,
	        components = _state.components;
	
	    var _props2 = this.props,
	        createElement = _props2.createElement,
	        render = _props2.render,
	        props = _objectWithoutProperties(_props2, ['createElement', 'render']);
	
	    if (location == null) return null; // Async match
	
	    // Only forward non-Router-specific props to routing context, as those are
	    // the only ones that might be custom routing context props.
	    Object.keys(Router.propTypes).forEach(function (propType) {
	      return delete props[propType];
	    });
	
	    return render(_extends({}, props, {
	      router: this.router,
	      location: location,
	      routes: routes,
	      params: params,
	      components: components,
	      createElement: createElement
	    }));
	  }
	});
	
	exports.default = Router;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = createTransitionManager;
	
	var _routerWarning = __webpack_require__(9);
	
	var _routerWarning2 = _interopRequireDefault(_routerWarning);
	
	var _computeChangedRoutes2 = __webpack_require__(11);
	
	var _computeChangedRoutes3 = _interopRequireDefault(_computeChangedRoutes2);
	
	var _TransitionUtils = __webpack_require__(12);
	
	var _isActive2 = __webpack_require__(14);
	
	var _isActive3 = _interopRequireDefault(_isActive2);
	
	var _getComponents = __webpack_require__(15);
	
	var _getComponents2 = _interopRequireDefault(_getComponents);
	
	var _matchRoutes = __webpack_require__(17);
	
	var _matchRoutes2 = _interopRequireDefault(_matchRoutes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function hasAnyProperties(object) {
	  for (var p in object) {
	    if (Object.prototype.hasOwnProperty.call(object, p)) return true;
	  }return false;
	}
	
	function createTransitionManager(history, routes) {
	  var state = {};
	
	  // Signature should be (location, indexOnly), but needs to support (path,
	  // query, indexOnly)
	  function isActive(location, indexOnly) {
	    location = history.createLocation(location);
	
	    return (0, _isActive3.default)(location, indexOnly, state.location, state.routes, state.params);
	  }
	
	  var partialNextState = void 0;
	
	  function match(location, callback) {
	    if (partialNextState && partialNextState.location === location) {
	      // Continue from where we left off.
	      finishMatch(partialNextState, callback);
	    } else {
	      (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
	        if (error) {
	          callback(error);
	        } else if (nextState) {
	          finishMatch(_extends({}, nextState, { location: location }), callback);
	        } else {
	          callback();
	        }
	      });
	    }
	  }
	
	  function finishMatch(nextState, callback) {
	    var _computeChangedRoutes = (0, _computeChangedRoutes3.default)(state, nextState),
	        leaveRoutes = _computeChangedRoutes.leaveRoutes,
	        changeRoutes = _computeChangedRoutes.changeRoutes,
	        enterRoutes = _computeChangedRoutes.enterRoutes;
	
	    (0, _TransitionUtils.runLeaveHooks)(leaveRoutes, state);
	
	    // Tear down confirmation hooks for left routes
	    leaveRoutes.filter(function (route) {
	      return enterRoutes.indexOf(route) === -1;
	    }).forEach(removeListenBeforeHooksForRoute);
	
	    // change and enter hooks are run in series
	    (0, _TransitionUtils.runChangeHooks)(changeRoutes, state, nextState, function (error, redirectInfo) {
	      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);
	
	      (0, _TransitionUtils.runEnterHooks)(enterRoutes, nextState, finishEnterHooks);
	    });
	
	    function finishEnterHooks(error, redirectInfo) {
	      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);
	
	      // TODO: Fetch components after state is updated.
	      (0, _getComponents2.default)(nextState, function (error, components) {
	        if (error) {
	          callback(error);
	        } else {
	          // TODO: Make match a pure function and have some other API
	          // for "match and update state".
	          callback(null, null, state = _extends({}, nextState, { components: components }));
	        }
	      });
	    }
	
	    function handleErrorOrRedirect(error, redirectInfo) {
	      if (error) callback(error);else callback(null, redirectInfo);
	    }
	  }
	
	  var RouteGuid = 1;
	
	  function getRouteID(route) {
	    var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	    return route.__id__ || create && (route.__id__ = RouteGuid++);
	  }
	
	  var RouteHooks = Object.create(null);
	
	  function getRouteHooksForRoutes(routes) {
	    return routes.map(function (route) {
	      return RouteHooks[getRouteID(route)];
	    }).filter(function (hook) {
	      return hook;
	    });
	  }
	
	  function transitionHook(location, callback) {
	    (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
	      if (nextState == null) {
	        // TODO: We didn't actually match anything, but hang
	        // onto error/nextState so we don't have to matchRoutes
	        // again in the listen callback.
	        callback();
	        return;
	      }
	
	      // Cache some state here so we don't have to
	      // matchRoutes() again in the listen callback.
	      partialNextState = _extends({}, nextState, { location: location });
	
	      var hooks = getRouteHooksForRoutes((0, _computeChangedRoutes3.default)(state, partialNextState).leaveRoutes);
	
	      var result = void 0;
	      for (var i = 0, len = hooks.length; result == null && i < len; ++i) {
	        // Passing the location arg here indicates to
	        // the user that this is a transition hook.
	        result = hooks[i](location);
	      }
	
	      callback(result);
	    });
	  }
	
	  /* istanbul ignore next: untestable with Karma */
	  function beforeUnloadHook() {
	    // Synchronously check to see if any route hooks want
	    // to prevent the current window/tab from closing.
	    if (state.routes) {
	      var hooks = getRouteHooksForRoutes(state.routes);
	
	      var message = void 0;
	      for (var i = 0, len = hooks.length; typeof message !== 'string' && i < len; ++i) {
	        // Passing no args indicates to the user that this is a
	        // beforeunload hook. We don't know the next location.
	        message = hooks[i]();
	      }
	
	      return message;
	    }
	  }
	
	  var unlistenBefore = void 0,
	      unlistenBeforeUnload = void 0;
	
	  function removeListenBeforeHooksForRoute(route) {
	    var routeID = getRouteID(route);
	    if (!routeID) {
	      return;
	    }
	
	    delete RouteHooks[routeID];
	
	    if (!hasAnyProperties(RouteHooks)) {
	      // teardown transition & beforeunload hooks
	      if (unlistenBefore) {
	        unlistenBefore();
	        unlistenBefore = null;
	      }
	
	      if (unlistenBeforeUnload) {
	        unlistenBeforeUnload();
	        unlistenBeforeUnload = null;
	      }
	    }
	  }
	
	  /**
	   * Registers the given hook function to run before leaving the given route.
	   *
	   * During a normal transition, the hook function receives the next location
	   * as its only argument and can return either a prompt message (string) to show the user,
	   * to make sure they want to leave the page; or `false`, to prevent the transition.
	   * Any other return value will have no effect.
	   *
	   * During the beforeunload event (in browsers) the hook receives no arguments.
	   * In this case it must return a prompt message to prevent the transition.
	   *
	   * Returns a function that may be used to unbind the listener.
	   */
	  function listenBeforeLeavingRoute(route, hook) {
	    var thereWereNoRouteHooks = !hasAnyProperties(RouteHooks);
	    var routeID = getRouteID(route, true);
	
	    RouteHooks[routeID] = hook;
	
	    if (thereWereNoRouteHooks) {
	      // setup transition & beforeunload hooks
	      unlistenBefore = history.listenBefore(transitionHook);
	
	      if (history.listenBeforeUnload) unlistenBeforeUnload = history.listenBeforeUnload(beforeUnloadHook);
	    }
	
	    return function () {
	      removeListenBeforeHooksForRoute(route);
	    };
	  }
	
	  /**
	   * This is the API for stateful environments. As the location
	   * changes, we update state and call the listener. We can also
	   * gracefully handle errors and redirects.
	   */
	  function listen(listener) {
	    function historyListener(location) {
	      if (state.location === location) {
	        listener(null, state);
	      } else {
	        match(location, function (error, redirectLocation, nextState) {
	          if (error) {
	            listener(error);
	          } else if (redirectLocation) {
	            history.replace(redirectLocation);
	          } else if (nextState) {
	            listener(null, nextState);
	          } else {
	             false ? (0, _routerWarning2.default)(false, 'Location "%s" did not match any routes', location.pathname + location.search + location.hash) : void 0;
	          }
	        });
	      }
	    }
	
	    // TODO: Only use a single history listener. Otherwise we'll end up with
	    // multiple concurrent calls to match.
	
	    // Set up the history listener first in case the initial match redirects.
	    var unsubscribe = history.listen(historyListener);
	
	    if (state.location) {
	      // Picking up on a matchContext.
	      listener(null, state);
	    } else {
	      historyListener(history.getCurrentLocation());
	    }
	
	    return unsubscribe;
	  }
	
	  return {
	    isActive: isActive,
	    match: match,
	    listenBeforeLeavingRoute: listenBeforeLeavingRoute,
	    listen: listen
	  };
	}
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = routerWarning;
	exports._resetWarned = _resetWarned;
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var warned = {};
	
	function routerWarning(falseToWarn, message) {
	  // Only issue deprecation warnings once.
	  if (message.indexOf('deprecated') !== -1) {
	    if (warned[message]) {
	      return;
	    }
	
	    warned[message] = true;
	  }
	
	  message = '[react-router] ' + message;
	
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }
	
	  _warning2.default.apply(undefined, [falseToWarn, message].concat(args));
	}
	
	function _resetWarned() {
	  warned = {};
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	'use strict';
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = function() {};
	
	if (false) {
	  warning = function(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);
	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }
	
	    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }
	
	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' +
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}
	
	module.exports = warning;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _PatternUtils = __webpack_require__(5);
	
	function routeParamsChanged(route, prevState, nextState) {
	  if (!route.path) return false;
	
	  var paramNames = (0, _PatternUtils.getParamNames)(route.path);
	
	  return paramNames.some(function (paramName) {
	    return prevState.params[paramName] !== nextState.params[paramName];
	  });
	}
	
	/**
	 * Returns an object of { leaveRoutes, changeRoutes, enterRoutes } determined by
	 * the change from prevState to nextState. We leave routes if either
	 * 1) they are not in the next state or 2) they are in the next state
	 * but their params have changed (i.e. /users/123 => /users/456).
	 *
	 * leaveRoutes are ordered starting at the leaf route of the tree
	 * we're leaving up to the common parent route. enterRoutes are ordered
	 * from the top of the tree we're entering down to the leaf route.
	 *
	 * changeRoutes are any routes that didn't leave or enter during
	 * the transition.
	 */
	function computeChangedRoutes(prevState, nextState) {
	  var prevRoutes = prevState && prevState.routes;
	  var nextRoutes = nextState.routes;
	
	  var leaveRoutes = void 0,
	      changeRoutes = void 0,
	      enterRoutes = void 0;
	  if (prevRoutes) {
	    (function () {
	      var parentIsLeaving = false;
	      leaveRoutes = prevRoutes.filter(function (route) {
	        if (parentIsLeaving) {
	          return true;
	        } else {
	          var isLeaving = nextRoutes.indexOf(route) === -1 || routeParamsChanged(route, prevState, nextState);
	          if (isLeaving) parentIsLeaving = true;
	          return isLeaving;
	        }
	      });
	
	      // onLeave hooks start at the leaf route.
	      leaveRoutes.reverse();
	
	      enterRoutes = [];
	      changeRoutes = [];
	
	      nextRoutes.forEach(function (route) {
	        var isNew = prevRoutes.indexOf(route) === -1;
	        var paramsChanged = leaveRoutes.indexOf(route) !== -1;
	
	        if (isNew || paramsChanged) enterRoutes.push(route);else changeRoutes.push(route);
	      });
	    })();
	  } else {
	    leaveRoutes = [];
	    changeRoutes = [];
	    enterRoutes = nextRoutes;
	  }
	
	  return {
	    leaveRoutes: leaveRoutes,
	    changeRoutes: changeRoutes,
	    enterRoutes: enterRoutes
	  };
	}
	
	exports.default = computeChangedRoutes;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.runEnterHooks = runEnterHooks;
	exports.runChangeHooks = runChangeHooks;
	exports.runLeaveHooks = runLeaveHooks;
	
	var _AsyncUtils = __webpack_require__(13);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PendingHooks = function PendingHooks() {
	  var _this = this;
	
	  _classCallCheck(this, PendingHooks);
	
	  this.hooks = [];
	
	  this.add = function (hook) {
	    return _this.hooks.push(hook);
	  };
	
	  this.remove = function (hook) {
	    return _this.hooks = _this.hooks.filter(function (h) {
	      return h !== hook;
	    });
	  };
	
	  this.has = function (hook) {
	    return _this.hooks.indexOf(hook) !== -1;
	  };
	
	  this.clear = function () {
	    return _this.hooks = [];
	  };
	};
	
	var enterHooks = new PendingHooks();
	var changeHooks = new PendingHooks();
	
	function createTransitionHook(hook, route, asyncArity, pendingHooks) {
	  var isSync = hook.length < asyncArity;
	
	  var transitionHook = function transitionHook() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    hook.apply(route, args);
	
	    if (isSync) {
	      var callback = args[args.length - 1];
	      // Assume hook executes synchronously and
	      // automatically call the callback.
	      callback();
	    }
	  };
	
	  pendingHooks.add(transitionHook);
	
	  return transitionHook;
	}
	
	function getEnterHooks(routes) {
	  return routes.reduce(function (hooks, route) {
	    if (route.onEnter) hooks.push(createTransitionHook(route.onEnter, route, 3, enterHooks));
	    return hooks;
	  }, []);
	}
	
	function getChangeHooks(routes) {
	  return routes.reduce(function (hooks, route) {
	    if (route.onChange) hooks.push(createTransitionHook(route.onChange, route, 4, changeHooks));
	    return hooks;
	  }, []);
	}
	
	function runTransitionHooks(length, iter, callback) {
	  if (!length) {
	    callback();
	    return;
	  }
	
	  var redirectInfo = void 0;
	  function replace(location) {
	    redirectInfo = location;
	  }
	
	  (0, _AsyncUtils.loopAsync)(length, function (index, next, done) {
	    iter(index, replace, function (error) {
	      if (error || redirectInfo) {
	        done(error, redirectInfo); // No need to continue.
	      } else {
	        next();
	      }
	    });
	  }, callback);
	}
	
	/**
	 * Runs all onEnter hooks in the given array of routes in order
	 * with onEnter(nextState, replace, callback) and calls
	 * callback(error, redirectInfo) when finished. The first hook
	 * to use replace short-circuits the loop.
	 *
	 * If a hook needs to run asynchronously, it may use the callback
	 * function. However, doing so will cause the transition to pause,
	 * which could lead to a non-responsive UI if the hook is slow.
	 */
	function runEnterHooks(routes, nextState, callback) {
	  enterHooks.clear();
	  var hooks = getEnterHooks(routes);
	  return runTransitionHooks(hooks.length, function (index, replace, next) {
	    var wrappedNext = function wrappedNext() {
	      if (enterHooks.has(hooks[index])) {
	        next();
	        enterHooks.remove(hooks[index]);
	      }
	    };
	    hooks[index](nextState, replace, wrappedNext);
	  }, callback);
	}
	
	/**
	 * Runs all onChange hooks in the given array of routes in order
	 * with onChange(prevState, nextState, replace, callback) and calls
	 * callback(error, redirectInfo) when finished. The first hook
	 * to use replace short-circuits the loop.
	 *
	 * If a hook needs to run asynchronously, it may use the callback
	 * function. However, doing so will cause the transition to pause,
	 * which could lead to a non-responsive UI if the hook is slow.
	 */
	function runChangeHooks(routes, state, nextState, callback) {
	  changeHooks.clear();
	  var hooks = getChangeHooks(routes);
	  return runTransitionHooks(hooks.length, function (index, replace, next) {
	    var wrappedNext = function wrappedNext() {
	      if (changeHooks.has(hooks[index])) {
	        next();
	        changeHooks.remove(hooks[index]);
	      }
	    };
	    hooks[index](state, nextState, replace, wrappedNext);
	  }, callback);
	}
	
	/**
	 * Runs all onLeave hooks in the given array of routes in order.
	 */
	function runLeaveHooks(routes, prevState) {
	  for (var i = 0, len = routes.length; i < len; ++i) {
	    if (routes[i].onLeave) routes[i].onLeave.call(routes[i], prevState);
	  }
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.loopAsync = loopAsync;
	exports.mapAsync = mapAsync;
	function loopAsync(turns, work, callback) {
	  var currentTurn = 0,
	      isDone = false;
	  var sync = false,
	      hasNext = false,
	      doneArgs = void 0;
	
	  function done() {
	    isDone = true;
	    if (sync) {
	      // Iterate instead of recursing if possible.
	      doneArgs = [].concat(Array.prototype.slice.call(arguments));
	      return;
	    }
	
	    callback.apply(this, arguments);
	  }
	
	  function next() {
	    if (isDone) {
	      return;
	    }
	
	    hasNext = true;
	    if (sync) {
	      // Iterate instead of recursing if possible.
	      return;
	    }
	
	    sync = true;
	
	    while (!isDone && currentTurn < turns && hasNext) {
	      hasNext = false;
	      work.call(this, currentTurn++, next, done);
	    }
	
	    sync = false;
	
	    if (isDone) {
	      // This means the loop finished synchronously.
	      callback.apply(this, doneArgs);
	      return;
	    }
	
	    if (currentTurn >= turns && hasNext) {
	      isDone = true;
	      callback();
	    }
	  }
	
	  next();
	}
	
	function mapAsync(array, work, callback) {
	  var length = array.length;
	  var values = [];
	
	  if (length === 0) return callback(null, values);
	
	  var isDone = false,
	      doneCount = 0;
	
	  function done(index, error, value) {
	    if (isDone) return;
	
	    if (error) {
	      isDone = true;
	      callback(error);
	    } else {
	      values[index] = value;
	
	      isDone = ++doneCount === length;
	
	      if (isDone) callback(null, values);
	    }
	  }
	
	  array.forEach(function (item, index) {
	    work(item, index, function (error, value) {
	      done(index, error, value);
	    });
	  });
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.default = isActive;
	
	var _PatternUtils = __webpack_require__(5);
	
	function deepEqual(a, b) {
	  if (a == b) return true;
	
	  if (a == null || b == null) return false;
	
	  if (Array.isArray(a)) {
	    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
	      return deepEqual(item, b[index]);
	    });
	  }
	
	  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') {
	    for (var p in a) {
	      if (!Object.prototype.hasOwnProperty.call(a, p)) {
	        continue;
	      }
	
	      if (a[p] === undefined) {
	        if (b[p] !== undefined) {
	          return false;
	        }
	      } else if (!Object.prototype.hasOwnProperty.call(b, p)) {
	        return false;
	      } else if (!deepEqual(a[p], b[p])) {
	        return false;
	      }
	    }
	
	    return true;
	  }
	
	  return String(a) === String(b);
	}
	
	/**
	 * Returns true if the current pathname matches the supplied one, net of
	 * leading and trailing slash normalization. This is sufficient for an
	 * indexOnly route match.
	 */
	function pathIsActive(pathname, currentPathname) {
	  // Normalize leading slash for consistency. Leading slash on pathname has
	  // already been normalized in isActive. See caveat there.
	  if (currentPathname.charAt(0) !== '/') {
	    currentPathname = '/' + currentPathname;
	  }
	
	  // Normalize the end of both path names too. Maybe `/foo/` shouldn't show
	  // `/foo` as active, but in this case, we would already have failed the
	  // match.
	  if (pathname.charAt(pathname.length - 1) !== '/') {
	    pathname += '/';
	  }
	  if (currentPathname.charAt(currentPathname.length - 1) !== '/') {
	    currentPathname += '/';
	  }
	
	  return currentPathname === pathname;
	}
	
	/**
	 * Returns true if the given pathname matches the active routes and params.
	 */
	function routeIsActive(pathname, routes, params) {
	  var remainingPathname = pathname,
	      paramNames = [],
	      paramValues = [];
	
	  // for...of would work here but it's probably slower post-transpilation.
	  for (var i = 0, len = routes.length; i < len; ++i) {
	    var route = routes[i];
	    var pattern = route.path || '';
	
	    if (pattern.charAt(0) === '/') {
	      remainingPathname = pathname;
	      paramNames = [];
	      paramValues = [];
	    }
	
	    if (remainingPathname !== null && pattern) {
	      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
	      if (matched) {
	        remainingPathname = matched.remainingPathname;
	        paramNames = [].concat(paramNames, matched.paramNames);
	        paramValues = [].concat(paramValues, matched.paramValues);
	      } else {
	        remainingPathname = null;
	      }
	
	      if (remainingPathname === '') {
	        // We have an exact match on the route. Just check that all the params
	        // match.
	        // FIXME: This doesn't work on repeated params.
	        return paramNames.every(function (paramName, index) {
	          return String(paramValues[index]) === String(params[paramName]);
	        });
	      }
	    }
	  }
	
	  return false;
	}
	
	/**
	 * Returns true if all key/value pairs in the given query are
	 * currently active.
	 */
	function queryIsActive(query, activeQuery) {
	  if (activeQuery == null) return query == null;
	
	  if (query == null) return true;
	
	  return deepEqual(query, activeQuery);
	}
	
	/**
	 * Returns true if a <Link> to the given pathname/query combination is
	 * currently active.
	 */
	function isActive(_ref, indexOnly, currentLocation, routes, params) {
	  var pathname = _ref.pathname,
	      query = _ref.query;
	
	  if (currentLocation == null) return false;
	
	  // TODO: This is a bit ugly. It keeps around support for treating pathnames
	  // without preceding slashes as absolute paths, but possibly also works
	  // around the same quirks with basenames as in matchRoutes.
	  if (pathname.charAt(0) !== '/') {
	    pathname = '/' + pathname;
	  }
	
	  if (!pathIsActive(pathname, currentLocation.pathname)) {
	    // The path check is necessary and sufficient for indexOnly, but otherwise
	    // we still need to check the routes.
	    if (indexOnly || !routeIsActive(pathname, routes, params)) {
	      return false;
	    }
	  }
	
	  return queryIsActive(query, currentLocation.query);
	}
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _AsyncUtils = __webpack_require__(13);
	
	var _PromiseUtils = __webpack_require__(16);
	
	function getComponentsForRoute(nextState, route, callback) {
	  if (route.component || route.components) {
	    callback(null, route.component || route.components);
	    return;
	  }
	
	  var getComponent = route.getComponent || route.getComponents;
	  if (getComponent) {
	    var componentReturn = getComponent.call(route, nextState, callback);
	    if ((0, _PromiseUtils.isPromise)(componentReturn)) componentReturn.then(function (component) {
	      return callback(null, component);
	    }, callback);
	  } else {
	    callback();
	  }
	}
	
	/**
	 * Asynchronously fetches all components needed for the given router
	 * state and calls callback(error, components) when finished.
	 *
	 * Note: This operation may finish synchronously if no routes have an
	 * asynchronous getComponents method.
	 */
	function getComponents(nextState, callback) {
	  (0, _AsyncUtils.mapAsync)(nextState.routes, function (route, index, callback) {
	    getComponentsForRoute(nextState, route, callback);
	  }, callback);
	}
	
	exports.default = getComponents;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.isPromise = isPromise;
	function isPromise(obj) {
	  return obj && typeof obj.then === 'function';
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.default = matchRoutes;
	
	var _AsyncUtils = __webpack_require__(13);
	
	var _PromiseUtils = __webpack_require__(16);
	
	var _PatternUtils = __webpack_require__(5);
	
	var _routerWarning = __webpack_require__(9);
	
	var _routerWarning2 = _interopRequireDefault(_routerWarning);
	
	var _RouteUtils = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function getChildRoutes(route, location, paramNames, paramValues, callback) {
	  if (route.childRoutes) {
	    return [null, route.childRoutes];
	  }
	  if (!route.getChildRoutes) {
	    return [];
	  }
	
	  var sync = true,
	      result = void 0;
	
	  var partialNextState = {
	    location: location,
	    params: createParams(paramNames, paramValues)
	  };
	
	  var childRoutesReturn = route.getChildRoutes(partialNextState, function (error, childRoutes) {
	    childRoutes = !error && (0, _RouteUtils.createRoutes)(childRoutes);
	    if (sync) {
	      result = [error, childRoutes];
	      return;
	    }
	
	    callback(error, childRoutes);
	  });
	
	  if ((0, _PromiseUtils.isPromise)(childRoutesReturn)) childRoutesReturn.then(function (childRoutes) {
	    return callback(null, (0, _RouteUtils.createRoutes)(childRoutes));
	  }, callback);
	
	  sync = false;
	  return result; // Might be undefined.
	}
	
	function getIndexRoute(route, location, paramNames, paramValues, callback) {
	  if (route.indexRoute) {
	    callback(null, route.indexRoute);
	  } else if (route.getIndexRoute) {
	    var partialNextState = {
	      location: location,
	      params: createParams(paramNames, paramValues)
	    };
	
	    var indexRoutesReturn = route.getIndexRoute(partialNextState, function (error, indexRoute) {
	      callback(error, !error && (0, _RouteUtils.createRoutes)(indexRoute)[0]);
	    });
	
	    if ((0, _PromiseUtils.isPromise)(indexRoutesReturn)) indexRoutesReturn.then(function (indexRoute) {
	      return callback(null, (0, _RouteUtils.createRoutes)(indexRoute)[0]);
	    }, callback);
	  } else if (route.childRoutes) {
	    (function () {
	      var pathless = route.childRoutes.filter(function (childRoute) {
	        return !childRoute.path;
	      });
	
	      (0, _AsyncUtils.loopAsync)(pathless.length, function (index, next, done) {
	        getIndexRoute(pathless[index], location, paramNames, paramValues, function (error, indexRoute) {
	          if (error || indexRoute) {
	            var routes = [pathless[index]].concat(Array.isArray(indexRoute) ? indexRoute : [indexRoute]);
	            done(error, routes);
	          } else {
	            next();
	          }
	        });
	      }, function (err, routes) {
	        callback(null, routes);
	      });
	    })();
	  } else {
	    callback();
	  }
	}
	
	function assignParams(params, paramNames, paramValues) {
	  return paramNames.reduce(function (params, paramName, index) {
	    var paramValue = paramValues && paramValues[index];
	
	    if (Array.isArray(params[paramName])) {
	      params[paramName].push(paramValue);
	    } else if (paramName in params) {
	      params[paramName] = [params[paramName], paramValue];
	    } else {
	      params[paramName] = paramValue;
	    }
	
	    return params;
	  }, params);
	}
	
	function createParams(paramNames, paramValues) {
	  return assignParams({}, paramNames, paramValues);
	}
	
	function matchRouteDeep(route, location, remainingPathname, paramNames, paramValues, callback) {
	  var pattern = route.path || '';
	
	  if (pattern.charAt(0) === '/') {
	    remainingPathname = location.pathname;
	    paramNames = [];
	    paramValues = [];
	  }
	
	  // Only try to match the path if the route actually has a pattern, and if
	  // we're not just searching for potential nested absolute paths.
	  if (remainingPathname !== null && pattern) {
	    try {
	      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
	      if (matched) {
	        remainingPathname = matched.remainingPathname;
	        paramNames = [].concat(paramNames, matched.paramNames);
	        paramValues = [].concat(paramValues, matched.paramValues);
	      } else {
	        remainingPathname = null;
	      }
	    } catch (error) {
	      callback(error);
	    }
	
	    // By assumption, pattern is non-empty here, which is the prerequisite for
	    // actually terminating a match.
	    if (remainingPathname === '') {
	      var _ret2 = function () {
	        var match = {
	          routes: [route],
	          params: createParams(paramNames, paramValues)
	        };
	
	        getIndexRoute(route, location, paramNames, paramValues, function (error, indexRoute) {
	          if (error) {
	            callback(error);
	          } else {
	            if (Array.isArray(indexRoute)) {
	              var _match$routes;
	
	               false ? (0, _routerWarning2.default)(indexRoute.every(function (route) {
	                return !route.path;
	              }), 'Index routes should not have paths') : void 0;
	              (_match$routes = match.routes).push.apply(_match$routes, indexRoute);
	            } else if (indexRoute) {
	               false ? (0, _routerWarning2.default)(!indexRoute.path, 'Index routes should not have paths') : void 0;
	              match.routes.push(indexRoute);
	            }
	
	            callback(null, match);
	          }
	        });
	
	        return {
	          v: void 0
	        };
	      }();
	
	      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	    }
	  }
	
	  if (remainingPathname != null || route.childRoutes) {
	    // Either a) this route matched at least some of the path or b)
	    // we don't have to load this route's children asynchronously. In
	    // either case continue checking for matches in the subtree.
	    var onChildRoutes = function onChildRoutes(error, childRoutes) {
	      if (error) {
	        callback(error);
	      } else if (childRoutes) {
	        // Check the child routes to see if any of them match.
	        matchRoutes(childRoutes, location, function (error, match) {
	          if (error) {
	            callback(error);
	          } else if (match) {
	            // A child route matched! Augment the match and pass it up the stack.
	            match.routes.unshift(route);
	            callback(null, match);
	          } else {
	            callback();
	          }
	        }, remainingPathname, paramNames, paramValues);
	      } else {
	        callback();
	      }
	    };
	
	    var result = getChildRoutes(route, location, paramNames, paramValues, onChildRoutes);
	    if (result) {
	      onChildRoutes.apply(undefined, result);
	    }
	  } else {
	    callback();
	  }
	}
	
	/**
	 * Asynchronously matches the given location to a set of routes and calls
	 * callback(error, state) when finished. The state object will have the
	 * following properties:
	 *
	 * - routes       An array of routes that matched, in hierarchical order
	 * - params       An object of URL parameters
	 *
	 * Note: This operation may finish synchronously if no routes have an
	 * asynchronous getChildRoutes method.
	 */
	function matchRoutes(routes, location, callback, remainingPathname) {
	  var paramNames = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
	  var paramValues = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
	
	  if (remainingPathname === undefined) {
	    // TODO: This is a little bit ugly, but it works around a quirk in history
	    // that strips the leading slash from pathnames when using basenames with
	    // trailing slashes.
	    if (location.pathname.charAt(0) !== '/') {
	      location = _extends({}, location, {
	        pathname: '/' + location.pathname
	      });
	    }
	    remainingPathname = location.pathname;
	  }
	
	  (0, _AsyncUtils.loopAsync)(routes.length, function (index, next, done) {
	    matchRouteDeep(routes[index], location, remainingPathname, paramNames, paramValues, function (error, match) {
	      if (error || match) {
	        done(error, match);
	      } else {
	        next();
	      }
	    });
	  }, callback);
	}
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.routes = exports.route = exports.components = exports.component = exports.history = undefined;
	exports.falsy = falsy;
	
	var _react = __webpack_require__(3);
	
	var func = _react.PropTypes.func,
	    object = _react.PropTypes.object,
	    arrayOf = _react.PropTypes.arrayOf,
	    oneOfType = _react.PropTypes.oneOfType,
	    element = _react.PropTypes.element,
	    shape = _react.PropTypes.shape,
	    string = _react.PropTypes.string;
	function falsy(props, propName, componentName) {
	  if (props[propName]) return new Error('<' + componentName + '> should not have a "' + propName + '" prop');
	}
	
	var history = exports.history = shape({
	  listen: func.isRequired,
	  push: func.isRequired,
	  replace: func.isRequired,
	  go: func.isRequired,
	  goBack: func.isRequired,
	  goForward: func.isRequired
	});
	
	var component = exports.component = oneOfType([func, string]);
	var components = exports.components = oneOfType([component, object]);
	var route = exports.route = oneOfType([object, element]);
	var routes = exports.routes = oneOfType([route, arrayOf(route)]);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _getRouteParams = __webpack_require__(20);
	
	var _getRouteParams2 = _interopRequireDefault(_getRouteParams);
	
	var _ContextUtils = __webpack_require__(21);
	
	var _RouteUtils = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _React$PropTypes = _react2.default.PropTypes,
	    array = _React$PropTypes.array,
	    func = _React$PropTypes.func,
	    object = _React$PropTypes.object;
	
	/**
	 * A <RouterContext> renders the component tree for a given router state
	 * and sets the history object and the current location in context.
	 */
	
	var RouterContext = _react2.default.createClass({
	  displayName: 'RouterContext',
	
	
	  mixins: [(0, _ContextUtils.ContextProvider)('router')],
	
	  propTypes: {
	    router: object.isRequired,
	    location: object.isRequired,
	    routes: array.isRequired,
	    params: object.isRequired,
	    components: array.isRequired,
	    createElement: func.isRequired
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      createElement: _react2.default.createElement
	    };
	  },
	
	
	  childContextTypes: {
	    router: object.isRequired
	  },
	
	  getChildContext: function getChildContext() {
	    return {
	      router: this.props.router
	    };
	  },
	  createElement: function createElement(component, props) {
	    return component == null ? null : this.props.createElement(component, props);
	  },
	  render: function render() {
	    var _this = this;
	
	    var _props = this.props,
	        location = _props.location,
	        routes = _props.routes,
	        params = _props.params,
	        components = _props.components,
	        router = _props.router;
	
	    var element = null;
	
	    if (components) {
	      element = components.reduceRight(function (element, components, index) {
	        if (components == null) return element; // Don't create new children; use the grandchildren.
	
	        var route = routes[index];
	        var routeParams = (0, _getRouteParams2.default)(route, params);
	        var props = {
	          location: location,
	          params: params,
	          route: route,
	          router: router,
	          routeParams: routeParams,
	          routes: routes
	        };
	
	        if ((0, _RouteUtils.isReactChildren)(element)) {
	          props.children = element;
	        } else if (element) {
	          for (var prop in element) {
	            if (Object.prototype.hasOwnProperty.call(element, prop)) props[prop] = element[prop];
	          }
	        }
	
	        if ((typeof components === 'undefined' ? 'undefined' : _typeof(components)) === 'object') {
	          var elements = {};
	
	          for (var key in components) {
	            if (Object.prototype.hasOwnProperty.call(components, key)) {
	              // Pass through the key as a prop to createElement to allow
	              // custom createElement functions to know which named component
	              // they're rendering, for e.g. matching up to fetched data.
	              elements[key] = _this.createElement(components[key], _extends({
	                key: key }, props));
	            }
	          }
	
	          return elements;
	        }
	
	        return _this.createElement(components, props);
	      }, element);
	    }
	
	    !(element === null || element === false || _react2.default.isValidElement(element)) ?  false ? (0, _invariant2.default)(false, 'The root route must render a single element') : (0, _invariant2.default)(false) : void 0;
	
	    return element;
	  }
	});
	
	exports.default = RouterContext;
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _PatternUtils = __webpack_require__(5);
	
	/**
	 * Extracts an object of params the given route cares about from
	 * the given params object.
	 */
	function getRouteParams(route, params) {
	  var routeParams = {};
	
	  if (!route.path) return routeParams;
	
	  (0, _PatternUtils.getParamNames)(route.path).forEach(function (p) {
	    if (Object.prototype.hasOwnProperty.call(params, p)) {
	      routeParams[p] = params[p];
	    }
	  });
	
	  return routeParams;
	}
	
	exports.default = getRouteParams;
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.ContextProvider = ContextProvider;
	exports.ContextSubscriber = ContextSubscriber;
	
	var _react = __webpack_require__(3);
	
	// Works around issues with context updates failing to propagate.
	// Caveat: the context value is expected to never change its identity.
	// https://github.com/facebook/react/issues/2517
	// https://github.com/reactjs/react-router/issues/470
	
	var contextProviderShape = _react.PropTypes.shape({
	  subscribe: _react.PropTypes.func.isRequired,
	  eventIndex: _react.PropTypes.number.isRequired
	});
	
	function makeContextName(name) {
	  return '@@contextSubscriber/' + name;
	}
	
	function ContextProvider(name) {
	  var _childContextTypes, _ref2;
	
	  var contextName = makeContextName(name);
	  var listenersKey = contextName + '/listeners';
	  var eventIndexKey = contextName + '/eventIndex';
	  var subscribeKey = contextName + '/subscribe';
	
	  return _ref2 = {
	    childContextTypes: (_childContextTypes = {}, _childContextTypes[contextName] = contextProviderShape.isRequired, _childContextTypes),
	
	    getChildContext: function getChildContext() {
	      var _ref;
	
	      return _ref = {}, _ref[contextName] = {
	        eventIndex: this[eventIndexKey],
	        subscribe: this[subscribeKey]
	      }, _ref;
	    },
	    componentWillMount: function componentWillMount() {
	      this[listenersKey] = [];
	      this[eventIndexKey] = 0;
	    },
	    componentWillReceiveProps: function componentWillReceiveProps() {
	      this[eventIndexKey]++;
	    },
	    componentDidUpdate: function componentDidUpdate() {
	      var _this = this;
	
	      this[listenersKey].forEach(function (listener) {
	        return listener(_this[eventIndexKey]);
	      });
	    }
	  }, _ref2[subscribeKey] = function (listener) {
	    var _this2 = this;
	
	    // No need to immediately call listener here.
	    this[listenersKey].push(listener);
	
	    return function () {
	      _this2[listenersKey] = _this2[listenersKey].filter(function (item) {
	        return item !== listener;
	      });
	    };
	  }, _ref2;
	}
	
	function ContextSubscriber(name) {
	  var _contextTypes, _ref4;
	
	  var contextName = makeContextName(name);
	  var lastRenderedEventIndexKey = contextName + '/lastRenderedEventIndex';
	  var handleContextUpdateKey = contextName + '/handleContextUpdate';
	  var unsubscribeKey = contextName + '/unsubscribe';
	
	  return _ref4 = {
	    contextTypes: (_contextTypes = {}, _contextTypes[contextName] = contextProviderShape, _contextTypes),
	
	    getInitialState: function getInitialState() {
	      var _ref3;
	
	      if (!this.context[contextName]) {
	        return {};
	      }
	
	      return _ref3 = {}, _ref3[lastRenderedEventIndexKey] = this.context[contextName].eventIndex, _ref3;
	    },
	    componentDidMount: function componentDidMount() {
	      if (!this.context[contextName]) {
	        return;
	      }
	
	      this[unsubscribeKey] = this.context[contextName].subscribe(this[handleContextUpdateKey]);
	    },
	    componentWillReceiveProps: function componentWillReceiveProps() {
	      var _setState;
	
	      if (!this.context[contextName]) {
	        return;
	      }
	
	      this.setState((_setState = {}, _setState[lastRenderedEventIndexKey] = this.context[contextName].eventIndex, _setState));
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      if (!this[unsubscribeKey]) {
	        return;
	      }
	
	      this[unsubscribeKey]();
	      this[unsubscribeKey] = null;
	    }
	  }, _ref4[handleContextUpdateKey] = function (eventIndex) {
	    if (eventIndex !== this.state[lastRenderedEventIndexKey]) {
	      var _setState2;
	
	      this.setState((_setState2 = {}, _setState2[lastRenderedEventIndexKey] = eventIndex, _setState2));
	    }
	  }, _ref4;
	}

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.createRouterObject = createRouterObject;
	exports.assignRouterState = assignRouterState;
	function createRouterObject(history, transitionManager, state) {
	  var router = _extends({}, history, {
	    setRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
	    isActive: transitionManager.isActive
	  });
	
	  return assignRouterState(router, state);
	}
	
	function assignRouterState(router, _ref) {
	  var location = _ref.location,
	      params = _ref.params,
	      routes = _ref.routes;
	
	  router.location = location;
	  router.params = params;
	  router.routes = routes;
	
	  return router;
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _PropTypes = __webpack_require__(4);
	
	var _ContextUtils = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _React$PropTypes = _react2.default.PropTypes,
	    bool = _React$PropTypes.bool,
	    object = _React$PropTypes.object,
	    string = _React$PropTypes.string,
	    func = _React$PropTypes.func,
	    oneOfType = _React$PropTypes.oneOfType;
	
	
	function isLeftClickEvent(event) {
	  return event.button === 0;
	}
	
	function isModifiedEvent(event) {
	  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
	}
	
	// TODO: De-duplicate against hasAnyProperties in createTransitionManager.
	function isEmptyObject(object) {
	  for (var p in object) {
	    if (Object.prototype.hasOwnProperty.call(object, p)) return false;
	  }return true;
	}
	
	function resolveToLocation(to, router) {
	  return typeof to === 'function' ? to(router.location) : to;
	}
	
	/**
	 * A <Link> is used to create an <a> element that links to a route.
	 * When that route is active, the link gets the value of its
	 * activeClassName prop.
	 *
	 * For example, assuming you have the following route:
	 *
	 *   <Route path="/posts/:postID" component={Post} />
	 *
	 * You could use the following component to link to that route:
	 *
	 *   <Link to={`/posts/${post.id}`} />
	 *
	 * Links may pass along location state and/or query string parameters
	 * in the state/query props, respectively.
	 *
	 *   <Link ... query={{ show: true }} state={{ the: 'state' }} />
	 */
	var Link = _react2.default.createClass({
	  displayName: 'Link',
	
	
	  mixins: [(0, _ContextUtils.ContextSubscriber)('router')],
	
	  contextTypes: {
	    router: _PropTypes.routerShape
	  },
	
	  propTypes: {
	    to: oneOfType([string, object, func]),
	    query: object,
	    hash: string,
	    state: object,
	    activeStyle: object,
	    activeClassName: string,
	    onlyActiveOnIndex: bool.isRequired,
	    onClick: func,
	    target: string
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onlyActiveOnIndex: false,
	      style: {}
	    };
	  },
	  handleClick: function handleClick(event) {
	    if (this.props.onClick) this.props.onClick(event);
	
	    if (event.defaultPrevented) return;
	
	    var router = this.context.router;
	
	    !router ?  false ? (0, _invariant2.default)(false, '<Link>s rendered outside of a router context cannot navigate.') : (0, _invariant2.default)(false) : void 0;
	
	    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;
	
	    // If target prop is set (e.g. to "_blank"), let browser handle link.
	    /* istanbul ignore if: untestable with Karma */
	    if (this.props.target) return;
	
	    event.preventDefault();
	
	    router.push(resolveToLocation(this.props.to, router));
	  },
	  render: function render() {
	    var _props = this.props,
	        to = _props.to,
	        activeClassName = _props.activeClassName,
	        activeStyle = _props.activeStyle,
	        onlyActiveOnIndex = _props.onlyActiveOnIndex,
	        props = _objectWithoutProperties(_props, ['to', 'activeClassName', 'activeStyle', 'onlyActiveOnIndex']);
	
	    // Ignore if rendered outside the context of router to simplify unit testing.
	
	
	    var router = this.context.router;
	
	
	    if (router) {
	      // If user does not specify a `to` prop, return an empty anchor tag.
	      if (to == null) {
	        return _react2.default.createElement('a', props);
	      }
	
	      var toLocation = resolveToLocation(to, router);
	      props.href = router.createHref(toLocation);
	
	      if (activeClassName || activeStyle != null && !isEmptyObject(activeStyle)) {
	        if (router.isActive(toLocation, onlyActiveOnIndex)) {
	          if (activeClassName) {
	            if (props.className) {
	              props.className += ' ' + activeClassName;
	            } else {
	              props.className = activeClassName;
	            }
	          }
	
	          if (activeStyle) props.style = _extends({}, props.style, activeStyle);
	        }
	      }
	    }
	
	    return _react2.default.createElement('a', _extends({}, props, { onClick: this.handleClick }));
	  }
	});
	
	exports.default = Link;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Link = __webpack_require__(23);
	
	var _Link2 = _interopRequireDefault(_Link);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * An <IndexLink> is used to link to an <IndexRoute>.
	 */
	var IndexLink = _react2.default.createClass({
	  displayName: 'IndexLink',
	  render: function render() {
	    return _react2.default.createElement(_Link2.default, _extends({}, this.props, { onlyActiveOnIndex: true }));
	  }
	});
	
	exports.default = IndexLink;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = withRouter;
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _hoistNonReactStatics = __webpack_require__(26);
	
	var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);
	
	var _ContextUtils = __webpack_require__(21);
	
	var _PropTypes = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function getDisplayName(WrappedComponent) {
	  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}
	
	function withRouter(WrappedComponent, options) {
	  var withRef = options && options.withRef;
	
	  var WithRouter = _react2.default.createClass({
	    displayName: 'WithRouter',
	
	    mixins: [(0, _ContextUtils.ContextSubscriber)('router')],
	
	    contextTypes: { router: _PropTypes.routerShape },
	    propTypes: { router: _PropTypes.routerShape },
	
	    getWrappedInstance: function getWrappedInstance() {
	      !withRef ?  false ? (0, _invariant2.default)(false, 'To access the wrapped instance, you need to specify ' + '`{ withRef: true }` as the second argument of the withRouter() call.') : (0, _invariant2.default)(false) : void 0;
	
	      return this.wrappedInstance;
	    },
	    render: function render() {
	      var _this = this;
	
	      var router = this.props.router || this.context.router;
	      var params = router.params,
	          location = router.location,
	          routes = router.routes;
	
	      var props = _extends({}, this.props, { router: router, params: params, location: location, routes: routes });
	
	      if (withRef) {
	        props.ref = function (c) {
	          _this.wrappedInstance = c;
	        };
	      }
	
	      return _react2.default.createElement(WrappedComponent, props);
	    }
	  });
	
	  WithRouter.displayName = 'withRouter(' + getDisplayName(WrappedComponent) + ')';
	  WithRouter.WrappedComponent = WrappedComponent;
	
	  return (0, _hoistNonReactStatics2.default)(WithRouter, WrappedComponent);
	}
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	'use strict';
	
	var REACT_STATICS = {
	    childContextTypes: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};
	
	var KNOWN_STATICS = {
	    name: true,
	    length: true,
	    prototype: true,
	    caller: true,
	    arguments: true,
	    arity: true
	};
	
	var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';
	
	module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
	    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
	        var keys = Object.getOwnPropertyNames(sourceComponent);
	
	        /* istanbul ignore else */
	        if (isGetOwnPropertySymbolsAvailable) {
	            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
	        }
	
	        for (var i = 0; i < keys.length; ++i) {
	            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
	                try {
	                    targetComponent[keys[i]] = sourceComponent[keys[i]];
	                } catch (error) {
	
	                }
	            }
	        }
	    }
	
	    return targetComponent;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _routerWarning = __webpack_require__(9);
	
	var _routerWarning2 = _interopRequireDefault(_routerWarning);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _Redirect = __webpack_require__(28);
	
	var _Redirect2 = _interopRequireDefault(_Redirect);
	
	var _InternalPropTypes = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _React$PropTypes = _react2.default.PropTypes,
	    string = _React$PropTypes.string,
	    object = _React$PropTypes.object;
	
	/**
	 * An <IndexRedirect> is used to redirect from an indexRoute.
	 */
	/* eslint-disable react/require-render-return */
	
	var IndexRedirect = _react2.default.createClass({
	  displayName: 'IndexRedirect',
	
	
	  statics: {
	    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
	      /* istanbul ignore else: sanity check */
	      if (parentRoute) {
	        parentRoute.indexRoute = _Redirect2.default.createRouteFromReactElement(element);
	      } else {
	         false ? (0, _routerWarning2.default)(false, 'An <IndexRedirect> does not make sense at the root of your route config') : void 0;
	      }
	    }
	  },
	
	  propTypes: {
	    to: string.isRequired,
	    query: object,
	    state: object,
	    onEnter: _InternalPropTypes.falsy,
	    children: _InternalPropTypes.falsy
	  },
	
	  /* istanbul ignore next: sanity check */
	  render: function render() {
	     true ?  false ? (0, _invariant2.default)(false, '<IndexRedirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
	  }
	});
	
	exports.default = IndexRedirect;
	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _RouteUtils = __webpack_require__(2);
	
	var _PatternUtils = __webpack_require__(5);
	
	var _InternalPropTypes = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _React$PropTypes = _react2.default.PropTypes,
	    string = _React$PropTypes.string,
	    object = _React$PropTypes.object;
	
	/**
	 * A <Redirect> is used to declare another URL path a client should
	 * be sent to when they request a given URL.
	 *
	 * Redirects are placed alongside routes in the route configuration
	 * and are traversed in the same manner.
	 */
	/* eslint-disable react/require-render-return */
	
	var Redirect = _react2.default.createClass({
	  displayName: 'Redirect',
	
	
	  statics: {
	    createRouteFromReactElement: function createRouteFromReactElement(element) {
	      var route = (0, _RouteUtils.createRouteFromReactElement)(element);
	
	      if (route.from) route.path = route.from;
	
	      route.onEnter = function (nextState, replace) {
	        var location = nextState.location,
	            params = nextState.params;
	
	
	        var pathname = void 0;
	        if (route.to.charAt(0) === '/') {
	          pathname = (0, _PatternUtils.formatPattern)(route.to, params);
	        } else if (!route.to) {
	          pathname = location.pathname;
	        } else {
	          var routeIndex = nextState.routes.indexOf(route);
	          var parentPattern = Redirect.getRoutePattern(nextState.routes, routeIndex - 1);
	          var pattern = parentPattern.replace(/\/*$/, '/') + route.to;
	          pathname = (0, _PatternUtils.formatPattern)(pattern, params);
	        }
	
	        replace({
	          pathname: pathname,
	          query: route.query || location.query,
	          state: route.state || location.state
	        });
	      };
	
	      return route;
	    },
	    getRoutePattern: function getRoutePattern(routes, routeIndex) {
	      var parentPattern = '';
	
	      for (var i = routeIndex; i >= 0; i--) {
	        var route = routes[i];
	        var pattern = route.path || '';
	
	        parentPattern = pattern.replace(/\/*$/, '/') + parentPattern;
	
	        if (pattern.indexOf('/') === 0) break;
	      }
	
	      return '/' + parentPattern;
	    }
	  },
	
	  propTypes: {
	    path: string,
	    from: string, // Alias for path
	    to: string.isRequired,
	    query: object,
	    state: object,
	    onEnter: _InternalPropTypes.falsy,
	    children: _InternalPropTypes.falsy
	  },
	
	  /* istanbul ignore next: sanity check */
	  render: function render() {
	     true ?  false ? (0, _invariant2.default)(false, '<Redirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
	  }
	});
	
	exports.default = Redirect;
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _routerWarning = __webpack_require__(9);
	
	var _routerWarning2 = _interopRequireDefault(_routerWarning);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _RouteUtils = __webpack_require__(2);
	
	var _InternalPropTypes = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var func = _react2.default.PropTypes.func;
	
	/**
	 * An <IndexRoute> is used to specify its parent's <Route indexRoute> in
	 * a JSX route config.
	 */
	/* eslint-disable react/require-render-return */
	
	var IndexRoute = _react2.default.createClass({
	  displayName: 'IndexRoute',
	
	
	  statics: {
	    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
	      /* istanbul ignore else: sanity check */
	      if (parentRoute) {
	        parentRoute.indexRoute = (0, _RouteUtils.createRouteFromReactElement)(element);
	      } else {
	         false ? (0, _routerWarning2.default)(false, 'An <IndexRoute> does not make sense at the root of your route config') : void 0;
	      }
	    }
	  },
	
	  propTypes: {
	    path: _InternalPropTypes.falsy,
	    component: _InternalPropTypes.component,
	    components: _InternalPropTypes.components,
	    getComponent: func,
	    getComponents: func
	  },
	
	  /* istanbul ignore next: sanity check */
	  render: function render() {
	     true ?  false ? (0, _invariant2.default)(false, '<IndexRoute> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
	  }
	});
	
	exports.default = IndexRoute;
	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _RouteUtils = __webpack_require__(2);
	
	var _InternalPropTypes = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _React$PropTypes = _react2.default.PropTypes,
	    string = _React$PropTypes.string,
	    func = _React$PropTypes.func;
	
	/**
	 * A <Route> is used to declare which components are rendered to the
	 * page when the URL matches a given pattern.
	 *
	 * Routes are arranged in a nested tree structure. When a new URL is
	 * requested, the tree is searched depth-first to find a route whose
	 * path matches the URL.  When one is found, all routes in the tree
	 * that lead to it are considered "active" and their components are
	 * rendered into the DOM, nested in the same order as in the tree.
	 */
	/* eslint-disable react/require-render-return */
	
	var Route = _react2.default.createClass({
	  displayName: 'Route',
	
	
	  statics: {
	    createRouteFromReactElement: _RouteUtils.createRouteFromReactElement
	  },
	
	  propTypes: {
	    path: string,
	    component: _InternalPropTypes.component,
	    components: _InternalPropTypes.components,
	    getComponent: func,
	    getComponents: func
	  },
	
	  /* istanbul ignore next: sanity check */
	  render: function render() {
	     true ?  false ? (0, _invariant2.default)(false, '<Route> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
	  }
	});
	
	exports.default = Route;
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _Actions = __webpack_require__(32);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _createMemoryHistory = __webpack_require__(33);
	
	var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);
	
	var _createTransitionManager = __webpack_require__(8);
	
	var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);
	
	var _RouteUtils = __webpack_require__(2);
	
	var _RouterUtils = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	/**
	 * A high-level API to be used for server-side rendering.
	 *
	 * This function matches a location to a set of routes and calls
	 * callback(error, redirectLocation, renderProps) when finished.
	 *
	 * Note: You probably don't want to use this in a browser unless you're using
	 * server-side rendering with async routes.
	 */
	function match(_ref, callback) {
	  var history = _ref.history,
	      routes = _ref.routes,
	      location = _ref.location,
	      options = _objectWithoutProperties(_ref, ['history', 'routes', 'location']);
	
	  !(history || location) ?  false ? (0, _invariant2.default)(false, 'match needs a history or a location') : (0, _invariant2.default)(false) : void 0;
	
	  history = history ? history : (0, _createMemoryHistory2.default)(options);
	  var transitionManager = (0, _createTransitionManager2.default)(history, (0, _RouteUtils.createRoutes)(routes));
	
	  if (location) {
	    // Allow match({ location: '/the/path', ... })
	    location = history.createLocation(location);
	  } else {
	    location = history.getCurrentLocation();
	  }
	
	  transitionManager.match(location, function (error, redirectLocation, nextState) {
	    var renderProps = void 0;
	
	    if (nextState) {
	      var router = (0, _RouterUtils.createRouterObject)(history, transitionManager, nextState);
	      renderProps = _extends({}, nextState, {
	        router: router,
	        matchContext: { transitionManager: transitionManager, router: router }
	      });
	    }
	
	    callback(error, redirectLocation && history.createLocation(redirectLocation, _Actions.REPLACE), renderProps);
	  });
	}
	
	exports.default = match;
	module.exports = exports['default'];

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	/**
	 * Indicates that navigation was caused by a call to history.push.
	 */
	var PUSH = exports.PUSH = 'PUSH';
	
	/**
	 * Indicates that navigation was caused by a call to history.replace.
	 */
	var REPLACE = exports.REPLACE = 'REPLACE';
	
	/**
	 * Indicates that navigation was caused by some other action such
	 * as using a browser's back/forward buttons and/or manually manipulating
	 * the URL in a browser's location bar. This is the default.
	 *
	 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
	 * for more information.
	 */
	var POP = exports.POP = 'POP';

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = createMemoryHistory;
	
	var _useQueries = __webpack_require__(34);
	
	var _useQueries2 = _interopRequireDefault(_useQueries);
	
	var _useBasename = __webpack_require__(41);
	
	var _useBasename2 = _interopRequireDefault(_useBasename);
	
	var _createMemoryHistory = __webpack_require__(42);
	
	var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function createMemoryHistory(options) {
	  // signatures and type checking differ between `useQueries` and
	  // `createMemoryHistory`, have to create `memoryHistory` first because
	  // `useQueries` doesn't understand the signature
	  var memoryHistory = (0, _createMemoryHistory2.default)(options);
	  var createHistory = function createHistory() {
	    return memoryHistory;
	  };
	  var history = (0, _useQueries2.default)((0, _useBasename2.default)(createHistory))(options);
	  return history;
	}
	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _queryString = __webpack_require__(35);
	
	var _runTransitionHook = __webpack_require__(38);
	
	var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);
	
	var _LocationUtils = __webpack_require__(39);
	
	var _PathUtils = __webpack_require__(40);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var defaultStringifyQuery = function defaultStringifyQuery(query) {
	  return (0, _queryString.stringify)(query).replace(/%20/g, '+');
	};
	
	var defaultParseQueryString = _queryString.parse;
	
	/**
	 * Returns a new createHistory function that may be used to create
	 * history objects that know how to handle URL queries.
	 */
	var useQueries = function useQueries(createHistory) {
	  return function () {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    var history = createHistory(options);
	    var stringifyQuery = options.stringifyQuery,
	        parseQueryString = options.parseQueryString;
	
	
	    if (typeof stringifyQuery !== 'function') stringifyQuery = defaultStringifyQuery;
	
	    if (typeof parseQueryString !== 'function') parseQueryString = defaultParseQueryString;
	
	    var decodeQuery = function decodeQuery(location) {
	      if (!location) return location;
	
	      if (location.query == null) location.query = parseQueryString(location.search.substring(1));
	
	      return location;
	    };
	
	    var encodeQuery = function encodeQuery(location, query) {
	      if (query == null) return location;
	
	      var object = typeof location === 'string' ? (0, _PathUtils.parsePath)(location) : location;
	      var queryString = stringifyQuery(query);
	      var search = queryString ? '?' + queryString : '';
	
	      return _extends({}, object, {
	        search: search
	      });
	    };
	
	    // Override all read methods with query-aware versions.
	    var getCurrentLocation = function getCurrentLocation() {
	      return decodeQuery(history.getCurrentLocation());
	    };
	
	    var listenBefore = function listenBefore(hook) {
	      return history.listenBefore(function (location, callback) {
	        return (0, _runTransitionHook2.default)(hook, decodeQuery(location), callback);
	      });
	    };
	
	    var listen = function listen(listener) {
	      return history.listen(function (location) {
	        return listener(decodeQuery(location));
	      });
	    };
	
	    // Override all write methods with query-aware versions.
	    var push = function push(location) {
	      return history.push(encodeQuery(location, location.query));
	    };
	
	    var replace = function replace(location) {
	      return history.replace(encodeQuery(location, location.query));
	    };
	
	    var createPath = function createPath(location) {
	      return history.createPath(encodeQuery(location, location.query));
	    };
	
	    var createHref = function createHref(location) {
	      return history.createHref(encodeQuery(location, location.query));
	    };
	
	    var createLocation = function createLocation(location) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      var newLocation = history.createLocation.apply(history, [encodeQuery(location, location.query)].concat(args));
	
	      if (location.query) newLocation.query = (0, _LocationUtils.createQuery)(location.query);
	
	      return decodeQuery(newLocation);
	    };
	
	    return _extends({}, history, {
	      getCurrentLocation: getCurrentLocation,
	      listenBefore: listenBefore,
	      listen: listen,
	      push: push,
	      replace: replace,
	      createPath: createPath,
	      createHref: createHref,
	      createLocation: createLocation
	    });
	  };
	};
	
	exports.default = useQueries;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(36);
	var objectAssign = __webpack_require__(37);
	
	function encoderForArrayFormat(opts) {
		switch (opts.arrayFormat) {
			case 'index':
				return function (key, value, index) {
					return value === null ? [
						encode(key, opts),
						'[',
						index,
						']'
					].join('') : [
						encode(key, opts),
						'[',
						encode(index, opts),
						']=',
						encode(value, opts)
					].join('');
				};
	
			case 'bracket':
				return function (key, value) {
					return value === null ? encode(key, opts) : [
						encode(key, opts),
						'[]=',
						encode(value, opts)
					].join('');
				};
	
			default:
				return function (key, value) {
					return value === null ? encode(key, opts) : [
						encode(key, opts),
						'=',
						encode(value, opts)
					].join('');
				};
		}
	}
	
	function parserForArrayFormat(opts) {
		var result;
	
		switch (opts.arrayFormat) {
			case 'index':
				return function (key, value, accumulator) {
					result = /\[(\d*)\]$/.exec(key);
	
					key = key.replace(/\[\d*\]$/, '');
	
					if (!result) {
						accumulator[key] = value;
						return;
					}
	
					if (accumulator[key] === undefined) {
						accumulator[key] = {};
					}
	
					accumulator[key][result[1]] = value;
				};
	
			case 'bracket':
				return function (key, value, accumulator) {
					result = /(\[\])$/.exec(key);
					key = key.replace(/\[\]$/, '');
	
					if (!result) {
						accumulator[key] = value;
						return;
					} else if (accumulator[key] === undefined) {
						accumulator[key] = [value];
						return;
					}
	
					accumulator[key] = [].concat(accumulator[key], value);
				};
	
			default:
				return function (key, value, accumulator) {
					if (accumulator[key] === undefined) {
						accumulator[key] = value;
						return;
					}
	
					accumulator[key] = [].concat(accumulator[key], value);
				};
		}
	}
	
	function encode(value, opts) {
		if (opts.encode) {
			return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
		}
	
		return value;
	}
	
	function keysSorter(input) {
		if (Array.isArray(input)) {
			return input.sort();
		} else if (typeof input === 'object') {
			return keysSorter(Object.keys(input)).sort(function (a, b) {
				return Number(a) - Number(b);
			}).map(function (key) {
				return input[key];
			});
		}
	
		return input;
	}
	
	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};
	
	exports.parse = function (str, opts) {
		opts = objectAssign({arrayFormat: 'none'}, opts);
	
		var formatter = parserForArrayFormat(opts);
	
		// Create an object with no prototype
		// https://github.com/sindresorhus/query-string/issues/47
		var ret = Object.create(null);
	
		if (typeof str !== 'string') {
			return ret;
		}
	
		str = str.trim().replace(/^(\?|#|&)/, '');
	
		if (!str) {
			return ret;
		}
	
		str.split('&').forEach(function (param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;
	
			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);
	
			formatter(decodeURIComponent(key), val, ret);
		});
	
		return Object.keys(ret).sort().reduce(function (result, key) {
			var val = ret[key];
			if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
				// Sort object keys, not values
				result[key] = keysSorter(val);
			} else {
				result[key] = val;
			}
	
			return result;
		}, Object.create(null));
	};
	
	exports.stringify = function (obj, opts) {
		var defaults = {
			encode: true,
			strict: true,
			arrayFormat: 'none'
		};
	
		opts = objectAssign(defaults, opts);
	
		var formatter = encoderForArrayFormat(opts);
	
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];
	
			if (val === undefined) {
				return '';
			}
	
			if (val === null) {
				return encode(key, opts);
			}
	
			if (Array.isArray(val)) {
				var result = [];
	
				val.slice().forEach(function (val2) {
					if (val2 === undefined) {
						return;
					}
	
					result.push(formatter(key, val2, result.length));
				});
	
				return result.join('&');
			}
	
			return encode(key, opts) + '=' + encode(val, opts);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};


/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}
	
			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}
	
	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var runTransitionHook = function runTransitionHook(hook, location, callback) {
	  var result = hook(location, callback);
	
	  if (hook.length < 2) {
	    // Assume the hook runs synchronously and automatically
	    // call the callback with the return value.
	    callback(result);
	  } else {
	     false ? (0, _warning2.default)(result === undefined, 'You should not "return" in a transition hook with a callback argument; ' + 'call the callback instead') : void 0;
	  }
	};
	
	exports.default = runTransitionHook;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.locationsAreEqual = exports.statesAreEqual = exports.createLocation = exports.createQuery = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var _PathUtils = __webpack_require__(40);
	
	var _Actions = __webpack_require__(32);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var createQuery = exports.createQuery = function createQuery(props) {
	  return _extends(Object.create(null), props);
	};
	
	var createLocation = exports.createLocation = function createLocation() {
	  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
	  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Actions.POP;
	  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	  var object = typeof input === 'string' ? (0, _PathUtils.parsePath)(input) : input;
	
	   false ? (0, _warning2.default)(!object.path, 'Location descriptor objects should have a `pathname`, not a `path`.') : void 0;
	
	  var pathname = object.pathname || '/';
	  var search = object.search || '';
	  var hash = object.hash || '';
	  var state = object.state;
	
	  return {
	    pathname: pathname,
	    search: search,
	    hash: hash,
	    state: state,
	    action: action,
	    key: key
	  };
	};
	
	var isDate = function isDate(object) {
	  return Object.prototype.toString.call(object) === '[object Date]';
	};
	
	var statesAreEqual = exports.statesAreEqual = function statesAreEqual(a, b) {
	  if (a === b) return true;
	
	  var typeofA = typeof a === 'undefined' ? 'undefined' : _typeof(a);
	  var typeofB = typeof b === 'undefined' ? 'undefined' : _typeof(b);
	
	  if (typeofA !== typeofB) return false;
	
	  !(typeofA !== 'function') ?  false ? (0, _invariant2.default)(false, 'You must not store functions in location state') : (0, _invariant2.default)(false) : void 0;
	
	  // Not the same object, but same type.
	  if (typeofA === 'object') {
	    !!(isDate(a) && isDate(b)) ?  false ? (0, _invariant2.default)(false, 'You must not store Date objects in location state') : (0, _invariant2.default)(false) : void 0;
	
	    if (!Array.isArray(a)) {
	      var keysofA = Object.keys(a);
	      var keysofB = Object.keys(b);
	      return keysofA.length === keysofB.length && keysofA.every(function (key) {
	        return statesAreEqual(a[key], b[key]);
	      });
	    }
	
	    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
	      return statesAreEqual(item, b[index]);
	    });
	  }
	
	  // All other serializable types (string, number, boolean)
	  // should be strict equal.
	  return false;
	};
	
	var locationsAreEqual = exports.locationsAreEqual = function locationsAreEqual(a, b) {
	  return a.key === b.key &&
	  // a.action === b.action && // Different action !== location change.
	  a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && statesAreEqual(a.state, b.state);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.createPath = exports.parsePath = exports.getQueryStringValueFromPath = exports.stripQueryStringValueFromPath = exports.addQueryStringValueToPath = undefined;
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var addQueryStringValueToPath = exports.addQueryStringValueToPath = function addQueryStringValueToPath(path, key, value) {
	  var _parsePath = parsePath(path),
	      pathname = _parsePath.pathname,
	      search = _parsePath.search,
	      hash = _parsePath.hash;
	
	  return createPath({
	    pathname: pathname,
	    search: search + (search.indexOf('?') === -1 ? '?' : '&') + key + '=' + value,
	    hash: hash
	  });
	};
	
	var stripQueryStringValueFromPath = exports.stripQueryStringValueFromPath = function stripQueryStringValueFromPath(path, key) {
	  var _parsePath2 = parsePath(path),
	      pathname = _parsePath2.pathname,
	      search = _parsePath2.search,
	      hash = _parsePath2.hash;
	
	  return createPath({
	    pathname: pathname,
	    search: search.replace(new RegExp('([?&])' + key + '=[a-zA-Z0-9]+(&?)'), function (match, prefix, suffix) {
	      return prefix === '?' ? prefix : suffix;
	    }),
	    hash: hash
	  });
	};
	
	var getQueryStringValueFromPath = exports.getQueryStringValueFromPath = function getQueryStringValueFromPath(path, key) {
	  var _parsePath3 = parsePath(path),
	      search = _parsePath3.search;
	
	  var match = search.match(new RegExp('[?&]' + key + '=([a-zA-Z0-9]+)'));
	  return match && match[1];
	};
	
	var extractPath = function extractPath(string) {
	  var match = string.match(/^(https?:)?\/\/[^\/]*/);
	  return match == null ? string : string.substring(match[0].length);
	};
	
	var parsePath = exports.parsePath = function parsePath(path) {
	  var pathname = extractPath(path);
	  var search = '';
	  var hash = '';
	
	   false ? (0, _warning2.default)(path === pathname, 'A path must be pathname + search + hash only, not a full URL like "%s"', path) : void 0;
	
	  var hashIndex = pathname.indexOf('#');
	  if (hashIndex !== -1) {
	    hash = pathname.substring(hashIndex);
	    pathname = pathname.substring(0, hashIndex);
	  }
	
	  var searchIndex = pathname.indexOf('?');
	  if (searchIndex !== -1) {
	    search = pathname.substring(searchIndex);
	    pathname = pathname.substring(0, searchIndex);
	  }
	
	  if (pathname === '') pathname = '/';
	
	  return {
	    pathname: pathname,
	    search: search,
	    hash: hash
	  };
	};
	
	var createPath = exports.createPath = function createPath(location) {
	  if (location == null || typeof location === 'string') return location;
	
	  var basename = location.basename,
	      pathname = location.pathname,
	      search = location.search,
	      hash = location.hash;
	
	  var path = (basename || '') + pathname;
	
	  if (search && search !== '?') path += search;
	
	  if (hash) path += hash;
	
	  return path;
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _runTransitionHook = __webpack_require__(38);
	
	var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);
	
	var _PathUtils = __webpack_require__(40);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var useBasename = function useBasename(createHistory) {
	  return function () {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    var history = createHistory(options);
	    var basename = options.basename;
	
	
	    var addBasename = function addBasename(location) {
	      if (!location) return location;
	
	      if (basename && location.basename == null) {
	        if (location.pathname.toLowerCase().indexOf(basename.toLowerCase()) === 0) {
	          location.pathname = location.pathname.substring(basename.length);
	          location.basename = basename;
	
	          if (location.pathname === '') location.pathname = '/';
	        } else {
	          location.basename = '';
	        }
	      }
	
	      return location;
	    };
	
	    var prependBasename = function prependBasename(location) {
	      if (!basename) return location;
	
	      var object = typeof location === 'string' ? (0, _PathUtils.parsePath)(location) : location;
	      var pname = object.pathname;
	      var normalizedBasename = basename.slice(-1) === '/' ? basename : basename + '/';
	      var normalizedPathname = pname.charAt(0) === '/' ? pname.slice(1) : pname;
	      var pathname = normalizedBasename + normalizedPathname;
	
	      return _extends({}, object, {
	        pathname: pathname
	      });
	    };
	
	    // Override all read methods with basename-aware versions.
	    var getCurrentLocation = function getCurrentLocation() {
	      return addBasename(history.getCurrentLocation());
	    };
	
	    var listenBefore = function listenBefore(hook) {
	      return history.listenBefore(function (location, callback) {
	        return (0, _runTransitionHook2.default)(hook, addBasename(location), callback);
	      });
	    };
	
	    var listen = function listen(listener) {
	      return history.listen(function (location) {
	        return listener(addBasename(location));
	      });
	    };
	
	    // Override all write methods with basename-aware versions.
	    var push = function push(location) {
	      return history.push(prependBasename(location));
	    };
	
	    var replace = function replace(location) {
	      return history.replace(prependBasename(location));
	    };
	
	    var createPath = function createPath(location) {
	      return history.createPath(prependBasename(location));
	    };
	
	    var createHref = function createHref(location) {
	      return history.createHref(prependBasename(location));
	    };
	
	    var createLocation = function createLocation(location) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      return addBasename(history.createLocation.apply(history, [prependBasename(location)].concat(args)));
	    };
	
	    return _extends({}, history, {
	      getCurrentLocation: getCurrentLocation,
	      listenBefore: listenBefore,
	      listen: listen,
	      push: push,
	      replace: replace,
	      createPath: createPath,
	      createHref: createHref,
	      createLocation: createLocation
	    });
	  };
	};
	
	exports.default = useBasename;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _LocationUtils = __webpack_require__(39);
	
	var _PathUtils = __webpack_require__(40);
	
	var _createHistory = __webpack_require__(43);
	
	var _createHistory2 = _interopRequireDefault(_createHistory);
	
	var _Actions = __webpack_require__(32);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var createStateStorage = function createStateStorage(entries) {
	  return entries.filter(function (entry) {
	    return entry.state;
	  }).reduce(function (memo, entry) {
	    memo[entry.key] = entry.state;
	    return memo;
	  }, {});
	};
	
	var createMemoryHistory = function createMemoryHistory() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  if (Array.isArray(options)) {
	    options = { entries: options };
	  } else if (typeof options === 'string') {
	    options = { entries: [options] };
	  }
	
	  var getCurrentLocation = function getCurrentLocation() {
	    var entry = entries[current];
	    var path = (0, _PathUtils.createPath)(entry);
	
	    var key = void 0,
	        state = void 0;
	    if (entry.key) {
	      key = entry.key;
	      state = readState(key);
	    }
	
	    var init = (0, _PathUtils.parsePath)(path);
	
	    return (0, _LocationUtils.createLocation)(_extends({}, init, { state: state }), undefined, key);
	  };
	
	  var canGo = function canGo(n) {
	    var index = current + n;
	    return index >= 0 && index < entries.length;
	  };
	
	  var go = function go(n) {
	    if (!n) return;
	
	    if (!canGo(n)) {
	       false ? (0, _warning2.default)(false, 'Cannot go(%s) there is not enough history', n) : void 0;
	
	      return;
	    }
	
	    current += n;
	    var currentLocation = getCurrentLocation();
	
	    // Change action to POP
	    history.transitionTo(_extends({}, currentLocation, { action: _Actions.POP }));
	  };
	
	  var pushLocation = function pushLocation(location) {
	    current += 1;
	
	    if (current < entries.length) entries.splice(current);
	
	    entries.push(location);
	
	    saveState(location.key, location.state);
	  };
	
	  var replaceLocation = function replaceLocation(location) {
	    entries[current] = location;
	    saveState(location.key, location.state);
	  };
	
	  var history = (0, _createHistory2.default)(_extends({}, options, {
	    getCurrentLocation: getCurrentLocation,
	    pushLocation: pushLocation,
	    replaceLocation: replaceLocation,
	    go: go
	  }));
	
	  var _options = options,
	      entries = _options.entries,
	      current = _options.current;
	
	
	  if (typeof entries === 'string') {
	    entries = [entries];
	  } else if (!Array.isArray(entries)) {
	    entries = ['/'];
	  }
	
	  entries = entries.map(function (entry) {
	    return (0, _LocationUtils.createLocation)(entry);
	  });
	
	  if (current == null) {
	    current = entries.length - 1;
	  } else {
	    !(current >= 0 && current < entries.length) ?  false ? (0, _invariant2.default)(false, 'Current index must be >= 0 and < %s, was %s', entries.length, current) : (0, _invariant2.default)(false) : void 0;
	  }
	
	  var storage = createStateStorage(entries);
	
	  var saveState = function saveState(key, state) {
	    return storage[key] = state;
	  };
	
	  var readState = function readState(key) {
	    return storage[key];
	  };
	
	  return _extends({}, history, {
	    canGo: canGo
	  });
	};
	
	exports.default = createMemoryHistory;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _AsyncUtils = __webpack_require__(44);
	
	var _PathUtils = __webpack_require__(40);
	
	var _runTransitionHook = __webpack_require__(38);
	
	var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);
	
	var _Actions = __webpack_require__(32);
	
	var _LocationUtils = __webpack_require__(39);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var createHistory = function createHistory() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var getCurrentLocation = options.getCurrentLocation,
	      getUserConfirmation = options.getUserConfirmation,
	      pushLocation = options.pushLocation,
	      replaceLocation = options.replaceLocation,
	      go = options.go,
	      keyLength = options.keyLength;
	
	
	  var currentLocation = void 0;
	  var pendingLocation = void 0;
	  var beforeListeners = [];
	  var listeners = [];
	  var allKeys = [];
	
	  var getCurrentIndex = function getCurrentIndex() {
	    if (pendingLocation && pendingLocation.action === _Actions.POP) return allKeys.indexOf(pendingLocation.key);
	
	    if (currentLocation) return allKeys.indexOf(currentLocation.key);
	
	    return -1;
	  };
	
	  var updateLocation = function updateLocation(nextLocation) {
	    var currentIndex = getCurrentIndex();
	
	    currentLocation = nextLocation;
	
	    if (currentLocation.action === _Actions.PUSH) {
	      allKeys = [].concat(allKeys.slice(0, currentIndex + 1), [currentLocation.key]);
	    } else if (currentLocation.action === _Actions.REPLACE) {
	      allKeys[currentIndex] = currentLocation.key;
	    }
	
	    listeners.forEach(function (listener) {
	      return listener(currentLocation);
	    });
	  };
	
	  var listenBefore = function listenBefore(listener) {
	    beforeListeners.push(listener);
	
	    return function () {
	      return beforeListeners = beforeListeners.filter(function (item) {
	        return item !== listener;
	      });
	    };
	  };
	
	  var listen = function listen(listener) {
	    listeners.push(listener);
	
	    return function () {
	      return listeners = listeners.filter(function (item) {
	        return item !== listener;
	      });
	    };
	  };
	
	  var confirmTransitionTo = function confirmTransitionTo(location, callback) {
	    (0, _AsyncUtils.loopAsync)(beforeListeners.length, function (index, next, done) {
	      (0, _runTransitionHook2.default)(beforeListeners[index], location, function (result) {
	        return result != null ? done(result) : next();
	      });
	    }, function (message) {
	      if (getUserConfirmation && typeof message === 'string') {
	        getUserConfirmation(message, function (ok) {
	          return callback(ok !== false);
	        });
	      } else {
	        callback(message !== false);
	      }
	    });
	  };
	
	  var transitionTo = function transitionTo(nextLocation) {
	    if (currentLocation && (0, _LocationUtils.locationsAreEqual)(currentLocation, nextLocation) || pendingLocation && (0, _LocationUtils.locationsAreEqual)(pendingLocation, nextLocation)) return; // Nothing to do
	
	    pendingLocation = nextLocation;
	
	    confirmTransitionTo(nextLocation, function (ok) {
	      if (pendingLocation !== nextLocation) return; // Transition was interrupted during confirmation
	
	      pendingLocation = null;
	
	      if (ok) {
	        // Treat PUSH to same path like REPLACE to be consistent with browsers
	        if (nextLocation.action === _Actions.PUSH) {
	          var prevPath = (0, _PathUtils.createPath)(currentLocation);
	          var nextPath = (0, _PathUtils.createPath)(nextLocation);
	
	          if (nextPath === prevPath && (0, _LocationUtils.statesAreEqual)(currentLocation.state, nextLocation.state)) nextLocation.action = _Actions.REPLACE;
	        }
	
	        if (nextLocation.action === _Actions.POP) {
	          updateLocation(nextLocation);
	        } else if (nextLocation.action === _Actions.PUSH) {
	          if (pushLocation(nextLocation) !== false) updateLocation(nextLocation);
	        } else if (nextLocation.action === _Actions.REPLACE) {
	          if (replaceLocation(nextLocation) !== false) updateLocation(nextLocation);
	        }
	      } else if (currentLocation && nextLocation.action === _Actions.POP) {
	        var prevIndex = allKeys.indexOf(currentLocation.key);
	        var nextIndex = allKeys.indexOf(nextLocation.key);
	
	        if (prevIndex !== -1 && nextIndex !== -1) go(prevIndex - nextIndex); // Restore the URL
	      }
	    });
	  };
	
	  var push = function push(input) {
	    return transitionTo(createLocation(input, _Actions.PUSH));
	  };
	
	  var replace = function replace(input) {
	    return transitionTo(createLocation(input, _Actions.REPLACE));
	  };
	
	  var goBack = function goBack() {
	    return go(-1);
	  };
	
	  var goForward = function goForward() {
	    return go(1);
	  };
	
	  var createKey = function createKey() {
	    return Math.random().toString(36).substr(2, keyLength || 6);
	  };
	
	  var createHref = function createHref(location) {
	    return (0, _PathUtils.createPath)(location);
	  };
	
	  var createLocation = function createLocation(location, action) {
	    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : createKey();
	    return (0, _LocationUtils.createLocation)(location, action, key);
	  };
	
	  return {
	    getCurrentLocation: getCurrentLocation,
	    listenBefore: listenBefore,
	    listen: listen,
	    transitionTo: transitionTo,
	    push: push,
	    replace: replace,
	    go: go,
	    goBack: goBack,
	    goForward: goForward,
	    createKey: createKey,
	    createPath: _PathUtils.createPath,
	    createHref: createHref,
	    createLocation: createLocation
	  };
	};
	
	exports.default = createHistory;

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var loopAsync = exports.loopAsync = function loopAsync(turns, work, callback) {
	  var currentTurn = 0,
	      isDone = false;
	  var isSync = false,
	      hasNext = false,
	      doneArgs = void 0;
	
	  var done = function done() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    isDone = true;
	
	    if (isSync) {
	      // Iterate instead of recursing if possible.
	      doneArgs = args;
	      return;
	    }
	
	    callback.apply(undefined, args);
	  };
	
	  var next = function next() {
	    if (isDone) return;
	
	    hasNext = true;
	
	    if (isSync) return; // Iterate instead of recursing if possible.
	
	    isSync = true;
	
	    while (!isDone && currentTurn < turns && hasNext) {
	      hasNext = false;
	      work(currentTurn++, next, done);
	    }
	
	    isSync = false;
	
	    if (isDone) {
	      // This means the loop finished synchronously.
	      callback.apply(undefined, doneArgs);
	      return;
	    }
	
	    if (currentTurn >= turns && hasNext) {
	      isDone = true;
	      callback();
	    }
	  };
	
	  next();
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = useRouterHistory;
	
	var _useQueries = __webpack_require__(34);
	
	var _useQueries2 = _interopRequireDefault(_useQueries);
	
	var _useBasename = __webpack_require__(41);
	
	var _useBasename2 = _interopRequireDefault(_useBasename);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function useRouterHistory(createHistory) {
	  return function (options) {
	    var history = (0, _useQueries2.default)((0, _useBasename2.default)(createHistory))(options);
	    return history;
	  };
	}
	module.exports = exports['default'];

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _RouterContext = __webpack_require__(19);
	
	var _RouterContext2 = _interopRequireDefault(_RouterContext);
	
	var _routerWarning = __webpack_require__(9);
	
	var _routerWarning2 = _interopRequireDefault(_routerWarning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  if (false) {
	    middlewares.forEach(function (middleware, index) {
	      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(middleware.renderRouterContext || middleware.renderRouteComponent, 'The middleware specified at index ' + index + ' does not appear to be ' + 'a valid React Router middleware.') : void 0;
	    });
	  }
	
	  var withContext = middlewares.map(function (middleware) {
	    return middleware.renderRouterContext;
	  }).filter(Boolean);
	  var withComponent = middlewares.map(function (middleware) {
	    return middleware.renderRouteComponent;
	  }).filter(Boolean);
	
	  var makeCreateElement = function makeCreateElement() {
	    var baseCreateElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _react.createElement;
	    return function (Component, props) {
	      return withComponent.reduceRight(function (previous, renderRouteComponent) {
	        return renderRouteComponent(previous, props);
	      }, baseCreateElement(Component, props));
	    };
	  };
	
	  return function (renderProps) {
	    return withContext.reduceRight(function (previous, renderRouterContext) {
	      return renderRouterContext(previous, renderProps);
	    }, _react2.default.createElement(_RouterContext2.default, _extends({}, renderProps, {
	      createElement: makeCreateElement(renderProps.createElement)
	    })));
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createBrowserHistory = __webpack_require__(48);
	
	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);
	
	var _createRouterHistory = __webpack_require__(54);
	
	var _createRouterHistory2 = _interopRequireDefault(_createRouterHistory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _createRouterHistory2.default)(_createBrowserHistory2.default);
	module.exports = exports['default'];

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _ExecutionEnvironment = __webpack_require__(49);
	
	var _BrowserProtocol = __webpack_require__(50);
	
	var BrowserProtocol = _interopRequireWildcard(_BrowserProtocol);
	
	var _RefreshProtocol = __webpack_require__(53);
	
	var RefreshProtocol = _interopRequireWildcard(_RefreshProtocol);
	
	var _DOMUtils = __webpack_require__(51);
	
	var _createHistory = __webpack_require__(43);
	
	var _createHistory2 = _interopRequireDefault(_createHistory);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Creates and returns a history object that uses HTML5's history API
	 * (pushState, replaceState, and the popstate event) to manage history.
	 * This is the recommended method of managing history in browsers because
	 * it provides the cleanest URLs.
	 *
	 * Note: In browsers that do not support the HTML5 history API full
	 * page reloads will be used to preserve clean URLs. You can force this
	 * behavior using { forceRefresh: true } in options.
	 */
	var createBrowserHistory = function createBrowserHistory() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  !_ExecutionEnvironment.canUseDOM ?  false ? (0, _invariant2.default)(false, 'Browser history needs a DOM') : (0, _invariant2.default)(false) : void 0;
	
	  var useRefresh = options.forceRefresh || !(0, _DOMUtils.supportsHistory)();
	  var Protocol = useRefresh ? RefreshProtocol : BrowserProtocol;
	
	  var getUserConfirmation = Protocol.getUserConfirmation,
	      getCurrentLocation = Protocol.getCurrentLocation,
	      pushLocation = Protocol.pushLocation,
	      replaceLocation = Protocol.replaceLocation,
	      go = Protocol.go;
	
	
	  var history = (0, _createHistory2.default)(_extends({
	    getUserConfirmation: getUserConfirmation }, options, {
	    getCurrentLocation: getCurrentLocation,
	    pushLocation: pushLocation,
	    replaceLocation: replaceLocation,
	    go: go
	  }));
	
	  var listenerCount = 0,
	      stopListener = void 0;
	
	  var startListener = function startListener(listener, before) {
	    if (++listenerCount === 1) stopListener = BrowserProtocol.startListener(history.transitionTo);
	
	    var unlisten = before ? history.listenBefore(listener) : history.listen(listener);
	
	    return function () {
	      unlisten();
	
	      if (--listenerCount === 0) stopListener();
	    };
	  };
	
	  var listenBefore = function listenBefore(listener) {
	    return startListener(listener, true);
	  };
	
	  var listen = function listen(listener) {
	    return startListener(listener, false);
	  };
	
	  return _extends({}, history, {
	    listenBefore: listenBefore,
	    listen: listen
	  });
	};
	
	exports.default = createBrowserHistory;

/***/ },
/* 49 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.go = exports.replaceLocation = exports.pushLocation = exports.startListener = exports.getUserConfirmation = exports.getCurrentLocation = undefined;
	
	var _LocationUtils = __webpack_require__(39);
	
	var _DOMUtils = __webpack_require__(51);
	
	var _DOMStateStorage = __webpack_require__(52);
	
	var _PathUtils = __webpack_require__(40);
	
	var _ExecutionEnvironment = __webpack_require__(49);
	
	var PopStateEvent = 'popstate';
	var HashChangeEvent = 'hashchange';
	
	var needsHashchangeListener = _ExecutionEnvironment.canUseDOM && !(0, _DOMUtils.supportsPopstateOnHashchange)();
	
	var _createLocation = function _createLocation(historyState) {
	  var key = historyState && historyState.key;
	
	  return (0, _LocationUtils.createLocation)({
	    pathname: window.location.pathname,
	    search: window.location.search,
	    hash: window.location.hash,
	    state: key ? (0, _DOMStateStorage.readState)(key) : undefined
	  }, undefined, key);
	};
	
	var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation() {
	  var historyState = void 0;
	  try {
	    historyState = window.history.state || {};
	  } catch (error) {
	    // IE 11 sometimes throws when accessing window.history.state
	    // See https://github.com/ReactTraining/history/pull/289
	    historyState = {};
	  }
	
	  return _createLocation(historyState);
	};
	
	var getUserConfirmation = exports.getUserConfirmation = function getUserConfirmation(message, callback) {
	  return callback(window.confirm(message));
	}; // eslint-disable-line no-alert
	
	var startListener = exports.startListener = function startListener(listener) {
	  var handlePopState = function handlePopState(event) {
	    if ((0, _DOMUtils.isExtraneousPopstateEvent)(event)) // Ignore extraneous popstate events in WebKit
	      return;
	    listener(_createLocation(event.state));
	  };
	
	  (0, _DOMUtils.addEventListener)(window, PopStateEvent, handlePopState);
	
	  var handleUnpoppedHashChange = function handleUnpoppedHashChange() {
	    return listener(getCurrentLocation());
	  };
	
	  if (needsHashchangeListener) {
	    (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleUnpoppedHashChange);
	  }
	
	  return function () {
	    (0, _DOMUtils.removeEventListener)(window, PopStateEvent, handlePopState);
	
	    if (needsHashchangeListener) {
	      (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleUnpoppedHashChange);
	    }
	  };
	};
	
	var updateLocation = function updateLocation(location, updateState) {
	  var state = location.state,
	      key = location.key;
	
	
	  if (state !== undefined) (0, _DOMStateStorage.saveState)(key, state);
	
	  updateState({ key: key }, (0, _PathUtils.createPath)(location));
	};
	
	var pushLocation = exports.pushLocation = function pushLocation(location) {
	  return updateLocation(location, function (state, path) {
	    return window.history.pushState(state, null, path);
	  });
	};
	
	var replaceLocation = exports.replaceLocation = function replaceLocation(location) {
	  return updateLocation(location, function (state, path) {
	    return window.history.replaceState(state, null, path);
	  });
	};
	
	var go = exports.go = function go(n) {
	  if (n) window.history.go(n);
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var addEventListener = exports.addEventListener = function addEventListener(node, event, listener) {
	  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
	};
	
	var removeEventListener = exports.removeEventListener = function removeEventListener(node, event, listener) {
	  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
	};
	
	/**
	 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
	 *
	 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
	 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
	 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
	 */
	var supportsHistory = exports.supportsHistory = function supportsHistory() {
	  var ua = window.navigator.userAgent;
	
	  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
	
	  return window.history && 'pushState' in window.history;
	};
	
	/**
	 * Returns false if using go(n) with hash history causes a full page reload.
	 */
	var supportsGoWithoutReloadUsingHash = exports.supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
	  return window.navigator.userAgent.indexOf('Firefox') === -1;
	};
	
	/**
	 * Returns true if browser fires popstate on hash change.
	 * IE10 and IE11 do not.
	 */
	var supportsPopstateOnHashchange = exports.supportsPopstateOnHashchange = function supportsPopstateOnHashchange() {
	  return window.navigator.userAgent.indexOf('Trident') === -1;
	};
	
	/**
	 * Returns true if a given popstate event is an extraneous WebKit event.
	 * Accounts for the fact that Chrome on iOS fires real popstate events
	 * containing undefined state when pressing the back button.
	 */
	var isExtraneousPopstateEvent = exports.isExtraneousPopstateEvent = function isExtraneousPopstateEvent(event) {
	  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.readState = exports.saveState = undefined;
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var QuotaExceededErrors = {
	  QuotaExceededError: true,
	  QUOTA_EXCEEDED_ERR: true
	};
	
	var SecurityErrors = {
	  SecurityError: true
	};
	
	var KeyPrefix = '@@History/';
	
	var createKey = function createKey(key) {
	  return KeyPrefix + key;
	};
	
	var saveState = exports.saveState = function saveState(key, state) {
	  if (!window.sessionStorage) {
	    // Session storage is not available or hidden.
	    // sessionStorage is undefined in Internet Explorer when served via file protocol.
	     false ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available') : void 0;
	
	    return;
	  }
	
	  try {
	    if (state == null) {
	      window.sessionStorage.removeItem(createKey(key));
	    } else {
	      window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
	    }
	  } catch (error) {
	    if (SecurityErrors[error.name]) {
	      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
	      // attempt to access window.sessionStorage.
	       false ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available due to security settings') : void 0;
	
	      return;
	    }
	
	    if (QuotaExceededErrors[error.name] && window.sessionStorage.length === 0) {
	      // Safari "private mode" throws QuotaExceededError.
	       false ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available in Safari private mode') : void 0;
	
	      return;
	    }
	
	    throw error;
	  }
	};
	
	var readState = exports.readState = function readState(key) {
	  var json = void 0;
	  try {
	    json = window.sessionStorage.getItem(createKey(key));
	  } catch (error) {
	    if (SecurityErrors[error.name]) {
	      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
	      // attempt to access window.sessionStorage.
	       false ? (0, _warning2.default)(false, '[history] Unable to read state; sessionStorage is not available due to security settings') : void 0;
	
	      return undefined;
	    }
	  }
	
	  if (json) {
	    try {
	      return JSON.parse(json);
	    } catch (error) {
	      // Ignore invalid JSON.
	    }
	  }
	
	  return undefined;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.replaceLocation = exports.pushLocation = exports.getCurrentLocation = exports.go = exports.getUserConfirmation = undefined;
	
	var _BrowserProtocol = __webpack_require__(50);
	
	Object.defineProperty(exports, 'getUserConfirmation', {
	  enumerable: true,
	  get: function get() {
	    return _BrowserProtocol.getUserConfirmation;
	  }
	});
	Object.defineProperty(exports, 'go', {
	  enumerable: true,
	  get: function get() {
	    return _BrowserProtocol.go;
	  }
	});
	
	var _LocationUtils = __webpack_require__(39);
	
	var _PathUtils = __webpack_require__(40);
	
	var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation() {
	  return (0, _LocationUtils.createLocation)(window.location);
	};
	
	var pushLocation = exports.pushLocation = function pushLocation(location) {
	  window.location.href = (0, _PathUtils.createPath)(location);
	  return false; // Don't update location
	};
	
	var replaceLocation = exports.replaceLocation = function replaceLocation(location) {
	  window.location.replace((0, _PathUtils.createPath)(location));
	  return false; // Don't update location
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	exports.default = function (createHistory) {
	  var history = void 0;
	  if (canUseDOM) history = (0, _useRouterHistory2.default)(createHistory)();
	  return history;
	};
	
	var _useRouterHistory = __webpack_require__(45);
	
	var _useRouterHistory2 = _interopRequireDefault(_useRouterHistory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
	
	module.exports = exports['default'];

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createHashHistory = __webpack_require__(56);
	
	var _createHashHistory2 = _interopRequireDefault(_createHashHistory);
	
	var _createRouterHistory = __webpack_require__(54);
	
	var _createRouterHistory2 = _interopRequireDefault(_createRouterHistory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _createRouterHistory2.default)(_createHashHistory2.default);
	module.exports = exports['default'];

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var _invariant = __webpack_require__(6);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	var _ExecutionEnvironment = __webpack_require__(49);
	
	var _DOMUtils = __webpack_require__(51);
	
	var _HashProtocol = __webpack_require__(57);
	
	var HashProtocol = _interopRequireWildcard(_HashProtocol);
	
	var _createHistory = __webpack_require__(43);
	
	var _createHistory2 = _interopRequireDefault(_createHistory);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var DefaultQueryKey = '_k';
	
	var addLeadingSlash = function addLeadingSlash(path) {
	  return path.charAt(0) === '/' ? path : '/' + path;
	};
	
	var HashPathCoders = {
	  hashbang: {
	    encodePath: function encodePath(path) {
	      return path.charAt(0) === '!' ? path : '!' + path;
	    },
	    decodePath: function decodePath(path) {
	      return path.charAt(0) === '!' ? path.substring(1) : path;
	    }
	  },
	  noslash: {
	    encodePath: function encodePath(path) {
	      return path.charAt(0) === '/' ? path.substring(1) : path;
	    },
	    decodePath: addLeadingSlash
	  },
	  slash: {
	    encodePath: addLeadingSlash,
	    decodePath: addLeadingSlash
	  }
	};
	
	var createHashHistory = function createHashHistory() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  !_ExecutionEnvironment.canUseDOM ?  false ? (0, _invariant2.default)(false, 'Hash history needs a DOM') : (0, _invariant2.default)(false) : void 0;
	
	  var queryKey = options.queryKey,
	      hashType = options.hashType;
	
	
	   false ? (0, _warning2.default)(queryKey !== false, 'Using { queryKey: false } no longer works. Instead, just don\'t ' + 'use location state if you don\'t want a key in your URL query string') : void 0;
	
	  if (typeof queryKey !== 'string') queryKey = DefaultQueryKey;
	
	  if (hashType == null) hashType = 'slash';
	
	  if (!(hashType in HashPathCoders)) {
	     false ? (0, _warning2.default)(false, 'Invalid hash type: %s', hashType) : void 0;
	
	    hashType = 'slash';
	  }
	
	  var pathCoder = HashPathCoders[hashType];
	
	  var getUserConfirmation = HashProtocol.getUserConfirmation;
	
	
	  var getCurrentLocation = function getCurrentLocation() {
	    return HashProtocol.getCurrentLocation(pathCoder, queryKey);
	  };
	
	  var pushLocation = function pushLocation(location) {
	    return HashProtocol.pushLocation(location, pathCoder, queryKey);
	  };
	
	  var replaceLocation = function replaceLocation(location) {
	    return HashProtocol.replaceLocation(location, pathCoder, queryKey);
	  };
	
	  var history = (0, _createHistory2.default)(_extends({
	    getUserConfirmation: getUserConfirmation }, options, {
	    getCurrentLocation: getCurrentLocation,
	    pushLocation: pushLocation,
	    replaceLocation: replaceLocation,
	    go: HashProtocol.go
	  }));
	
	  var listenerCount = 0,
	      stopListener = void 0;
	
	  var startListener = function startListener(listener, before) {
	    if (++listenerCount === 1) stopListener = HashProtocol.startListener(history.transitionTo, pathCoder, queryKey);
	
	    var unlisten = before ? history.listenBefore(listener) : history.listen(listener);
	
	    return function () {
	      unlisten();
	
	      if (--listenerCount === 0) stopListener();
	    };
	  };
	
	  var listenBefore = function listenBefore(listener) {
	    return startListener(listener, true);
	  };
	
	  var listen = function listen(listener) {
	    return startListener(listener, false);
	  };
	
	  var goIsSupportedWithoutReload = (0, _DOMUtils.supportsGoWithoutReloadUsingHash)();
	
	  var go = function go(n) {
	     false ? (0, _warning2.default)(goIsSupportedWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : void 0;
	
	    history.go(n);
	  };
	
	  var createHref = function createHref(path) {
	    return '#' + pathCoder.encodePath(history.createHref(path));
	  };
	
	  return _extends({}, history, {
	    listenBefore: listenBefore,
	    listen: listen,
	    go: go,
	    createHref: createHref
	  });
	};
	
	exports.default = createHashHistory;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.replaceLocation = exports.pushLocation = exports.startListener = exports.getCurrentLocation = exports.go = exports.getUserConfirmation = undefined;
	
	var _BrowserProtocol = __webpack_require__(50);
	
	Object.defineProperty(exports, 'getUserConfirmation', {
	  enumerable: true,
	  get: function get() {
	    return _BrowserProtocol.getUserConfirmation;
	  }
	});
	Object.defineProperty(exports, 'go', {
	  enumerable: true,
	  get: function get() {
	    return _BrowserProtocol.go;
	  }
	});
	
	var _warning = __webpack_require__(10);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var _LocationUtils = __webpack_require__(39);
	
	var _DOMUtils = __webpack_require__(51);
	
	var _DOMStateStorage = __webpack_require__(52);
	
	var _PathUtils = __webpack_require__(40);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var HashChangeEvent = 'hashchange';
	
	var getHashPath = function getHashPath() {
	  // We can't use window.location.hash here because it's not
	  // consistent across browsers - Firefox will pre-decode it!
	  var href = window.location.href;
	  var hashIndex = href.indexOf('#');
	  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
	};
	
	var pushHashPath = function pushHashPath(path) {
	  return window.location.hash = path;
	};
	
	var replaceHashPath = function replaceHashPath(path) {
	  var hashIndex = window.location.href.indexOf('#');
	
	  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
	};
	
	var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation(pathCoder, queryKey) {
	  var path = pathCoder.decodePath(getHashPath());
	  var key = (0, _PathUtils.getQueryStringValueFromPath)(path, queryKey);
	
	  var state = void 0;
	  if (key) {
	    path = (0, _PathUtils.stripQueryStringValueFromPath)(path, queryKey);
	    state = (0, _DOMStateStorage.readState)(key);
	  }
	
	  var init = (0, _PathUtils.parsePath)(path);
	  init.state = state;
	
	  return (0, _LocationUtils.createLocation)(init, undefined, key);
	};
	
	var prevLocation = void 0;
	
	var startListener = exports.startListener = function startListener(listener, pathCoder, queryKey) {
	  var handleHashChange = function handleHashChange() {
	    var path = getHashPath();
	    var encodedPath = pathCoder.encodePath(path);
	
	    if (path !== encodedPath) {
	      // Always be sure we have a properly-encoded hash.
	      replaceHashPath(encodedPath);
	    } else {
	      var currentLocation = getCurrentLocation(pathCoder, queryKey);
	
	      if (prevLocation && currentLocation.key && prevLocation.key === currentLocation.key) return; // Ignore extraneous hashchange events
	
	      prevLocation = currentLocation;
	
	      listener(currentLocation);
	    }
	  };
	
	  // Ensure the hash is encoded properly.
	  var path = getHashPath();
	  var encodedPath = pathCoder.encodePath(path);
	
	  if (path !== encodedPath) replaceHashPath(encodedPath);
	
	  (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleHashChange);
	
	  return function () {
	    return (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleHashChange);
	  };
	};
	
	var updateLocation = function updateLocation(location, pathCoder, queryKey, updateHash) {
	  var state = location.state,
	      key = location.key;
	
	
	  var path = pathCoder.encodePath((0, _PathUtils.createPath)(location));
	
	  if (state !== undefined) {
	    path = (0, _PathUtils.addQueryStringValueToPath)(path, queryKey, key);
	    (0, _DOMStateStorage.saveState)(key, state);
	  }
	
	  prevLocation = location;
	
	  updateHash(path);
	};
	
	var pushLocation = exports.pushLocation = function pushLocation(location, pathCoder, queryKey) {
	  return updateLocation(location, pathCoder, queryKey, function (path) {
	    if (getHashPath() !== path) {
	      pushHashPath(path);
	    } else {
	       false ? (0, _warning2.default)(false, 'You cannot PUSH the same path using hash history') : void 0;
	    }
	  });
	};
	
	var replaceLocation = exports.replaceLocation = function replaceLocation(location, pathCoder, queryKey) {
	  return updateLocation(location, pathCoder, queryKey, function (path) {
	    if (getHashPath() !== path) replaceHashPath(path);
	  });
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ajaxLite = __webpack_require__(59);
	
	var _ajaxLite2 = _interopRequireDefault(_ajaxLite);
	
	var _reactRouter = __webpack_require__(1);
	
	var _util = __webpack_require__(60);
	
	var _util2 = _interopRequireDefault(_util);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Bike = function (_React$Component) {
	  _inherits(Bike, _React$Component);
	
	  function Bike() {
	    _classCallCheck(this, Bike);
	
	    var _this = _possibleConstructorReturn(this, (Bike.__proto__ || Object.getPrototypeOf(Bike)).call(this));
	
	    _this.callapp = _this.callapp.bind(_this);
	    _this.clickmore1 = _this.clickmore1.bind(_this);
	    _this.clickmore2 = _this.clickmore2.bind(_this);
	    return _this;
	  }
	
	  _createClass(Bike, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.clickLog({ actiontype: 'SEM31-VIEW1' });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {}
	  }, {
	    key: 'clickLog',
	    value: function clickLog(obj) {
	      var urlstr = 'https://lego.58.com/page/mark?pagetype=ZHUANZHUANM&appid=ZHUANZHUAN&';
	
	      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || !obj) {
	        //传入参数为object null undefined时
	        var actionflag = false; //判断是否需要自动补全actiontype的标识
	        Object.keys(obj).forEach(function (key) {
	          urlstr += key + '=' + obj[key] + '&';
	          if (key === 'actiontype') {
	            actionflag = true;
	          }
	        });
	        if (!actionflag) {
	          console.log('请传入actiontype字段');
	        }
	      } else if (typeof obj === 'string') {
	        //传入string时默认为actiontype属性
	        urlstr += 'actiontype=' + obj + '&';
	      }
	
	      _ajaxLite2.default.get({ url: urlstr + 'callback=?' });
	    }
	  }, {
	    key: 'callapp',
	    value: function callapp(event) {
	
	      this.clickLog({ actiontype: 'SEM31-BUTTONCLICK1' });
	    }
	  }, {
	    key: 'clickmore1',
	    value: function clickmore1() {
	      _reactRouter.hashHistory.push('/one');
	    }
	  }, {
	    key: 'clickmore2',
	    value: function clickmore2() {
	      _reactRouter.hashHistory.push('/bosom');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'main' },
	        React.createElement(
	          'div',
	          { className: 'bike-1' },
	          React.createElement('span', { className: 'more1', onClick: this.clickmore1 }),
	          React.createElement('span', { className: 'more2', onClick: this.clickmore2 }),
	          React.createElement('span', { className: 'down1', onClick: this.callapp }),
	          React.createElement('span', { className: 'down2', onClick: this.callapp })
	        )
	      );
	    }
	  }]);
	
	  return Bike;
	}(React.Component);
	
	exports.default = Bike;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else {
			var a = factory();
			for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
		}
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId]) {
	/******/ 			return installedModules[moduleId].exports;
	/******/ 		}
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			i: moduleId,
	/******/ 			l: false,
	/******/ 			exports: {}
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.l = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// identity function for calling harmony imports with the correct context
	/******/ 	__webpack_require__.i = function(value) { return value; };
	/******/
	/******/ 	// define getter function for harmony exports
	/******/ 	__webpack_require__.d = function(exports, name, getter) {
	/******/ 		if(!__webpack_require__.o(exports, name)) {
	/******/ 			Object.defineProperty(exports, name, {
	/******/ 				configurable: false,
	/******/ 				enumerable: true,
	/******/ 				get: getter
	/******/ 			});
	/******/ 		}
	/******/ 	};
	/******/
	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__webpack_require__.n = function(module) {
	/******/ 		var getter = module && module.__esModule ?
	/******/ 			function getDefault() { return module['default']; } :
	/******/ 			function getModuleExports() { return module; };
	/******/ 		__webpack_require__.d(getter, 'a', getter);
	/******/ 		return getter;
	/******/ 	};
	/******/
	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = 1);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Created by wumingli on 2016/12/26.
	 */
	/* global window FormData document alert */
	/* eslint no-alert:0 */
	
	function xhr(config) {
	  var _config$async = config.async,
	      async = _config$async === undefined ? true : _config$async,
	      data = config.data,
	      success = config.success,
	      error = config.error,
	      _config$cache = config.cache,
	      cache = _config$cache === undefined ? true : _config$cache;
	  var _config$type = config.type,
	      type = _config$type === undefined ? 'GET' : _config$type,
	      url = config.url;
	
	  type = type.toUpperCase();
	  var xmlHttp = new window.XMLHttpRequest();
	  //超时时间限制
	  xmlHttp.timeout = config.timeout || 3000;
	
	  xmlHttp.onreadystatechange = function () {
	    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
	      if (success) {
	        if (typeof xmlHttp.responseText === 'string') {
	          if (type === 'JSONP' && config.callback) {
	            var reg = new RegExp('(' + config.callback + ')\\(({.*})(\\))', 'm');
	            reg.test(xmlHttp.responseText);
	            var content = xmlHttp.responseText.replace(reg, '$2');
	            success(JSON.parse(content));
	          } else {
	            var response = JSON.parse(xmlHttp.responseText);
	            if (type === 'JSONP' && undefined === config.callback) {
	              response = 'callback(' + response + ')';
	            }
	            success(response);
	          }
	        } else if (_typeof(xmlHttp.responseText) === 'object') {
	          success(xmlHttp.responseText);
	        }
	      }
	    }
	  };
	
	  xmlHttp.onloadend = function (args) {
	    if (args.currentTarget.status !== 200 && error) {
	      error(xmlHttp);
	    }
	  };
	
	  var reqStr = '';
	  //参数处理
	  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
	    Object.keys(data).forEach(function (key) {
	      reqStr += '&' + key + '=' + data[key];
	    });
	  }
	  if (reqStr !== '' && reqStr.indexOf('?') === 1) {
	    reqStr = reqStr.substring(1);
	  }
	  if (!cache) {
	    reqStr += (reqStr === '' ? '' : '&') + '_=' + new Date().getTime();
	  }
	
	  if (type === 'POST') {
	    if (reqStr.charAt(0) === '&') {
	      reqStr = reqStr.substr(1);
	    }
	    xmlHttp.open(type, url, async);
	    //带cookie
	    xmlHttp.withCredentials = true;
	    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	    xmlHttp.send(reqStr);
	    //alert(reqStr);
	  } else {
	    if (url.indexOf('?') > 0) {
	      url += reqStr;
	    } else if (reqStr !== '') {
	      url += '?' + reqStr.substring(1, reqStr.length);
	    }
	    if (type === 'JSONP' && config.callback) {
	      url += (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + config.callback;
	    }
	    //console.log(url);
	    xmlHttp.open(type, url, async);
	    //带cookie
	    xmlHttp.withCredentials = true;
	    xmlHttp.send();
	  }
	}
	
	var Ajax = function () {
	  function Ajax() {
	    _classCallCheck(this, Ajax);
	  }
	
	  _createClass(Ajax, [{
	    key: 'ajax',
	    value: function ajax(cfg) {
	      var url = cfg.url;
	      if (!url) {
	        throw new Error('no request url received, please check you config.');
	      }
	      if (cfg.type && cfg.type.toUpperCase() === 'JSONP') {
	        this.jsonp(cfg);
	        return;
	      }
	      xhr(cfg);
	    }
	  }, {
	    key: 'jsonp',
	    value: function jsonp(cfg) {
	      var config = cfg;
	      config.type = 'JSONP';
	      config.callback = config.callback || '_react_callback_' + Math.random().toString(16).substring(2);
	      var reqStr = '';
	      //参数处理
	      if (_typeof(config.data) === 'object') {
	        Object.keys(config.data).forEach(function (key) {
	          reqStr += '&' + key + '=' + config.data[key];
	        });
	      }
	      if (reqStr.charAt(0) === '?' || reqStr.charAt(0) === '&') {
	        reqStr = reqStr.substring(1);
	      }
	      if (!config.cache) {
	        reqStr += '&_=' + new Date().getTime();
	      }
	      window[config.callback] = function (data) {
	        if (config.success) {
	          config.success(data);
	        }
	      };
	      var script = document.createElement('script');
	      var url = cfg.url;
	
	      script.src = '' + url + (url.indexOf('?') === -1 ? '?' : '&') + '\n' + (reqStr === '' ? '' : reqStr) + '&callback=' + config.callback;
	
	      document.body.appendChild(script);
	      //document.body.removeChild(script);
	
	      script.onerror = function () {
	        if (config.error) {
	          config.error();
	        }
	      };
	
	      //this.ajax(config);
	    }
	  }, {
	    key: 'get',
	    value: function get(cfg) {
	      var config = cfg;
	      config.type = 'GET';
	      this.ajax(config);
	    }
	  }, {
	    key: 'post',
	    value: function post(cfg) {
	      var config = cfg;
	      config.type = 'POST';
	      this.ajax(config);
	    }
	  }]);
	
	  return Ajax;
	}();
	
	exports.default = new Ajax();
	
	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {
	
	module.exports = __webpack_require__(0);
	
	
	/***/ })
	/******/ ]);
	});

/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*eslint prefer-template: 0, prefer-rest-params: 0 */
	/**
	 * Created by wumingli on 2017/1/10.
	 */
	var cache = {};
	var ZZUTIL = {
	  doMake: function doMake(originUrl, width, height) {
	    var url = originUrl;
	    if (url.indexOf('?') > -1) {
	      url = url.substr(0, url.indexOf('?'));
	    }
	    if (width && height) {
	      return url + '?w=' + width + '&h=' + height;
	    } else if (width && !height) {
	      return url + '?w=' + width;
	    }
	    return url + '?h=' + height;
	  },
	
	  setPicSize: function setPicSize(url) {
	    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
	    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
	
	    if (!url) {
	      return '';
	    }
	    var handelUrl = url;
	    var innerUrl = '';
	
	    var re = /^(http:)/;
	    if (re.test(url)) {
	      handelUrl = handelUrl.replace(re, 'https:');
	    }
	
	    //微信头像
	    if (handelUrl.indexOf('https://wx.qlogo.cn') > -1 || handelUrl.indexOf('http://wx.qlogo.cn') > -1) {
	      var index = handelUrl.lastIndexOf('/');
	      return handelUrl.substr(0, index) + '/96';
	    } else if (handelUrl.indexOf('https://pic') > -1) {
	      //pic的图片
	      //已经有_100_100的尺寸设置
	      var matchRule = /_\d+_\d+(\.png$|\.jpg$|\.gif$|\.jpeg$|\.bmp$|\.pic$)/i;
	      if (matchRule.test(handelUrl)) {
	        var bott = matchRule.exec(handelUrl)[0];
	        var dot = bott.lastIndexOf('.');
	        var suf = bott.substr(dot, bott.length - 1);
	        var reg = new RegExp(bott);
	        innerUrl = handelUrl.replace(reg, '') + suf;
	      } else {
	        innerUrl = handelUrl;
	      }
	      return ZZUTIL.doMake(innerUrl, width, height);
	    } else if (!(handelUrl.indexOf('https') > -1)) {
	      //没有协议的图片
	      var key = /^\//g.test(handelUrl.trim()) ? handelUrl.substr(1) : handelUrl;
	      var random = void 0;
	      if (cache[key]) {
	        random = cache[key];
	      } else {
	        random = cache[key] = Math.ceil(Math.random() * 8);
	      }
	      innerUrl = 'https://pic' + random + '.58cdn.com.cn/zhuanzh/' + key;
	      return ZZUTIL.doMake(innerUrl, width, height);
	    } else if (handelUrl.indexOf('https://zzpic') > -1) {
	      //其他
	      return ZZUTIL.doMake(handelUrl, width, height);
	    }
	    return handelUrl;
	  },
	  cookie: {
	    get: function get(name, encode) {
	      var arg = name + '=';
	      var alen = arg.length;
	      var clen = document.cookie.length;
	      var i = 0;
	      var j = 0;
	      while (i < clen) {
	        j = i + alen;
	        if (document.cookie.substring(i, j) === arg) {
	          return this.getCookieVal(j, encode);
	        }
	        i = document.cookie.indexOf(' ', i) + 1;
	        if (i === 0) {
	          break;
	        }
	      }
	      return null;
	    },
	    getname: function getname(cookieName, name) {
	      var cookieVal = this.get(cookieName);
	      var regex = new RegExp('[?&]' + encodeURIComponent(name) + '\\=([^&#]+)');
	      var value = (cookieVal.match(regex) || ['', ''])[1];
	      return decodeURIComponent(value);
	    },
	    set: function set(name, value) {
	      var argv = arguments;
	      var argc = arguments.length;
	      var now = new Date();
	      var expires = argc > 2 ? argv[2] : new Date(now.getFullYear(), now.getMonth() + 1, now.getUTCDate());
	      var path = argc > 3 ? argv[3] : '/';
	      var domain = argc > 4 ? argv[4] : '.58.com';
	      var secure = argc > 5 ? argv[5] : false;
	
	      document.cookie = name + '=' + escape(value) + (expires === null ? '' : '; expires=' + expires.toGMTString()) + (path === null ? '' : '; path=' + path) + (domain === null ? '' : '; domain=' + domain) + (secure === true ? '; secure' : '');
	    },
	    remove: function remove(name) {
	      if (this.get(name)) {
	        this.set(name, '', new Date(1970, 1, 1));
	      }
	    },
	    getCookieVal: function getCookieVal(offset, encode) {
	      var endstr = document.cookie.indexOf(';', offset);
	      if (endstr === -1) {
	        endstr = document.cookie.length;
	      }
	      if (encode) {
	        return unescape(document.cookie.substring(offset, endstr));
	      }
	      return document.cookie.substring(offset, endstr);
	    }
	  }
	};
	
	window.ZZUTIL = ZZUTIL;
	
	exports.default = ZZUTIL;

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	                value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var one = function (_React$Component) {
	                _inherits(one, _React$Component);
	
	                function one() {
	                                _classCallCheck(this, one);
	
	                                var _this = _possibleConstructorReturn(this, (one.__proto__ || Object.getPrototypeOf(one)).call(this));
	
	                                _this.callapp = _this.callapp.bind(_this);
	                                return _this;
	                }
	
	                _createClass(one, [{
	                                key: 'componentWillMount',
	                                value: function componentWillMount() {
	                                                this.clickLog({ actiontype: 'SEM30-VIEW1' });
	                                }
	                }, {
	                                key: 'componentDidMount',
	                                value: function componentDidMount() {}
	                }, {
	                                key: 'clickLog',
	                                value: function clickLog(obj) {
	                                                var urlstr = 'https://lego.58.com/page/mark?pagetype=ZHUANZHUANM&appid=ZHUANZHUAN';
	
	                                                if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || !obj) {
	                                                                //传入参数为object null undefined时
	                                                                var actionflag = false; //判断是否需要自动补全actiontype的标识
	                                                                Object.keys(obj).forEach(function (key) {
	                                                                                urlstr += key + '=' + obj[key] + '&';
	                                                                                if (key === 'actiontype') {
	                                                                                                actionflag = true;
	                                                                                }
	                                                                });
	                                                                if (!actionflag) {
	                                                                                console.log('请传入actiontype字段');
	                                                                }
	                                                } else if (typeof obj === 'string') {
	                                                                //传入string时默认为actiontype属性
	                                                                urlstr += 'actiontype=' + obj + '&';
	                                                }
	
	                                                $.get({ url: urlstr + 'callback=?' });
	                                }
	                }, {
	                                key: 'callapp',
	                                value: function callapp(event) {
	                                                this.clickLog({ actiontype: 'SEM30-BUTTONCLICK1' });
	
	                                                // if (event) {
	                                                //   if (event.target.className.indexOf('down') !== -1) {
	                                                //     this.clickLog({ actiontype: 'SEM30-BUTTONCLICK1' });
	                                                //   } else {
	                                                //     this.clickLog({ actiontype: 'SEM30-BANNERCLICK' });
	                                                //   }
	                                                // }
	                                }
	                }, {
	                                key: 'clickback',
	                                value: function clickback() {
	                                                window.history.go(-1);
	                                }
	                }, {
	                                key: 'render',
	                                value: function render() {
	                                                return React.createElement(
	                                                                'div',
	                                                                { className: 'main' },
	                                                                React.createElement(
	                                                                                'div',
	                                                                                { className: 'phone-1' },
	                                                                                React.createElement('span', { className: 'back', onClick: this.clickback }),
	                                                                                React.createElement('span', { className: 'down', onClick: this.callapp }),
	                                                                                React.createElement(
	                                                                                                'div',
	                                                                                                { className: 'box' },
	                                                                                                React.createElement(
	                                                                                                                'div',
	                                                                                                                { className: 'box1' },
	                                                                                                                React.createElement(
	                                                                                                                                'p',
	                                                                                                                                { className: 'title' },
	                                                                                                                                '\u6211\u4E3A\u4EC0\u4E48\u559C\u6B22\u4EA4\u201C\u4E00\u6B21\u6027\u670B\u53CB\u201D'
	                                                                                                                ),
	                                                                                                                React.createElement(
	                                                                                                                                'p',
	                                                                                                                                { className: 'author' },
	                                                                                                                                '\u738B\u5DE6\u4E2D\u53F3'
	                                                                                                                ),
	                                                                                                                '\u201C\u56DA\u201D\uFF0C\u4E00\u4E2A\u5178\u578B\u7684\u4F1A\u610F\u5B57\u3002\u4E00\u4E2A\u4EBA\uFF0C\u88AB\u56F0\u5728\u4E00\u4E2A\u56DB\u56DB\u65B9\u65B9\u7684\u5C01\u95ED\u7A7A\u95F4\u91CC\uFF0C\u6CA1\u4E86\u81EA\u7531\u3002 \u4F46\u5355\u5355\u628A\u5916\u9762\u8FD9\u56DB\u56DB\u65B9\u65B9\u7684\u683C\u5B50\uFF0C\u7406\u89E3\u6210\u7A7A\u95F4\uFF0C\u7406\u89E3\u6210\u7262\u623F\uFF0C\u5176\u5B9E\u662F\u5C0F\u770B\u4E86\u4E16\u754C\u3002 \u56DB\u5468\u4E00\u5708\uFF0C\u4E0D\u662F\u53EA\u6709\u7262\u623F\u8FD9\u6837\uFF0C\u5B83\u8FD8\u53EF\u80FD\u662F\u4E2A\u201C\u53E3\u201D\u3002 \u53E3\uFF0C\u5C31\u662F\u5634\u3002\u5F88\u591A\u65F6\u5019\uFF0C\u6D3B\u5728\u201C\u53E3\u201D\u91CC\uFF0C\u4E5F\u76F8\u5F53\u4E8E\u88AB\u56DA\u7981\u4E86\u3002 \u8FD9\u4E2A\u201C\u53E3\u201D\uFF0C\u53EF\u80FD\u662F\u522B\u4EBA\u5BF9\u4F60\u7684\u8BC4\u4EF7\uFF0C\u53EF\u80FD\u662F\u4F60\u81EA\u5DF1\u52FE\u52D2\u7684\u81EA\u753B\u50CF\u3002 \u8FD9\u4E24\u79CD\u4E1C\u897F\u5408\u8D77\u6765\uFF0C\u53EB\u505A\u201C\u4EBA\u8BBE\u201D\u3002 \u6BCF\u4E2A\u4EBA\u90FD\u4F1A\u88AB\u81EA\u5DF1\u7684\u4EBA\u8BBE\u7981\u9522\uFF0C\u4F60\u6253\u4E0D\u7834\u5B83\uFF0C\u4E5F\u4E0D\u6562\u6253\u7834\uFF0C\u56E0\u4E3A\u4F60\u60F3\u7EF4\u6301\u4F60\u7684\u4EBA\u8BBE\u3002',
	                                                                                                                React.createElement('br', null),
	                                                                                                                '1 \u6211\u662F\u4E2A\u5199\u5B57\u7684\u4EBA\u3002\u4E00\u5929\u7684\u5DE5\u4F5C\uFF0C\u65E0\u975E\u662F\u548C\u5BA2\u6237\u8C08\u4E1A\u52A1\uFF0C\u4E0E\u540C\u4E8B\u804A\u9009\u9898\uFF0C\u6211\u4E0D\u7F3A\u53EF\u4EE5\u8BF4\u8BDD\u7684\u4EBA\u3002 \u4F46\u6709\u65F6\u5FC3\u91CC\u6CE2\u6D9B\u4E91\u6D8C\uFF0C\u7FFB\u904D\u624B\u673A\u901A\u8BAF\u5F55\uFF0C\u8FD9\u4E2A\u662F\u7238\u5988\u7684\u53F7\u7801\uFF0C\u8FD9\u4E2A\u662F\u8001\u5A46\u7684\uFF0C\u8FD9\u4E2A\u662F\u540C\u4E8B\u7684\uFF0C\u8FD9\u4E2A\u662F\u524D\u5973\u53CB\u7684\uFF0C\u8FD9\u4E2A\u662F\u524D\u524D\u5973\u53CB\u7684\uFF0C\u8FD9\u4E2A\u662F\u524D\u524D\u524D\u5973\u53CB\u7684\uFF0C\u8FD9\u4E2A\u662F\u8C01\u7684\u5DF2\u7ECF\u8BB0\u4E0D\u5F97\u4E86\uFF0C\u51E0\u767E\u4E2A\u4EBA\uFF0C\u5374\u627E\u4E0D\u5230\u4E00\u4E2A\u53EF\u4EE5\u8BB2\u7684\u3002 \u6709\u670B\u53CB\u4F1A\u8BF4\uFF0C\u6709\u4E00\u4E2A\u4E1C\u897F\uFF0C\u53EB\u670B\u53CB\u5708\u3002 \u611F\u8C22\u8FD9\u4F4D\u670B\u53CB\u4E3A\u6211\u666E\u53CA\u4E92\u8054\u7F51\u3002\u4F46\u53EF\u60DC\uFF0C\u670B\u53CB\u5708\uFF0C\u65E9\u5C31\u4E0D\u662F\u4E00\u4E2A\u53EF\u4EE5\u81EA\u8BF4\u81EA\u8BDD\u7684\u5730\u65B9\u3002 \u670B\u53CB\u5708\u6709\u4E2A\u201C\u5206\u7EC4\u53EF\u89C1\u201D\u7684\u529F\u80FD\uFF08\u4F60\u770B\uFF0C\u6211\u5176\u5B9E\u8FD8\u662F\u633A\u719F\u6089\u4E92\u8054\u7F51\u4EA7\u54C1\u7684\uFF09\u3002\u4ED4\u7EC6\u60F3\u60F3\uFF0C\u201C\u5206\u7EC4\u53EF\u89C1\u201D\u7A76\u7ADF\u5728\u9632\u5907\u8C01\uFF1F \u4E0D\u662F\u4ECE\u672A\u76F8\u89C1\u7684\u964C\u751F\u4EBA\u5427\uFF0C\u4ED6\u4EEC\u4E0D\u8BA4\u8BC6\u4F60\uFF1B\u4E5F\u4E0D\u662F\u6CDB\u6CDB\u4E4B\u4EA4\u5427\uFF0C\u4ED6\u4EEC\u624D\u61D2\u5F97\u7406\u4F60\u3002 \u4E8B\u5B9E\u4E0A\uFF0C\u6211\u4EEC\u9632\u5907\u7684\uFF0C\u5927\u591A\u662F\u4F60\u7684\u719F\u4EBA\u3002',
	                                                                                                                React.createElement('br', null),
	                                                                                                                '2 \u524D\u6BB5\u65F6\u95F4\u548C\u4E00\u4E2A\u670B\u53CB\u559D\u9152\uFF0C\u4ED6\u53EB\u4E8C\u5F20\uFF0C\u662F\u4E2A\u4E1C\u5317\u7237\u4EEC\uFF0C\u6709\u5BB6\u81EA\u5DF1\u7684\u5E7F\u544A\u516C\u53F8\u3002\u804A\u8D77\u8FD1\u51B5\uFF0C\u4ED6\u8BF4\u4ED6\u6700\u8FD1\u5728\u5F00\u6EF4\u6EF4\u987A\u98CE\u8F66\u3002 \u6211\u633A\u7EB3\u95F7\uFF0C\u4F60\u597D\u6B79\u4E5F\u8EAB\u5BB6\u51E0\u5343\u4E07\uFF0C\u7F3A\u8FD9\u70B9\u6CB9\u94B1\u5417\uFF1F\u5B9E\u5728\u4E0D\u884C\u6211\u53EF\u4EE5\u7D27\u63E1\u6211\u7684\u5C0F\u62F3\u62F3\u7ED9\u4F60\u52A0\u6CB9\u554A\u3002 \u4E8C\u5F20\u8BF4\u6700\u8FD1\u5929\u51B7\u4F60\u5C11\u8BF4\u70B9\u8FD9\u6837\u7684\u7B11\u8BDD\uFF0C\u7136\u540E\u559D\u4E86\u4E00\u53E3\u9152\uFF0C\u53F9\u4E86\u4E00\u53E3\u6C14\uFF0C\u5E7D\u5E7D\u5730\u8BF4\uFF1A\u56E0\u4E3A\u8FD9\u6837\uFF0C\u53EF\u4EE5\u548C\u4EBA\u8BF4\u8BF4\u5FC3\u91CC\u8BDD\u3002\u4F60\u77E5\u9053\uFF0C\u6709\u4E9B\u8BDD\u548C\u719F\u4EBA\u662F\u6CA1\u6CD5\u8BB2\u3002 \u4E5F\u8BB8\u662F\u6015\u6211\u8BEF\u4F1A\uFF0C\u4E8C\u5F20\u8FDE\u5FD9\u8BF4\u4ED6\u559D\u9189\u4E86\u3002 \u6211\u7406\u89E3\u4ED6\u7684\u610F\u601D\u3002\u867D\u7136\u8FD9\u8BDD\u4ECE\u670B\u53CB\u5634\u4E2D\u8BF4\u51FA\u6765\uFF0C\u611F\u89C9\u6BD4\u9152\u684C\u4E0A\u7684\u602A\u5473\u8C46\u8FD8\u602A\u3002 \u793E\u4EA4\u6CD5\u5219\u91CC\u6709\u53E5\u8001\u8BDD\u53EB\u201C\u5207\u83AB\u4EA4\u6D45\u8A00\u6DF1\u201D\uFF1A\u5173\u7CFB\u4E0D\u5230\u4F4D\uFF0C\u6709\u4E9B\u8BDD\u662F\u4E0D\u80FD\u8BB2\u7684\u3002\u4F46\u5173\u7CFB\u5230\u4F4D\u4E86\uFF0C\u6709\u4E9B\u8BDD\u66F4\u4E0D\u80FD\u8BB2\u3002 \u8BB2\u4F24\u5FC3\u4E8B\uFF0C\u5BB3\u6015\u5BF9\u65B9\u8FC7\u751A\u7684\u5173\u6000\uFF0C\u4E5F\u5BB3\u6015\u5BF9\u65B9\u89C9\u5F97\u81EA\u5DF1\u592A\u8D1F\u80FD\u91CF\uFF1B\u8BB2\u6210\u529F\u4E8B\uFF0C\u5BB3\u6015\u7ED9\u5BF9\u65B9\u538B\u529B\uFF0C\u8FD8\u5BB3\u6015\u5BF9\u65B9\u89C9\u5F97\u81EA\u5DF1\u88C5\u903C\uFF1B\u8BB2\u5FC3\u91CC\u4E8B\uFF0C\u6709\u65F6\u53C8\u5BB3\u6015\u81EA\u5DF1\u4E00\u4E9B\u60F3\u6CD5\u5947\u602A\u2026\u2026 \u5F52\u6839\u5230\u5E95\uFF0C\u662F\u5BB3\u6015\u8BF4\u51FA\u6765\u540E\u5BF9\u65B9\u5FC3\u91CC\u4F1A\u60F3\uFF1A\u201C\u539F\u6765\u4F60\u662F\u8FD9\u6837\u7684\u4EBA\u201D\u3002 \u8FD9\u53E5\u8BDD\u4E00\u51FA\u6765\uFF0C\u597D\u4E86\uFF0C\u5C31\u610F\u5473\u7740\u4F60\u8F9B\u82E6\u7EF4\u62A4\u7684\u4EBA\u8BBE\u5D29\u584C\u4E86\u3002',
	                                                                                                                React.createElement('br', null),
	                                                                                                                '3 \u9152\u8FC7\u4E09\u5DE1\uFF0C\u4E8C\u5F20\u7ED9\u6211\u8BB2\u4E86\u4E2A\u5C0F\u6545\u4E8B\u3002 \u4ED6\u7B2C\u4E00\u6B21\u5F00\u987A\u98CE\u8F66\u662F\u4E2A\u6DF1\u591C\uFF0C\u63A5\u5230\u4E00\u5BF9\u4ECE\u65B0\u5929\u5730\u5230\u63D0\u7BEE\u6865\u7684\u60C5\u4FA3\u3002\u4E8C\u4EBA\u770B\u6837\u5B50\u5E74\u7EAA\u4E5F\u4E0D\u5C0F\uFF0C\u542C\u53E3\u97F3\u4E5F\u4E0D\u662F\u672C\u5730\u4EBA\u3002 \u4E0A\u8F66\u4E4B\u540E\uFF0C\u4E8C\u4EBA\u4F3C\u4E4E\u4E0D\u62FF\u4E8C\u5F20\u5F53\u5916\u4EBA\uFF0C\u4ECE\u5DE5\u4F5C\u538B\u529B\u804A\u5230\u7ED3\u5A5A\uFF0C\u804A\u5A5A\u623F\u5E03\u7F6E\u871C\u6708\u8BA1\u5212\uFF0C\u804A\u660E\u5929\u548C\u672A\u6765\u3002\u9047\u5230\u4E89\u6267\uFF0C\u5973\u5B69\u8FD8\u95EE\u8D77\u4ED6\u7684\u770B\u6CD5\u3002 \u4E8C\u5F20\u8BF4\uFF0C\u90A3\u65F6\u5019\uFF0C\u4ED6\u5B8C\u5168\u5FD8\u4E86\u81EA\u5DF1\u5728\u5458\u5DE5\u9762\u524D\u4E0D\u82DF\u8A00\u7B11\u6C89\u9ED8\u662F\u91D1\u7684\u6837\u5B50\uFF0C\u53E3\u82E5\u60AC\u6CB3\u8086\u65E0\u5FCC\u60EE\u5730\u8868\u8FBE\u8D77\u4ED6\u7684\u770B\u6CD5\u6765\uFF0C\u4E00\u4E9B\u89C2\u70B9\u751A\u81F3\u6709\u4E9B\u504F\u6FC0\u3002 \u6709\u4E9B\u8BDD\u8BF4\u51FA\u6765\u4ED6\u81EA\u5DF1\u90FD\u5413\u4E00\u8DF3\uFF0C\u53D1\u73B0\u539F\u6765\u81EA\u5DF1\u5FC3\u5E95\u91CC\u6700\u771F\u5B9E\u7684\u60F3\u6CD5\u662F\u8FD9\u6837\uFF0C\u800C\u5E73\u65F6\u5374\u4ECE\u6765\u6CA1\u6562\u8BF4\u51FA\u6765\uFF0C\u751A\u81F3\u81EA\u5DF1\u90FD\u6CA1\u6709\u610F\u8BC6\u5230\u81EA\u5DF1\u7684\u201C\u6CA1\u6562\u201D\u3002 \u4F46\u8FD9\u4E9B\u76F4\u6292\u80F8\u81C6\u7684\u60F3\u6CD5\u663E\u7136\u8D62\u5F97\u4E86\u4E8C\u4EBA\u7684\u4FE1\u4EFB\uFF0C\u751A\u81F3\u8BA9\u4ED6\u4EEC\u611F\u89C9\u63A5\u53D7\u4E86\u601D\u7EF4\u7684\u6D17\u793C\u3002 \u4E34\u4E0B\u8F66\u7684\u65F6\u5019\uFF0C\u59D1\u5A18\u8BA9\u4E8C\u5F20\u7B49\u7B49\uFF0C\u628A\u521A\u4E70\u7684\u5BB5\u591C\u7559\u4E86\u7ED9\u4ED6\uFF0C\u8BF4\uFF0C\u8C22\u8C22\u3002 \u4E8C\u5F20\u544A\u8BC9\u6211\uFF0C\u5BB5\u591C\u5176\u5B9E\u6709\u70B9\u51C9\u4E86\uFF0C\u4F46\u5FC3\u91CC\u5374\u89C9\u5F97\u6696\u3001\u8212\u7545\u3002\u5C31\u8FD9\u6837\uFF0C\u4ED6\u8FF7\u4E0A\u4E86\u987A\u98CE\u8F66\u3002 \u8BF4\u8FD9\u4E9B\u7684\u65F6\u5019\uFF0C\u9152\u5427\u91CC\u706F\u5149\u660F\u6697\uFF0C\u4F46\u6211\u80FD\u770B\u5230\u4E8C\u5F20\u773C\u91CC\u7684\u5149\u3002',
	                                                                                                                React.createElement('br', null),
	                                                                                                                '4 \u7A81\u7136\u60F3\u8D77\u5341\u591A\u5E74\u524D\uFF0C\u5728\u53BB\u897F\u5B89\u4E0A\u5B66\u7684\u7EFF\u76AE\u706B\u8F66\u4E0A\uFF0C\u4E00\u6B21\u5076\u7136\u7684\u8273\u9047\u3002 \u5E73\u65F6\u90A3\u8D9F\u706B\u8F66\u5F88\u7A7A\uFF0C\u6211\u5E38\u5E38\u5230\u8F66\u53A2\u7684\u540E\u534A\u622A\u627E\u4E00\u6392\u4E09\u4EBA\u5EA7\u8EBA\u4E0B\uFF0C\u4E5F\u5C31\u7701\u4E0B\u4E86\u4E00\u5F20\u5367\u94FA\u94B1\u3002 \u90A3\u6B21\u4E0D\u77E5\u4E3A\u4EC0\u4E48\uFF0C\u6211\u524D\u524D\u540E\u540E\u8F6C\u4E86\u4E24\u5708\uFF0C\u6CA1\u6709\u4EC0\u4E48\u7A7A\u5EA7\uFF0C\u53EA\u597D\u5C31\u8FD1\u5750\u5728\u4E00\u4E2A\u5973\u5B69\u7684\u65C1\u8FB9\u3002 \u5973\u5B69\u811A\u4E0B\u662F\u4E2A\u884C\u674E\u7BB1\uFF0C\u684C\u4E0A\u662F\u56DB\u4E94\u74F6\u5564\u9152\u3002\u4E5F\u8BB8\u662F\u89C1\u6211\u5E74\u7EAA\u76F8\u4EFF\uFF0C\u5979\u7528\u80F3\u818A\u8098\u70B9\u4E86\u70B9\u6211\uFF0C\u95EE\u6211\uFF0C\u4F60\u559D\u4E0D\u559D\u9152\uFF0C\u6211\u8BF7\u4F60\u554A\u3002\u90A3\u4E00\u77AC\u95F4\u6211\u611F\u89C9\u81EA\u5DF1\u662F\u67F3\u98D8\u98D8\u3002 \u5341\u591A\u5E74\u524D\uFF0C\u706B\u8F66\u5F00\u5F97\u5F88\u6162\uFF0C\u4EBA\u4E5F\u6CA1\u90A3\u4E48\u62D8\u8C28\uFF0C\u5F88\u5BB9\u6613\u5C31\u88AB\u4E00\u74F6\u5564\u9152\u6253\u5F00\u3002\u51E0\u53E3\u4E0B\u809A\uFF0C\u5185\u5FC3\u618B\u8DB3\u4E86\u4E00\u53E3\u6C14\uFF0C\u6C14\u5F80\u4E0A\u6D8C\uFF0C\u8BDD\u5C31\u591A\u4E86\u3002 \u59D1\u5A18\u544A\u8BC9\u6211\uFF0C\u5979\u662F\u82CF\u5DDE\u4EBA\uFF0C\u5728\u5357\u901A\u5DE5\u4F5C\u3002\u8FD9\u6B21\u53BB\u90D1\u5DDE\uFF0C\u770B\u5979\u7537\u670B\u53CB\u3002\u7B49\u4ED6\u4E00\u6BD5\u4E1A\uFF0C\u5C31\u4E00\u8D77\u53BB\u4E0A\u6D77\uFF0C\u6253\u5DE5\u6323\u94B1\u3002 \u5979\u8FD8\u8BF4\uFF0C\u7B49\u8D5A\u5230\u94B1\u4E86\uFF0C\u5C31\u56DE\u82CF\u5DDE\u5F00\u4E00\u5BB6\u9152\u5427\u6216\u8005\u706B\u9505\u5E97\u3002 \u5979\u95EE\u6211\uFF0C\u4F60\u4EE5\u540E\u60F3\u8981\u505A\u4EC0\u4E48\u3002 \u6211\u8BF4\u6211\u60F3\u5F53\u7EFC\u827A\u8282\u76EE\u4E3B\u6301\u4EBA\uFF0C\u5434\u5B97\u5BAA\u90A3\u6837\u7684\uFF0C\u867D\u7136\u6211\u5728\u5B66\u6821\u91CC\u8FDE\u4E0A\u53F0\u8BB2\u8BDD\u7684\u52C7\u6C14\u90FD\u6CA1\u6709\u2026\u2026 \u5564\u9152\u5176\u5B9E\u65E9\u5C31\u559D\u5B8C\u4E86\uFF0C\u4F46\u6211\u4EEC\u90A3\u665A\u804A\u4E86\u5F88\u591A\uFF0C\u4E00\u4E9B\u6709\u7684\u6CA1\u7684\uFF0C\u4E00\u4E9B\u4E0D\u6210\u719F\u7684\u770B\u6CD5\u548C\u4E00\u4E9B\u5BF9\u4EBA\u751F\u7684\u4E0D\u7740\u8FB9\u9645\u7684\u5E7B\u60F3\u3002 \u5FEB\u5230\u90D1\u5DDE\u7AD9\u7684\u65F6\u5019\uFF0C\u5DF2\u662F\u6DF1\u591C\uFF0C\u5979\u63D0\u8D77\u5927\u7BB1\u5B50\uFF0C\u53C8\u7528\u80F3\u818A\u8098\u70B9\u70B9\u6211\uFF0C\u8BF4\uFF0C\u5582\uFF0C\u4F60\u4ECA\u5929\u559D\u4E86\u6211\u4E09\u74F6\u5564\u9152\uFF0C\u4EE5\u540E\u5230\u4E0A\u6D77\u4E00\u5B9A\u8981\u8FD8\u6211\u554A\u3002 \u81F3\u4ECA\u8BB0\u5F97\u5979\u8FDC\u53BB\u7684\u6837\u5B50\uFF0C\u8D39\u52B2\u5730\u63D0\u7740\u5927\u7BB1\u5B50\uFF0C\u4E00\u6DF1\u4E00\u6D45\u5730\u8D70\u7740\uFF0C\u6709\u70B9\u51C4\u695A\u53C8\u6709\u70B9\u5014\u5F3A\uFF0C\u50CF\u4E00\u74F6\u65B0\u917F\u7684\u767D\u9152\u3002 \u90A3\u573A\u804A\u5929\uFF0C\u6211\u4EEC\u4F3C\u4E4E\u90FD\u5FD8\u4E86\u5404\u81EA\u5E73\u65F6\u7684\u6837\u5B50\u3002\u6211\u4EEC\u53EA\u662F\u5728\u8FD9\u5730\u7403\u4E0A\u6D3B\u4E86\u5DEE\u4E0D\u591A\u65F6\u957F\u7684\u5E74\u8F7B\u4EBA\uFF0C\u540C\u6837\u5BF9\u8FD9\u4E2A\u4E16\u754C\u6709\u7740\u7A1A\u5AE9\u7684\u770B\u6CD5\u548C\u671F\u76FC\u3002 \u201C\u4F60\u559D\u4E0D\u559D\u9152\uFF1F\u6211\u8BF7\u4F60\u554A\uFF01\u201D\u5927\u6982\u4E5F\u662F\u8FD9\u4E48\u591A\u5E74\uFF0C\u5C11\u6709\u7684\u5F88\u771F\u8BDA\u7684\u4E00\u53E5\u8BDD\u4E86\u3002',
	                                                                                                                React.createElement('br', null),
	                                                                                                                '5 \u987A\u98CE\u8F66\u91CC\u7684\u4E8C\u5F20\u548C\u7EFF\u76AE\u8F66\u91CC\u7684\u6211\u662F\u4E00\u6837\u7684\uFF0C\u6211\u4EEC\u90FD\u77ED\u6682\u6253\u7834\u4E86\u4EBA\u8BBE\u3002 \u6211\u4EEC\u90FD\u6709\u4EBA\u8BBE\uFF0C\u6211\u4EEC\u9700\u8981\u4EBA\u8BBE\uFF0C\u6211\u4EEC\u8270\u96BE\u7EF4\u6301\u4EBA\u8BBE\uFF0C\u4EBA\u8BBE\u8BA9\u6211\u4EEC\u75B2\u60EB\u3002 \u4F46\u4E0A\u5E1D\u7ED9\u4E86\u6211\u4EEC\u4E00\u4E2A\u5598\u606F\u7684\u673A\u4F1A\uFF1A\u5728\u9762\u5BF9\u964C\u751F\u4EBA\u7684\u65F6\u5019\uFF0C\u6211\u4EEC\u53EF\u4EE5\u6253\u7834\u6211\u4EEC\u7684\u4EBA\u8BBE\uFF0C\u751A\u81F3\u91CD\u65B0\u8BBE\u5B9A\u6211\u4EEC\u7684\u4EBA\u8BBE\u3002 \u6211\u628A\u5728\u77ED\u6682\u7684\u65F6\u95F4\u91CC\u4E92\u76F8\u9762\u5BF9\u9762\u7684\u964C\u751F\u4EBA\uFF0C\u79F0\u4E4B\u4E3A\u201C\u4E00\u6B21\u6027\u670B\u53CB\u201D\u3002\u8FD9\u662F\u4E00\u79CD\u8F7B\u578B\u7684\u793E\u4EA4\uFF0C\u4E00\u79CD\u53EA\u91CD\u5F53\u4E0B\u7684\u793E\u4EA4\u3002 \u5C31\u50CF\u6211\u4EEC\u53BB\u9152\u5E97\uFF0C\u6709\u4E00\u6B21\u6027\u7EB8\u676F\uFF0C\u4E00\u6B21\u6027\u7259\u5237\uFF0C\u4E00\u6B21\u6027\u62D6\u978B\u3002\u56E0\u4E3A\u5B83\u4EEC\u662F\u4E00\u6B21\u6027\u7684\uFF0C\u6240\u4EE5\u6211\u4EEC\u6CA1\u6709\u90A3\u4E48\u591A\u62C5\u5FE7\uFF0C\u65E2\u4E0D\u7528\u987E\u5FCC\u4F7F\u7528\u65B9\u6CD5\uFF0C\u4E5F\u4E0D\u7528\u523B\u610F\u5730\u4FDD\u517B\uFF0C\u7528\u5B8C\u5C31\u4E22\u6389\uFF0C\u4E5F\u4E0D\u4F1A\u8FC7\u591A\u5730\u5728\u4E4E\u3002 \u5728\u7EFF\u76AE\u8F66\u4E0A\uFF0C\u6EF4\u6EF4\u987A\u98CE\u8F66\u4E0A\uFF0C\u4E5F\u4E00\u6837\uFF0C\u53CC\u65B9\u4E5F\u662F\u4E00\u6B21\u6027\u7684\u3002\u5BF9\u65B9\u4E0D\u77E5\u9053\u4F60\u662F\u8C01\uFF0C\u4F60\u4E5F\u4E0D\u77E5\u9053\u5BF9\u65B9\u662F\u8C01\u3002\u4E0D\u5FC5\u5728\u4E4E\uFF0C\u65E0\u9700\u987E\u8651\uFF0C\u6709\u4E00\u8BF4\u4E00\u3002\u4E0D\u95EE\u6765\u8DEF\uFF0C\u4E0D\u95EE\u524D\u7A0B\uFF0C\u884C\u7A0B\u7ED3\u675F\uFF0C\u4E00\u62CD\u4E24\u6563\uFF0C\u5404\u81EA\u53C8\u5F52\u4E8E\u5BFB\u5E38\u751F\u6D3B\u3002 \u5728\u8FD9\u6837\u7684\u201C\u9605\u540E\u5373\u5220\u201D\u4E2D\uFF0C\u6211\u4EEC\u5F97\u4EE5\u4EAB\u53D7\u201C\u9003\u8131\u4EBA\u8BBE\u201D\u7684\u5FEB\u611F\uFF0C\u5B9E\u73B0\u201C\u77ED\u6682\u98DE\u884C\u201D\u3002',
	                                                                                                                React.createElement('br', null)
	                                                                                                )
	                                                                                )
	                                                                )
	                                                );
	                                }
	                }]);
	
	                return one;
	}(React.Component);
	
	exports.default = one;

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var bosom = function (_React$Component) {
	  _inherits(bosom, _React$Component);
	
	  function bosom() {
	    _classCallCheck(this, bosom);
	
	    var _this = _possibleConstructorReturn(this, (bosom.__proto__ || Object.getPrototypeOf(bosom)).call(this));
	
	    _this.callapp = _this.callapp.bind(_this);
	    return _this;
	  }
	
	  _createClass(bosom, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.clickLog({ actiontype: 'SEM40-VIEW1' });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {}
	  }, {
	    key: 'clickLog',
	    value: function clickLog(obj) {
	      var urlstr = 'https://lego.zhuanzhuan.com/page/mark?pagetype=ZHUANZHUANM&appid=ZHUANZHUAN&';
	
	      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || !obj) {
	        //传入参数为object null undefined时
	        var actionflag = false; //判断是否需要自动补全actiontype的标识
	        Object.keys(obj).forEach(function (key) {
	          urlstr += key + '=' + obj[key] + '&';
	          if (key === 'actiontype') {
	            actionflag = true;
	          }
	        });
	        if (!actionflag) {
	          console.log('请传入actiontype字段');
	        }
	      } else if (typeof obj === 'string') {
	        //传入string时默认为actiontype属性
	        urlstr += 'actiontype=' + obj + '&';
	      }
	
	      var img = new Image();
	      img.src = urlstr + 'callback=?';
	    }
	  }, {
	    key: 'callapp',
	    value: function callapp(event) {
	
	      if (event) {
	        var log = event.target.getAttribute('data-log');
	        this.clickLog({ actiontype: log });
	      }
	    }
	  }, {
	    key: 'clickback',
	    value: function clickback() {
	      window.history.go(-1);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'main' },
	        React.createElement(
	          'div',
	          { className: 'jd-1' },
	          React.createElement('span', { className: 'back', onClick: this.clickback }),
	          React.createElement('span', { className: 'down', onClick: this.callapp }),
	          React.createElement(
	            'div',
	            { className: 'box' },
	            React.createElement(
	              'div',
	              { className: 'box1' },
	              React.createElement(
	                'p',
	                { className: 'title' },
	                '\u964C\u751F\u4EBA\uFF0C\u987A\u8DEF\u6210\u77E5\u5DF1'
	              ),
	              React.createElement(
	                'p',
	                { className: 'author' },
	                '\u771F\u5B9E\u6545\u4E8B\u8BA1\u5212'
	              ),
	              '\u591C\u6DF1\u7684\u65F6\u5019\uFF0C\u7ECF\u5E38\u601D\u8003\u4E00\u4E2A\u95EE\u9898\uFF1A\u4E3A\u4EC0\u4E48\u5E74\u7EAA\u8D8A\u5927\uFF0C\u8D8A\u96BE\u627E\u5230\u5408\u9002\u7684\u670B\u53CB\uFF1F \u968F\u7740\u5E74\u5C81\u6E10\u957F\uFF0C\u751F\u6D3B\u7684\u91CD\u538B\u8BA9\u4EBA\u75B2\u60EB\uFF0C\u6211\u4EEC\u5F00\u59CB\u56FF\u4E8E\u5EB8\u5E38\uFF0C\u4E60\u60EF\u4E24\u70B9\u4E00\u7EBF\uFF0C\u5728\u65E5\u590D\u4E00\u65E5\u4E2D\u91CD\u590D\u7740\u76F8\u540C\u7684\u52A8\u4F5C\u3002\u6211\u4EEC\u7684\u751F\u6D3B\u5F88\u5C11\u518D\u6709\u65B0\u9C9C\u586B\u5145\uFF0C\u670B\u53CB\u66F4\u662F\u5982\u6B64\u3002\u4EE5\u524D\u7684\u8001\u53CB\u788D\u4E8E\u65F6\u95F4\u548C\u8DDD\u79BB\u9010\u6E10\u8FDC\u53BB\uFF0C\u53C8\u61D2\u4E8E\u68B3\u7406\u65B0\u7684\u4EBA\u9645\u5173\u7CFB\uFF0C\u6211\u4EEC\u5C31\u8FD9\u6837\u628A\u81EA\u6211\u9650\u5B9A\u5728\u4E00\u4E2A\u5C01\u95ED\u5708\u5C42\u91CC\uFF0C\u518D\u4E5F\u65E0\u6CD5\u7A81\u7834\u3002 \u6211\u66FE\u4EE5\u4E3A\u8FD9\u662F\u65E0\u89E3\u7684\u96BE\u9898\uFF0C\u76F4\u5230\u524D\u4E9B\u5929\u5F81\u96C6\u987A\u98CE\u8F66\u6545\u4E8B\u65F6\uFF0C\u770B\u5230\u5F88\u591A\u8BFB\u8005\u5206\u4EAB\u81EA\u5DF1\u4E58\u5750\u987A\u98CE\u8F66\u7684\u7ECF\u5386\u3002\u5728\u6216\u957F\u6216\u77ED\u7684\u884C\u7A0B\u4E2D\uFF0C\u5C01\u95ED\u800C\u8212\u9002\u7684\u8F66\u5185\u73AF\u5883\u521B\u9020\u4E86\u65B0\u7684\u793E\u4EA4\u7A7A\u95F4\u3002\u8BB8\u591A\u8F66\u4E3B\u548C\u4E58\u5BA2\u7531\u4E8E\u5171\u540C\u7684\u7231\u597D\u3001\u7C7B\u4F3C\u7684\u804C\u4E1A\u7ECF\u5386\u3001\u4E92\u901A\u7684\u4EBA\u751F\u7126\u8651\uFF0C\u655E\u5F00\u5FC3\u6249\u7ED9\u4E88\u4E86\u5F7C\u6B64\u4E00\u4E2A\u5766\u8BDA\u4EA4\u6D41\u7684\u5951\u673A\uFF0C\u56E0\u6B64\u9047\u89C1\u4E86\u5FD7\u540C\u9053\u5408\u7684\u670B\u53CB\u3001\u4F19\u4F34\u548C\u604B\u4EBA\u3002 \u751F\u6D3B\u4E2D\u4E0D\u662F\u6CA1\u6709\u813E\u6027\u76F8\u6295\u7684\u4EBA\uFF0C\u53EA\u8981\u6211\u4EEC\u5C11\u51E0\u5206\u602F\u61E6\uFF0C\u591A\u70B9\u771F\u8BDA\u548C\u52C7\u6562\uFF0C\u518D\u52A0\u4E0A\u4E00\u4E2A\u5408\u9002\u7684\u5951\u673A\uFF0C\u987A\u8DEF\u4E5F\u53EF\u6210\u77E5\u5DF1\u3002\u6211\u628A\u8FD9\u4E9B\u4E58\u5750\u987A\u98CE\u8F66\u7684\u7ECF\u5386\u5206\u4EAB\u7ED9\u4F60\uFF0C\u5E0C\u671B\u80FD\u6709\u6240\u542F\u53D1\u3002',
	              React.createElement('br', null),
	              '@\u76AE\u5361\u4E18\u5361\u4E18 \u96EA\u591C\u7684\u4E00\u89C1\u949F\u60C5 2015\u5E74\u7684\u5E73\u5B89\u591C\uFF0C\u957F\u6625\u4E0B\u4E86\u5F88\u5927\u7684\u96EA\u3002\u6211\u5F53\u65F6\u5F85\u4E1A\uFF0C\u62A5\u4E86\u58F0\u4E50\u8BFE\uFF0C\u4E0B\u8BFE\u65F6\u5DF2\u7ECF\u6709\u70B9\u665A\u4E86\uFF0C\u4FBF\u6253\u5F00\u624B\u673A\u53EB\u4E86\u4E00\u8F86\u6EF4\u6EF4\u987A\u98CE\u8F66[\u4E86\u4E00\u8F86\u6EF4\u6EF4\u987A\u98CE\u8F66]\u56DE\u5BB6\u3002\u98CE\u96EA\u4E00\u5439\u51B7\u5F97\u5F7B\u9AA8\uFF0C\u6211\u7A7F\u5F97\u53C8\u4E0D\u591A\uFF0C\u8D76\u7D27\u7ED9\u8F66\u4E3B\u6253\u7535\u8BDD\uFF0C\u8BA9\u4ED6\u5F00\u5230\u624B\u673A\u5B9A\u4F4D\u5904\u63A5\u6211\u3002\u4E00\u822C\u4E1C\u5317\u7537\u4EBA\u90FD\u662F\u5927\u55D3\u95E8\uFF0C\u51FA\u4E4E\u610F\u6599\uFF0C\u5BF9\u65B9\u53EA\u662F\u51B7\u9759\u5730\u55EF\u4E86\u4E00\u58F0\uFF0C\u518D\u65E0\u591A\u8A00\u3002\u6211\u662F\u505A\u97F3\u4E50\u7684\uFF0C\u5F53\u65F6\u4FBF\u5FC3\u4E2D\u4E00\u98A4\u3002\u4ED6\u58F0\u97F3\u5F88\u52A8\u542C\u3002 \u4E0A\u8F66\u4E4B\u540E\uFF0C\u8FD8\u6CA1\u6765\u5F97\u53CA\u770B\u6E05\u8F66\u4E3B\u7684\u9762\u76EE\uFF0C\u6211\u4FBF\u88AB\u8F66\u4E0A\u653E\u7684\u4E8C\u624B\u73AB\u7470\u7ED9\u70B9\u71C3\u4E86\u3002\u4ECE\u5927\u5B66\u5F00\u59CB\uFF0C\u6211\u5C31\u662F\u4E8C\u624B\u73AB\u7470\u4E50\u961F\u7684\u94C1\u6258\uFF0C\u4E5F\u56E0\u6B64\u8FF7\u4E0A\u6447\u6EDA\uFF0C\u8FD8\u5728\u9152\u5427\u9A7B\u5531\u8FC7\u3002\u8F66\u4E3B\u4E0D\u4EC5\u5168\u7A0B\u90FD\u5728\u653E\u4E8C\u624B\u73AB\u7470\u7684\u6B4C\uFF0C\u8F66\u4E0A\u8FD8\u6709\u5404\u79CD\u4E8C\u624B\u73AB\u7470\u7684\u4E13\u8F91\u3002\u66F4\u8981\u547D\u7684\u662F\uFF0C\u4ED6\u53CC\u773C\u76AE\u9AD8\u9F3B\u6881\uFF0C\u957F\u5F97\u50CF\u80E1\u6B4C\u970D\u5EFA\u534E\u7684\u6DF7\u5408\u4F53\uFF0C\u6B63\u662F\u6211\u559C\u6B22\u7684\u90A3\u79CD\u786C\u6717\u7684\u5E05\u6C14\u3002\u6211\u4E00\u65F6\u5FD8\u8BB0\u4E86\u77DC\u6301\uFF0C\u5F00\u59CB\u4E86\u6211\u4E1C\u5317\u5927\u599E\u7684\u9AD8\u8C08\u9614\u8BBA\uFF0C\u8BD5\u56FE\u5F15\u8D77\u4ED6\u7684\u6CE8\u610F\u3002\u4ED6\u5374\u53EA\u9ED8\u9ED8\u5730\u542C\u7740\uFF0C\u5341\u5206\u793C\u8C8C\u3002 \u4E0B\u8F66\u4E4B\u540E\uFF0C\u4ED6\u7ED9\u6211\u514D\u4E86\u5355\u3002 \u5F53\u65F6\u7684\u987A\u98CE\u8F66\u901A\u8BDD\u8FD8\u4F1A\u663E\u793A\u5BF9\u65B9\u7684\u7535\u8BDD\u53F7\u7801\uFF0C\u6211\u8D76\u7D27\u7ED9\u4ED6\u53D1\u77ED\u4FE1\uFF0C\u8BF4\u52A0\u4E2A\u5FAE\u4FE1\u5427\u3002\u6BEB\u4E0D\u5938\u5F20\u7684\u662F\uFF0C\u6211\u51E0\u4E4E\u540C\u65F6\u5728\u6EF4\u6EF4\u91CC\u9762\u6536\u5230\u4E86\u4ED6\u53D1\u6765\u7684\u6D88\u606F\uFF0C\u8BF4\u52A0\u4E2A\u5FAE\u4FE1\u5427\uFF01[\u771F\u5B9E\u53F7\u7801\u548C\u5FAE\u4FE1\uFF0C\u9700\u8981\u54A8\u8BE2\u4EA7\u54C1\u540E\u786E\u8BA4\u662F\u5426\u7B26\u5408\u5B9E\u60C5\u3002] \u56DE\u5230\u5BB6\uFF0C\u6211\u7ACB\u5373\u7FFB\u770B\u4ED6\u7684\u670B\u53CB\u5708\u3002\u53D1\u73B0\u6211\u4EEC\u81F3\u5C11\u540C\u65F6\u53BB\u8FC7\u4E09\u573A\u6447\u6EDA\u97F3\u4E50\u8282\uFF0C\u5176\u4E2D\u4E00\u573A\u4E8C\u624B\u73AB\u7470\u7684\u4E13\u573A\uFF0C\u4ED6\u53D1\u4E86\u4E00\u5F20\u73B0\u573A\u7167\u7247\uFF0C\u8FD8\u9732\u51FA\u4E86\u6211\u4E00\u53EA\u6234\u7740\u4E1D\u5DFE\u7684\u624B\uFF01 \u6211\u4FE9\u90FD\u5F88\u5174\u594B\uFF0C\u72C2\u804A\u5929\uFF0C\u5C31\u8FD9\u4E48\u804A\u5230\u4E86\u51CC\u6668\u4E09\u70B9\u3002\u8FD9\u624D\u77E5\u9053\uFF0C\u4ED6\u5927\u5B66\u4E0A\u7684\u662F\u6211\u4EEC\u672C\u5730\u7684\u4E00\u5BB6\u4E09\u672C\u3002\u800C\u6211\u5988\u5728\u8FD9\u5BB6\u5927\u5B66\u5F00\u4E86\u5BB6\u5C0F\u5E97\uFF0C\u4ED6\u7ECF\u5E38\u5149\u987E[\u7ECF\u5E38\u5149\u987E\u6D74\u6C60\uFF0C\u662F\u4E0D\u662F\u6362\u4E2A\u66F4\u597D\uFF0C\u62C5\u5FC3\u5927\u5BB6\u770B\u5230\u6D74\u6C60\u6709\u4E0D\u597D\u8054\u60F3]\u3002\u5F53\u65F6\u6211\u8FD8\u5728\u4E0A\u9AD8\u4E2D\uFF0C\u6BCF\u5929\u653E\u5B66\u90FD\u53BB\u5E97\u91CC\u7B49\u6211\u5988\u4E0B\u73ED\u3002\u4E5F\u5C31\u662F\u8BF4\uFF0C\u6211\u4EEC\u4E00\u5B9A\u66FE\u7ECF\u65E0\u6570\u6B21\u64E6\u80A9\u800C\u8FC7\u3002 \u7B2C\u4E8C\u5929\u5C31\u662F\u5723\u8BDE\u8282\uFF0C\u6211\u8BD5\u63A2\u6027\u5730\u95EE\uFF0C\u8981\u4E0D\u6211\u8BF7\u4F60\u5403\u996D\u5427\uFF0C\u6628\u665A\u4E0A\u4F60\u8FD8\u7ED9\u6211\u514D\u4E86\u5355\uFF0C\u602A\u4E0D\u597D\u610F\u601D\u7684\u3002\u4ED6\u7ACB\u5373\u7B54\u5E94\u4E86\uFF0C\u6211\u5C31\u77E5\u9053\u4ED6\u8DDF\u6211\u4E00\u6837\u8FD8\u662F\u6761\u5355\u8EAB\u72D7\u3002 \u4ED6\u5F00\u8F66\u8FC7\u6765\u63A5\u6211\uFF0C\u8DEF\u4E0A\u6211\u63A8\u8350\u4E86\u4E00\u5927\u5806\u7092\u83DC\u3001\u706B\u9505\u3001\u70E4\u8089\u9986\u5B50\uFF0C\u8BA9\u4ED6\u968F\u4FBF\u9009\u3002\u6CA1\u60F3\u5230\u4ED6\u5374\u628A\u8F66\u505C\u5728\u4E86\u4E00\u5BB6\u9762\u9986\u95E8\u53E3\u3002\u6211\u4E8C\u8BDD\u6CA1\u8BF4\uFF0C\u5728\u9762\u9986\u91CC\u70B9\u4E86\u6EE1\u6EE1\u4E00\u5927\u684C\uFF0C\u9171\u8089\u554A\u9C7C\u554A\uFF0C\u5468\u56F4\u7684\u987E\u5BA2\u90FD\u89C9\u5F97\u6211\u4EEC\u662F\u795E\u7ECF\u75C5\u3002\u7ED3\u679C\u8FD9\u5BB6\u9762\u9986\u662F\u65B0\u5F00\u5F20\u7684\uFF0C\u4E0D\u80FD\u624B\u673A\u652F\u4ED8\uFF0C\u94B1\u8FD8\u662F\u4ED6\u4ED8\u7684\u3002 \u5403\u5B8C\u996D\u5DF2\u7ECF\u5F88\u665A\u4E86\uFF0C\u4ED6\u5BB6\u79BB\u5F97\u8FDC\uFF0C\u56DE\u53BB\u4E0D\u65B9\u4FBF\u3002\u6211\u4EEC\u8FD9\u8FB9\u5403\u5B8C\u996D\u73A9\u5B8C\u9EBB\u5C06\u4EC0\u4E48\u7684\u90FD\u6709\u6C57\u84B8\u7684\u4E60\u60EF\uFF0C\u4E1C\u5317\u4EBA\u90FD\u655E\u4EAE\uFF0C\u6211\u63D0\u8BAE\u53BB\u6C57\u4E2A\u84B8\u5457\u3002\u6C57\u84B8\u5B8C\u4E86\u5C31\u5728\u4F11\u606F\u5927\u5385\u8FC7\u4E86\u4E00\u591C[\u7B2C\u4E8C\u6B21\u89C1\u9762\u5973\u751F\u63D0\u51FA\u4E00\u8D77\u53BB\u6D17\u6FA1\u6C57\u84B8\uFF0C\u8FD9\u4E2A\u2026]\uFF0C\u5149\u804A\u5929\u4E86\uFF0C\u56E0\u4E3A\u4E0D\u597D\u610F\u601D\u5F00\u5355\u95F4\u3002\u6211\u5176\u5B9E\u662F\u4E2A\u5F88\u5F00\u653E\u7684\u4EBA\uFF0C\u4F46\u662F\u8FD9\u6837\u7684\u7537\u4EBA\u5C31\u5B9E\u5728\u592A\u5C11\u89C1\u4E86\u3002 \u6211\u4EEC\u5C31\u6B64\u817B\u5728\u4E86\u4E00\u8D77\u3002\u6CA1\u6709\u6B63\u5F0F\u7684\u544A\u767D\uFF0C\u4E09\u5929\u540E\u4ED6\u5E26\u6211\u53BB\u53C2\u52A0\u5927\u5B66\u5BA4\u53CB\u7684\u805A\u4F1A\uFF0C\u4ED6\u4EEC\u5C31\u5DF2\u7ECF\u53EB\u6211\u5927\u5AC2\u4E86\u3002\u53EB\u5F97\u6211\u8FD8\u633A\u723D\u7684\u3002 \u4ECA\u5E74\u76845\u670828\u53F7\uFF0C\u6211\u4EEC\u4E3E\u529E\u4E86\u5A5A\u793C\u3002\u76EE\u524D\u6765\u770B\uFF0C\u6211\u8C8C\u4F3C\u662F\u6000\u5B55\u4E24\u4E2A\u6708\u4E86\u3002',
	              React.createElement('br', null),
	              '@\u864E\u54E5 \u6253\u8F66\u9047\u89C1\u7684\u521B\u4E1A\u4F19\u4F34 \u6211\u5728\u5317\u65B9\u4E00\u4E2A\u4E09\u7EBF\u5C0F\u57CE\u751F\u6D3B\uFF0C\u5E74\u8FC730\u4E00\u4E8B\u65E0\u6210\uFF0C\u5E73\u65F6\u4E0A\u73ED\u62FF\u4E2A\u6B7B\u5DE5\u8D44\uFF0C\u4E0B\u4E86\u73ED\u5C31\u558A\u4E0A\u4E00\u5E2E\u54E5\u4EEC\u559D\u9152\u80E1\u95F9\u3002 \u6709\u4E00\u5929\u665A\u4E0A\u53C8\u559D\u4E86\u70B9\u9152\uFF0C\u53EB\u6EF4\u6EF4\u987A\u98CE\u8F66[\u6EF4\u6EF4\u987A\u98CE\u8F66]\u56DE\u5BB6\u3002\u8F66\u4E00\u6765\u6211\u5C31\u4E50\u4E86\uFF0C\u8DDF\u6211\u7684\u8F66\u4E00\u6A21\u4E00\u6837\uFF0C\u90FD\u662F\u7EA2\u8272\u7684\u6D77\u9A6C\uFF0C\u771F\u662F\u7F18\u5206\u2014\u2014\u6211\u4EEC\u8FD9\u91CC\u7EA2\u8272\u7684\u8F66\u578B\u672C\u6765\u5C31\u4E0D\u591A\uFF0C\u800C\u4E14\u8F66\u4E3B\u591A\u4E3A\u5973\u6027\u3002 \u4E0A\u8F66\u540E\u6211\u6709\u70B9\u5174\u594B\uFF0C\u5C31\u548C\u8F66\u4E3B\u778E\u4F83\u3002\u4ED6\u6BD4\u6211\u5C0F\u4E09\u5C81\uFF0C\u7CBE\u6C14\u795E\u4E0D\u9519\uFF0C\u8BF4\u54B1\u4EEC\u8FD9\u57CE\u91CC\u540C\u6B3E\u8F66\u4E0D\u591A\uFF0C\u4ED6\u6709\u65F6\u5019\u5728\u8DEF\u4E0A\u9047\u89C1\uFF0C\u5C31\u4F1A\u505C\u4E0B\u8F66\u4E92\u76F8\u52A0\u4E2A\u5FAE\u4FE1\u5565\u7684\uFF0C\u60F3\u7740\u4EE5\u540E\u7EC4\u4E2A\u8F66\u53CB\u4F1A\u641E\u641E\u6D3B\u52A8\uFF0C\u6D3B\u8DC3\u4E00\u4E0B\u4E1A\u4F59\u751F\u6D3B\u3002 \u6211\u5F88\u65E9\u5C31\u840C\u751F\u4E86\u521B\u4E1A\u7684\u60F3\u6CD5\uFF0C\u4F46\u82E6\u4E8E\u5728\u8FD9\u5C0F\u5730\u65B9\u4E00\u76F4\u627E\u4E0D\u5230\u5408\u9002\u7684\u9879\u76EE\u3002\u8F66\u53CB\u4F1A\u4E09\u4E2A\u8BCD\u4E00\u5192\u51FA\u6765\uFF0C\u6211\u8111\u5B50\u91CC\u7075\u5149\u4E00\u95EA\uFF0C\u89C9\u5F97\u53EF\u4EE5\u505A\u505A\u6587\u7AE0\u3002\u6211\u9012\u4E0A\u4E00\u6839\u70DF\u7ED9\u4ED6\uFF0C\u8BF4\u8981\u4E0D\u54B1\u4EEC\u628A\u8F66\u505C\u5230\u4E00\u4E2A\u5730\u65B9\u597D\u597D\u804A\u804A\uFF1F \u4ED6\u8BF4\u597D\u554A\uFF0C\u5C31\u62D0\u89D2\u627E\u4E86\u4E2A\u8DEF\u8FB9\u644A\u3002\u8003\u8651\u5230\u4ED6\u5F00\u8F66\u4E0D\u80FD\u559D\u9152\uFF0C\u6211\u4EEC\u70B9\u4E86\u70E4\u4E32\u548C\u996E\u6599\uFF0C\u8FB9\u5403\u8FB9\u626F\u3002\u4F83\u5230\u534A\u591C\uFF0C\u62BD\u5B8C\u4E86\u4E24\u5305\u70DF\uFF0C\u6211\u4EEC\u4E5F\u6CA1\u80FD\u60F3\u51FA\u8BA9\u8F66\u53CB\u4F1A\u76C8\u5229\u7684\u65B9\u6CD5\u3002\u770B\u770B\u65F6\u95F4\u4E0D\u65E9\uFF0C\u6211\u8BF4\u8981\u4E0D\u6539\u5929\u518D\u804A\uFF0C\u660E\u5929\u6211\u8868\u5F1F\u7ED3\u5A5A\uFF0C\u6211\u4E00\u65E9\u5F97\u8FC7\u53BB\u5E2E\u5FD9\u3002 \u4ED6\u5FFD\u7136\u731B\u62CD\u5927\u817F\uFF0C\u8BF4\u54B1\u4EEC\u6574\u4E0A\u51E0\u5341\u8F86\u7EA2\u8272\u6D77\u9A6C\uFF0C\u5C31\u80FD\u505A\u5A5A\u793C\u7684\u8F66\u961F\u554A\uFF01\u7EA2\u8272\u7684\u8F66\u559C\u5E86\uFF0C\u751F\u610F\u80AF\u5B9A\u597D\uFF01\u542C\u5230\u8FD9\u4E2A\u70B9\u5B50\u6211\u4FE9\u90FD\u7279\u6FC0\u52A8\uFF0C\u4ED6\u9001\u6211\u5230\u5BB6\u540E\u8FD8\u5728\u8F66\u91CC\u804A\u4E86\u4E00\u4F1A\u513F\u3002 \u8BF4\u5E72\u5C31\u5E72\uFF0C\u6211\u4EEC\u5F88\u5FEB\u5546\u91CF\u51FA\u4E86\u4E00\u5957\u8FD0\u8425\u65B9\u6848\u3002\u56E0\u4E3A\u6709\u4ED6\u4E4B\u524D\u8054\u7CFB\u7EC4\u5EFA\u8F66\u53CB\u4F1A\u7684\u57FA\u7840\uFF0C\u6211\u4EEC\u77ED\u65F6\u95F4\u5185\u805A\u96C6\u4E86\u5927\u90E8\u5206\u5168\u57CE\u540C\u6B3E\u7684\u7EA2\u8272\u6D77\u9A6C\u8F66\u4E3B\u3002\u63A5\u7B2C\u4E00\u5355\u5A5A\u793C\u8F66\u961F\u751F\u610F\u7684\u65F6\u5019\uFF0C\u5341\u51E0\u8F86\u7EA2\u8272\u8F7F\u8F66\u7EC4\u6210\u7684\u957F\u9F99\u6210\u4E86\u5C0F\u57CE\u4E00\u666F\u3002\u770B\u70ED\u95F9\u7684\u4EBA\u628A\u7167\u7247\u4E0A\u4F20\u5230\u6211\u4EEC\u5F53\u5730\u7684\u7F51\u7EDC\u8BBA\u575B\uFF0C\u4E00\u65F6\u6210\u4E86\u70ED\u5E16\u3002 \u4ECE\u5A5A\u793C\u8F66\u961F\u8D77\u6B65\uFF0C\u6211\u4EEC\u6210\u7ACB\u4E86\u516C\u53F8\uFF0C\u8058\u8BF7\u4E86\u6444\u5F71\u3001\u4E3B\u6301\u7B49\u4EBA\u624D\uFF0C\u4E3A\u65B0\u5A5A\u5BA2\u6237\u63D0\u4F9B\u66F4\u5168\u9762\u7684\u670D\u52A1\u3002\u4E0D\u5230\u534A\u5E74\u65F6\u95F4\uFF0C\u6211\u4EEC\u5C31\u505A\u6210\u4E86\u672C\u5730\u6700\u6709\u7279\u8272\u7684\u5A5A\u5E86\u516C\u53F8\u3002 \u56E0\u4E3A\u987A\u98CE\u8F66\u7684\u4E00\u6B21\u5076\u9047\uFF0C\u73B0\u5728\u4ED6\u6210\u4E86\u6211\u7684\u5408\u4F19\u4EBA\uFF01',
	              React.createElement('br', null),
	              '@\u7B80\u5355 \u5931\u610F\u4EBA\u7684\u751C\u871C\u7F18\u5206 \xA0 \u4ECA\u5E74\u590F\u5929\uFF0C\u6211\u8F9E\u804C\u4ECE\u957F\u6C99\u56DE\u682A\u6D32\u3002\u5BF9\u5927\u5B66\u6BD5\u4E1A\u4E0D\u4E45\u7684\u6211\u6765\u8BF4\uFF0C\u4E0A\u4E00\u4EFD\u5728\u957F\u6C99\u505A\u5546\u52A1\u7684\u5DE5\u4F5C\u5F88\u6709\u632B\u8D25\u611F\uFF1A\u6211\u80FD\u529B\u5355\u4E00\uFF0C\u5B8C\u4E0D\u6210\u8003\u6838\uFF0C\u4E3B\u7BA1\u5E38\u5E38\u5BF9\u6211\u7834\u53E3\u5927\u9A82\uFF0C\u6BCF\u5929\u8FCE\u63A5\u6211\u7684\u662F\u52A0\u73ED\u548C\u540C\u4E8B\u95F4\u7684\u5C0F\u56E2\u4F53\u4E3B\u4E49\u3002\u5728\u7236\u6BCD\u4E09\u756A\u4E94\u6B21\u7684\u50AC\u4FC3\u4E0B\uFF0C\u6211\u7EC8\u4E8E\u51B3\u5B9A\u7ED3\u675F\u6F02\u6CCA\u751F\u6D3B\uFF0C\u56DE\u5230\u8001\u5BB6\uFF0C\u5B89\u5FC3\u505A\u4E00\u540D\u5E7C\u513F\u56ED\u8001\u5E08\u3002 \u8F9E\u804C\u540E\uFF0C\u6211\u51B3\u5B9A\u53EB\u4E00\u8F86\u987A\u98CE\u8F66\u56DE\u682A\u6D32\uFF0C\u516D\u4E03\u5341\u516C\u91CC\uFF0C\u4E00\u4E2A\u591A\u5C0F\u65F6\u5C31\u5230\uFF0C\u5F88\u5212\u7B97\u3002\u6536\u62FE\u5B8C\u884C\u674E\uFF0C\u6211\u5DEE\u70B9\u8981\u7D2F\u762B\u4E86\uFF0C\u90A3\u6BB5\u65F6\u95F4\u6240\u6709\u7684\u7126\u8651\u3001\u90C1\u95F7\u548C\u4E0D\u7518\u90FD\u4F34\u968F\u7740\u6CEA\u6C34\u503E\u6CFB\u800C\u51FA\uFF0C\u6211\u5927\u543C\u4E00\u58F0\uFF0C\u89C9\u5F97\u751F\u6D3B\u7CDF\u900F\u4E86\u3002 \u8FD9\u65F6\uFF0C\u624B\u673A\u54CD\u4E86\uFF0C\u662F\u6211\u53EB\u7684\u987A\u98CE\u8F66\u3002 \u8F66\u4E3B\u5728\u7535\u8BDD\u91CC\u663E\u5F97\u5F88\u6025\u8E81\uFF0C\u98CE\u98CE\u706B\u706B\uFF0C\u8FDE\u7740\u6253\u4E86\u597D\u51E0\u4E2A\u7535\u8BDD\u95EE\u6211\u7684\u5B9A\u4F4D\u662F\u5426\u51C6\u786E\u3002\u6211\u540E\u6765\u6CA1\u597D\u6C14\u5730\u56DE\u7B54\uFF0C\u89C9\u5F97\u8FD9\u4EBA\u662F\u5947\u8469\uFF0C\u5C31\u5DEE\u53D6\u6D88\u8BA2\u5355\u4E86\u3002 \u5230\u4F4D\u7F6E\u540E\uFF0C\u4ED6\u89C1\u6211\u884C\u674E\u591A\uFF0C\u76F4\u63A5\u8FDB\u5C4B\u5E2E\u6211\u642C\u4E86\u4E00\u90E8\u5206\uFF0C\u585E\u6EE1\u4E86\u6574\u4E2A\u540E\u5907\u7BB1\uFF0C\u4E00\u8138\u7684\u4E0D\u9AD8\u5174\u3002\u4ED6\u770B\u8D77\u6765\u6BD4\u6211\u5927\u4E94\u516D\u5C81\uFF0C\u8EAB\u6750\u9B41\u68A7\uFF0C\u4E00\u8DEF\u4E0A\u4E0D\u600E\u4E48\u542D\u58F0\u3002\u6211\u5FC3\u60C5\u672C\u5C31\u4E0D\u5927\u597D\uFF0C\u6B63\u597D\u7701\u53BB\u4E86\u804A\u5929\u7684\u9EBB\u70E6\uFF0C\u5C31\u76F4\u63A5\u7761\u5230\u4E86\u5BB6\u3002 \u8FC7\u4E86\u4E24\u4E2A\u6708\uFF0C\u6211\u5DF2\u7ECF\u5728\u5E7C\u513F\u56ED\u5DE5\u4F5C\u4E86\u3002\u6709\u5929\u665A\u4E0A\uFF0C\u6211\u5728\u95FA\u871C\u5BB6\u805A\u9910\u804A\u5929\uFF0C\u4E00\u4E0D\u5C0F\u5FC3\u73A9\u592A\u665A\u4E86\uFF0C\u5979\u5BB6\u6709\u70B9\u504F\uFF0C\u7B2C\u4E8C\u5929\u4E0A\u73ED\u4E0D\u65B9\u4FBF\u3002\u95FA\u871C\u8BF4\uFF0C\u6CA1\u4E8B\uFF0C\u8FD9\u7247\u5F80\u8FD4\u57CE\u91CC\u7684\u6EF4\u6EF4\u987A\u98CE\u8F66\u5F88\u591A\uFF0C\u4E0D\u8D35\uFF0C\u8FD8\u65B9\u4FBF\u3002\u7B2C\u4E8C\u5929\u4E00\u65E9\uFF0C\u6211\u4FBF\u53EB\u4E86\u8F86\u987A\u98CE\u8F66[\u5728\u6B64\u5904\u8981\u8BF4\u4E00\u4E0B\u4E3A\u4EC0\u4E48\u8FD9\u4E48\u9AD8\u9891\u4F7F\u7528\u987A\u98CE\u8F66\uFF08\u628A\u987A\u98CE\u8F66\u7684\u597D\u5904\u8BB2\u4E00\u4E0B\uFF09]\u3002\u6CA1\u60F3\u5230\u63A5\u6211\u7684\u4EBA\u53C8\u662F\u4ED6\uFF0C\u800C\u4E14\u8F66\u4E0A\u8FD8\u5750\u7740\u6211\u4EEC\u5E7C\u513F\u56ED\u7684\u5B9D\u5B9D\u6F47\u6F47\u3002\u6211\u4FE9\u4F1A\u5FC3\u4E00\u7B11\uFF0C\u660E\u767D\u8FC7\u6765\uFF0C\u4ED6\u662F\u6F47\u6F47\u7684\u5BB6\u957F\u3002\u548C\u7B2C\u4E00\u6B21\u4E0D\u540C\uFF0C\u90A3\u6B21\u8DEF\u4E0A\u6211\u4EEC\u804A\u4E86\u5F88\u591A\uFF0C\u4E3B\u8981\u90FD\u662F\u5173\u4E8E\u5B69\u5B50\u3002 \u53EF\u80FD\u4ED6\u89C9\u5F97\u7B2C\u4E00\u6B21\u89C1\u9762\u65F6\u81EA\u5DF1\u4E0D\u592A\u793C\u8C8C\uFF0C\u540E\u6765\u4E3B\u52A8\u8BF7\u6211\u5403\u996D\u3002\u6211\u8FD9\u624D\u77E5\u9053\uFF0C\u4ED6\u548C\u59BB\u5B50\u79BB\u5A5A\u4E86\uFF0C\u5E2E\u6211\u642C\u884C\u674E\u7684\u90A3\u5929\uFF0C\u4ED6\u6B63\u5728\u957F\u6C99\u51FA\u5DEE\uFF0C\u5BB6\u91CC\u6765\u7535\u8BDD\u8BF4\u5B69\u5B50\u8EAB\u4F53\u4E0D\u8212\u670D\uFF0C\u53C8\u5435\u7740\u8981\u5988\u5988\u3002\u4ED6\u5FC3\u91CC\u4E5F\u5F88\u70E6\u95F7\uFF0C\u4E8E\u662F\u4E24\u4E2A\u5931\u610F\u7684\u4EBA\u649E\u4E00\u5757\u513F\u4E86\u3002 \u6211\u4EEC\u9010\u6E10\u719F\u6089\u4E86\u8D77\u6765\u3002\u4ED6\u7ECF\u5E38\u627E\u6211\u4E86\u89E3\u6F47\u6F47\u5728\u5E7C\u513F\u56ED\u7684\u60C5\u51B5\uFF0C\u7B97\u5F97\u4E0A\u662F\u4E00\u4E2A\u6709\u8D23\u4EFB\u611F\u7684\u597D\u7238\u7238\uFF0C\u6709\u65F6\u4ED6\u5DE5\u4F5C\u4E0A\u4E34\u65F6\u6709\u4E8B\uFF0C\u6211\u5C31\u5E2E\u4ED6\u628A\u6F47\u6F47\u9001\u56DE\u5BB6\u3002\u6F47\u6F47\u662F\u4E2A\u5F88\u53EF\u7231\u7684\u5973\u5B69\uFF0C\u773C\u775B\u5F88\u5927\uFF0C\u753B\u753B\u65F6\u5F88\u6709\u60F3\u8C61\u529B\uFF0C\u5403\u996D\u7761\u89C9\u4E5F\u5F88\u4E56\u3002 \u6211\u4ECA\u5E7422\u5C81\uFF0C\u539F\u672C\u4E0D\u662F\u7279\u522B\u559C\u6B22\u5C0F\u5B69\uFF0C\u4E5F\u4E0D\u662F\u5F88\u6EE1\u610F\u8FD9\u4EFD\u5DE5\u4F5C\uFF0C\u53EF\u56E0\u4E3A\u4ED6\u548C\u6F47\u6F47\uFF0C\u6211\u9010\u6E10\u6539\u53D8\u4E86\u60F3\u6CD5\u3002 \u6211\u4EEC\u6210\u4E86\u597D\u670B\u53CB\u3002\u4F46\u662F\u4ED6\u6CA1\u6709\u5411\u6211\u8868\u767D\uFF0C\u4E5F\u8BB8\u6709\u4E00\u5929\u4F1A\u8868\u767D\u5427\uFF0C\u6211\u4F1A\u7B54\u5E94\u4ED6\u7684\u3002',
	              React.createElement('br', null),
	              '\xA0@\u996D\u56E2 \u6211\u548C\u95FA\u871C\u7684\u795E\u5947\u76F8\u9047 \xA0 \u4E34\u8FD1\u5927\u5B66\u7684\u5F00\u5B66\u65E5\u671F\uFF0C\u6211\u7238\u5988\u7F8E\u5176\u540D\u66F0\u953B\u70BC\u6211\u7684\u72EC\u7ACB\u80FD\u529B\uFF0C\u5E2E\u6211\u53EB\u4E86\u8F86\u6EF4\u6EF4\u987A\u98CE\u8F66[\u6EF4\u6EF4\u987A\u98CE\u8F66]\uFF0C\u8BA9\u6211\u81EA\u5DF1\u53BB\u5B66\u6821\u62A5\u5230\u3002\u867D\u8BF4\u5E02\u91CC\u79BB\u5B66\u6821\u6240\u5728\u7684\u7701\u4F1A\u53EA\u6709\u4E09\u4E2A\u591A\u5C0F\u65F6\u8F66\u7A0B\uFF0C\u4F46\u6211\u8FD8\u662F\u4E00\u809A\u5B50\u4E0D\u9AD8\u5174\uFF0C\u89C9\u5F97\u4ED6\u4EEC\u505A\u7236\u6BCD\u7684\u633A\u72E0\u5FC3\u3002 \u8F66\u4E3B\u662F\u4E2A\u5927\u53D4\uFF0C\u8D77\u521D\u6211\u4EE5\u4E3A\u4ED6\u662F\u9001\u5B69\u5B50\u53BB\u5927\u5B66\u62A5\u5230\u7684\uFF0C\u7ED3\u679C\u8F66\u6765\u4E86\u53D1\u73B0\u53EA\u6709\u4ED6\u4E00\u4EBA\u3002\u5927\u53D4\u4EBA\u5F88\u548C\u5584\uFF0C\u9762\u8272\u9EDD\u9ED1\uFF0C\u7B11\u8D77\u6765\u4E00\u8138\u8936\u5B50\u3002\u4E00\u8DEF\u4E0A\uFF0C\u4ED6\u90FD\u5728\u542C\u6211\u5BF9\u7238\u5988\u7684\u62B1\u6028\uFF0C\u4EC0\u4E48\u4E5F\u4E0D\u8BF4\u3002\u7B49\u6211\u8BF4\u5B8C\uFF0C\u4ED6\u563F\u563F\u4E00\u7B11\uFF0C\u50CF\u8981\u900F\u9732\u4EC0\u4E48\u673A\u5BC6\u4F3C\u7684\u8BF4\uFF1A\u201C\u5C0F\u59D1\u5A18\uFF0C\u7236\u6BCD\u7684\u5FC3\u601D\u4F60\u4EE5\u540E\u4F1A\u61C2\u7684\u3002\u201D \u8D70\u4E86\u4E00\u8DEF\uFF0C\u6211\u5410\u69FD\u4E86\u7238\u5988\u4E00\u8DEF\uFF0C\u4E34\u4E0B\u8F66\uFF0C\u90FD\u8FD8\u6CA1\u6765\u5F97\u53CA\u95EE\u5927\u53D4\uFF0C\u4ED6\u662F\u53BB\u5B66\u6821\u505A\u4EC0\u4E48\u7684\u3002 \u62A5\u5230\u5B8C\u6210\u540E\u662F\u65B0\u751F\u519B\u8BAD\uFF0C\u519B\u8BAD\u90A3\u6BB5\u65E5\u5B50\u5F88\u96BE\u71AC\uFF0C\u597D\u51E0\u6B21\u6211\u90FD\u89C9\u5F97\u575A\u6301\u4E0D\u4E0B\u6765\u3002\u79BB\u5BB6\u8FD8\u4E0D\u523020\u5929\uFF0C\u6211\u5F00\u59CB\u60F3\u5FF5\u5988\u5988\u505A\u7684\u9EC4\u7116\u7F8A\u8089\uFF0C\u7238\u7238\u5468\u672B\u548C\u6211\u65E9\u8D77\u722C\u5C71\u7684\u65E5\u5B50\u3002\u7D27\u968F\u5176\u540E\u7684\u56FD\u5E86\u957F\u5047\uFF0C\u6211\u8FEB\u4E0D\u53CA\u5F85\u51C6\u5907\u56DE\u5BB6\uFF0C\u7792\u7740\u7238\u5988\u53EB\u4E86\u8F86\u987A\u98CE\u8F66\uFF0C\u8C0E\u79F0\u662F\u5750\u706B\u8F66\u56DE\u53BB\u7684\uFF0C\u60F3\u7ED9\u4ED6\u4EEC\u4E00\u4E2A\u60CA\u559C\u3002 \u7ED3\u679C\uFF0C\u5F88\u5DE7\uFF0C\u6211\u53C8\u9047\u5230\u4E86\u90A3\u4F4D\u8F66\u4E3B\u5927\u53D4\u3002\u53EA\u662F\u8FD9\u56DE\uFF0C\u526F\u9A7E\u9A76\u4E0A\u8FD8\u6709\u4E2A\u548C\u6211\u5E74\u7EAA\u76F8\u4EFF\u7684\u5973\u5B69\u3002\u4E00\u95EE\u624D\u77E5\u9053\u662F\u5927\u53D4\u7684\u5973\u513F\uFF0C\u662F\u9694\u58C1\u5DE5\u5546\u5B66\u9662\u7684\u3002 \u5BD2\u6684\u51E0\u53E5\u540E\uFF0C\u6211\u5FCD\u4E0D\u4F4F\u95EE\u5927\u53D4\uFF0C\u4E3A\u4EC0\u4E48\u4E0A\u56DE\u5F00\u5B66\u7684\u65F6\u5019\u4ED6\u72EC\u81EA\u4E00\u4EBA\u3002\u5927\u53D4\u8BF4\uFF0C\u4ED6\u539F\u672C\u4E5F\u60F3\u953B\u70BC\u5973\u513F\u7684\u72EC\u7ACB\u610F\u8BC6\uFF0C\u6240\u4EE5\u8BA9\u5973\u513F\u5750\u706B\u8F66\u6765\u5B66\u6821\u62A5\u5230\u3002\u706B\u8F66\u5F00\u4E86\u540E\uFF0C\u4ED6\u56DE\u5230\u5BB6\uFF0C\u53D1\u73B0\u5973\u513F\u628A\u624B\u8868\u7559\u5728\u5BB6\u91CC\u4E86\u3002\u90A3\u662F\u4ED6\u9001\u7ED9\u5973\u513F\u8003\u4E0A\u5927\u5B66\u7684\u793C\u7269\uFF0C\u4ED6\u77E5\u9053\u5973\u513F\u5728\u751F\u95F7\u6C14\uFF0C\u4FBF\u53C8\u5F00\u7740\u8F66\u5F80\u5B66\u6821\u8D76\u3002 \u542C\u5B8C\u5927\u53D4\u7684\u8BDD\uFF0C\u6211\u7A81\u7136\u60F3\u5230\u5927\u53D4\u8BF4\u7684\u90A3\u53E5\u201C\u7236\u6BCD\u7684\u5FC3\u601D\u4F60\u4EE5\u540E\u4F1A\u61C2\u7684\u201D\uFF0C\u56DE\u60F3\u8D77\u4E0A\u56DE\u8DEF\u4E0A\u6492\u7684\u6028\u6C14\uFF0C\u6211\u6709\u4E9B\u4E0D\u597D\u610F\u601D\u3002 \u8FD9\u56DE\uFF0C\u5927\u53D4\u4E3B\u52A8\u6253\u5F00\u4E86\u8BDD\u5323\u5B50\uFF0C\u7ED9\u6211\u4EEC\u8BB2\u751F\u6D3B\u6BB5\u5B50\u3002[\u8FD9\u6BB5\u5197\u4F59\uFF0C\u4E3A\u63A7\u5236\u7BC7\u5E45\u5220\u53BB]\u5927\u53D4\u8BB2\u6545\u4E8B\u7279\u9017\uFF0C\u6211\u4EEC\u4E24\u4E2A\u5C0F\u59D1\u5A18\u7B11\u6210\u4E00\u56E2\uFF0C\u611F\u89C9\u4E00\u4F1A\u513F\u5C31\u5230\u4E86\u76EE\u7684\u5730\u3002\u4E0B\u8F66\u540E\uFF0C\u6211\u6CA1\u6709\u9A6C\u4E0A\u56DE\u5BB6\uFF0C\u800C\u662F\u5148\u53BB\u4E86\u8D9F\u82B1\u5E97\uFF0C\u4E70\u4E86\u4E00\u675F\u5EB7\u4E43\u99A8\u3002\u8FD9\u662F\u6211\u957F\u8FD9\u4E48\u5927\u7B2C\u4E00\u6B21\u7ED9\u7238\u5988\u4E70\u82B1\u3002\u63A8\u5F00\u5BB6\u95E8\uFF0C\u7238\u5988\u770B\u6211\u6BD4\u8BF4\u7684\u65F6\u95F4\u65E9\u56DE\u6765\u4E86\uFF0C\u773C\u795E\u91CC\u6EE1\u662F\u60CA\u559C\u3002\u6211\u8D70\u8FDB\u53A8\u623F\uFF0C\u9505\u91CC\u9EC4\u7116\u7F8A\u8089\u7684\u5473\u9053\u8BA9\u6211\u76F4\u6389\u53E3\u6C34\u3002 \u56E0\u4E3A\u4E24\u6B21\u987A\u98CE\u8F66\u7684\u7ECF\u5386\uFF0C\u6211\u548C\u5927\u53D4\u7684\u5973\u513F\u6210\u4E86\u597D\u95FA\u871C\uFF0C\u540E\u6765\u8FD8\u62A5\u4E86\u540C\u4E00\u4E2A\u793E\u56E2\uFF0C\u6BCF\u5929\u5F62\u5F71\u4E0D\u79BB\u3002\u5F53\u7136\uFF0C\u8FD8\u6709\u4E00\u4EF6\u5F00\u5FC3\u7684\u4E8B\uFF0C\u4EE5\u540E\u6BCF\u6B21\u56DE\u5BB6\u6211\u90FD\u6709\u514D\u8D39\u7684\u987A\u98CE\u8F66\u5750\u4E86\uFF01',
	              React.createElement('br', null),
	              '\u5728\u5C0F\u5C0F\u7684\u987A\u98CE\u8F66\u7A7A\u95F4\u91CC\uFF0C\u4E58\u5BA2\u548C\u8F66\u4E3B\u4EE5\u7B80\u5355\u7684\u5BD2\u6684\u62C9\u8FD1\u8DDD\u79BB\u3002\u653E\u4E0B\u6212\u5907\u540E\uFF0C\u4ED6\u4EEC\u5F7C\u6B64\u62B5\u8FBE\u5185\u5FC3\uFF0C\u5408\u62CD\u7684\u813E\u6027\u521B\u9020\u51FA\u65E0\u9650\u53EF\u80FD\u6027\uFF0C\u670B\u53CB\u3001\u642D\u6863\u4EE5\u81F3\u604B\u4EBA\u3002\u201C\u987A\u8DEF\u6210\u77E5\u5DF1\u201D\u7684\u6545\u4E8B\u56E0\u6B64\u53D8\u5F97\u5DE7\u5408\u4E14\u795E\u5947\u3002 \u5176\u5B9E\uFF0C\u6BCF\u4E00\u6BB5\u76F8\u9047\u90FD\u662F\u83AB\u5927\u7684\u7F18\u5206\uFF0C\u540C\u9053\u4E2D\u4EBA\u4E00\u76F4\u90FD\u5728\u3002\u6211\u4EEC\u8981\u6562\u4E8E\u64AC\u5F00\u5185\u5FC3\u7262\u7B3C\u91CC\u7684\u6761\u6761\u6846\u6846\uFF0C\u591A\u70B9\u771F\u8BDA\u3001\u4FE1\u4EFB\u548C\u52C7\u6C14\uFF0C\u7ED9\u672A\u6765\u9884\u7559\u4E00\u4EFD\u60CA\u559C\u3002 \u8FD9\u662F\u201C\u9047\u89C1\u987A\u98CE\u8F66\u201D\u4E13\u680F\u7684\u7B2C\u4E09\u671F\u3002\u5E0C\u671B\u8FD9\u4E9B\u4EBA\u7684\u6545\u4E8B\u80FD\u591F\u7ED9\u4E88\u4F60\u529B\u91CF\uFF0C\u544A\u522B\u201C\u4E27\u201D\u4E0E\u201C\u762B\u201D\uFF0C\u52C7\u6562\u5954\u54112018\u5E74\u3002',
	              React.createElement('br', null)
	            )
	          )
	        )
	      );
	    }
	  }]);
	
	  return bosom;
	}(React.Component);
	
	exports.default = bosom;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(64);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(69)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(64, function() {
				var newContent = __webpack_require__(64);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(65)();
	exports.push([module.id, "@charset \"UTF-8\";\n* {\n  -webkit-tap-highlight-color: transparent;\n  outline: 0; }\n\n*, blockquote, body, button, dd, dl, dt, fieldset, form, h1, h2, h3, h4, h5, h6, hr, input, legend, li, ol, p, pre, td, textarea, th, ul {\n  margin: 0;\n  padding: 0;\n  vertical-align: baseline; }\n\nimg {\n  border: 0 none;\n  vertical-align: top; }\n\nem, i {\n  font-style: normal; }\n\nol, ul {\n  list-style: none; }\n\nbutton, h1, h2, h3, h4, h5, h6, input, select {\n  font-size: 100%;\n  font-family: inherit; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\na {\n  text-decoration: none; }\n\na, body {\n  color: #666; }\n\nbody {\n  margin: 0 auto;\n  height: 100%;\n  font-family: Helvetica,STHeiti STXihei,Microsoft JhengHei,Microsoft YaHei,Arial;\n  line-height: 1.5;\n  font-size: 100%;\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-text-size-adjust: 100% !important;\n  text-size-adjust: 100% !important; }\n\ninput[type=text], textarea {\n  -webkit-appearance: none;\n  appearance: none; }\n\n.warn-wp {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: #eadace; }\n  .warn-wp .warn-con {\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    width: 250px;\n    height: 150px;\n    margin: -75px 0 0 -125px; }\n  .warn-wp .warn-icon {\n    display: block;\n    width: 74px;\n    height: 110px;\n    margin: 0 auto;\n    -webkit-transform: rotate(-90deg);\n    -webkit-animation: changescreen 2s ease-in infinite;\n    -webkit-animation-play-state: initial;\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAADbCAYAAABp7qMUAAAQuklEQVR4Xu2dD4gVxx3H3yEEhJQEwZLQYqgkFJQES8WgGBpSBCWSoEQqisViSPCwRFIalEpKSkqEQrFUPCJKpUFJaVAihgaPlgZFUSoRQySlUokQlEolQlEiyPX7vdu9PN+99+Y3u7Nzb3a/A8Op95vZme/v4+z836GWZxgbG3sASZYhLkWchzgLcQ7ibM+sZD44ClxHUa4g3kC8iHgScXRoaOimTxGHrMaAaAFstyGuQrzPmk52ySpwByU/grgTUJ231MIJEyBiq/Mm4gZLhrKppQLvoFY7ABVbr56hL0wAaRNS7lFLVEtAfCvFlmoYQO3vlbArTIBoBhLsQtzi+0TZ116B3ajhVkB1t7OmU2DKQDoGw+W1l0UVLKrAKBKu6ASqG0x8rW0u+hSla4wCI4BpuL2298CEVokQESYFKWBRgH2okdxwEiaA9Cj+8VN1ti0ayiZTgJ3y+QDqEv/eDtNB/H1dojIdQLnZMUwxcKDDCeBUwyHAtH4SJrRKi/CXM6nWBuXmxNr2FMsP7Y+j3FxRSDkshP7nxlsmVOgwfnBmO9WQMkwnEm+ZyMwRwLR6CCBxbe0qYspLJCnD9DG051JVyoF9p4cJE/tJ7C+lHFKG6QKEfzxl8bOyrydM+/AXLpukHFKG6XMIz/XP1MNewnQKtViceE1SholdjIcS15/FP02Y6lCZlGH6Eo7gHrHUwzXCdAu1mJl4TVKG6Ston/LgJ0fnNmEaSxwkFv8a4heJ1uP7iZZ7SrHrAlNd/JF0PQRT0u4brMILpsHyR9KlEUxJu2+wCi+YBssfSZdGMCXtvsEqvGAaLH8kXRrBlLT7BqvwRWHi2amzg1UVlSagAt9CXq/75lcUpvXYDHXI92GyT0MBLIpwSwy3xngFweQlVzOMBVMz/BylloIpiszNeIhgaoafo9RSMEWRuRkPEUzN8HOUWgqmKDI34yGCqRl+jlJLwRRF5mY8RDA1w89RaimYosjcjIcIpmb4OUotBVMUmZvxEMHUDD9HqWVsmFZjCwpvr1eooQKxYVoJmD6ooY6qEhQQTMIgmAKCKZiUykgwiYFgCgimYFIqI8EkBoIpIJiCSamMBJMYCKaAYAompTISTGIgmAKCKZiUykgwiYFgCgimYFIqI8EkBoIpIJiCSamMBJMYCKaAYAompTISTGIgmAKCKZiUykgwiYFgCgimYFIqI8EkBoIpIJiCSamMBJMYCKaAYAompTISTDVjAA7l51Y3IB7AgdfzMasnmEqoDfFmIPlixHmIvJ3/O4j55+H5MebZiPk3gOnYu4j/RDwJRwf/7AfKsw15v5VV6T08Y02J6nknFUyekkEwfv59GeKPsp9FPwd/G+lPI45mrQg/Pl04dIDEfAjsU4UzLJBQMBlEywDiq+PZDCC2SKHDOFSIbFHu+GSO8hHuvyC2l0sw+YhYtS2cNAvPeBVxC2LRFsi3mHwt7kTca4EKZZwD238g8pXaHgSTr/JV2MNB7O8Qol8g3l/FMwx5EqodAIqtVdeQlfMUfslOd2cQTAaRKzWBg36AB+xBZKd6EMJJFOJlQHWxszAo6z7826YehRRM0+W9bGTGD+95f3wvQpnZh9oOoH6bPwvlJUSEqVcQTBEcM+URcAyH839GXDodz/d4Ji9KW4vIaYi/I/J13CucBXxPeuRd2rTxozkI8ChUPI7IOaIUwicoJAcG/IRpv/AJYHoiZoUaDVM2W8whdedIKKYPqnqWYKpK2c58s/9Ffw0EEme1P0LkT04+8mceZuIPeWeerQlbQs6aV90SCqYYMAEkOvWM4VXRrzgf4pfvIR7F6+S6b7mz+aEXkG4VYhV9NcHk6xRfeziRLQVBYie2SCBAv+w2VC+SGdNkr1uOIp8rmkeXdIIpoJhds4Lj/oBfbCzwHC53cHh+rkBaUxKUjet9byOGmG0XTCbVCxrBWYSIMPkEzvFsBUQjPomK2mav4HeRvuyrTzAVdYIrXbbO9i/YcVhtDexMrwFInIWOFlDW7+JhFxD7zSO5yiOYXAoV/T0cdBBp13mk5/6j5wHSFY80pU1RzkXI5H3EfF9U0Twvo+xziyYukq4R80yZg9jptgYusj4JZ+Qb26zpStmhnBzd/RGRg4Sy4QrK/0jZTHzSNwWmYxCFe5EsgZvWnq5iJ2S/h8MR7bskLeV02dQephVwEudnooVs2M39PtawFmX8k9W4rF22jYQjuI1l8+pIX3uYnpqGzixHRhxyWwI34f/EYhjCJhsUHEZe3PYSOgimkIrCWZyvuYpo6YPcgN1jgIk/Kw9Z/4KvX+6UrCIIppCqwmEvIT++QiyBs9q/shiWtUG5FiCPE4hV7uIUTGUd1Z4eTuNC7jOGPP8Hm28DppsG21ImKBN3KHyM6NpCUuo5SCyYyiqYp8/W4P6Lv1tecfsB0ouhnt0vH5TrDfw+xm7Om6jTgzHq1KY51zs52eoVhiDKmFeKCeNoHXAUjy0SWyZL4FQAt5BUHlAuLpNwUtJnJr5IuaIOJljA2PNMMWGytgDscH8TMPG0bfIhm2qYHXvCte4wWacEPoDwK5OnaAAqUOeWiZ1cjppcgWfTfu0yGtTfZ3NV47s2q9weY6l/nWH6CgJYVt2jznhbnGKxyfY+sSPffr6PS0FHEV+LvUBd29dcNpK7ZXEKbBZO9/9oYzknzVA/Lgbz7oNegQvUT8SagM0LUcuWKZvL+Y/RSY9Mx/9iY9mmmKFuPIzAI+GuwF2hvLMgWqgrTDwBwo1wlvBgjMlKS0EsNnDYRthZdotGmzure8vENTlOWLquvuHMN2FKZloAMPFGlt8bwNuNev3UYBfMpJYtE9VBxSw7K3ltzcvB1IyQkce+p52o2/YIRZp8RJ1h4iIq55q6bYpjS8RLILi4yxFQMgEO24XCvmIosPpMBpG8TCA+7y7izWr5CVru7f4QEF32ymhAjFEfHmdfbihO9CmP2rZMBrGTNIHDuD/Lctjge/gPU+vbdqOtzSVJiqPQAImt67+NdfsGYOIAI1qoZcuESnEUtzl7HVR5wuQcHLY3lrc8RnIXUa75scqVP6euMPHsmc/RpjK6c6aZdyZVHuAsTlZy0tIVRlCmYZdR6N/XFSbuGeK22KoDD2jOj/E6gaN4yvczY4VWo0xHjLbBzARTcSl5BwH7gMG/NNCtSHBUv8tQ25NwqoNbkKMcjGh/cF1h4nSAz1k5X6S4V5xD7yhnAOEknmDh8pBlF0T0z1zk4tUVpkJ7kY1EXYIdD5PyZ5QAJ/mcSF6JsvEi1ehBMPlJzn3i7I9Ee4XAQbx/gDcBWwL7cHOna61RMFlcNGFzAJGXu3t918Se/VRLOIc7RTmCs5ywYQbDKF+Ue6S61Usw2bw9HetcnOVmv896vo7zaWyVosHeKZ1g6g8TR0Y/hoN4j2W0AKdwkZrHtDhfZg1sNaNNoKplsrplwo63xvGyryhD/7xoAIkb+3iuzufbLdE/bSGY/GBiZ5Yjoyiz2ywaQOJuAO7D8jmgydcaLyaLuqgrmPxgojVfczwKNfkBHP8s3CkAEXeG8rKvnyO6dod2Zjjtr7e2VrXQlMxAHw/PJvk+d7vRbMHJSd642/7lAXPiXoYoJ0dp3IZLkHxaozzL6Ftz+1W6rh1wzhiHhCnXkB3x/YijZeZyIDpHaLyslR9ItOxN6uZD3kvOydOB2b8umIq1L1xOYWvFK5350eZLcGrP63iyTjU71lyA5i1xZe/4ZgvJflLlVwD5yCOYfNSy2eafnKc1+0KEKGTgd1qWxFzOsRa+6TBxJGRZPLXqWbUdR5g/HESQWPEmw0SQliBy7Ysd4EEPbPHYR+L810CGJsP0IhzDzjT/RxEo7hcK8QGcKhzNmW2OJgf6WFZTYZqyrTWbTiBQPBY1KIEdbM4jRbuXvEzF6woTLyHtdXEFR1+8drDrgigE4Z3hPOhYdMhexh/taQ/gL7wax/vDiKEK4JtPXWHi6+rLLmLQMTxP1vfESrbQyslEzkgXmUz09UO7/d/wF866E/qkQpNg4uQeR0Lmi1AzqHiXOMGq8pu67AtxdyTvB6js44hVk9kkmH5WZo0NQnGykbPWfA2G6KizlSRAPEXCGfWB7lxbQKwrTFzzar85LuhtJxCNBxY4i80zbIyWT1bw1cp943x98a4DcwtpceQg2NQSJgqLinFzGc+a8aaT8SmAKgOex9X+Xhey8oRt8i2PS7/YMEW/TMElgH4fToHYMEU7Sh1OIuVkVUAwWZWSnVMBweSUSAZWBQSTVSnZORUQTE6JZGBVQDBZlZKdUwHB5JRIBlYFBJNVKdk5FRBMTolkYFVAMFmVkp1TAcHklEgGVgUEk1Up2TkVEExOiWRgVUAwWZWSnVMBweSUSAZWBQSTVSnZORUQTE6JZGBVQDBZlZKdUwHB5JRIBlYFBJNVKdk5FRBMTolkYFVAMFmVkp1TAcHklEgGVgUEk1Up2TkVEExOiWRgVUAwWZWSnVMBweSUSAZWBQSTVSnZORUQTE6JZGBVQDBZlZKdUwHB5JRIBlYFBJNVKdk5FRBMTolkYFVAMFmVkp1TAcHklEgGVgUEk1Up2TkVEExOiWRgVUAwWZWSnVMBweSUSAZWBWLDtBYF4y39CvVUgJ+Qfde3akU/Re/7HNk3QAHB1AAnx6qiYIqldAOeI5ga4ORYVRRMsZRuwHMEUwOcHKuKgimW0g14jmBqgJNjVVEwxVK6Ac8RTA1wcqwqCqbuSl/DPx9AHEW8iXgZkZ+w57eCX0B8FvG+WE5K5TmC6V5P8WPOOxB348POd3o5EQuhXLvalUGViq8rL6dg+lri6/jjSkB01qo6oHoDtq9b7etuJ5gmPMwW6WkfkHIwABRbqFfqDoqlfoJpQqXtAGmnRbBOG8A0A/92AXFekfR1SiOYWi12tucCJrZOhQKAeg4J3y+UuEaJBFOr9RuA9FoZn2at01XkMbtMPqmnFUyt1vOA6WhZRwKow8hjVdl8Uk4vmFqthYDpXFknqiPeagmmVusxwFR6PztgegtAbisLZcrpBVOrtQQwnS7rRMD0NvJ4qWw+KacXTCWmBdodD5g4PfB4yjCULbtgarVOo2VaUkZIgMQ1u8/K5FGHtIJpwouc/f6oqEMB00GkXVc0fV3SEaZbqMzMulSoYD0uIh1Hdd4Tl9DvGaQ9jsiZ8CaH24SJk20PNVmFrO6ca1rTb7dAp0bQjksoJxBnSb/WNcJ0CkIslhjjCpxEXAugvnDpkS2h8PV2v8u2Ib8/TZj2obKbGlJhSzX5qtuN+LtOqKAVN8QtQ3wVka83ha8V2EuY2HHk/zCFqQpwh+WNLPJVxlGbWqLupKwnTBSJ/SZtQ9V/p6IKcFfqw0NMrUXKohoqXabAEXQJVucwLcI/npE0UqCgAuOL5eMwZa2TJt4KKtnwZIcA0npq0A4TT1x8qr5Tw9Hwqz77SvPzXReTMGWt02b83OOXn6wbrMAwQBrJ638PTBlQhIlQKUiBfgqMAKThdoNuMHGN6RjicmkpBXoowJPOKwDT3b4wZa0TgeJ5sC2SUwp0KMDVga2dINFmSsvUnhDzT1xm4WtPE5piip1t9pH295KiL0xZKzUHP99E3CA9G6vAO6j5DoB0pZ8CTpjyxGilFuDP3DDP4zxqqerPFVuiI4g7AdF5S3XNMLVB9QD+zJXzpYjcz8O1PV43oz09FsUH04aL2fmiNjcKcivOKCDidULm8H8L1NuzPBucLAAAAABJRU5ErkJggg==);\n    background-size: 100%;\n    background-repeat: no-repeat; }\n  .warn-wp .warn-con p {\n    font-size: 14px;\n    margin-top: 30px; }\n\n@media only screen and (orientation: landscape) {\n  .warn-wp {\n    display: block !important; } }\n\n@media only screen and (orientation: portrait) {\n  .warn-wp {\n    display: none !important; } }\n\n.loading {\n  width: 90px;\n  height: 80px;\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  z-index: 400;\n  margin: -40px 0 0 -45px;\n  -webkit-border-radius: 10px;\n  background-color: rgba(0, 0, 0, 0.6);\n  text-align: center; }\n  .loading:after {\n    content: '加载中';\n    color: #fff;\n    font-size: 14px; }\n  .loading .loading-pic {\n    margin: 15px auto -3px;\n    width: 36px;\n    height: 36px;\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAgVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9d3yJTAAAAK3RSTlMAPjc8BDFALRMID0S1kRgGdTTgubJyXSBaDHlrvSeYTikcqYVTJGKhSd3Gfix5iQAAAdFJREFUOMuVkuuSoyAQhbmLBg0OKvEeNSaZff8H3AYz60RqtmrOH6n20OfrLtBRSRQl6Eedmf9EGEf+wM6hJ+O9r3KMub/T8ywwUSH676ZeCBqYcoyp3E2SYpyHcZiKiH2ZWCQoDuI8MZS9yV1x/KFqSgWPt+liLiit3zZztX4uKxxVkueJIxLWz2ivif8CMskYHDiOYuQVRziHI8sI4J9dgQgKzAm4JEMvMXl2y3d/iL8owQ4D2yOk9WUiX81XIqAQv3ticAiyxt/Y8Qmyd3nWE96od4apDnYyAeMvFA2qKAo1hPuF6YgTDG4+P5w+TdianDYRZD42/ddE5sJpJmGczH1cLn+DH9OxDxr10xsCb8yfQR7uPe8V3d/d1M6dUio77PJyuVS3/LVz+jCmUKYKNuhc1Tj56Ae0MQtnKOHJvywbI5SdKtesdqbBqMezhtqglldkctN3uMDW8VKNsadeKsfM7p0pOLJta5EtdSO2JyreUPtCdemE2jRtkayassxQILbAgCNCOk01dNda31hgEqroFiAr07SEmFtT6mvQaFBmztGXCdC0vrOjae46jXYTGpumZEFc6kk3JlDyrK4hufT72KZzOtfoR61Nsx5rfwFyfhxONqv6JQAAAABJRU5ErkJggg==) no-repeat 50% 50%;\n    -webkit-animation: rotate 1s linear infinite; }\n\n@-webkit-keyframes rotate {\n  from {\n    -webkit-transform: rotateZ(0deg); }\n  to {\n    -webkit-transform: rotateZ(360deg); } }\n\n.wrapper .main .bike-1 {\n  background: url("+__webpack_require__(66)+") no-repeat 0 0;\n  background-size: 100% 100%;\n  height: 33.35rem;\n  position: relative; }\n  .wrapper .main .bike-1 .more1 {\n    position: absolute;\n    width: 6rem;\n    height: 1.5rem;\n    top: 27.75rem;\n    left: 2.25rem; }\n  .wrapper .main .bike-1 .more2 {\n    position: absolute;\n    width: 6rem;\n    height: 1.5rem;\n    top: 27.75rem;\n    left: 11rem; }\n  .wrapper .main .bike-1 .down1 {\n    position: absolute;\n    width: 8.5rem;\n    height: 2.5rem;\n    top: 29.5rem;\n    left: 0.8rem; }\n  .wrapper .main .bike-1 .down2 {\n    position: absolute;\n    width: 8.5rem;\n    height: 2.5rem;\n    top: 29.5rem;\n    left: 9.55rem; }\n\n.wrapper .main .phone-1 {\n  background: url("+__webpack_require__(67)+") no-repeat 0 0;\n  background-size: 100% 100%;\n  height: 33.35rem;\n  position: relative; }\n  .wrapper .main .phone-1 .back {\n    position: absolute;\n    width: 8.5rem;\n    height: 2.75rem;\n    top: 1.5rem;\n    left: 0.75rem; }\n  .wrapper .main .phone-1 .down {\n    position: absolute;\n    width: 12.5rem;\n    height: 2.5rem;\n    top: 29.75rem;\n    left: 3.25rem; }\n  .wrapper .main .phone-1 .box {\n    position: absolute;\n    width: 15.75rem;\n    height: 19.5rem;\n    top: 6.375rem;\n    margin-left: -7.875rem;\n    left: 50%;\n    overflow: hidden;\n    overflow-y: auto;\n    overflow-x: hidden;\n    font-size: 0.6rem; }\n    .wrapper .main .phone-1 .box .box1 {\n      overflow: scroll; }\n    .wrapper .main .phone-1 .box .title {\n      font-size: 0.9rem;\n      margin: 0 auto;\n      text-align: center; }\n    .wrapper .main .phone-1 .box .author {\n      font-size: 0.95rem;\n      margin: 0 auto;\n      text-align: center; }\n\n.wrapper .main .jd-1 {\n  background: url("+__webpack_require__(68)+") no-repeat 0 0;\n  background-size: 100% 100%;\n  height: 33.35rem;\n  position: relative; }\n  .wrapper .main .jd-1 .back {\n    position: absolute;\n    width: 8.5rem;\n    height: 2.75rem;\n    top: 1.5rem;\n    left: 0.75rem; }\n  .wrapper .main .jd-1 .down {\n    position: absolute;\n    width: 12.5rem;\n    height: 2.5rem;\n    top: 29.75rem;\n    left: 3.25rem; }\n  .wrapper .main .jd-1 .box {\n    position: absolute;\n    width: 15.75rem;\n    height: 19.5rem;\n    top: 6.375rem;\n    margin-left: -7.875rem;\n    left: 50%;\n    overflow: hidden;\n    overflow-y: auto;\n    overflow-x: hidden;\n    font-size: 0.6rem; }\n    .wrapper .main .jd-1 .box .box1 {\n      overflow: scroll; }\n    .wrapper .main .jd-1 .box .title {\n      font-size: 0.9rem;\n      margin: 0 auto;\n      text-align: center; }\n    .wrapper .main .jd-1 .box .author {\n      font-size: 0.95rem;\n      margin: 0 auto;\n      text-align: center; }\n", ""]);

/***/ },
/* 65 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/index.8a58bce06baba622670cadab15dd9d07.png";

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/1.cdbff02ed299d01bf5d06d573ff77ea0.png";

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/2.39db0deb62cbfa7b823a742974266b67.jpg";

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);
//# sourceMappingURL=main.44b024127bfc6bfda4e7.js.map