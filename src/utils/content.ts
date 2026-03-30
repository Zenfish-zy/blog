import { type CollectionEntry, getCollection } from "astro:content";

import { getCategorySegments, joinCategoryPath, normalizeCategory } from "@utils/category";
import { getCategoryUrl } from "@utils/url";
import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";


// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
    const allBlogPosts = await getCollection("posts", ({ data }) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    });

    const sorted = allBlogPosts.sort((a, b) => {
        // 首先按置顶状态排序，置顶文章在前
        if (a.data.pinned && !b.data.pinned) return -1;
        if (!a.data.pinned && b.data.pinned) return 1;

        // 如果置顶状态相同，则按发布日期排序
        const dateA = new Date(a.data.published);
        const dateB = new Date(b.data.published);
        return dateA > dateB ? -1 : 1;
    });
    return sorted;
}

export async function getSortedPosts() {
    const sorted = await getRawSortedPosts();

    for (let i = 1; i < sorted.length; i++) {
        sorted[i].data.nextSlug = sorted[i - 1].id;
        sorted[i].data.nextTitle = sorted[i - 1].data.title;
    }
    for (let i = 0; i < sorted.length - 1; i++) {
        sorted[i].data.prevSlug = sorted[i + 1].id;
        sorted[i].data.prevTitle = sorted[i + 1].data.title;
    }

    return sorted;
}
export type PostForList = {
    id: string;
    data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
    const sortedFullPosts = await getRawSortedPosts();

    // delete post.body
    const sortedPostsList = sortedFullPosts.map((post) => ({
        id: post.id,
        data: post.data,
    }));

    return sortedPostsList;
}
export type Tag = {
    name: string;
    count: number;
};

export async function getTagList(): Promise<Tag[]> {
    const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    });

    const countMap: { [key: string]: number } = {};
    allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
        post.data.tags.forEach((tag: string) => {
            if (!countMap[tag]) countMap[tag] = 0;
            countMap[tag]++;
        });
    });

    // sort tags
    const keys: string[] = Object.keys(countMap).sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
    name: string;
    fullPath: string;
    count: number;
    url: string;
    level: number;
};

export async function getCategoryList(): Promise<Category[]> {
    const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    });
    const count: { [key: string]: number } = {};
    let uncategorizedCount = 0;

    allBlogPosts.forEach((post: { data: { category: string | null } }) => {
        const categoryName = normalizeCategory(post.data.category);

        if (!categoryName) {
            uncategorizedCount++;
            return;
        }

        const segments = getCategorySegments(categoryName);
        segments.forEach((_, index) => {
            const path = joinCategoryPath(segments.slice(0, index + 1));
            count[path] = count[path] ? count[path] + 1 : 1;
        });
    });

    const lst = Object.keys(count).sort((a, b) => {
        const segmentsA = getCategorySegments(a);
        const segmentsB = getCategorySegments(b);
        const minLength = Math.min(segmentsA.length, segmentsB.length);

        for (let index = 0; index < minLength; index++) {
            const diff = segmentsA[index].localeCompare(segmentsB[index], undefined, { sensitivity: "base" });
            if (diff !== 0) {
                return diff;
            }
        }

        return segmentsA.length - segmentsB.length;
    });

    const ret: Category[] = [];
    for (const c of lst) {
        const segments = getCategorySegments(c);

        ret.push({
            name: segments[segments.length - 1],
            fullPath: c,
            count: count[c],
            url: getCategoryUrl(c),
            level: segments.length - 1,
        });
    }

    if (uncategorizedCount > 0) {
        const uncategorizedName = i18n(I18nKey.uncategorized);
        ret.push({
            name: uncategorizedName,
            fullPath: "",
            count: uncategorizedCount,
            url: getCategoryUrl(null),
            level: 0,
        });
    }

    return ret;
}
