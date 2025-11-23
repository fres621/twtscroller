/** These types are generated from JSON with a LLM
 *  So this file sucks pls ignore it
 */

export interface FetchModResults { instructions: Instruction[] }

interface Instruction {
    type: string;
    entries: Entry[];
}

export interface Entry {
    entryId: string;
    sortIndex: string;
    content: Content;
}

interface Content {
    entryType: string;
    __typename: string;
    itemContent?: ItemContent;
    value?: string;
    cursorType?: string;
}

interface ItemContent {
    itemType: string;
    __typename: string;
    tweet_results: { result: Tweet };
    tweetDisplayType: string;
    socialContext?: SocialContext;
}

/* ─────────────────────────────────────────────
   Shared / Deduplicated Structures
────────────────────────────────────────────── */

interface ImageSize {
    h: number;
    w: number;
    resize: string;
}

interface Face {
    x: number;
    y: number;
    h: number;
    w: number;
}

interface Faces {
    faces: Face[];
}

interface MediaSizes {
    large: ImageSize;
    medium: ImageSize;
    small: ImageSize;
    thumb: ImageSize;
}

interface FeatureFaces {
    large: Faces;
    medium: Faces;
    small: Faces;
    orig: Faces;
}

interface FocusRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface OriginalInfo {
    height: number;
    width: number;
    focus_rects: FocusRect[];
}

interface MediaResults {
    result: {
        media_key: string;
    };
}

interface BaseMedia {
    display_url: string;
    expanded_url: string;
    id_str: string;
    indices: number[];
    media_key: string;
    media_url_https: string;
    type: string;
    url: string;

    ext_media_availability: { status: string };

    features?: FeatureFaces;
    sizes: MediaSizes;
    original_info: OriginalInfo;

    allow_download_status?: { allow_download: boolean };
    additional_media_info?: { monetizable: boolean };

    video_info?: VideoInfo;
    media_results: MediaResults;
}

interface VideoInfo {
    aspect_ratio: number[];
    duration_millis?: number;
    variants: Array<{
        bitrate?: number;
        content_type: string;
        url: string;
    }>;
}

interface UrlEntity {
    display_url: string;
    expanded_url: string;
    url: string;
    indices: number[];
}

/* ─────────────────────────────────────────────
   Tweet & User Objects
────────────────────────────────────────────── */

export interface Tweet {
    __typename: string;
    rest_id: string;
    core: { user_results: { result: User } };
    unmention_data: {};
    source: string;
    legacy: TweetLegacy;
    quoted_status_result?: { result: QuotedStatus };
}

export interface TweetLegacy {
    bookmark_count: number;
    bookmarked: boolean;
    created_at: string;
    conversation_id_str: string;
    display_text_range: number[];
    entities: TweetEntities;
    extended_entities?: { media: BaseMedia[] };
    favorite_count: number;
    favorited: boolean;
    full_text: string;
    is_quote_status: boolean;
    lang: string;
    possibly_sensitive?: boolean;
    possibly_sensitive_editable?: boolean;
    quote_count: number;
    reply_count: number;
    retweet_count: number;
    retweeted: boolean;
    user_id_str: string;
    id_str: string;

    in_reply_to_screen_name?: string;
    in_reply_to_status_id_str?: string;
    in_reply_to_user_id_str?: string;

    quoted_status_id_str?: string;
    quoted_status_permalink?: {
        url: string;
        expanded: string;
        display: string;
    };
}

interface TweetEntities {
    hashtags: { indices: number[]; text: string }[];
    media?: BaseMedia[];
    symbols: any[];
    timestamps: any[];
    urls: UrlEntity[];
    user_mentions: Array<{
        id_str: string;
        name: string;
        screen_name: string;
        indices: number[];
    }>;
}

interface User {
    __typename: string;
    id: string;
    rest_id: string;

    affiliates_highlighted_label: {};
    avatar: { image_url: string };
    core: { created_at: string; name: string; screen_name: string };
    dm_permissions: { can_dm: boolean };

    follow_request_sent: boolean;
    has_graduated_access: boolean;
    is_blue_verified: boolean;

    legacy: UserLegacy;

    location: { location: string };
    media_permissions: { can_media_tag: boolean };

    profile_image_shape: string;
    profile_bio: { description: string };

    privacy: { protected: boolean };
    relationship_perspectives: { following: boolean };
    verification: { verified: boolean };

    profile_description_language?: string;
    professional?: {
        rest_id: string;
        professional_type: string;
        category: Array<{
            id: number;
            name: string;
            icon_name: string;
        }>;
    };
}

interface UserLegacy {
    default_profile: boolean;
    default_profile_image: boolean;
    description: string;

    entities: {
        description: { urls: UrlEntity[] };
        url?: { urls: UrlEntity[] };
    };

    fast_followers_count: number;
    favourites_count: number;
    followers_count: number;
    friends_count: number;
    has_custom_timelines: boolean;
    is_translator: boolean;
    listed_count: number;
    media_count: number;
    normal_followers_count: number;

    pinned_tweet_ids_str: string[];

    possibly_sensitive: boolean;

    profile_banner_url: string;
    profile_interstitial_type: string;

    statuses_count: number;
    translator_type: string;

    url?: string;

    want_retweets: boolean;
    withheld_in_countries: any[];
}

/* ─────────────────────────────────────────────
   Quoted Status (Shares User & Tweet Structures)
────────────────────────────────────────────── */

interface QuotedStatus {
    __typename: string;
    rest_id: string;

    core: { user_results: { result: User } };
    unmention_data: {};
    source: string;
    legacy: TweetLegacy;
}

/* ─────────────────────────────────────────────
   Social Context
────────────────────────────────────────────── */

interface SocialContext {
    type: string;
    contextType: string;
    text: string;
    landingUrl: {
        url: string;
        urlType: string;
    };
}
