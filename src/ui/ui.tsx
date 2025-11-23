import type { Entry, Tweet, TweetLegacy } from '../types/api'
import { Paginator } from './Paginator';
import { apiClient, featureSwitches, makeFetcher, userId, React, ReactDOM } from '@finds';
import { FetcherModule, Page, pageFetcher } from '@fetcher';

function renderContentAST(ast: any) {
    let colors: Record<string, string> = { hashtag: 'blue', mention: 'blue' };
    return (
        <span>
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
    console.log('oh img', image);
    return <img src={image.media_url_https} style={{ maxWidth: "100%", objectFit: "contain" }} />;
    // return React.createElement(wreq(110377).j, props);
}


// type Result = NonNullable<(typeof sample[0]['entries'])[number]['content']['itemContent']>['tweet_results']['result'];

function getAST(tweet: TweetLegacy) {
    console.log('get ast', tweet);
    return [{ text: tweet.full_text }];
    // return wreq(310452).ZP.tweetTextParts(tweet.full_text, tweet.display_text_range, tweet.entities);
}

function Tweet({ result }: { result: Tweet }) {
    console.log({ tweet: result });
    let tweet = "tweet" in result ? result.tweet as Tweet : result;
    let author = tweet.core.user_results.result;
    return (
        <div style={{ borderBottom: 'gray solid 1px', display: 'flex', gap: 4, padding: 4 }}>
            <img src={author.avatar.image_url} style={{ width: 32, height: 32, borderRadius: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>
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
}


export async function startAndInject() {
    let mod = await makeFetcher({
        apiClient,
        featureSwitches
    });
    let fetcher = pageFetcher({ mod, userId, pagesToKeep: 25, eachPause: 500, tenPause: 4000 });
    fetcher.start();
    ReactDOM.createRoot(document.querySelector('section')).render(React.createElement(App, { fetcher }));
}

function isTweetEntry(entry: Entry) {
    return !!entry.content.itemContent;
}

export function App({ fetcher }: { fetcher: FetcherModule }) {
    let pages = fetcher.useProgress();
    let [page, setPage] = React.useState(-1);
    let [pageContent, setPageContent] = React.useState<Page | null>(null);
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
            const content = await fetcher.getOrFetchPageNumber(page);
            setPageContent(content);
        }
        loadPage();
    }, [page]);

    return (
        <>
            <Paginator pageAmount={pages} onClickPage={(i) => setPage(i)} selectedPage={page} />
            {pageContent && (
                pageContent.entries.filter(isTweetEntry).map(entry => (
                    <Tweet
                        result={entry.content.itemContent?.tweet_results.result!}
                    />
                ))
            )}
        </>
    )
}

export default App
