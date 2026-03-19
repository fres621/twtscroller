//#region src/registerStyles.ts
let reglist = /* @__PURE__ */ new Set();
window.registerStyles = function(styles) {
	if (reglist.has(styles)) return;
	reglist.add(styles);
	let stylesheet = new CSSStyleSheet();
	for (let className in styles) {
		let item = stylesheet.cssRules.item(stylesheet.insertRule(`.${className} {}`));
		for (let prop in styles[className]) item.style[prop] = styles[className][prop] + "";
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
const makeFetcher = some((a) => a.toString().includes("fetchUserTweets:"));
const featureSwitches = new FeatureSwitchThing(() => false);
const apiClient = new ApiClient(featureSwitches);
const auth = some((a) => a.toString().includes("auth_token&&"));
const req = some((e) => e.toString().includes("new XMLHttpRequest;let"));
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
const tweetTextParts = Object.values(_mods).find((e) => e.exports?.ZP?.tweetTextParts).exports?.ZP?.tweetTextParts ?? some((a) => a.toString().includes("tweetTextParts"));
const React = Object.values(_mods).find((e) => e.exports?.useEffect).exports;
const ReactDOM = Object.values(_mods).find((e) => e.exports?.createPortal).exports;
const TextPart = some((e) => e.type?.toString().includes(".MENTION?"));
const TweetImage = some((e) => e?.prototype?._renderImage);

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
	return /* @__PURE__ */ React.createElement("div", null, props.pages.map((page) => /* @__PURE__ */ React.createElement("span", {
		onClick: (_) => props.onClickPage(page.id),
		className: "paginator-page " + (page.id == props.selectedPageId ? " paginator-page-selected" : "")
	}, page.label)));
}

//#endregion
//#region src/fetcher.ts
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
function pageFetcher({ mod, userId: userId$1, eachPause, tenPause, pagesToKeep, initialState }) {
	let pagesCache = [];
	const cursors = initialState || [];
	let listeners = /* @__PURE__ */ new Set();
	async function fetchPageAndAddToCache(cursor) {
		let page = {
			cursor,
			entries: (await mod.fetchLikes({
				count: 20,
				userId: userId$1,
				cursor
			})).instructions[0].entries
		};
		pagesCache.push(page);
		if (pagesCache.length > pagesToKeep) pagesCache.shift();
		return page;
	}
	async function start() {
		let lastCursor = null;
		let i = 0;
		if (initialState && cursors.length) {
			await fetchPageAndAddToCache(cursors[0]);
			for (let listener of listeners) listener(cursors[0]);
			i = cursors.length;
			let { entries } = await fetchPageAndAddToCache(cursors.at(-1));
			lastCursor = entries.find((e) => e.content.cursorType == "Bottom").content.value;
		}
		while (true) {
			i++;
			let { entries, cursor } = await fetchPageAndAddToCache(lastCursor || null);
			/** < 3 means there's only cursors no content */
			if (entries.length < 3) break;
			cursors.push(cursor);
			localStorage.setItem("gaycache", JSON.stringify(cursors));
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
	function usePages() {
		const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
		React.useEffect(() => {
			listeners.add(forceUpdate);
			return () => void listeners.delete(forceUpdate);
		}, []);
		return cursors.map((cursor, i) => ({
			id: cursor,
			label: `${i + 1}`
		}));
	}
	return {
		start,
		usePages,
		getOrFetch
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
	let props = {
		testID: "tweetPhoto",
		withCenterCrop: true,
		withLink: true,
		aspectMode: {
			type: "ratioRange",
			minAspectRatio: .75,
			maxAspectRatio: 5
		},
		image: {
			type: "photo",
			"aria-label": "Image",
			cropCandidates: image.original_info.focus_rects,
			expandedUrl: { pathname: image.expanded_url },
			height: image.original_info.height,
			id_str: image.id_str,
			shouldShowAltLabel: false,
			url: image.media_url_https,
			width: image.original_info.width
		}
	};
	return React.createElement(TweetImage, props);
}
function getAST(tweet) {
	return tweetTextParts(tweet.full_text, tweet.display_text_range, tweet.entities);
}
const Tweet = React.memo(({ result }) => {
	let tweet = "tweet" in result ? result.tweet : result;
	let author = tweet.core.user_results.result;
	return /* @__PURE__ */ React.createElement("div", { style: {
		borderBottom: "gray solid 1px",
		display: "flex",
		gap: 4,
		padding: 4
	} }, /* @__PURE__ */ React.createElement("a", {
		href: `https://x.com/${author.core.screen_name}/status/${tweet.rest_id}`,
		target: "_blank",
		rel: "noopener noreferrer"
	}, /* @__PURE__ */ React.createElement("img", {
		src: author.avatar.image_url,
		style: {
			width: 32,
			height: 32,
			borderRadius: 16
		}
	})), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		flex: 1
	} }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, author.core.name), " @", author.core.screen_name), renderContentAST(getAST(tweet.legacy)), tweet.legacy.entities.media?.length && renderImage(tweet.legacy.entities.media[0]), tweet.quoted_status_result && /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid blue" } }, /* @__PURE__ */ React.createElement(Tweet, { result: tweet.quoted_status_result.result }))));
});
async function startAndInject() {
	let mod = await makeFetcher({
		apiClient,
		featureSwitches
	});
	let initialState = localStorage.getItem("gaycache");
	if (initialState && window.confirm("Use stored state?")) initialState = JSON.parse(initialState);
	else initialState = void 0;
	let fetcher = pageFetcher({
		mod,
		userId,
		pagesToKeep: 2,
		eachPause: 500,
		tenPause: 2e3,
		initialState
	});
	fetcher.start();
	ReactDOM.createRoot(document.querySelector("section")).render(React.createElement(App, { fetcher }));
}
function isTweetEntry(entry) {
	return !!entry.content.itemContent;
}
var ErrorBoundary = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error) {
		return { hasError: true };
	}
	componentDidCatch(error, info) {}
	render() {
		if (this.state.hasError) return this.props.fallback;
		return this.props.children;
	}
};
const NoPage = Symbol("NoPage");
function App({ fetcher }) {
	let pages = fetcher.usePages();
	let [page, setPage] = React.useState(NoPage);
	let [pageContent, setPageContent] = React.useState(null);
	const outOfPageLimbo = React.useRef(false);
	React.useEffect(() => {
		if (!outOfPageLimbo.current && pages.length > 0) {
			outOfPageLimbo.current = true;
			setPage(pages[0].id);
		}
	}, [pages]);
	React.useEffect(() => {
		if (page === NoPage) return;
		async function loadPage() {
			setPageContent(await fetcher.getOrFetch(page));
		}
		loadPage();
	}, [page]);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Paginator, {
		pages,
		onClickPage: (cursor) => setPage(cursor),
		selectedPageId: page === NoPage ? "" : page
	}), pageContent && /* @__PURE__ */ React.createElement(React.Fragment, null, pageContent.entries.filter(isTweetEntry).map((entry) => /* @__PURE__ */ React.createElement(ErrorBoundary, { fallback: /* @__PURE__ */ React.createElement("p", null, "Error loading tweet") }, /* @__PURE__ */ React.createElement(Tweet, { result: entry.content.itemContent?.tweet_results.result }))), /* @__PURE__ */ React.createElement(Paginator, {
		pages,
		onClickPage: (cursor) => setPage(cursor),
		selectedPageId: page === NoPage ? "" : page
	})));
}

//#endregion
//#region src/index.tsx
startAndInject();

//#endregion