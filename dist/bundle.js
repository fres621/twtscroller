//#region src/registerStyles.ts
let reglist = /* @__PURE__ */ new Set();
window.registerStyles = function(styles) {
	if (reglist.has(styles)) return;
	reglist.add(styles);
	let stylesheet = new CSSStyleSheet();
	for (let className in styles) {
		let item = stylesheet.cssRules.item(stylesheet.insertRule(`.${className} {}`));
		for (let prop in styles[className]) {
			console.log(prop, styles[className][prop]);
			item.style[prop] = styles[className][prop] + "";
		}
	}
	document.adoptedStyleSheets.push(stylesheet);
};

//#endregion
//#region src/finds.ts
let _mods = window.webpackChunk_twitter_responsive_web.push([
	[Symbol()],
	{},
	(r) => r.c
]);
window.webpackChunk_twitter_responsive_web.pop();
function some(condition) {
	for (let e of Object.values(_mods)) try {
		for (let a of Object.values(e.exports)) if (condition(a)) return a;
	} catch {}
}
const ApiClient = some((a) => a?.prototype?.getUnversioned);
const FeatureSwitchThing = some((a) => a.toString().includes("this.getFeatureSwitch"));
const makeFetcher = some((a) => a.toString().includes("fetchUserTweets:function"));
const featureSwitches = new FeatureSwitchThing(() => false);
const apiClient = new ApiClient(featureSwitches);
const auth = some((a) => a.toString().includes("auth_token&&"));
const req = some((e) => e.toString().includes("withCredentials,"));
apiClient.client._dispatch = (data) => req({
	...data,
	headers: {
		...data.headers,
		...Object.fromEntries(auth()),
		"x-twitter-auth-type": "OAuth2Session"
	}
});
let scr = [...document.querySelectorAll("body > script")].find((e) => e.innerText.includes("INITIAL_STATE")).innerText;
let session = JSON.parse(scr.slice(scr.indexOf(`"session"`) + 10, scr.indexOf("userFeatures") - 2) + "}");
const userId = session.user_id;
const tweetTextParts = Object.values(_mods).find((e) => e.exports?.ZP?.tweetTextParts).exports.ZP.tweetTextParts ?? some((a) => a.toString().includes("tweetTextParts"));
const React = Object.values(_mods).find((e) => e.exports?.useEffect).exports;
const ReactDOM = Object.values(_mods).find((e) => e.exports?.createPortal).exports;

//#endregion
//#region src/ui/Paginator.tsx
window.registerStyles({
	"paginator-page-selected": { background: "rgba(0, 0, 248, 0.23)" },
	"paginator-page": {
		display: "inline-block",
		background: "rgb(0 0 0 / 10%)",
		width: "32px",
		height: "24px",
		fontSize: "16px",
		fontWeight: "bold",
		borderRight: "1px solid gray",
		textAlign: "center",
		verticalAlign: "middle",
		"userSelect": "none"
	}
});
function Paginator(props) {
	return /* @__PURE__ */ React.createElement("div", null, Array.from({ length: props.pageAmount }, (_, i) => i).map((page) => /* @__PURE__ */ React.createElement("span", {
		onClick: (_) => props.onClickPage(page),
		className: "paginator-page " + (page == props.selectedPage ? " paginator-page-selected" : "")
	}, page + 1)));
}

//#endregion
//#region src/fetcher.ts
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
function pageFetcher({ mod, userId: userId$1, eachPause, tenPause, pagesToKeep }) {
	let pagesCache = [];
	const cursors = [];
	let listeners = /* @__PURE__ */ new Set();
	async function fetchPageAndAddToCache(cursor) {
		let entries = (await mod.fetchLikes({
			count: 20,
			userId: userId$1,
			cursor
		})).instructions[0].entries;
		pagesCache.push({
			entries,
			cursor
		});
		if (pagesCache.length > pagesToKeep) pagesCache.shift();
		return {
			cursor,
			entries
		};
	}
	async function start() {
		let lastCursor = null;
		let i = 0;
		while (true) {
			i++;
			let { entries, cursor } = await fetchPageAndAddToCache(lastCursor || null);
			/** < 3 means there's only cursors no content */
			if (entries.length < 3) break;
			cursors.push(cursor);
			lastCursor = entries.find((e) => e.content.cursorType == "Bottom").content.value;
			for (let listener of listeners) listener(cursor);
			await sleep(i > 0 && i % 10 == 0 ? tenPause : eachPause);
		}
	}
	async function getOrFetch(cursor) {
		let page = pagesCache.find((page$1) => page$1.cursor === cursor);
		if (page) return page;
		return await fetchPageAndAddToCache(cursor);
	}
	async function getOrFetchPageNumber(pageN) {
		return await getOrFetch(cursors[pageN]);
	}
	function useProgress() {
		return React.useSyncExternalStore((cb) => {
			listeners.add(cb);
			return () => listeners.delete(cb);
		}, () => cursors.length);
	}
	return {
		start,
		useProgress,
		getOrFetch,
		getOrFetchPageNumber
	};
}

//#endregion
//#region src/ui/ui.tsx
function renderContentAST(ast) {
	let colors = {
		hashtag: "blue",
		mention: "blue"
	};
	return /* @__PURE__ */ React.createElement("span", null, ast.map((node) => node.entityType == "emoji" ? /* @__PURE__ */ React.createElement("img", {
		src: node.url,
		style: {
			display: "inline",
			width: "1em",
			height: "1em"
		}
	}) : /* @__PURE__ */ React.createElement("span", {
		color: colors[node.entityType],
		style: { whiteSpace: "pre-wrap" },
		onClick: () => {
			if (node.url) location.href = node.url;
		}
	}, node.prefix || "", node.text || "")));
}
function renderImage(image) {
	image.original_info.focus_rects, image.expanded_url, image.original_info.height, image.id_str, image.media_url_https, image.original_info.width;
	console.log("oh img", image);
	return /* @__PURE__ */ React.createElement("img", {
		src: image.media_url_https,
		style: {
			maxWidth: "100%",
			objectFit: "contain"
		}
	});
}
function getAST(tweet) {
	console.log("get ast", tweet);
	return [{ text: tweet.full_text }];
}
function Tweet({ result }) {
	console.log({ tweet: result });
	let tweet = "tweet" in result ? result.tweet : result;
	let author = tweet.core.user_results.result;
	return /* @__PURE__ */ React.createElement("div", { style: {
		borderBottom: "gray solid 1px",
		display: "flex",
		gap: 4,
		padding: 4
	} }, /* @__PURE__ */ React.createElement("img", {
		src: author.avatar.image_url,
		style: {
			width: 32,
			height: 32,
			borderRadius: 16
		}
	}), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column"
	} }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, author.core.name), " @", author.core.screen_name), renderContentAST(getAST(tweet.legacy)), tweet.legacy.entities.media?.length && renderImage(tweet.legacy.entities.media[0]), tweet.quoted_status_result && /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid blue" } }, /* @__PURE__ */ React.createElement(Tweet, { result: tweet.quoted_status_result.result }))));
}
async function startAndInject() {
	let fetcher = pageFetcher({
		mod: await makeFetcher({
			apiClient,
			featureSwitches
		}),
		userId,
		pagesToKeep: 25,
		eachPause: 500,
		tenPause: 4e3
	});
	fetcher.start();
	ReactDOM.createRoot(document.querySelector("section")).render(React.createElement(App, { fetcher }));
}
function isTweetEntry(entry) {
	return !!entry.content.itemContent;
}
function App({ fetcher }) {
	let pages = fetcher.useProgress();
	let [page, setPage] = React.useState(-1);
	let [pageContent, setPageContent] = React.useState(null);
	const outOfPageLimbo = React.useRef(false);
	React.useEffect(() => {
		if (!outOfPageLimbo.current && pages > 0) {
			outOfPageLimbo.current = true;
			setPage(0);
		}
	}, [pages]);
	React.useEffect(() => {
		if (page == -1) return;
		async function loadPage() {
			setPageContent(await fetcher.getOrFetchPageNumber(page));
		}
		loadPage();
	}, [page]);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Paginator, {
		pageAmount: pages,
		onClickPage: (i) => setPage(i),
		selectedPage: page
	}), pageContent && pageContent.entries.filter(isTweetEntry).map((entry) => /* @__PURE__ */ React.createElement(Tweet, { result: entry.content.itemContent?.tweet_results.result })));
}

//#endregion
//#region src/index.tsx
startAndInject();

//#endregion