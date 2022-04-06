function saveOptions(e) {
	e.preventDefault();
	browser.storage.sync.set({
		color: document.querySelector("#applicationFoldersName").value
	});
}

function restoreOptions() {
	function setCurrentChoice(result) {
		document.querySelector("#applicationFoldersName").value = 
			result.applicationFoldersName || "Aplicaciones";
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	let getting = browser.storage.sync.get("applicationFoldersName");
	getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
