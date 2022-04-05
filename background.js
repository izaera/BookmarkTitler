const APPLICATIONS_FOLDER = 'Aplicaciones';

const bookmarks = [];

function collectBookmarks(node, parent, bookmarks) {
	if (node.type === 'folder') {
		for (const child of node.children) {
			collectBookmarks(child, node, bookmarks);
		}
	}
	else if (node.type === 'bookmark' && parent.title
			&& parent.title === APPLICATIONS_FOLDER) {
		bookmarks.push(node);
	}
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
			tab.title = '🦊 ' + bookmark.title;

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

reloadBookmarks()
	.then(updateTabsTitles)
	.catch(console.error);
