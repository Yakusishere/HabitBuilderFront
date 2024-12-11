import instance from "@/utils/request.js"

export function eventListService(bo) {
    return instance.post('/event/list', bo);
}

export function editEventService(event) {
    return instance.post('/event/edit', event);
}