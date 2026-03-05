let _mods: Record<any, any> = window.webpackChunk_twitter_responsive_web.push([[Symbol()],{},r=>r.c]);
window.webpackChunk_twitter_responsive_web.pop();
let wreq = i => Object.values(_mods).find((e: any) => e.id==i).exports;

function some(condition: (e: any) => any): any {
    for (let e of Object.values(_mods)) {
        try {
            for (let a of Object.values(e.exports)) {
                if (condition(a)) return a;
            }
        } catch {}
    }
}
/*
// Previously: wreq(180377).q
const compose = Object.values(_mods).find(e=>e.exports?.compose)?.exports?.compose ??
    some(a=>a.toString().includes(".length<1") && a.toString().includes("reduceRight"));
*/

// Previously: wreq(414742).ZP
const ApiClient = some(a => a?.prototype?.getUnversioned);
// Previously: wreq(875211).Z

const FeatureSwitchThing = some(a => a.toString().includes("this.getFeatureSwitch"));
// Previously: wreq(33055).Z

// export const makeFetcher = some(a => a.toString().includes("fetchUserTweets:function"));
export const makeFetcher = some(a => a.toString().includes("fetchUserTweets:"));

export const featureSwitches = new FeatureSwitchThing(()=>false);
export const apiClient = new ApiClient(featureSwitches);

const auth = some(a => a.toString().includes("auth_token&&"));

// const req = some(e => e.toString().includes("withCredentials,"));
const req = some(e => e.toString().includes("new XMLHttpRequest;let"));

// apiClient.client._dispatch = () => console.log(":3");
apiClient.client._dispatch = (data: any) => req({
    ...data,
    headers: {
        ...data.headers,
        ...Object.fromEntries(auth()),
        'x-twitter-auth-type': 'OAuth2Session'
    }
});


let scr = [...document.querySelectorAll<HTMLScriptElement>("body > script")].find(e => e.innerText.includes("INITIAL_STATE")).innerText;
let session = JSON.parse(scr.slice(scr.indexOf(`"session"`) + 10, scr.indexOf("userFeatures") - 2) + "}");
export const userId = session.user_id;

export const tweetTextParts = Object.values(_mods).find(e=>e.exports?.ZP?.tweetTextParts).exports.ZP.tweetTextParts ?? some(a=>a.toString().includes("tweetTextParts"));
export const React: typeof import("react") = Object.values(_mods).find(e=>e.exports?.useEffect).exports;
export const ReactDOM: typeof import("react-dom/client") = Object.values(_mods).find(e=>e.exports?.createPortal).exports;

// { key: any; linkify: true, part: part }
export const TextPart = some(e => e.type?.toString().includes(".MENTION?"));
export const TweetImage = wreq(73673).Z;