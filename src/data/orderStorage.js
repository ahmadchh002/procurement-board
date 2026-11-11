import { INITIAL_ORDERS } from './orders';
import { STAGES } from '../utils/constants';

const STORAGE_KEY = 'procurement-board-orders-v1';
const STAGE_IDS = new Set(STAGES.map((stage) => stage.id));
const INITIAL_ORDER_IDS = new Set(INITIAL_ORDERS.map((order) => order.id));

function isValidOrder(order) {
    return order &&
        typeof order === 'object' &&
        /^PR-\d+$/.test(order.id) &&
        typeof order.title === 'string' &&
        typeof order.vendor === 'string' &&
        Number.isFinite(order.amount) &&
        typeof order.date === 'string' &&
        STAGE_IDS.has(order.stage) &&
        Array.isArray(order.tags) &&
        order.tags.every((tag) => typeof tag === 'string') &&
        typeof order.directorSigned === 'boolean' &&
        order.breakdown &&
        ['base', 'shipping', 'tax'].every((key) => Number.isFinite(order.breakdown[key])) &&
        Array.isArray(order.quotes) &&
        order.quotes.every((quote) => (
            quote &&
            typeof quote.vendor === 'string' &&
            Number.isFinite(quote.amount) &&
            typeof quote.lead === 'string'
        ));
}

function mergeWithInitialOrders(savedOrders) {
    if (!Array.isArray(savedOrders) || !savedOrders.every(isValidOrder)) {
        throw new Error('Stored procurement requests have an invalid format.');
    }

    const savedById = new Map(savedOrders.map((order) => [order.id, order]));
    if (savedById.size !== savedOrders.length) {
        throw new Error('Stored procurement requests contain duplicate IDs.');
    }

    const orders = INITIAL_ORDERS.map((order) => savedById.get(order.id) ? ? order);
    for (const order of savedOrders) {
        if (!INITIAL_ORDER_IDS.has(order.id)) orders.push(order);
    }
    return orders;
}

export function loadPersistedOrders() {
    try {
        const savedValue = window.localStorage.getItem(STORAGE_KEY);
        if (!savedValue) return { orders: INITIAL_ORDERS, error: null };

        const savedData = JSON.parse(savedValue);

        if (
            savedData ? .version === 1 &&
            Array.isArray(savedData.added) &&
            Array.isArray(savedData.updated)
        ) {
            if (!savedData.added.every(isValidOrder) ||
                !savedData.updated.every(isValidOrder) ||
                savedData.added.some((order) => INITIAL_ORDER_IDS.has(order.id)) ||
                savedData.updated.some((order) => !INITIAL_ORDER_IDS.has(order.id))
            ) {
                throw new Error('Legacy saved procurement requests have an invalid format.');
            }

            const updatedById = new Map(savedData.updated.map((order) => [order.id, order]));
            const legacyOrders = INITIAL_ORDERS.map((order) => updatedById.get(order.id) ? ? order);
            legacyOrders.push(...savedData.added);
            return { orders: mergeWithInitialOrders(legacyOrders), error: null };
        }

        return { orders: mergeWithInitialOrders(savedData), error: null };
    } catch (error) {
        console.error('Unable to load saved procurement requests from localStorage.', error);
        return {
            orders: INITIAL_ORDERS,
            error: 'Saved requests could not be loaded. The board is showing its sample data.',
        };
    }
}

export function savePersistedOrders(orders) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        return null;
    } catch (error) {
        console.error('Unable to save procurement requests to localStorage.', error);
        return 'Could not save changes in this browser. Check local storage availability.';
    }
}