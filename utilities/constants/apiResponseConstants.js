const ApiResponseConstant = {
    /*Common Validation codes starts with 10**  */
    SUCCESS: "0000",
    PAGE_NOT_FOUND: 404,
    UNAUTHORIZED_ACCESS: 1000,
    ROLE_NOT_AUTHORIZED: 1001,
    CONTEXT_NOT_AUTHORIZED: 1002,
    INVALID_CREDENTIALS: 1003,
    NO_ENTRIES_FOUND: 1004,
    UNKNOWN_ERROR_OCCURRED: 1008,
    INVALID_JSON_REQUEST: 1009,
    INVALID_PASSWORD: 1007,
    INVALID_DATE_FORMAT: 1006,

    EMAIL_ALREADY_EXSIST: 1005,

    ROLE_NOT_EXIST: 1010,
    ROLE_ALREADY_EXIST: 1011,
    INVALID_USER_ROLE: 1012,

    VALIDATION_FAILED: 1051,
    MISSING_REQUIRED_PARAMETERS: 1052,
    INVALID_VALUES_IN_PARAMETERS: 1053,
    MAX_LENGTH_EXCEEDED: 1054,
    MIN_LENGTH_NOT_REACHED: 1055,

    INVALID_TOKEN: 1060,
    TOKEN_EXPIRED: 1061,
    MISSING_TOKEN: 1063,
    EMPTY_VALUE: 1062,
    EMPTY_FILES: 1073,
    EMPTY_FILE: 1074,
    INVALID_FILE_TYPE: 1070,
    UPLOAD_NOT_COMPLETE: 1071,
    UPLOAD_LIMIT_EXCEEDED: 1072,
    MAXIMUM_ALLOWED_FILE_FOR_UPLOAD: 1075,

    USER_NOT_EXIST: 2001,
    USER_ALREADY_EXIST: 2002,
    USER_SELF_BLOCK: 2003,
    USER_CLOSURE_NOT_EXSISTS: 2004,
    MAIL_REQUEST_FAILED: 2010,
    CANNOT_BLOCK_ADMIN: 2020,
    USER_NOT_ADMIN: 2030,
    USER_HAS_INVALID_DETAILS: 2040,//Invalid Details of user


    /* Employer Error Messages starts with 3*** */
    EMPLOYER_ALREADY_EXSIST: 3000,
    EMPLOYER_BLOCKED_ADMIN: 3100,
    EMPLOYER_DEACTIVATED_BY_ADMIN: 3101


};

module.exports = ApiResponseConstant;
