

let initialState = {
    courses: null,
    tasks: null,
    selectedCourse: null,
    selectedTask: null,
    batches: null,
    selectedBatch: null,
    scheduled_tasks: null
}

const common = (state = initialState, action = {}) => {
    switch (action.type) {
        case 'ALL_COURSE_DATA':
            return {
                ...state,
                courses: action.data
            }
        case 'SELECTED_COURSE':
            return {
                ...state,
                selectedCourse: action.data
            }
        case 'ALL_TASKS_DATA':
            return {
                ...state,
                tasks: action.data
            }
        case 'SELECTED_TASK':
            return {
                ...state,
                selectedTask: action.data
            }
        case 'ALL_BATCH_DATA':
            return {
                ...state,
                batches: action.data
            }
        case 'SELECTED_BATCH':
            return {
                ...state,
                selectedBatch: action.data
            }
        case 'SCHEDULED_TASKS':
            return {
                ...state,
                scheduled_tasks: action.data
            }
        case 'CLEAR_SCHEDULED_TASKS':
            return {
                ...state,
                scheduled_tasks: null
            }
        case 'LOGOUT':
            return {
                ...state,
                initialState
            }
        default:
            return state;
    }
}

export default common;