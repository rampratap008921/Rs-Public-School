/**
 * R.S. Public School ERP - Attendance History API Communication Layer
 * ES6 Module handling enterprise rest transactional pipelines architectures.
 */

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Validates responses payload wrappers and intercepts connectivity fault states
 * @param {Response} response - Native Fetch Response Object
 */
async function handleResponseEnvelope(response) {
    if (!response.ok) {
        let exceptionPayload = null;
        try { exceptionPayload = await response.json(); } catch(e) {}
        const errorContext = {
            status: response.status,
            message: exceptionPayload?.message || "Rest communications boundary constraint fault.",
            error: exceptionPayload?.error || true
        };
        throw errorContext;
    }
    return await response.json();
}

/**
 * Fetch a paginated, filtered selection matrix tracking students ledger records array.
 * @param {Object} filterCriteriaParameters - Object mapping filtering criteria options
 * @returns {Promise<Object>} Formatted response data payload mapping entries totals
 */
export async function getAttendance(filterCriteriaParameters = {}) {
    const URLQueryAdapter = new URLSearchParams();
    
    Object.entries(filterCriteriaParameters).forEach(([parameterKey, valueCoordinate]) => {
        if (valueCoordinate !== null && valueCoordinate !== undefined && valueCoordinate !== "") {
            URLQueryAdapter.append(parameterKey, String(valueCoordinate).trim());
        }
    });

    const executionUrlPath = `${API_BASE_URL}/attendance/history?${URLQueryAdapter.toString()}`;
    
    const fetchTransactionResult = await fetch(executionUrlPath, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    return handleResponseEnvelope(fetchTransactionResult);
}

/**
 * Push an inline validation change context payload to a target attendance ledger resource.
 * @param {number|string} recordId - Relational Database Record Identity Key index ID
 * @param {Object} updateDataValues - Object mapping target properties mutation fields
 * @returns {Promise<Object>} Server verification confirmation transaction transaction result
 */
export async function updateAttendance(recordId, updateDataValues = {}) {
    if (!recordId) throw { status: 400, message: "Missing required unique record index reference identification." };

    const executionUrlPath = `${API_BASE_URL}/attendance/${recordId}`;
    const fetchTransactionResult = await fetch(executionUrlPath, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            status: updateDataValues.status,
            remarks: updateDataValues.remarks
        })
    });
    return handleResponseEnvelope(fetchTransactionResult);
}

/**
 * Remove an item permanently from standard active operating viewports (Admin Only).
 * @param {number|string} recordId - Database row resource identity primary coordinate key
 * @returns {Promise<Object>} Execution deletion database cluster response confirmation receipt
 */
export async function deleteAttendance(recordId) {
    if (!recordId) throw { status: 400, message: "Missing required tracking deletion entity coordinate parameter." };

    const executionUrlPath = `${API_BASE_URL}/attendance/${recordId}`;
    const fetchTransactionResult = await fetch(executionUrlPath, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    return handleResponseEnvelope(fetchTransactionResult);
}

/**
 * Query parallel summary analytical ratios data cards metrics configurations.
 * @param {Object} queryParametersScope - Boundaries mapping criteria calculations targets
 * @returns {Promise<Object>} Compiled statistical aggregate dataset objects payload envelope
 */
export async function getAttendanceSummary(queryParametersScope = {}) {
    const URLQueryAdapter = new URLSearchParams();
    
    const extractionTargetsList = ["teacher_id", "attendance_date", "from_date", "to_date", "class_name", "section", "subject_name"];
    extractionTargetsList.forEach(keyField => {
        if (queryParametersScope[keyField]) {
            URLQueryAdapter.append(keyField, String(queryParametersScope[keyField]).trim());
        }
    });

    const executionUrlPath = `${API_BASE_URL}/attendance/report?${URLQueryAdapter.toString()}`;
    const fetchTransactionResult = await fetch(executionUrlPath, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    return handleResponseEnvelope(fetchTransactionResult);
}