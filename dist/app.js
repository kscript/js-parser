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
/******/ 	var hotCurrentHash = "f4589e4d007d9d5f25d3";
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
/******/ 	__webpack_require__.p = "./";
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
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _kst__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);



window.AST = _kst__WEBPACK_IMPORTED_MODULE_0__["AST"];
let sent = `
var a = "var a = '1'",
b = 2;
var $b1 =  ;"  var ds;"
function a(){
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
var c = '
1
3'
var d
var e = ;
var f= 
/*
var g = 4;
*//*1*//*222*/123
var h=5;
`
sent = `var s=window["webpackJsonp"]=window["webpackJsonp"]||[],f=s.push.bind(s);s.push=n,s=s.slice();`;
sent = `(function(e){function n(n){for(var o,r,i=n[0],u=n[1],s=n[2],f=0,p=[];f<i.length;f++)r=i[f],a[r]&&p.push(a[r][0]),a[r]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);l&&l(n);while(p.length)p.shift()();return c.push.apply(c,s||[]),t()}function t(){for(var e,n=0;n<c.length;n++){for(var t=c[n],o=!0,r=1;r<t.length;r++){var i=t[r];0!==a[i]&&(o=!1)}o&&(c.splice(n--,1),e=u(u.s=t[0]))}return e}var o={},r={app:0},a={app:0},c=[];function i(e){return u.p+"js/"+({}[e]||e)+"."+{"chunk-0a988e7e":"94e7c0dd","chunk-2d2378b5":"de95b4f7","chunk-46859144":"a167383e","chunk-689fb7ca":"24792659"}[e]+".js"}function u(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,u),t.l=!0,t.exports}u.e=function(e){var n=[],t={"chunk-0a988e7e":1,"chunk-46859144":1,"chunk-689fb7ca":1};r[e]?n.push(r[e]):0!==r[e]&&t[e]&&n.push(r[e]=new Promise(function(n,t){for(var o="css/"+({}[e]||e)+"."+{"chunk-0a988e7e":"74d6b2b1","chunk-2d2378b5":"31d6cfe0","chunk-46859144":"9c6539ce","chunk-689fb7ca":"067e9248"}[e]+".css",r=u.p+o,a=document.getElementsByTagName("link"),c=0;c<a.length;c++){var i=a[c],s=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(s===o||s===r))return n()}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){i=f[c],s=i.getAttribute("data-href");if(s===o||s===r)return n()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=n,p.onerror=function(n){var o=n&&n.target&&n.target.src||r,a=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");a.request=o,t(a)},p.href=r;var l=document.getElementsByTagName("head")[0];l.appendChild(p)}).then(function(){r[e]=0}));var o=a[e];if(0!==o)if(o)n.push(o[2]);else{var c=new Promise(function(n,t){o=a[e]=[n,t]});n.push(o[2]=c);var s,f=document.getElementsByTagName("head")[0],p=document.createElement("script");p.charset="utf-8",p.timeout=120,u.nc&&p.setAttribute("nonce",u.nc),p.src=i(e),s=function(n){p.onerror=p.onload=null,clearTimeout(l);var t=a[e];if(0!==t){if(t){var o=n&&("load"===n.type?"missing":n.type),r=n&&n.target&&n.target.src,c=new Error("Loading chunk "+e+" failed.\n("+o+": "+r+")");c.type=o,c.request=r,t[1](c)}a[e]=void 0}};var l=setTimeout(function(){s({type:"timeout",target:p})},12e4);p.onerror=p.onload=s,f.appendChild(p)}return Promise.all(n)},u.m=e,u.c=o,u.d=function(e,n,t){u.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,n){if(1&n&&(e=u(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(u.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)u.d(t,o,function(n){return e[n]}.bind(null,o));return t},u.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(n,"a",n),n},u.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},u.p="/",u.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],f=s.push.bind(s);s.push=n,s=s.slice();for(var p=0;p<s.length;p++)n(s[p]);var l=f;c.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";var o=t("5c1c"),r=t.n(o);r.a},"56d7":function(e,n,t){"use strict";t.r(n);var o=t("113c"),r=(t("3a0f"),t("a3a3"),t("4d0b"),t("329b")),a=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},c=[],i={name:"app",created:function(){window.app=this}},u=i,s=(t("034f"),t("048f")),f=Object(s["a"])(u,a,c,!1,null,null,null);f.options.__file="App.vue";var p=f.exports,l=t("f2de"),d={appKey:"",token:"",account:"",sid:"",isInit:!1,isLogin:!1,profile:{},blacks:{map:{},list:[]},mutes:{map:{},list:[]},pushevents:{},sessions:{list:[],sessions:{}},friends:{},emoji:{base:"",state:0,group:[],icon:{},map:{}},talks:{state:0,list:[]},nim:null},m=(t("cf54"),t("25d7"),{nim:function(e,n){e.state.nim=n},talks:function(e,n){var t=e.state.talks;return 1===t.state?t:(t.state=1,e.commit("talks",t),n.$axios({url:"/talks",method:"GET"}).then(function(n){var t={state:1,list:n.data.data||[]};return e.commit("talks",t),t}))},emoji:function(e,n){var t=e.state.emoji;return 1===t.state?t:(t.state=1,e.commit("emoji",t),n.$axios({url:"/emoji",method:"GET",data:{type:"all"}}).then(function(n){var t=o(n.data.data);return e.commit("emoji",t),t}));function o(e){var n=[],t={base:"",state:1,group:[],icon:{},map:{}};for(var o in e)e.hasOwnProperty(o)&&(n=[],(e[o].list||[]).forEach(function(e){n.push(e.value),t.map[e.value]=e,t.icon[e.icon]=e.value}),t.group.push({name:o,list:n,label:e[o].label}));return t}}}),h=function(e,n){n instanceof Object&&(n=JSON.stringify(n)),localStorage.setItem(e,n)},g=function(e){var n=localStorage.getItem(e);try{return JSON.parse(n)}catch(t){return n}},v=function(e,n){return void 0===e[n]||b(e[n])?g(n):e[n]},y=function(e,n,t){return e[n]=t,h(n,t),e},b=function(e){var n,t=!0;if(e instanceof Object)for(n in e)t&&e.hasOwnProperty(n)&&(t=!1);return t},k=(t("5a09"),t("7eeb")),w=t.n(k),j=w.a,S=function e(n,t){var o="cajj8mt2qov0sw0ttm",r="oowcdhkdnau4un10qf2";return void 0===t?j.MD5(c(n+r)).toString():32===t.length&&t===e(n);function a(e,n,t){n=j.enc.Latin1.parse(n),t=j.enc.Latin1.parse(t);var o=j.enc.Utf8.parse(e),r=j.AES.encrypt(o,n,{iv:t,mode:j.mode.CBC,padding:j.pad.Pkcs7});return r}function c(e){var n=a(e,o,r),t=j.enc.Base64.stringify(n.ciphertext);return t}},O=function(e){var n="<"+S(S(e.account+e.appKey)+">"+S(e.token+e.appKey)+S(e.appKey));return n.slice(-9)+n.slice(0,9)},E={appKey:function(e){return v(e,"appKey")},token:function(e){return v(e,"token")},account:function(e){return v(e,"account")},profile:function(e){return v(e,"profile")||{}},isLogin:function(e){return v(e,"isLogin")&&v(e,"sid")===O({appKey:v(e,"appKey"),token:v(e,"token"),account:v(e,"account")})},friends:function(e){return e.friends},nim:function(e){return e.nim}},K={appKey:function(e,n){y(e,"appKey",n)},token:function(e,n){y(e,"token",n)},account:function(e,n){y(e,"account",n)},sid:function(e,n){y(e,"sid",O(n))},isLogin:function(e,n){y(e,"isLogin",n)},emoji:function(e,n){e.emoji=n},talks:function(e,n){e.talks=n},profile:function(e,n){n&&(n instanceof Array?n.forEach(function(n){e.profile[n.account]=n}):n.account?e.profile[n.account]=n:e.profile=n)},friends:function(e,n){n&&(n instanceof Array?n.forEach(function(n){e.friends[n.account]=n}):n.account&&(e.friends[n.account]=n.detail||{}))},isInit:function(e,n){e.isInit=n},sessions:function(e,n){e.sessions=n},blacks:function(e,n){var t={map:{},list:[]};n.forEach(function(e){t.list.push(e.account),t.map[e.account]=e}),e.blacks=t},mutes:function(e,n){var t={map:{},list:[]};n.forEach(function(e){t.list.push(e.account),t.map[e.account]=e}),e.mutes=t},pushevents:function(e,n){n&&n.account&&(e.pushevents[n.account]=n.info)}};r["default"].use(l["a"]);var L=new l["a"].Store({state:d,actions:m,getters:E,mutations:K}),x=t("7f43"),P=t.n(x),$=t("0e4f"),q=t.n($),T=P.a.create({baseURL:"/api/",timeout:15e3,transformRequest:[function(e){return e instanceof FormData?e:q.a.stringify(e)}]}),_=null,D=r["default"].prototype;T.interceptors.request.use(function(e){return _=D.$loading&&D.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.1)"}),e},function(e){return _&&_.close(),D.$msgbox({type:"error",title:"错误提示",message:e.message,center:!0,timer:3e3}).then(function(e){}).catch(function(e){}),Promise.reject(e)}),T.interceptors.response.use(function(e){return _&&_.close(),Promise.resolve(e)},function(e){return _&&_.close(),D.$msgbox({type:"error",title:"错误提示",message:e.message,center:!0,timer:3e3}).then(function(e){}).catch(function(e){}),Promise.reject(e)});var M=T,N=(t("20a2"),[]),A=function(){return arguments.length?N.push(arguments):N},I=function(e){try{return JSON.parse(JSON.stringify(e))}catch(n){return Object.assign({},e)}},B=t("88da"),J=t.n(B),C=(t("99fc"),t("ad06"),t("c43a"),t("3040"),t("cac2"),t("1e58"),t("b881")),R=t.n(C),U=t("b8e5");r["default"].use(U["a"]);var G=new U["a"]({base:"/",mode:"history",routes:[{path:"/",name:"index",redirect:"/message",meta:{requireLogin:!1,keep:!1},component:function(e){return t.e("chunk-2d2378b5").then(function(){var n=[t("fc24")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/login",name:"login",meta:{requireLogin:!1,keep:!1},component:function(e){return t.e("chunk-46859144").then(function(){var n=[t("b8a3")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/register",name:"register",meta:{requireLogin:!1,keep:!1},component:function(e){return t.e("chunk-0a988e7e").then(function(){var n=[t("43cb")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/message",name:"message",meta:{requireLogin:!0,keep:!1},component:function(e){return t.e("chunk-689fb7ca").then(function(){var n=[t("e2cb")];e.apply(null,n)}.bind(this)).catch(t.oe)}}]});G.beforeEach(function(e,n,t){e.meta.requireLogin?L.getters.isLogin?t():t({name:"login"}):t()});var F=G;r["default"].use(R.a,{}),r["default"].use(J.a);var z={install:function(){r["default"].prototype.$bus=new r["default"]({data:function(){return{evs:[]}}})}};r["default"].use(z),r["default"].config.productionTip=!1,r["default"].prototype.SDK=function(){if(window&&window.SDK)return window.SDK;throw new Error("缺少SDK")};var H={deviceOnly:!0},Q={},V=function(e,n){if(window&&window.SDK){e=e||{db:!0,account:L.getters.account};var t=L.getters,r=t.account,a=t.appKey,c=t.token,i=Object(o["a"])({account:r,appKey:a,token:c},e),u=Q[i.account];return u?u.promise:(e["db"]=!0,e["syncMsgReceipts"]=!0,e["needMsgReceipt"]=!0,e["syncSessionUnread"]=!0,e["syncRoamingMsgs"]=!0,Q[i.account]={promise:new Promise(function(e,n){i.onconnect=i.onconnect?i.onconnect(o):function(e){o("connect",e)},i.ondisconnect=i.ondisconnect?i.ondisconnect(o):function(e){o("disconnect",e)},i.onerror=i.onerror?i.onerror(o):function(e){o("error",e)};var t=window.SDK.NIM.getInstance(i);function o(o,r){return"disconnect"===o?(delete Q[i.account],{}):(Q[i.account].nim=t,"connect"!==o?n(r):e(t),t)}t.privateOptions=H})},Q[i.account].promise)}throw new Error("缺少SDK")};r["default"].prototype.$nim=V,r["default"].prototype.$axios=M,r["default"].prototype.$copy=I,r["default"].prototype.$log=A,new r["default"]({router:F,store:L,render:function(e){return e(p)}}).$mount("#app")},"5c1c":function(e,n,t){},"99fc":function(e,n,t){},c43a:function(e,n,t){}});`
window.ast = new _kst__WEBPACK_IMPORTED_MODULE_0__["AST"](sent,{});
console.log(ast);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AST", function() { return AST; });
/* harmony import */ var _type__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);



class AST {
  constructor(content, option){
    this.content = content;
    this.option = option;
    this.lines = content.split("\n")
    this.linenos = this.lineIndex();
    this.logs = [];
    this.termsTree = [];
    this.grammarTree = [];
    this.parse();
  }
  log(){
    this.logs.push(arguments);
  }
  lineIndex(lines){
    lines = lines || this.lines || [];
    let list = [];
    let count = 0;
    lines.forEach(item => {
      list.push(count);
      count += item.length + 1;
    });
    return list;
  }
  parse(){
    this.termsTree = this.buildTermsTree();
    this.grammarTree = this.buildGrammarTree(this.termsTree, 0);
  }
  buildTermsTree(content){
    content = content || this.content || '';
    let symbol;
    let list = [];
    let line = 0;
    let count = 0;
    let index = 0;
    let type = '';
    let text = '';
    let len = content.length;
    let map = {
      '/*': {
        left: '/*',
        right: '*/'
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
    
    console.time('buildTermsTree');
    let reg = /(var\s|let\s|const\s|function|if|for|\.|'|"|:|,|;|\{|\}|\(|\))|(==|[\+\-\*\/><=]|)=|\/\/|\/\*|\*\/|\n+/g
    symbol = reg.exec(content);
    while(symbol){
      if(symbol[0].charAt(0) === '\n'){
        list.push({
          s: symbol[0],
          i: symbol.index + count,
          l: line
        });
        line += symbol[0].length;
      } else {
        if(type === ''){
          if(symbol[0] === '\'' || symbol[0] === '\"' || symbol[0] === '/*'){
            type = symbol[0];
          } else {
            list.push({
              s: symbol[0],
              i: symbol.index + count,
              l: line
            });
          }
        }
        if(type !== ''){
          if(map[type]){
            // 基于左边界查找右边界
            index = content.slice(symbol.index + type.length).indexOf(map[type].right);
            if(index < 0){
              // 无注释结束标记
              if(type === '/*'){
              // 无右引号标记
              } else if(type === '"' || type === '\''){
                debugger
                throw(new Error('symbolError ' + type + 'at ' + line))
              }
              content = '';
            } else {
              // 右边界在content中的实际位置
              index += symbol.index;
              // 被左右边界包裹的内容
              text = content.slice(symbol.index + type.length, index);
              // 右边界后的内容
              content = content.slice(index + type.length + map[type].right.length);
              // 统计这一段落有多少行
              line += (text.match(/\n/g) || []).length;
              // 剩余字符的位置
              count = len - content.length;
              list.push({
                s: type,
                t: text,
                i: count - text.length - type.length  - map[type].right.length,
                l: line
              });
              type = '';
              // 截取过字符串时, 需要对正则的索引进行重置
              reg.lastIndex = 0;
            }
          }
        }
      }
      symbol = reg.exec(content);
    }
    console.timeEnd('buildTermsTree');
    return list;
  }
  restoreTermsTree(tree){
    tree = tree || this.termsTree || [];
    let content = '';
    tree.forEach(item => {
      content += item.s;
    });
    return content;
  }
  buildGrammarTree(tree, no){
    tree = tree || this.termsTree || [];
    let len = tree.length;
    let current = 0;
    let line = 0;
    let symbol;
    let res = [];
    let cTree; // 子树
    let realno;
    while(current < len - 1){
      symbol = tree[current];
      realno = current + no;
      switch(symbol.s.charAt(0)){
        case '\n':
            line += symbol.s.length;
          break;
        case 'v':
        case 'c':
        case 'l':
          if(/var|const|let/.test(symbol.s)){
            cTree = tree.slice(current);
            res = res.concat(this.parseStatement(cTree, (type, context, line) => {
              type = type.slice(0, -1);
              let block = this.realLine(context, realno);
              if(line.length){
                let body = this.fetchContent2(block);
                return new _type__WEBPACK_IMPORTED_MODULE_0__["default"].Statement(type, '', body, block, realno, symbol);
              }
              return [];
            }));
          }
          break;
        case 'f':
            if(symbol.s === 'function'){
              cTree = tree.slice(current);
              res = res.concat(this.parseFunction(cTree, (name, params, context) => {

                let func = new _type__WEBPACK_IMPORTED_MODULE_0__["default"].Functions(
                  'function', 
                  this.parseName(this.realLine(name, realno)),
                  this.parseParams(this.realLine(params, realno)),
                  this.parseContext(this.realLine(context, realno)),
                  realno,
                  symbol
                );
                func.child = this.buildGrammarTree(cTree.slice.apply(cTree, context), realno + context[0]);
                current += context[1];
                return func;
              }));
            }
            break;
        default: break;
      }
      current++;
    }
    return res;
  }
  /**
   * 取出内容
   * @param {array} line 边界符首尾行
   * @param {boolean} contain 是否包含边界符
   */
  fetchContent(line, contain = true){
    let start = line[0];
    let end = line[line.length-1];
    return this.content.slice(
      contain ? start.i : start.i + start.s.length,
      contain ? end.i : end.i - end.s.length -  start.s.length
    )
  }
  fetchContent2(line){
    let start = this.termsTree[line[0]];
    let end = this.termsTree[line[line.length-1]];
    return this.content.slice(start.i + start.s.length, end.i);
  }
  parseParams(block){
    return new _type__WEBPACK_IMPORTED_MODULE_0__["default"].FunctionParams(
      block,
      this.fetchContent2(block, false)
    );
  }
  parseContext(block){
    return new _type__WEBPACK_IMPORTED_MODULE_0__["default"].FunctionContext(
      block
      // this.fetchContent2(block, false)
    );
  }
  parseName(block){
    return this.trim(this.fetchContent2(block, false));
  }
  parseStatement(tree, cb){
    let type = tree[0].s;
    let content = this.sreachBlock(tree, type, /(\,|;|\n)/g, false, (current) => {
      return [];
    });
    return cb(type, content, tree.slice.apply(tree, content));
  }
  /**
   * 
   * @param {array} tree 查找树
   * @param {function} cb 回调
   */
  parseFunction(tree, cb){
    let name = this.sreachBlock(tree, /function/, /\(/, true);
    let params = this.sreachBlock(tree, /\(/, /\)/, true);
    let context = this.sreachBlock(tree, /\{/, /\}/, true);
    return cb(name, params, context, tree.slice.apply(tree, params), tree.slice.apply(tree, context));
  }
  
  realLine(line, current){
    return (line || []).map(item => {
      return item + current;
    })
  }
  /**
   * 
   * @param {array} tree 查找树
   * @param {string|RegExp} left 左边界
   * @param {string|RegExp} right 右边界
   * @param {boolean} nest 是否为嵌套
   * @param {function} error 不为嵌套, 且找到两个连续的左边界符时 
   */
  sreachBlock(tree = [], left, right, nest = false, error){

    let len = tree.length;
    let start = -1;
    let count = 0;
    let current = 0;
    let isFound = false;
    let symbol;
    let isError = false;
    // 如果不是字符串, 需传正则
    let leftReg = typeof left === 'string' ? new RegExp(left, 'g'): left;
    let rightReg = typeof right === 'string' ? new RegExp(right, 'g'): right;
    while(!isError && !isFound && current < len - 1){
      symbol = tree[current];
      if(leftReg.test(symbol.s)){
        if(start<0){
          start = current
        } else {
          if(!nest){
            isError = true;
          }
        }
        count++;
      } else if(rightReg.test(symbol.s)) {
        count--;
      }
      if(count === 0 && start >= 0){
        isFound = true;
      } else {
        current++;
      }
    }
    return isError ? error && error(current) : [start, current];
  }
  // 左右空格
  trim(str){
    str = str || '';
    return str.replace(/(^\s+|\s+$)/, '');
  }
  // 左空格
  trimLeft(str){
    str = str || '';
    return str.replace(/^\s+/, '');
  }
  // 右空格
  trimRight(str){
    str = str || '';
    return str.replace(/\s+$/, '');
  }
}


/***/ }),
/* 3 */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionParams", function() { return FunctionParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionContext", function() { return FunctionContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Functions", function() { return Functions; });
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
const FunctionParams = function(block, body = ''){
  this.block = block;
  this.body = body;
}

const FunctionContext = function(block, body = ''){
  this.block = block;
  this.body = body;
} 
const Functions = function(type, name, params, context, treeno, symbol){
  this.type = type;
  this.name = name;
  this.params = params;
  this.context = context;
  this.treeno = treeno;
  this.lineno = symbol.l;
  this.index = symbol.i;
  return this;
}
const Statement = function(type, name, body, block, treeno, symbol){
  this.type = type;
  this.name = name;
  this.body = body;
  this.block = block;
  this.treeno = treeno;
  this.lineno = symbol.l;
  this.index = symbol.i;
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

/* harmony default export */ __webpack_exports__["default"] = ({
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


/***/ })
/******/ ]);