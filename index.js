function FunctionName() {
	Array.from(document.querySelectorAll('[x-data]')).forEach(alpineComponent => {
		console.log(alpineComponent)
	})
}

const buffered = window.deferLoadingAlpine || false
window.deferLoadingAlpine = function (alpine) {
	FunctionName()
	typeof buffered == "function" && buffered()
	alpine()
}

module.exports = FunctionName