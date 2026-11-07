/**
 * Elements in `a` that are not in `b`.
 * @example setDifference(new Set([1,2,3]), new Set([2,3,4])) // Set {1}
 */
export function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
    const result = new Set<T>();
    for (const item of a) {
        if (!b.has(item)) {
            result.add(item);
        }
    }
    return result;
}

/**
 * All elements from both `a` and `b`.
 * @example setUnion(new Set([1,2]), new Set([2,3])) // Set {1,2,3}
 */
export function setUnion<T>(a: Set<T>, b: Set<T>): Set<T> {
    const result = new Set<T>(a);
    for (const item of b) {
        result.add(item);
    }
    return result;
}

/**
 * Elements present in both `a` and `b`.
 * @example setIntersection(new Set([1,2,3]), new Set([2,3,4])) // Set {2,3}
 */
export function setIntersection<T>(a: Set<T>, b: Set<T>): Set<T> {
    const result = new Set<T>();
    for (const item of a) {
        if (b.has(item)) {
            result.add(item);
        }
    }
    return result;
}

/**
 * Elements in `a` or `b` but not both.
 * @example setSymmetricDifference(new Set([1,2,3]), new Set([2,3,4])) // Set {1,4}
 */
export function setSymmetricDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
    const result = new Set<T>();
    for (const item of a) {
        if (!b.has(item)) {
            result.add(item);
        }
    }
    for (const item of b) {
        if (!a.has(item)) {
            result.add(item);
        }
    }
    return result;
}

/**
 * True if every element of `a` is in `b`.
 * @example isSubset(new Set([1,2]), new Set([1,2,3])) // true
 */
export function isSubset<T>(a: Set<T>, b: Set<T>): boolean {
    for (const item of a) {
        if (!b.has(item)) {
            return false;
        }
    }
    return true;
}

/**
 * True if `a` contains every element of `b`.
 * @example isSuperset(new Set([1,2,3]), new Set([1,2])) // true
 */
export function isSuperset<T>(a: Set<T>, b: Set<T>): boolean {
    return isSubset(b, a);
}

/**
 * True if `a` and `b` share no elements.
 * @example isDisjoint(new Set([1,2]), new Set([3,4])) // true
 */
export function isDisjoint<T>(a: Set<T>, b: Set<T>): boolean {
    for (const item of a) {
        if (b.has(item)) {
            return false;
        }
    }
    return true;
}

/**
 * True if `a` and `b` contain exactly the same elements.
 * @example areSetsEqual(new Set([1,2,3]), new Set([3,1,2])) // true
 */
export function areSetsEqual<T>(a: Set<T>, b: Set<T>): boolean {
    if (a.size !== b.size) {
        return false;
    }
    return isSubset(a, b);
}
