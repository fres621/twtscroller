let _mods: Record<any, any> = window.webpackChunk_twitter_responsive_web.push([[Symbol()],{},(r: any)=>r.c]);
window.webpackChunk_twitter_responsive_web.pop();
let wreq = (i: number) => Object.values(_mods).find((e: any) => e.id==i).exports;

function some(condition: (e: any) => any): any {
    for (let e of Object.values(_mods)) {
        try {
            for (let a of Object.values(e.exports)) {
                if (condition(a)) return a;
            }
        } catch {}
    }
}

const Client = some(e => e.toString().includes("{get api(){return"));
const client = new Client({});
export const makeFetcher = some(a => a.toString().includes("fetchUserTweets:"));

export const { apiClient, featureSwitches } = client.api;

let scr = [...document.querySelectorAll<HTMLScriptElement>("body > script")].find(e => e.innerText.includes("INITIAL_STATE"))!.innerText;
let session = JSON.parse(scr.slice(scr.indexOf(`"session"`) + 10, scr.indexOf("userFeatures") - 2) + "}");
export const userId = session.user_id;

export const tweetTextParts = some(e=>e?.tweetTextParts)?.tweetTextParts || some(e => e?.toString()?.includes("tweetTextParts:"));
export const React: typeof import("react") = Object.values(_mods).find(e=>e.exports?.useEffect).exports;
// export const ReactDOM: typeof import("react-dom/client") = Object.values(_mods).find(e=>e.exports?.createPortal).exports;

// { key: any; linkify: true, part: part }
export const TextPart = some(e => e.type?.toString().includes(".MENTION?"));
// export const TweetImage = wreq(73673).Z;
export const TweetImage = some(e => e?.prototype?._renderImage);

export const SectionComponent = some(e => e.prototype?.render?.toString().includes("id:this._listDomId,"));
