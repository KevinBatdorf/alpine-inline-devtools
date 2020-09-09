/******/ (function(modules) { // webpackBootstrap
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

window.alpineDevToolsHandler = function (position) {
  return {
    alpines: [],
    open: false,
    observer: null,
    windowRef: null,
    start: function start() {
      this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)');
      if (!this.alpines) return;
      this.registerAlpines(this.alpines); // If the window is already open, refresh it

      if (sessionStorage.getItem('alpine-devtools')) {
        this.openWindow();
        this.updateAlpines();
      }
    },
    registerAlpines: function registerAlpines(alpines) {
      var _this = this;

      this.observer = new MutationObserver(function (mutations) {
        _this.updateAlpines();
      });
      alpines.forEach(function (alpine) {
        // This will trigger a mutation when internal data changes but no visual mutation is observed
        alpine.setAttribute('x-bind:data-last-refresh', 'Date.now()');

        _this.observer.observe(alpine, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      });
    },
    updateAlpines: function updateAlpines() {
      this.checkIfNewAlpinesWereAddedAndRegisterThem();

      if (this.windowRef) {
        this.windowRef.alpines = this.alpines;
        var viewer = this.windowRef.document.querySelector('#alpine-devtools-viewer');
        if (!viewer) return;
        typeof viewer.__x !== 'undefined' && viewer.__x.updateElements(viewer);
      }
    },
    checkIfNewAlpinesWereAddedAndRegisterThem: function checkIfNewAlpinesWereAddedAndRegisterThem() {
      var _this2 = this;

      var fresh = _toConsumableArray(document.querySelectorAll('[x-data]:not(#alpine-devtools)'));

      var newAlpines = fresh.filter(function (alpine) {
        return !_toConsumableArray(_this2.alpines).includes(alpine);
      });

      if (newAlpines) {
        this.alpines = document.querySelectorAll('[x-data]:not(#alpine-devtools)');
        this.registerAlpines(newAlpines);
      }
    },
    openWindow: function openWindow() {
      this.windowRef = window.open('', 'alpine-devtools', 'width=450, height=650, left=100, top=100');
      if (!this.windowRef) return sessionStorage.removeItem('alpine-devtools');
      this.windowRef.document.body.style.backgroundColor = '#1a202c';
      this.windowRef.document.body.innerHTML = '';
      this.windowRef.document.title = 'Alpine DevTools';
      this.windowRef.alpines = this.alpines;

      if (!this.windowRef.document.getElementById('alpine-devtools-script')) {
        var alpineScript = this.windowRef.document.createElement('script');
        alpineScript.id = 'alpine-devtools-script';
        var version = window.Alpine.version || '2.x.x';
        alpineScript.src = "https://cdn.jsdelivr.net/gh/alpinejs/alpine@v".concat(version, "/dist/alpine.min.js");
        this.windowRef.document.head.appendChild(alpineScript);
      }

      if (!this.windowRef.document.getElementById('tailwindcss-devtools-style')) {
        var tailwindCSS = this.windowRef.document.createElement('link');
        tailwindCSS.id = 'tailwindcss-devtools-style';
        tailwindCSS.href = 'https://unpkg.com/tailwindcss@^1.x/dist/tailwind.min.css';
        tailwindCSS.rel = 'stylesheet';
        this.windowRef.document.head.appendChild(tailwindCSS);
      }

      if (!this.windowRef.document.getElementById('devtools-script')) {
        var devtoolsScript = this.windowRef.document.createElement('script');
        devtoolsScript.id = 'devtools-script';
        devtoolsScript.setAttribute('type', 'text/javascript'); // TODO: possibly throw an error if this fails

        devtoolsScript.src = window.alpineDevToolsScriptURL;
        this.windowRef.document.head.appendChild(devtoolsScript);
      }

      this.setUpPopupData();
    },
    setUpPopupData: function setUpPopupData() {
      var _this3 = this;

      var viewer = this.windowRef.document.createElement('div');
      viewer.id = 'alpine-devtools-viewer';
      viewer.setAttribute('x-data', 'window.alpineDevToolsViewer(window.alpines)');
      viewer.innerHTML = this.viewerHTML(); // Add the reference to the session so we don't need to reopen the popup everytime

      sessionStorage.setItem('alpine-devtools', this.windowRef.name);
      this.open = true;
      setTimeout(function () {
        _this3.windowRef.document.body.appendChild(viewer);
      }, 500);
      this.windowRef.addEventListener('beforeunload', function () {
        sessionStorage.removeItem('alpine-devtools');
        _this3.windowRef = null;
        _this3.open = false;
      });
    },
    viewerHTML: function viewerHTML() {
      return "\n            <div\n                class=\"flex flex-col justify-between fixed inset-0 bg-gray-900 text-gray-400 py-2 max-w-screen overflow-hidden\"\n                x-cloak\n                x-show=\"open\">\n\t\t\t\t<div\n\t\t\t\t\tclass=\"divide-y-2 divide-gray-800 space-y-5 -mt-5 pb-5 p-2 overflow-scroll\">\n\t\t\t\t\t<template x-for=\"(alpine, i) in [...alpines]\" :key=\"i\">\n                        <div class=\"pt-5\">\n                            <div class=\"pl-4 overflow-hidden\">\n                                <div x-text=\"computeTitle(alpine)\" class=\"mb-1 -ml-3 font-extrabold\" style=\"color:#d8dee9\"></div>\n                                <template x-if=\"!getAlpineData(alpine).length\"><p class=\"text-sm\">No data found</p></template>\n                                <template x-for=\"[key, value] of getAlpineData(alpine)\" :key=\"key\">\n                                    <div\n                                        class=\"leading-none\"\n                                        x-html=\"getItem(key, value, i)\"\n                                        x-show=\"getType(value) !== 'function'\">\n                                    </div>\n                                </template>\n\t\t\t\t\t\t    </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</template>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"border-t border-gray-700 text-gray-500 leading-none mx-2\" style=\"font-size:11px; padding-top:5px;\">\n\t\t\t\t\t<a class=\"hover:text-blue-500 mr-px\" target=\"_blank\" href=\"https://twitter.com/kevinbatdorf\">@kevinbatdorf</a>\n\t\t\t\t\t\xB7\n\t\t\t\t\t<a class=\"hover:text-blue-500 mx-px\" target=\"_blank\" href=\"https://github.com/kevinbatdorf/alpine-inline-devtools\">github</a>\n\t\t\t\t</div>\n\t\t\t</div>";
    }
  };
};

window.alpineDevToolsViewer = function () {
  return {
    computeTitle: function computeTitle(alpine) {
      return alpine.getAttribute('x-title') || alpine.getAttribute('aria-label') || alpine.id || this.convertFunctionName(alpine.getAttribute('x-data')) || "<".concat(alpine.tagName.toLowerCase(), ">");
    },
    getAlpineData: function getAlpineData(alpine) {
      if (!alpine.__x) return [];
      return Object.entries(alpine.__x.getUnobservedData());
    },
    getType: function getType(value) {
      // Leave as object for now until we need it
      // if (value === null) {
      //     return 'null'
      // }
      if (Array.isArray(value)) {
        return 'array';
      }

      if (typeof value === 'function') {
        return 'function';
      }

      return _typeof(value);
    },
    updateAlpine: function updateAlpine(type, alpineIndex, key, value) {
      switch (type) {
        case 'boolean':
          window.alpines[alpineIndex].__x.$data[key] = value !== 'true';
          break;

        case 'string':
          window.alpines[alpineIndex].__x.$data[key] = value;
          break;
      }
    },
    getItem: function getItem(key, value) {
      var alpineIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var id = Date.now() + Math.floor(Math.random() * 1000000);
      var type = this.getType(value);
      return "\n            <span class=\"relative py-1 pl-2 ".concat(type === 'string' ? 'flex' : 'inline-block', "\">\n                <span class=\"absolute left-0 -ml-3\">\n                    ").concat(this.getGutterAction(id, type, alpineIndex, key, value), "\n                </span>\n\t\t\t\t<span style=\"color:#4aea8b\" class=\"text-serif whitespace-no-wrap mr-2\">\n\t\t\t\t\t<label for=\"").concat(id, "\" class=\"inline-block\" style=\"min-width:1rem\">").concat(key, "</label>\n\t\t\t\t\t<span class=\"text-white\">:</span>\n\t\t\t\t\t<span style=\"color:#8ac0cf\" class=\"bg-gray-800 px-1 text-xs\">").concat(type, "</span>\n\t\t\t\t</span>\n                <span\n                    class=\"").concat(type === 'boolean' ? 'cursor-pointer' : '', "\"\n                    style=\"color:#d8dee9\">\n                        <span class=\"relative z-10\">\n                            ").concat(this.getValue(id, type, alpineIndex, key, value), "\n                            ").concat(this.getEditField(id, type, alpineIndex, key, value), "\n                        </span>\n                </span>\n\t\t\t</span>");
    },
    getEditField: function getEditField(id, type, alpineIndex, key, value) {
      switch (type) {
        case 'string':
          return "<span\n                        contenteditable=\"true\"\n                        class=\"absolute inset-0 bg-gray-300 text-black text-xs p-1 focus:outline-none\"\n                        @change.stop=\"updateAlpine('".concat(type, "', '").concat(alpineIndex, "', '").concat(key, "', '").concat(value, "')\">\n                        ").concat(value, "\n                    </span>");
      }

      return '';
    },
    getGutterAction: function getGutterAction(id, type, alpineIndex, key, value) {
      switch (type) {
        case 'boolean':
          return "\n                        <input\n                            id=\"".concat(id, "\"\n                            style=\"margin-top:3px;\"\n                            type=\"checkbox\"\n                            :checked=\"").concat(value, "\"\n                            @change.stop=\"updateAlpine('boolean', '").concat(alpineIndex, "', '").concat(key, "', '").concat(value, "')\">");

        case 'string':
          if (alpineIndex === null) return ''; // Probably in an array or object

          return "\n                        <button\n                            id=\"".concat(id, "\"\n                            @click=\"\"\n                            class=\"transition duration-200 w-4 mt-px text-white focus:outline-none\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                                <path d=\"M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z\" />\n                            </svg>\n                        </button>");

        default:
          return '';
      }
    },
    getValue: function getValue(id, type, alpineIndex, key, value) {
      var _this4 = this;

      switch (type) {
        case 'boolean':
          return value;

        case 'number':
          return value;

        case 'string':
          return this.escapeHTML("\"".concat(value, "\""));

        case 'array':
          if (!value) return value;
          return Object.entries(value).map(function (_ref) {
            var _ref2 = _toArray(_ref),
                item = _ref2.slice(0);

            return "<ul class=\"pl-4\">".concat(_this4.getItem(item[0], item[1]), "</ul>");
          }).join('');

        case 'object':
          if (!value) return value;
          return Object.entries(value).map(function (_ref3) {
            var _ref4 = _toArray(_ref3),
                item = _ref4.slice(0);

            return "<ul class=\"pl-4\">".concat(_this4.getItem(item[0], item[1]), "</ul>");
          }).join('');
      }

      return value;
    },
    convertFunctionName: function convertFunctionName(functionName) {
      if (functionName.indexOf('{') === 0) return;
      var name = functionName.replace(/\(([^\)]+)\)/, '').replace('()', '').replace(/([A-Z])/g, " $1");
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
    },
    escapeHTML: function escapeHTML(html) {
      var div = document.createElement('div');
      div.innerText = html;
      return div.innerHTML;
    }
  };
};

function setAlpineDevToolsScriptSource() {
  // Discover the file name to inject into to popup
  var alpineDevToolsScript;

  if (alpineDevToolsScript = document.getElementById('alpine-devtools-script')) {
    window.alpineDevToolsScriptURL = alpineDevToolsScript.src;
  } else {
    // Create an error to fine the source
    var possibleFileName = new Error().stack.split("\n"); // Grab the first URL

    possibleFileName = possibleFileName.find(function (string) {
      return new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(string);
    }); // Extract the URL

    possibleFileName = possibleFileName.match(/(https?:\/\/[^ ]*)/)[1]; // Split at the end to remove anything after .js

    var lastIndex = possibleFileName.lastIndexOf('.js');
    possibleFileName = possibleFileName.slice(0, lastIndex);

    if (Array.isArray(possibleFileName)) {
      possibleFileName = possibleFileName[0];
    }

    window.alpineDevToolsScriptURL = possibleFileName + '.js';
  }
}

try {
  setAlpineDevToolsScriptSource();
} catch (error) {
  console.error('Alpine DevTools: We couldn\'t identify the source script');
}

function alpineDevTools() {
  var alpineDevToolsComponent = document.createElement('button');
  alpineDevToolsComponent.id = 'alpine-devtools';
  alpineDevToolsComponent.setAttribute('x-data', 'alpineDevToolsHandler()');
  alpineDevToolsComponent.setAttribute('x-show.transition.out.opacity.duration.1000', 'alpines.length && !open');
  alpineDevToolsComponent.setAttribute('x-bind:class', '{"alpine-button-devtools-closed" : !open}');
  alpineDevToolsComponent.setAttribute('x-on:click', 'openWindow');
  alpineDevToolsComponent.setAttribute('x-on:open-alpine-devtools.window', 'openWindow');
  alpineDevToolsComponent.setAttribute('x-init', '$nextTick(() => { start() })');
  alpineDevToolsComponent.textContent = 'Alpine Devtools';
  alpineDevToolsComponent.style.cssText = "position:fixed!important;bottom:0!important;right:0!important;margin:4px!important;padding:5px 8px!important;border-radius:10px!important;background-color:#1a202c!important;color:#d8dee9!important;font-size:14px!important;outline:0!important;z-index:2147483647!important;min-width:0!important;max-width:130px!important;"; // Set some hard styles on the button based on need

  var styleSheet = document.createElement('style'); // Force the opacity when the button is open. I noticed TailwindUI is messing with this otherwise, for example

  styleSheet.appendChild(document.createTextNode('.alpine-button-devtools-closed{opacity:1!important}'));
  document.head.appendChild(styleSheet);
  document.body.appendChild(alpineDevToolsComponent);
}

var alpine = window.deferLoadingAlpine || function (alpine) {
  return alpine();
};

window.deferLoadingAlpine = function (callback) {
  alpine(callback);
  alpineDevTools();
}; // Used for when injecting the script into a random page


window.forceLoadAlpineDevTools = function () {
  setAlpineDevToolsScriptSource();
  alpineDevTools();
};

/***/ }),

/***/ 0:
/*!************************!*\
  !*** multi ./index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/kevin/code/alpinejs/alpine-inline-devtools/index.js */"./index.js");


/***/ })

/******/ });