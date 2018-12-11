/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "edcab236ad32e64e60bc";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
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
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
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
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
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
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_0_1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);



window.AST = _ast__WEBPACK_IMPORTED_MODULE_0__["AST"];
let sent = `
var a = "var a = '1'",
b = 2;
tvar $b1 =  ;"  var ds;"
var ss = function a(){
  var a =2;
  console.log(1);

  for(var i = 0; i<= 10; i++){
    console.log(i)
  }
  function b(a, b, c){
    var c = 2;
    return 111
  }
  return function(){
    return i
  }
}
ddf=12
var c = '
1
3'
let d
s
var e = ;
var f= 
var g
var h
d=1
dd=2
/*
var g = 4;
*//*1*//*222*/123
var h=5;
`
//sent = `var s=window["webpackJsonp"],f=s.push.bind(s);s.push=n,s=s.slice();`;
window.ast = new _ast__WEBPACK_IMPORTED_MODULE_0__["AST"](sent,{});
console.log(ast);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AST", function() { return AST; });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var ansi_colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var ansi_colors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ansi_colors__WEBPACK_IMPORTED_MODULE_2__);




class AST extends _core__WEBPACK_IMPORTED_MODULE_0__["Core"] {
  constructor(content, option){
    super(content, option);

    this.content = content;
    this.option = option;

    // 分行
    this.lines = content.split("\n");
    // 每行首字符在源码的实际位置
    this.linenos = this.lineIndex();

    // 词法树
    this.termsTree = [];

    // 语法树
    this.grammarTree = [];

    // 上下文环境
    this.contextTree = {
      scope: {}
    };

    // 定义左右边界符, 配合type使用
    this.ambitMap = {
      '/*': {
        left: '/*',
        right: '*/'
      },
      '/': {
        left: '/',
        right: '/'
      },
      '(': {
        left: '(',
        right: ')'
      },
      ')': {
        left: '(',
        right: ')'
      },
      '"':{
        left: '"',
        right: '"'
      },
      '\'':{
        left: '\'',
        right: '\''
      }
    }

    // 调用解析器
    this.parse();
  }

  parse(){
    // 词法树
    this.termsTree = this.buildTermsTree();
    // 语法树
    this.grammarTree = this.buildGrammarTree(this.termsTree, 0);
    this.contextTree.scope = this.buildContextTree(this.grammarTree);
  }
  
  /**
   * 构建词法树
   * @param {String} content 需要构建词法树的源码
   */
  buildTermsTree(content){
    content = content || this.content || '';

    let symbol;
    let list = [];
    let line = 0;
    let len = content.length;

    // 缓存一些需要处理的类型
    let type = '';
    // 取出一部分文本
    let text = '';
    // 截取位置
    let cutIndx = 0;

    let endIndex = 0;
    
    console.time('buildTermsTree');

    // 一些关键词, 包括: 声明/函数/判断/循环/分语句/条件/注释
    let reg = /(((\b)(var\s|let\s|const\s|function|if|for))|\'|\"|\.|:|,|;|\{|\}|\(|\))|(==|[\+\-\*\/><=]|)=|\/(\/|\*)|\n+/g;

    while(symbol = reg.exec(content)){
      if(endIndex !== symbol.index){
        let text = content.slice(endIndex, symbol.index);
        // if(text){
          list.push({
            s: 'un',
            t: text,
            i: endIndex + cutIndx,
            l: line
          });
        // }
      }
      // 如果是换行, 记录一下行数
      if(symbol[0].charAt(0) === '\n'){
        list.push({
          s: symbol[0],
          i: symbol.index + cutIndx,
          l: line
        });
        // 递增时需使用length, 因为可能存在多个换行符
        line += symbol[0].length;
        endIndex = symbol.index + symbol[0].length;
      } else {
        // 没有左边界符时
        if(type === ''){
          if(symbol[0] === '"' || symbol[0] === '\'' || symbol[0] === '/*' || symbol[0] === '/'){
            type = symbol[0];
          } else {
            list.push({
              s: this.trim(symbol[0]),
              i: symbol.index + cutIndx,
              l: line
            });
            endIndex = symbol.index + symbol[0].length;
          }
        }

        // 这里的判断, 与上一个不是互斥关系, 不能使用 else if
        // (为了逻辑清晰, 从上一个条件语句中分离, 实际上也可以合并);

        if(type !== '' && this.ambitMap[type]){
          let block = content.slice(symbol.index + type.length);
          // 基于左边界查找右边界
          let index = block.indexOf(this.ambitMap[type].right);
          if(type === '/'){
            index = (block.match(/([^\\])\/|\n/g) || []).index || -1;
            // console.log(index);
            // 找右边界符前, 先找到了换行符
            if(index >= 0 && block.charAt(index) === '\n'){
              throw(new Error('Invalid regular expression: missing /'))
            }
          }
          if(index < 0){
            // 无注释结束标记, 后面的内容视为注释
            if(type === '/*'){
            
            // 无正则右边界符, 报错
            } else if(type === '/'){
              
            }else if(type === '"' || type === '\'' ){
              console.log(type, symbol.s, content.slice(0, 10))
              // debugger
              // throw(new Error('symbolError ' + type + 'at ' + line))
            }
            // content = '';
          } else {
            // 右边界在content中的实际位置
            // index += symbol.index;
            
            // 被左右边界包裹的内容
            text = block.slice(0, index);
            // 截取右边界后的内容作为新的content
            content = block.slice(index + this.ambitMap[type].right.length);
            // 统计这一段落有多少行
            line += (text.match(/\n/g) || []).length;
            // 剩余字符的位置
            cutIndx = len - content.length;
            list.push({
              s: type,
              t: text,
              i: cutIndx - text.length - type.length  - this.ambitMap[type].right.length,
              l: line
            });
            type = '';
            // 截取过字符串时, 需要对正则的索引进行重置
            reg.lastIndex = 0;
            endIndex = 0;
          }
        }
      }
    }

    console.timeEnd('buildTermsTree');
    return list;
  }
  /**
   * 构建环境树
   * @param {Array} tree 语法树
   */
  buildContextTree(tree = [], scope = {}){
    let name;
    let value;
    let current;
    // console.log(tree);
    tree.forEach(item => {
      name = item.name;
      current = {
        scope: {},
        type: item.type,
        name: item.name,
        value: item instanceof _type__WEBPACK_IMPORTED_MODULE_1__["default"].Functions ? item : item.value
      };
      if(item instanceof _type__WEBPACK_IMPORTED_MODULE_1__["default"].Statement){
        scope[name] = current;
        if (item.value && item.value.type === 'function') {
          current.scope = this.buildContextTree(item.value.child, current.scope);
        }
      } else if(item instanceof _type__WEBPACK_IMPORTED_MODULE_1__["default"].Functions){
        if(name){
          scope[name] = current;
          if(item.child.length){
            current.scope = this.buildContextTree(item.child, current.scope);
          }
        } else {
          current.name = 'anonymous';
          current.value = item;
          scope['[[scope]]'] = scope['[[scope]]'] || [];
          scope['[[scope]]'].push(current);
          if(item.child.length){
            current.scope = this.buildContextTree(item.child, current.scope);
          }
        }
      } else if(item instanceof _type__WEBPACK_IMPORTED_MODULE_1__["default"].Assignment){
        name = this.trim(item.name.t);
        current.name = name;
        current.type = 'var';
        scope[name] = current;
        if(current.value  && current.value instanceof _type__WEBPACK_IMPORTED_MODULE_1__["default"].Functions && item.child.length){
          current['[[scope]]'] = this.buildContextTree(item.child, current['[[scope]]']);
        }
      }
    });
    return scope;
  }
  /**
   * 构建语法树
   * @param {String} tree 词法树
   */
  buildGrammarTree(tree, no = 0){
    tree = tree || this.termsTree || [];
    // 收敛代码片段
    tree = this.convergenceSnippet(tree, no);
    // console.log(tree);
    // 收敛声明
    tree = this.convergenceStatement(tree, no);
    
    return tree;
  }
  /**
   * 收敛一个函数块
   * @param {Array} tree 词法树片段
   * @param {number} no 词法树片段 在 AST词法树 的位置
   */
  convergenceFunction(tree, no = 0){
    tree = tree || this.termsTree || [];
    let list = [];
    let symbol;
    let current = 0;
    let len = tree.length;
    let realno;
    while (current < len) {
      symbol = tree[current];
      realno = current + no;
      if (symbol.s === 'function') {
        let cTree = tree.slice(current);
        list.push(this.parseFunction(cTree, (name, params, context) => {
          let block = this.realLine(context, realno);
          // 创建一个函数类型类
          let func = new _type__WEBPACK_IMPORTED_MODULE_1__["default"].Functions(
            'function', 
            this.parseName(this.realLine(name, realno)),
            this.parseParams(this.realLine(params, realno)),
            this.parseContext(block),
            realno,
            symbol
          );
          func.child = this.buildGrammarTree(this.fetchTree(this.termsTree, block), block[0]);
          current += context[1];
          return func;
        }));
      } else {
        list.push(symbol);
      }
      current += 1;
    }
    return list;
  }
  /**
   * 收敛代码片段
   * @param {Array} tree 词法树片段
   * @param {number} no 词法树片段 在 AST词法树 的位置
   */
  convergenceSnippet(tree, no = 0){
    tree = tree || this.termsTree || [];
    let list = [];
    let symbol;
    let current = 0;
    let len = tree.length;
    let realno;
    while (current < len) {
      symbol = tree[current];
      realno = current + no;
      if (symbol.s === 'function') {
        let cTree = tree.slice(current);
        list.push(this.parseFunction(cTree, (name, params, context) => {
          let block = this.realLine(context, realno);
          // 创建一个函数类型类
          let func = new _type__WEBPACK_IMPORTED_MODULE_1__["default"].Functions(
            'function', 
            this.parseName(this.realLine(name, realno)),
            this.parseParams(this.realLine(params, realno)),
            this.parseContext(block),
            realno,
            symbol
          );
          func.child = this.buildGrammarTree(this.fetchTree(cTree, context), block[0]);
          current += context[1];
          return func;
        }));
      } else if(/(\'|\")/.test(symbol.s)){
        list.push(new _type__WEBPACK_IMPORTED_MODULE_1__["default"].StringBlock(symbol, realno));
      } else if(symbol.s === '/*'){
        list.push(new _type__WEBPACK_IMPORTED_MODULE_1__["default"].AnnotationBlock(symbol, realno));
      } else {
        list.push(symbol);
      }
      current += 1;
    }
    return list;
  }
  /**
   * 收敛声明
   * @param {Array} tree 词法树片段
   * @param {number} no 词法树片段 在 AST词法树 的位置
   */
  convergenceStatement(tree, no = 0, a, b){
    // console.log(tree, no, a, b);
    
    tree = tree || this.termsTree || [];
    let list = [];
    let symbol;
    let current = 0;
    let len = tree.length;
    let realno;
    let type = '';
    let cTree;
    while (current < len) {
      symbol = tree[current];
      realno = current + no;
      cTree = tree.slice(current);
      if (/\b(var|let|const)/.test(symbol.s)) {
        type = symbol.s;
        let result = this.parseStatement(cTree, (content) => {
          let statement = [];
          let end = content.length ? content[content.length - 1] : [0, 0];
          content.forEach(item => {
            let contentTree = this.splitStatement(type, this.fetchTree(cTree, item), realno, (type, name, value) => {
              statement.push(new _type__WEBPACK_IMPORTED_MODULE_1__["default"].Statement(type, name, value, this.realLine(item, realno), realno));
            });
            // cTree = cTree.slice(item[1]);
          });
          current += end[1];
          return statement;
        });
        if(result){
          list = list.concat(result);
        }
      } else if(symbol.s === 'un'){
        this.convergenceUnknown(cTree, realno, (type, line, result) => {
          current += line;
          if (result) {
            list.push(result);
          }
        });
      } else if(symbol.s === 'for'){
        this.convergenceLoop(cTree, realno, () => {
          list.push(symbol);
        });
      } else {
        list.push(symbol);
      }
      current += 1;
    }
    return list;
  }
  /**
   * 收敛未知语句
   * @param {Array} tree 词法树
   * @param {Number} no 在主词法树中的位置
   */
  convergenceUnknown(tree = [], no = 0, cb){
    let len = tree.length
    let symbol;
    let type = 'un';
    let line = 0;
    if (len === 1) {
      symbol = tree[0];
      // symbol = new TYPE.StringBlock(tree[0], no);
    } else if(len > 1) {
      symbol = tree[0];
      let next = tree[1];
      if(next.s === '='){
        type = 'assignment';
        if(len === 2){
          return ;
        }
        line = 2;
        if(/(var|let|const|function|\n|,|;)/.test(tree[3].s)){
          line += 1;
        }
        symbol = this.parseAssignment(tree.slice(0,4), no);
      } else if(/(var|let|const|function|,|;|\n)/.test(next.s)){
        symbol = tree[0];
        // symbol = new TYPE.StringBlock(tree[0], no);
      }
    }
    return cb(type, line, symbol);
  }
  /**
   * 收敛for循环体
   * @param {Array} tree 词法树
   * @param {Number} no 在主词法树中的位置
   */
  convergenceLoop(tree = [], no = 0, cb){
    let protasis;
    let content;
    let protasisTree = [];
    let contentTree = [];
    protasis = this.searchBlockDiff(tree, /\(/, /\)/, 'nest');
    protasisTree = this.fetchTree(tree, protasis);
    if(protasis[1] < 0){
      // throw(new Error('for 循环体 ) 缺失'))
    } else {
      content = this.searchBlockDiff(tree.slice(protasis[1]), /\{/, /\}/, 'nest');
      contentTree = this.fetchTree(tree.slice(protasis[1]), content);
    }
    console.log(
      // tree, 
      no,
      protasisTree,
      contentTree
      // this.buildGrammarTree(protasisTree, no + protasis[0]), 
      // this.buildGrammarTree(contentTree, no + protasis[1] + content[0])
    );
    return cb && cb(protasis, content);
  }
  parseAssignment(tree, no){
    return new _type__WEBPACK_IMPORTED_MODULE_1__["default"].Assignment(tree[0], tree[2], tree[3] || null, no);
  }
  verifyName(name){
    return this.trim(name);
  }
  splitStatement(type, tree = [], no = 0, cb){
    let left = this.searchBlockDiff(tree, /(var|let|const|,)/, /=/, 'block');
    let right = this.searchBlockDiff(tree, /=/, /(\,|;|function)/, 'block');
    let leftTree = this.fetchTree(tree, left[1] < 0? [0, tree.length] : left);
    let leftState = this.searchValid(leftTree, 
      this.createObjByList(['un']), 
      {},
      {}
    );
    let rightTree;
    let rightState;
    let name;
    let value;
    if(leftTree.length < tree.length){
      if(right[0] >= 0){
        rightTree = this.fetchTree(tree, right[1] < 0 ? [right[0], tree.length] : right);
        rightState = this.searchValid(rightTree,
          this.createObjByList(['=', ',', '\n']),
          {},
          this.createObjByList(['/*']),
        );
        // 有等号 没赋值
        if(rightState.otherList.length === 0 && rightState.res['=']){
          // throw(new Error('='))
        } else {
          value = ((rightState.otherList[0] || {}).symbol||{});
        }
        
        // console.log(tree, right, rightTree, rightState, rightState.otherList)
      }
    }

    if(leftState.len < 2){
      // throw(new Error(type + ' = 没有结束'));
    } else if(leftState.len === 2){
      if(res['un'] && res['un'].length === 1){
        name = this.verifyName(res['un'][0].t);
      }
    } else if(leftState.len >= 3){
      let res = leftState.res;
      if(res['un']){
        if(res['un'].length === 1){
          name = this.verifyName(res['un'][0].t);
        } else {
          // throw(new Error(type + ' = '));
        }
      }
    } else {
      // TODO: 需要处理声明中有其它字符; let /**/ name /* */;
    }
    // console.log(type, name, value, leftState, rightState)
    return cb ? cb(type, name, value) : [type, name, value];
  }
  /**
   * 查询有效节点
   * @param {Array} tree 要查询的词法树
   * @param {Object} white 白名单
   * @param {Object} black 黑名单
   * @param {Object} black 忽略名单
   * @param {Object} black 其它
   */
  searchValid(tree = [], white = {}, black = {}, ignore = {}){
    let res = {};
    let count = 0;
    let whiteList = [];
    let blackList = [];
    let ignoreList = [];
    let otherList = [];
    let key;
    tree.forEach((symbol, index) => {
      key = /\n+/.test(symbol.s)? '\n' : symbol.s;
      if(symbol.s == 'un' && /^\s+$/.test(symbol.t)){
        return ;
      }
      if(white[key]){
        whiteList.push({
          index,
          symbol
        });
      } else if(ignore[key]){
        ignoreList.push({
          index,
          symbol
        });
      } else if(black[key]){
        blackList.push({
          index,
          symbol
        });
      } else {
        otherList.push({
          index,
          symbol
        });
      }
      if(!res[key]){
        count++;
        res[key] = [symbol];
      } else {
        res[key].push(symbol);
      }
      
    });

    return {
      res,
      count,
      blackList,
      whiteList,
      ignoreList,
      otherList,
      len: tree.length
    };
  }
  /**
   *  分析函数块
   * @param {Array} tree 查找树
   * @param {Function} cb 回调函数
   */
  parseFunction(tree, cb){
    let name = this.searchBlockDiff(tree, /function/, /\(/, 'block');
    let params = this.searchBlockDiff(tree, /\(/, /\)/, 'nest', ()=>{});
    let context = this.realLine(this.searchBlockDiff(tree.slice(params[1]), /\{/, /\}/, 'nest'), params[1]);

    return cb(name, params, context);
  }
  parseName(block){
    return this.trim(this.fetchContent(block));
  }
  parseParams(block){
    return new _type__WEBPACK_IMPORTED_MODULE_1__["default"].FunctionParams(
      block,
      ''
    );
  }
  parseContext(block){
    return new _type__WEBPACK_IMPORTED_MODULE_1__["default"].FunctionContext(
      block,
      ''
    );
  }
  parseStatement(tree, cb, left, right, mode = 'block'){
    if(tree.length < 2){
      return;
    }
    let res = [];
    let content = this.searchBlockDiff(tree, left || /(var|let|const)/g, right || /(\,|;|function|\n+)/g, mode);
    let end = content[1];
    let current;
    res = res.concat([content]);
    // 处理,和换行符
    if(/(\,|\n+)/.test(tree[end].s)){
      let curTree = tree.slice(end);
      if (tree[end].s === ',') {
        current = this.parseStatement(curTree, content2 => {
          return this.realLine(content2[0], end);
        }, /,/g, /(\,|;|function)/g);
        res.push(current);
      } else {
        // 最后一句是声明
        if(tree.length === end){

        } else {
          current = this.parseStatement(curTree, content2 => {
            if(content2.length){
              let resTree = curTree[content2[0][1]];
              if(/(var|let|const)/.test(resTree.s)){
                return [];
              }
            }
            return this.realLine(content2[0], end);
          }, /\n+/g, /(var|let|const|,|;|function)/g, 'ignore');
          current.length && res.push(current);
        }
      }
    } else {
      
    }

    // res是个数组列表
    return cb ? cb(res) : res;
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Core", function() { return Core; });
/**
 * 将ast中不参与业务逻辑的工具方法抽出到父类
 * module Core
 */
class Core {
  constructor(content, option){
    this.content = content;
    this.option = option;
    this.logs = [];
  }
  /**
   * 日志
   */
  log(){
    this.logs.push(arguments);
  }
  /**
   * 每行在源码中的实际位置
   * @param {Array} lines 源码分割后得到的数组
   * @param {String=} splitStr 分割符, 一般为\n
   */
  lineIndex(lines, splitStr = '\n'){
    lines = lines || this.lines || [];
    let len  = splitStr.length;
    let list = [];
    let count = 0;
    lines.forEach(item => {
      list.push(count);
      count += item.length + len;
    });
    return list;
  }
  /**
   * 取得真实行号
   * @param {Array} line 截取的行
   * @param {Number} current 截取的行的开始位置
   */
  realLine(line, current){
    return (line || []).map(item => {
      return item + current;
    });
  }
  /**
   * 
   * @param {Array} tree 查找树
   * @param {String|RegExp} left 左边界
   * @param {String|RegExp} right 右边界
   * @param {string=} mode 嵌套模式 block(固定匹配左右: {}) | nest(可以嵌套: a={b:{}}) | ignore(忽略多余左边界符) var a \n\n var b
   * @param {Function=} error 不为嵌套, 且找到两个连续的左边界符时
   */
  searchBlockDiff(tree = [], leftReg, rightReg, mode = 'block', error){

    // 根据正负, 可以反映出 左右边界出现次数
    let count = 0;
    // 左边界
    let left = -1;
    // 右边界
    let right = -1;
    
    let isFound = false;
    let isError = false;

    let len = tree.length;
    let current = 0;
    while (!isError && !isFound && current < len - 1) {
      right = current;
      let symbol = tree[current];
      if(mode === 'ignore'){
        // console.log(symbol, left);
      }
      // 先查找左边界符
      // 不为忽略模式, 需要一直判断左边界符
      if (leftReg.test(symbol.s)) {
        // 找到第一个
        if (left < 0) {
          left = current;
        // 找到第二个
        } else {
          // 如果不允许嵌套, 则报错. 
          if (mode === 'block') {
            isError = true;
          }
        }
        count += 1;
      } else if (left >= 0 && rightReg.test(symbol.s)) {
        count -= 1;
        if(left >= 0 && mode === 'ignore'){
          isFound = true;
        }
      }
      // 如果存在左边界符, 且找到了右边界符, 则任务完成~
      if (left >= 0 && count === 0) {
        isFound = true;
      } else {
        current++;
        // right = current;
      }
    }
    if(!isFound){
      right = -1;
    }
    return isError ? error && error(current) : [left, right];
  }
  /**
   * 取出内容
   * @param {Array} block 截取范围
   */
  fetchContent(block, left = 0, right = 0){
    try{
      let start = this.termsTree[block[0]];
      let end = this.termsTree[block[block.length - 1]];
      return this.content.slice(start.i + start.s.length + left, end.i + right);
    }catch(e){
      return [];
    }
  }
  /**
   * 取出词法树
   * @param {Array} tree 指定要截取的树
   * @param {Array} block 截取范围
   */
  fetchTree(tree, block){
    tree = tree || this.termsTree || [];
    let start = block[0];
    let end = block[block.length-1] + 1;
    return tree.slice(start, end);
  }
  /**
   * 通过数组创建一个散列
   * @param {Array} tree 数组
   * @param {any|Array} block 值, 如果为数组时与 list 一一 对应
   */
  createObjByList(list = [], value = 1){
    let res = {};
    let mode = value instanceof Array ? 'list' : 'value';
    list.forEach((item, index) => {
      res[item] = mode === 'value' ? value : value[index];
    });
    return res;
  }
  verify(str){
    return str = typeof str === 'string'? str : '';
  }
  trim (str){
    return this.verify(str).replace(/(^\s+|\s+$)/, '');
  }
  trimLeft(str){
    return this.verify(str).replace(/^\s+/, '');
  }
  trimRight(str){
    return this.verify(str).replace(/(^\s+|\s+$)/, '');
  }
}
/* harmony default export */ __webpack_exports__["default"] = ({
  Core
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SourceLocation", function() { return SourceLocation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Position", function() { return Position; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Token", function() { return Token; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Identifier", function() { return Identifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Literal", function() { return Literal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegExpLiteral", function() { return RegExpLiteral; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Programs", function() { return Programs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bracket", function() { return Bracket; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionParams", function() { return FunctionParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionContext", function() { return FunctionContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Functions", function() { return Functions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Statement2", function() { return Statement2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Statement", function() { return Statement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpressionStatement", function() { return ExpressionStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmptyStatement", function() { return EmptyStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DebuggerStatement", function() { return DebuggerStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WithStatement", function() { return WithStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReturnStatement", function() { return ReturnStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LabeledStatement", function() { return LabeledStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreakStatement", function() { return BreakStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContinueStatement", function() { return ContinueStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IfStatement", function() { return IfStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SwitchStatement", function() { return SwitchStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SwitchCase", function() { return SwitchCase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThrowStatement", function() { return ThrowStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TryStatement", function() { return TryStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CatchClause", function() { return CatchClause; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhileStatement", function() { return WhileStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DoWhileStatement", function() { return DoWhileStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForInStatement", function() { return ForInStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Declarations", function() { return Declarations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionDeclaration", function() { return FunctionDeclaration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VariableDeclaration", function() { return VariableDeclaration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VariableDeclarator", function() { return VariableDeclarator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Expressions", function() { return Expressions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThisExpression", function() { return ThisExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayExpression", function() { return ArrayExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectExpression", function() { return ObjectExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Property", function() { return Property; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionExpression", function() { return FunctionExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnaryExpression", function() { return UnaryExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateOperator", function() { return UpdateOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BinaryExpression", function() { return BinaryExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssignmentExpression", function() { return AssignmentExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssignmentOperator", function() { return AssignmentOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MemberExpression", function() { return MemberExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConditionalExpression", function() { return ConditionalExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewExpression", function() { return NewExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SequenceExpression", function() { return SequenceExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlockStatement", function() { return BlockStatement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Block", function() { return Block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatementLeft", function() { return StatementLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatementRight", function() { return StatementRight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringBlock", function() { return StringBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotationBlock", function() { return AnnotationBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Assignment", function() { return Assignment; });
const SourceLocation  = function(){
  
}
const Position  = function(){
  
}
const Token = function(){
  
}
const Identifier = function(){
  
}
const Literal = function(){
  
}

const RegExpLiteral = function(){
  
}
const Programs = function(){
  
}
const Bracket = function(content, block){
  this.block = block;
  this.content = content;
}
const FunctionParams = function(block, body = '', child = []){
  this.block = block;
  this.body = body;
  this.child = child;
}

const FunctionContext = function(block, body = '', child = []){
  this.block = block;
  this.body = body;
  this.child = child;
} 
const Functions = function(type, name, params, context, treeno, symbol){
  this.type = type;
  this.s = type;
  this.name = name;
  this.params = params;
  this.context = context;
  this.treeno = treeno;
  this.lineno = symbol.l;
  this.index = symbol.i;
  return this;
}
const Statement2 = function(type, name, body, block, treeno, symbol){
  this.type = type;
  this.name = name;
  this.body = body;
  this.block = block;
  this.treeno = treeno;
  this.lineno = symbol.l;
  this.index = symbol.i;
}
const Statement = function(type, name, value, content, treeno){
  this.s = type;
  this.type = type;
  this.name = name;
  this.value = value;
  this.treeno = treeno;
  this.content = content;
}
const ExpressionStatement = function(){

  
}

const EmptyStatement = function(){

  
}

const DebuggerStatement = function(){

  
}
const WithStatement = function(){

  
}
const ReturnStatement = function(){

  
}
const LabeledStatement = function(){

  
}
const BreakStatement = function(){

  
}
const ContinueStatement = function(){

  
}
const IfStatement = function(){

  
}
const SwitchStatement = function(){

  
}
const SwitchCase = function(){

  
}
const ThrowStatement = function(){

  
}
const TryStatement = function(){

  
}
const CatchClause = function(){

  
}
const WhileStatement = function(){

  
}
const DoWhileStatement = function(){

  
}

const ForInStatement = function(){

  
}
const Declarations = function(){

  
}
const FunctionDeclaration = function(){

  
}


const VariableDeclaration = function(){

  
}


const VariableDeclarator = function(){

  

}

const Expressions = function(){

}

const ThisExpression = function(){

  
}
const ArrayExpression = function(){

  
}
const ObjectExpression = function(){

  
}

const Property = function(){

  
}

const FunctionExpression = function(){

  
}

const UnaryExpression = function(){

  
}
const UpdateOperator = function(){

  
}
const BinaryExpression = function(){

  
}
const AssignmentExpression = function(){

  
}
const AssignmentOperator = function(){

  
}

const MemberExpression = function(){

  
}
const ConditionalExpression = function(){

  
}
const NewExpression = function(){

  
}
const SequenceExpression = function(){

}
const BlockStatement = function(){

}
const Block = function(){

}
const StatementLeft = function(block, content){
  this.content = content;
  this.block = block;
}
const StatementRight = function(block, content){
  this.content = content;
  this.block = block;
}
const StringBlock = function(symbol, realno){
  this.s = symbol.s;
  this.type = symbol.s;
  this.body = symbol.t;
  this.treeno = realno;
  this.lineno = symbol.l;
  this.index = symbol.i;
}
const AnnotationBlock = function(symbol, realno){
  this.s = symbol.s;
  this.type = symbol.s;
  this.body = symbol.t;
  this.treeno = realno;
  this.lineno = symbol.l;
  this.index = symbol.i;
}
const Assignment = function(name, value, end, realno){
  this.name = name;
  this.value = value;
  this.end = end;
  this.realno = realno;
}


/* harmony default export */ __webpack_exports__["default"] = ({
  Bracket,
  Assignment,
  StringBlock,
  AnnotationBlock,
  StatementLeft,
  StatementRight,
  SourceLocation,
  Position,
  Block,
  BlockStatement,
  Token,
  Identifier,
  Literal,
  RegExpLiteral,
  Programs,
  Functions,
  Statement,
  ExpressionStatement,
  EmptyStatement,
  DebuggerStatement,
  WithStatement,
  ReturnStatement,
  LabeledStatement,
  BreakStatement,
  ContinueStatement,
  IfStatement,
  SwitchStatement,
  SwitchCase,
  ThrowStatement,
  TryStatement,
  CatchClause,
  WhileStatement,
  DoWhileStatement,
  ForInStatement,
  Declarations,
  FunctionDeclaration,
  VariableDeclaration,
  VariableDeclarator,
  Expressions,
  ThisExpression,
  ArrayExpression,
  ObjectExpression,
  Property,
  FunctionExpression,
  UnaryExpression,
  UpdateOperator,
  BinaryExpression,
  AssignmentExpression,
  AssignmentOperator,
  MemberExpression,
  ConditionalExpression,
  NewExpression,
  SequenceExpression,
  FunctionParams,
  FunctionContext
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

const colors = { enabled: true, visible: true, styles: {}, keys: {} };

if ('FORCE_COLOR' in process.env) {
  colors.enabled = process.env.FORCE_COLOR !== '0';
}

const ansi = style => {
  style.open = `\u001b[${style.codes[0]}m`;
  style.close = `\u001b[${style.codes[1]}m`;
  style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g');
  return style;
};

const wrap = (style, str, nl) => {
  let { open, close, regex } = style;
  str = open + (str.includes(close) ? str.replace(regex, close + open) : str) + close;
  // see https://github.com/chalk/chalk/pull/92, thanks to the
  // chalk contributors for this fix. However, we've confirmed that
  // this issue is also present in Windows terminals
  return nl ? str.replace(/\r?\n/g, `${close}$&${open}`) : str;
};

const style = (input, stack) => {
  if (input === '' || input == null) return '';
  if (colors.enabled === false) return input;
  if (colors.visible === false) return '';
  let str = '' + input;
  let nl = str.includes('\n');
  let n = stack.length;
  while (n-- > 0) str = wrap(colors.styles[stack[n]], str, nl);
  return str;
};

const define = (name, codes, type) => {
  colors.styles[name] = ansi({ name, codes });
  let t = colors.keys[type] || (colors.keys[type] = []);
  t.push(name);

  Reflect.defineProperty(colors, name, {
    get() {
      let color = input => style(input, color.stack);
      Reflect.setPrototypeOf(color, colors);
      color.stack = this.stack ? this.stack.concat(name) : [name];
      return color;
    }
  });
};

define('reset', [0, 0], 'modifier');
define('bold', [1, 22], 'modifier');
define('dim', [2, 22], 'modifier');
define('italic', [3, 23], 'modifier');
define('underline', [4, 24], 'modifier');
define('inverse', [7, 27], 'modifier');
define('hidden', [8, 28], 'modifier');
define('strikethrough', [9, 29], 'modifier');

define('black', [30, 39], 'color');
define('red', [31, 39], 'color');
define('green', [32, 39], 'color');
define('yellow', [33, 39], 'color');
define('blue', [34, 39], 'color');
define('magenta', [35, 39], 'color');
define('cyan', [36, 39], 'color');
define('white', [37, 39], 'color');
define('gray', [90, 39], 'color');
define('grey', [90, 39], 'color');

define('bgBlack', [40, 49], 'bg');
define('bgRed', [41, 49], 'bg');
define('bgGreen', [42, 49], 'bg');
define('bgYellow', [43, 49], 'bg');
define('bgBlue', [44, 49], 'bg');
define('bgMagenta', [45, 49], 'bg');
define('bgCyan', [46, 49], 'bg');
define('bgWhite', [47, 49], 'bg');

define('blackBright', [90, 39], 'bright');
define('redBright', [91, 39], 'bright');
define('greenBright', [92, 39], 'bright');
define('yellowBright', [93, 39], 'bright');
define('blueBright', [94, 39], 'bright');
define('magentaBright', [95, 39], 'bright');
define('cyanBright', [96, 39], 'bright');
define('whiteBright', [97, 39], 'bright');

define('bgBlackBright', [100, 49], 'bgBright');
define('bgRedBright', [101, 49], 'bgBright');
define('bgGreenBright', [102, 49], 'bgBright');
define('bgYellowBright', [103, 49], 'bgBright');
define('bgBlueBright', [104, 49], 'bgBright');
define('bgMagentaBright', [105, 49], 'bgBright');
define('bgCyanBright', [106, 49], 'bgBright');
define('bgWhiteBright', [107, 49], 'bgBright');

/* eslint-disable no-control-regex */
const re = colors.ansiRegex = /\u001b\[\d+m/gm;
colors.hasColor = colors.hasAnsi = str => {
  re.lastIndex = 0;
  return !!str && typeof str === 'string' && re.test(str);
};

colors.unstyle = str => {
  re.lastIndex = 0;
  return typeof str === 'string' ? str.replace(re, '') : str;
};

colors.none = colors.clear = colors.noop = str => str; // no-op, for programmatic usage
colors.stripColor = colors.unstyle;
colors.symbols = __webpack_require__(7);
colors.define = define;
module.exports = colors;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

const windows = {
  bullet: '•',
  check: '√',
  cross: '×',
  ellipsis: '...',
  heart: '❤',
  info: 'i',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  question: '?',
  questionSmall: '﹖',
  pointer: '>',
  pointerSmall: '»',
  warning: '‼'
};

const other = {
  ballotCross: '✘',
  bullet: '•',
  check: '✔',
  cross: '✖',
  ellipsis: '…',
  heart: '❤',
  info: 'ℹ',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  question: '?',
  questionFull: '？',
  questionSmall: '﹖',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  warning: '⚠'
};

module.exports = isWindows ? windows : other;
Reflect.defineProperty(module.exports, 'windows', { enumerable: false, value: windows });
Reflect.defineProperty(module.exports, 'other', { enumerable: false, value: other });

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)))

/***/ })
/******/ ]);