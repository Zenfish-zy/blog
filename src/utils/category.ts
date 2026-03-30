export const CATEGORY_SEPARATOR = "/";

function normalizeCategorySegments(segments: string[]): string[] {
    return segments.map((segment) => segment.trim()).filter(Boolean);
}

export function joinCategoryPath(segments: string[]): string {
    return normalizeCategorySegments(segments).join(CATEGORY_SEPARATOR);
}

export function normalizeCategory(category: string | string[] | null | undefined): string {
    if (Array.isArray(category)) {
        return joinCategoryPath(category);
    }

    if (!category) {
        return "";
    }

    return joinCategoryPath(category.split(CATEGORY_SEPARATOR));
}

export function getCategorySegments(category: string | string[] | null | undefined): string[] {
    const normalizedCategory = normalizeCategory(category);

    if (!normalizedCategory) {
        return [];
    }

    return normalizedCategory.split(CATEGORY_SEPARATOR);
}

export function getCategoryBreadcrumbs(category: string | string[] | null | undefined) {
    const segments = getCategorySegments(category);

    return segments.map((name, index) => ({
        name,
        path: joinCategoryPath(segments.slice(0, index + 1)),
        level: index,
    }));
}

export function formatCategory(category: string | string[] | null | undefined): string {
    const segments = getCategorySegments(category);

    if (segments.length === 0) {
        return "";
    }

    return segments.join(" / ");
}

export function categoryMatchesFilter(
    category: string | string[] | null | undefined,
    filterCategory: string | string[] | null | undefined,
): boolean {
    const normalizedCategory = normalizeCategory(category);
    const normalizedFilter = normalizeCategory(filterCategory);

    if (!normalizedCategory || !normalizedFilter) {
        return false;
    }

    return (
        normalizedCategory === normalizedFilter ||
        normalizedCategory.startsWith(`${normalizedFilter}${CATEGORY_SEPARATOR}`)
    );
}
