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
}

type Cursor = string | null;
export interface Page {
    entries: Entry[];
    cursor: Cursor;
}

export interface FetcherModule {
    /** Must be called to start fetching pages */
    start(): void;
    /** Amount of pages fetched so far */
    useProgress(): number;
    /** Get a page from it's cursor */
    getOrFetch(cursor: Cursor): Promise<Page>;
    /** Get a page from it's number */
    getOrFetchPageNumber(pageNumber: number): Promise<Page>;
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function pageFetcher({ mod, userId, eachPause, tenPause, pagesToKeep }: FetcherModuleOptions): FetcherModule {
    let pagesCache: Page[] = [];
    /* We need to store cursors and pages separately  */
    const cursors = [];
    let listeners = new Set<(cursor: Cursor) => void>();

    /* NOT AI GENERATED DESPITE THE LONG DESCRIPTIVE NAME */
    async function fetchPageAndAddToCache(cursor: Cursor): Promise<Page> {
        let data = await mod.fetchLikes({ count: 20, userId, cursor });
        let entries = data.instructions[0].entries;

        pagesCache.push({ entries, cursor });
        if (pagesCache.length > pagesToKeep) {
            pagesCache.shift();
        }
        return { cursor, entries };
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

    async function getOrFetchPageNumber(pageN: number): Promise<Page> {
        return await getOrFetch(cursors[pageN]);
    }

    function useProgress() {
        return React.useSyncExternalStore(
            (cb: any) => {
                listeners.add(cb);
                return () => listeners.delete(cb);
            },
            () => cursors.length
        );
    }
    return { start, useProgress, getOrFetch, getOrFetchPageNumber };
}
