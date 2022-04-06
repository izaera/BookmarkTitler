const CONFIG = {
	applicationFoldersName: 'Aplicaciones',
};

const bookmarks = [];

function collectBookmarks(node, parent, bookmarks) {
	if (node.type === 'folder') {
		for (const child of node.children) {
			collectBookmarks(child, node, bookmarks);
		}
	}
	else if (node.type === 'bookmark' && parent.title
			&& parent.title === CONFIG.applicationFoldersName) {
		bookmarks.push(node);
	}
}

async function loadConfig() {
	let applicationFoldersName = 
		await browser.storage.sync.get("applicationFoldersName");

	if (applicationFoldersName.length) {
		CONFIG.applicationFoldersName = applicationFoldersName;
	}

	//console.log('loadConfig', CONFIG);
}

async function reloadBookmarks() {
	const tree = await browser.bookmarks.getTree();

	bookmarks.length = 0;

	collectBookmarks(tree[0], {}, bookmarks)
}

async function updateTabsTitles() {
	const tabs = await browser.tabs.query({});

	for (const tab of tabs) {
		updateTabTitle(tab);
	}
}

function updateTabTitle(tab) {
	for (const bookmark of bookmarks) {
		if (tab.url.startsWith(bookmark.url)) {
			const newTitle = '🦊 ' + bookmark.title;

			//console.log('updateTabTitle', `"${newTitle}"`, '--', tab.url);

			tab.title = newTitle;

			browser.tabs.executeScript(tab.id, {
				code: `document.title = '${tab.title}';`
			});

			return;
		}
	}
}

// listen for bookmarks being created
browser.bookmarks.onCreated.addListener(reloadBookmarks);

// listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(reloadBookmarks);

// listen to tab URL changes
browser.tabs.onUpdated.addListener(
	(_tabId, _changeInfo, tab) => updateTabTitle(tab)
);

loadConfig()
	.then(reloadBookmarks)
	.then(updateTabsTitles)
	.catch(console.error);
