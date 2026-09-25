import type { Entry, Tweet, TweetLegacy } from '../types/api'
import { Paginator } from './Paginator';
import { apiClient, featureSwitches, makeFetcher, userId, React, tweetTextParts, TextPart, TweetImage, SectionComponent } from '@finds';
import { FetcherModule, Page, pageFetcher } from '@fetcher';

function renderContentAST(ast: any[]) {
    // if (!ast.length) return null;
    // return ast.map((part,key) => <TextPart part={part} key={key} linkify={true} />);
    let colors: Record<string, string> = { hashtag: 'blue', mention: 'blue' };
    return (
        <span className='paginator-text paginator-tweet-content'>
            {ast.map((node: any) =>
                node.entityType == 'emoji' ? (
                    <img src={node.url} style={{ display: 'inline', width: '1em', height: '1em' }} />
                ) : (
                    <span
                        color={colors[node.entityType]}
                        style={{ whiteSpace: 'pre-wrap' }}
                        onClick={() => {
                            if (node.url) location.href = node.url;
                        }}>
                        {node.prefix || ''}
                        {node.text || ''}
                    </span>
                )
            )}
        </span>
    );
}

function renderImage(image: any) {
    let props = {
        testID: 'tweetPhoto',
        withCenterCrop: true,
        withLink: true,
        aspectMode: {
            type: 'ratioRange',
            minAspectRatio: 0.75,
            maxAspectRatio: 5,
        },
        image: {
            type: 'photo',
            'aria-label': 'Image',
            cropCandidates: image.original_info.focus_rects,
            expandedUrl: { pathname: image.expanded_url },
            height: image.original_info.height,
            id_str: image.id_str,
            shouldShowAltLabel: false,
            url: image.media_url_https,
            width: image.original_info.width,
        },
    };
    // console.log('oh img', image);
    // return <img src={image.media_url_https} style={{ maxWidth: "100%", objectFit: "contain" }} />;
    return React.createElement(TweetImage, props);
}


// type Result = NonNullable<(typeof sample[0]['entries'])[number]['content']['itemContent']>['tweet_results']['result'];

function getAST(tweet: TweetLegacy) {
    // console.log('get ast', tweet);
    return tweetTextParts(tweet.full_text, tweet.display_text_range, tweet.entities);
    // return [{ text: tweet.full_text }];
    // return wreq(310452).ZP.tweetTextParts(tweet.full_text, tweet.display_text_range, tweet.entities);
}

const Tweet = React.memo(({ result }: { result: Tweet }) => {
    let tweet = "tweet" in result ? result.tweet as Tweet : result;
    let author = tweet.core.user_results.result;
    return (
        <div style={{ borderBottom: 'gray solid 1px', display: 'flex', gap: 4, padding: 4 }}>
            <a href={`https://x.com/${author.core.screen_name}/status/${tweet.rest_id}`} target="_blank" rel="noopener noreferrer">
                <img src={author.avatar.image_url} style={{ width: 32, height: 32, borderRadius: 16 }} />
            </a>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span className='paginator-text paginator-tweet-author'>
                    <b>{author.core.name}</b> @{author.core.screen_name}
                </span>
                {renderContentAST(getAST(tweet.legacy))}
                {tweet.legacy.entities.media?.length && renderImage(tweet.legacy.entities.media[0])}
                {tweet.quoted_status_result && (
                    <div style={{ border: '1px solid blue' }}>
                        <Tweet result={tweet.quoted_status_result.result} />
                    </div>
                )}
            </div>
        </div>
    );
});

function replaceLikesComponent(c: any) {
    let injected: any;
    let original = SectionComponent.prototype.render;
    SectionComponent.prototype.render = function () {
        if (this.props.title !== "Likes") return original.apply(this);
        if (injected) return injected;
        window.scrollTo(0, 0);
        injected = c;
        return injected;
    }
    window.scrollTo(0, document.body.scrollHeight);
}

export async function startAndInject() {
    let mod = await makeFetcher({
        apiClient,
        featureSwitches
    });
    let initialState: any = localStorage.getItem("gaycache");
    if (initialState && window.confirm("Use stored state?")) {
        initialState = JSON.parse(initialState);
    } else {
        initialState = undefined;
    }
    let fetcher = pageFetcher({ mod, userId, pagesToKeep: 2, eachPause: 500, tenPause: 2000, initialState });
    fetcher.start();
    replaceLikesComponent(React.createElement(App, { fetcher }));
}

function isTweetEntry(entry: Entry) {
    return !!entry?.content?.itemContent;
}

class ErrorBoundary extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {

    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}

const NoPage = Symbol("NoPage");
export function App({ fetcher }: { fetcher: FetcherModule }) {
    let pages = fetcher.usePages();
    let [page, setPage] = React.useState<string | typeof NoPage>(NoPage);
    let [pageContent, setPageContent] = React.useState<Page | null>(null);
    const outOfPageLimbo = React.useRef(false);
    // console.log(pages.length, pages, pageContent);
    React.useEffect(() => {
        if (!outOfPageLimbo.current && pages.length > 0) {
            outOfPageLimbo.current = true;
            setPage(pages[0].id);
        }
    }, [pages]);

    React.useEffect(() => {
        // console.log(4);
        if (page === NoPage) return;
        async function loadPage() {
            const content = await fetcher.getOrFetch(page as string);
            setPageContent(content);
        }
        loadPage();
    }, [page]);
    return (
        <>
            <Paginator pages={pages} onClickPage={(cursor) => setPage(cursor)} selectedPageId={page === NoPage ? "" : page} />
            {pageContent && (
                <>
                    {pageContent.entries.filter(isTweetEntry).map(entry => (
                        <ErrorBoundary fallback={<p>Error loading tweet</p>}>
                            <Tweet
                                result={entry.content.itemContent?.tweet_results.result!}
                            />
                        </ErrorBoundary>
                    ))}
                    <Paginator pages={pages} onClickPage={(cursor) => setPage(cursor)} selectedPageId={page === NoPage ? "" : page} />
                </>
            )}
        </>
    )
}

export default App
