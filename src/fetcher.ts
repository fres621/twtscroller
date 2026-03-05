import { React } from "@finds"
import type { Entry, FetchModResults } from "./types/api"

interface FetcherModuleOptions {
    mod: {
        fetchLikes: (_: any) => Promise<FetchModResults>;
    },
    userId: string;
    /** Amount of pages contents to keep */
    pagesToKeep: number;
    eachPause: number;
    tenPause: number;
    initialState?: Cursor[];
}

type Cursor = string | null;
export interface Page {
    entries: Entry[];
    cursor: Cursor;
}
type PageInfo = { id: string; label: string; };

export interface FetcherModule {
    /** Must be called to start fetching pages */
    start(): void;
    /** I guess */
    usePages(): PageInfo[];
    /** Get a page from it's cursor */
    getOrFetch(cursor: Cursor): Promise<Page>;
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function pageFetcher({ mod, userId, eachPause, tenPause, pagesToKeep, initialState }: FetcherModuleOptions): FetcherModule {
    let pagesCache: Page[] = [];
    /* We need to store cursors and pages separately  */
    const cursors: string[] = initialState || [];
    let listeners = new Set<(cursor: Cursor) => void>();

    /* NOT AI GENERATED DESPITE THE LONG DESCRIPTIVE NAME */
    async function fetchPageAndAddToCache(cursor: Cursor): Promise<Page> {
        let data = await mod.fetchLikes({ count: 20, userId, cursor });
        let entries = data.instructions[0].entries;
        let page = { cursor, entries }
        pagesCache.push(page);
        if (pagesCache.length > pagesToKeep) {
            pagesCache.shift();
        }
        return page;
    }

    async function start() {
        let lastCursor = null;
        let i = 0;
        if (initialState && cursors.length) {
            await fetchPageAndAddToCache(cursors[0]);
            for (let listener of listeners) {
                listener(cursors[0]);
            }
            i = cursors.length;
            let { entries } = await fetchPageAndAddToCache(cursors.at(-1));
            lastCursor = entries.find((e) => e.content.cursorType == 'Bottom')!.content.value;
        }
        while (true) {
            i++;
            let { entries, cursor } = await fetchPageAndAddToCache(lastCursor || null);
            /** < 3 means there's only cursors no content */
            if (entries.length < 3) break;
            // cursors.push({ id: cursor, label: `${cursors.length+1}` });
            cursors.push(cursor);
            localStorage.setItem("gaycache", JSON.stringify(cursors));
            lastCursor = entries.find((e) => e.content.cursorType == 'Bottom')!.content.value;
            for (let listener of listeners) {
                listener(cursor);
            }
            await sleep((i > 0 && i % 10 == 0) ? tenPause : eachPause);
        }
    }

    async function getOrFetch(cursor: Cursor): Promise<Page> {
        let page = pagesCache.find(page => page.cursor === cursor);
        if (page) return page;
        return await fetchPageAndAddToCache(cursor);
    }

    function usePages() {
        const [, forceUpdate] = React.useReducer(x => x + 1, 0);

        React.useEffect(() => {
            listeners.add(forceUpdate);
            return () => void listeners.delete(forceUpdate);
        }, []);

        return cursors.map((cursor, i) => ({
            id: cursor,
            label: `${i + 1}`,
        }));
    }

    /*
    function useProgress() {
        return React.useSyncExternalStore(
            (cb: any) => {
                listeners.add(cb);
                return () => listeners.delete(cb);
            },
            () => cursors.length
        );
    }
    */
    return { start, usePages, getOrFetch };
}
